/* Services */

angular.module( "wall.services", [] )

.factory( "DroneStatus", [ "$http",

    function ( $http )
    {
        "use strict";

        return { getLatest: function ()
        {
            return $http.get( "api/feed" );

        } };
    }

] )

.factory( "Repos", [ "$rootScope",

    function ( $rootScope )
    {
        "use strict";

        var repos = [];

        var parseBuild = function ( build )
        {
            build.slug      = build.owner + "/" + build.name;

            var checkMerge  = build.message.match( /Merge pull request #([0-9]+)/i );
            var currentRepo = findRepo( build.slug ) || addRepo( build );
            var currentPull = null;

            if( build.pull_request )
            {
                var pullIndex = findPullIndex( currentRepo.pulls, build.pull_request );

                if( pullIndex !== null )
                {
                    // Update existing pull request
                    currentPull            = currentRepo.pulls[ pullIndex ];

                    // Toggle status if this is the first fresh build coming in
                    currentPull.status     = ( currentPull.buildCount === 0 && build.status == "Started" ) ?
                                             build.status : currentPull.status;

                    // Increment or decrement build count, don't let it go below zero (possible during first load)
                    currentPull.buildCount = currentPull.buildCount + ( build.status == "Started" ? 1 : -1 );
                    currentPull.buildCount = currentPull.buildCount < 0 ? 0 : currentPull.buildCount;

                    // Update status if all active builds have completed
                    currentPull.status     = currentPull.buildCount > 0 ? currentPull.status : build.status;

                    // Always update the updated time
                    currentPull.updated_at = build.updated_at;
                }
                else
                {
                    // Add a new pull request
                    var newPull = angular.extend( {}, build,
                        { merging: false, buildCount: ( build.status == "Started" ? 1 : 0 ) } );
                    currentPull = newPull;
                    currentRepo.pulls.push( newPull );
                    $rootScope.$broadcast( "newPull", newPull );
                }
            }
            else
            {
                if( checkMerge )
                {
                    var pullIndex = findPullIndex( currentRepo.pulls, checkMerge[ 1 ] );

                    // Remove merged pull request
                    if( pullIndex !== null )
                    {
                        currentRepo.gravatar = currentRepo.pulls[ pullIndex ].gravatar;

                        if( build.status == "Started" )
                        {
                            currentRepo.pulls[ pullIndex ].merging = true;
                        }
                        else if( build.status == "Success" || build.status == "Failure" ||
                                 build.status == "Error" || build.status == "Killed" )
                        {
                            currentRepo.pulls.splice( pullIndex, 1 );
                        }
                    }
                }

                // Update repo with details from latest non-pull build
                if( build.status != "Pending" )
                {
                    if( !currentRepo.lastMerge || build.started_at >= currentRepo.lastMerge )
                    {
                        currentRepo.lastMerge = build.started_at;
                        currentRepo.status    = build.status;
                        currentRepo.gravatar  = checkMerge ? currentRepo.gravatar : build.gravatar;
                    }
                }

            }
        };

        var findRepo = function ( slug )
        {
            for( var i = 0; i < repos.length; i++ )
            {
                if( repos[ i ].slug === slug )
                {
                    return repos[ i ];
                }
            }

            return null;
        };

        var addRepo = function ( build )
        {
            var newRepo = {
                slug:      build.slug,
                name:      build.name,
                owner:     build.owner,
                pulls:     [],
                lastMerge: null
            };

            repos.push( newRepo );

            return newRepo;
        };

        var findPullIndex = function ( pulls, pull )
        {
            for( var i = 0; i < pulls.length; i++ )
            {
                if( parseInt( pulls[ i ].pull_request, 10 ) === parseInt( pull, 10 ) )
                {
                    return i;
                }
            }

            return null;
        };

        var expirePulls = function ()
        {
            // Remove pull requests that are inactive for two days, stop-gap until
            // accessing GitHub API to determine if a pull has been closed

            var pulls;

            for( var i = 0; i < repos.length; i++ )
            {
                pulls = repos[ i ].pulls;

                for( var k = 0; k < pulls.length; k++ )
                {
                    if( moment().diff( pulls[ k ].updated_at * 1000, "hours" ) >= 48 )
                    {
                        repos[ i ].pulls.splice( k, 1 );
                    }
                }
            }
        };

        return {
            parseBuild:  parseBuild,
            getRepos:    function () { return repos; },
            expirePulls: expirePulls
        };

    }

] )

.factory( "Builds", [ "$rootScope",

    function ( $rootScope )
    {
        "use strict";

        var builds = [];
        var buildCapacity = 30;

        var parseBuild = function ( build )
        {
            var currentBuild = findBuild( build.sha ) || addBuild( build );

            currentBuild.started_at  = build.started_at;
            currentBuild.duration    = build.duration;
            currentBuild.finished_at = build.finished_at;
            currentBuild.status      = build.status;
            currentBuild.updated_at  = build.updated_at;

            if( currentBuild.status == "Success" )
            {
                $rootScope.$broadcast( "buildSuccess", currentBuild );
            }
            else if( currentBuild.status == "Failure" || currentBuild.status == "Error" || currentBuild.status == "Killed" )
            {
                $rootScope.$broadcast( "buildFailure", currentBuild );
            }

            if( builds.length > buildCapacity )
            {
                builds.shift();
            }
        };

        var findBuild = function ( sha )
        {
            for( var i = 0; i < builds.length; i++ )
            {
                if( builds[ i ].sha === sha )
                {
                    return builds[ i ];
                }
            }

            return null;
        };

        var addBuild = function ( build )
        {
            builds.push( build );
            $rootScope.$broadcast( "newBuild", build );

            return build;
        };

        return {
            parseBuild: parseBuild,
            getBuilds:  function () { return builds; }
        };

    }

] )

.factory( "Developers", [ "$rootScope",

    function ( $rootScope )
    {
        "use strict";

        var developers = [];

        var parseBuild = function ( build )
        {
            // Require gravatars, and don't give credit for merges
            if( build.gravatar && !build.message.match( /Merge pull request #([0-9]+)/i ) )
            {
                var currentDeveloper = findDeveloper( build.gravatar ) || addDeveloper( build );

                if( build.status == "Success" )
                {
                    currentDeveloper.builds++;
                    currentDeveloper.successes++;
                    currentDeveloper.visible = true;
                }
                else if( build.status == "Failure" || build.status == "Error" || build.status == "Killed" )
                {
                    currentDeveloper.builds++;
                    currentDeveloper.failures++;
                    currentDeveloper.visible = true;
                }

            }

        };

        var findDeveloper = function ( gravatar )
        {
            for( var i = 0; i < developers.length; i++ )
            {
                if( developers[ i ].gravatar === gravatar )
                {
                    return developers[ i ];
                }
            }

            return null;
        };

        var addDeveloper = function ( build )
        {
            var newDeveloper = {
                gravatar:  build.gravatar,
                builds:    0,
                successes: 0,
                failures:  0,
                visible:   false
            };

            developers.push( newDeveloper );

            return newDeveloper;
        };

        var resetTotals = function ()
        {
            for( var i = 0; i < developers.length; i++ )
            {
                developers[ i ].builds    = 0;
                developers[ i ].successes = 0;
                developers[ i ].failures  = 0;
                developers[ i ].visible   = false;
            }
        };

        return {
            parseBuild:    parseBuild,
            getDevelopers: function () { return developers; },
            findDeveloper: findDeveloper,
            resetTotals:   resetTotals
        };

    }

] );
