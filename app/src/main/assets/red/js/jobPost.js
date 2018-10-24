define(['jquery', 'jquerymobile', 'net', 'dialogs'], function($, m, net, dia) {
    var searchText = "";  //搜索框的内容
    var nav_id = 0;
    var job_id = "";
    var islike = 0; //0:表示当前没有关注 1:当前已经关注
    var canShare = 0; //0:不能share 1:可以share
    var canMail = 0;
    var loadingMask = false; //默认没有正在加载

    var filterClass = 0; //暂存过滤类别
    var filterCity = "";  //暂存过滤条件的状态
    var filterSkill = "";
    var filterLevel = "";
    var prePage = ""; //存储上一个页面
    var pagefrom = null;
    var _timer = {};
    var mescrollEvent = null;

    function delay_till_last(id, fn, wait) {
        if (_timer[id]) {
            window.clearTimeout(_timer[id]);
            delete _timer[id];
        }
        return _timer[id] = window.setTimeout(function() {
            fn();
            delete _timer[id];  //删除已经存在的key-value,因为要再次返回一个_timer[id]
        }, wait);
    }
    function loading(){
        if(loadingMask){
            //添加loading
            $(".loading-div").removeClass("hidden");
        }else {
            $(".loading-div").addClass("hidden");
        }
    }

    //将毫秒的时间转换成美式英语的时间格式,eg:3rd May 2018
    function formatDate(millinSeconds){
        var date = new Date(millinSeconds);
        var monthArr = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Spt","Oct","Nov","Dec");
        var suffix = new Array("st","nd","rd","th");

        var year = date.getFullYear(); //年
        var month = monthArr[date.getMonth()]; //月
        var ddate = date.getDate(); //日

        if(ddate % 10 < 1 || ddate % 10 > 3) {
            ddate = ddate + suffix[3];
        }else if(ddate % 10 == 1) {
            ddate = ddate + suffix[0];
        } else if(ddate % 10 == 2) {
            ddate = ddate + suffix[1];
        }else {
            ddate = ddate + suffix[2];
        }

        if(year && month && ddate){
            return ddate + " "+ month + " " + year;
        } else {
            return "1 Jan 2018";
        }
    }

    function upCallback(page){
        if(!page){
            var page = {
                num:1
            };
        }
        var postData = {};
        postData['pager.pageNo'] = page.num;
        postData['pager.pageSize'] = 5;
        postData['userId'] = q['user'].userId;
        postData['keyword'] = searchText;
        postData['skillId'] = filterSkill;
        postData['location'] = formatCityParam(filterCity);
        postData['levelId'] = filterLevel;
        net.post('recruitment/listRecruitmentsForApp',postData,function(error){

        },function(data){
            mescrollEvent.endByPage(10, data.data.pager.totalPages);
            if(data.code == 0 && data.data.recruitments.length > 0){
                var jobListHtml = ``;
                $.each(data.data.recruitments, function(index, item){
                    jobListHtml += `<li class="job-item-wrapper" key="${item.id}">
                                <div><div class="first-line"><span class="jobNumber">${item.recruitmentNo}</span>
                                <span class="date">${formatDate(item.updateTime*1000)}</span></div>
                                <div class="title">${item.title}</div><div class="second-line"><span class="tags"><ul><li><span>${item.openType == 0 ? "Internal Only" : "Full Cycle"}</span></li></ul></span><span class="address">${item.jobAddress}</span></div></div></li><div class="job-item-line"></div>`;
                })
                $("#listView").append(jobListHtml);
            }
        });
    }
    function downCallback(){
        if(!page){
            var page = {
                num:1
            };
        }
        var postData = {};
        postData['pager.pageNo'] = page.num;
        postData['pager.pageSize'] = 5;
        // postData['userId'] = q['user'].userId;
        postData['keyword'] = searchText;
        postData['skillId'] = filterSkill;
        postData['location'] = formatCityParam(filterCity);
        postData['levelId'] = filterLevel;
        net.post('recruitment/listRecruitmentsForApp',postData,function(error){

        },function(data){
            mescrollEvent.endByPage();
            if(data.code == 0 && data.data.recruitments.length > 0){
                var jobListHtml = "";
                $.each(data.data.recruitments, function(index, item){
                    jobListHtml += "<li class='job-item-wrapper' key="+item.id+"><div><div class='first-line'><span class='jobNumber'>"+item.recruitmentNo+"</span><span class='date'>"+formatDate(item.updateTime*1000)+"</span></div><div class='title'>"+item.title+"</div><div class='second-line'><span class='tags'><ul><li><span>"+(item.openType == 0?"Internal Only":"Full Cycle")+"</span></li></ul></span><span class='address'>"+item.jobAddress+"</span></div></div></li><div class='job-item-line'></div>";
                })
                $(".job-list-wrapper ul").empty().append(jobListHtml);
            }
        });
    }

    //渲染职位详情页面
    function renderJobDetail(jobInfo){
        if(jobInfo){
            if(jobInfo.cameFrom == "chatbot"){
                prePage = "";
                $(".job-detail-foot-nav").hide();
                /*  增加pageFrom   */
                pagefrom = "chatbot";
                $("#job-detail .jobBack").addClass("from-chat-bot");
                $("#job-detail .job-detail-header-info .tags>ul>li>span").text((jobInfo.openType == 0 ? "Internal Only":"Full Cycle"))
                $("#job-detail .job-detail-icon-address").next().text(jobInfo.jobAddress);
                $("#job-detail .job-detail-icon-book").next().text(jobInfo.skillskillName);
                $("#job-detail .job-detail-icon-skill").next().text(jobInfo.levellevelName);
                $("#job-detail .jobNumber").text(jobInfo.recruitmentNo);
                $("#job-detail .create-date").text("Post Date: "+formatDate(jobInfo.createTime * 1000));
                $("#job-detail .update-date").text("Expiry Date: "+formatDate(jobInfo.expirationTime * 1000));
                $("#job-detail .work-name").text(jobInfo.title);
                $("#job-detail .job-detail-desc .descrition").html(handleContent(jobInfo.content));
            }else{

                $("#job-detail .jobBack").removeClass("from-chat-bot");

                $("#job-detail #job-detail-id").text(jobInfo.id);
                $("#job-detail .job-detail-header-info .tags>ul>li>span").text((jobInfo.openType == 0 ? "Internal Only":"Full Cycle"));
                $("#job-detail .job-detail-icon-address").next().text("City: "+jobInfo.jobAddress);
                $("#job-detail .job-detail-icon-book").next().text("GCB: "+jobInfo.skill.skillName);
                $("#job-detail .job-detail-icon-skill").next().text("Skill: "+jobInfo.level.levelName);
                $("#job-detail .jobNumber").text(jobInfo.recruitmentNo);
                $("#job-detail .create-date").text("Post Date: "+formatDate(jobInfo.createTime * 1000));
                $("#job-detail .update-date").text("Expiry Date: "+formatDate(jobInfo.expirationTime * 1000));
                $("#job-detail .work-name").text(jobInfo.title);
                $("#job-detail .job-detail-desc .descrition").html(handleContent(jobInfo.content));
                if(jobInfo.openType == 0){
                    //仅限内部，不能share
                    $(".job-detail-share-image img").attr("src","./images/job/unshare.svg");
                    $(".job-detail-action-image img").attr("src","./images/job/icon-unaction.svg");
                    $(".job-detail-foot-nav .job-detail-action-image ").next().css("color","#ccc");
                    canShare = 0;
                    canMail = 0;
                }else{
                    $(".job-detail-share-image img").attr("src","./images/job/share.svg");
                    $(".job-detail-action-image img").attr("src","./images/job/icon-action.svg");
                    $(".job-detail-foot-nav .job-detail-action-image ").next().css("color","#333");
                    canShare = 1;
                    canMail = 1;
                }

                if(jobInfo.isLike == "Y"){
                    //已经关注
                    $(".job-detail-like-image img").attr("src","./images/job/liked.svg");
                    islike = 1;
                }else{
                    $(".job-detail-like-image img").attr("src","./images/job/like.svg");
                    islike = 0;
                }
            }
        } else {
            $(".job-detail-content-wrapper").hide();
            $(".no-job-detail-info").show();
            $(".job-detail-foot-nav").hide();
        }

    }

    //根据ID获取职位详情
    function getJobDetail(jobId) {
        net.get("recruitment/getDetialInfo",{
            recruitmentId:jobId,
            appOrPCFlag:"app"
        },function(error){
            console.log(error);
        },function(response){
            if(response.code == 0){
                renderJobDetail(response.data.recruitment);
            }
        })
    }
    //格式化查询的city参数
    function formatCityParam(cid){
        cid = parseInt(cid);
        if(cid === 1){
            return "Xi'an";
        }else if(cid === 2){
            return "Guangzhou";
        }else if(cid === 3){
            return "Other";
        }
    }

    //渲染过滤 City
    function renderFilterCitys(list){
        var cityHtml = "";
        if(list && list.length > 0){
            for(var i = 0;i < list.length;i++){
                if(list[i].cityName){
                    cityHtml+="<li key='"+list[i].id+"'>"+list[i].cityName+"</li>"
                }
            }
        }
        $(".filter-content ul").empty().append(cityHtml);
        renderSelectedFilter(filterCity,filterClass);
    }

    //渲染过滤 skill
    function renderFilterSkills(list){
        var skillHtml = "";
        if(list && list.length > 0){
            for(var i = 0;i < list.length;i++){
                if(list[i].skillName){
                    skillHtml+="<li key='"+list[i].id+"'>"+list[i].skillName+"</li>"
                }
            }
        }
        $(".filter-content ul").empty().append(skillHtml);
        renderSelectedFilter(filterSkill,filterClass);
    }

    //渲染过滤 level
    function renderFilterLevel(list){
        var levelHtml = "";
        if(list && list.length > 0){
            for(var i = 0;i < list.length;i++){
                if(list[i].levelName){
                    levelHtml+="<li key='"+list[i].id+"'>"+list[i].levelName+"</li>"
                }
            }
        }
        $(".filter-content ul").empty().append(levelHtml);
        renderSelectedFilter(filterLevel,filterClass);
    }
    //添加选中样式
    function renderSelectedFilter(selectIndex){
        if(selectIndex){
            var allFilterLis = $(".filter-content ul").children("li");
            for(var i = 0;i < allFilterLis.length; i++){
                if(parseInt($(allFilterLis[i]).attr('key')) === parseInt(selectIndex)){
                    $(allFilterLis[i]).addClass("filter-content-li-active");
                }
            }
        }
    }

    //添加感兴趣职位
    function addInterestJob() {
        var params = {};
        params["like.contentId"] = $("#job-detail-id").text();
        params["like.type"] = "ijp";
        params["like.userId"] = q['user'].userId;
        net.post("recruitment/doLike",params,function(error){
            console.log(error);
        },function(response){
            if(response.code == 0){
                islike = 1;
            }
        })
    }
    //取消感兴趣的职位
    function cancelInterestJob() {
        var params = {};
        params["like.contentId"] = $("#job-detail-id").text();
        params["like.type"] = "ijp";
        params["like.userId"] = q['user'].userId;
        net.post("recruitment/doUnLike",params,function(error){
            console.log(error);
        },function(response){
            if(response.code == 0){
                islike = 0;
            }

        })
    }

    //查询所有技能
    function getAllSkills(callback){
        net.post("recruitment/getAllSkill",{},function(error){

        },function(res){
            if(res.code === 0){
                if(typeof callback === "function"){
                    callback(res.data.skillList);
                }
            }
        })
    }

    //查询所有级别
    function getAllLevel(callback){
        net.post("recruitment/getAllRecruitmentLevel",{},function(error){

        },function(res){
            if(res.code === 0){
                if(typeof callback === "function"){
                    callback(res.data.levelList);
                }
            }
        })
    }

    //初始化div高度
    function initDivHeight(pagefrom ){
        var screen_height = $(window).height();
        if(pagefrom){
            $(".job-detail-content-wrapper").css("height",(screen_height - 64 -10) + "px");

        }else{
            $(".job-detail-content-wrapper").css("height",(screen_height - 64 - ($(".job-detail-foot-nav").height())) + "px");
        }
    }

    function handleContent(str) {
        return str.replace(/white-space: nowrap/g,'white-space: normal;');
    }

    //点击help图标加载refer a friend PDF
    $("#to-job-help").off("tap").on("tap",function(){
        // loadPdf();
        $.mobile.changePage("#job-help", { transition: "slide",reverse: false,changeHash: false});

    })
    $('#toJobSub').off("touchend").on("touchend",function(e){
        //loadPdf();
        $.mobile.changePage("#job-subscribe", { transition: "slide",reverse: false,changeHash: false});
        e.preventDefault();
    })
    $("#job-help #job-help-back").off("touchend").on("touchend",function(){
        $.mobile.changePage("#jobPost", { transition: "slide",reverse: true,changeHash: false});
        $("#jobPost .job-content").scrollTop(0);
    })

    $("#jobPost .jobBack").off("touchend").on("touchend",function(){
        $.mobile.changePage("#assistantHome", { transition: "slide",reverse: true,changeHash: false});
    })
    $("#job-detail #job-detail-back").off("touchend").on("touchend",function(){
        job_id = "";
        if($(this).hasClass("from-chat-bot")){
            $.mobile.changePage("#chatbot_page",{transition:"slide",reverse:true,changeHash:false});
        }else if(prePage === "job-like-list"){
            $.mobile.changePage("#jobs-like-page", { transition: "slide",reverse: true,changeHash: false});
        } else {
            $.mobile.changePage("#jobPost", { transition: "slide",reverse: true,changeHash: false});
        }
    });
    $("#job-learn-more .moreBack").off("touchend").on("touchend",function(){
        $.mobile.changePage("#jobPost", { transition: "slide",reverse: true,changeHash: false});
        $("#jobPost .job-content").scrollTop(0);
    });
    //切换类型
    // $(".job-type-wrapper ul").off("tap").on("tap","li",function(){
    //     $(".job-list-wrapper ul").empty();
    //     loadingMask = true;
    //     loading();
    //     $(".job-type-wrapper ul li").removeClass("active");
    //     $(this).addClass("active");
    //     JobType = $(this).attr("key");
    //     getRecruitingJobList();
    // })
    //添加关注和取消关注
    $(".job-detail-foot-nav ul>li:first").on("tap",function(){
        if(islike==0){
            $(".job-detail-like-image img").attr("src","./images/job/liked.svg");
            addInterestJob();
        }else{
            $(".job-detail-like-image img").attr("src","./images/job/like.svg");
            cancelInterestJob();
        }
    })
    //mail
    $(".job-detail-foot-nav ul>li:last").off("tap").on("tap",function(){
        if(canMail==0){
            dia.alert("msg","This job apply only for internal.",['OK'],function(){});
        }else{
            var jobId = $("#job-detail-id").text();
            var params = {
                "title":$(".job-detail-header-info .work-name").text(),
                "info":"您的好友给您推荐了一份工作，请注意查收 http://120.79.195.92/JobShare/index.html?job_id="+jobId
            }
            //调用native的mail方法
            MailJob.jobMailTo(params,function(res){
            },function(err){

            });
        }
    })
    //分享
    $(".job-detail-header-share").off("tap").on("tap",function(){
        if(canShare == 0){
            dia.alert("msg","This job apply only for internal.",['OK'],function(){});
        }else{
            var jobId = $("#job-detail-id").text();
            var params = {
                "title":$(".job-detail-header-info .work-name").text(),
                "desc":"你的好友正在分享给你一份工作，请注意查收",
                "link": "http://120.79.195.92/JobShare/index.html?job_id="+jobId
            }
            //调用native的share方法
            ShareJob.jobShareTo(params,function(res){
            },function(err){

            });
        }
    })
    //点击到详情
    $(".job-list-wrapper ul").off("tap").on("tap",'li',function(e){
        job_id = $(this).attr("key");
        prePage = "";
        delay_till_last(job_id,function() {
            $.mobile.changePage("#job-detail", { transition: "slide",reverse: false,changeHash: false});
        },300)
    })

    //切换过滤条件
    $(".job-filter-item li").off("tap").on("tap",function(e){
        var index = $(this).index(); //0:City 1:Skill 2:Level
        $(".job-filter-item li").removeClass("job-filter-item-active");
        $(this).addClass("job-filter-item-active");
        var filterContent = [];
        if(index === 0){
            filterClass = 0; //暂存当前选择的状态
            filterContent = [{id:1,cityName:"Xi'an"},{id:2,cityName:"Guangzhou"},{id:3,cityName:"Others"}];
            renderFilterCitys(filterContent);
        } else if(index === 1){
            filterClass = 1;
            getAllSkills(renderFilterSkills)
        } else if(index === 2){
            filterClass = 2;
            getAllLevel(renderFilterLevel)
        }
    })

    //点击filter
    $(".filter-content ul").on("touchend","li",function(){
        // var $index = $(this).index() + 1;
        var $index = $(this).attr("key");
        var hasSelected = $(this).hasClass("filter-content-li-active");
        // $("filter-content ul>li").removeClass("filter-content-li-active");
        $(this).siblings().removeClass("filter-content-li-active");

        if(hasSelected){
            $(this).removeClass("filter-content-li-active");
            saveSelectFilter($index);
        }else{
            $(this).addClass("filter-content-li-active");
            saveSelectFilter($index,"push");
        }
    })

    //暂存filter的选择状态
    function saveSelectFilter(index,flag){
        if(filterClass === 0){
            //City
            if(flag === "push"){
                // emptyArr(filterCity).push(index);
                filterCity = index;
            }else {
                filterCity = "";
            }
        }else if(filterClass === 1){
            //Skill
            if(flag === "push"){
                filterSkill = index;
            }else{
                filterSkill = "";
            }
        }else if(filterClass === 2){
            //level
            if(flag === "push"){
                filterLevel = index;
            }else{
                filterLevel = "";
            }
        }
    }

    //删除数组的某一项
    function emptyArr(arr){
        arr.splice(0,arr.length)
    }
    $("#jobPost").on("pagebeforeshow", function() {
        filterCity = "";
        filterSkill = "";
        filterLevel = "";
        filterClass = 0;
        $("#jobPost .job-content").css("height",($(window).height() - 200) + "px");
        $("#job-list-mescroll").css("height",($(window).height()-200)+"px");
        $('#news_footer').hide();
    })
    //job-help 初始化页面高度
    $("#job-help").on("pageshow", function() {
        $("#refer-a-friend-programme").css("height",($(window).height() - 44-20) + "px").scrollTop(0);
    })
    //详情页面
    $("#job-detail").on("pagebeforeshow",function(){
        if(!pagefrom){
            getJobDetail(job_id);
            initDivHeight();
            $(".job-detail-foot-nav").show();
            $(".job-detail-header-share").show();
            $(".job-detail-header").css("position","");
            $("#job-title").css("position","");
        }else{
            initDivHeight(pagefrom);
            $(".job-detail-foot-nav").hide();
            $(".job-detail-header-share").hide();
            $(".job-detail-header").css("position","relative");
            $("#job-title").css("position","absolute");
        }
        $(".no-job-detail-info").hide();
    });
    $("#job-detail").on("pageshow",function(){
        $(".job-detail-content-wrapper").scrollTop(0);
    });
    $('#job-detail').on("pagehide",function(){
        pagefrom = '';
        job_id = '';
    });
    //页面初始化
    $("#jobPost").on("pageshow", function() {
        // getRecruitingJobList();
        mescrollEvent = new MeScroll('job-list-mescroll',{
            down:{
                auto:false,
                clearId:'listView',
                callback:upCallback({num:1})
            },
            up: {
                callback: upCallback,
                clearId:'listView',
            }
        });
    });
    $('#jobPost').on("pagehide",function(){
        mescrollEvent.destroy();
        $('#listView').html('');
    });
    //Learn More
    $(".job-basic-info-button").on("tap",function(e){
        e.stopPropagation();
        $.mobile.changePage("#job-learn-more", { transition: "slide",reverse: false,changeHash: false});
    })
    //job-learn-more页面初始化
    $("#job-learn-more").on("pagebeforeshow",function(){
        $("#job-learn-more-content").scrollTop(0);
    })
    //过滤 filter
    $(".tag-filter").on("touchend",function(e){
        e.stopPropagation();
        $("#job-post-filter-wrapper").show();
        $(".job-filter-item li:first").tap();
        $(".filter-mask").css("height",($(window).height() - 230) + "px")
    })

    //隐藏遮罩层
    $(".filter-mask").on("touchend",function(e){
        e.preventDefault();
        if(!$(".filter-mask").hasClass("filter-hidden")){
            $("#job-post-filter-wrapper").hide();
        }
    })
    /**
     job subscribe
     */
    $('#job-subscribe-back').off("touchend").on("touchend",function(){
        $.mobile.changePage("#jobPost", { transition: "slide",reverse: true,changeHash: false});
        $("#jobPost .job-content").scrollTop(0);
    })
    $("#job-subscribe").on("pagebeforeshow",function(){
        $('#subscribe-content').css("height",($(window).height() - 64) + "px");
        getAllSkills(renderSkillList );
        getAllLevel( renderLevelList);
    });
    $("#job-subscribe").on("pageshow", function() {
        var userRecordSub = localStorage.getItem('userSelectedItems');
        var data = JSON.parse(userRecordSub);
        if(data){
            if(data.subSkill.length>0){
                $.each(data.subSkill, function (index, val) {
                    $("[data-skill ="+ val +"]").addClass('sub-item-active');
                });
            }
            if(data.subLevel.length>0){
                $.each(data.subLevel, function (index, val) {
                    $("[data-level ="+ val +"]").addClass('sub-item-active');
                });
            }
            if(data.subCity.length>0){
                $.each(data.subCity, function (index, val) {
                    $("[data-city ="+ val +"]").addClass('sub-item-active');
                });
            }
        }
    })
    //渲染等级列表
    function renderLevelList(data){
        if(data){
            var html = ``;
            $.each(data,function(index,val){
                html += `<div class="filter-items" data-level =${val.id}>${val.levelName}</div>`;
            });
            $('#subLevel .filter-list').html(html);
        }else{
            dia.alert("msg","Please check your network.",['OK'],function(){});
        }
    }
    //渲染技能列表
    function renderSkillList(data){
        if(data){
            var html = ``;
            $.each(data,function(index,val){
                html += `<div class="filter-items" data-skill =${val.id}>${val.skillName}</div>`;
            });
            $('#subSkill .filter-list').html(html);
        }else{
            dia.alert("msg","Please check your network.",['OK'],function(){});
        }
    }
    //保存用户推送选项
    function saveUserSubContent(userSelectedData){
        if(userSelectedData){
            var url = 'recruitment/setFavoritIJP';
            var dataPost = {};
            dataPost['recruitmentPush.userId'] =  q['user'].userId;
            dataPost['recruitmentPush.levelId'] =  userSelectedData.subLevel;
            dataPost['recruitmentPush.skillId'] =  userSelectedData.subSkill;
            dataPost['recruitmentPush.jobAddress'] =  userSelectedData.subCity;
            net.post(url,dataPost,function(err){
                dia.alert(err.msg,"Please check your nectwork.",['OK'],function(){});
            },function(succ){
                if(succ.code === 0){
                    $('#bottom-btn').show();
                    $('#bottom-btn').fadeOut(2000);
                    //    前端页面记录用户选项
                    localStorage.setItem('userSelectedItems',JSON.stringify(userSelectedData));
                }else{

                }
            })
        }
    }
    //点击item 切换点亮状态
    $('#subscribe-content').off("touchend").on("touchend",'.filter-items',function(e){
        $(this).toggleClass('sub-item-active');
        e.preventDefault();
    });
    //点击save按钮获得用户选项并联调(待优化代码）
    $('#job-sub-save').on('tap',function(){
        var userSelectedData = {};
        var subSkill = [];
        var subCity = [];
        var subLevel = [];
        $.each($('.sub-item-active', $('#subSkill')), function (index, val) {
            subSkill.push($(val).attr('data-skill'));
        });
        $.each($('.sub-item-active', $('#subCity')), function (index, val) {
            subCity.push($(val).attr('data-city'));
        });
        $.each($('.sub-item-active', $('#subLevel')), function (index, val) {
            subLevel.push($(val).attr('data-level'));
        });
        userSelectedData["subSkill"] = subSkill;
        userSelectedData["subCity"] = subCity;
        userSelectedData["subLevel"] = subLevel;
        saveUserSubContent(userSelectedData);
    });

    //save 根据过滤条件搜索
    $(".filter-save-btn").on("touchend",function(e){
        e.preventDefault();
        $("#job-post-filter-wrapper").hide();
        // getRecruitingJobList();
        $('#listView').html('');
        upCallback();
    })

    /**
     * Me页面中的收藏工作模块
     */
    $('#jobs-like-page').on("pagebeforeshow",function(){
        getJobLikesById(renderJobLikesList);
    })

    //Me 页面中的收藏工作列表
    function getJobLikesById(callback){
       net.post("recruitment/getUserLikesJobById",{
           userId:q['user'].userId
       },function(err){
           console.error("request error: recruitment/getUserLikesJobById");
       },function(res){
           if(res && res.code === 0){
                if(callback && typeof callback === "function"){
                    callback(res.data.recruitmentList)
                }
           }
       })
    }
    //渲染收藏工作的列表
    function renderJobLikesList(list){
        var html = "";
        if(list && list.length > 0){
            list.forEach(function(item,index){
                html += "<li class='job-like-item' key='"+item.id+"'><div class='job-like-info'><div class='job-like-item-number'>"+item.recruitmentNo+"</div><div class='job-like-item-date'>"+formatDate(item.likeTime * 1000)+"</div></div><div class='job-like-item-title'>"+item.title+"</div></li>"
            })
        }else {
            html = "<div class='job-like-list-empty'>You haven't like any jobs yet.</div>"
        }
        $(".job-like-list-wrapper").empty().append(html);
    }
    //返回到Me页面
    $("#job-like-back").off("tap").on("tap",function(){
        $.mobile.changePage("#myCornerHome", { transition: "slide",reverse: true ,changeHash: false});
    })

    $(".job-like-list-wrapper").off("tap").on("tap","li",function(event){
        event.preventDefault();
        job_id = $(this).attr("key");
        $("#job-detail .jobBack").addClass("from-job-like-list");
        prePage = "job-like-list";
        delay_till_last(job_id,function() {
            $.mobile.changePage("#job-detail", { transition: "slide",reverse: false,changeHash: false});
        },300)
    })

    return {
        renderJobDetail:function(data){
            renderJobDetail(data);
        },
    }
});
