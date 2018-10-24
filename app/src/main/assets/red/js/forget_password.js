

define(['jquery', 'jquerymobile', 'net','dialogs'], function($, m, net, dia) {
    // 当用户和密码输入都不为空的时候才激活登录按钮
    $('#change_password-btn').attr("disabled","disabled");
    $('#change_password-txt-newPassword-confirm').on('input', function(evt){
        if ($(this).val().length > 0) {
            $('#change_password-btn').attr("disabled",false);
        } else {
            $('#change_password-btn').attr("disabled","disabled");
        }
    });

    // 当点击登录按钮时候要做的事情
    $('#change_password-btn').on ('click', function(evt){
        //禁用按钮
        $('#change_password-btn').attr("disabled","disabled");
        if($('#change_password-txt-newPassword').val()!=$('#change_password-txt-newPassword-confirm').val()){
            dia.alert('Confirmation',"Your passwords do not match. Please try again",['OK'],function(title) {

            });
            return;
        }
        net.post('user/resetUserPassword', {
            oldPassword: $('#change_password-txt-currentPassword').val(),
            userName: localStorage['username'],
            password: $('#change_password-txt-newPassword').val()
        }, function(error){
            // 启用按钮
            $('#change_password-btn').attr("disabled",false);
        }, function(response){
            // 启用按钮
            $('#change_password-btn').attr("disabled",false);
            if (response.code != 0) {
                dia.alert('Confirmation', response.msg, ['OK'], function(title) {

                });
            } else {
                dia.alert('Thank you!', response.msg, ['OK'], function(title) {

                });
                $.mobile.newChangePage("#logon",{ transition: "slide",reverse: true,changeHash: false});
                $('#change_password-txt-currentPassword').val("");
                $('#change_password-txt-newPassword').val("");
                $('#change_password-txt-newPassword-confirm').val("");
                $('#change_password-btn').attr("disabled","disabled");
            }
        });
    });
	
	/*change device start*/
	$('#btn_device_logonNow').off('click')
        .on('click', function() {
            $.mobile.newChangePage("#logon",{ transition: "slide",reverse: true,changeHash: false});
        });
	
	$("#page_change_device").off('pageshow')
        .on( "pageshow", function( event ) {
            window.setBodyOverflow($(document.body));
            $('#change_device_content').css('height',($(window).height()-44-20));
			
		$('#device_btn_question').off('click')
				.on('click',function() {
					window.q['policy_back'] = '#page_change_device';
					$.mobile.newChangePage("#page_policy",{ transition: "slide",reverse: false,changeHash: false});
			});
			
		$('#device_btn_back').off('click')
			.on('click',function() {
				// $.mobile.goBackPage();
                $.mobile.newChangePage("#logon",{ transition: "slide",reverse: true,changeHash: false});
		});
        // window.historyView = [];
    });
	
	$('#btn_change_device').on ('click', function(evt){
		cloudSky.zBar.scan(null, function(s) {
			console.assert(s != null, '扫描给回来的数据不对:%s', s);
			console.error('扫描结果:%s', s);
			net.post('user/changeDeviceQRCode', {
				'code': s,
				'udid': device.uuid
			}, function(error){

			}, function(response){
				if (response.code == net.code.error) {
					dia.alert('Confirmation', response.msg, ['OK'], function(title) {

					});
				}else {
					console.assert(response.data != null, '扫描二维码后，服务器没有返回解码数据');
					$.mobile.newChangePage("#page_change_device",{ transition: "slide",reverse: false,changeHash: false});
				}
			});
		}, function(error) {
			console.error('扫描错误结果:%o', error);
		});
    });
	/*change device end*/
	
	/*reset passowrd change start*/
	var forgotStaffID = null;
	
	$('#btn_forgot_password').on ('click', function(evt){
		$('#forgot_pass_password').val("");
		$('#forgot_pass_sec_password').val("");
		$('#forgot_password_now').css('display', 'inline');
		$('#forgot_password_success').css('display', 'none');
		forgotStaffID = null;
		
		cloudSky.zBar.scan(null, function(s) {
			console.assert(s != null, '扫描给回来的数据不对:%s', s);
			console.error('扫描结果:%s', s);
			net.post('user/forgetPasswordQRCode', {
				code: s
			}, function(error){

			}, function(response){
				if (response.code == net.code.error) {
					dia.alert('Confirmation', response.msg, ['OK'], function(title) {

					});
				} else {
					console.assert(response.data != null, '扫描二维码后，服务器没有返回解码数据');
					//forgotWithUserinfo(response.data.userInfo);
					forgotStaffID = response.data.userInfo[0].staffId;
					$.mobile.newChangePage("#page_reset_password",{ transition: "slide",reverse: false,changeHash: false});
				}
			});
		}, function(error) {
			console.error('扫描错误结果:%o', error);
		});
    });
	
	$('#btn_reset_password').on ('click', function(evt){

        if($('#forgot_pass_password').val()!=$('#forgot_pass_sec_password').val()){
            dia.alert('Confirmation',"Your passwords do not match. Please try again.",['OK'],function(title) {

            });
            return;
        }

        net.post('user/forgetSetPassword', {
            'password': $('#forgot_pass_password').val(),
            'staffId': forgotStaffID
        }, function(error){
        }, function(response){
            if (response.code != 0) {
                dia.alert('Confirmation',response.msg,['OK'],function(title) {

                });
            } else {
              
                $('#forgot_pass_password').val("");
                $('#forgot_pass_sec_password').val("");
				forgotStaffID = null;
                $('#btn_reset_password').attr("disabled","disabled");
                $('#forgot_password_now').css('display', 'none');
                $('#forgot_password_success').css('display', 'inline');
            }
        });
    });
	
	$("#page_reset_password").off('pageshow')
        .on( "pageshow", function( event ) {
            window.setBodyOverflow($(document.body));
            $('#forgot_password_content').css('height',($(window).height()-44-20));

			$('#btn_reset_password').attr("disabled","disabled");
			
           $('#forgot_btn_question').off('click')
				.on('click',function() {
					window.q['policy_back'] = '#page_reset_password';
					$.mobile.backChangePage("#page_policy",{ transition: "slide",reverse: true,changeHash: false});
			});
            $('#forgot_btn_back').off('click')
                .on('click',function() {
                    // $.mobile.goBackPage();
                    $.mobile.backChangePage("#logon",{ transition: "slide",reverse: true,changeHash: false});
            });
            // window.historyView = [];
    });
	
	$('#forgot_pass_password').on('input', function(evt){
        if ($(this).val().length > 0
            && $('#forgot_pass_sec_password').val().length > 0) {
            $('#btn_reset_password').attr("disabled",false);
        } else {
            $('#btn_reset_password').attr("disabled","disabled");
        }
    });
    $('#forgot_pass_sec_password').on('input', function(evt){
        if ($(this).val().length > 0
            && $('#forgot_pass_password').val().length > 0) {
            $('#btn_reset_password').attr("disabled",false);
        } else {
            $('#btn_reset_password').attr("disabled","disabled");
        }
    });
	//back_slide
    $('#change_forget_content').on('swiperight',function() {

        $.mobile.backChangePage("#setting",{ transition: "slide",reverse: true,changeHash: false});
    });

	$('#btn_forgot_logonNow').off('click')
        .on('click', function() {
            $.mobile.newChangePage("#logon",{ transition: "slide",reverse: true,changeHash: false});
            $('#forgot_password_success').css('display', 'none');
            $('#forgot_password_now').css('display', 'inline');
        });
	
	/*function forgotWithUserinfo(m_user) {
        console.assert(m_user != null, '没有扫描到的用户信息');
        $('#forgot_txt_username').val(m_user[0].userName);
        $('#forgot_txt_username').attr('readonly','true');
    }*/

	/*reset passowrd change END*/
	
    $('#turn_back').on('click',function() {
        $.mobile.backChangePage("#logon_help",{ transition: "slide",reverse: true,changeHash: false});
    });
    $('#changeDevice_turn_back').on('click', function() {
        $.mobile.backChangePage("#logon_help",{ transition: "slide",reverse: true,changeHash: false});
    });

    $('#help_turn_back').on('click',function() {
        $.mobile.backChangePage("#logon",{ transition: "slide",reverse: true,changeHash: false});
    });

    $('#change_back').on('click', function() {
        $.mobile.backChangePage("#setting",{ transition: "slide",reverse: true,changeHash: false});
    });



    //设置内容高度是Header剩下的高度
    $("#forgetPassword_static").on( "pageshow", function( event ) {
        window.setBodyOverflow($(document.body));
        $('#forget_content_static').css('height',($(window).height()-44-20));
        $('#static_li').css('min-height', ($(window).height()-61-4));
        // window.historyView = [];
    });

    //changePassword页面 设置内容高度是Header剩下的高度
    $("#forgetPassword").on( "pageshow", function( event ) {
        window.setBodyOverflow($(document.body));
        $('#change_forget_content').css('height',($(window).height()-44-20));
        $('#changePassword_ul').css('min-height', ($(window).height()-61-4));
        // window.historyView = [];
    });
	
	$("#forgetPassword").on( "pagehide", function( event ) {
		$('#change_password-txt-currentPassword').val('');
        $('#change_password-txt-newPassword').val('');
		$('#change_password-txt-newPassword-confirm').val('');
		$('#change_password-btn').attr('disabled','disabled');
    });

    //
    $("#logon_help").on( "pageshow", function( event ) {
        window.setBodyOverflow($(document.body));
        $('#logon_help_content').css('height',($(window).height()-44-20));
        $('#help_li').css('min-height', ($(window).height()-61-4));
        // window.historyView = [];
    });

    $("#changed_device").on( "pageshow", function( event ) {
        window.setBodyOverflow($(document.body));
        $('#changeDevice_content').css('height',($(window).height()-44-20));
        $('#changeDevice_li').css('min-height', ($(window).height()-61-4));
        // window.historyView = [];
    });

    $('#help_forgetPassword').off('click')
        .on('click', function() {
            $.mobile.newChangePage("#forgetPassword_static",{ transition: "slide",reverse: false,changeHash: false});
        });

    $('#help_changeDevice').off('click')
        .on('click', function() {
            $.mobile.newChangePage("#changed_device",{ transition: "slide",reverse: false,changeHash: false});
        });

    function compatibility() {
        /* Logon */
        $('#title_forgot_password').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_forgot_password').css('postion', 'absulute')
            .css('width', '140px')
            .css('height','20px')
            .css('margin', '8px auto auto auto');


        /* Logon */
        $('#title_change_password').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_change_password').css('postion', 'absulute')
            .css('width', '153px')
            .css('height','20px')
            .css('margin', '8px auto auto auto');
			
		$('#title_reset_password').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_reset_password').css('postion', 'absulute')
            .css('width', '133px')
            .css('height','20px')
            .css('margin', '8px auto auto auto');
			
		$('#title_change_divice').parent()
			.css('display', 'block')
			.css('postion', 'relative');

        $('#title_change_divice').css('postion', 'absulute')
            .css('width', '195px')
            .css('height','20px')
            .css('margin', '8px auto auto auto');
			
		$('#title_device_change').parent()
		.css('display', 'block')
		.css('postion', 'relative');

        $('#title_device_change').css('postion', 'absulute')
            .css('width', '127px')
            .css('height','20px')
            .css('margin', '8px auto auto auto');
    }

    $(document).ready(function () {
        setTimeout(function() {
            // 兼容其他浏览器
            compatibility();
        },1000);
    });
});
