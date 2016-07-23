"use strict";

module.exports = function ( grunt )
{
    var path   = require( "path" );
    var env    = grunt.option( "env" ) || "local";
    var envObj = grunt.file.readJSON( "env.json" )[ env ];

    envObj.apiroot   = grunt.option( "apiroot" )   || envObj.apiroot;
    envObj.token     = grunt.option( "token" )     || envObj.token;
    envObj.theme     = grunt.option( "theme" )     || envObj.theme;
    envObj.prtimeout = grunt.option( "prtimeout" ) || envObj.prtimeout;
    envObj.prmax     = grunt.option( "prmax" )     || envObj.prmax;

    grunt.initConfig( {
        env: envObj,
        envName: env,
        version: grunt.option( "gitver" ) || Date.now() // for deployment
    } );

    require( "load-grunt-config" )( grunt, {
        configPath: path.join( process.cwd(), "node_modules", "dominatr-grunt", "grunt" ),
        overridePath: path.join( process.cwd(), "grunt" ),
        mergeFunction: function ( obj, ext )
        {
            return require( "config-extend" )( obj, ext );
        }
    } );
};
