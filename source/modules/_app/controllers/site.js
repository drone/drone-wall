"use strict";

module.exports = [ "WallTheme",

    function ( WallTheme )
    {
        var ctrl = this;

        ctrl.theme = localStorage.getItem( "theme" ) || WallTheme || "light";

        ctrl.toggleTheme = function ( theme )
        {
            ctrl.theme = theme;
            localStorage.setItem( "theme", theme );
        };

    }

];
