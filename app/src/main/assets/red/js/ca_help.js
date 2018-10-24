/**
 * Created by kiki on 2017/2/20.
 */
define(['jquery', 'jquerymobile', 'net', 'md5','dialogs'], function($, m, net, md5) {

    //�首页面展示
    function help_list() {
        var postData = {};
        net.post("help/types", postData,
            function (error) {
            },
            function (response) {
                if (response.code != 0) {
                }
                else {
                    var data = response.data.types;
                    var html = '';
                    if(data == undefined){
                        html = '<div style="background: #fff; min-height: 576px; font-size:14px; color:#808080; line-height: 400px; text-align: center; ">No data so far.</div>';
                    }else{
                        html = '   <div style="height:30px;line-height: 30px;font-size:14px;color:#666;background-color: #EFEFEF;padding-left:10px;">Categories</div>';
                        $.each(data, function (index, val) {
                            html +=  '<div class="help_list" id="'+  val.type +'" style="width: 100%;height:48px;line-height:48px;background-color: #fff;padding-left:10px;border-bottom: 1px solid #E4E4E4" >\
        <div style="float:left;font-size:18px;width: 88%;word-wrap: break-word;">'+  val.type +'</div>\
        <div style="float:right;margin-right: 4px;height: 29px;display:inline-block;width:10%"><i class="chevron_right"></i></div>\
    </div>'
                        });
                    }
                    $('#cahelp_list').append(html);
                }
            }
        );
    }
    //�introduction页面
    function help_introduction(type){
        var postData = {};
        postData['type'] = type;
        var url="help/getTitlesByType";
        net.post(url,postData,function(error){},function(response){
            if(response.code!=0){

            }else{
                var data=response.data.titles;
                var html='<div style="height:30px;line-height: 30px;font-size:14px;color:#666;background-color: #EFEFEF;padding-left:10px;">Detail</div>';
                $.each(data,function(index,val){
                    html +=  '<div  class="help_introduction" id="'+  val.id +'" style="width: 100%;display:table;min-height:48px;background-color: #fff;padding-left:10px;border-bottom: 1px solid #E4E4E4" >\
                            <div style="float:left;min-height:48px;padding-top:8px;vertical-align:middle;display:table-cell;width:88%;word-wrap: break-word;font-size: 17px">'+  val.title +'</div>\
                            <div style="float:right;margin-right: 4px;min-height: 29px;display:inline-block;width:8%;"><i class="chevron_right"></i></div>\
                        </div>'

                });
                $("#help_introduction_list").append(html);
            }
        })
    }

    //细节页面展示
    function help_details(listid){
        $("#help_details_list").html("");
        var id = listid;
        var url='help/getDescById';
        var postdata = {};
        postdata['id']= id;
        net.post(url,postdata,function(error){},function(response){
            if(response.code!=0){

            }else{
                var data=response.data.desc;
               var  html =  '<div   id="'+  data.id +'" style="background-color: #fff;padding-left:10px;padding-right:10px;padding-bottom:10px;" >\
                            <div style="min-height:48px;color:#333;padding-top:8px;font-weight:bold;width:100%;font-size: 18px;border-bottom: 1px solid #E4E4E4;word-wrap: break-word;">'+  data.title +'</div>\
                            <div style="margin: 10px 6px 10px 0px;width:100%">'+ data.desc+'</div>\
                        </div>'
                $("#help_details_list").html(html);
            }
        });

    }

    //模糊查询跳转
    function blur_search(id,title){
        //清空细节列表显示
        $("#help_details_list").html('');
        var url = 'help/saveOrSelect';
        var id = id;
        var userId = q['user'].userId;
        var title = title;
        var type = 'help';
        var postdata = {};
        postdata['id'] = id;
        postdata['userId'] = userId;
        postdata['title'] = title;
        postdata['type'] = type;
        net.post(url,postdata,function(error){},function(response){
            if(response.code!=0){

            }else{
                var data = response.data.desc;
                var  html =  '<div   id="'+  data.id +'" style="background-color: #fff;padding-left:10px;padding-right:10px;padding-bottom:10px;" >\
                            <div style="min-height:48px;padding-top:8px;font-weight:bold;color:#333;width:100%;font-size: 18px;border-bottom: 1px solid #E4E4E4;word-wrap: break-word;">'+  data.title +'</div>\
                            <div style="margin: 10px 4px;width:100%">'+ data.desc+'</div>\
                        </div>'
                $("#help_details_list").html(html);
            }
        });
    }


    //历史记录的方法
    function histrory_list(){
        var url = 'help/getHistory';
        var postdata = {};
        postdata['userId'] = q['user'].userId;
        postdata['type'] = 'help';
        net.post(url,postdata,function(error){},function(response){
            if(response.code!=0){

            }else{
                var data = response.data.history;
                var html='<div style="height:30px;line-height: 30px;font-size:14px;color:#666;background-color: #EFEFEF;padding-left:10px;">history rules</div>';
                $.each(data,function(index,val){
                    html +=  '<div  class="help_history" id="'+  val.id +'" style="width: 100%;display:table;min-height:48px;background-color: #fff;padding-left:10px;border-bottom: 1px solid #E4E4E4" >\
                        <div style="float:left;padding-top:8px;min-height:48px;vertical-align:middle;display:table-cell;  width:88%;word-wrap: break-word;font-size: 17px">'+  val.name +'</div>\
                        <div style="float:right;margin-right: 4px;min-height: 29px;display:inline-block;width:8%"><i class="chevron_right"></i></div>\
                        </div>';
                })
                $("#cahistory_list").html(html);
            }
        })
    }

    //历史查询搜索
    $("#cahelp-search").on("click",function(){
        //调用历史记录
        histrory_list();
        // 隐藏菜单和过滤，搜索
        $('#title_helpShow').css('display', 'none'); // block
        $('#help_btn_menu').css('display', 'none'); // inline
        $('#help-back').css('display', 'none'); //block
        $('#cahelp-search').css('display', 'none'); //block
        $('#cahistory_list').show();//历史记录显示
         //$('.loadingShow').show();//遮照层显示
        $('#cahelp_list').hide();//主页面层隐藏
        $("#cahelp_search_list").hide();

        var li = '\<div class="cahelp_search" style="width:100%;">\
                <div id="cahelp_header_searchbar_form" style="width: 75%;height:32px;margin: 5px 0 0 10px;float: left;background-color:#fff;border-radius:5px;" action="javascript:void(0);">\
                    <div style="float:left;width:8%;height:26px;"><i class="search_icon"></i></div>\
                    <div style="float:left;height: 20px;width: 70%;margin-left:5px;margin-top:5px;"><input id="cahelp_header_searchbar" type="text" placeholder="Search" autocomplete="off" autocapitalize="off" autocorrect="off" style="border:none;width:100%;outline:none;height:20px;"/></div>\
                    <div id="cahelpsearch_btn" style="float:right;width:5%;height:26px;margin-right:15px;display:none;"><i class="chren_icon"></i></div></div>\
                <div id="cahelp_cancel" style="width:24%;width: 50px;float: right;font-family: Arial;font-weight:normal;padding: 0px;margin:12px 10px 9px 10px;color: white;font-size: 14px;" >Cancel</div>\
            </div>';
        $('#cahelp_header').append(li);

        $('#cahelpsearch_btn').off('click')
            .on('click',function(){
                $('#cahelp_header_searchbar').val("");
                $('#cahelpsearch_btn').hide();
                //搜索记录清空
                $("#cahelp_search_list").html("");
                //历史记录显示
                histrory_list();
                $('#cahistory_list').show();

            });

        $('#cahelp_cancel').off('click')
            .on('click', function() {
                var value = $('#cahelp_header_searchbar').val();
                if(value == ""){
                    $('#cahelpsearch_btn').hide();

                }else{
                    $('#cahelpsearch_btn').show();

                }

                $('.cahelp_search').remove();
                $('#help_btn_menu').css('display', 'block');
                $('#title_helpShow').css('display', 'block');
                $('#help-back').css('display', 'block');
                $('#cahelp-search').css('display', 'block');
                $('#cahelp_search_list').hide();//搜索记录隐藏
                $('#cahistory_list').hide();//历史记录隐藏
                $('.loadingShow').hide();//遮照层隐藏
                $('#cahelp_list').show();//主页面层显示

            });
        function cahelpsearch_list(){
            $('#cahelp_search_list').html('');
            var url="help/search";
            var keywords = $("#cahelp_header_searchbar").val();
            var postdata = {};
            postdata["keywords"] = keywords;
            net.post(url,postdata,function(error){},function(response){
                if(response.code!=0){

                }else{
                    var data=response.data.titles;
                    var html='<div style="height:30px;line-height: 30px;font-size:14px;color:#666;background-color: #EFEFEF;padding-left:10px;">search results</div>';
                    $.each(data,function(index,val){
                        html +=  '<div value="'+ val.title + '" class="blur_introduction" id="'+  val.id +'"  style="width: 100%;display:table;background-color: #fff;padding-left:10px;border-bottom: 1px solid #E4E4E4" >\
                            <div style="float:left;padding-top:8px;vertical-align:middle;display:table-cell;  width:88%;word-wrap: break-word;font-size: 17px">'+  val.title +'</div>\
                            <div style="float:right;margin-right: 4px;vertical-align:middle;display:table-cell;width:8%"><i class="chevron_right"></i></div>\
                        </div>'

                    });
                    $('#cahelp_search_list').append(html);
                }
            })
        }
        //        模糊查询
        $('#cahelp_header_searchbar').bind('input propertychange',function () {

            var keyWords = $(this).val();

            if(keyWords == ""){
                //清空模糊搜索的值
                histrory_list();
                //$('#cahelp_search_list').html("");
                $('#cahelp_search_list').hide();

                $('#cahistory_list').show();
                $('#cahelpsearch_btn').hide();

                // $(".chren_icon").hide();
            }else{
                $('.loadingShow').hide();

                $('#cahelpsearch_btn').show();
                $('#cahistory_list').hide();
                cahelpsearch_list();
                $('#cahelp_search_list').show();
            }
        });

        $('#cahelp_header_searchbar').focus();
        });


    $("#ca_helpShow").on("pagebeforeshow", function (event) {
        if($(this).find("#cahelp_cancel")){
            $("#cahelp_cancel").click();
        }
        $('#cahelp_list').empty();
        //��������б�
        help_list();
    });

    //历史记录跳转
    $("#cahistory_list").on("click","div[class='help_history']",function(){
        var id = $(this).attr("id");
        help_details(id);
        $.mobile.newChangePage("#ca_help_details", {transition: "slide", reverse: false, changeHash: false});
        $('#details_btn_menu,#details-back').off('click').on('click', function (evt) {
            $.mobile.newChangePage("#ca_helpShow", {transition: "slide", reverse: true, changeHash: false});
        });
    })
    //�模糊查询列表跳转详情
    $("#cahelp_search_list").on('click','div[class="blur_introduction"]',function(){
        var id=$(this).attr("id");
        var titie = $(this).find("div:first").text();
        blur_search(id,titie);
        $.mobile.newChangePage("#ca_help_details", {transition: "slide", reverse: false, changeHash: false});
        $('#details_btn_menu,#details-back').off('click').on('click', function (evt) {

            $.mobile.newChangePage("#ca_helpShow", {transition: "slide", reverse: true, changeHash: false});
        });
    })
    //�������list��ת
    $("#cahelp_list").on('click','div[class="help_list"]',function(){
        var type=$(this).attr("id");
        $("#help_introduction_list").empty();
        help_introduction(type);
        $.mobile.newChangePage("#ca_help_introduction", {transition: "slide", reverse: false, changeHash: false});
        $('#introduction_btn_menu,#introduction-back').off('click').on('click', function (evt) {
            $.mobile.newChangePage("#ca_helpShow", {transition: "slide", reverse: true, changeHash: false});
        });
    })
    //introduction 跳转 details
    $("#help_introduction_list").on("click",'div[class="help_introduction"]',function(){
        var id = $(this).attr("id");
        $("#help_details_list").empty();
        help_details(id);
        $.mobile.newChangePage("#ca_help_details", {transition: "slide", reverse: false, changeHash: false});
        $('#details_btn_menu,#details-back').off('click').on('click', function (evt) {
            $.mobile.newChangePage("#ca_help_introduction", {transition: "slide", reverse: true, changeHash: false});
        });
    })

    $("#ca_helpShow,#ca_help_introduction,#ca_help_details").on("pageshow", function (event) {
        $('#cahelp_content,#introduction_content,#details_content').css('height', ($(window).height() - 44 - 20));
        $('#cahelp_content_info,#introduction_content_info,#details_content_info').css('min-height', ($(window).height() - 44 - 20));
        // window.historyView = [];
    });

    //�������CAҳ��
    $('#help_btn_menu,#help-back').off('click').on('click', function (evt) {
        $.mobile.newChangePage("#ca", {transition: "slide", reverse: true, changeHash: false});
    });


    function compatibility() {
        /* Logon */
        $('#title_helpShow').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_helpShow').css('postion', 'absulute')
            .css('height', '20px')
            .css('margin', '8px 0 8px 77px');
    }

    $(document).ready(function () {
        setTimeout(function () {
            // �������������
            compatibility();
        }, 1000);
    });
});