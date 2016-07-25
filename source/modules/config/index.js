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

.factory( "Settings", require( "./services/settings" ) )

.constant( "Defaults", {
    apiRoot:    "<< apiroot >>",
    token:      "<< token >>",
    include:    "<< include >>",
    exclude:    "<< exclude >>",
    mainBranch: "<< mainbranch >>",
    prTimeout:  parseInt( "<< prtimeout >>", 10 ),
    prMax:      parseInt( "<< prmax >>", 10 ),
    orgName:    "<< orgname >>",
    theme:      "<< theme >>"
} );

angular.module( "App" ).requires.push( "Config" );
