/* App Configuration */

angular.module( "wall", [
    "ngRoute",
    "ngAnimate",
    "wall.filters",
    "wall.services",
    "wall.directives",
    "wall.controllers"
] )

.config( [ "$routeProvider", "$locationProvider", "$sceDelegateProvider", "$interpolateProvider",

    function ( $routeProvider, $locationProvider, $sceDelegateProvider, $interpolateProvider )
    {
        "use strict";

        $routeProvider.when( "/", { templateUrl: STATIC_PATH + "templates/wall.html", controller: "Wall" } );
        $routeProvider.otherwise( { redirectTo: "/" } );

        $locationProvider.html5Mode( true ).hashPrefix( "!" );

        $interpolateProvider.startSymbol( "[[" );
        $interpolateProvider.endSymbol( "]]");

    }

] );
