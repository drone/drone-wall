"use strict";

require( "angular-mocks" );

angular.module( "e2e-mocks", [ "ngMockE2E" ] )

.run( require( "./wall" ) )

.run( [ "$httpBackend",
    function ( $httpBackend )
    {
        // Fallback for all other routes, just in case.
        $httpBackend.when( "GET" ).passThrough();
        $httpBackend.when( "POST" ).passThrough();
        $httpBackend.when( "PATCH" ).passThrough();
        $httpBackend.when( "PUT" ).passThrough();
        $httpBackend.when( "DELETE" ).passThrough();
    }
] );

angular.module( "App" ).requires.push( "e2e-mocks" );
