/**
 * Created by testbetta1 on 16/4/29.
 */

require(['jquery', 'jquerymobile', 'net', 'dialogs'], function($, m, net, dia) {
    var isScrolling = false,
        iScroll_allUploadInfo = {
            myScroll: null,
            allowGetMore: true,
            pullUpAction: function () {
                getUploadInfo();
            },
            loaded: function(wrapper) {
                var $wrapper = $("#" + wrapper),
                    $pullUpEl = $wrapper.find("#pullUp_allUploadInvoice"),
                    $pullUpLabel = $pullUpEl.find(".pullUpLabel"),
                    $pullUpIcon = $pullUpEl.find(".pullUpIcon"),
                    pullUpOffset = $pullUpEl[0].offsetHeight;
                iScroll_allUploadInfo.myScroll = new iScroll(wrapper, {
                    hScrollbar: false,
                    vScrollbar: false,
                    useTransition:false,
                    checkDOMChanges:false,
                    onRefresh: function () {
                        if ($pullUpEl.hasClass("loading")) {
                            $pullUpEl.removeClass("loading");
                            if (iScroll_allUploadInfo.allowGetMore) {
                                $pullUpIcon.show();
                                $pullUpLabel.text("Pull up to load more...");
                                $("#pullUp_allUploadInvoice").show();
                            } else {
                                $pullUpIcon.hide();
                                $pullUpLabel.text("");
                                $("#pullUp_allUploadInvoice").hide();
                            }
                        }
                    },
                    onScrollMove: function () {
                        if (this.y < (this.maxScrollY - 5) && !$pullUpEl.hasClass("flip")) {
                            if (iScroll_allUploadInfo.allowGetMore) {
                                $pullUpEl.addClass("flip");
                                $pullUpLabel.text("Release to refresh...");
                                $("#pullUp_allUploadInvoice").show();
                                this.maxScrollY = this.maxScrollY;
                            }
                        } else if (this.y > (this.maxScrollY + 5) && $pullUpEl.hasClass("flip")) {
                            if (iScroll_allUploadInfo.allowGetMore) {
                                $pullUpEl.removeClass("flip");
                                $pullUpLabel.text("Pull up to load more...");
                                $("#pullUp_allUploadInvoice").show();
                                this.maxScrollY = pullUpOffset;
                            }
                        }
                        isScrolling = true;
                    },
                    onScrollEnd: function () {
                        if ($pullUpEl.hasClass("flip")) {
                            if (iScroll_allUploadInfo.allowGetMore) {
                                iScroll_allUploadInfo.allowGetMore = false;
                                $pullUpEl.attr("class", "loading");
                                $pullUpLabel.text("Loading...");
                                $("#pullUp_allUploadInvoice").show();
                                iScroll_allUploadInfo.pullUpAction();
                            }
                        }
                        setTimeout(function() {
                            isScrolling = false;
                        }, 500);
                    }
                });
            }
        };
    // 当前页数
    var currentPageNumer = 1;

    $('#uploadinvoice_btn_menu').off('click').on('click', function() {
        $.mobile.changePage("#eInvoice", { transition: "slide",reverse: true,changeHash: false});

    });
    function getUploadInfo(refresh){
        if (refresh) {
            currentPageNumer = 1;
        }
        var postData = {};
        postData['pager.pageNo'] = currentPageNumer;
        postData['pager.pageSize'] = 10;
        postData['userId'] = q['user'].userId;
        net.post('invoiceClaim/recordsQuery',postData,
          function(error){
              var $pullUpEl = $("#wrapper_allUploadInvoice").find("#pullUp_allUploadInvoice"),
                  $pullUpLabel = $pullUpEl.find(".pullUpLabel"),
                  $pullUpIcon = $pullUpEl.find(".pullUpIcon");
              var padTop = $(window).height()/2-60;
              $("#uploadinvoice_listview").html('\<div style="height:'+($(window).height()-44-20)+'\px;padding-top:\
                        '+padTop+'\px;text-align:center;color:#999999;font-size:14px; margin: 10px 0;padding-left: 20px; padding-right: 20px;">\
                        No e-Invoice records yet.<br>' +
                        ' Please check <a href="#eInvoice_instruction" data-transition="slide" style="text-decoration:none;color:#db0011">introduction</a> to understand how to upload '+
                        'your e-invoice</div>').show();
              iScroll_allUploadInfo.allowGetMore = false;
              setTimeout(function() {
                  var $cornerAllgHeight = $(window).height()-44-20-50-10;
                  if(iScroll_allUploadInfo.myScroll){
                      iScroll_allUploadInfo.myScroll.refresh();
                  }
                  $pullUpEl.show();
                  $pullUpIcon.hide();
                  $pullUpLabel.text("");
                  $("#pullUp_allUploadInvoice").hide();
                  $("#uploadinvoice_listview").css("min-height",$cornerAllgHeight+"px");
                  disableClickEvent(false);
              }, 800);
          }, function(response){
             if (response.code != 0) {
                 var $pullUpEl = $("#wrapper_allUploadInvoice").find("#pullUp_allUploadInvoice"),
                     $pullUpLabel = $pullUpEl.find(".pullUpLabel"),
                     $pullUpIcon = $pullUpEl.find(".pullUpIcon");
                     var padTop = $(window).height()/2-60;
                     $("#uploadinvoice_listview").html('\<div style="height:'+($(window).height()-44-20)+'\px;padding-top:\
                        '+padTop+'\px;text-align:center;color:#999999;font-size:14px; margin: 10px 0;padding-left: 20px; padding-right: 20px;">\
                        No e-Invoice records yet.<br>' +
                        ' Please check <a href="#eInvoice_instruction" data-transition="slide" style="text-decoration:none;color:#db0011">introduction</a> to understand how to upload '+
                        'your e-invoice</div>').show();
                     iScroll_allUploadInfo.allowGetMore = false;

                 setTimeout(function() {
                     var $cornerAllgHeight = $(window).height()-44-20-50-10;
                     if(iScroll_allUploadInfo.myScroll){
                         iScroll_allUploadInfo.myScroll.refresh();
                     }
                     $pullUpEl.show();
                     $pullUpIcon.hide();
                     $pullUpLabel.text("");
                     $("#pullUp_allUploadInvoice").hide();
                     $("#uploadinvoice_listview").css("min-height",$cornerAllgHeight+"px");
                     disableClickEvent(false);
                 }, 800);
             }
             else{
                    var fileList = response.data.result;
//
                    var fileListLength = fileList.length;
                    if (fileListLength > 0)  {
                        getUploadHtml(fileList);
                        currentPageNumer++;
                    }
                    var $pullUpEl = $("#wrapper_allUploadInvoice").find("#pullUp_allUploadInvoice"),
                        $pullUpLabel = $pullUpEl.find(".pullUpLabel"),
                        $pullUpIcon = $pullUpEl.find(".pullUpIcon");
                    if (fileListLength == 0) {
                        if(refresh){
                            var padTop = $(window).height()/2-60;
                            $("#uploadinvoice_listview").html('\<div style="height:'+($(window).height()-44-20)+'\px;padding-top:\
                        '+padTop+'\px;text-align: center;color:#999999;font-size:14px; margin: 10px 0;padding-left: 20px; padding-right: 20px;">\
                        No e-Invoice records yet.<br>' +
                        ' Please check <a href="#eInvoice_instruction" data-transition="slide" style="text-decoration:none;color:#db0011">introduction</a> to understand how to upload '+
                        'your e-invoice</div>');
                        }
                        iScroll_allUploadInfo.allowGetMore = false;
                    } else {
                        iScroll_allUploadInfo.allowGetMore = true;
                    }

                    setTimeout(function() {
                        var $cornerAllgHeight = $(window).height()-44-20-50-10;
                        if(iScroll_allUploadInfo.myScroll){
                            iScroll_allUploadInfo.myScroll.refresh();
                        }
                        if(fileListLength == 0){
                            $pullUpEl.show();
                            $pullUpIcon.hide();
                            $pullUpLabel.text("");
                            $("#pullUp_allUploadInvoice").hide();
                        }
                        else{
                            $("#pullUp_allUploadInvoice").show();
                            $cornerAllgHeight = $(window).height()-44-20;
                        }

                        if(refresh){
                            $("#uploadinvoice_listview").show();
                        }
                        $("#uploadinvoice_listview").css("min-height",$cornerAllgHeight+"px");
                        disableClickEvent(false);
                    }, 800);
             }
          }
      ,{async:false});
    }

        // 补充0
    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    function getMonthString(month) {
        month = month + 1;
        if (month == 1)
        return 'Jan';
        else if (month == 2)
        return 'Feb';
        else if (month == 3)
        return 'Mar';
        else if (month == 4)
        return 'Apr';
        else if (month == 5)
        return 'May';
        else if (month == 6)
        return 'June';
        else if (month == 7)
        return 'July';
        else if (month == 8)
        return 'Aug';
        else if (month == 9)
        return 'Sept';
        else if (month == 10)
        return 'Oct';
        else if (month == 11)
        return 'Nov';
        else if (month == 12)
        return 'Dec';
        else {
        console.assert(false, '月份 %o 不存在 ', month );
        }
    }


  //时间显示 ，今天显示具体时间
    function timeDisplay(uploadDate){
    	var returnDate = '';
    	if(uploadDate.toDateString() === new Date().toDateString()){
    		returnDate = 'Today ' + pad(uploadDate.getHours(), 2) + ":" + pad(uploadDate.getMinutes(), 2);
    	} else{
    		returnDate = uploadDate.getFullYear() + "-" + pad((uploadDate.getMonth() + 1), 2) + "-" + uploadDate.getDate();
    	}

    	return returnDate;

    }


    function getUploadHtml(uploadInfos){
        var uploadinfoArry = [];
        $.each(uploadInfos,function(index,uploadInfo){
           var uploadDate = new Date(uploadInfo.batch_flag * 1000);
           var month = getMonthString(uploadDate.getMonth());
           //var uploadTime = 'Upload at ' + pad(uploadDate.getHours(),2) + ':' + pad(uploadDate.getMinutes(),2) + ', ' + uploadDate.getDate() + " " + getMonthString(uploadDate.getMonth()) + " " + uploadDate.getFullYear();
           var uploadTime = timeDisplay(uploadDate);
           var remark = uploadInfo.memo;
           var fileTitle = uploadInfo.contentId;
           var uploadFullDate = uploadDate.getFullYear() + "" + pad((uploadDate.getMonth() + 1), 2) + "" + uploadDate.getDate();
           var typeHtml = '<img id="'+ fileTitle  +'"  uploadDate="' +  uploadFullDate +  '" class="pdf_item"  src="images/image/icon-PDF.png" style="margin: 10px auto 10px 10px;width: 40px;height:40px;float: left;">';

           var uploadInfoHtml = '\<li data-role="none" style="height:60px;clear:both; margin:0;border-bottom:1px solid #E0E0E0;list-style:none;">'+typeHtml+'\
           <div class="inVoiceListDelete" style="position:relative; text-align: center; height:60px;line-height:60px;z-index:99999;float:right; background: #FF0000; color: #FFFFFF;display:none">delete</div>\
           <div class="invoiceListContent" style="padding-top:10px;padding-bottom:10px;height: 60px;line-height:1.0;word-break:break-word;width:60%;overflow: hidden;float: left;">' +
           '<div style="margin: 0px 8px 5px; font-size: 13px;\
           color: #333333;">'+fileTitle+'</div><div style="margin: 5px 8px 0px;font-size: 11px;\
           color: #999999">'+remark+'</div></div>' +
               '<div class="invoiceUploadTime" style="font-size: 11px; color: #999999; float: right; margin: 10px 10px 10px 0">'+ uploadTime + '</div></li>';
           uploadinfoArry.push(uploadInfoHtml);
        });
        var uploadinfoString = uploadinfoArry.join("") + '<div class="eInvoiceListTip"  style="color:#999999;font-size:11px;padding:10px 10px;">Only display the invoices uploaded on #red</div>';

        $(".eInvoiceListTip").remove();
        $("#uploadinvoice_listview").append(uploadinfoString);
         $("#pullUp_allUploadInvoice").show();
  //        $("#uploadinfo_listview").listview("refresh");
          if (iScroll_allUploadInfo.myScroll == null) {
              iScroll_allUploadInfo.loaded("wrapper_allUploadInvoice");
          }
    }


    function confirmAndDelete( listitem, transition ) {
        if ( transition == "left") {
          listitem.find(".invoiceUploadTime").animate({width: 'toggle'}, 200).hide();
            listitem.find( ".inVoiceListDelete" ).animate({ width: '80' }, 200).show();
          } else {
            listitem.find( ".inVoiceListDelete" ).animate({width: 'toggle'}, 200).hide();
            listitem.find(".invoiceUploadTime").show();
          }
      }

    //安卓和ios处理不一样
    $("#uploadinvoice_listview").off("tap")
        .on("tap", "li", function(event){
            var $item = $(this);
            if(event.target.className == 'inVoiceListDelete'){
                $(event.target).click();
                return false;
            }
            if($item.find(".inVoiceListDelete").is(':visible')){
                $item.find(".inVoiceListDelete").animate({width: '0'}, 200).hide();
                $item.find(".invoiceUploadTime").show();
                return false;
            }

            $(".inVoiceListDelete").animate({width: '0'}, 200).hide();
            $(".invoiceUploadTime").show();

            var $pdfImg = $(this).find('.pdf_item');
            if(_IsIOS()){
                //e-invoice判断插件
                eInvoiceUploadPlugin.overViewPDF(net.url_base + 'invoiceClaim/pdfLoadTest?fileName=' + $pdfImg.attr('id') +'&uploadDate='+ $pdfImg.attr('uploadDate') + '&userId=' + q['user'].userId, $pdfImg.attr('id') + '.pdf', function(s){
                }, function(error){

                });
            } else {
                $("#title_eInvoice_pdfShow").html($pdfImg.attr('id') + '.pdf');
                $("#eInvoice-pdfShow-present").attr('src', './libs/pdfJs/generic/web/viewer.html?file=' + encodeURIComponent(net.url_base + 'invoiceClaim/pdfLoadTest?fileName=' + $pdfImg.attr('id') +'&uploadDate='+ $pdfImg.attr('uploadDate') + '&userId=' + q['user'].userId));
                $.mobile.newChangePage("#eInvoice_pdfShow",{ transition: "slide",reverse: false,changeHash: false});
            }

        });

    $("#uploadinvoice_listview").off("click").on("click", "li .inVoiceListDelete", function(event){
        var postData = {};
        var $thisListItem = $(this);
        postData['userId'] = q['user'].userId;
        postData['fileName'] = $(this).siblings('img').attr('id');
        dia.alert('Confirmation', 'Are you sure to delete this record?', ['Yes', 'No'], function(title) {
        	if(title == 'Yes'){
        		net.post('invoiceClaim/deleteInvoice', postData,
        			      function(error){
        			        }, function(response){
        			          if(response.code != 0){
        			            dia.alert('Confirmation', response.msg, ['OK'], function(title) {
        			                });
        			          } else {
        			            dia.alert('Confirmation', response.msg, ['OK'], function(title) {
        			              $('#uploadinvoice_listview li').remove();
        			              $('#uploadinvoice_listview div').remove();
        			              $('#uploadinvoice_listview').hide();
        			                  $('#pullUp_allUploadInvoice').show();
        			                  disableClickEvent(true);
        			                  getUploadInfo(true);

        			                });
        			          }
        			        });
        	} else {
               /*
                * Resolve issue#1083 by@Linda
                * when user select the cancle button,current selected item should hide the delete btn.
                * */
                $thisListItem.animate({width: 'toggle'}, 200).hide();
                $thisListItem.parent("li").find(".invoiceUploadTime").show();
            }
        });

        event.stopPropagation();

    });


	 $("#uploadinvoice_listview").off("swipeleft").off("swiperight").on("swipeleft swiperight", "li", function(event){
		var $listitem = $(this),
		$siblingsItem = $listitem.siblings('li'),
		// These are the classnames used for the CSS transition
		dir = event.type === "swipeleft" ? "left" : "right",
		// Check if the browser supports the transform (3D) CSS transition
		transition = $.support.cssTransform3d ? dir : false;
        if($siblingsItem.find(".inVoiceListDelete:visible").length > 0){
            $siblingsItem.find(".inVoiceListDelete").animate({width: '0'}, 200).hide();
            $siblingsItem.find(".invoiceUploadTime").show();
        }
		confirmAndDelete( $listitem, transition );
	});


    $("#uploadinvoice").on( "pagebeforeshow", function( event ) {
        $('#news_footer').hide();
        window.setBodyOverflow($(document.body));
        $('#uploadinvoice_content').css('min-height',($(window).height()-44-40));
        //$('#uploadinvoice_content_info').css('min-height', ($(window).height()-44-20));
        initPageLoad("wrapper_allUploadInvoice");
        $('#uploadinvoice_listview li').remove();
        $('#uploadinvoice_listview div').remove();
        $('#uploadinvoice_listview').hide();
        $('#pullUp_allUploadInvoice').show();
    $("#uploadinvoice").on( "pageshow", function( event ) {
    });
        disableClickEvent(true);
        getUploadInfo(true);
        // window.historyView = [];
        /*splash.hidden(null, function(){
        }, function(){
        });*/
    });

    //判断ios还是安卓
    function _IsIOS() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/iPhone\sOS/i) == "iphone os") {
            return true;
        } else {
            return false;
        }
    }
    function _IsAndroid() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/Android/i) == "android") {
            return true;
        } else {
            return false;
        }
    }

    function initPageLoad(wrapper) {
        var $wrapper = $("#" + wrapper),
            $pullDownEl = $wrapper.find("#pullUp_allUploadInvoice"),
            $pullDownLabel = $pullDownEl.find(".pullDownLabel");
        $wrapper.find(".scroller").css(window.getVendorStyle("transform"), "translate(0, 0)");
        $pullDownEl.attr("class", "loading");
        $pullDownLabel.text("Loading...");
        $("#pullUp_allUploadInvoice").show();
    }
    function compatibility() {
        /* Logon */
        $('#uploadinvoice_header_title').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#uploadinvoice_header_title').css('postion', 'absulute')
            .css('width', '200px')
            .css('height','20px')
            .css('margin', '8px auto auto auto');
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
    $(document).ready(function () {
        setTimeout(function() {
            // 兼容其他浏览器
            compatibility();
        },1000);
    });
});
