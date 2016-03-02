"use strict";

module.exports = function ()
{
    return {
        restrict: "A",
        link: function ( scope, element )
        {
            var repoHeight       = 125;
            var startingPosition = scope.$index * repoHeight;

            scope.wall.position = startingPosition;
            element.css( "transform", "translate3D( 0, " + startingPosition + "px, 0 )" );

            // If not scrolling yet, reposition existing repos to accomodate the new one
            if( !( scope.wall.displayRepos && scope.wall.displayRepos.length > scope.wall.maxRepos ) )
            {
                for( var i = 0; i < scope.wall.displayRepos.length; i++ )
                {
                    startingPosition = i * repoHeight;
                    scope.wall.displayRepos[ i ].position = startingPosition;
                    angular.element( document.querySelectorAll( ".repos > li:nth-child( " + ( i + 1 ) + " )" ) )
                        .css( "transform", "translate3D( 0, " + startingPosition + "px, 0 )" );
                }
            }

            scope.$on( "scrollRepos", function ()
            {
                scope.wall.position = ( scope.$index - 1 ) * repoHeight;
                element.css( "transform", "translate3D( 0, " + scope.wall.position + "px, 0 )"
                    + ( scope.$index === 0 ? " scale( .9, .9 )" : "" ) );
                element.toggleClass( "leave", scope.$index === 0 );
            } );
        }
    };

};
