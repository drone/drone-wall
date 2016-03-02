"use strict";

module.exports = [

    function ()
    {
        var meta = this;

        meta.title = "drone-wall";
        meta.tags = {
            "description": "Drone status.",
            "al:ios:url": "",
            "al:ios:app_store_id": "",
            "al:ios:app_name": "",
            "al:android:url": "",
            "al:android:app_name": "",
            "al:android:package": "",
            "al:web:url": window.location.href
        };
        var originalTitle = meta.title;
        var originalTags = angular.copy( meta.tags );

        meta.routeMeta = function ( obj )
        {
            obj = obj ? angular.copy( obj ) : {};

            meta.title = obj.title || originalTitle;
            meta.tags[ "al:web:url" ] = window.location.href;

            Object.keys( meta.tags ).forEach( tag => {
                if( tag !== "al:web:url" )
                {
                    meta.tags[ tag ] = obj[ tag ] || originalTags[ tag ];
                }
            } );
        };

        return meta;
    }

];
