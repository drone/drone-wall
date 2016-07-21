"use strict";

module.exports = [ "$rootScope", "$location", "Settings", "DroneAPI",

    function ( $rootScope, $location, Settings, DroneAPI )
    {
        var ctrl = this;

        ctrl.settings = angular.copy( Settings );

        ctrl.toggleTheme = function ( theme )
        {
            ctrl.settings.theme = theme;
            $rootScope.$broadcast( "ChangeTheme", theme );
        };

        ctrl.saveConfig = function ( valid )
        {
            if( valid )
            {
                ctrl.settings.apiRoot = ctrl.settings.apiRoot.substr( -1, 1 ) === "/" ||
                    ctrl.settings.apiRoot === "" ? ctrl.settings.apiRoot : ctrl.settings.apiRoot + "/";

                angular.extend( Settings, ctrl.settings );
                Settings.save();

                DroneAPI.rootPath = Settings.apiRoot || DroneAPI.rootPath;
                DroneAPI.setKey( Settings.token || DroneAPI.getKey() );

                $location.path( "/" );
            }
        };

        ctrl.cancel = function ()
        {
            $rootScope.$broadcast( "ChangeTheme", Settings.theme );
            $location.path( "/" );
        };

    }

];
