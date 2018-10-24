/**
 * Created by steve on 14-9-18.
 */
define(['jquery', 'dialogs', 'config', 'nls'], function ($, dia, config, nls) {
	var escapeHTML = (function() {
		var chars = {
		'"': '&quot;',
		"'": '&#39;',
		'&': '&amp;',
		'/': '&#47;',
		'<': '&lt;',
		'>': '&gt;'
		};

		return function(text) {
			return String(text).replace(/[\"'\/<>]/g, function(char) {
				return chars[char];
			});
		};

	}());

	function removeEmptyvalueJson(parameters){
		var res={};
		for(var o in parameters){
			if(parameters[o]==="" || parameters[o] === undefined){
				continue;
			}else{
				res[o] = escapeHTML(parameters[o]);
			}
		}
		return res;
	}

    return {
        get: function (url, parameters, fail, success) {
            console.log('---请求参数---');
            console.log('url:');
            console.log(url);
            console.log('parameters:');
            console.log(parameters);

            if (localStorage.getItem('login_user') !== null && !parameters.userId) {
                var user = JSON.parse(localStorage.getItem('login_user'));
                parameters.userId = user.userId;
            }
            var rparms = removeEmptyvalueJson(parameters);
            var full_url = config.hostUrl + url + "?";
            var i = 0;
            $.each(rparms, function (key, value) {
                if (i === 0) {
                    full_url += key + "=" + value;
                    i++;
                } else {
                    full_url += "&" + key + "=" + value;
                }
            });
            $.ajax({
                type: 'GET',
                url: full_url,
                dataType: 'json',
                timeout:10000,
            }).fail(function (error) {
                console.error(error);
                dia.alert(nls.common.confirmation, nls.common.noConnection, ['OK'], function (title) {
                });
                fail(nls.common.checkNetwork);
            }).done(function (response) {
                console.log(response);
                success(response);
            });
        },
        /**
        * post请求
        * @params {String} url，request url,但是不包含host
        * @params {Object} parameters, request 的参数
        * @params {Function} fail 请求失败时的回调函数
        * @params {Function} success 请求成功时的回调函数
        * @params {jsonParam} TODO...
        * @params {Object} reqConfig 请求配置
        * example:
        * domainType: "AI" 请求domain为AI配置的host
        * requestType: ajax/native 请求方式为ajax或者native
        */
        post: function (url, parameters, fail, success, jsonParam, reqConfig) {
             var method = "post";
             var hostUrl = config.hostUrl + url;
             var defaultRequestType = config.appConfig.defaultRequestType;
             var runAsAjax = false;
             if (defaultRequestType.toLowerCase() === 'ajax') {
                 runAsAjax = true;
             }
             if (reqConfig && reqConfig.requestType) {
                    if (reqConfig.requestType.toLowerCase() === 'ajax') {
                        runAsAjax = true;
                    }
             }
             if (reqConfig && reqConfig.domainType) {
                      hostUrl = config.domainList[reqConfig.domainType] + url;
             }
             if (localStorage.getItem('login_user') !== null && !parameters.userId) {
                 var user = JSON.parse(localStorage.getItem('login_user'));
                 parameters.userId = user.userId;
             }
             console.groupCollapsed('%c%s', "color: red; background: yellow;", url);
             console.log('url: %s', hostUrl);
             console.log("method", 'post');
             console.log('parameters: %o', parameters);
             if (runAsAjax || config.appConfig.isBrowser) {
                 if (!jsonParam) {
                     jsonParam = {};
                 }
                 if(typeof(jsonParam.loading) === "undefined"){
                     $(".loadingDiv").addClass("active");
                 }
                 var asyncPra = true;
                 if(typeof(jsonParam.async) !== "undefined"){
                     asyncPra = jsonParam.async;
                 }
                 var rparms = removeEmptyvalueJson(parameters);

                 $.ajax({
                     type: method,
                     url: hostUrl,
                     dataType: 'json',
                     async: asyncPra,
                     data: rparms
                 }).fail(function (error) {
                     console.log('POST Response: %o', error);
                     console.groupEnd();
                     if (typeof(jsonParam.loading) === "undefined") {
                         $(".loadingDiv").removeClass("active");
                     }
                     dia.alert(nls.common.confirmation, nls.common.noConnection, ['OK'],
                         function () { });
                     fail(nls.common.checkNetwork);
                 }).done(function (response) {
                     console.log('POST Response: %o', response);
                     console.assert(response.code !== null, '返回数据没有code字段');
                     console.assert(response.msg !== null, '返回数据没有msg字段');
                     console.assert(response.data !== null, '返回数据没有data字段');
                     console.groupEnd();
                     if (response.code === -1 && !response.msg) {
                         response.msg =  nls.common.noConnection;
                     }
                     if(typeof(jsonParam.loading) === "undefined") {
                         $(".loadingDiv").removeClass("active");
                     }
                     success(response);
                 });
             } else {
                 native_test.nativeConnection(hostUrl, method, parameters, success, fail);
             }
        },
        code: {
            error: -1,
            countineActivity: 10000
        },
        url_base: config.hostUrl
    }
});
