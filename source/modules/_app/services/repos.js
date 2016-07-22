"use strict";

module.exports = [ "$rootScope", "Settings",

    function ( $rootScope, Settings )
    {
        var repos = [];

        var checkMerge = ( build ) => build.event === "push" && build.message.match( /Merge pull request #([0-9]+)/i );

        var getPullID = function ( build )
        {
            var match;

            if( build.event === "pull_request" )
            {
                match = build.ref.match( /refs\/pull\/([0-9]+)\/merge/i );
                return match ? match[ 1 ] : null;
            }
            else if( build.event === "push" )
            {
                match = build.message.match( /Merge pull request #([0-9]+)/i );
                return match ? match[ 1 ] : null;
            }

            return null;
        };

        var findRepo = function ( fullName )
        {
            for( var i = 0; i < repos.length; i++ )
            {
                if( repos[ i ].fullName === fullName )
                {
                    return repos[ i ];
                }
            }

            return null;
        };

        var addRepo = function ( build, developer )
        {
            var newRepo = {
                fullName:  build.fullName,
                name:      build.name,
                owner:     build.owner,
                pulls:     [],
                lastMerge: null,
                developer: checkMerge( build ) ? developer : {}
            };

            repos.push( newRepo );

            return newRepo;
        };

        var findPullIndex = function ( pulls, pull )
        {
            for( var i = 0; i < pulls.length; i++ )
            {
                if( parseInt( pulls[ i ].pullID, 10 ) === parseInt( pull, 10 ) )
                {
                    return i;
                }
            }

            return null;
        };

        var expirePulls = function ()
        {
            // Remove pull requests that are inactive for some time, stop-gap until
            // accessing GitHub API to determine if a pull has been closed

            var pulls;

            for( var i = 0; i < repos.length; i++ )
            {
                pulls = repos[ i ].pulls;

                for( var k = 0; k < pulls.length; k++ )
                {
                    if( moment().diff( pulls[ k ].updatedAt * 1000, "hours" ) >= Settings.prTimeout )
                    {
                        repos[ i ].pulls.splice( k, 1 );
                    }
                }
            }
        };

        var parseBuild = function ( build, developer )
        {
            var currentRepo = findRepo( build.fullName ) || addRepo( build, developer );
            var currentPull = null;
            var pullIndex;

            build.pullID = getPullID( build );

            if( build.event === "pull_request" )
            {
                pullIndex = findPullIndex( currentRepo.pulls, build.pullID );

                if( pullIndex !== null )
                {
                    // Update existing pull request
                    currentPull            = currentRepo.pulls[ pullIndex ];

                    // Toggle status if this is the first fresh build coming in
                    currentPull.status     = ( currentPull.buildCount === 0 && build.status === "running" ) ?
                                             build.status : currentPull.status;

                    // Increment or decrement build count, don't let it go below zero (possible during first load)
                    currentPull.buildCount = currentPull.buildCount + ( build.status === "running" ? 1 : -1 );
                    currentPull.buildCount = currentPull.buildCount < 0 ? 0 : currentPull.buildCount;

                    // Update status if all active builds have completed
                    currentPull.status     = currentPull.buildCount > 0 ? currentPull.status : build.status;

                    // Always update the updated time
                    currentPull.updatedAt  = build.updatedAt;
                }
                else
                {
                    // Add a new pull request
                    var newPull = angular.extend(
                        {},
                        build,
                        {
                            merging: false,
                            buildCount: ( build.status === "running" ? 1 : 0 ),
                            developer: developer
                        } );
                    currentPull = newPull;
                    currentRepo.pulls.push( newPull );
                    $rootScope.$broadcast( "newPull", newPull );
                }
            }
            else
            {
                if( checkMerge( build ) )
                {
                    pullIndex = findPullIndex( currentRepo.pulls, build.pullID );

                    // Remove merged pull request
                    if( pullIndex !== null )
                    {
                        currentRepo.developer = currentRepo.pulls[ pullIndex ].developer;

                        if( build.status === "running" )
                        {
                            currentRepo.pulls[ pullIndex ].merging = true;
                        }
                        else if( build.status === "success" || build.status === "failure" ||
                                 build.status === "error" || build.status === "killed" )
                        {
                            currentRepo.pulls.splice( pullIndex, 1 );
                        }
                    }
                }

                // Update repo with details from latest non-pull build
                if( build.status !== "pending" )
                {
                    if( !currentRepo.lastMerge || build.startedAt >= currentRepo.lastMerge )
                    {
                        currentRepo.lastMerge = build.startedAt;
                        currentRepo.status    = build.status;
                        currentRepo.developer = checkMerge( build ) ? currentRepo.developer : developer;
                    }
                }

            }
        };

        return {
            parseBuild:  parseBuild,
            getRepos:    () => repos,
            resetRepos:  () => repos = [],
            expirePulls: expirePulls
        };

    }

];
