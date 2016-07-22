"use strict";

module.exports = [

    function ()
    {
        var settings = {

            theme:     "<< theme >>",
            apiRoot:   "<< apiroot >>",
            token:     "<< token >>",
            prTimeout: parseInt( "<< prtimeout >>", 10 ),

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
