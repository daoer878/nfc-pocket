/**
 * Created by kiki on 2017/9/12.
 */
define(['jquery','net','dialogs','mustache','text','text!search_info'], function($,net,dialog,mustache,text,search_info) {
    var resetpwByID = {
        intEvents:function(){
            $("#ResetPasswordById .rp-back").on('click',function(){
                $.mobile.backChangePage("#setting",{ transition: "slide",reverse: false,changeHash: false});
            });
            $("#ResetPasswordById").on('pagebeforeshow',function(){
                $("#RPById-overlay").hide();
            });
            $('#rePs-btn').on('click',function(){
                resetpwByID.infSearch($('#rePs-input').val());
            });
            $('#ResetPassword-content').on('click',' #sure-btn',function(){
                $("#ResetPassword-content #RPById-overlay").hide();
                resetpwByID.ReSetConfirmation($('#rePs-input').val());
            });
            $('#ResetPassword-content').on('click','.close-div',function(){
                $('#rePs-input').val('');
                $("#RPById-overlay").hide();
            });
        },
        /* ReSetConfirmation */
        ReSetConfirmation:function(param){
            var postData = {'staffId':param };
            var url = 'user/resetPassByStaffId';
            net.post(url,postData,function(error){
                dialog.alert('Please check your network');
                console.assert('ajax fail');
            },function(response){
                if(response.code==0){
                    dialog.alert('Tips','Successful initialize password',['OK'],function(title){
                       return false;
                    })
                }
            })
        },
        infSearch:function(param){
            var postData = {'staffId':param };
            var url = 'user/getAppUserByStaffId'
            net.post(url,postData,function(error){
                dialog.alert('Please check your network');
                console.assert('ajax fail');
            },function(response){
                console.log(response);
                if(response.code==-1){
                    dialog.alert('Tips','Please inport correct staffId.',['OK'],function(){
                        $('#rePs-input').val('');
                        return false;
                    });
                }else if(response.code==0){
                    resetpwByID.renderOverlay(response);
                    $("#RPById-overlay").show();
                }

            });
        },
        renderOverlay:function(data){
            console.log(data);
            $('#ResetPassword-content').append(mustache.render(search_info,data));
        }

    }
    resetpwByID.intEvents();
    return resetpwByID;
});
