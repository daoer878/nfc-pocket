cordova.define("com.none.locateBeacon.LocateIbeaconas", function(require, exports, module) { var exec = require('cordova/exec');

exports.checkIbeacon = function(arg0, success, error) {
    exec(success, error, "GetBeaconLocate", "startMonitorBeaconLocate", [arg0]);
};

});
