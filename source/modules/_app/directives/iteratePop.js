"use strict";

module.exports = [ "$timeout", function ( $timeout )
{
    return {
        restrict: "A",
        link: function ( scope, element )
        {
            var successWatch = scope.$watch( "developer.successes", function ( newVal, oldVal )
            {
                if( newVal !== oldVal )
                {
                    element.addClass( "success-pop" );
                }

                $timeout( function ()
                {
                    element.removeClass( "success-pop" );

                }, 200 );

            } );

            var failureWatch = scope.$watch( "developer.failures", function ( newVal, oldVal )
            {
                if( newVal !== oldVal )
                {
                    element.addClass( "failure-pop" );
                }

                $timeout( function ()
                {
                    element.removeClass( "failure-pop" );

                }, 200 );

            } );

            element.on( "$destroy", function ()
            {
                successWatch();
                failureWatch();
            } );

        }
    };

} ];
