
define(['jquery', 'jquerymobile', 'net', 'dialogs'], function($, m, net, dia) {
    var m_user;

    function showUserWithUserinfo() {
        console.assert(m_user != null, '没有扫描到的用户信息');
        $('#active_txt_code').val(m_user[0].staffId);
        $('#active_txt_code').attr('readonly','true');
        $('#active_txt_username').val('');
		$('#active_pass_password').val('');
		$('#active_pass_sec_password').val('');
        //$(‘#active_txt_username').attr('readonly','true');
    }

    // 是否同意协议，返回true则为同意 false不同意
    function agree() {
        return ($('#checkbox_active_agree').hasClass('sel'));
    }

    $('#active_txt_username').on('input', function(evt){
        if ($('#active_txt_username').val().length > 0
            && $('#active_pass_password').val().length > 0
            && $('#active_pass_sec_password').val().length > 0
            && $('#active_txt_code').val().length > 0
            && agree()) {
            $('#btn_active').attr("disabled",false);
        } else {
            $('#btn_active').attr("disabled","disabled");
        }
    });

    $('#active_pass_password').on('input', function(evt){
        if ($(this).val().length > 0
            && $('#active_txt_username').val().length > 0
            && $('#active_pass_sec_password').val().length > 0
            && $('#active_txt_code').val().length > 0
            && agree()) {
            $('#btn_active').attr("disabled",false);
        } else {
            $('#btn_active').attr("disabled","disabled");
        }
    });
    $('#active_pass_sec_password').on('input', function(evt){
        if ($(this).val().length > 0
            && $('#active_pass_password').val().length > 0
            && $('#active_txt_username').val().length > 0
            && $('#active_txt_code').val().length > 0
            && agree()) {
            $('#btn_active').attr("disabled",false);
        } else {
            $('#btn_active').attr("disabled","disabled");
        }
    });



    $('#active_txt_code').on('input', function(evt){
        if ($(this).val().length > 0
            && $('#active_pass_password').val().length > 0
            && $('#active_pass_sec_password').val().length > 0
            && $('#active_txt_username').val().length > 0
            && agree()) {
            $('#btn_active').attr("disabled",false);
        } else {
            $('#btn_active').attr("disabled","disabled");
        }
    });

    $('#checkbox_active_agree').off('click')
        .on('click', function() {
            if ($(this).hasClass('nor'))
                $(this).removeClass('nor').addClass('sel');
            else
                $(this).removeClass('sel').addClass('nor');

            if ($('#active_txt_code').val().length > 0
                && $('#active_pass_password').val().length > 0
                && $('#active_pass_sec_password').val().length > 0
                && $('#active_txt_username').val().length > 0
                && agree()) {
                $('#btn_active').attr("disabled",false);
            } else {
                $('#btn_active').attr("disabled","disabled");
            }
        });

    //提示激活成功消息
    $('#btn_active_logonNow').off('click')
        .on('click', function() {
            $.mobile.newChangePage("#logon",{ transition: "slide",reverse: true,changeHash: false});
            $('#activity_success').css('display', 'none');
            $('#active_registe_now').css('display', 'inline');
        });

    // 当点击登录按钮时候要做的事情
    $('#btn_active').on ('click', function(evt){
        //禁用按钮
//        $('#btn_active').attr("disabled","disabled");
        if($('#active_pass_password').val()!=$('#active_pass_sec_password').val()){
            dia.alert('Confirmation',"Your passwords do not match. Please try again.",['OK'],function(title) {

            });
            return;
        }

        net.post('user/activeSetPassword', {
            staffId: $('#active_txt_code').val(),
            userName: $('#active_txt_username').val(),
            'password': $('#active_pass_password').val(),
            udid:device.uuid
        }, function(error){
            // 启用按钮
//            $('#btn_active').attr("disabled",false);
        }, function(response){
            // 启用按钮
//            $('#btn_active').attr("disabled",false);
            if (response.code != 0) {
                dia.alert('Confirmation',response.msg,['OK'],function(title) {

                });
            } else {
                $('#active_txt_code').val("");
                $('#active_txt_username').val("");
                $('#active_pass_password').val("");
                $('#active_pass_sec_password').val("");
                $('#checkbox_active_agree').removeClass('sel').addClass('nor');
                $('#btn_active').attr("disabled","disabled");
                $('#active_registe_now').css('display', 'none');
                $('#activity_success').css('display', 'inline');
            }
        });
    });

    function compatibility() {
        /* Logon */
        $('#title_active').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_active').css('postion', 'absulute')
            .css('width', '195px')
            .css('height','20px')
            .css('margin', '8px auto auto auto');
    }


    //设置内容高度是Header剩下的高度
    $("#page_activation").off('pageshow')
        .on( "pageshow", function( event ) {
			if(window.navigator.userAgent.substr(window.navigator.userAgent.indexOf('Android') + 8, 3) < 4.0){
				$('#active_registe_now li:nth-child(1)').hide();
			}
            window.setBodyOverflow($(document.body));
            $('#active_content').css('height',($(window).height()-44-20));

            // 当用户,密码,激活码输入都不为空的时候才激活 激活按钮
            $('#btn_active').attr("disabled","disabled");

            $('#active_btn_question').off('click')
                .on('click',function() {
                    window.q['policy_back'] = '#page_activation';
                    $.mobile.newChangePage("#page_policy",{ transition: "slide",reverse: false,changeHash: false});
            });
            $('#active_btn_back').off('click')
                .on('click',function() {
                    $.mobile.backChangePage("#logon",{ transition: "slide",reverse: true,changeHash: false});
            });

            showUserWithUserinfo();
            window.historyView = [];
    });


    $(document).ready(function () {
        setTimeout(function() {
            // 兼容其他浏览器
            compatibility();
        },1000);
    });

    return {
        showUser: function(user) {
            m_user = user;
        }
    }
});
