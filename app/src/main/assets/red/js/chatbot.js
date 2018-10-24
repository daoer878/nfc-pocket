/**
 * Created by Aboo on 2018/5/18.
 */
require(['jquery', 'net', 'config', 'dialogs', 'mustache', 'text!chatbot_question', 'text!chatbot_answer', 'text!chatbot_jobs', 'jobPost'], function ($, net, config, dia, mustache, question_template, answer_template, jobs_template, jobPost) {
    var ChatBot = {
        SCROLLTOPVALUE : 0,
        PAGE_SIZE: 8,  // default job list page size
        KEYBOARD_HEIGHT: 0,
        IS_IOS : false,
        init: function () {
            $(".chatbot-enter").off('touchend').on('touchend', function (event) {
                event.preventDefault();
                $.mobile.changePage("#chatbot_page", {
                    transition: "slide",
                    reverse: false,
                    changeHash: false,
                    allowSamePageTransition: true
                });
                if(navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i)){
                    ChatBot.IS_IOS = true;
                }
                setTimeout(ChatBot.initSpeakBox(), 500);
            });

            $("#chatbot_page").off('pagebeforeshow').on("pagebeforeshow", function (event) {
                //设置内容高度是Header剩下的高度
                $('#news_footer').hide();
                $('#chatbot-page').css('height', '100%');
                window.setBodyOverflow($(document.body));
                ChatBot.SCROLLTOPVALUE === 0 ? ChatBot.resetSpeakWindowHeight() : $(".speak_window").scrollTop(ChatBot.SCROLLTOPVALUE + " px");
                // 初始化时失去焦点
                ChatBot.whileBlur();
                //allow input
                ChatBot.disableInput(false);
            });

            $('#chatbot_page').off('pageshow').on('pageshow', function (event) {
                ChatBot.IS_IOS && Keyboard.disableScrollingInShrinkView(true, function (v) {
                    ChatBot.KEYBOARD_HEIGHT = v.keyboardHeight;
                    var layerHeight= $(window).height() - ChatBot.KEYBOARD_HEIGHT - $('.chatbot-footer').height() - 3;
                    $('#chatbot-input-layer').css('height',layerHeight);
                    ChatBot.shrinkSpeakWindowHeight();
                    ChatBot.whileFocused();
                });
                ChatBot.IS_IOS && $('#chatbot_input')[0].addEventListener('focus', function() {
                    ChatBot.shrinkSpeakWindowHeight();
                    ChatBot.whileFocused();
                });
                ChatBot.IS_IOS && $('#chatbot_input')[0].addEventListener('blur', function() {
                    ChatBot.resetSpeakWindowHeight();
                    ChatBot.whileBlur();
                });
            });
            $("#chatbotPage_back_btn").off('touchend').on('touchend', function () {
                event.preventDefault();
                $('#chatbot_input').blur();
                dia.alert('Confirmation', 'Once you exit, current session will be cleared! Are you sure to exit?', ['Exit', 'Cancel'], function (btnVal) {
                    if (btnVal === 'Exit') {
                        ChatBot.quitChat();
                        $.mobile.backChangePage("#jobPost", {
                            transition: "slide",
                            reverse: true,
                            changeHash: false
                        });
                        $("#jobPost .job-content").scrollTop(0);
                        //clear history
                        ChatBot.clearSpeakBox();
                    }
                });
                ChatBot.SCROLLTOPVALUE = 0;
            });

          $("#chatbot_send_btn").off('touchend').on('touchend', function () {
                event.preventDefault();
                var text = $('#chatbot_input').val();
                !(text) ? ChatBot.alertWhenNull() : ChatBot.send(text);
            });

            // 便于电脑端输入（发布时可以删除）
            $("#chatbot_page").keydown(function (e) {
                (e.keyCode === 13) ? $("#chatbot_send_btn").touchend() : '';
            });

        },

        whileFocused : function () {
            $('.chatbot-footer').css('bottom',ChatBot.KEYBOARD_HEIGHT);
            $('#chatbot-input-layer').show();
        },

        whileBlur : function () {
            $('.chatbot-footer').css('bottom',0);
            $('#chatbot-input-layer').hide();
        },

        /**
         * 重置聊天框高度
         */
        resetSpeakWindowHeight : function () {
            $('.speak_window ').css('height', ($(window).height() - 45 - 44-$('.chatbot-footer').height()));
            //重置时scroll一下
            ChatBot.scrollContent();
        },

        /**
         * 键盘弹出时收缩聊天框高度
         */
        shrinkSpeakWindowHeight : function () {
            var layerHeight= $(window).height() - ChatBot.KEYBOARD_HEIGHT - $('.chatbot-footer').height() - 20;
            $('.speak_window').height(layerHeight - 44);
            //弹出时scroll一下
            ChatBot.scrollContent();
        },

        initSpeakBox: function () {
            ChatBot.clearSpeakBox();
            var initialMsg = '你好，我是您的求职小顾问人仔,可以帮助您获取最新的汇丰招聘动态，有什么求职问题就尽管找我吧^_^。';
            var data = {message: initialMsg};
            var ansHtml = mustache.render(answer_template, data);
            $('.speak_box').append(ansHtml);
        },

        alertWhenNull : function(){
            dia.alert('ERROR!','The input cannot be empty!',['OK'],function () {},null);
        },

        clearSpeakBox: function () {
            $('#chatbot_page .speak_box').children().remove();
        },

        quitChat: function () {
            var quitStr = '退出';
            ChatBot.send(quitStr);
        },

        send: function (text) {
            var user_photo = ChatBot.getUserAvatar();
            ChatBot.appendUserMsg(user_photo, text);
            $('#chatbot_input').val('');
            ChatBot.scrollContent();
            var requestConfig = {
                domainType: 'Chatbot'
            };
            var postData = {
                "query": text,
                "id": q['user'].userId
            };
            net.post('chatterbotChat',
                postData,
                ChatBot.responseFail,
                ChatBot.responseSuccess,
                null, requestConfig);
        },

        getUserAvatar: function () {
            var avatar = localStorage.getItem('login_user_photo');
            return !(avatar) ? "images/userDefault.png" : avatar;
        },

        appendUserMsg: function (avatar, text) {
            var data = {
                "avatar": avatar,
                "text": text
            };
            var html = mustache.render(question_template, data);
            $('.speak_box').append(html);
        },

        responseSuccess: function (v) {
            var data = ChatBot.answerFormatter(v);
            var ansHtml = mustache.render(answer_template, data);
            $('.speak_box').append(ansHtml);
            // 每次需要重新绑定按钮
            ChatBot.bindParamButtons();
            // is_show => 绑定pager buttons & job list click
            if (data.is_show) {
                ChatBot.bindPagerButtons();
                ChatBot.bindJobListClicked()
            }

            //allow input 控制
            (data.allowinput) ? ChatBot.disableInput(false) : ChatBot.disableInput(true);
            ChatBot.scrollContent();
        },

        answerFormatter: function (v) {
            var result = {
                "message": v.message,		//针对用户问题的答复，或者提示性话语
                "review_str": v.review_str,		//针对用户输入进行关的参数的展示
                "parameter": !(v.parameter) ? null : v.parameter.split(';'), //按钮
                "is_show": (v.is_show === "是" && v.info_list.length > 0) ? true : false,		//是否展示查询结果
                "show_more": (v.show_more === "是") ? true : false, //是否展示更多信息
                "checkbox": (v.checkbox === "是") ? true : false,		//是否多选
                "allowinput": (v.allowinput === "是") ? true : false,	//是否允许用户输入
                "info_list": v.info_list,		//查询结果
                "tid": v.tid,			//未使用，不需要关注
                "queryJson": v.queryJson,		//根据用户输入拼接的用于查询数据库的查询语句
                "totalNum": v.totalNum,		//搜索结果总条数
                "totalPage": v.totalPage,   	//搜索结果总页数
                // 自定义一些字段
                "curr_page": 1  // 推荐职位的当前页(这个仅仅是初始化用的)
            };
            return result;
        },

        bindParamButtons: function () {
            $(".answer_prm_btn").off('touchend').on('touchend', function (e) {
                e.preventDefault();
                var btnText = $(this)[0].innerText;
                (btnText) ? ChatBot.send(btnText) : '';
            });
        },

        bindPagerButtons: function () {
            $(".pager_btn").off('touchend').on('touchend', function (e) {
                e.preventDefault();
                var currPage = Number($(e.target).attr('data-curr'));
                var totalPage = Number($(e.target).attr('data-total'));
                var query_json = $(e.target).parent().find('.query_json').html();
                // 翻页
                if ($(e.target).hasClass('last_pg')) {
                    if (currPage > 1 && totalPage > 1) {
                        ChatBot.getJobsByPg(currPage - 1, query_json, e);
                    }
                } else {
                    if (currPage < totalPage) {
                        ChatBot.getJobsByPg(currPage + 1, query_json, e);
                    }
                };
            });
        },

        bindJobListClicked: function () {
            $('.recommended_jobs').on('touchend', 'a', function () {
                var jobDescription = this.innerHTML;
                console.log(jobDescription);
                ChatBot.SCROLLTOPVALUE = $(".speak_window").scrollTop();
                /*  */
                console.log(ChatBot.SCROLLTOPVALUE);

                ChatBot.getDetailsByJobDesc(jobDescription);
            });

        },

        getDetailsByJobDesc: function (jobDesc) {
            var requestConfig = {
                domainType: 'Chatbot'
            };
            var postData = {
                // "jobDescription":"Personal Assistant - Corporate Banking : 0000YHT6"
                "jobDescription": jobDesc
            };
            net.post('get_resume_detail',
                postData,
                function (err) {
                    console.log(err);
                }, function (res) {
                    console.log(res);
                    ChatBot.displayJobDetails(res);
                },
                null, requestConfig);
        },

        displayJobDetails: function (data) {
            var concatContent = function () {
                var result = '';
                if (data.description) {
                    result += data.description;
                }
                if (data.qualifications) {
                    result += '<p style="font-weight: bold">Qualifications</p>';
                    var temp = data.qualifications.map(function (i) {
                        return '-- ' + i + '<br>';
                    });
                    temp.forEach(function (j) {
                        result += j;
                    });
                }
                return result;
            }
            var jobInfo = {
                cameFrom: 'chatbot',
                openType: 1,
                title: data.jobDescription,
                jobAddress: data.jobAddress,
                content: concatContent(),
            }
            jobPost.renderJobDetail(jobInfo);
            //跳转
            $.mobile.changePage("#job-detail", {
                transition: "slide",
                reverse: false,
                changeHash: false,
                allowSamePageTransition: true
            });
        },

        disableInput: function (flagDisable) {
            if (flagDisable) {
                $('#chatbot_input').prop('disabled', 'true'); //禁用
            } else {
                $('#chatbot_input').prop('disabled', null);  //启用
            }
        },

        scrollContent: function () {
            var speak_height = $('.speak_box').height() + 20;
            $('.speak_box,.speak_window').animate({scrollTop: speak_height}, 500);
        },

        responseFail: function (e) {
            console.error('chatbot error:', e);
        },

        getJobsByPg: function (current_page, queryJson, e) {
            var domain = config.domainList['Chatbot'];
            var jobsUrl = 'getPageInfo';
            var postData = {
                'queryJson': queryJson,
                'id': q['user'].userId,
                'page_size': ChatBot.PAGE_SIZE,
                'current_page': current_page
            };
            // **** 这里没有走net.post, 是在避免参数被格式化 **** //
            $.ajax({
                url: domain + jobsUrl,
                method: 'POST',
                data: postData,
                success: function (res) {
                    ChatBot.updateJobList(res, e, queryJson);
                },
                fail: function (err) {
                    console.error(err);
                    dia.alert('ERROR!', 'Please check your network!', ['OK'], function () {
                    }, null);
                },
                complete: function (v) {
                    ChatBot.requestComplete(domain, jobsUrl, postData, v)
                }
            });
        },

        updateJobList: function (res, e, _queryJson) {
            var data = JSON.parse(res);
            data['queryJson'] = _queryJson;
            var jobsHtml = mustache.render(jobs_template, data);
            var $old_jobs = e.target.parentNode.parentNode.parentNode;
            $($old_jobs).replaceWith(jobsHtml);
            ChatBot.bindPagerButtons();
            ChatBot.bindJobListClicked();
        },

        /**
         * 模拟net.js的统一处理
         */
        requestComplete: function (_domain, _jobsUrl, _postData, _v) {
            console.groupCollapsed('%c%s', "color: red; background: yellow;", _jobsUrl);
            console.log('url: %s', _domain + _jobsUrl);
            console.log("method: %s", 'POST');
            console.log('parameters: %o', _postData);
            console.log('response: %o', JSON.parse(_v.responseText));
            console.groupEnd();
        }
    }
    ChatBot.init();
});


