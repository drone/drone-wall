"use strict";

module.exports = [ "$rootScope", "Settings",

    function ( $rootScope, Settings )
    {
        var ctrl = this;

        ctrl.theme = Settings.theme || "light";

        $rootScope.$on( "$routeChangeSuccess", () => ctrl.theme = Settings.theme );
        $rootScope.$on( "ChangeTheme", ( event, theme ) => ctrl.theme = theme );

    }

];
