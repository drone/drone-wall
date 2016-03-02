"use strict";

module.exports = [ "$rootScope", "$q",

    function ( $rootScope, $q )
    {
        var developers = [];

        var checkMerge = function ( build )
        {
            return build.event === "push" && build.message.match( /Merge pull request #([0-9]+)/i );
        };

        var parseBuild = function ( build )
        {
            var deferred = $q.defer();

            getDeveloper( build ).then( function ( currentDeveloper )
            {
                // Don't give credit for merges
                if( !checkMerge( build ) && currentDeveloper.username )
                {
                    if( build.status === "success" )
                    {
                        currentDeveloper.builds++;
                        currentDeveloper.successes++;
                        currentDeveloper.rank = currentDeveloper.successes - currentDeveloper.failures;
                        currentDeveloper.visible = true;
                    }
                    else if( build.status === "failure" || build.status === "error" || build.status === "killed" )
                    {
                        currentDeveloper.builds++;
                        currentDeveloper.failures++;
                        currentDeveloper.rank = currentDeveloper.successes - currentDeveloper.failures;
                        currentDeveloper.visible = true;
                    }
                }

                deferred.resolve( currentDeveloper );

            }, function ()
            {
                deferred.resolve( {} );

            } );

            return deferred.promise;
        };

        var getDeveloper = function ( build )
        {
            var deferred = $q.defer();
            var found    = false;

            for( var i = 0; i < developers.length; i++ )
            {
                if( build.author === developers[ i ].username )
                {
                    found = true;
                    deferred.resolve( developers[ i ] );
                }
            }

            if( !found )
            {
                var newDeveloper = {
                    builds:    0,
                    successes: 0,
                    failures:  0,
                    rank:      0,
                    visible:   false
                };

                var buildDeveloper = function ( source )
                {
                    if( source )
                    {
                        angular.extend( newDeveloper, {
                            username: source.author,
                            email: source.authorEmail,
                            avatar: source.authorAvatar
                        } );

                        developers.push( newDeveloper );
                        deferred.resolve( newDeveloper );
                    }
                    else
                    {
                        deferred.reject( "Rate limited, will try again later" );
                    }

                };

                buildDeveloper( build );

            }

            return deferred.promise;
        };

        var resetTotals = function ()
        {
            for( var i = 0; i < developers.length; i++ )
            {
                developers[ i ].builds    = 0;
                developers[ i ].successes = 0;
                developers[ i ].failures  = 0;
                developers[ i ].rank      = 0;
                developers[ i ].visible   = false;
            }
        };

        return {
            parseBuild:      parseBuild,
            getDevelopers:   function () { return developers; },
            getDeveloper:    getDeveloper,
            resetDevelopers: function () { developers = []; },
            resetTotals:     resetTotals
        };

    }

];
