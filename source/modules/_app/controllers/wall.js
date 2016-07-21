"use strict";

module.exports = [
    "$rootScope", "$timeout", "$interval", "$filter", "$q", "toastr", "DroneAPI", "Repos", "Builds", "Developers",

    function ( $rootScope, $timeout, $interval, $filter, $q, toastr, DroneAPI, Repos, Builds, Developers )
    {
        var ctrl = this;

        Repos.resetRepos();
        Builds.resetBuilds();
        Developers.resetDevelopers();

        ctrl.repos        = Repos.getRepos();
        ctrl.builds       = Builds.getBuilds();
        ctrl.developers   = Developers.getDevelopers();
        ctrl.workingRepos = [];

        ctrl.maxRepos   = 8;
        ctrl.maxBuilds  = 5;
        ctrl.maxLeaders = 4;

        ctrl.now     = moment();
        var pollTime = moment( "1990-01-01", "YYYY-MM-DD" );

        var resetGlobalTotals = function ()
        {
            ctrl.buildCount   = 0;
            ctrl.successCount = 0;
            ctrl.failureCount = 0;
            ctrl.pullCount    = 0;
        };
        resetGlobalTotals();

        var processStatus = function ()
        {
            ctrl.now = moment();

            // Reset all totals on Mondays at 4am
            if( ctrl.now.day() === 1 && ctrl.now.hour() === 4 && ctrl.now.minute() === 0 )
            {
                Developers.resetTotals();
                resetGlobalTotals();
            }

            // Reset fail counter daily at 4am
            if( ctrl.now.hour() === 4 && ctrl.now.minute() === 0 )
            {
                ctrl.failDate = null;
            }

            // Grab updated build info
            if( !ctrl.updating )
            {
                ctrl.updating = true;

                DroneAPI.getLatest().then( function ( response )
                {
                    var builds = response.data;

                    if( angular.isArray( builds ) )
                    {
                        // Store the time of the most recent state change
                        builds = builds.map( function ( build )
                        {
                            build.updatedAt = Math.max(
                                build.createdAt  || 0,
                                build.enqueuedAt || 0,
                                build.startedAt  || 0,
                                build.finishedAt || 0
                            );

                            return build;
                        } );

                        // Process oldest record first, so newer ones cascade
                        builds = $filter( "orderBy" )( builds, "updatedAt" );

                        // Record when builds started to be monitored
                        ctrl.watchTime = ctrl.watchTime || builds[ 0 ].updatedAt * 1000;

                        // Only keep builds that have changed since the last poll
                        builds = $filter( "filter" )( builds, function ( build )
                        {
                            if( pollTime.diff( build.updatedAt * 1000 ) < 0 )
                            {
                                pollTime = moment( build.updatedAt * 1000 );
                                return true;
                            }

                            return false;
                        } );

                        var deferred  = $q.defer();
                        var postParse = function ()
                        {
                            Repos.expirePulls();  // TODO: Hit the GitHub API to remove closed pulls instead
                            ctrl.updating = false;
                            var i;

                            // Scroll the list of repositories when it's long enough
                            if( ctrl.displayRepos && ctrl.displayRepos.length > ctrl.maxRepos )
                            {
                                $rootScope.$broadcast( "scrollRepos" );

                                // Remove/add items from/to the list after scroll animation
                                $timeout( function ()
                                {
                                    ctrl.displayRepos.shift();

                                    // Let template register shift before push, so it processes it as the addition
                                    // of a new element rather than just a repositioning of an existing one
                                    $timeout( function ()
                                    {
                                        // Repopulate the working array if empty
                                        if( !ctrl.workingRepos.length )
                                        {
                                            ctrl.workingRepos = ctrl.workingRepos.concat(
                                                                      $filter( "orderBy" )( ctrl.repos, "name" ) );
                                        }

                                        // Append the next repo to the list
                                        ctrl.displayRepos.push( ctrl.workingRepos.shift() );

                                        // Set flags for ordering before animations get a chance to mess them up
                                        for( i = 0; i < ctrl.displayRepos.length; i++ )
                                        {
                                            ctrl.displayRepos[ i ].order = i;
                                        }

                                    }, 0 );

                                }, 2000 );
                            }
                            else
                            {
                                ctrl.workingRepos = $filter( "orderBy" )( [].concat( ctrl.repos ), "name" );
                                ctrl.displayRepos = $filter( "orderBy" )( [].concat( ctrl.repos ), "name" );

                                // Set flags for ordering before animations get a chance to mess them up
                                for( i = 0; i < ctrl.displayRepos.length; i++ )
                                {
                                    ctrl.displayRepos[ i ].order = i;
                                }
                            }
                        };

                        if( builds.length > 0 )
                        {
                            var counter = 0;

                            // Convoluted loop that only loops once promises resolve
                            var parser = function ( thisBuild )
                            {
                                counter++;

                                Developers.parseBuild( thisBuild ).then( function ( currentDeveloper )
                                {
                                    Builds.parseBuild( thisBuild, currentDeveloper );
                                    Repos.parseBuild( thisBuild, currentDeveloper );

                                    if( counter < builds.length )
                                    {
                                        parser( builds[ counter ] );
                                    }
                                    else
                                    {
                                        deferred.resolve();
                                    }

                                } );

                                return deferred.promise;

                            };

                            parser( builds[ counter ] ).then( postParse );
                        }
                        else
                        {
                            postParse();
                        }

                    }
                    else
                    {
                        toastr.error( "Malformed Drone response. <a href='#/config'><i class='fa fa-cog'></i></a>" );
                        ctrl.updating = false;
                    }

                }, function ( response )
                {
                    if( response.status === 401 )
                    {
                        toastr.error(
                            "Drone authorization failed. <a href='#/config'><i class='fa fa-cog'></i></a>" );
                    }
                    else
                    {
                        toastr.error(
                            "Could not retrieve Drone status. <a href='#/config'><i class='fa fa-cog'></i></a>" );
                    }

                    ctrl.updating = false;

                } );

            }

        };

        processStatus();
        var loop = $interval( processStatus, 5000 );

        // Stop polling loop when navigating to config
        $rootScope.$on( "$routeChangeStart", function ( current, next )
        {
            if( next.$$route.originalPath === "/config" )
            {
                $interval.cancel( loop );
            }
        } );

        // Update running totals

        $rootScope.$on( "newBuild",     () => ctrl.buildCount++ );
        $rootScope.$on( "newPull",      () => ctrl.pullCount++ );
        $rootScope.$on( "buildSuccess", () => ctrl.successCount++ );
        $rootScope.$on( "buildFailure", ( event, failedBuild ) =>
        {
            ctrl.failureCount++;
            ctrl.failDate = failedBuild.updatedAt * 1000;
        } );

    }

];
