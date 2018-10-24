cordova.define("com.none.webServer.WebServer", function(require, exports, module) { var exec = require('cordova/exec');

exports.coolMethod = function(arg0, success, error) {
    exec(success, error, "WebServer", "coolMethod", [arg0]);
};

});
