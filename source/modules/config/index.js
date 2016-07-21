"use strict";

angular.module( "Config", [] )

.config( [ "$routeProvider",

    function ( $routeProvider )
    {
        $routeProvider
            .when( "/config", {
                templateUrl: "modules/config/templates/config.html",
                controller: "Config",
                controllerAs: "config",
                data: {
                    meta: {
                        title: "Drone Wall: Config",
                        description: "Drone wall config"
                    }
                }
            } );
    }

] )

.run( [ "Settings",

    function ( Settings )
    {
        Settings.load();
    }

] )

.controller( "Config", require( "./controllers/config" ) )

.factory( "Settings", require( "./services/settings" ) );

angular.module( "App" ).requires.push( "Config" );
