/**
 * Created by fannie on 2017/1/22.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs','panle'], function($, m, net, dia,panle) {
    function profile_show() {
        var postData = {};
        postData['userId'] = q['user'].userId;
        net.post('myCorner/getMyprofile',postData,function(error){},function(response){
            if(response.code != 0){
                $('#profile_photo .me_photo').addClass('mePhoto');//添加默认图片
                dia.alert('Confirmation',response.msg,['OK'],function(title){

                });
            }else{
                var myProfile = response.data.myProfile,
                    photo = myProfile.photo,//照片
                    cName = myProfile.chinese_name,//中文名
                    eName = myProfile.english_name,//英文名
                    staffId = myProfile.staffId,
                    gender = myProfile.gender,
                    i_d_card = myProfile.i_d_card,
                    telephone = myProfile.telephone;

                if(gender === '' || gender === null){
                    gender = 'Your gender';
                }
                if(i_d_card === '' || i_d_card === null){
                    i_d_card = 'Your ID card No.';
                }
                if(telephone === '' || telephone === null){
                    telephone = 'Your telephone No.';
                }
                if(cName == "" || cName == null){
                    $('.pro_name').text("中文名");
                }else{
                    $('.pro_name').text(cName);
                }
                if(photo == "" || photo == null){
                    $('#profile_photo .me_photo').addClass('mePhoto');
                }else{
                    $('#profile_photo .me_photo').html('<img src="'+photo+'" style="width:50px;height:50px;">');
                }

                if (gender === 'male'){
                    gender = 'Male';
                } else if (gender === 'female') {
                    gender = 'Female';
                }

                $('.pro_Yname').text(eName);
                $('.pro_staffId').text(staffId);
                $('.profile-gender .profile-item-value span').text(gender);
                $('.profile-idCard .profile-item-value span').text(i_d_card);
                $('.profile-tel .profile-item-value span').text(telephone);
            }
        })
    }

    $('#profile-edit').off('click').on('click', function () {
        var $self = $(this),
            _selfText = $self.text(),
            idCardNo = $('.profile-idCard .editArea').siblings('span').text(),
            telNo = $('.profile-tel .editArea').siblings('span').text();

        if (_selfText === 'Edit') {
            $('.profile-gender .profile-item-value input[value="' + $('.profile-gender .editArea').siblings('span').text().toLowerCase() + '"]').prop('checked', true);
            if (idCardNo !== 'Your ID card No.') {
                $('.profile-idCard .profile-item-value input').val(idCardNo);
            }
            if (telNo !== 'Your telephone No.') {
                $('.profile-tel .profile-item-value input').val(telNo);
            }

            $self.text('Cancel');
            $('.profile-item-value .editArea').show().siblings('span').hide();
            $('.js-profileSubmit').show();
        } else {
            $self.text('Edit');
            $('.profile-item-value .editArea').hide().siblings('span').show();
            $('.js-profileSubmit').hide();
        }
    });
    /**
     * isCardNo 身份证格式的校验
     * @param card 证件号
     * @returns {boolean}
     */
    function isCardNo(card) {
        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return reg.test(card);
    }
    function isTelNo(telNo) {
        // 手机号第一位是【1】开头，第二位则则有【3,4,5,7,8】，第三位则是【0-9】，第三位之后则是数字【0-9】，也许这个第二位代码可能随时增加一个，比如以16开头呢？19开头呢？所以还可以不验证第二位规则。
        var reg = /^1[0-9]{10}$/;
        return reg.test(telNo);
    }

    $('.js-profileSubmit').off('click').on('click', function (event) {
        var url = 'user/updateUser',
            param = {},
            idCardNo = $('.profile-idCard input').val(),
            telNo = $('.profile-tel input').val();
        var userMsg = JSON.parse(localStorage.getItem('login_user'));

        if (!isCardNo(idCardNo)) {
            dia.alert('Oops', 'The ID card is not in the correct format', ['Ok'], function () {

            });
            return false;
        }
        if (!isTelNo(telNo)) {
            dia.alert('Oops', 'The telephone is not in the correct format', ['Ok'], function () {

            });
            return false;
        }

        param['user.gender'] = $('.profile-gender :checked').val();
        param['user.i_d_card'] = idCardNo;
        param['user.telephone'] = telNo;
        param['user.userId'] = q['user'].userId;

        userMsg.gender = param['user.gender'] ? param['user.gender'] : '';
        userMsg.i_d_card = param['user.i_d_card'] ? param['user.i_d_card'] : '';
        userMsg.telephone = param['user.telephone'] ? param['user.telephone'] : '';

        net.post(url, param, function (error) {

        }, function (response) {
           if (response.code === 0) {
               // save localStroy
               $('.profile-gender .profile-item-value span').text($('.profile-gender :checked').val() === 'male' ? 'Male' : 'Female');
               $('.profile-idCard .profile-item-value span').text($('.profile-idCard input').val());
               $('.profile-tel .profile-item-value span').text($('.profile-tel input').val());

               localStorage.setItem('login_user', JSON.stringify(userMsg));
               dia.alert('Confirmation', 'Your info is updated success!', ['Ok'], function () {
                    // 隐藏编辑相关的信息
                   $('#profile-edit').click();
               });
           } else {

           }
        });
        event.preventDefault();
        event.stopPropagation();
    })

    $('#profile_photo').off('click').on('click',function(){
        var img = $('#profile_photo .me_photo').find("img").attr("src");
        var postData = [q['user'].userId,img];
        iconUpload.iconNotes(postData,
            function(data){
                if(data){
                    var url = data;
                    if($('#profile_photo .me_photo').hasClass("mePhoto")){
                        $(this).removeClass("mePhoto");
                        $(this).html('<img src="'+url+'" style="width:50px;height:50px;">');
                    }else{
                        $('#profile_photo .me_photo').find("img").attr("src",url);
                    }
                }
                // profile_show();
                // $.mobile.newChangePage("#profile",{ transition: "slide",reverse: false,changeHash: false});
            },
            function(error) {

            });
    });

    $("#profile").on( "pagecreate", function() {
        $( "body > [data-role='panel']" ).panel();
        $( "body > [data-role='panel'] [data-role='listview']" ).listview();
    });

    $('#profile-menu').off('click').on('click',function () {
        var toPage = '#' + $('#profile').attr('js-pagefrom');
        $.mobile.newChangePage(toPage,{ transition: "slide",reverse: true,changeHash: false});
    });
    //changePassword页面 设置内容高度是Header剩下的高度
    $("#profile").on( "pagebeforeshow", function( event ) {
        $('#news_footer').hide();
        window.shouldPageRefresh.newsroom = true;
        $('#profile_content').css('height', ($(window).height()-44-20));
        $('#profile_content_info').css('min-height', ($(window).height()-44-20));
        // window.historyView = [];
        profile_show();
    });
    $("#profile").on('pagebeforehide', function( event ) {
        if ($('#profile-edit').text() === 'Cancel') {
            $('#profile-edit').click();
        }
    });
    function compatibility() {
        /* Logon */
        $('#title_profile').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_profile').css('postion', 'absulute')
            .css('width', '230px')
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
