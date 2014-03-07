"use strict";

/* Controllers */

var ctlMod = angular.module( "drone.controllers", [] );

ctlMod.controller( "Projects", [ "$scope", "$rootScope", "$http", function ( $scope, $rootScope, $http )
{
	$scope.projects = [];

	$scope.addBuild = function ( newBuild )
	{
		$scope.currentProject = '';
		
		for( var j = 0; j < $scope.projects.length; j++ )
		{
			if( $scope.projects[j].projectOwner == newBuild.owner && $scope.projects[j].projectName == newBuild.name )
			{
				$scope.currentProject = $scope.projects[j];
				break;
			}
		}
		
		if( !$scope.currentProject )
		{
			$scope.currentProject = {};
			$scope.currentProject.projectOwner = newBuild.owner;
			$scope.currentProject.projectName  = newBuild.name;
			$scope.currentProject.builds	   = [];
			
			$scope.projects.push( $scope.currentProject );
			$scope.currentProject = $scope.projects[ $scope.projects.length - 1 ];
		}

		$scope.build = {};
		$scope.build.fresh = true;
		
		for( var k = 0; k < $scope.currentProject.builds.length; k++ )
		{
			if( $scope.currentProject.builds[k].hash == newBuild.hash )
			{
				$scope.build	   = $scope.currentProject.builds[k];
				$scope.build.fresh = false;
				break;
			}
		}
		
		$scope.build.hash      = newBuild.hash;
		$scope.build.status    = newBuild.status;
		$scope.build.buildTime = newBuild.created;
		$scope.build.pull      = newBuild.pull_request;
		$scope.build.gravatar  = newBuild.gravatar;
		$scope.build.message   = newBuild.message;
		
		$scope.currentProject.masterHash   = !$scope.build.pull ? $scope.build.hash : $scope.currentProject.masterHash;
		$scope.currentProject.masterStatus = !$scope.build.pull ? $scope.build.status : $scope.currentProject.masterStatus;
		
		if( $scope.build.fresh )
		{
			$scope.currentProject.builds.push( $scope.build );
		}
	};
			
	$scope.refreshWall = function()
	{
		var url = "/refresh";

		$http.get( url ).success( function ( result )
		{
			for( var i = 0; i < result.length; i++ )
			{
				$scope.addBuild( result[i] );
			}
			
		} ).error( function ()
		{
			console.log( "Couldn't connect to drone, great job." );
		} )
	}

	$scope.refreshWall();
	setInterval( $scope.refreshWall, 5000 );
	
} ] );
