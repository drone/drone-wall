"use strict";

module.exports = [

    function ()
    {
        var settings = {

            theme:   "<< theme >>",
            apiRoot: "<< apiroot >>",
            token:   "<< token >>",

            load: function ()
            {
                angular.extend( settings, angular.fromJson( localStorage.getItem( "settings" ) ) );
            },

            save: function ()
            {
                localStorage.setItem( "settings", angular.toJson( settings ) );
            }

        };

        return settings;

    }

];
