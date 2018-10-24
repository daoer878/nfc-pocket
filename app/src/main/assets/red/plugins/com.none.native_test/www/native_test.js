cordova.define("com.none.native_test.native_test", function(require, exports, module) { var exec = require('cordova/exec');
    var arg0;
exports.nativeConnection = function(url,method,parameters, success, error) {
    arg0  = [{
        "url":url,
        "method":method,
        "postdata":parameters
    }];

    // exec(success, error, "Proxy", "proxy", arg0);
    exec(success, error, "CDVProxy", "proxy", arg0);
};



});