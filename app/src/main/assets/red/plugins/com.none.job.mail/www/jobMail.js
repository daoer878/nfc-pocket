cordova.define("cordova.plugin.job.mail", function(require, exports, module){
    var exec = require('cordova/exec');

    exports.jobMailTo =function(arg0, success, error) {
        exec(success, error, "MailJob", "MailJobTo", [arg0]);
    }
});
