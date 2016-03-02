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

.constant( "DroneAPIRoot", "<< apiroot >>" )
.constant( "DroneAPIToken", "<< token >>" )

.controller( "Config", require( "./controllers/config" ) );

angular.module( "App" ).requires.push( "Config" );
