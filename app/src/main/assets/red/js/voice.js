/**
 * Created by Aboo on 2018/1/30.
 */
require(['jquery', 'jquerymobile', 'net', 'dialogs'], function($, m, net, dia) {

    //题库
    var Questions = [
        {
            'id':1,
            'q_description':'请说出视频中谜语的谜底',
            'v_src':'http://reddownload.oss-cn-shenzhen.aliyuncs.com/UAT/red/v4.3/video/one.mp4',
            'b_name':'Carmen Liu',
            'title':'HEAD OF HUMAN RESOURCES',
            'answer':'烟花'
        },
        {
            'id':2,
            'q_description':'请说出视频中的祝福语',
            'v_src':'http://reddownload.oss-cn-shenzhen.aliyuncs.com/UAT/red/v4.3/video/two.mp4',
            'b_name':'Sammie Zhong',
            'title':'HEAD OF CENTRE OPERATION',
            'answer':'新年到祝福到喜迎瑞狗哈哈笑'
        },
       /* {
            'id':3,
            'q_description':'请说出视频中谜语的谜底（打一成语）',
            'v_src':'http://reddownload.oss-cn-shenzhen.aliyuncs.com/UAT/red/v4.3/video/three.mp4',
            'b_name':'Shelley Huang ',
            'title':'HEAD OF FINANCE',
            'answer':'喜出望外'
        },*/
        {
            'id':3,
            'q_description':'请用普通话重复视频中出现的祝福语',
            'v_src':'http://reddownload.oss-cn-shenzhen.aliyuncs.com/UAT/red/v4.3/video/four.mp4',
            'b_name':'Gary Lee',
            'title':'Head of HSBC Technology Centres China',
            'answer':'各位同事大家好祝大家新年快乐身体健康事事如意'
        }
    ];

    var Questions2 = [
        {
            'id':1,
            'q_description':'请说出视频中的绕口令',
            'v_src':'http://reddownload.oss-cn-shenzhen.aliyuncs.com/UAT/red/v4.3/video/five.mp4',
            'b_name':'Carmen Liu',
            'title':'HEAD OF HUMAN RESOURCES',
            'answer':'房胡子黄胡子新年到了写福字'
        },
        {
            'id':2,
            'q_description':'请说出视频中的祝福语',
            'v_src':'http://reddownload.oss-cn-shenzhen.aliyuncs.com/UAT/red/v4.3/video/six.mp4',
            'b_name':'Shelley Huang',
            'title':'HEAD OF FINANCE',
            'answer':'新年到祝福到喜迎瑞狗哈哈笑'
        },
      /*  {
            'id':13,
            'q_description':'请说出视频中谜语的谜底',
            'v_src':'http://reddownload.oss-cn-shenzhen.aliyuncs.com/UAT/red/v4.3/video/seven.mp4',
            'b_name':'Sammie Zhong',
            'title':'HEAD OF CENTRE OPERATION',
            'answer':'烟花'
        },*/
        {
            'id':3,
            'q_description':'请用普通话重复视频中出现的祝福语',
            'v_src':'http://reddownload.oss-cn-shenzhen.aliyuncs.com/UAT/red/v4.3/video/four.mp4',
            'b_name':'Gary Lee',
            'title':'Head of HSBC Technology Centres China',
            'answer':'各位同事大家好祝大家新年快乐身体健康事事如意'
        }
    ];

    var Voice = {

        isPlaying : false, //视频是否在播放

        isRecording : false, //是否在录音

        q_count : 0, //问题总数

        currentStep : null,//当前的关卡

        isWinner : false, //是否已经获得红包

        initEvents : function () {

            // 九宫格点击进入(入口页)
            $("#voice-menu").off('touchend').on('touchend',function (event) {
                event.preventDefault();
                if($("#voice-menu").hasClass('game_started')){
                    $.mobile.changePage("#voice-welcome-page", {transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
                }else{
                    dia.alert('Tips',"Coming soon!",['OK'],function () {

                    });
                }
            });
            $("#voice-welcome-back").off('touchend').on('touchend', function (event) {
                event.preventDefault();
                $.mobile.backChangePage("#assistantHome", { transition: "slide", reverse: true, changeHash:false});
            });
            $("#voice-welcome-page").off('pagebeforeshow').on("pagebeforeshow", function(event) {
                //设置内容高度是Header剩下的高度
                $('#news_footer').hide();
                $('#voice-welcome-page').css('height', '100%');
                window.setBodyOverflow($(document.body));
                $('.welcome-content').css('height', ($(window).height() - 20 - 44));
                //加载视频
                $("#welcome-video").attr('src','./images/voice/welcome.mp4');
                //发请求,获取是否已中奖(isWinner)
                Voice.amIWinner();
            });
            $("#voice-welcome-page").off('pageshow').on('pageshow',function () {
                //欢迎视频控制
                if($("#v-welcome-video").css('display') === 'block'){
                    $("#welcome-video")[0].play();
                    var videoLen = $("#welcome-video")[0].duration;
                    var t_all = 10;
                    var videoObj = $("#welcome-video")[0];
                    /*videoObj.addEventListener('ended', function () {
                        //欢迎视频播放完成后自动进入活动规则页面,不需要手动关闭
                        setTimeout(function(){
                            $("#v-welcome-video").fadeOut(1000);
                        },1000)

                    }, false);*/
                    setTimeout(function () {
                        /*$("#v-welcome-timer").fadeIn(800,function () {
                            $(this).off('touchend').on('touchend',function (event) {
                                event.preventDefault();
                                $("#v-welcome-video").fadeOut(1000);
                            });
                        });*/
                        /*$("#v-welcome-video").fadeOut(1000);*/
                        $("#v-welcome-timer span").addClass("close_video_btn");
                        $(".close_video_btn").off("touchend").on("touchend",function () {
                            /*$("#welcome-video")[0].pause();*/
                            $("#v-welcome-video").fadeOut(1000);
                        })
                    },(videoLen + 2)*1000);
                    setInterval(function () {
                        setTime(t_all);
                        t_all = t_all - 1;
                        if(t_all < 0){
                            t_all = 0;
                        }
                    },1000)

                }
            });

           /* $(".close_video_btn").off("touchend").on("touchend",function () {
                alert("close_video_btn")
                $("#v-welcome-video").fadeOut(1000);
            })*/

            function setTime(cur_time){
                if(cur_time == 0){
                    $("#v-welcome-timer span").text("关闭");
                }else{
                    $("#v-welcome-timer span").text(cur_time+"s");
                }

            }

            //进入闯关页面
            $("#start-voice-game").off('touchend').on('touchend', function (event) {
                event.preventDefault();
                if($(this).hasClass("game_off")){
                    dia.alert('Tips','This game is out of date! Thanks for your supporting .',['OK'],function () {

                    });
                }else if(Voice.isWinner){
                    dia.alert('Tips',"You've already won a red packet.This game is no longer available for you.Thanks!",['OK'],function () {

                    });
                }else{
                    $.mobile.changePage("#voice-page", {transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
                }

            });
            $("#voice-page").off('pagebeforeshow').on("pagebeforeshow", function(event) {
                //设置内容高度是Header剩下的高度
                $('#news_footer').hide();
                $('#voice-page').css('height', '100%');
                window.setBodyOverflow($(document.body));
                $('#voice-content').css('height', ($(window).height() - 20 - 44));
                //页面一些元素初始化
                Voice.currentStep = Questions[0];//恢复至第一关
                Voice.loadQuestion(Voice.currentStep);
                $("#voice-back-btn").show(); //显示关卡页面返回按钮
            });
            //voice页面返回按钮
            $("#voice-back-btn").off('touchend').on('touchend', function (event) {
                event.preventDefault();
                //关闭视频
                Voice.pauseVideo();
                $.mobile.backChangePage("#voice-welcome-page", { transition: "slide", reverse: true, changeHash:false});
            });
            //控制视频
            $("#video-item").off('touchend').on('touchend',function (evnent) {
                evnent.preventDefault();
                (!Voice.isPlaying)? Voice.playVideo() : Voice.pauseVideo();
            });

            //点击录音按钮
            $('#v-init-img').off('touchend').on('touchend',function(e) {
                if(!Voice.isRecording){
                    //开始
                    $("#voice-back-btn").hide(); //暂时不让返回
                    Voice.isRecording = true;
                    Voice.recordingBtn('recording');
                    Voice.pauseVideo(); //暂停视频
                    var params = {'staffId':q['user'].staffId};
                    speechRecognizer.startRecording(params,function (input) {
                        Voice.recordingBtn('init');
                        if(Voice.isSuccess(Voice.currentStep,input.result)){
                            //成功,先庆祝
                            Voice.congratulate();
                            //延迟1.4s再跳下一关
                            setTimeout(function () {
                                Voice.nextStep();
                                Voice.isRecording = false;
                            },1400);
                        }else{
                            //没回答成功
                            Voice.pauseVideo();//暂停视频
                            dia.alert('Tips','Wrong Answer ! Please Try Again.',['OK'],function () {
                                Voice.isRecording = false;
                            },null);
                        }
                        $("#voice-back-btn").show(); //恢复返回按钮
                    },function (err) {
                        Voice.recordingBtn('init'); //恢复录音按钮
                        Voice.pauseVideo();//暂停视频
                        dia.alert('Error','An error has occurred ! Please confirm record audio permission and try again.',['OK'],function () {
                            Voice.isRecording = false;
                            $("#voice-back-btn").show(); //恢复返回按钮
                        },null);
                    });
                }else{
                    //录音状态不能被干扰
                }


            });


            //红包页面
            $("#v-result-btn .v-result").off('touchend').on('touchend', function (event) {
                event.preventDefault();
                if(Voice.isWinner){
                    $.mobile.changePage("#voice-result-page", {transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
                }else{
                    dia.alert('Tips',"You haven't won red packet yet!",['OK'],function () {

                    });
                }
            });
            $("#voice-result-page").off('pagebeforeshow').on("pagebeforeshow", function(event) {
                //设置内容高度是Header剩下的高度
                $('#news_footer').hide();
                $('#voice-result-page').css('height', '100%');
                window.setBodyOverflow($(document.body));
                $('.v-result-content').css('height', ($(window).height() - 20 - 44));
                //页面一些元素初始化

            });
            $("#voice-result-back").off('touchend').on('touchend', function (event) {
                event.preventDefault();
                $.mobile.backChangePage("#voice-welcome-page", { transition: "slide", reverse: true, changeHash:false});
            });

        },

        initQuestionList:function() {
             var now = new Date().getDate();
             if(now % 2 == 0) {
                 Questions = Questions2;
             }
             this.q_count = Questions.length;
             this.currentStep = Questions[0];
             Voice.initEvents();
        },
        //播放视频
        playVideo : function () {
            $("#video-item")[0].play();
            Voice.isPlaying = true;
        },
        //暂停视频
        pauseVideo : function () {
            $("#video-item")[0].pause();
            Voice.isPlaying = false;
        },
        //重置视频
        loadVideo : function () {
            $("#video-item")[0].load();
            Voice.isPlaying = false;
        },
        //控制录音按钮, state:['init','recording','done']
        recordingBtn : function (state) {
            var states = ['init','recording','done'];
            if(state == states[0]){
                $("#v-done-img").hide();
                $("#v-recording-img").hide();
                $("#v-init-img").show();
            }else if(state == states[1]){
                $("#v-init-img").hide();
                $("#v-done-img").hide();
                $("#v-recording-img").show();
            }else if(state == states[2]){
                $("#v-init-img").hide();
                $("#v-recording-img").hide();
                $("#v-done-img").show();
            }
        },

        //判断本关 (输入非空 && 输入==答案)
        isSuccess : function (currStep,inputV) {
            //答案少于5的不进行模糊匹配
            if(currStep.answer < 5) {
                return (inputV) && (currStep.answer == inputV);
            } else {
                //答案长度大于4/5时才进行模糊匹配,避免只说前半句或者个别认识的字就过关
                if(inputV && inputV.length > (currStep.answer.length)*4/5) {
                    var inputStr = this.stringToArray(inputV);
                    var anwserStr = this.stringToArray(currStep.answer);
                    var matchDegree = this.compareAnwser(inputStr,anwserStr);
                    return matchDegree > 50 ? true : false;
                } else {
                    return false;
                }
            }
        },
        //跳下一关
        nextStep : function () {
            var index = Voice.currentStep.id - 1;
            if(index < (Voice.q_count-1)){
                //下一关
                Voice.currentStep = Questions[index+1]; //下标进1
                Voice.loadQuestion(Voice.currentStep); //加载下一关
            }else{
                //跳到红包页面
                Voice.pauseVideo();
                Voice.getPacket(); //增加记录(增加成功后,跳到红包页面)
            }
            Voice.isRecording = false;

        },
        //返回x表示匹配度为x%;
        compareAnwser:function(x,y){
            var z = 0;
            var s = x.length + y.length;;

            x.sort();
            y.sort();
            var a = x.shift();
            var b = y.shift();

            while(a !== undefined && b !== undefined) {
                if (a === b) {
                    z++;
                    a = x.shift();
                    b = y.shift();
                } else if (a < b) {
                    a = x.shift();
                } else if (a > b) {
                    b = y.shift();
                }
            }
            return z/s * 200;
        },
        stringToArray:function(x){
            return x.split("");
        },
        //加载题目
        loadQuestion : function (q) {
            $("#voice-content #video-item").attr('src',q.v_src).attr('poster','././images/voice/poster.png');
            $("#voice-q-description").empty().html(q.q_description);
            $("#voice-name").empty().html(q.b_name);
            $("#voice-title").empty().html(q.title);
            Voice.loadVideo(); //重置视频
            Voice.recordingBtn('init'); //恢复录音按钮
            Voice.isRecording = false;
        },

        //判断是否已有红包
        amIWinner : function () {
            var isWinnerUrl = "redPackage/getWiner";
            var param = {};
            param['staffId'] = q['user'].staffId;
            net.post(isWinnerUrl,param,function (error) {

            },function (response) {
                if(response.code == 0 && response.data.winner == true){
                    Voice.isWinner = true;
                }else if(response.code == 0 && response.data.winner == false){
                    Voice.isWinner = false;
                }
            });
        },

        //闯关成功后,添加记录
        getPacket : function () {
            var getPacketUrl = "redPackage/play";
            var param = {};
            param['staffId'] = q['user'].staffId;
            net.post(getPacketUrl,param,function (error) {

            },function (response) {
                if(response.code == 0){
                    //说明添加成功
                    Voice.isWinner = true;
                    $.mobile.changePage("#voice-result-page", {transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
                }else{
                    //理论上不会
                    dia.alert('Error','Please check your network!',['OK'],function () {
                        $.mobile.backChangePage("#voice-welcome-page", { transition: "slide", reverse: true, changeHash:false});
                    });
                }
            });
        },

        //过关庆祝
        congratulate : function () {
            $("#done-sound")[0].play();//播放小音乐
            Voice.recordingBtn('done');//换btn
        }


    }

    Voice.initQuestionList();


});
