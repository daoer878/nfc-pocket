cordova.define("com.none.pushJumpPage.com.none.pushJumpPage", function(require, exports, module) { var exec = require('cordova/exec');

exports.pushJumpToPage = function(arg0, success, error) {
    exec(success, error, "pushJumpPage", "pushJumpToPage", [arg0]);
};
exports.boolAllowPush = function(arg0, success, error) {
    exec(success, error, "pushJumpPage", "boolAllowPush", [arg0]);
};
exports.alertButtonShow = function(arg0, success, error) {
    exec(success, error, "pushJumpPage", "alertButtonShow", arg0);
};
exports.topToSetting = function(arg0, success, error) {
    exec(success, error, "pushJumpPage", "topToSetting", [arg0]);
};

exports.pushVideoPage = function(arg0, success, error) {
    exec(success, error, "pushJumpPage", "pushVideoPage", [arg0]);
};

exports.pushImagePage = function(arg0, success, error) {
    exec(success, error, "pushJumpPage", "pushImagePage", [arg0]);
};
});
