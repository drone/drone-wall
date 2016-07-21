"use strict";

angular.module( "App", [
    "ngRoute",
    "ngAnimate",
    "ngMessages",
    "toastr",
    "vokal.API"
] )

.config( [ "$routeProvider", "$sceDelegateProvider", "toastrConfig",

    function ( $routeProvider, $sceDelegateProvider, toastrConfig )
    {
        angular.extend( toastrConfig, {
            timeOut: 4000,
            positionClass: "toast-top-full-width",
            allowHtml: true
        } );

        $routeProvider
            .when( "/", {
                templateUrl: "modules/_app/templates/wall.html",
                controller: "Wall",
                controllerAs: "wall",
                data: {
                    meta: {
                        title: "Drone Wall",
                        description: "Drone status"
                    }
                },
                resolve: {
                    config: [ "$q", "$location", "DroneAPI", function ( $q, $location, DroneAPI )
                    {
                        var deferred = $q.defer();

                        if( DroneAPI.rootPath === "/" || DroneAPI.getKey() === "" )
                        {
                            deferred.reject();
                            $location.path( "/config" );
                        }
                        else
                        {
                            deferred.resolve();
                        }

                        return deferred.promise;
                    } ]
                }
            } )
            .otherwise( { redirectTo: "/" } );

        $sceDelegateProvider.resourceUrlWhitelist( [ "self", "https://*.githubusercontent.com/**" ] );
    }

] )

.controller( "Site", require( "./controllers/site" ) )
.controller( "Wall", require( "./controllers/wall" ) )

.factory( "DroneAPI",   require( "./services/droneAPI" ) )
.factory( "Repos",      require( "./services/repos" ) )
.factory( "Builds",     require( "./services/builds" ) )
.factory( "Developers", require( "./services/developers" ) )

.directive( "scrollRepo", require( "./directives/scrollRepo" ) )
.directive( "iteratePop", require( "./directives/iteratePop" ) )

.filter( "moment",   require( "./filters/moment" ) )
.filter( "from",     require( "./filters/from" ) )
.filter( "duration", require( "./filters/duration" ) );
