/* Directives */

angular.module( "wall.directives", [] )

// Scroll the repo list periodically
.directive( "scrollRepo", function ()
{
    "use strict";

    return {
        restrict: "A",
        link: function ( scope, element, attrs )
        {
            var repoHeight       = 125;
            var startingPosition = scope.$index * repoHeight;

            scope.position = startingPosition;
            element.css( "top", startingPosition + "px" );

            // If not scrolling yet, reposition existing repos to accomodate the new one
            if( !( scope.displayRepos && scope.displayRepos.length > scope.maxRepos ) )
            {
                for( var i = 0; i < scope.displayRepos.length; i++ )
                {
                    startingPosition = i * repoHeight;
                    scope.displayRepos[ i ].position = startingPosition;
                    angular.element( ".repos > li:nth-child( " + ( i + 1 ) + " )" )
                        .css( "top", startingPosition + "px" );
                }
            }

            scope.$on( "scrollRepos", function ()
            {
                scope.position -= repoHeight;
                element.css( "top", scope.position + "px" );
                element.toggleClass( "leave", scope.$index === 0 );
            } );
        }
    };

} );
