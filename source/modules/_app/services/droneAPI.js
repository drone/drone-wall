"use strict";

module.exports = [ "API", "Settings",

    function ( API, Settings )
    {
        var path = Settings.apiRoot;
        path = path.substr( -1, 1 ) === "/" || path === "" ? path : path + "/";

        var apiInterface = new API( {
            rootPath: path,
            unauthorizedInterrupt: false
        } );

        apiInterface.setKey( Settings.token );

        apiInterface.getLatest = () => apiInterface.$get( "user/feed" );

        return apiInterface;
    }

];
