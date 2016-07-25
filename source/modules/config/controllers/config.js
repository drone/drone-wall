"use strict";

module.exports = [ "$rootScope", "$location", "Defaults", "Settings", "DroneAPI",

    function ( $rootScope, $location, Defaults, Settings, DroneAPI )
    {
        var ctrl = this;

        ctrl.settings = angular.copy( Settings );
        ctrl.defaults = Defaults;

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

                ctrl.settings.theme      = ctrl.settings.theme      || Defaults.theme;
                ctrl.settings.include    = ctrl.settings.include    || Defaults.include;
                ctrl.settings.exclude    = ctrl.settings.exclude    || Defaults.exclude;
                ctrl.settings.mainBranch = ctrl.settings.mainBranch || Defaults.mainBranch;
                ctrl.settings.prTimeout  = ctrl.settings.prTimeout  || Defaults.prTimeout;
                ctrl.settings.prMax      = ctrl.settings.prMax      || Defaults.prMax;
                ctrl.settings.orgName    = ctrl.settings.orgName    || Defaults.orgName;

                angular.extend( Settings, ctrl.settings );
                Settings.save();

                DroneAPI.rootPath = Settings.apiRoot || DroneAPI.rootPath;
                DroneAPI.setKey( Settings.token || DroneAPI.getKey() );
                DroneAPI.parseFilters();

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
