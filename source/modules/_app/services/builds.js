"use strict";

module.exports = [ "$rootScope",

    function ( $rootScope )
    {
        var builds = [];
        var buildCapacity = 30;

        var findBuild = function ( commit )
        {
            for( var i = 0; i < builds.length; i++ )
            {
                if( builds[ i ].commit === commit )
                {
                    return builds[ i ];
                }
            }

            return null;
        };

        var addBuild = function ( build, developer )
        {
            builds.push( angular.extend( build, { developer: developer } ) );
            $rootScope.$broadcast( "newBuild", build );

            return build;
        };

        var parseBuild = function ( build, developer )
        {
            var currentBuild = findBuild( build.commit ) || addBuild( build, developer );

            currentBuild.startedAt  = build.startedAt;
            currentBuild.finishedAt = build.finishedAt;
            currentBuild.updatedAt  = build.updatedAt;
            currentBuild.status     = build.status;

            if( currentBuild.status === "success" )
            {
                $rootScope.$broadcast( "buildSuccess", currentBuild );
            }
            else if( currentBuild.status === "failure" || currentBuild.status === "error" ||
                currentBuild.status === "killed" )
            {
                $rootScope.$broadcast( "buildFailure", currentBuild );
            }

            if( builds.length > buildCapacity )
            {
                builds.shift();
            }
        };

        return {
            parseBuild:  parseBuild,
            getBuilds:   function () { return builds; },
            resetBuilds: function () { builds = []; }
        };

    }

];
