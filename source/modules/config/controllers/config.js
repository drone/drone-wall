"use strict";

module.exports = [ "DroneAPI",

    function ( DroneAPI )
    {
        var ctrl = this;

        ctrl.path  = localStorage.getItem( "path" )  || DroneAPI.rootPath || "";
        ctrl.token = localStorage.getItem( "token" ) || DroneAPI.getKey() || "";

        ctrl.setConfig = function ( valid )
        {
            if( valid )
            {
                ctrl.path = ctrl.path.substr( -1, 1 ) === "/" || ctrl.path === "" ? ctrl.path : ctrl.path + "/";

                localStorage.setItem( "path", ctrl.path );
                localStorage.setItem( "token", ctrl.token );

                window.location = "/";
            }
        };

    }

];
