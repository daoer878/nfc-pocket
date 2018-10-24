cordova.define("cordova.plugin.job.share", function(require, exports, module) { 

    var exec = require('cordova/exec');

    exports.jobShareTo = function(arg0, success, error) {
        exec(success, error, "ShareJob", "ShareJobTo", [arg0]);
    };

});