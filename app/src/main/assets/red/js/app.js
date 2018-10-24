/**
 * Created by steve on 14-9-18.
 */

// 配置
require.config({
    paths: {
        jquery: '../libs/jquery-1.11.1/jquery-1.11.1.min',
        jquerymobile: '../libs/jquery.mobile-1.4.4/jquery.mobile-1.4.4.min',
        config: '../libs/common/config',
        nls: '../libs/common/nls',
        EvenRegister: '../libs/common/evenRegister',
        net: './net',
        md5: './md5',
        logon: './logon',
        newsroom: './newsroom',
        active:'./active',
        forget_password: './forget_password',
        dialogs:'./dialogs',
        filter:'./filter',
        setting:'./setting',
        activity_register:'./activity_register',
        active_list:'./activity_list',
        activity_calendar_info:'./activity_calendar_info',
        activity_verify:'./activity_verify',
        activity_confirm:'./activity_confirm',
        surveyConfirm:'./survey_confirm',
        voting:'./voting',
        videoDetails:"./videoDetailed",
        mycorner:'./mycorner',
        mycornerall:'./mycornerall',
        uploadInfo:'./upload_info',
        book:'./book',
        bookrule:'./book_rule',
        bookDetailed:'./book_detail',
        bookrequest:'./book_request',
        bookconfirm:'./book_confirm',
        bookcheck:'./book_check',
        bookRecordDetail:'./bookrecord_detail',
        questionnaires:'./questionnaires',
        surveyQuestionnaires:'./survey_questionnaires',
        panle:'./panle',
        ca:'./ca',
        addRegistration:'./add_registration',
        registration:'./registration_confirm',
        registrationShow:'./registration_show',
        registrationRecord:'./registration_record',
        registrationTerm:'./registration_term',
        registrationRule:'./registration_rule',
        ca_help:'./ca_help',
	    teamRegistration:'./team_registration',
	    registrationManager:'./registration_manager',
	    swiper:'../libs/Swiper-3.4.2.0/js/swiper',
        canteen:'./canteen',
        canteenrule:'./canteen_rule',
        canteensuper:'./canteen_supplier',
        line:'./line',
        lineShow:'./line_show',
        hotline:'./hotline',
        uploadInvoice:'./upload_invoice',
	    myCornerHome: './my_corner_home',
	    assistantHome: './assistant_home',
        echarts: '../libs/echart/echarts.min',
        world: '../libs/world/world',
        profile:'./profile',
        comments:'./comments',
        order:'./order',
        eInvoice: './eInvoice',
        eInvoiceRule: './eInvoice_rule',
        eInvoiceIntroduciton: './eInvoiceIntroduction',
        eInvoicePdf: './eInvoice_pdf',
        shop:'./shop',
        rePwBId:'./reset_pd_ById',
        text:'../libs/text/text',
        shop_store:'../template/shop/shop-store.html',
        shop_detail:'../template/shop/shop-detail.html',
        shop_other:'../template/shop/shop-other.html',
        category_name:'../template/shop/category-name.html',
        club:'./club',
        artificial:'./artificial',
        mobiscroll:'../libs/MobieScroll/mobiscroll',
        mustache:'../libs/Mustache/mustache',
        introduction:'./introduction',
        my_activities:'./my_activities',
        club_firstBanner:'../template/club/club_firstBanner.html',
        club_secondBanner:'../template/club/club_secondBanner.html',
        club_activeList:'../template/club/club_activeList.html',
        club_activeDetails:'../template/club/club_activityDetails.html',
        club_surveyDetails:'../template/club/club_surveyDetails.html',
        club_survey:'../template/club/club_survey.html',
        search_info:'../template/reset_pd_ById/search-info.html',
        book_library:'../template/book/book_library.html',
        book_list:'../template/book/book_list.html',
        utils: './utils',
        MeScroll:'../libs/mescroll/mescroll.m',
        voice:'./voice',
        chatbot:'./chatbot',
        chatbot_question:'../template/chatbot/chatbot_question.html',
        chatbot_answer: '../template/chatbot/chatbot_answer.html',
        chatbot_jobs: '../template/chatbot/chatbot_jobs.html',
        shake:'./shake',
		jobPost:'./jobPost',
        integral:'./integral',
        list_item:'../template/integer/list_item.html',
        banner_title:'../template/integer/banner_title.html',
        integral_rules:'./integral_rules'
    },
      shim:{
        'mobiscroll':{
          deps:['jquery']
        },
        'MeScroll': {
          exports: 'MeScroll'
       }

    }
});

require(['nls', 'config', 'EvenRegister', 'artificial','logon', 'newsroom', 'active', 'forget_password', 'filter', 'setting', 'infomation', 'question', 'policy',
    'activity_calendar_info', 'activity_register', 'activity_verify', 'activity_confirm','voting','videoDetailed',
    'mycorner','mycornerall','book','bookrule','bookDetailed','bookrequest','bookconfirm','bookcheck','bookRecordDetail','questionnaires',
    'surveyConfirm','surveyQuestionnaires','uploadInfo','ca','add_registration','registration_confirm','registration_show','registration_record','registration_term','registration_rule','team_registration','registration_manager','echarts','canteen','canteenrule','canteensuper','line','lineShow','profile','comments','hotline','uploadInvoice','panle','world','myCornerHome', 'assistantHome','ca_help','order','eInvoice', 'eInvoiceRule', 'eInvoiceIntroduciton', 'eInvoicePdf','club','mobiscroll','mustache','text!club_firstBanner','introduction','my_activities','shop','rePwBId','voice','shake','chatbot',
    'surveyConfirm','surveyQuestionnaires','uploadInfo','ca','add_registration','registration_confirm','registration_show','registration_record','registration_term','registration_rule','team_registration','registration_manager','echarts','canteen','canteenrule','canteensuper','line','lineShow','profile','comments','hotline','uploadInvoice','panle','world','myCornerHome', 'assistantHome','ca_help','order','eInvoice', 'eInvoiceRule', 'eInvoiceIntroduciton', 'eInvoicePdf','mobiscroll','mustache','text!club_firstBanner','introduction','my_activities','shop','rePwBId','voice','shake','integral','integral_rules','jobPost', 'blank', 'card'], function() {//Redaholic
    // 全局变量开启
    window.q = {};
	// Fix menu scrolling issue
	$("body").on("touchmove", ".ui-panel-open, .ui-panel-dismiss-open", function(e) {
		e.preventDefault();
	});

	//Bind keypress chars limited control event for all username and password input field
	$("#active_txt_username,#active_pass_password,#change_password-txt-currentPassword,#change_password-txt-newPassword,#change_password-txt-newPassword-confirm,#logon_txt_username,#logon_txt_password").on("keypress",function(event){
		if(!event){
			event = window.event;
		}
		if(event.currentTarget.value.length+1>15){
			if(event.keyCode != 8){
				event.returnValue = false;
				return false;
			}
		}else{
			return true;
		}
	});

	window.scrollForAndroid = function(contentId){
		var androidScroll = null;
		if(window.navigator.userAgent.substr(window.navigator.userAgent.indexOf('Android') + 8, 3) < 4.0){
			androidScroll = new iScroll(contentId);
		}
		return androidScroll;
	}

	window.setBodyOverflow = function(body){
		if(window.navigator.userAgent.indexOf('Android')!= -1 && window.navigator.userAgent.substr(window.navigator.userAgent.indexOf('Android') + 8, 3) < 4.0){
			body.css('overflow-y','hidden !important');
		}else{
			body.css('overflow-y','hidden');
		}
	}

	window.historyView = [];
	$.mobile.newChangePage = function(to, options){
		historyView.unshift('#'+$('.ui-page-active').attr('id'));
//      if(historyView.inArray('#'+$('.ui-page-active').attr('id')) == false){
//		    historyView.unshift('#'+$('.ui-page-active').attr('id'));
//      }
        if(to == null){
            window.shouldPageRefresh.newsroom = true;
            to = "#newsroom";
        }
        if(linkdetailList.length > 0){
            if(to == "#newsroom"){
                linkdetailList = [];
                $("#video_detailed").removeClass("hrefback");
            }
        }
		$.mobile.changePage(to, options);
	}
    function inArray(value,array){
        for(var i in array){
            if(value===array[i]){
                return true;
            }
        }
        return false;
    }
	changeMenuBackFromGreenLaiSee = function( id ){
		id = id.replace('push_','#');
		if(id == '#AR'){
			cordova.exec(function(){console.error("success")}, function(){console.error("error")}, "ShowVideoPlaybackView", "showVideoPlaybackView", []);
		}else {
			if(id == '#logon') chrome.storage.internal.remove('password', function(){});
			$.mobile.newChangePage(id,{ transition: "slide",reverse: false,changeHash: false});
		}
	}

	//Compatible with render code version
	$.mobile.backChangePage = function(to, options){
        console.info(historyView.join(",")+"@@@@backChangePage@@@@"+to);
		historyView.shift();
        console.info(historyView.join(",")+"!!!!backChangePage");
        if(to == null){
            window.shouldPageRefresh.newsroom = true;
            to = "#newsroom";
        }
		$.mobile.changePage(to, { transition: "slide",reverse: true,changeHash: false});
	}

	$.mobile.goBackPage = function(){
        console.error(historyView.join(",")+"@@@@goBackPage");
		$.mobile.changePage(historyView.shift(), { transition: "slide",reverse: true,changeHash: false});
	}

	document.addEventListener("backbutton", function(e){
		if($('#errorAlert').length <= 0){
            var pageId = $('.ui-page-active').attr('id');
            if( pageId == 'game-page' || pageId == 'game-my-prize-page' ){
                $('.ui-page-active [data-role=header]').find('.back').touchend(); //这两个页面为了防止点击穿透，绑定了touchend事件
            }else{
                $('.ui-page-active [data-role=header]').find('.back').click();
            }
            // local hot line 物理按键返回后按钮依然存在的问题
            if(pageId == "lines"){
                /*localStorage.setItem("rem",1);*/
                $(".loadingGot").hide();
            }
		}

	});
	window.shouldPageRefresh = {
		newsroom: true,
        book: true,
        clubActivity: true
    };

	window.getVendorStyle = function(style) {
		var dummyStyle = document.createElement("div").style,
		    vendor = (function() {
				var vendors = "t,webkitT,MozT,msT,OT".split(","),
					t,
					i = 0,
					l = vendors.length;

				for (; i < l; i++) {
					t = vendors[i] + "ransform";
					if (t in dummyStyle) {
						return vendors[i].substr(0, vendors[i].length - 1);
					}
				}

				return false;
			})();
		vendor ? "-" + vendor.toLowerCase() + "-" : "";

		if (vendor === "") return style;

		style = style.charAt(0).toUpperCase() + style.substr(1);
		return vendor + style;
	};
	// Nick added for pull to refresh end
	// Nick added for multiple images start
    window.linkdetailList = [];
    // Nick added for multiple images end

    //add by Neil for hotline
    // window.hotlineList = {
    //     "h_001"		:	{
    //         "team"		:	"General Admin",
    //         "telNo"		:	"718630-88888",
    //         "lotusNote"	:	"General Administration China GLT"
    //     },
    //     "h_002"		:	{
    //         "team"		:	"Facility Admin",
    //         "telNo"		:	"718630-88712",
    //         "lotusNote"	:	"Facility Administration China GLT"
    //     },
    //     "h_003"		:	{
    //         "team"		:	"Technology Support",
    //         "telNo"		:	"718630-89999",
    //         "lotusNote"	:	"System Administration China GLT"
    //     },
    //     "h_004"		:	{
    //         "team"		:	"Capacity & Resources Plan",
    //         "telNo"		:	"718630-85864",
    //         "lotusNote"	:	"Capacity And Resources Plan HSDC"
    //     },
    //     "h_005"		:	{
    //         "team"		:	"Security Fraud & Risk",
    //         "telNo"		:	"718630-89002/ +86 20 3858 0101 (24hrs)",
    //         "lotusNote"	:	"Security Service China GLT"
    //     },
    //     "h_006"		:	{
    //         "team"		:	"Travel Desk",
    //         "telNo"		:	"718630-88689",
    //         "lotusNote"	:	"Travel Desk HSDC"
    //     },
    //     "h_007"		:	{
    //         "team"		:	"JLL Support",
    //         "telNo"		:	"718620-83338/ +86 20 3858 3338 (24hrs)",
    //         "lotusNote"	:	"JLL HelpdeskTKH HDPG"
    //     },
    //     "h_008"		:	{
    //         "team"		:	"HR Direct HelpDesk",
    //         "telNo"		:	"718630-40029",
    //         "lotusNote"	:	"N/A"
    //     }
    // }
});
