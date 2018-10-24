/**
 * Created by testbetta1 on 15/9/7.
 * Edit by bruce on 17/9/20.
 */
define(function(require) {
    /***
    1.1.加载模块js
    ***/
    var $ = require('jquery'),
        m = require('jquerymobile'),
        net = require('net'),
        dia = require('dialogs'),
        bookDetailed = require('book_detail'),
        bookcheck = require('book_check'),
        panle = require('panle'),
        mustache = require('mustache'),
        text = require('text'),
        book_library = require('text!book_library'),
        book_list = require('text!book_list');

    //当前图书馆是哪个 1: ot1 2:ot2
    var current_ot = 2;

    //设置tab的acive
    function　setTabOfOt(selector){
        $("#"+selector).find("li").removeClass("activeColor");
        if(current_ot == 1){
            $("#"+selector).find("li:first-child").addClass("activeColor");
        }
        if(current_ot == 2){
            $("#"+selector).find("li:last-child").addClass("activeColor");
        }
    }

    //获取图书馆 begin
   function getLibrarys(){
        var url = 'Library/getLibrarys';
        var params = {};
        net.get(url, params, function (error) {}, function (response) {
            if (response.code != -1) {
                var data = response.data.Librarys;
                if(data){
                    $("#my-book-nav").show();
                    $("#my-book-nav").html(mustache.render(book_library, response));
                    current_ot  = 1;
                    setTabOfOt("my-book-nav");
                    getBorrowBooks(true,null);
                }
            }
        });
    }

   //获取图书馆 end
    $('#my-book-nav').off('tap').on('tap', 'li', function () {
        resetAllBtns();
        emptyDivAndLoading("bookshow_ul");
        current_ot  = $(this).index() + 1 ;
        setTabOfOt("my-book-nav");
        $("#book_cancel_ol").click();
        getBorrowBooks(true,null);
        $("#book_content").scrollTop(0);
    });

    /***
     2.页面iscroll初始化以及返回
     ***/
    function initPageLoading(wrapper) {
        var $wrapper = $("#" + wrapper),
            $pullUpEl = $wrapper.find(".book-pullup");
        var $pullUpLabel = $pullUpEl.find(".pullUpLabel");
        var $pullUpIcon = $pullUpEl.find(".pullUpIcon");
        $wrapper.find(".scroller").css(window.getVendorStyle("transform"), "translate(0px, 0px) scale(1) translateZ(0px)");
        // $pullUpEl.attr("class", "loading");
        // $pullUpLabel.text("Loading...");
        // $pullUpIcon.show();
    }
    /**
     * reset filter btn、search btn and sortBy btn
     *
     * @Param {Type} name
     * @Returns {returnType}
     * @Author Linda
     * @Date 16/10/2017
     */
    function resetAllBtns(){
        //reset filer if it unfold
        if(!$("#category_info").is(':hidden')){
            $('#book_ingory').click();
        }
        if(!$("#sort_content_opacity").is(':hidden')){
            $('#sort_content_opacity .sort_cancel').click();
        }

    }
    /**
     * empty content div and add loading btn tips
     *
     * @Param {Type} name
     * @Returns {returnType}
     * @Author Linda
     * @Date 16/10/2017
     */
    function emptyDivAndLoading(selector){
       $("#"+selector).empty();
       var loadingHtml = "<div class='loading-div'><img src='./images/loading.gif'/></div>";
       $("#"+selector).html(loadingHtml);
    }
    function disableElement(curEve){
        //$("#book_search").attr('disabled',true);
        $('#book_search').addClass('disableDiv');
        $("#book_catalog").addClass('disableDiv');
        $("#book_sort").addClass('disableDiv');
        $("#book_category").addClass('disableDiv');
        $("#my-book-nav li").addClass('disableDiv');
        $('#'+curEve).removeClass('disableDiv');
    }
    function releaseElement(){
        $("#book_search").removeClass('disableDiv');
        $("#book_catalog").removeClass('disableDiv');
        $("#book_sort").removeClass('disableDiv');
        $("#book_category").removeClass('disableDiv');
        $("#my-book-nav li").removeClass('disableDiv');
    }

    /*$('#book_content').on('swiperight',function() {
        if($("#borrowbook_ul").is(':visible')){
            $("#borrowbook_ul").hide(600);
            $("#bookshow_ul,#book_search,#book_category,#search_area").show(600);
            $('#title_book').html("Book²");
        }else{
            $.mobile.backChangePage("#assistantHome",{ transition: "slide",reverse: true,changeHash: false});
        }
    });*/
    // 补充0
    /***
     3.实例化iscroll插件工具
     ***/
    var inputval_ol_focus = false;
    var bookInfos = [];
    var bookfilter;
    var condationData = {};
    var sort_val = "";
    var title_html = $("#title_book").html();
    var isScrolling = false,
        //第一个scroll实例化lib1
        iScroll_borrowbook = {
            myScroll: null,
            allowGetMore: true,
            pullUpAction: function () {
                title_html = $("#title_book").html();
                if(title_html == "Book²"){
                    getBorrowBooks(false,condationData,$('#my-book-nav li.activeColor').prop('id'));
                }else{
                    get_favor(false);
                }
            },
            loaded: function(wrapper) {
                var $wrapper = $("#" + wrapper),
                    $pullUpEl = $wrapper.find("#pullUp_borrowbook"),
                    $pullUpLabel = $pullUpEl.find(".pullUpLabel"),
                    $pullUpIcon = $pullUpEl.find(".pullUpIcon");
                     // pullUpOffset = $pullUpEl[0].offsetHeight;
                     // pullUpOffset = 0;
                iScroll_borrowbook.myScroll = new iScroll(wrapper, {
                    hScrollbar: false,
                    vScrollbar: false,
                    useTransition:false,
                    checkDOMChanges:false,
                    onRefresh: function () {
                        if ($pullUpEl.hasClass("loading")) {
                            $pullUpEl.removeClass("loading");
                            if (iScroll_borrowbook.allowGetMore) {
                                $pullUpIcon.show();
                                $pullUpLabel.text("Pull up to load more...");
                            } else {
                                $pullUpIcon.hide();
                                $pullUpLabel.text("");
                            }
                        }
                    },
                    onScrollMove: function () {
                        if (this.y < (this.maxScrollY - 5) && !$pullUpEl.hasClass("flip")) {
                            if (iScroll_borrowbook.allowGetMore) {
                                $pullUpEl.addClass("flip");
                                $pullUpLabel.text("Release to refresh...");
                                this.maxScrollY = this.maxScrollY;
                            }
                        } else if (this.y > (this.maxScrollY + 5) && $pullUpEl.hasClass("flip")) {
                            if (iScroll_borrowbook.allowGetMore) {
                                $pullUpEl.removeClass("flip");
                                $pullUpLabel.text("Pull up to load more...");
                                this.maxScrollY = pullUpOffset;
                            }
                        }
                        isScrolling = true;
                    },
                    onScrollEnd: function () {
                        if ($pullUpEl.hasClass("flip")) {
                            if (iScroll_borrowbook.allowGetMore) {
                                iScroll_borrowbook.allowGetMore = false;
                                $pullUpEl.attr("class", "loading");
                                $pullUpLabel.text("Loading...");
                                iScroll_borrowbook.pullUpAction();
                            }
                        }
                        setTimeout(function() {
                            isScrolling = false;
                        }, 500);
                    }
                });
            }
            //第二个iscroll初始化lib2
        },
        iScroll_borrowbook2 = {
            myScroll: null,
            allowGetMore: true,
            pullUpAction: function () {
                title_html = $("#title_book").html();
                if(title_html == "Book²"){
                    getBorrowBooks(false,condationData,$('#my-book-nav li.activeColor').prop('id'));
                }else{
                    get_favor(false);
                }
            },
            loaded: function(wrapper) {
                var $wrapper = $("#" + wrapper),
                    $pullUpEl = $wrapper.find("#pullUp_borrowbook2"),
                    $pullUpLabel = $pullUpEl.find(".pullUpLabel"),
                    $pullUpIcon = $pullUpEl.find(".pullUpIcon"),
                    // pullUpOffset = $pullUpEl[0].offsetHeight;
                     pullUpOffset = 0;
                iScroll_borrowbook2.myScroll = new iScroll(wrapper, {
                    hScrollbar: false,
                    vScrollbar: false,
                    fixedScrollbar: true,
                    useTransition:false,
                    checkDOMChanges:false,
                    // topOffset: 50,
                    onRefresh: function () {
                        if ($pullUpEl.hasClass("loading")) {
                            $pullUpEl.removeClass("loading");
                            if (iScroll_borrowbook2.allowGetMore) {
                                $pullUpIcon.show();
                                $pullUpLabel.text("Pull up to load more...");
                            } else {
                                $pullUpIcon.hide();
                                $pullUpLabel.text("");
                            }
                        }
                    },
                    onScrollMove: function () {
                        if (this.y < (this.maxScrollY - 5) && !$pullUpEl.hasClass("flip")) {
                            if (iScroll_borrowbook2.allowGetMore) {
                                $pullUpEl.addClass("flip");
                                $pullUpLabel.text("Release to refresh...");
                                this.maxScrollY = this.maxScrollY;
                            }
                        } else if (this.y > (this.maxScrollY + 5) && $pullUpEl.hasClass("flip")) {
                            if (iScroll_borrowbook2.allowGetMore) {
                                $pullUpEl.removeClass("flip");
                                $pullUpLabel.text("Pull up to load more...");
                                this.maxScrollY = pullUpOffset;
                            }
                        }
                        isScrolling = true;
                    },
                    onScrollEnd: function () {
                        if ($pullUpEl.hasClass("flip")) {
                            if (iScroll_borrowbook2.allowGetMore) {
                                iScroll_borrowbook2.allowGetMore = false;
                                $pullUpEl.attr("class", "loading");
                                $pullUpLabel.text("Loading...");
                                iScroll_borrowbook2.pullUpAction();
                            }
                        }
                        setTimeout(function() {
                            isScrolling = false;
                        }, 500);
                    }
                });
            }
            //第二个iscroll初始化lib2
        };
    /***
     4.初始化数据 pageNumber为1
     ***/
    // 当前页数
    var currentPageNumer = 1;
    //创建点赞或注册活动
    // function createBorrowBookHtml(borrowData) {
    //     var bookimg = borrowData.book_cover;
    //     var bookname = borrowData.book_Name;
    //     var author = borrowData.book_Author;
    //     var borrownum = borrowData.available_quantity;
    //     var bookSn = borrowData.book_sn;
    //     var authorEle = "";
    //     if(author){
    //         authorEle = '\<span style="font-size: 10px; margin: 10px 0 0 0; color: #808080; -webkit-line-clamp: 1;\
    //     -webkit-box-orient: vertical; text-overflow: ellipsis; white-space: normal; overflow: hidden; display: -webkit-box; word-break: break-word;">By '+author+'\</span>';
    //     }
    //     var html = '\<li style="margin-top:16px;padding:0px; border: none; height: 60px;background: none;border-radius: 0;" id="'+bookSn+'"\ ><div style="float:left;\
    //     float: left; width: 46px; height: 60px; display: -webkit-flex;display:flex; -webkit-align-items: center; -webkit-justify-content: center;"><img src="'+bookimg+'"\ \
    //     style="text-align:center;max-width:46px;max-height:60px;"/></div>\
    //     <div style="float: right; line-height: 60px; font-size: 10px; color: #808080; width: 65px; height: 60px;text-align:right;">'+borrownum+'\ available</div>\
    //     \<div style="margin: 0px 81px 0 62px; height: 60px;display:-webkit-flex; display:flex;-webkit-align-items: center;"><div><span style="font-size:12px;color:#404040;margin:auto 0;height:auto;overflow: hidden; \
    //     \display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;word-break: break-word; -webkit-line-clamp: 2; -webkit-box-orient: vertical;\
    //     text-overflow: ellipsis; white-space:normal;">'+bookname+'\</span>'+authorEle+'\</div></div></li>';
    //     return html;
    // }

    /**
     * 5.
     * 展示已点赞新闻/展示当前已注册活动
     * @param content
     */
    function showBorrowBooks(contentList,refresh,div) {
        var $borrowbook_listview = $("#"+ div);
        if(contentList.data.BookList.length >0){
            var html = mustache.render(book_list, contentList);
            if(refresh){
                //使用innerHTML的方法渲染dom
                $borrowbook_listview.empty();
                $borrowbook_listview.html(html);
            }
            else{
                $borrowbook_listview.append(html);
            }
        }else{
                //使用innerHTML的方法渲染dom
                $borrowbook_listview.empty();
                $("#book_content").scrollTop(0);
                $borrowbook_listview.html('<li style="margin-top: 30px;">no book so far!</li>');
        }
    }
    /**
     * 5.
     * 获取结束列表模板20170921 begin
     * @param content
     */
    // function showBorrowBooks(contentList,refresh,div) {
    //     var contentHTML = "",
    //         contentArray = [],
    //         $borrowbook_listview = $("#"+ div);
    //     $.each(contentList, function(i, content) {
    //         bookInfos.push(content);
    //         contentArray.push(createBorrowBookHtml(content));
    //     });
    //     contentHTML = contentArray.join("");
    //     if(refresh){
    //         $borrowbook_listview.html(contentHTML);
    //     }
    //     else{
    //         $borrowbook_listview.append(contentHTML);
    //     }
    //     $borrowbook_listview.listview("refresh");
    // }
    function getBorrowBooks(refresh,data) {
        $("#borrowbook_ul").show();
        var sort_nor = $("#book_sort .sort_value").html();
        $("#book").page();
        if (refresh) {
            bookInfos = [];
            currentPageNumer = 1;
        }
        var postData = {};
        postData['library'] = 2;
        postData['pager.pageNo'] = currentPageNumer;
        postData['pager.pageSize'] = 5;
        postData['userName'] = q['user'].userName;
        postData['order'] = 'addtime desc';
        if(data){
            if(data.searchval){
                postData['keywords'] = data.searchval;
            }
            if(data.categoryid){
                postData['category'] = data.categoryid;
            }
            if(data.bookfilter){
                postData['filterNum'] = data.bookfilter;
            }
        }

        if(sort_nor == "Newest arrivals"){
            postData['order'] = 'addtime desc';
        }
        if(sort_nor == "Most borrowed"){
            postData['order'] = 'borrowedcount desc';
        }
        if(sort_nor == "Most commented"){
            postData['order'] = 'commentscount desc';
        }

        $("#bookshow_ul").show();
        $("#borrowbook_ul").hide();

        // 获取新闻
        net.post('bookapp/queryBookList',postData, function(error){
        }, function(response){
            var borrowbooksList = response.data.BookList;
            $("#borrowbook_ul").show();
            if(q['user'].isAdmin  && q['user'].isAdmin == "Y") {
                $("#book_top").show();
            }
            showBorrowBooks(response,true,"bookshow_ul");

            /*if (response.code != 0) {
                var borrowbooksLength = 0;
            }
            else{
                var borrowbooksList = response.data.BookList;
                var borrowbooksLength = borrowbooksList.length;
            }

            if (borrowbooksLength < 1) {
                if(postData['library']==1){
                    iScroll_borrowbook.allowGetMore = false;
                }else{
                    iScroll_borrowbook2.allowGetMore = false;
                }
            } else {
                if(postData['library']==2){
                    iScroll_borrowbook.allowGetMore = true;
                }else{
                    iScroll_borrowbook2.allowGetMore = true;
                }
            }
            if (borrowbooksLength > 0)  {
                if(postData['library']==$("#my-book-nav li:first-child").prop('id')){
                    showBorrowBooks(response,refresh,'bookshow_ul');
                    currentPageNumer++;
                }else{
                    showBorrowBooks(response,refresh,'bookshow_ul2');
                    currentPageNumer++;
                }
            } else {
                if(refresh){
                    if(postData['library']==$("#my-book-nav li:first-child").prop('id')){
                        $("#bookshow_ul").html("");
                    }else{
                        $("#bookshow_ul2").html("");
                    }
                }else{
                    if(postData['library']==$("#my-book-nav li:first-child").prop('id')){
                        $("#bookshow_ul").append("");
                    }else{
                        $("#bookshow_ul2").append("");
                    }
                }
            }
            if (iScroll_borrowbook.myScroll == null&&postData['library']==$("#my-book-nav li:first-child").prop('id')) {
                iScroll_borrowbook.loaded("wrapper_borrowbook");
                initPageLoading("wrapper_borrowbook");
            }
           if (iScroll_borrowbook2.myScroll == null&&postData['library']!=$("#my-book-nav li:first-child").prop('id')) {
            //if (iScroll_borrowbook2.myScroll == null&&postData['library']==$("#my-book-nav li:not(:first-child)").prop('id')) {
                iScroll_borrowbook2.loaded("wrapper_borrowbook2");
                initPageLoading("wrapper_borrowbook2");
            }
            if (refresh) {
                if(q['user'].isAdmin  && q['user'].isAdmin == "Y") {
                    $("#book_top").show();
                }
                if (iScroll_borrowbook.myScroll && iScroll_borrowbook.myScroll.y !== 0) {
                    iScroll_borrowbook.myScroll.y = 0;
                }
                if (iScroll_borrowbook2.myScroll && iScroll_borrowbook2.myScroll.y !== 0) {
                    iScroll_borrowbook2.myScroll.y = 0;
                }
            }
            if( iScroll_borrowbook.myScroll&&postData['library']==$("#my-book-nav li：first-child").prop('id')){
                iScroll_borrowbook.myScroll.refresh();
            }
            if(iScroll_borrowbook2.myScroll&&postData['library']==$("#my-book-nav li:not(':first-child')").prop('id')){
                iScroll_borrowbook2.myScroll.refresh();
            }
            if(borrowbooksLength == 0 && refresh && $("#searchval_content:visible").size() > 0 ){
                var $pullUpEl = $("#wrapper_borrowbook2 #pullUp_borrowbook"),
                    $pullUpLabel = $pullUpEl.find(".pullUpLabel");
                    $pullUpLabel.text("Your search did not match any books.");
            }
            disableClickEvent(false);
            window.shouldPageRefresh.newsroom = false;*/
        });
    }
//sep 26 begin
    function get_favor(refresh,data){
        var sort_nor = $("#book_sort .sort_value").html();
        $("#book").page();
      /*  if (refresh) {
            bookInfos = [];
            currentPageNumer = 1;
        }*/
        var postData = {};
        postData['pager.pageNo'] = currentPageNumer;
        postData['pager.pageSize'] = 10;
        postData['userId'] = q['user'].userId;
        postData['order'] = 'addtime desc';
        if(sort_nor == "Newest arrivals"){
            postData['order'] = 'addtime desc';
        }
        if(sort_nor == "Most borrowed"){
            postData['order'] = 'borrowedcount desc';
        }
        if(sort_nor == "Most commented"){
            postData['order'] = 'commentscount desc';
        }
        $("#bookshow_ul").hide();
        $("#borrowbook_ul").show();
        net.post('bookapp/queryMyLikeBooks',postData,function(error){

        },function(response){
            if(response.code != 0){
                //var borrowbooksLength = 0;
            }else{
                var borrowbooksList = response.data.BookList;
                if (borrowbooksList.length < 1) {
                    //区分增加
                    var $pullUpEl = $("#wrapper_borrowbook #pullUp_borrowbook"),
                        $pullUpLabel = $pullUpEl.find(".pullUpLabel");
                    $("#pullUp_borrowbook .pullUpIcon").css("display", "none");
                    $pullUpLabel.text("No favorite book so far.");
                    iScroll_borrowbook.allowGetMore = false;
                    $('#pullUp_borrowbook').css("display", "none");
                }

                showBorrowBooks(response,refresh,'borrowbook_ul');
            }


                //区分增加
            /*
            } else {
                if($("#my-book-nav li:first-child").hasClass("activeColor")){
                    iScroll_borrowbook.allowGetMore = true;
                    $('#pullUp_borrowbook').css("display","block");
                }else{
                    iScroll_borrowbook2.allowGetMore = true;
                    $('#pullUp_borrowbook2').css("display","block");
                }
            }
            if (borrowbooksLength > 0 && borrowbooksLength < 10)  {
                if($("#my-book-nav li:first-child").hasClass("activeColor")){
                    showBorrowBooks(borrowbooksList,refresh,'borrowbook_ul');
                    currentPageNumer++;
                    $('#pullUp_borrowbook').css("display","none");
                }else{
                    showBorrowBooks(borrowbooksList,refresh,'borrowbook_ul2');
                    currentPageNumer++;
                    $('#pullUp_borrowbook').css("display","none");
                }
            }
            else{
                if($("#my-book-nav li:first-child").hasClass("activeColor")){
                    $('#pullUp_borrowbook').css("display","block");
                    if(refresh){
                        $("#borrowbook_ul").html("");
                    }else{
                        $("#borrowbook_ul").append("");
                    }
                }else{
                    $('#pullUp_borrowbook2').css("display","block");
                    if(refresh){
                        $("#borrowbook_ul2").html("");
                    }else{
                        $("#borrowbook_ul2").append("");
                    }
                }
            }

            if($("#my-book-nav li:first-child").hasClass("activeColor")){
                if (iScroll_borrowbook.myScroll == null) {
                    iScroll_borrowbook.loaded("wrapper_borrowbook");
                }
                if (refresh) {
                    if(q['user'].isAdmin  && q['user'].isAdmin == "Y") {
                        $("#book_top").show();
                    }
                    if (iScroll_borrowbook.myScroll && iScroll_borrowbook.myScroll.y !== 0) {
                        iScroll_borrowbook.myScroll.y = 0;
                    }
                }
                if(iScroll_borrowbook.myScroll){
                    iScroll_borrowbook.myScroll.refresh();
                }
            }else{
                if (iScroll_borrowbook2.myScroll == null) {
                    iScroll_borrowbook2.loaded("wrapper_borrowbook2");
                }
                if (refresh) {
                    if(q['user'].isAdmin  && q['user'].isAdmin == "Y") {
                        $("#book_top").show();
                    }
                    if (iScroll_borrowbook2.myScroll && iScroll_borrowbook2.myScroll.y !== 0) {
                        iScroll_borrowbook2.myScroll.y = 0;
                    }
                }
                if(iScroll_borrowbook2.myScroll){
                    iScroll_borrowbook2.myScroll.refresh();
                }
            }
            disableClickEvent(false);
            window.shouldPageRefresh.book = true;*/
        });
    }
//sep 26 end


//book² 搜索展示 begin
    $('#book_category').off('click').on('click', function(evt){
        //$("#category_content").css("position","absolute");
        $("#search_hl").css("margin-top", "0px");
        $("#book_top").hide();
        $('#category_content').show();
         $('#borrowbook_content').hide();

        $('#search_area').hide();
        $('#search_hl').hide();
        $("#book_content").hide();
        disableElement('book_category');

    });
//book² 搜索展示 end
//book² 搜索隐藏 与 当前列表展示展示 begin
    $('#book_ingory').off('click').on('click', function(evt){

        $("#search_hl").css("margin-top", "10px");
        $('#category_content').hide();
        $('#borrowbook_content').show();
       /* if($("#my-book-nav li:first-child").hasClass("activeColor")){
            $('#borrowbook_content').show();
            //等同于命名content_wrapper_library1
        }else{
            $('#borrowbook_content2').show();
            //等同于content_wrapper_library2
        }*/
        $('#search_area').show();
        $('#search_hl').show();
        $("#book_content").show();
        $("#borrowbook_content").show();
        releaseElement();
    });
//book² 搜索隐藏 与 当前列表展示展示 end
    $("#book_available").off('click')
        .on('click',function(){
            $("#book_available span.idd").toggleClass("fel");
    });

    $('#category_info,#search_content').off('click', 'div.info').on('click', 'div.info', function(evt){
        var cateid = $(this).attr("cateid");
        var id = $(this).attr("id");
        var $cateinfo = $('#search_content div.info');
        var $cateFirst = $('#search_content div.info:first span.icon');
        var $catebtn = $('#search_content .searchbtn');
        var $catebtnno = $('#search_content .searchbtn_no');
        var $cateAllSpan = $('#search_content span.icon');
        if(typeof(cateid) == "undefined"){
            $cateinfo = $('#category_info div.info');
            $cateFirst = $('#category_info div.info:first span.icon');
            $catebtn = $('#category_info #btn_category_apply');
            $catebtnno = $('#category_info #btn_category_apply_no');
            $cateAllSpan = $('#category_info span.icon');
        }

        if(cateid == "all" || id == "all"){
            if($(this).find('span.icon').hasClass("sel")){
                $cateAllSpan.removeClass("sel");
            }
            else{
                $cateAllSpan.addClass("sel");
            }
        }
        else{
            $(this).find('span.icon').toggleClass("sel");
            var $filterCate = $cateinfo.filter(function(){
                return $(this).find("span.icon").hasClass("sel");
            });
            if($cateFirst.hasClass("sel")){
                if($filterCate.length < $cateinfo.length){
                    $cateFirst.removeClass("sel");
                }
            }
            else{
                if($filterCate.length == $cateinfo.length-1) {
                    $cateFirst.addClass("sel");
                }
            }
        }
        var $filteResult = $cateinfo.filter(function(){
            return $(this).find("span.icon").hasClass("sel");
        });
        if($filteResult.length == 0){
            if(typeof(cateid) == "undefined"){
                $catebtn.attr("id","btn_category_apply_no").css("opacity","0.3");
            }
            else{
                if($catebtn.size() > 0){
                    $catebtn.removeClass("searchbtn").addClass("searchbtn_no").css("opacity","0.3");
                }
            }
        }
        else{
            if(typeof(cateid) == "undefined"){
                $catebtnno.attr("id","btn_category_apply").css("opacity","1");
            }
            else{
                if($("#inputval").val() == ""  ){
                    if($catebtn.size() > 0){
                        $catebtn.removeClass("searchbtn").addClass("searchbtn_no").css("opacity","0.3");
                    }
                }
                else {
                    if($catebtnno.size() > 0){
                        $catebtnno.removeClass("searchbtn_no").addClass("searchbtn").css("opacity","1");
                    }
                }
            }
        }
    });

    $(document).ready(function() {
        $("#inputval").bind('input propertychange', function () {
            var $catebtn = $('#search_content .searchbtn');
            var $catebtnno = $('#search_content .searchbtn_no');
            var $filteResult = $('#search_content div.info').filter(function(){
                return $(this).find("span.icon").hasClass("sel");
            });
            if($filteResult.length == 0){
                if($catebtn.size() > 0){
                    $catebtn.removeClass("searchbtn").addClass("searchbtn_no").css("opacity","0.3");
                }
            }
            else{
                if($("#inputval").val() == ""){
                    if($catebtn.size() > 0){
                        $catebtn.removeClass("searchbtn").addClass("searchbtn_no").css("opacity","0.3");
                    }
                }
                else {
                    if($catebtnno.size() > 0){
                        $catebtnno.removeClass("searchbtn_no").addClass("searchbtn").css("opacity","1");
                    }
                }
            }
        });
    });
//过滤Apply点击的时候逻辑处理begin   =============================================>
    $('#category_info').off('click', '#btn_category_apply').on('click', '#btn_category_apply', function(evt) {
        $("#search_hl").show();
        var $filterCate = $('#category_info div.info').filter(function(){
            return $(this).find("span.icon").hasClass("sel");
        });
        var cateVal = "";
        if($filterCate.length == $('#category_info div.info').length){
            cateVal = "all";
            if($("#book_available span.idd").hasClass("fel")){
                $("#book_category span").css("color","rgb(255,0,0)");
            }else{
                $("#book_category span").css("color","#808080");
            }
        }
        else if($filterCate.length > 0){
            var cateInfo = [];
            $.each($filterCate,function(){
                cateInfo.push($(this).attr("id"));
            });
            cateVal = cateInfo.join(",");
            $("#book_category span").css("color","rgb(255,0,0)");
        }
        //判断图书是否过滤 fel有红对勾 无fel无红对勾
        if($("#book_available span.idd").hasClass("fel")){
            bookfilter = "Y";
        }else{
            bookfilter = "N";
        }
        $('#category_content').hide();
        $("#category_content").css("position","static");
        //book_content 图书列表不展示的解决20171006  begin
        $("#book_content").show();
        //book_content 图书列表不展示的解决20171006  end
        $("#borrowbook_ul").html("");
        initPageLoading("wrapper_borrowbook");
       /* if($("#my-book-nav li:first-child").hasClass("activeColor")){
            $("#borrowbook_ul").html("");
            initPageLoading("wrapper_borrowbook");
        }else{
            $("#borrowbook_ul2").html("");
            initPageLoading("wrapper_borrowbook2");
        }*/

        if(cateVal == ""){
            condationData = {};
            getBorrowBooks(true,condationData);
        }
        else{
            condationData = {"categoryid":cateVal,"bookfilter":bookfilter};
            getBorrowBooks(true,{"categoryid":cateVal,"bookfilter":bookfilter});
        }
        $('#borrowbook_content').show();
     /*   if($("#my-book-nav li:first-child").hasClass("activeColor")){
            $('#borrowbook_content').show();
        }else{
            $('#borrowbook_content2').show();
        }*/

        $('#search_area').show();
        $('#search_hl').css("margin-top","10px");
        releaseElement();
    });
//过滤Apply点击的时候逻辑处理 end  =====================================================>
    $('#book_content #searchval_content #searchvalshow').off('click').on('click',function(evt){
        $('#search_content').show();
    });

    $('#book_search').off('click').on('click',function(evt){
        if($('#btn_category_apply').is(":visible")){
            $('#search_area').hide();
            $('#search_hl').hide();
        }else{
            $('#search_area').show();
            $('#search_hl').show();
        }
        $('#search_content').show();
        $('#inputval').val("");
        $('#book_del').css('display','none');
        $('#search_content_opacity').css("display","block");
        $('#search_area').css("margin-bottom","10px");
        // $('#search_area').show();
        // $('#search_hl').show();
        $("#inputval").focus();
        $("#inputval").bind('input propertychange',function(){
            $("#book_del").css("display","block");
        });
        disableElement('book_search');
    });
    //点击sort by排序  页面底部出现的新入/借阅最多/评论最多的过滤选择栏  出现begin
    $('#book_sort').off('click').on('click',function(eve){
            $("#sort_content_opacity").css("display","block");
            disableElement('book_sort');
            if(!$("#sort_content_opacity").is(':visible')){
                $(".module-sort-filter").css('z-index',999);
            }
            $("#book_content").removeClass("overflow-toch");
        });

    //点击sort by排序  页面底部出现的新入/借阅最多/评论最多的过滤选择栏  隐藏begin
    $('#sort_list .sort_cancel').off('click')
        .on('click',function(){
            $("#sort_content_opacity").css("display","none");
            if($("#sort_content_opacity").is(':visible')){
                $(".module-sort-filter").css('z-index',0);
            }else{
                $(".module-sort-filter").css('z-index',999);
            }
            releaseElement();
            $("#book_content").addClass("overflow-toch");
        });
//根据新入sort
    $('#sort_content_opacity .newest_arrivals').off('click')
        .on('click',function(){
            $(".newest_arrivals_btn").css("display","block");
            $(".most_borrowed_btn").css("display","none");
            $(".most_commented_btn").css("display","none");
            $("#sort_content_opacity").css("display","none");
            var sort_val = $("#book_sort .sort_value").html("newest arrivals");
            if($("#book_available span.idd").hasClass("fel")){
                condationData["bookfilter"]="Y";
            }else{
                condationData["bookfilter"]="N";
            }
            title_html = $("#title_book").html();
            if(title_html == "Book²"||title_html == "book"){
                getBorrowBooks(true,condationData);
                $("#book_content").scrollTop(0);
            }
            if(title_html == "My favorites"){
                get_favor(true,condationData);
            }
            releaseElement();
            emptyDivAndLoading("bookshow_ul");
            $("#book_content").addClass("overflow-toch");
        });
//根据借阅最多sort
    $('#sort_content_opacity .most_borrowed').off('click')
        .on('click',function(){
            if($("#book_available span.idd").hasClass("fel")){
                condationData["bookfilter"]="Y";
            }else{
                condationData["bookfilter"]="N";
            }
            $(".newest_arrivals_btn").css("display","none");
            $(".most_borrowed_btn").css("display","block");
            $(".most_commented_btn").css("display","none");
            $("#sort_content_opacity").css("display","none");
            var sort_val = $("#book_sort .sort_value").html("Most borrowed");
            title_html = $("#title_book").html();
            if(title_html == "Book²"||title_html == "Book"){
                getBorrowBooks(true,condationData);
                $("#book_content").scrollTop(0);
            }
            if(title_html == "My favorites"){
                get_favor(true,condationData);
            }
            releaseElement();
            emptyDivAndLoading("bookshow_ul");
            $("#book_content").addClass("overflow-toch");
        });
//根据评论最多sort
    $('#sort_content_opacity .most_commented').off('click')
        .on('click',function(){
            $(".newest_arrivals_btn").css("display","none");
            $(".most_borrowed_btn").css("display","none");
            $(".most_commented_btn").css("display","block");
            $("#sort_content_opacity").css("display","none");
            var sort_val = $("#book_sort .sort_value").html("Most commented");
            if($("#book_available span.idd").hasClass("fel")){
                condationData["bookfilter"]="Y";
            }else{
                condationData["bookfilter"]="N";
            }
            title_html = $("#title_book").html();
            if(title_html == "Book²"||title_html == "Book"){
                getBorrowBooks(true,condationData);
                $("#book_content").scrollTop(0);
            }
            if(title_html == "My favorites"){
                get_favor(true,condationData);
            }
            releaseElement();
            emptyDivAndLoading("bookshow_ul");
            $("#book_content").addClass("overflow-toch");
        });

    $('#book').off().on('touchstart',function(){
        $("#inputval").blur();
        $("#inputval_ol").blur();
    });
//作者书名搜索中的叉号icon
    $("#search_content #book_del").off('click').on('click',function(){
        $('#search_content').show();
        $("#inputval").focus();
        $("#inputval").val("");
        $('#search_area').css("margin-bottom","10px");
        $("#book_del").css("display","none");
        $("#search_content_opacity").css("display","block");
    });
//右上角slideup slidedown begin
    $('#book_catalog').off('click').on('click',function(evt){
        if($("#catlog_content").hasClass("showcatlog")){
            releaseElement();
            $("#catlog_content").removeClass("showcatlog") ;
            $("#catlog_content").slideUp(500);
        }
        else{
            disableElement('book_catalog');
            $("#catlog_content").addClass("showcatlog") ;
            $("#catlog_content").slideDown(500);
        }
    });
    //右上角slideup slidedown end
    $('#catlog_opacity').off('click').on('click',function(evt){
        $("#catlog_content").removeClass("showcatlog") ;
        $("#catlog_content").slideUp(500);
    });

    $('#book_top').off('click').on('click',function(evt){

            cloudSky.zBar.scan(null, function (s) {
                net.post('bookapp/readBorrowBook', {
                    content: s,
                    userName: q['user'].userName
                }, function (error) {

                }, function (response) {
                    if (response.code == net.code.error) {
                        dia.alert('Confirmation', response.msg, ['OK'], function (title) {
                        });
                    } else {
                        $("#book_check").page();
                        var dataInfo = response.data.Info;
                        dataInfo.fromUrl = "book";
                        bookcheck.showDetailWithCheckBook(dataInfo);
                        $.mobile.newChangePage("#book_check", { transition: "slide", reverse: false, changeHash: false});
                    }
                }, {async: false});
            }, function (error) {
                console.error('扫描错误结果:%o', error);
            });
    });

    $('#catlog_info div').off('click').on('click',function(evt){
        if($(this).hasClass("current")){
            if($("#catlog_content").hasClass("showcatlog")){
                $("#catlog_content").removeClass("showcatlog") ;
                $("#catlog_content").slideUp(500);
            }
            else{
                $("#catlog_content").addClass("showcatlog") ;
                $("#catlog_content").slideDown(500);
            }
        }
        else{
            var url = $(this).attr("url");
            if(url == "#book_check"){
                releaseElement();
                $(".current_let").css("background","#f26647");
                $(".favorite_let").css("background","#f26647");
                $(".rule_let").css("background","#f26647");
                $(".check_let").css("background","yellow");
                $("#catlog_content").removeClass("showcatlog") ;
                $("#catlog_content").slideUp(500);
                $("#my-book-nav").show();
                $('#book_category').show();
               // $('#book_content').css('top',155);
                cloudSky.zBar.scan(null, function(s) {
                    net.post('bookapp/readBorrowBook', {
                        content:s,
                        userName:q['user'].userName
                    }, function(error){

                    }, function(response){
                        if (response.code == net.code.error) {
                            dia.alert('Confirmation', response.msg, ['OK'], function(title) {
                            });
                        } else {
                            $(url).page();
                            var dataInfo = response.data.Info;
                            dataInfo.fromUrl = "book";
                            bookcheck.showDetailWithCheckBook(dataInfo);
                            $.mobile.newChangePage(url,{ transition: "slide",reverse: false,changeHash: false});
                        }
                    },{async:false});
                }, function(error) {
                    console.error('扫描错误结果:%o', error);
                });
            }else if(url == "#book_favorite"){
                $("#bookshow_ul").hide();
                $("#borrowbook_ul").show();
                $('#book_search').hide();
                $('#book_category').hide();
                $('#catlog_content').hide();
                $('#search_area').show();
                $('#searchval_content').hide();
                $('#title_book').html("My favorites");
                $("#book_sort .sort_value").html("Newest arrivals");
                $(".current_let").css("background","#f26647");
                $(".favorite_let").css("background","yellow");
                $(".rule_let").css("background","#f26647");
                $(".check_let").css("background","#f26647");
                $(".newest_arrivals_btn").css("display","block");
                $(".most_borrowed_btn").css("display","none");
                $(".most_commented_btn").css("display","none");
                $('#book_content').css('top',105);
               // $('#book_content').css('height', ($(window).height() - 62 - 41));
                $('#book_content').css('height', '100%');
                // $("#my-book-nav").hide();
                 $("#my-book-nav").addClass('not_Visible');
                get_favor(true);
                $("#book_content").scrollTop(0);
                releaseElement();
            }
            else{
                if(url == "#bookrecord_detail"){
                    $("#bookshow_ul").hide();
                    $(".current_let").css("background","yellow");
                    $(".favorite_let").css("background","#f26647");
                    $(".rule_let").css("background","#f26647");
                    $(".check_let").css("background","#f26647");
                    //$('#book_content').css('top',155);
                    $('#book_content').css('top',105);
                    $('#book_category').show();
                    releaseElement();
                }
                if(url == "#book_rule"){
                    $("#bookshow_ul").hide();
                    $(".current_let").css("background","#f26647");
                    $(".favorite_let").css("background","#f26647");
                    $(".rule_let").css("background","yellow");
                    $(".check_let").css("background","#f26647");
                   // $('#book_content').css('top',155);
                    $('#book_content').css('top',105);
                    $('#book_category').show();
                    releaseElement();
                }
                $("#catlog_content").removeClass("showcatlog") ;
                $("#catlog_content").slideUp(500);
                //20170929 更改
                $("#my-book-nav").removeClass('not_Visible');
                $.mobile.newChangePage(url,{ transition: "slide",reverse: false,changeHash: false});
            }
        }
    });

    $('#searchval_content #book_cancel_ol').off('click').on('click',function(){
        $('#inputval_ol').blur();
        setTimeout(function(){
            $('#book_search').show();
            $('#searchval_content').hide();
            $('#search_area').show();
            $('#borrowbook_content').css('height',($(window).height()-44-43));
            $('#inputval').val("");
            $("#borrowbook_ul").html("");
            $('#search_hl').css('display','block');
            $('#search_hl').css("margin-top","10px");
            $('#category_info span.icon').addClass("sel");
            $("#book_available span.idd").removeClass("fel");
            $("#book_category span").css("color","#808080");
            initPageLoading("wrapper_borrowbook");
            condationData = {};
            getBorrowBooks(true,condationData);
        },500);
    });
    $('#searchval_content #book_dol').off('click').on('click',function(){
        $("#book_search").show();
        $('#searchval_content').hide();
        $('#search_content').show();
        $('#inputval').val("");
        $('#book_del').css('display',"none");
        $('#search_hl').css("display","none");
        $('#search_area').css("display","block");
        $("#borrowbook_ul").html("");
        $('#borrowbook_content').css('height',($(window).height()-44-42));
        $('#search_content_opacity').css("display","block");
        $("#inputval").focus();
        $('#category_info span.icon').addClass("sel");
        $("#book_available span.idd").removeClass("fel");
        initPageLoading("wrapper_borrowbook");
        condationData = {};
        getBorrowBooks(true,condationData);
    });
    $('#inputval_ol').focus(function(){
        $("#book_search").show();
        $('#searchval_content').hide();
        $('#search_content').show();
        $('#search_hl').css("display","none");
        $('#search_area').css("display","block");
        $('#search_content_opacity').css("display","block");
        $('#category_info span.icon').addClass("sel");
        $("#book_available span.idd").removeClass("fel");
        $('#inputval').val($("#inputval_ol").val());
        $("#inputval").focus();
        inputval_ol_focus = true;
    });
    $('#inputval').off('keyup')
        .on('keyup', function(evt) {
            if (evt.keyCode == 13 || evt.which === 13) {
                $('#inputval').blur();
                releaseElement();
                setTimeout(function(){
                    $('#search_content').hide();
                    $("#search_area").hide();
                    $("#search_content_opacity").css("display","none");
                    $('#searchval_content #inputval_ol').val($("#inputval").val());
                    $('#search_hl').css('display','block');
                    $('#search_hl').css("margin-top","0px");
                    $('#book_dol').css("display","block");
                    $("#searchval_content").show();
                    $('#category_content').hide();
                    /*if(current_ot == 1){
                        $('#borrowbook_content').show();
                    }else{
                        $('#borrowbook_content2').show();
                    }*/
                    $('#book_search').hide();
                    $('#borrowbook_content').css('height',($(window).height()-44-43));
                    initPageLoading("wrapper_borrowbook");
                    /*if($("#my-book-nav li:first-child").hasClass("activeColor")){
                        initPageLoading("wrapper_borrowbook");
                    }else{
                        initPageLoading("wrapper_borrowbook2");
                    }*/
                    if($("#book_available span.idd").hasClass("fel")){
                        bookfilter = "Y";
                    }else{
                        bookfilter = "N";
                    }
                    var $filterCate = $('#category_info div.info').filter(function(){
                        return $(this).find("span.icon").hasClass("sel");
                    });
                    var cateVal = "";
                    if($filterCate.length == $('#category_info div.info').length){
                        cateVal = "all";
                    }
                    else if($filterCate.length > 0){
                        var cateInfo = [];
                        $.each($filterCate,function(){
                            cateInfo.push($(this).attr("id"));
                        });
                        cateVal = cateInfo.join(",");
                    }
                    var conditionParam = {"searchval":$("#inputval").val(),"bookfilter":bookfilter};
                    if(cateVal == ""){
                        condationData = {"searchval":$("#inputval").val()};
                        getBorrowBooks(true,conditionParam);
                        $("#book_content").scrollTop(0);
                    }
                    else{
                        conditionParam = {"searchval":$("#inputval").val(),"categoryid":cateVal,"bookfilter":bookfilter};
                        condationData = {"searchval":$("#inputval").val(),"categoryid":cateVal};
                        getBorrowBooks(true,conditionParam);
                        $("#book_content").scrollTop(0);
                    }
                   /* if($('#borrowbook_ul,#bookshow_ul').height() < ($(window).height()-44-42) && $('#borrowbook_ul,#bookshow_ul li:visible').size() != 0){
                        $('#pullUp_borrowbook').css("display","none");
                    }else{
                        $('#pullUp_borrowbook').css("display","block");
                    }*/
                },500);
            }
        });

    $('#search_content .cancel_ol').off('click').on('click',function(){
        if($('#btn_category_apply').is(":visible")){
            $('#search_area').hide();
            $('#search_hl').hide();
        }else{
            $('#search_area').show();
            $('#search_hl').show();
        }
        $('#search_content').hide();
        $('#inputval').val("");
        $('#search_area').css("margin-bottom", "0px");
        $('#search_hl').css("margin-top", "10px");
        var $filterCate = $('#category_info div.info').filter(function () {
            return $(this).find("span.icon").hasClass("sel");
        });
        if (!$("#book_available span.idd").hasClass("fel") && $filterCate.length == $('#category_info div.info').length) {
            $("#book_category span").css("color", "#808080");
        } else {
            $("#book_category span").css("color", "rgb(255,0,0)");
        }

        if(inputval_ol_focus){
            inputval_ol_focus = false;
            initPageLoading("wrapper_borrowbook");
            condationData = {};
            getBorrowBooks(true,condationData,$('#my-book-nav li.activeColor').prop('id'));
        }
        releaseElement();
    });

    $('#borrowbook_ul,#bookshow_ul').off('click', 'li').on('click', 'li', function(evt){
        window.disableTouch = true;
        var bookId = $(this).attr("id");
        $("#book_detail_listview").attr("bookid",bookId) ;
        $("#book_detail_listview").attr("cur_ot",current_ot);
        $.mobile.newChangePage("#book_detail",{ transition: "slide",reverse: false,changeHash: false});
    });

    /*$('#borrowbook_ul2,#bookshow_ul2').off('click', 'li').on('click', 'li', function(evt){
        window.disableTouch = true;
        var bookId = $(this).attr("id");
        $("#book_detail_listview").attr("bookid",bookId) ;
        $.mobile.newChangePage("#book_detail",{ transition: "slide",reverse: false,changeHash: false});
    });*/


  /*956-1068行 jqmobile的pagebeforeshow,pageshow,pagecreate等方法按照执行自上而下顺序进行了上移
  *对应上面的15-129行
  *
  *  */

    /***
     1.2. 对应956-1068行
     ***/
    $("#book").on( "pagebeforeshow", function() {

        $('#news_footer').hide();
        if(window.shouldPageRefresh.book == true) {
            getLibrarys();
            emptyDivAndLoading("bookshow_ul");
            $("#book_category span").css("color","#808080");
            $("#book_available span.idd").removeClass("fel");
            $("#book_top").hide();
            $("#borrowbook_ul").html("");
            $('#category_info .info').remove();
            $('#search_content .info').remove();
            $('#btn_category_apply').remove();
            $('#btn_category_apply_no').remove();
            $('#search_content').hide();
            $("#catlog_content").removeClass("showcatlog");
            $("#catlog_content").hide();
            $('#title_book').show();
            $("#book_btn_menu").show();
            $("#search_content").hide();
            $("#category_content").hide();
            $("#searchval_content").hide();
            $("#search_area").show();
            $("#inputval").val("");
            $("#sort_content_opacity").css("display","none");
            $("#book_sort .sort_value").html("Newest arrivals");
            $(".newest_arrivals_btn").css("display","block");
            $(".most_borrowed_btn").css("display","none");
            $(".most_commented_btn").css("display","none");
            $('#book_search').show();
            $('#book_category').show();
            $(".current_let").css("background","#f26647");
            $(".favorite_let").css("background","#f26647");
            $(".rule_let").css("background","#f26647");
            $(".check_let").css("background","#f26647");
            $('#pullUp_borrowbook').css("display","block");
            //20170929 增加
            $("#my-book-nav").removeClass('not_Visible');
            $('.content_wrapper_library1').show();
            $('.content_wrapper_library2').hide();

            var postData = {};
            postData['userName'] = q['user'].userName;
            net.post("book/searchBookcategorys", postData, function (error) {
            }, function (response) {
                if (response.code != 0) {
                    dia.alert('Confirmation', response.msg, ['OK'], function (title) {
                    });
                }
                else {
                    var bookcategorys = response.data.bookcategorys;
                    $.each(bookcategorys, function (index, category) {
                        var categoryHtml = '\<div style="padding: 8px 0;font-size:14px;color:#404040;" name="' + category.category + '" id="' + category.id + '"\ class="info"><span style="font-size: 14px; ">' + category.category + '\</span><span style="border: 1px solid #ccc; width: 20px; height: 20px;vertical-align: middle;float: right;" class="icon"><i></i></span></div>';
                        $("#category_info").append(categoryHtml);
                    });
                    $("#category_info").append('\<div id="btn_category_apply" style="height: 36px; background-color: #e6b012; font-size: 14px; color: #ffffff; margin: 8px 0; line-height: 36px; text-align: center">Apply</div>');


                    $('#category_info .info span.icon').addClass("sel");
                    $('#search_content .info span.icon').addClass("sel");
                    $('#category_content').css('height', ($(window).height() - 44));
                    $('#search_content').css('height', ($(window).height() - 44));
                    //$('#book_content').css('top',155);
                    $('#book_content').css('top',105);
                    //$('#book_content').css('height', ($(window).height() - 44 - 91));
                    $('#book_content').css('height', '100%');
                    $('#search_content_opacity').css('height','100%');
                    $('#sort_content_opacity').css('height',($(window).height()));
                    // $('#borrowbook_content').css('height', ($(window).height() -44-43));
                    //$('#borrowbook_content').css('height', ($(window).height() -44-20-35-50));
                    $('#catlog_content').css('height', ($(window).height() - 44));
                    if (q['user'].isAdmin  &&  q['user'].isAdmin == "Y") {
                        $('#catlog_opacity').css('height', ($(window).height() - 340 + 52-4));
                        $("#catlog_info .check_let").show();
                        $("#catlog_info .check_img").show();
                    }
                    else {
                        $("#catlog_info .check_let").hide();
                        $("#catlog_info .check_img").hide();
                        $('#catlog_opacity').css('height', ($(window).height() - 340 + 52 + 58-4));
                    }
                }
            }, {async: false, loading: false});
        }
    });
    $("#book").on( "pagecreate", function() {
        // $( "body > [data-role='panel']" ).panel();
        // $( "body > [data-role='panel'] [data-role='listview']" ).listview();
    });

    // 展示的时候请求新闻
    $("#book").on( "pageshow", function( event ) {
        console.error("book");

        disableClickEvent(true);
        window.setBodyOverflow($(document.body));
        $("#book_detail_listview").empty();
        if(window.shouldPageRefresh.book == true){

            // condationData = {};
            // title_html = $('#title_book').html();
            // if(title_html == "Book²"){
            //     getBorrowBooks(true,condationData);
            // }
            // if(title_html == "My favorites"){
            //     get_favor(true);
            // }
        }
        // window.historyView = [];
    });

    function stopEventPropagation(event) {
        event.stopPropagation();
    }

    function disableClickEvent(addListener) {
        var $disabledBody = $("body.disabled");
        if ($disabledBody.length > 0) {
            if (addListener) {
                $disabledBody[0].addEventListener("click", stopEventPropagation, true);
            } else {
                $disabledBody[0].removeEventListener("click", stopEventPropagation, true);
                $disabledBody.removeClass("disabled");
            }
        }
    }
    return {
        showRequestFavBook : function(dataBook){
            condationData = dataBook;
            get_favor(condationData);
        }
    }
});
