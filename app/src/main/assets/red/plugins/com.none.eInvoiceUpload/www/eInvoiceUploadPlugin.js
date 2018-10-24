cordova.define("com.none.eInvoiceUploadPlugin", function(require, exports, module) { var exec = require('cordova/exec');

exports.enterMethod = function(arg0, success, error){
	exec(success, error, "invoiceUploadPlugin", "enterMethod", [arg0]);
};

exports.uploadInvoice = function(arg0, success, error){
	exec(success, error, "invoiceUploadPlugin", "uploadInvoice", [arg0]);
};

exports.overViewPDF = function(arg0, arg1, success, error){
	exec(success, error, "OverViewPDFPlugin", "overViewPDF", [arg0, arg1]);
};

});
