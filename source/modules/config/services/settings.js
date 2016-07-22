"use strict";

module.exports = [ "Defaults",

    function ( Defaults )
    {
        var settings = {

            load: function ()
            {
                angular.extend( settings, Defaults, angular.fromJson( localStorage.getItem( "settings" ) ) );
            },

            save: function ()
            {
                localStorage.setItem( "settings", angular.toJson( settings ) );
            }

        };

        return settings;

    }

];
