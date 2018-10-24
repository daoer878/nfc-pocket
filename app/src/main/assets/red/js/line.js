/**
 * Created by kiki on 2016/12/15.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs','logon','panle','echarts','world','swiper'], function($, m, net, dia,logon,panle,echarts,world,Swiper) {

    var mySwiper = new Swiper('.lines-swiper-main',{
        initialSlide:0,
        speed: 200,
        direction: 'horizontal',
        autoHeight: true,
        observer:true,
        observeParents:true,
        followFinger: false,
        resistanceRatio: 0,
        noSwiping : true
    });

    var myChart = echarts.init(document.getElementById('main'));
    myChart.height=$(window).height();

    option = {
        backgroundColor: '#253038',
        // backgroundColor: 'rgba(37,48,56,1)',
        series: [
            {
                name: 'world',
                type: 'map',
                mapType: 'world',
                selectedMode : 'single',
                roam: false,
                label: {
//                    normal: {
//                        show: false
//                    },
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: '#323c48',
                        borderColor: '#181f25',
                        color: '#161c2'
                    },
                    emphasis: {
                        areaColor: '#2a333d',
                        borderColor:'#41b5d7',
                        color: '#161c2'
                    }
                },
                data:[

                ]
            }
        ]

    };


    var office_name,//初次countryName
        office_hnme;//获取到的countryName
    var office_flag = false;
    var flag;
    var rem;
    function office_list(officeName){
        var postData = {};
        postData['userId'] = q['user'].userId;
        postData['countryname'] = officeName;
        net.post('hotline/getCitiesByMap',postData,function(error){

        },function (response) {
            if(response.code != 0){

            }else{
                var officeHtml = [];
                var office_detail = response.data.cities;
                var office_countyName = response.data.countryName;
                    office_name = response.data.countryName;
                    officeHtml.push('<div style="height:44px;line-height: 44px;font-size:18px;color:#FFF;background-color: #161c21;">\
                                        <div style="float:left;width:90%;padding-left: 10px;">'+office_countyName+'</div>\
                                        <div class="office_delete" style="float:right;width:4%;color:#FFF;margin:0 10px;height:44px;"><i class="office_close"></i></div>\
                                        </div><div class="liner" style="width: 100%;height:2px;"></div><div style="overflow-y: scroll;height:218px;overflow-x: hidden;background-color: black;">');
                    $.each(office_detail,function (index, val) {
                        var cityName = val.name;
                        var cityId = "city"+val.cityId;
                        var infoId = "info"+val.infoId;
                        var area = val.areaCode;
                        var opt = val.optNo;
                        var tel = val.telNo;
                        var zon = val.timezone;
                        officeHtml.push('<div id="'+cityId+'" class="cityId" style="width: 100%;min-height:44px;line-height:44px;background-color: black;padding-left:10px;border-bottom: 1px solid #0c1113;">\
                                        <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;float:left;width:65%;font-size: 16px;color:#FFF;">'+cityName+'</div>\
                                        <div style="float:left;height: 44px;display:inline-block;width:25%;color:#999999;font-size: 12px;">'+zon+'</div>\
                                        <div style="float:right;height: 44px;display:inline-block;width:4%;margin:0 10px;"><i class="office_icon"></i></div>\
                                    </div>\
                                    <div id="'+infoId+'" class="info_list" style="display:none;width:100%;background-color:black;color:#FFF;border-bottom: 1px solid #0c1113;">\
                                        <div style="height:60px;line-height:40px;width:100%;padding:10px;">\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:14px;">Tel No.</div>\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:16px;">'+tel+'</div>\
                                        </div>\
                                        <div style="height:60px;line-height:40px;width:100%;padding:10px;">\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:14px;">Local Area Code</div>\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:16px;">'+area+'</div>\
                                        </div>\
                                        <div style="height:60px;line-height:40px;width:100%;padding:10px;">\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:14px;">Operator Number</div>\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:16px;">'+opt+'</div>\
                                        </div></div>');
                    });
                        officeHtml.push('</div>');
                        $('#detail_id').html(officeHtml.join(""));

                        //点击关闭获取到的国家详情
                        $('.office_delete').off('click').on('click',function(){
                            myChart.setOption({
                                series:[{
                                    data:[{
                                        name:office_hnme,
                                        selected:false
                                    }]
                                }]
                            });
                            mySwiper.slideTo(0,200,true);
                            office_flag = false;
                        });

                        $('#detail_id .cityId').off('click')
                            .on('click',function(){
                                var city_id = $(this).attr("id");
                                var info_id = $(this).next().attr("id");
                                if($('#'+city_id).hasClass("dell")){
                                    $('#'+city_id).removeClass("dell");
                                    $("#" + info_id).hide();
                                    $('#'+city_id).css('border-bottom','1px solid #0c1113');
                                    $('#'+city_id).find("i").removeClass("office_up").addClass("office_icon");

                                }else{
                                    $('#'+city_id).addClass("dell");
                                    $("#" + info_id).show();
                                    $('#'+city_id).css('border-bottom','none');
                                    $('#'+city_id).find("i").removeClass("office_icon").addClass("office_up");
                                }
                            });
            }
        });
    }

    myChart.on('click', function (params) {
        console.log(params.name);
        office_hnme = params.name;
        if(office_name == office_hnme){
            if(office_flag == true){
                mySwiper.slideTo(0,200,true);
                office_flag = false;
            }else{
                mySwiper.slideTo(1,200,true);
                office_flag = true;
            }
        }else{
            office_list(office_hnme);
            mySwiper.slideTo(1,200,true);
            office_flag = true;
        }
    });

    $('#lines-moom').off('click').on('click',function(){
        if($('#lines-moom').hasClass('list_view')){
            $('#lines-moom').removeClass('list_view').addClass('global_ol');
            $('#search_lineList, #main').hide();
            $('#global_lines').show();
        }else{
            $('#lines-moom').removeClass('global_ol').addClass('list_view');
            $('#global_lines').hide();
            $('#main').show();
        }
    });


    $('.loadingGot').off('click').on('click',function(){
       localStorage.setItem('rem', '1');
       $('.loadingShow').hide();
       $('.loadingGot').hide();
       flag = 0;
    });

    $("#foshan_name").off('click')
        .on('click',function(){
            if($("#foshan_name").hasClass("dell")){
                $("#foshan_name").removeClass("dell");
                $('#foshan_del').hide();
                $('#foshan_name').css('border-bottom',"1px solid #0c1113");
                $('#foshan_name i').removeClass('office_up').addClass('office_icon');
            }else{
                $("#foshan_name").addClass("dell");
                $('#foshan_del').show();
                $('#foshan_name').css('border-bottom',"none");
                $('#foshan_name i').removeClass('office_icon').addClass('office_up');
            }
        });
    $("#gzc_name").off('click')
        .on('click',function(){
            if($("#gzc_name").hasClass("dell")){
                $("#gzc_name").removeClass("dell");
                $('#gzc_del').hide();
                $('#gzc_name').css('border-bottom',"1px solid #0c1113");
                $('#gzc_name i').removeClass('office_up').addClass('office_icon');
            }else{
                $("#gzc_name").addClass("dell");
                $('#gzc_del').show();
                $('#gzc_name').css('border-bottom',"none");
                $('#gzc_name i').removeClass('office_icon').addClass('office_up');
            }
        });
    $("#gzt_name").off('click')
        .on('click',function(){
            if($("#gzt_name").hasClass("dell")){
                $("#gzt_name").removeClass("dell");
                $('#gzt_del').hide();
                $('#gzt_name').css('border-bottom',"1px solid #0c1113");
                $('#gzt_name i').removeClass('office_up').addClass('office_icon');
            }else{
                $("#gzt_name").addClass("dell");
                $('#gzt_del').show();
                $('#gzt_name').css('border-bottom',"none");
                $('#gzt_name i').removeClass('office_icon').addClass('office_up');
            }
        });
    $("#hdpg_name").off('click')
        .on('click',function(){
            if($("#hdpg_name").hasClass("dell")){
                $("#hdpg_name").removeClass("dell");
                $('#hdgp_del').hide();
                $('#hdpg_name').css('border-bottom',"1px solid #0c1113");
                $('#hdpg_name i').removeClass('office_up').addClass('office_icon');
            }else{
                $("#hdpg_name").addClass("dell");
                $('#hdgp_del').show();
                $('#hdpg_name').css('border-bottom',"none");
                $('#hdpg_name i').removeClass('office_icon').addClass('office_up');
            }
        });
    $("#gltc_name").off('click')
        .on('click',function(){
            if($("#gltc_name").hasClass("dell")){
                $("#gltc_name").removeClass("dell");
                $('#gltc_del').hide();
                $('#gltc_name').css('border-bottom',"1px solid #0c1113");
                $('#gltc_name i').removeClass('office_up').addClass('office_icon');
            }else{
                $("#gltc_name").addClass("dell");
                $('#gltc_del').show();
                $('#gltc_name').css('border-bottom',"none");
                $('#gltc_name i').removeClass('office_icon').addClass('office_up');
            }
        });
    $("#tc_name").off('click')
        .on('click',function(){
            if($("#tc_name").hasClass("dell")){
                $("#tc_name").removeClass("dell");
                $('#tc_del').hide();
                $('#tc_name').css('border-bottom',"1px solid #0c1113");
                $('#tc_name i').removeClass('office_up').addClass('office_icon');
            }else{
                $("#tc_name").addClass("dell");
                $('#tc_del').show();
                $('#tc_name').css('border-bottom',"none");
                $('#tc_name i').removeClass('office_icon').addClass('office_up');
            }
        });


    //city详情展示
    function city_show(countryId,countryName){

        //清空模糊搜索的值
        $('#country_rul_show').html("");
        $('#city_rul_show').html("");

        var postData = {};
        postData["countryId"] = countryId;
        postData['countryname'] = countryName;
        // postData["cityId"] = cityId;
        postData['userId'] = q['user'].userId;
        net.post('hotline/getCities',postData,function(error){

        },function (response) {
           if(response.code != 0){

           }else{
               var cityHtml = [];
               var citylist = response.data.cities;
                    cityHtml.push('<div style="width:100%;height:30px;line-height:30px;padding-left:10px;font-size: 14px;color:#FFF;background-color: #000;opacity: 0.5;">City/Office Location</div>');
               $.each(citylist,function(index,val){
                   var cityName = val.name;
                   var cityId = "city"+val.cityId;
                   var infoId = "info"+val.infoId;
                   var area = val.areaCode;
                   var opt = val.optNo;
                   var tel = val.telNo;
                   var zon = val.timezone;
                   cityHtml.push('<div id="'+cityId+'" class="cityId" style="width: 100%;min-height:44px;line-height:44px;color: #fff;padding-left:10px;border-bottom: 1px solid #0c1113;">\
                                        <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;float:left;width:80%;font-size: 18px;">'+cityName+'</div>\
                                        <div style="float:right;margin: 0px 10px;height: 44px;display:inline-block;width:10%"><i class="office_icon"></i></div>\
                                    </div>\
                                    <div id="'+infoId+'" class="info_list" style="width:100%;display:none;color:#fff;border-bottom: 1px solid #0c1113;">\
                                        <div style="height:60px;line-height:40px;width:100%;padding:10px;">\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:14px;color:#fff;">HSBC Office Short Code</div>\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:16px;">'+tel+'</div>\
                                        </div>\
                                        <div style="height:60px;line-height:40px;width:100%;padding:10px;">\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:14px;color:#fff;">Local Area Code</div>\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:16px;">'+area+'</div>\
                                        </div>\
                                        <div style="height:60px;line-height:40px;width:100%;padding:10px;">\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:14px;color:#fff;">Operator Number</div>\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:16px;">'+opt+'</div>\
                                        </div>\
                                        <div style="height:60px;line-height:40px;width:100%;padding:10px;">\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:14px;color:#fff;">Time offset</div>\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:16px;">'+zon+'</div>\
                                        </div></div>');

               });
               $('#city_show').html(cityHtml.join(""));


               $('#city_show .cityId').off('click')
                   .on('click',function(){
                       var city_id = $(this).attr("id");
                       var info_id = $(this).next().attr("id");
                       if($('#'+city_id).find("i").hasClass("exo")){
                           $('#'+city_id).find("i").removeClass("exo");
                           $("#" + info_id).hide();
                           $('#'+city_id).css('border-bottom','1px solid #0c1113');
                           $('#'+city_id).find("i").removeClass('office_up').addClass('office_icon');
                       }else{
                           $('#'+city_id).find("i").addClass("exo");
                           $("#" + info_id).show();
                           $('#'+city_id).css('border-bottom','none');
                           $('#'+city_id).find("i").removeClass('office_icon').addClass('office_up');
                       }
                   });

           }
        });
    }

    //跳转子页面
    // $("#china,#hongkang,#gltc,#argen,#austr,#anent").off('click')
    //     .on('click',function(){
    //         $('.loadingShow').hide();//遮照层隐藏
    //         $.mobile.changePage('#lineShow',{ transition: "slide",reverse: true,changeHash: false});
    //     });

    // search
    $('#lines-search').off('click');
    $('#lines-search').on('click', function() {
        var postData = {};
        postData['userId'] = q['user'].userId;
        net.post('hotline/gethistories',postData,function (error) {

        },function (response) {
            if(response.code != 0){

            }else{
                var history_html = [];
                var history_cont = response.data.gethistories;
                    history_html.push('<div style="width:100%;height:30px;line-height:30px;color:#FFF;padding-left:10px;font-size: 13px;background-color: #000;opacity: 0.5;margin:44px 0 0 0;">Recent searches</div>');
                $.each(history_cont,function (index, val) {
                    var history_name = val.name;
                    var history_id = val.id;
                    history_html.push('<div class="history_search" id="'+history_id+'" style="width: 100%;min-height:44px;line-height:44px;color:#FFF;border-bottom: 1px solid #0c1113;padding-left:10px;" name="'+history_name+'">\
                                                <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;float:left;width:80%;font-size: 16px;">'+history_name+'</div>\
                                                <div style="float:right;margin:0px 10px;height: 29px;display:inline-block;width:10%"><i class="country_icon"></i></div></div>');
                });

                $('#history_rul_show').html(history_html.join(""));

                //点击countrylist跳转详情
                $('#history_rul_show .history_search').off('click')
                    .on('click',function () {
                        var history_Id = $(this).attr("id");
                        var history_name = $(this).attr("name");
                        if($('#lines-moom').hasClass('global_ol')){
                            $('#lines').addClass('lines_list');
                        }
                        city_show(history_Id,history_name);
                        setTimeout(function(){
                            $.mobile.changePage('#lineShow',{ transition: "slide",reverse: false,changeHash: false});
                        },500);
                    });
            }
        });


        // $('.loadingShow').css('height', ($(window).height()-44-$("#history_rul_show").height()));
        // $('.loadingShow').css('top', ($("#history_rul_show").height()+"44px"));

        // 展示搜索
        var li = '\<div class="lines_search" style="width:100%;">\
                <div id="lines_header_searchbar_form" style="width: 78%;height:30px;margin: 7px 0 0 10px;float: left;background-color:#fff;border-radius:5px;overflow:hidden;z-index:999;" action="javascript:void(0);">\
                    <div style="float:left;width:8%;height:30px;"><i class="search_icon"></i></div>\
                    <div style="float:left;height: 30px;width: 70%;margin-left:5px;margin-top:-7px;"><input id="lines_header_searchbar" type="text" placeholder="search" autocomplete="off" autocapitalize="off" autocorrect="off" style="border:none;width:100%;outline:none;height:30px;"/></div>\
                    <div id="search_btn" style="float:right;width:5%;height:30px;margin-right:15px;display:none;"><i class="chren_icon"></i></div></div>\
                <div id="lines_cancel" style="float: right;font-family: Arial;font-weight:normal;padding: 0px;margin:0 10px;color: white;font-size: 14px;" >Cancel</div>\
            </div>';
        $('#lines_header').append(li);

        // 隐藏菜单和过滤，搜索
        $('#lines-title').css('display', 'none'); // block
        $('#lines-moom').css('display', 'none'); // inline
        $('#lines_btn_menu').css('display', 'none');
        $('#lines-back').css('display', 'none');
        $('#lines-search').css('display', 'none'); //block
        $('#history_rul_show').show();//搜索记录显示
        $('#lines_info').hide();//主页面隐藏
        $('.loadingKel').show();//遮照层显示
        $('.loadingKel').addClass('global');
        flag = 1;
        //返回搜索历史
        $('#lines_cancel').off('click')
            .on('click', function() {
                var value = $('#lines_header_searchbar').val();
                if(value == ""){
                    $('#search_btn').hide();
                }else{
                    $('#search_btn').show();
                }
                // $('#lines_header_searchbar').remove();
                // $('#lines_cancel').remove();
                // $('#lines_header_searchbar_form').remove();
                $('.lines_search').remove();
                $('#lines-moom').css('display', 'block');
                $('#lines_btn_menu').css('display', 'block');
                $('#lines-back').css('display', 'block');
                $('#lines-title').css('display', 'block');
                $('#lines-search').css('display', 'block');
                $('#history_rul_show').hide();//搜索记录隐藏
                $('#content_result_show').hide();
                $('#lines_info').show();//主页面层显示
                $('#country_rul_show').hide();//国家隐藏
                $('#city_rul_show').hide();//城市隐藏
                $('#search_lineList').hide();//隐藏
                $('.loadingKel').hide();//遮照层隐藏
                $('.loadingKel').removeClass('global');
                flag = 0;
                //弹出层显示

            });

            $('#search_btn').off('click')
            .on('click',function(){
                $('#lines_header_searchbar').val("");
                $('#search_btn').hide();
                $('#history_rul_show').show();
                $('#country_rul_show').hide();
                $('#city_rul_show').hide();
                $('#search_lineList').hide();//隐藏
                $('#content_result_show').hide();

            });

        function getCity_show(cityId,cityName){
            var postData = {};
            postData['userId'] = q['user'].userId;
            postData['cityId'] = cityId;
            postData['cityname'] = cityName;
            net.post('hotline/getCitiesinfo',postData,function (error) {

            },function (response) {
                if(response.code != 0){

                }else{
                    var cityHtml = [];
                    var citylist = response.data.citiesinfo;
                    cityHtml.push('<div style="width:100%;height:30px;line-height:30px;padding-left:10px;font-size: 14px;background-color: #000;color:#fff;opacity: 0.5;">City/Office Location</div>');
                    $.each(citylist,function(index,val){
                        var cityName = val.name;
                        var cityId = "city"+val.countrycityId;
                        var infoId = "info"+val.id;
                        var area = val.areaCode;
                        var opt = val.optNo;
                        var tel = val.telNo;
                        var zon = val.timezone;
                        cityHtml.push('<div id="'+cityId+'" class="cityId" style="width: 100%;color: #fff;min-height:44px;line-height:44px;padding-left:10px;border-bottom: 1px solid #0c1113;">\
                                        <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;float:left;width:80%;font-size: 18px;">'+cityName+'</div>\
                                        <div style="float:right;margin: 0px 10px;height: 44px;display:inline-block;width:10%"><i class="office_icon"></i></div>\
                                    </div>\
                                    <div id="'+infoId+'" class="info_list" style="width:100%;display:none;color:#fff;border-bottom: 1px solid #0c1113;">\
                                        <div style="height:auto;width:100%;word-wrap:break-word;line-height:1.5;padding:10px 10px 0 10px;">'+cityName+'</div>\
                                        <div style="height:60px;line-height:40px;width:100%;padding:10px;">\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:14px;color:#fff;">HSBC Office Short Code</div>\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:16px;">'+tel+'</div>\
                                        </div>\
                                        <div style="height:60px;line-height:40px;width:100%;padding:10px;">\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:14px;color:#fff;">Local Area Code</div>\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:16px;">'+area+'</div>\
                                        </div>\
                                        <div style="height:60px;line-height:40px;width:100%;padding:10px;">\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:14px;color:#fff;">Operator Number</div>\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:16px;">'+opt+'</div>\
                                        </div>\
                                        <div style="height:60px;line-height:40px;width:100%;padding:10px;">\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:14px;color:#fff;">Time offset</div>\
                                            <div style="height:20px;line-height:20px;width:100%;font-size:16px;">'+zon+'</div>\
                                        </div></div>');

                    });
                    $('#city_show').html(cityHtml.join(""));


                    $('#city_show .cityId').off('click')
                        .on('click',function(){
                            var city_id = $(this).attr("id");
                            var info_id = $(this).next().attr("id");
                            if($('#'+city_id).find("i").hasClass("exo")){
                                $('#'+city_id).find("i").removeClass("exo");
                                $("#" + info_id).hide();
                                $('#'+city_id).css('border-bottom','1px solid #0c1113');
                                $('#'+city_id).find("i").removeClass('office_up').addClass('office_icon');
                            }else{
                                $('#'+city_id).find("i").addClass("exo");
                                $("#" + info_id).show();
                                $('#'+city_id).css('border-bottom','none');
                                $('#'+city_id).find("i").removeClass('office_icon').addClass('office_up');
                            }
                        });
                }
            })
        }

        function searchList(){
            var keyWords = $('#lines_header_searchbar').val();
            var postData = {};
            postData['userId'] = q['user'].userId;
            postData['keywords'] = keyWords;
            net.post('hotline/search',postData,function (error) {

            },function (response) {
                if(response.code != 0){

                }else{
                    var rul_show = response.data.DataMap;
                    var country_cont = rul_show.countries;
                    var city_cont = rul_show.cities;
                    var country_menu = country_cont.length;
                    var city_menu = city_cont.length;

                    if(country_cont.length == 0 && city_cont.length == 0){
                        $('#country_rul_show').hide();
                        $('#city_rul_show').hide();
                        $('#search_lineList').hide();//隐藏
                        $('#content_result_show').show();
                    }else{
                        $('#content_result_show').hide();
                    }
                    var country_html = [];
                    var city_html = [];
                    country_html.push('<div style="width:100%;height:30px;line-height:30px;color:#FFF;padding-left:10px;font-size: 13px;"><div style="float:left;display:inline-block;line-height:30px;">Country</div><div class="country_menu"><div style="margin-top:-6px;color:#999;">'+country_menu+'</div></div></div>');
                    city_html.push('<div style="width:100%;height:30px;line-height:30px;color:#FFF;padding-left:10px;font-size: 13px;"><div style="float:left;display:inline-block;line-height:30px;">City/Office Location</div><div class="city_menu"><div style="margin-top:-6px;color:#999;">'+city_menu+'</div></div></div>');

                    $.each(country_cont,function (index, val) {
                        var country_name = val.name;
                        var country_id= val.id;

                        country_html.push('<div class="country_search" id="'+country_id+'" style="width: 100%;color:#FFF;height:44px;line-height:44px;padding-left:10px;border-bottom:1px solid #0c1113;" name="'+country_name+'">\
                                                    <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;float:left;width:80%;font-size: 16px;color:#FFF;">'+country_name+'</div>\
                                                    <div style="float:right;margin:0px 10px;height: 29px;display:inline-block;width:10%"><i class="country_icon"></i></div></div>');

                    });

                    $.each(city_cont,function (index, val) {
                        var city_name = val.name;
                        var city_id = val.id;

                        city_html.push('<div class="city_search"  id="'+city_id+'" style="width: 100%;height:44px;line-height:44px;color:#FFF;padding-left:10px;border-bottom:1px solid #0c1113;" name="'+city_name+'">\
                                                    <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;float:left;width:80%;font-size: 16px;color:#FFF;">'+city_name+'</div>\
                                                    <div style="float:right;margin:0px 10px;height: 29px;display:inline-block;width:10%"><i class="country_icon"></i></div></div>');
                    });

                    $('#country_rul_show').html(country_html.join(""));
                    $('#city_rul_show').html(city_html.join(""));
                    //展示country—list样式调整
                    if(country_cont.length >= 3){
                        $('#country_rul_show').css('height',"162px");
                        $('#country_rul_show').css('overflow',"hidden");
                    }else{
                        $('#country_rul_show').css('height',"auto");
                    }
                    //展示city—list样式调整
                    if(city_cont.length >= 3){
                        $('#city_rul_show').css('height',"162px");
                        $('#city_rul_show').css('overflow',"hidden");
                    }
                    else{
                        $('#city_rul_show').css('height',"auto");
                    }

                    $('.country_menu').off('click')
                        .on('click',function(){
                            $('#country_rul_show').css('height',"auto");
                            $('#country_rul_show').css('overflow',"auto");
                            flag = 0;
                        });
                    $('.city_menu').off('click')
                        .on('click',function(){
                            $('#city_rul_show').css('height',"auto");
                            $('#city_rul_show').css('overflow',"auto");
                            flag = 0;
                        });

                    //点击countrylist跳转详情
                    $('#country_rul_show .country_search').off('click')
                        .on('click',function () {
                            var country_id = $(this).attr("id");
                            var country_name = $(this).attr("name");
                            if($('#lines-moom').hasClass('global_ol')){
                                $('#lines').addClass('lines_list');
                            }
                            city_show(country_id,country_name);
                            setTimeout(function(){
                            $.mobile.changePage('#lineShow',{ transition: "slide",reverse: false,changeHash: false});
                        },500);
                        });

                    //点击citylist跳转详情
                    $('#city_rul_show .city_search').off('click')
                        .on('click',function () {
                            var city_id = $(this).attr("id");
                            var city_name = $(this).attr("name");
                            if($('#lines-moom').hasClass('global_ol')){
                                $('#lines').addClass('lines_list');
                            }
                            getCity_show(city_id,city_name);
                            setTimeout(function(){
                            $.mobile.changePage('#lineShow',{ transition: "slide",reverse: false,changeHash: false});
                        },500);
                        });
                }
            })
        }

        $('#lines_header_searchbar').bind('input propertychange',function () {

            var keyWords = $(this).val();

            if(keyWords == ""){
                //清空模糊搜索的值
                $('#country_rul_show').html("");
                $('#city_rul_show').html("");

                $('#history_rul_show').show();
                $('#country_rul_show').hide();
                $('#city_rul_show').hide();
                $('#search_lineList').hide();

                $('#search_btn').hide();

                // $(".chren_icon").hide();
            }else{
                $('.loadingShow').hide();
                $('#history_rul_show').hide();
                $('#content_result_show').hide();
                $('#country_rul_show').show();
                $('#city_rul_show').show();
                $('#search_lineList').show();

                $('#search_btn').show();

                // $(".chren_icon").show();
                searchList();

            }

        });


        // $('#lines_header_searchbar').off('keyup')
        //     .on('keyup', function(evt) {
        //         if (evt.keyCode == 13) {
        //             //结果页面显示
        //
        //
        //         }
        //     });
        $('#lines_header_searchbar').focus();
    });


    function line_show(){
        var postdata = {};
        postdata['userId'] = q['user'].userId;
        net.post('hotline/getCountries',postdata,function(error){

        },function(response){
            if(response.code != 0){

            }else{
                var country_list = response.data.countries;
                var pop_list = response.data.POPcountries;
                var pop_html = [];
                var country_html = [];
                    country_html.push('<div class="country_show" style="width:100%;"><div style="width:100%;height:30px;line-height:30px;color:#FFF;padding-left:10px;font-size: 13px;background-color: #000;opacity:0.5;">Country List</div>');
                    pop_html.push('<div class="pop_show" style="width:100%;"><div style="width:100%;height:30px;line-height:30px;color:#FFF;padding-left:10px;font-size: 13px;background-color: #000;opacity:0.5;">Popular Tie Lines</div>');

                $.each(country_list,function(index,val){
                    var countryName = val.name;
                    var countryId = val.id;
                    country_html.push('\<div class="countryId" style="width: 100%;min-height:44px;line-height:44px;border-bottom: 1px solid #0c1113;padding-left:10px;" id="'+countryId+'">\
                                        \<div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;float:left;width:80%;font-size:16px;color:#FFF;">'+countryName+'</div>\
                                        \<div style="float:right;height:44px;display:inline-block;width:10%;margin:0 10px;"><i class="country_icon"></i></div>\
                                        </div>');

                });
                country_html.push('</div>');

                $.each(pop_list,function(index,val){
                    var popName = val.name;
                    var popId = val.id;
                    pop_html.push('\<div class="popId" style="width: 100%;min-height:44px;line-height:44px;border-bottom: 1px solid #0c1113;padding-left:10px;" id="'+popId+'">\
                                            \<div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;float:left;width:80%;font-size:16px;color:#FFF;">'+popName+'</div>\
                                            \<div style="float:right;height:44px;display:inline-block;width:10%;margin:0 10px;"><i class="country_icon"></i></div>\
                                            </div>');

                });
                    pop_html.push('</div>');
                $("#lines_list").html(country_html.join(""));
                $("#pop_list").html(pop_html.join(""));
            }
            //点击poplist跳转详情
            $('#pop_list .popId').off('click')
                .on('click',function () {
                    var country_id = $(this).attr("id");
                    $('#lines').addClass('lines_list');
                    city_show(country_id);
                    setTimeout(function(){
                            $.mobile.changePage('#lineShow',{ transition: "slide",reverse: false,changeHash: false});
                        },500);
                });

            //点击countrylist跳转详情
            $('#lines_list .countryId').off('click')
                .on('click',function () {
                    var country_id = $(this).attr("id");
                    $('#lines').addClass('lines_list');
                    city_show(country_id);
                    setTimeout(function(){
                            $.mobile.changePage('#lineShow',{ transition: "slide",reverse: false,changeHash: false});
                        },500);
                });
        });
    }


    $("#lines").on( "pagecreate", function() {
        $( "body > [data-role='panel']" ).panel();
        $( "body > [data-role='panel'] [data-role='listview']" ).listview();
    });
    //changePassword页面 设置内容高度是Header剩下的高度
    $("#lines").on( "pagebeforeshow", function( event ) {
        rem = localStorage.getItem("rem");
        if(rem == "0"){
            $('.loadingShow').removeClass("neverShow");
            $('.loadingShow').show();//遮罩层显示
            $('.loadingGot').show();//按钮显示
            flag = 0;
        }else{
            $('.loadingShow').addClass("neverShow");
            $('.loadingShow').hide();//遮罩层隐藏
            $('.loadingGot').hide();//按钮隐藏
            //flag = 1;
        }
        $('#news_footer').hide();
        $('#lines-moom').removeClass('global_ol').addClass('list_view');
        $('#global_lines').hide();//列表隐藏
        line_show();
        // if($('.loadingShow').hasClass('neverShow')){
        //     $('.loadingShow').hide();//遮罩层隐藏
        //     $('.loadingGot').hide();//按钮隐藏
        //     flag = 1;
        // }else{
        //     $('.loadingShow').show();//遮罩层显示
        //     $('.loadingGot').show();//按钮显示
        //     flag = 0;
        // }

        // if($('#lines').hasClass('frompage')){
        //     $('.loadingShow').show();//遮罩层显示
        //     $('.loadingGot').show();//按钮显示
        //     flag = 1;
        // }else{
        //     $('.loadingShow').hide();//遮罩层隐藏
        //     $('.loadingGot').hide();//按钮隐藏
        //     flag = 0;
        // }

        // $('.loadingGot').show();
        //flag = 0;
        window.shouldPageRefresh.newsroom = true;
        $('#lines-content').css('height', ($(window).height()-44-20));
        $('#lines-content-info').css('min-height', ($(window).height()-44));
        $('#global_lines').css('height', ($(window).height()-44-20));
        $('#search_lineList').css('height', ($(window).height()-44)-20);
        // $('#content_result_show').css('height', ($(window).height()-44));
        // $('#global_lines').css('height', ($(window).height()));

        $('#lines-content').hide();
        $('#main_show').show();
        // $('#main').show();
        $('#main_show').css('height', ($(window).height()));
        $('#lines').removeClass('ui-page');
        $('#lines_header').removeClass();

        $('#lines-title').css('display', 'block');
        $('#lines-menu').css('display', 'block');
        $('#lines-search').css('display', 'block');
        $('#lines_info').show();
        // $('#lines-moom').removeClass('global_ol').addClass('list_view');

        // $('#detail_id').html("");
        mySwiper.slideTo(0,200,true);
        office_flag = false;


        $("#foshan_del,#gzc_del,#gzt_del,#hdgp_del,#gltc_del,#tc_del").hide();
        $("#foshan_name,#gzc_name,#gzt_name,#hdpg_name,#gltc_name,#tc_name").css('border-bottom','1px solid #0c1113');

        myChart.setOption(option);

        if($(this).hasClass('lines_list')){
            $('#lines-moom').removeClass('list_view').addClass('global_ol');
            $('#search_lineList, #main').hide();
            $('#global_lines').show();
        }else{
            setTimeout(function(){
                $('#main').show();
            }, 100);
        }
    });
    //点击never remeber me
    $('.loadingNever').off('click').on('click',function(){
        var postData = {};
        postData["userId"] = q['user'].userId;
        postData['remember'] = "1";
        net.post("user/rememberMe",postData,function(error){

        },function(response){
            if(response.code != 0){

            }else{
                $('.loadingShow').addClass("neverShow");
                $('.loadingShow').hide();
                $('.loadingGot').hide();
                rem = localStorage.setItem("rem","1");
                flag = 0;
            }
        });
    });

    $("#lines").on("pageshow",function(){
        $(this).find("#popular_country_list").scrollTop(0);
        if(!$('.loadingGot').is(':visible')){

        }else{
            window.historyView = [];
        }
    });

    $("#lines").on("pagebeforehide", function() {
        $('#main').hide();
    });

    $("#lines").on("pagehide", function() {
        flag = 0;
        $('.lines_search').remove();
        $('#thk_next').hide();
        $('#hdgp_next').hide();
        $('#fsc_next').hide();
        $('#history_rul_show').hide();

        $('#main_show').hide();
        $('.loadingKel').hide();//遮罩层隐藏


        $("#lines_list").html("");
        $("#pop_list").html("");

        // $('#lines').removeClass('frompage');
        $('#foshan_name').find("i").removeClass("office_up").addClass("office_icon");
        $('#gzc_name').find("i").removeClass("office_up").addClass("office_icon");
        $('#gzt_name').find("i").removeClass("office_up").addClass("office_icon");
        $('#hdpg_name').find("i").removeClass("office_up").addClass("office_icon");
        $('#gltc_name').find("i").removeClass("office_up").addClass("office_icon");
        $('#tc_name').find("i").removeClass("office_up").addClass("office_icon");

    });
    function compatibility() {
        /* Logon */
        $('#title_line').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_line').css('postion', 'absulute')
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

    document.addEventListener('touchmove', function (event) { 　　 //监听滚动事件
        if(flag==1){　　　　　　　　　　　　　　　　　　　　　　　　　　　　//判断是遮罩显示时执行，禁止滚屏
            event.preventDefault();　　　　　　　　　　　　　　　　　　　//最关键的一句，禁止浏览器默认行为
        }
    });

    return {
        showLines : function(){
            line_show();
        }
    }
});
