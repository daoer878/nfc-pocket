cordova.define("cordova.plugin.native.browser", function(require, exports, module) {

    var exec = require('cordova/exec');

    exports.openNativeBrowser = function (arg0, success, error) {
        exec(success, error, "OpenBrowser", "openBrowser", [arg0]);
    };

});
