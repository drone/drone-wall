"use strict";

module.exports = [ "API", "DroneAPIRoot", "DroneAPIToken",

    function ( API, DroneAPIRoot, DroneAPIToken )
    {
        var path = localStorage.getItem( "path" ) || DroneAPIRoot;
        path = path.substr( -1, 1 ) === "/" || path === "" ? path : path + "/";

        var apiInterface = new API( {
            rootPath: path,
            unauthorizedInterrupt: false
        } );

        apiInterface.setKey( localStorage.getItem( "token" ) || DroneAPIToken );

        apiInterface.getLatest = function ()
        {
            return apiInterface.$get( "user/feed" );
        };

        return apiInterface;
    }

];
