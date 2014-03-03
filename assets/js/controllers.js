"use strict";

/* Controllers */

var ctlMod = angular.module( "drone.controllers", [] );

ctlMod.controller( "Projects", [ "$scope", "$rootScope", "$http", function ( $scope, $rootScope, $http )
{
    var url = "/refresh"

	$http.get( url ).success( function ( result )
	{
		$scope.projects = [];
		$scope.firstRun = true;

 		var currentProject, build;
		
		$scope.addBuild = function ( newBuild )
		{
			currentProject = '';
			
			for( var j = 0; j < $scope.projects.length; j++ )
			{
				if( $scope.projects[j].projectOwner == newBuild.owner && $scope.projects[j].projectName == newBuild.name )
				{
					currentProject = $scope.projects[j];
					break;
				}
			}
			
			if( !currentProject )
			{
				currentProject = {};
				currentProject.projectOwner = newBuild.owner;
				currentProject.projectName  = newBuild.name;
				currentProject.builds       = [];
				
				$scope.projects.push( currentProject );
				currentProject = $scope.projects[ $scope.projects.length - 1 ];
			}
	
			build = {};
			build.fresh = true;
			
			for( var k = 0; k < currentProject.builds.length; k++ )
			{
				if( currentProject.builds[k].hash == newBuild.hash )
				{
					build       = currentProject.builds[k];
					build.fresh = false;
					break;
				}
			}
			
			build.hash      = newBuild.hash;
			build.status    = newBuild.status;
			build.buildTime = newBuild.created;
			build.pull      = newBuild.pull_request;
			build.gravatar  = newBuild.gravatar;
			build.message   = newBuild.message;
			
			currentProject.masterHash   = !build.pull && ( ( $scope.firstRun && !currentProject.masterHash ) || !$scope.firstRun )
		                                  ? build.hash : currentProject.masterHash;
			currentProject.masterStatus = !build.pull && ( ( $scope.firstRun && !currentProject.masterStatus ) || !$scope.firstRun )
		                                  ? build.status : currentProject.masterStatus;
			
			if( build.fresh )
			{
				currentProject.builds.push( build );
                console.log($scope.projects);
			}
		};
		
		for( var i = 0; i < result.length; i++ )
		{
			$scope.addBuild( result[i] );
		}
		
		$scope.firstRun = false;
		
	} ).error( function ()
	{
		console.log( "Couldn't connect to drone, great job." );
		
	} );

} ] );
