/**
 * Created by steve on 14-10-7.
 */

define(['jquery', 'jquerymobile', 'net', 'md5','dialogs'], function($, m, net, md5, dia) {
    //设置内容高度是Header剩下的高度
    $("#registration_confirm").on( "pagebeforeshow", function( event ) { 
            window.setBodyOverflow($(document.body));
            $('#registration_confirm_content').css('height',($(window).height()-44-20)); 
            $('#registration_confirm_content_info').css('min-height',($(window).height()-44-20)); 
            // 兼容其他浏览器
            compatibility();
            // window.historyView = [];
    });

    $('#registration_confirm_record').off('click')
        .on('click', function() { 
            $("#registration_record").attr("frompage","registration_confirm");
            $.mobile.newChangePage("#registration_record",{ transition: "slide",reverse: false,changeHash: false});
    });
        
    $('#registration_confirm_goca').off('click')
        .on('click', function() { 
            $.mobile.newChangePage("#ca",{ transition: "slide",reverse: false,changeHash: false});
            var postData = {};
            postData['userId'] = q['user'].userId;
            net.post('ca/hasCaRegData',postData,function(error){

            },function(response){
                if (response.code != 0) {
                }
                else{
                    var dataInfo = response.data.Info;
                    if(dataInfo == true){
                        $("#team_records").css("display","block");
                    }else{
                        $("#team_records").css("display","none");
                    }

                }
            });
    });

    function compatibility() {
        /* Logon */
        $('#title_registration_confirm').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_registration_confirm').css('postion', 'absulute')
            .css('width', '120px')
            .css('height','20px')
            .css('margin', '8px auto auto auto')
            .css('text-align', 'center');
    }

    $(document).ready(function () {
        setTimeout(function() {
            // 兼容其他浏览器
            compatibility();
        },1000);
    });
});