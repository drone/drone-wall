module.exports = function( grunt )
{
	"use strict";

    // Project configuration
    grunt.initConfig( {
        pkg: grunt.file.readJSON( "package.json" ),
        watch:
        {
            scripts:
            {
                files: [
                    "source/scripts/project/*"
                ],
                tasks: [ "concat:scripts" ]
            },
            styles:
            {
                files: [
                    "source/styles/project/*"
                ],
                tasks: [ "less:dev" ]
            }
        },
        uglify:
        {
            options:
            {
                mangle: true,
                compress: true,
                banner: "/*! <%= pkg.name %> <%= grunt.template.today( 'yyyy-mm-dd' ) %> */",
                sourceMap: true,
                sourceMapName: "build/project.js.map"
            },
            project:
            {
                files:
                {
                    "build/project.js": [
                        "source/scripts/project/*"
                    ]
                }
            }
        },
        less:
        {
            dev:
            {
                files: {
                    "build/project.css": "source/styles/project/main.less"
                }
            },
            deploy:
            {
                options: {
                    rootpath: process.env.STATIC_PATH || ""
                },
                files: {
                    "build/project.css": "source/styles/project/main.less"
                }
            }
        },
        concat:
        {
            scripts:
            {
                src: [
                    "source/scripts/project/*"
                ],
                dest: "build/project.js"
            },
            jquery:
            {
                src: [
                    "source/components/jquery/dist/jquery.min.js"
                ],
                dest: "build/jquery.js"
            },
            angular:
            {
                src: [
                    "source/components/angular/angular.min.js",
                    "source/components/angular-route/angular-route.min.js",
                    "source/components/angular-animate/angular-animate.min.js"
                ],
                dest: "build/angular.js"
            },
            components:
            {
                src: [
                    "source/components/moment/min/moment.min.js"
                ],
                dest: "build/components.js"
            },
            styles:
            {
                src: [
                    "source/styles/library/reset.css",
                    "source/styles/library/vokal.css"
                ],
                dest: "build/base.css"
            }
        }
    } );

    // Load plugins
    grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-contrib-uglify" );
    grunt.loadNpmTasks( "grunt-contrib-concat" );
    grunt.loadNpmTasks( "grunt-contrib-less" );

    // Default task(s)
    grunt.registerTask( "default", [ "concat", "less:dev" ] );

    // Customize deploy task, or add additional deploy tasks for each environment being deployed to
    grunt.registerTask( "deploy",  [ "uglify", "concat:jquery", "concat:angular", "concat:components", "concat:styles", "less:deploy" ] );

};
