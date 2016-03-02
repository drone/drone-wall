"use strict";

global.angular = require( "angular" );

require( "angular-route" );
require( "angular-animate" );
require( "angular-messages" );
require( "angular-toastr" );

global.moment = require( "moment" );

require( "vokal-ng-api" );

require( "./_app" );
require( "./config" );
require( "./meta" );

require( "../../build/templates.js" );
