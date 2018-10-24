cordova.define("com.none.alarmClock.alarmClock", function(require, exports, module) { var exec = require('cordova/exec');

exports.addAlarmClock = function(arg0, success, error) {
    exec(success, error, "AlarmClock", "addAlarmClock", arg0);
};
exports.deleteManyAlarmClock = function(arg0, success, error) {
    exec(success, error, "AlarmClock", "deleteManyAlarmClock", [arg0]);
};






});
