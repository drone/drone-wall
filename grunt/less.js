"use strict";

module.exports = function ( grunt )
{
    return {
        build: {
            options: {
                modifyVars: grunt.config( "env" ).colors
            },
            files: { "build/project.css": "source/modules/_app/styles/main.less" }
        }
    };
};
