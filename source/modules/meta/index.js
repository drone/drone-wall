"use strict";

angular.module( "Meta", [] )

.run( require( "./run" ) )
.controller( "Head", require( "./controllers/head" ) )
.service( "Meta", require( "./services/meta" ) );

angular.module( "App" ).requires.push( "Meta" );
