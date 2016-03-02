"use strict";

module.exports = function ( config )
{
    config.set( {

        basePath:   "../../",
        frameworks: [ "jasmine" ],
        autoWatch:  false,
        browsers:   [ "PhantomJS" ],
        reporters:  [ "dots", "coverage" ],
        singleRun:  true,
        captureTimeout: 15000,
        logLevel: config.LOG_DEBUG,
        plugins: [
            "karma-jasmine",
            "karma-coverage",
            "karma-phantomjs-launcher-path"
        ],
        preprocessors: {
            "build/**/*.js": [ "coverage" ]
        },
        coverageReporter: {
            dir : "coverage/karma/",
            reporters: []
        },
        files: [
            "source/components/angular/angular.js",

            "source/app/**/*.spec.js",
            "source/modules/**/*.spec.js",
            "tests/**/*.spec.js"
        ]

    } );

};
