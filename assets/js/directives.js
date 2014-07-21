"use strict";

/* Directives */

var dirMod = angular.module( "drone.directives", [] );

// Scroll up and down periodically to show all the stuff
dirMod.directive( "autoscroll", [ function ()
{
	return {
		restrict: "A",
		link: function ( scope, element, attrs )
		{
			setInterval( function ()
			{
				var scrollTo = $( window ).scrollTop() > 0 ? 0 : $( document ).height();
				$( "html, body" ).animate( { scrollTop: scrollTo }, 500 );
	
			}, 30000 );
		}
	};
} ] );
