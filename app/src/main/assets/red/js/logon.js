

define(['jquery', 'jquerymobile', 'net', 'md5','dialogs', 'active','videoDetailed','bookDetailed','team_registration', 'config'], function($, m, net, md5, dia, active,videodetail,bookdetail,teamregistration, config) {
    // 当用户和密码输入都不为空的时候才激活登录按钮
    var push = false;
    // $('#btn_logon').attr("disabled","disabled");
    // $('#logon_txt_username').on('input', function(evt){
    //     if ($(this).val().length > 0 && $('#logon_txt_password').val().length > 0) {
    //         $('#btn_logon').attr("disabled",false);
    //     } else {
    //         $('#btn_logon').attr("disabled","disabled");
    //     }
    // });
    // $('#logon_txt_password').on('input', function(evt){
    //     if ($('#logon_txt_username').val().length > 0 && $(this).val().length > 0) {
    //         $('#btn_logon').attr("disabled",false);
    //     } else {
    //         $('#btn_logon').attr("disabled","disabled");
    //     }
    // });

    $('#scanQRCode').on('click', function() {
        cloudSky.zBar.scan(null, function(s) {
            net.post('user/activeQRCode', {
                code: s,
                udid:device.uuid
            }, function(error){

            }, function(response){
                if (response.code == net.code.error) {
                    dia.alert('Confirmation', response.msg, ['OK'], function(title) {
                    });
                } else if (response.code == net.code.countineActivity) {
                    active.showUser(response.data.userInfo);
                    $.mobile.newChangePage("#page_activation",{ transition: "slide",reverse: false,changeHash: false});
                } else {
                    console.assert(response.data != null, '扫描二维码后，服务器没有返回解码数据');
                    active.showUser(response.data.userInfo);
                    $.mobile.newChangePage("#page_activation",{ transition: "slide",reverse: false,changeHash: false});
                }
            });
        }, function(error) {
        });

    });

    // 当点击登录按钮时候要做的事情
    $('#btn_logon').on ('click', function(evt){
        // $('#logon_txt_username').blur();
        // $('#logon_txt_password').blur();
        // //禁用按钮
        // $('#btn_logon').attr("disabled","disabled");
        // setTimeout(function(){
        //     getUserLogin();
        // },300);
        $.mobile.newChangePage("#newsroom",{ transition: "none",reverse: false,changeHash: false});
    });

    var contrul = true;
    if (contrul) {
            //IBecon监听
            //monitorIBecon();
    }

    function monitorIBecon() {
        net.post('beacon/listBeacon',{
                'server':1
            } ,
            function(error){

            }, function(response){
                if (response.code != 0) {
                } else {
                    var beacons = [];
                    $.each(response.data.beacon, function(index, val){
                        var bacon = {};
                        bacon['proximityUUID'] =  val.proximityUUID;
                        bacon['major'] = val.major ;
                        bacon['minor'] = val.minor ;
                        bacon['identifier'] = val.major + val.minor;
                        bacon['in_distance'] = val.in_distance;
                        bacon['pop_up_message'] = val.pop_message;
                        beacons.push(bacon);
                    });
                    locateIbeaconas.checkIbeacon( beacons,
                        function(data) {
                            getNews(data);
                            contrul = false;
                        },
                        function(error) {
                        });
                }
            });
    }

    //获取新闻
    function getNews(data) {
        net.post('beacon/listNews',{
                'beacon.proximityUUID': data.proximityUUID,
                'beacon.major': data.major,
                'beacon.minor': data.minor
            },
        function(error) {

        }, function(response) {
                if(response.code != 0) {

                } else {
                    if (response.data.news.length < 1)
                        return;

                    findNewBeacon(data, response.data.news, function(news) {
                        // noticifation user
                        if (q['user'] != null) {
                            newsdetail.showDetailWithNew(news);
                            $.mobile.newChangePage("#newsroom_detailed",{ transition: "slide",reverse: false,changeHash: false});
                            setTimeout(function(){
                                hiddenSplash();
                            }, 1000);
                        } else {
                            newsdetail.showDetailWithNew(news);
                            $.mobile.newChangePage("#logon",{ transition: "slide",reverse: false,changeHash: false});
                            setTimeout(function(){
                                hiddenSplash();
                            }, 1000);
                        }
                    });
                }
            });
    }

    /**
     * 寻找新Beacon
     {
       "cache_beacons_news": [
         {
           "beacon": {
             "proximityUUID": "xxx",
             "major": "000000",
             "minor": "000000",
             "identify": "xxx000000000000"
           },
           "news": {
             "news_id": "",
             "title": "",
             "content": ""
           },
           "update_time": 0
         },
         ...
       ]
     }
     * @param beacon
     * @param news
     */
    function findNewBeacon(beacon, news, findNewCallback) {
        console.assert(news != null ,'news不能为空');
        chrome.storage.local.get('cache_beacons_news', function(val) {
            var needDelIndex = null;
            if (!$.isEmptyObject(val.cache_beacons_news)) {
                $.each(val.cache_beacons_news, function(index, beacon_new) {
                    if (beacon_new.beacon.proximityUUID == beacon.proximityUUID
                        && beacon_new.beacon.major == beacon.major
                        && beacon_new.beacon.minor == beacon.minor) {
                        if (beacon_new.news.news_id == news.news_id) {
                            if ((new Date().getTime()/1000) - beacon_new.update_time > 3 * 3600) {
                                beacon_new.update_time = new Date().getTime() / 1000;
                                if ($.isFunction(findNewCallback)) {
                                    findNewCallback(news);
                                }
                            }
                            return;
                        } else {
                            // 标记哪个需要被删除
                            needDelIndex = index;
                            if ($.isFunction(findNewCallback)) {
                                findNewCallback(news);
                            }
                        }
                    }
                });
                // 删除
                val.cache_beacons_news.splice(needDelIndex,1);
                // 添加
                var iBeacon_news = {'beacon' : beacon,'news' : news,'update_time':new Date().getTime() / 1000 };
                val.cache_beacons_news.push(iBeacon_news);
                console.error(val.cache_beacons_news);
                if (!$.isEmptyObject(needDelIndex)) {
                    chrome.storage.local.set({'cache_beacons' : val.cache_beacons_news});
                }
            } else {
                var cache_beacons_news = [];
                // 添加
                var iBeacon_news = {'beacon' : beacon,'news' : news,'update_time':new Date().getTime() / 1000 };
                cache_beacons_news.push(iBeacon_news);
                chrome.storage.local.set({'cache_beacons' : cache_beacons_news});
                chrome.storage.local.get('cache_beacons',function(obj) {
                });
                if ($.isFunction(findNewCallback)) {
                    findNewCallback(news);
                }
            }
        });
    }


    var getBookDetailInfo = function(){
        var bookId = $(this).attr("id");
        $("#book_detail_listview").attr("bookid",bookId) ;
        $("#book_detail").page();
        $.mobile.newChangePage("#book_detail",{ transition: "slide",reverse: false,changeHash: false});
        setTimeout(function () {
            hiddenSplash();
        }, 1000);
    };

    var getCaDetailInfo = function(){
        teamregistration.show_registration();
        $.mobile.newChangePage("#team_registration_records",{ transition: "slide",reverse: false,changeHash: false});
        setTimeout(function () {
            hiddenSplash();
        }, 1000);
    };


    var getDetailInfo = function(data){
        if (data.staff_type == "mycorner") {
            $("#mycorner").page();
            $.mobile.newChangePage("#mycorner", { transition: "slide", reverse: false, changeHash: false});
            setTimeout(function () {
                hiddenSplash();
            }, 1000);
        }
        else if (data.staff_type == "currentBook") {
            $("#bookrecord_detail").page();
            $.mobile.newChangePage("#bookrecord_detail", { transition: "slide", reverse: false, changeHash: false});
            setTimeout(function () {
            hiddenSplash();
        }, 1000);
        }
        else if(data.staff_type == "reminder") {
            getBookDetailInfo(data.staff_id);
        }
        else if(data.staff_type == "CA") {

            getCaDetailInfo(data.staff_id);
        }
        else {
            var postData = {};
            var type = data.staff_type;
            var command = null;
            postData['appOrPCFlag'] = "APP";
            postData['userId'] = q['user'].userId;
            if (type == "new") {
                postData['newsId'] = data.staff_id;
                command = "news/getDetialInfo";
            }
            else if (type == "activity"|| type == "regActivity") {
                postData['activityId'] = data.staff_id;
                command = "activity/getDetialInfo";
            }
            else if (type == "survey") {
                postData['survey_id'] = data.staff_id;
                command = "survey/getSurveyDetial";
            }
            if (command == null) {
                $.mobile.newChangePage("#newsroom", { transition: "slide", reverse: false, changeHash: false});
                setTimeout(function () {
                    hiddenSplash();
                }, 1000);
            }
            else {
                net.post(command, postData, function (error) {
                }, function (response) {
                    if (response.code != 0) {
                        dia.alert('Confirmation', response.msg, ['OK'], function(title) {
                        });
                    }
                    else {
                        var infoObj = null;
                        var page = null;
                        var wrapper = null;
                        if (type == "new") {
                            infoObj = response.data.news;
                        }
                        else if (type == "activity" || type == "regActivity") {
                            infoObj = response.data.activity;
                        }
                        else if (type == "survey") {
                            infoObj = response.data.survey;
                        }
                        var initPageLoading = function (wrapper) {
                            var $wrapper = $("#wrapper_comments"),
                                $pullDownEl = $wrapper.find("#pullDown_comments");
                            var $pullDownLabel = $pullDownEl.find(".pullDownLabel");
                            if ($wrapper.find("ul").html()) {
                                $wrapper.find(".scroller").css(window.getVendorStyle("transform"), "translate(0,0)");
                                $pullDownEl.attr("class", "loading");
                                $pullDownLabel.text("Loading...")
                            }
                        }
                        var pageFrom = "#newsroom";
                         if(type == "regActivity"){
                            pageFrom = "#mycorner";
                        }
                        videodetail.from(pageFrom);
                        $("#video_detailed").page();
                        $('#video_detailed_listview').empty();
                        $('#video_listview_comments').empty();
                        $("#video_detailed .praises_desc i").removeClass("praises_icon_no");
                        $("#video_detailed .add_comment").hide();
                        $("#video_detailed .news_commentarea").hide();
                        if ($("#video_detailed .addcomments_state").hasClass("exsit")) {
                            $("#video_detailed .no_comment").removeClass("exsit");
                        }
                        $("#commentinfo_video").val("");
                        $("span.video_textlength").html(0);
                        if ($("#video_detailed .addcomments_state").hasClass("canclecomments_icon")) {
                            $("#video_detailed .addcomments_state").addClass("addcomments_icon");
                            $("#video_detailed .addcomments_state").removeClass("canclecomments_icon");
                        }
                        infoObj.pageId = $("#newsroom").attr('pageId');;
                        videodetail.showDetailWithNew(infoObj);
                        var commentAmount = infoObj.commentAmount ? infoObj.commentAmount : 0;
                        videodetail.showCommentsContent(commentAmount);
                        initPageLoading("wrapper_comments");
                        $.mobile.newChangePage("#video_detailed", { transition: "slide", reverse: false, changeHash: false});
                        setTimeout(function () {
                            hiddenSplash();
                        }, 1000);
                    }
                }, {async: false});
            }
        }
    }
    function pushData(data){
        var type = data.staff_type;
        if(type == "new" || type == "activity" || type == "survey"|| type == "regActivity") {
            $("#video_detailed_listview").addClass("push");
        }
        else if(type == "currentBook") {
            $("#bookrecord_detail_listView").addClass("push") ;
        }
        else if(type == "mycorner") {
            $("#corner_content_height").addClass("push") ;
        }
        else if(type == "reminder") {
            $("#book_detail_listview").addClass("push") ;
        }
        else if(type == "CA") {
            $("#team_ul").addClass("push") ;
        }
        if (q['user'] != null) {
            getDetailInfo(data);
        } else {
            localStorage['staff_type'] = data.staff_type;
            localStorage['staff_id'] = data.staff_id;
            $.mobile.newChangePage("#logon",{ transition: "slide",reverse: false,changeHash: false});
            setTimeout(function(){
                hiddenSplash();
            }, 1000);
        }
    }
    function compatibility() {
        /* Logon */
        $('#title_logon_on').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_logon_on').css('postion', 'absulute')
            .css('width', '60px')
            .css('height','20px')
            .css('margin', '8px auto auto auto');
    }

    function getMenuPanle(flag){
        /*if($("ul#panel_ul li.panle_pushmenu").size()){
            $("ul#panel_ul li.panle_pushmenu").remove();
        }
        var menuArr = [];*/
        var devicePixelRatio = parseInt(window.devicePixelRatio);
        net.post('user/getMenuInfo',{'server':1}, function (error) {
            if($("ul#panel_ul li.panle_pushmenu").size() == 0){
                $('#btn_logon').attr("disabled",false);
                $('#loading_page').css('display','none');
            }
        }, function (response) {
            // var menuInfos = response.data.MenuInfo;
            var Qrcodepath = response.data.Qrcodepath_1x;
            //$("#panel_ul").attr("panle_menu_size",menuInfos.length);
            /*$.each(menuInfos,function(index,menuInfo){
                var name = menuInfo.name;
                var id = menuInfo.id;
                if(devicePixelRatio < 1){
                    devicePixelRatio = 1;
                }
                else{
                    devicePixelRatio = parseInt(devicePixelRatio);
                }
                if(devicePixelRatio == 1){
                    var img ="url('"+menuInfo.pic_1x+"')";
                }
                else if(devicePixelRatio == 2){
                    var img ="url('"+menuInfo.pic_2x+"')";
                }
                else{
                    var img ="url('"+menuInfo.pic_3x+"')";
                }
                var borderLi = "";
                var borderbtm = "";
                if(index == 0)
                {
                    borderLi = "border-width: 0px 0 0;"
                }
                else if(index == parseInt(menuInfos.length)-1){
                    borderbtm = "border-width: 1px 0 1px 0;border-style: solid; border-color:#fff;"
                }
                else{
                    borderLi = "border-width: 1px 0 0; border-style: solid; border-color:#fff;"
                }
                var menuHtml = '\<li class="panle_pushmenu" id="'+id+'" \style="'+borderLi +borderbtm+'\ background-color: #f26647;color: #ffffff;padding: 0px;font-family: Arial;font-size: \
                    16px;font-weight: normal;height: 52px;"><div class="ui-grid-a" style="height:100%;line-height: 52px"><div class="ui-block-a" \
                    style="width: 20%;margin: 0 auto;height:100%;"><div style="width: 52px;height:52px;background-repeat: no-repeat; background-position: center; \
                    background-image: '+img+';\ background-size: 38px;"></div>\
                    </div><div class="ui-block-b" style="width: 80%"><span style="font-family: Arial;font-size: 16px;font-weight: normal;line-height:\
                     3;text-shadow: none">'+name+'\</span></div></div></li>';
                menuArr.push(menuHtml);
            });*/
            // $("ul#panel_ul li:eq(0)").before(menuArr.join(""));
            if(devicePixelRatio < 1){
                devicePixelRatio = 1;
            }else{
                devicePixelRatio = parseInt(devicePixelRatio);
            }
            if(devicePixelRatio == 1){
                Qrcodepath = response.data.Qrcodepath_1x;
            }else if(devicePixelRatio == 2){
                Qrcodepath = response.data.Qrcodepath_2x;
            }else{
                Qrcodepath = response.data.Qrcodepath_3x;
            }
            $("#infomation #qrcodeShared").html('<img style="width:100%;" src="'+Qrcodepath+'" />');
            getUserLogin(flag);
        },{async:false});
    }
    function getUserLogin(flag){
        if(flag){
            chrome.storage.internal.get({"username":'',"password":''}, function(data){
                if(data.password && data.username){
                    $('#loading_page').css('display','block');
                    net.post('user/loginUser', {
                        userName: data.username,
                        password: md5.md5(data.password),
                        udid:device.uuid
                    }, function(error){
                        q['user'] = null;
                        $('#btn_logon').attr("disabled",false);
                        $('#loading_page').css('display','none');
                    }, function(response){
                        // 启用按钮
                        $('#btn_logon').attr("disabled",false);
                        if (response.code != 0) {
                            q['user'] = null;
                            $('#btn_logon').attr("disabled",false);
                            $('#loading_page').css('display','none');

                        } else {
                            q['user'] = response.data.user;
                            if(q['user'].isAdmin  &&  q['user'].isAdmin == "Y") {
                                $("div.catlog_content div.check_code_image").show();
                            }else{
                                $("div.catlog_content div.check_code_image").hide();
                            }
                            var hiddenMenus = response.data.hiddenMenu;
                            if(hiddenMenus){
                                $("#panel_ul").attr("panle_menu_size",$("#panel_ul").attr("panle_menu_size")-hiddenMenus.length);
                                $.each(hiddenMenus,function(index,hiddenMenu){
                                    $("ul#panel_ul li#"+hiddenMenu).remove();
                                });
                            }
                            localStorage.setItem('login_user', JSON.stringify(response.data.user));
                            localStorage['username'] = response.data.user.userName;
                            localStorage['rem'] = response.data.user.remember;
                        }
                        $('#loading_page').css('display','none');

                        //e-invoice判断插件
                        eInvoiceUploadPlugin.enterMethod(null, function(s){
                            if(s == 'Normal'){
                                null;
                            } else if(s == 'Invoke'){
                                //$("#newsroom").attr('invoiceRedirect', 'true');
                                eInvoiceUploadPlugin.uploadInvoice(q['user'].userId, function(s){
                                    if(s == 'uploadSuccess'){
                                        $.mobile.newChangePage("#uploadinvoice",{ transition: "slide",reverse: false,changeHash: false});
                                    } else if(s == 'eInvoice'){
                                        $.mobile.newChangePage("#uploadinvoice",{ transition: "slide",reverse: false,changeHash: false});
                                    } else if(s == 'rule'){
                                        $("#eInvoice_rule").attr('fromNative', 'true');
                                        $.mobile.backChangePage("#eInvoice_rule",{ transition: "slide",reverse: false,changeHash: false});
                                    } else {
                                        $.mobile.newChangePage("#uploadinvoice",{ transition: "slide",reverse: false,changeHash: false});
                                    }
                                },function(error){
                                });
                            }
                        }, function(error){

                        });
                    },{async:false});
                }
            });
        }
        else{
            net.post('user/loginUser', {
                userName: $('#logon_txt_username').val(),
                password: md5.md5($('#logon_txt_password').val()),
                udid: device.uuid,
            }, function (error) {
                // 启用按钮
                q['user'] = null;
                $('#btn_logon').attr("disabled", false);
            }, function (response) {
                // 启用按钮
                $('#btn_logon').attr("disabled", false);
                if (response.code != 0) {
                    dia.alert('Confirmation', response.msg, ['OK'], function (title) {

                    });
                } else {
                    q['user'] = response.data.user;
                    localStorage.setItem('login_user_photo', q['user'].photo);
                    if (q['user'].isAdmin  &&  q['user'].isAdmin == "Y") {
                        $("div.catlog_content div.check_code_image").show();
                    }
                    else {
                        $("div.catlog_content div.check_code_image").hide();
                    }
                    var hiddenMenus = response.data.hiddenMenu;
                    if(hiddenMenus){
                        $("#panel_ul").attr("panle_menu_size",$("#panel_ul").attr("panle_menu_size")-hiddenMenus.length);
                        $.each(hiddenMenus,function(index,hiddenMenu){
                            $("ul#panel_ul li#"+hiddenMenu).remove();
                        });
                    }
                    //保存用户名
                    localStorage.setItem('login_user', JSON.stringify(response.data.user));
                    //localStorage['username']=$('#logon_txt_username').val();
                    localStorage['username']=response.data.user.userName;
                    localStorage['rem'] = response.data.user.remember;
                    chrome.storage.internal.set({'username':$('#logon_txt_username').val(),'password':$('#logon_txt_password').val()}, function(data){if(data==0){console.error("Set username success!");}});
                    $('#logon_txt_username').val("");
                    $('#logon_txt_password').val("");
                    $('#btn_logon').attr("disabled","disabled");

                    //每次登录新用户 清空本地 tags 的存储
                    localStorage['selected_tags'] = '';
                    if (config.appConfig.isBrowser) {
                         $.mobile.newChangePage("#newsroom",{ transition: "slide", reverse: false, changeHash: false});
                        setTimeout(function(){
                            hiddenSplash();
                        }, 1000);
                    }

                    //根据e-invoice进入方式来进行登录
                    eInvoiceUploadPlugin.enterMethod(null, function(s){
                        if(s == 'Normal'){
                            //按照正常方式登录
                            if($("#video_detailed_listview").hasClass("push")
                                    || $("#bookrecord_detail_listView").hasClass("push")|| $("#corner_content_height").hasClass("push")|| $("#book_detail_listview").hasClass("push")|| $("#team_ul").hasClass("push")
                                    ){
                                    getDetailInfo({'staff_type':localStorage['staff_type'],'staff_id':localStorage['staff_id']});
                                    localStorage['staff_type'] = "";
                                    localStorage['staff_id'] ="";
                                }
                                else{
                                    $.mobile.newChangePage("#newsroom",{ transition: "slide",reverse: false,changeHash: false});
                                    setTimeout(function(){
                                        hiddenSplash();
                                    }, 1000);
                                }
                        } else if(s == 'Invoke'){
                            //$("#newsroom").attr('invoiceRedirect', 'true');
                            eInvoiceUploadPlugin.uploadInvoice(q['user'].userId, function(s){
                                if(s == 'uploadSuccess'){
                                    $.mobile.newChangePage("#uploadinvoice",{ transition: "slide",reverse: false,changeHash: false});
                                } else if(s == 'eInvoice'){
                                    $.mobile.newChangePage("#uploadinvoice",{ transition: "slide",reverse: false,changeHash: false});
                                } else if(s == 'rule'){
                                    $("#eInvoice_rule").attr('fromNative', 'true');
                                    $.mobile.backChangePage("#eInvoice_rule",{ transition: "slide",reverse: false,changeHash: false});
                                } else {
                                    $.mobile.newChangePage("#uploadinvoice",{ transition: "slide",reverse: false,changeHash: false});
                                }
                            },function(error){

                            });
                        }
                    }, function(error){
                        alert(error);

                    });

                }
            });
        }
    }

    function openInBrowser(href) {
        console.log(href);
        var data = {
            url: href
        }
        NativeBrowser.openNativeBrowser(data,function (v) {
            console.log(v);
        },function (err) {
            console.log(err);
        });
    }

    $(document).ready(function () {
        $('#video_detailed').on('click', 'div.content_href a', function(evt){
            evt.preventDefault();  // 防止a标签跳转
            var menuId = $('.ui-page-active').attr('id');
            var id = $(this).attr("id");
            var type = $(this).attr("type");
            // 外部链接走 native browser (将下面注释打开即可)
            /*
            if(!(id && type)){
                var link = $(this).attr("href");
                (link) ? openInBrowser(link) : '' ;
                return false;
            }
            */
            var postData = {};
            var command = null;
            postData['appOrPCFlag'] = "APP";
            postData['userId'] = q['user'].userId;
            if (type == "news") {
                postData['newsId'] = id;
                command = "news/getDetialInfo";
            }
            else if (type == "activity") {
                postData['activityId'] = id;
                command = "activity/getDetialInfo";
            }
            else if (type == "survey") {
                postData['survey_id'] = id;
                command = "survey/getSurveyDetial";
            }
            net.post(command, postData, function (error) {

            }, function (response) {
                if (response.code != 0) {
                    dia.alert('Confirmation',response.msg,['OK'],function(title) {
                    });
                }
                else {
                    var linkid = $("#"+menuId+" .content_href").attr("id");
                    var linktype = $("#"+menuId+" .content_href").attr("type");
                    var beforepage = $("#"+menuId+" .content_href").attr("beforepage");
                    var linkInfo = {"id":linkid,"type":linktype};
                    var pageId = $("#newsroom").attr('pageId');
                    if(linkdetailList.length == 0){
                        linkdetailList.push(beforepage);
                    }
                    linkdetailList.push(linkInfo);
                    var infoObj = null;
                    var flaghtml = "video";
                    if (type == "news") {
                        infoObj = response.data.news;
                    }
                    else if (type == "activity") {
                        infoObj = response.data.activity;
                    }
                    else if (type == "survey") {
                        infoObj = response.data.survey;
                    }
                    var initPageLoading = function (wrapper) {
                        var $wrapper = $("#" + wrapper),
                            $pullDownEl = $wrapper.find("#pullDown");

                            $pullDownEl = $wrapper.find("#pullDown_comments");
                        var $pullDownLabel = $pullDownEl.find(".pullDownLabel");
                        if ($wrapper.find("ul").html()) {
                            $wrapper.find(".scroller").css(window.getVendorStyle("transform"), "translate(0,0)");
                            $pullDownEl.attr("class", "loading");
                            $pullDownLabel.text("Loading...")
                        }
                    }
                    $("#"+flaghtml+"_detailed").page();
                    $('#'+flaghtml+'_detailed_listview').empty();
                    $('#'+flaghtml+'_listview_comments').empty();
                    $('#'+flaghtml+'_detailed .praises_desc i').removeClass("praises_icon_no");
                    $("#"+flaghtml+"_detailed .add_comment").hide();
                    $("#"+flaghtml+"_detailed .news_commentarea").hide();
                    if ($("#"+flaghtml+"_detailed .addcomments_state").hasClass("exsit")) {
                        $("#"+flaghtml+"_detailed .no_comment").removeClass("exsit");
                    }
                    $("#commentinfo_"+flaghtml).val("");
                    $("span."+flaghtml+"_textlength").html(0);
                    if ($("#"+flaghtml+"_detailed .addcomments_state").hasClass("canclecomments_icon")) {
                        $("#"+flaghtml+"_detailed .addcomments_state").addClass("addcomments_icon");
                        $("#"+flaghtml+"_detailed .addcomments_state").removeClass("canclecomments_icon");
                    }
                    infoObj.pageId = pageId;
                    videodetail.from("#"+menuId);
                    videodetail.showDetailWithNew(infoObj);
                    var commentAmount = infoObj.commentAmount ? infoObj.commentAmount : 0;
                    videodetail.showCommentsContent(commentAmount);
                    initPageLoading("wrapper_comments");
                    $.mobile.newChangePage("#video_detailed", { transition: "slide", reverse: false, changeHash: false});

                }
            }, {async: false});
        });
        getMenuPanle(true);
        setTimeout(function() {
            window.setBodyOverflow($(document.body));
            $('#logon_content').css('height',($(window).height()-44-20));
            $('.input').css({'border':'solid 1px #D2D2D2'});
            // 兼容其他浏览器
            compatibility();
        },1000);

        setTimeout(function(){
            jumpPagePush();
        }, 3000);
    });

    function hiddenSplash() {
        $('#loading_page').css('display', 'none');
        splash.hidden(null, function(){
        }, function(){
        });
    }

    function jumpPagePush(){
        var u = navigator.userAgent, app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
        if(isAndroid){
            splash.pushJumpToPage("XlUtlnrfb7k34BGf2kM2foG9",
                function(data){
                    push = true;
                    pushData(data);
                },
                function(error) {
            });
        }
        else{
            pushJumpPage.pushJumpToPage("XlUtlnrfb7k34BGf2kM2foG9",
                function(data){
                    push = true;
                    pushData(data);
                },
                function(error) {
            });
        }
        setTimeout(function(){
            if(q['user'] != null && push == false){
                $.mobile.newChangePage("#newsroom",{ transition: "slide",reverse: false,changeHash: false});
                setTimeout(function(){
                    hiddenSplash();
                }, 1000);
            }
            else if(q['user'] == null && push == false){
                setTimeout(function(){
                    hiddenSplash();
                }, 1000);
            }
            push = false;
        },3000);
    }
    //设置内容高度是Header剩下的高度
    $("#logon").on( "pageshow", function( event ) {
        // chrome.storage.internal.get("username", function(data){
        //     if(data.username){
        //         $('#logon_txt_username').val(data.username);
        //     }else if(localStorage['username']){
        //         $('#logon_txt_username').val(localStorage['username']);
        //     }else{
        //         $('#logon_txt_username').val("");
        //     }
        // });
        // $('#btn_logon').attr("disabled","disabled");
        // $('#logon_txt_password').val("");

        // 点击info按钮
        $('#btn_logon_infomation').off('click').
            on('click', function() {
                window.q['infomation_back'] = '#logon';
                $.mobile.newChangePage("#infomation",{ transition: "slide",reverse: false,changeHash: false});
            });

        window.historyView = [];
    });
});
