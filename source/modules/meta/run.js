"use strict";

module.exports = [ "$rootScope", "Meta",

    function ( $rootScope, Meta )
    {
        $rootScope.$on( "$routeChangeSuccess", function ( e, next )
        {
            Meta.routeMeta( next.$$route && next.$$route.data ? next.$$route.data.meta : null );
        } );
    }

];
