/**
 * Created by testbetta1 on 15/9/9.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs','book_check','panle'], function($, m, net, dia,bookcheck,panle) {

    $('#book_rule_content').on('swiperight',function() {
            $("#borrowbook_ul").hide(600);
            $("#bookshow_ul,#book_search,#book_category,#search_area").show(600);
            $('#title_book').html("Book²");
            $.mobile.backChangePage("#book",{ transition: "slide",reverse: true,changeHash: false});
    });
    $('#book_rule_catalog').off('click').on('click',function(evt){
        if($("#book_rule_catlog_content").hasClass("showcatlog")){
            $("#book_rule_catlog_content").removeClass("showcatlog") ;
            $("#book_rule_catlog_content").slideUp(500);
            $('#book_rule_btn_menu').fadeIn(400);
            $("#title_book_rule").fadeIn(400);
        }
        else{
            $("#book_rule_catlog_content").addClass("showcatlog") ;
            $("#book_rule_catlog_content").slideDown(500);
            $('#book_rule_btn_menu').fadeOut(400);
            $("#title_book_rule").fadeOut(400);
        }
    });

    $('#book_rule_catlog_opacity').off('click').on('click',function(evt){
        $("#book_rule_catlog_content").removeClass("showcatlog") ;
        $("#book_rule_catlog_content").slideUp(500);
        $('#book_rule_btn_menu').fadeIn(400);
        $("#title_book_rule").fadeIn(400);
    });

    $('#book_rule_btn_menu').off('click').on('click',function() {
        $("#borrowbook_ul").show();
        $("#bookshow_ul,#book_search,#book_category,#search_area").show();
        $('#title_book').html("Book²");
        window.shouldPageRefresh.book = false;
        $.mobile.newChangePage("#book",{ transition: "slide",reverse:true,changeHash: false});
    });

    $('#book_rule_catlog_info div').off('click').on('click',function(evt){
        if($(this).hasClass("current")){
            if($("#book_rule_catlog_content").hasClass("showcatlog")){
                $("#book_rule_catlog_content").removeClass("showcatlog") ;
                $("#book_rule_catlog_content").slideUp(500);
                $('#book_rule_btn_menu').fadeIn(400);
                $("#title_book_rule").fadeIn(400);
            }
            else{
                $("#book_rule_catlog_content").addClass("showcatlog") ;
                $("#book_rule_catlog_content").slideDown(500);
                $('#book_rule_btn_menu').fadeOut(400);
                $("#title_book_rule").fadeOut(400);
            }
        }
        else{
            var url = $(this).attr("url");
            if(url == "#book_check"){
                $("#book_rule_catlog_content").removeClass("showcatlog") ;
                $("#book_rule_catlog_content").slideUp(500);
                $('#book_rule_btn_menu').fadeIn(400);
                $("#title_book_rule").fadeIn(400);
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
                            dataInfo.fromUrl = "book_rule";
                            bookcheck.showDetailWithCheckBook(dataInfo);
                            $.mobile.newChangePage(url,{ transition: "slide",reverse: false,changeHash: false});
                        }
                    },{async:false});
                }, function(error) {
                    console.error('扫描错误结果:%o', error);
                });
            }
            else{
                if(url == "#book"){
                    window.shouldPageRefresh.book =  true;
                }
                $.mobile.newChangePage(url,{ transition: "slide",reverse: false,changeHash: false});
            }
        }
    });

    $("#book_rule").on( "pagecreate", function() {
        $( "body > [data-role='panel']" ).panel();
        $( "body > [data-role='panel'] [data-role='listview']" ).listview();
    });

    // 展示的时候请求新闻
    $("#book_rule").on( "pageshow", function( event ) {
        console.error("book_rule");
        disableClickEvent(true);
        window.setBodyOverflow($(document.body));
        $('#book_rule_content').css('height',($(window).height()-44-20));
        $('#book_rule_content_info').css('height',($(window).height()-44));
        $('#book_rule_catlog_content').css('height',($(window).height()-44));
        if (q['user'].isAdmin  &&  q['user'].isAdmin == "Y") {
            $('#book_rule_catlog_opacity').css('height',($(window).height()-340+52-4));
        }
        else{
            $('#book_rule_catlog_opacity').css('height',($(window).height()-340+52+58-4));

        }
        // window.historyView = [];
    });

    $("#book_rule").on( "pagehide", function( event ) {
        $("#book_rule_catlog_content").removeClass("showcatlog") ;
        $('#title_book_rule').show();
        $("#book_rule_btn_menu").show();
        $("#book_rule_catlog_content").hide();
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
});
