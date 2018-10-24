define([], function() {
    var hostUrl = {
       /* BYOD: 'http://hkl103337.hk.hsbc:7777/staff/',
        SIT: 'http://120.24.55.7:8086/staff/',
        UAT: 'https://uat.redgltc.com:8443/staff/',
        PROD: 'https://prod.redgltc.com:8443/staff/',
        DEV: 'http://139.196.120.235:7777/staff/',
        LY: 'http://192.168.88.193:8080/staff_pro/'*/
        SIT: 'http://120.79.195.92:8086/staff/',
        UAT: 'http://120.79.195.92:8888/staff/',  //2018.3迁移后的新地址
        PROD: 'http://120.79.225.162:8080/staff/',//2018.3迁移后的新地址
        WU:"http://192.168.89.11:8080/staff/"

    };
    var appConfig = {
        APP: "SIT",
        appVersion: "201706082200",
        isBrowser: !!window.navigator.userAgent.match(/chrome|Safari/),
        isDummy: false,
        defaultRequestType: 'ajax'//默认请求方式，分为native或者ajax
    };
    var domainList = {
        'AI': 'http://hkl105825.hk.hsbc:8080/',
        'face': '',
        'Chatbot': 'http://114.116.21.129:5002/'
    };
    return {
        appConfig : appConfig,
        domainList: domainList,
        hostUrl : hostUrl[appConfig.APP]
    }
});
