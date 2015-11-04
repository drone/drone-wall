"use strict";

var express = require( "express" );
var http    = require( "http" );
var https   = require( "https" );
var app     = express();

app.use( express.static( __dirname ) );
app.set( "view engine", "ejs" );
app.set( "views", __dirname );

var serveIndex = function ( req, res, next )
{
    res.render( "index", {
        STATIC_PATH: process.env.STATIC_PATH || "/"
    } );
};

var serveFeed = function ( req, res, next )
{
    var apiScheme = process.env.API_SCHEME || "https";
    var apiDomain = process.env.API_DOMAIN || "";
    var apiPort   = process.env.API_PORT || (apiScheme == "https" ? 443 : 80);
    var apiToken  = process.env.API_TOKEN  || "";

    var path   = "/api/user/activity?access_token=" + apiToken;
    var client = apiScheme == "https" ? https : http;

    var req = client.get(
    {
        "host": apiDomain,
        "port": apiPort,
        "path": path

    }, function( result )
    {
        var body = "";

        result.on( "data", function( chunk )
        {
            body += chunk;

        } ).on( "end", function( )
        {
            var feed = JSON.parse(body);
            res.send(feed);

        } );
    } );

    req.on( "error", function( e )
    {
        console.log( "ERROR: " + e.message );
    } );
};

app.route( "/api/feed" ).get( serveFeed );
app.route( "*" ).get( serveIndex );

http.createServer( app ).listen( process.env.WALL_PORT || 3000 );
