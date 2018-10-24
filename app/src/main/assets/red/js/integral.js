/**
 * Created by Administrator on 2018/5/29.
 */
require(['jquery', 'net', 'dialogs','mustache','text!list_item','text!banner_title','MeScroll','./activity_details','EvenRegister'],
    function($, net, dialog,mustache,list_template,banner_title,MeScroll,activity_details,EvenRegister) {
    var mescrollEvent = null;
    var Integral = {
        initEvents:function(){
                $('#integral_back').click(function(){
                    mescrollEvent.destroy();
                    $.mobile.newChangePage("#myCornerHome",{transition:"slide",reverse: true,changeHash: false});
                });
                $('#integral_info').click(function(){
                    mescrollEvent.destroy();
                    $.mobile.newChangePage("#integral_rule_page",{transition:"slide",reverse: false,changeHash: false});
                });
                $("#integral_page").on("pagebeforeshow",function(){
                    Integral.initMescroll();
                });
                $("#integralList #list_box").on('click','.list-item',function(){
                    Integral.showActivityDetails($(this).attr('data-id'));
                })
        },
        getIntegralList : function(page){
                if(!page){
                    page = {
                        num:1
                    };
                }
                var url = 'user/getGradesByUserId';
                var dataPost = {
                    "pager.pageSize":10,
                    "pager.pageNo":page.num
                };
                net.post(url,dataPost,function(error){
                    MeScroll.endErr();
                },function(response){
                    Integral.doSuccessForRes(response);
                })
        },
        doSuccessForRes :function (data){
                mescrollEvent.endByPage(10, data.data.totalPages);
                if(data && data.code === 0){
                    data.data.systemTime = Integral.calculateTime();
                    data.data.sumGrades = data.data.sumGrades ? data.data.sumGrades :0;
                    $.each(data.data.details,function(index,val){
                        val = Integral.rebuildItem( val );
                    });
                    $('#integral_banner_title').html(mustache.render(banner_title,data.data) );
                    $('#list_box').append(mustache.render(list_template,data.data) );
                }else{
                    dialogs.alert('Confirmation', data.msg, ['OK'], function(title) {
                    });
                }
        },
        showActivityDetails : function(activityId){
            if(activityId){
                var url = 'activity/getActiveById';
                var dataPost = {
                    'activityId':activityId,
                    'userId':q['user'].userId
                }
                net.post(url,dataPost,function(err){
                    dialogs.alert('Confirmation', err.msg, ['OK'], function(title) {
                    });
                },function(response){
                    Integral.doSunccForDetails(response);
                })
            }

        },
        doSunccForDetails : function(activityDetails){
            activity_details.load.init(activityDetails, 'integral_page');
            mescrollEvent.destroy();
            $.mobile.changePage("#clubActiveDetails", {transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
        },
        calculateTime : function(timeType,time){
            if( timeType && timeType === 'item-time'){
                time = Integral.clculateTimeDetails(time*1000);
                return time;
            }else{
                var date = new Date();
                return Integral.clculateTimeDetails(date.getTime());
            }
        },
        rebuildItem : function(item){
            item.gradesGetTime = Integral.calculateTime('item-time',item.gradesGetTime);
            if(item.gradesType === 'signIn'){
                item.leftIcon = 'list-item-sign';
            }else{
                item.leftIcon = 'list-item-register';
            }
            item.activitySubject = (item.activitySubject.length>15)?item.activitySubject.slice(0,30)+'...':item.activitySubject;
            return item;
        },
        clculateTimeDetails : function(date){
            var date = new Date(date);
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = date.getDate() + ' ';
            var h = date.getHours() + ':';
            var m = date.getMinutes() + ':';
            var s = date.getSeconds();
            return(Y+M+D+h+m+s);
        },
        initMescroll : function(){
            mescrollEvent = new MeScroll("integralList",{
                down:{
                    auto:false,
                    clearEmptyId: "list_box",
                    callback:Integral.getIntegralList({num:1})
                },
                up: {
                    clearEmptyId: "list_box",
                    callback: Integral.getIntegralList//上拉加载的回调
                }
            });
        }
    }
    Integral.initEvents();
});

