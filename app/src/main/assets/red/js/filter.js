require(['jquery', 'jquerymobile', 'net', 'dialogs','panle'], function($, m, net, dia,panle) {

    //注销用户后复选框清空
    /*function clear_checkbox() {
        $('#all_check').removeClass('nor').addClass('sel');
        $('div[name="sbox"]', $('#filter')).each(function(index, val) {
            $(val).removeClass('nor').addClass('sel');
        });
        //$('#filter_btn_applay').hide();
    }

    $("#filter").on( "pagecreate", function() {
        $( "body > [data-role='panel']" ).panel();
        $( "body > [data-role='panel'] [data-role='listview']" ).listview();
    });
    //changePassword页面 设置内容高度是Header剩下的高度
    $("#filter").on( "pageshow", function( event ) {
        console.info("filter");
        //window.setBodyOverflow($(document.body));
        $('#filter_content').css('height',($(window).height()-44-20));
        $('#newsFilter_ul').css('min-height', ($(window).height()-45));
        // 读取以前勾的数据
        var selectBefore = [];
        if (!$.isEmptyObject(localStorage['selected_tags'])) {
            selectBefore = localStorage['selected_tags'].toString().split(',');
            $.each($('div[name="sbox"]', $('#filter')), function(boxIndex, boxData) {
                $.each(selectBefore, function(selIndex, selectData) {
                    if (selectData == $(boxData).attr('alt')) {
                        $(boxData).removeClass('nor').addClass('sel');
                    }
                });
            });

            if ($('div[name="sbox"]', $('#filter')).length == (selectBefore.length - 1)) {
                $('div[name="sbox2"]').removeClass('nor').addClass('sel');
            } else {
                $('div[name="sbox2"]').removeClass('sel').addClass('nor');
            }
        } else {
            clear_checkbox();
        }

        $('div[name="sbox"]', $('#filter')).off('click');
        $('div[name="sbox"]', $('#filter')).on('click', function(event) {
            if ($(this).hasClass('nor'))
                $(this).removeClass('nor').addClass('sel');
            else
                $(this).removeClass('sel').addClass('nor');

            // 如果勾选了数量等于总数 则全选择也勾上
            var selectCount = 0;
            $.each($('div[name="sbox"]', $('#filter')), function(boxIndex, boxData) {
                if ($(boxData).hasClass('sel')) {
                    selectCount++;
                }
            });
            if (selectCount === 0) {
                $('#filter_btn_applay').hide();
            } else {
                $('#filter_btn_applay').show();
            }
            if ($('div[name="sbox"]', $('#filter')).length == selectCount) {
                $('div[name="sbox2"]', $('#filter')).removeClass('nor').addClass('sel');
            } else {
                $('div[name="sbox2"]', $('#filter')).removeClass('sel').addClass('nor');
            }
        });

        $('#all_check').off('click');
        $('#all_check').on('click', function(event) {
            if ($('#all_check').hasClass('nor')) {
                $(this).removeClass('nor').addClass('sel');
                $('div[name="sbox"]', $('#filter')).each(function(index, val) {
                    $(val).removeClass('nor').addClass('sel');
                });
                $('#filter_btn_applay').show();
            } else {
                $(this).removeClass('sel').addClass('nor');
                $('div[name="sbox"]', $('#filter')).each(function(index, val) {
                    $(val).removeClass('sel').addClass('nor');
                });
                $('#filter_btn_applay').hide();
            }


        });
        // Nick added for pull to refresh start
        window.shouldPageRefresh.newsroom = true;
        // Nick added for pull to refresh end
        // window.historyView = [];
    });

    function initPageLoading(wrapper) {
        var $wrapper = $("#" + wrapper),
            $pullDownEl = $wrapper.find("#pullDown");
        if(wrapper == "wrapper_video"){
            $pullDownEl = $wrapper.find("#pullDown_video");
        }
        var $pullDownLabel = $pullDownEl.find(".pullDownLabel");
        if ($wrapper.find("ul").html()) {
            $wrapper.find(".scroller").css(window.getVendorStyle("transform"), "translate(0, 0)");
            $pullDownEl.attr("class", "loading");
            $pullDownLabel.text("Loading...")
        }
    }
    // Nick added for pull to refresh end

    //applay 按钮返回新闻
    $('#filter_btn_applay').on('click', function(evt) {
        var sel_tags = '';
        $.each($('div[name="sbox"]', $('#filter')), function(index, val) {

            if ($(this).hasClass('sel')) {
                sel_tags += $(this).attr('alt')+',';
            }
        });
        localStorage['selected_tags'] = sel_tags;
        // Nick added for pull to refresh start
         // Nick added for pull to refresh end
        var pageId = $('#filter_btn_applay').attr("filterResourcePage");
        var pageWrapper = $('#filter_btn_applay').attr("filterResourceWrapper");
        initPageLoading(pageWrapper);
        $.mobile.newChangePage("#"+pageId,{ transition: "slide",reverse: true,changeHash: false});
     });



    $('#filter_btn_back').on('click', function(evt) {
        var pageId = $('#filter_btn_applay').attr("filterResourcePage");
        if(pageId == "newsroom"){
            window.shouldPageRefresh.newsroom = false;
        }
        $.mobile.newChangePage("#"+pageId,{ transition: "slide",reverse: true,changeHash: false});
    });

    function compatibility() {
        /!* Logon *!/
        $('#title_filter').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_filter').css('postion', 'absulute')
            .css('width', '49px')
            .css('height','20px')
            .css('margin', '8px auto auto auto');
    }

    $(document).ready(function () {
        setTimeout(function() {
            // 兼容其他浏览器
            compatibility();
        },1000);
    });*/
    //applay 按钮返回新闻
    $('#filter_btn_applay').off('touchend').on('touchend', function(event) {
        event.preventDefault();
        /*var sel_tags = '';
        $.each($('div[name="sbox"]', $('#filter')), function(index, val) {

            if ($(this).hasClass('sel')) {
                sel_tags += $(this).attr('alt')+',';
            }
        });
        localStorage['selected_tags'] = sel_tags;*/
        // Nick added for pull to refresh start
        // Nick added for pull to refresh end
        var pageId = $('#filter_btn_applay').attr("filterResourcePage");
        var pageWrapper = $('#filter_btn_applay').attr("filterResourceWrapper");
        //initPageLoading(pageWrapper);
        window.shouldPageRefresh.newsroom = true;
        $.mobile.newChangePage("#"+pageId,{ transition: "slide",reverse: true,changeHash: false});
    });

    function initPageLoading(wrapper) {
        var $wrapper = $("#" + wrapper),
            $pullDownEl = $wrapper.find("#pullDown");
        if(wrapper == "wrapper_video"){
            $pullDownEl = $wrapper.find("#pullDown_video");
        }
        var $pullDownLabel = $pullDownEl.find(".pullDownLabel");
        if ($wrapper.find("ul").html()) {
            $wrapper.find(".scroller").css(window.getVendorStyle("transform"), "translate(0, 0)");
            $pullDownEl.attr("class", "loading");
            $pullDownLabel.text("Loading...");
        }
    }
    $(document).on('pageinit', function () {
        $('#filter_btn_back').off('click').on('click', function(event){
            $.mobile.changePage('#newsroom',{transition: "slide",reverse: true,changeHash: true});
        });
        $('#filter-country-back').off('click').on('click', function(event){
            $.mobile.changePage('#filter',{transition: "slide",reverse: true,changeHash: true});
        });
        $('#filter-tag-back').off('click').on('click', function(event){
            $.mobile.changePage('#filter',{transition: "slide",reverse: true,changeHash: true});
        });
        $('.filter-tag .toPage').off('tap').on('tap', function(event){
            $.mobile.changePage('#filter-tag',{transition: "slide",reverse: false,changeHash: true});
        });
        $('.filter-country .toPage').off('tap').on('tap', function(event){
            $.mobile.changePage('#filter-country',{transition: "slide",reverse: false,changeHash: true});
        });


        $('#tag-listview,#country-listview').off('touchend').on('touchend', '.checkbox', function($event){
            $event.preventDefault();
            $event.stopPropagation();
            //当前选中的li
            var $parent_li = $(this).closest('li'),
            //全选按钮的li
            $selectAll = $parent_li.siblings('li.selectAll');
            //切换复选框选中和不选中
            //fastclick时this不对-->
            $parent_li.toggleClass('selected');
            //如果点击的是全选按钮
            if($parent_li.hasClass('selectAll')){
                //选中
                if($parent_li.hasClass('selected')){
                    //所有li都选中
                    $parent_li.siblings('li').addClass('selected');
                }else{
                    //所有li都不选中
                    $parent_li.siblings('li').removeClass('selected');
                }
             //如果点击的是非全选按钮
            }else{
                //如果操作是取消选中并且全选按钮是选中的，将全选按钮变为不勾选状态
                if(!$parent_li.hasClass('selected') && $selectAll.hasClass('selected')){
                    $selectAll.removeClass('selected')
                }
                //如果当前li的所有兄弟节点的长度 == 全选按钮的所有选中节点的兄弟节点长度，将全选按钮变为选中状态
                if($parent_li.siblings('li').length == $selectAll.siblings('li').filter(function(){
                        return $(this).hasClass('selected');
                    }).length){
                    $selectAll.addClass('selected');
                }
            }
        });

        $('.done').off('touchend').on('touchend', function(event){
            event.preventDefault();
            var countryFilter = '',
                tagFilter = '',
                pattern = /[$&#]/g;

            if($('.ui-page-active').find('li.selected').length == 0){
                dia.alert('Ops', 'You have not yet selected the following options ,please select!', ['OK'],function(title) {});
                return false;
            }

            if($('.ui-page-active').attr('id') == 'filter-country'){
                if($('#country-listview li.selectAll').hasClass('selected')){
                    countryFilter = 'All';
                }else{
                    $.each($('.ui-page-active li.selected'), function(index, item){
                        countryFilter += $(item).data('selectcountry') + ',';
                    });
                    countryFilter = countryFilter.slice(0, countryFilter.lastIndexOf(','));
                }
                //console.info(countryFilter);
                localStorage.setItem('countryFilter', countryFilter);
            }else if($('.ui-page-active').attr('id') == 'filter-tag'){
                if($('#tag-listview li.selectAll').hasClass('selected')){
                    tagFilter = 'All';
                }else{
                    $.each($('.ui-page-active li.selected'), function(index, item){
                        tagFilter += $(item).data('selecttag').replace(pattern, function(str){
                                return '\\' + str;
                            }) + ',';
                    });
                    tagFilter = tagFilter.slice(0, tagFilter.lastIndexOf(','));
                }

                //console.info(tagFilter);
                localStorage.setItem('tagFilter', tagFilter);
            }

            $.mobile.changePage('#filter', {transition: "slide",reverse: true,changeHash: true});
        });

    });

    $('#filter-country').off('pagebeforeshow').on('pagebeforeshow', function(){
        var countryFilter = localStorage.getItem('countryFilter');
        if(countryFilter == 'All'){
            $('#country-listview li').addClass('selected');
        }else{
            var filterArr = countryFilter.split(',');
            //console.info(filterArr);
            $('#country-listview li').removeClass('selected');
            $.each(filterArr, function(index, item){
                $('#country-listview li[data-selectCountry="'+ item +'"]').addClass('selected');
            });
        }
    });

    $('#filter-tag').off('pagebeforeshow').on('pagebeforeshow', function(){
        var tagFilter = localStorage.getItem('tagFilter');
        if(tagFilter == 'All'){
            $('#tag-listview li').addClass('selected');
        }else{
            var filterArr = tagFilter.split(',');
            //console.info(filterArr);
            $('#tag-listview li').removeClass('selected');
            $.each(filterArr, function(index, item){
                $('#tag-listview li[data-selectTag="'+ item +'"]').addClass('selected');
            });
        }
    });

    $('#filter').off('pagebeforeshow').on('pagebeforeshow', function(){
        if($('#filter_btn_applay').attr('filterresourcewrapper') == 'news_wrapper'){
            $('.filter-country').show();
        }else{
            $('.filter-country').hide();
        }
    });

    $('#filter').off('pageshow').on('pageshow', function(){
        var countryFilter = localStorage.getItem('countryFilter') || 'All',
            tagFilter = localStorage.getItem('tagFilter') || 'All',
            pattern = /\\[$#&]/g;
        //console.log('filter  countryFilter: ' + countryFilter);
        //console.log('filter  tagFilter: ' + tagFilter);
        $('.filter-country dd, .filter-tag dd').remove();

        if(countryFilter == 'All'){
            $('.filter-country').append('<dd data-country="">All</dd>');
            localStorage.setItem('countryFilter', 'All');
        }else{
            var countryArr = countryFilter.split(',');
            //console.info(countryArr);
            $.each(countryArr, function(index, item){
                var countryName = $('#country-listview li[data-selectCountry="'+ item +'"]').find('p').text();
                $('.filter-country').append('<dd data-country="'  + item +'">' + countryName + '</dd>');
            });
        }

        if(tagFilter == 'All'){
            $('.filter-tag').append('<dd data-tagNames="">All</dd>');
            localStorage.setItem('tagFilter', 'All');
        }else{
            var tagArr = tagFilter.split(',');
            //console.info(tagArr);
            $.each(tagArr, function(index, item){
                item = item.replace(pattern, function(str){
                    return str.substring(1);
                });
                $('.filter-tag').append('<dd data-tagNames="'  + item +'">' + item + '</dd>');
            });
        }

    });

});

