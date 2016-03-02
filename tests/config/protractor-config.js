"use strict";

exports.config = {

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        "browserName": "chrome"
    },

    params: {
        common: require( "./protractor-params" )
    },

    // Prevents a full selenium start-up, much quicker, but only works with Chrome and Firefox
    directConnect: true,
    baseUrl: "http://localhost:9000",
    rootElement: "html",

    // Spec patterns are relative to the current working directly when protractor is called.
    specs: require( "./protractor-specs" ),

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        isVerbose: true,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 20000
    },

    onPrepare: function ()
    {
        browser.driver.manage().window().maximize(); // always use the full screen
    }
};
