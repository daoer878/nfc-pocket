cordova.define("cordova.plugin.shakeLaisee.shakeLaisee", function(require, exports, module) { 
    var exec = require('cordova/exec');

    exports.goToStaffPage = function(arg0, success, error) {
        exec(success, error, "StaffShake", "staffShake", [arg0]);
    };
});
