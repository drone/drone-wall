/* Controllers */

angular.module( "wall.controllers", [] )

.controller( "Wall", [ "$scope", "$rootScope", "$timeout", "$interval", "$filter", "DroneStatus", "Repos", "Builds", "Developers",

    function ( $scope, $rootScope, $timeout, $interval, $filter, DroneStatus, Repos, Builds, Developers )
    {
        "use strict";

        // TODO: read from localstorage if available, decide which bits are old and should be discarded

        $rootScope.theme          = "light";
        $rootScope.gravatarPrefix = ( window.location.protocol === "https:" ? "https://secure.gravatar.com"
                                                                            : "http://www.gravatar.com" ) + "/avatar/";

        $scope.repos        = Repos.getRepos();
        $scope.builds       = Builds.getBuilds();
        $scope.developers   = Developers.getDevelopers();
        $scope.workingRepos = [];

        $scope.maxRepos   = 8;
        $scope.maxBuilds  = 5;
        $scope.maxLeaders = 4;

        $scope.now = moment();
        var pollTime = null;

        $scope.toggleTheme = function ( theme )
        {
            $rootScope.theme = theme;
        };

        var resetGlobalTotals = function ()
        {
            $scope.buildCount   = 0;
            $scope.successCount = 0;
            $scope.failureCount = 0;
            $scope.pullCount    = 0;
        };
        resetGlobalTotals();

        var processStatus = function ()
        {
            $scope.now = moment();

            // Reset all totals on Mondays at 4am
            if( $scope.now.day() === 1 && $scope.now.hour() === 4 && $scope.now.minute() === 0 )
            {
                Developers.resetTotals();
                resetGlobalTotals();
                $scope.failDate = null;
            }

            // Grab updated build info
            if( !$scope.updating )
            {
                $scope.updating = true;

                DroneStatus.getLatest().success( function ( builds )
                {
                    if( angular.isArray( builds ) )
                    {
                        // Process oldest record first, so newer ones cascade
                        builds = $filter( "orderBy" )( builds, "updated_at" );

                        // Record when builds started to be monitored
                        $scope.watchTime = $scope.watchTime || builds[0].updated_at * 1000;

                        if( pollTime )
                        {
                            // Only keep builds that have changed since the last poll
                            builds = $filter( "filter" )( builds, function ( build )
                            {
                                return pollTime.diff( build.updated_at ) < 0;
                            } );
                        }

                        if( builds.length > 0 )
                        {
                            // Store the most recent activity as a marker
                            pollTime = moment( builds[ builds.length - 1 ].updated_at );
                        }

                        for( var i = 0; i < builds.length; i++ )
                        {
                            // TODO: Save these three services in local storage, to restore after a hard refresh

                            Repos.parseBuild( builds[ i ] );
                            Builds.parseBuild( builds[ i ] );
                            Developers.parseBuild( builds[ i ] );
                        }

                        Repos.expirePulls();  // TODO: Hit the GitHub API to remove closed pulls instead
                        $scope.updating = false;

                        // Scroll the list of repositories when it's long enough
                        if( $scope.displayRepos && $scope.displayRepos.length > $scope.maxRepos )
                        {
                            $scope.$broadcast( "scrollRepos" );

                            // Remove/add items from/to the list after scroll animation
                            $timeout( function ()
                            {
                                $scope.displayRepos.shift();

                                // Let template register shift before push, so it processes it as the addition
                                // of a new element rather than just a repositioning of an existing one
                                $timeout( function ()
                                {
                                    // Repopulate the working array if empty
                                    if( !$scope.workingRepos.length )
                                    {
                                        $scope.workingRepos = $scope.workingRepos.concat(
                                                                  $filter( "orderBy" )( $scope.repos, "name" ) );
                                    }

                                    // Append the next repo to the list
                                    $scope.displayRepos.push( $scope.workingRepos.shift() );

                                }, 0 );

                            }, 2000 );
                        }
                        else
                        {
                            $scope.workingRepos = $filter( "orderBy" )( [].concat( $scope.repos ), "name" );
                            $scope.displayRepos = $filter( "orderBy" )( [].concat( $scope.repos ), "name" );
                        }
                    }
                    else
                    {
                        console.error( "Malformed Drone response." );
                        $scope.updating = false;
                    }

                } ).error( function ()
                {
                    console.error( "Could not retrieve Drone status." );
                    $scope.updating = false;

                } );
            }

        };

        processStatus();
        $interval( processStatus, 5000 );

        // Update running totals

        $rootScope.$on( "newBuild", function ()
        {
            $scope.buildCount++;
        } );

        $rootScope.$on( "newPull", function ()
        {
            $scope.pullCount++;
        } );

        $rootScope.$on( "buildSuccess", function ()
        {
            $scope.successCount++;
        } );

        $rootScope.$on( "buildFailure", function ( event, failedBuild )
        {
            $scope.failureCount++;
            $scope.failDate = failedBuild.updated_at * 1000;
        } );

    }

] );
