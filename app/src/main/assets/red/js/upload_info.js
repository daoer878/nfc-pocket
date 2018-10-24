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
                    $pullUpEl = $wrapper.find("#pullUp_allUploadInfo"),
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
                                $("#pullUp_allUploadInfo").show();
                            } else {
                                $pullUpIcon.hide();
                                $pullUpLabel.text("");
                                $("#pullUp_allUploadInfo").hide();
                            }
                        }
                    },
                    onScrollMove: function () {
                        if (this.y < (this.maxScrollY - 5) && !$pullUpEl.hasClass("flip")) {
                            if (iScroll_allUploadInfo.allowGetMore) {
                                $pullUpEl.addClass("flip");
                                $pullUpLabel.text("Release to refresh...");
                                $("#pullUp_allUploadInfo").show();
                                this.maxScrollY = this.maxScrollY;
                            }
                        } else if (this.y > (this.maxScrollY + 5) && $pullUpEl.hasClass("flip")) {
                            if (iScroll_allUploadInfo.allowGetMore) {
                                $pullUpEl.removeClass("flip");
                                $pullUpLabel.text("Pull up to load more...");
                                $("#pullUp_allUploadInfo").show();
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
                                $("#pullUp_allUploadInfo").show();
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

    $('#uploadinfo_btn_back').off('click').on('click', function() {
        $.mobile.backChangePage("#myCornerHome",{ transition: "slide",reverse: false,changeHash: false});

    });
    function getUploadInfo(refresh){
        if (refresh) {
            currentPageNumer = 1;
        }
        var postData = {};
        postData['pager.pageNo'] = currentPageNumer;
        postData['pager.pageSize'] = 10;
        postData['userId'] = q['user'].userId;
        net.post('activity/getMyUploadfiles',postData,
          function(error){
              var $pullUpEl = $("#wrapper_allUploadInfo").find("#pullUp_allUploadInfo"),
                  $pullUpLabel = $pullUpEl.find(".pullUpLabel"),
                  $pullUpIcon = $pullUpEl.find(".pullUpIcon");
              var padTop = $(window).height()/2-60;
              $("#uploadinfo_listview").html('\<div style="height:'+($(window).height()-44-20)+'\px;padding-top:\
                        '+padTop+'\px;text-align:center;color:#808080;font-size:14px; margin: 10px 0;padding-left: 20px; padding-right: 20px;">\
                        Activities are coming soon.</div>').show();
              iScroll_allUploadInfo.allowGetMore = false;
              setTimeout(function() {
                  var $cornerAllgHeight = $(window).height()-44-20-50-10;
                  if(iScroll_allUploadInfo.myScroll){
                      iScroll_allUploadInfo.myScroll.refresh();
                  }
                  $pullUpEl.show();
                  $pullUpIcon.hide();
                  $pullUpLabel.text("");
                  $("#pullUp_allUploadInfo").hide();
                  $("#uploadinfo_listview").css("min-height",$cornerAllgHeight+"px");
                  disableClickEvent(false);
              }, 800);
          }, function(response){
             if (response.code != 0) {
                 var $pullUpEl = $("#wrapper_allUploadInfo").find("#pullUp_allUploadInfo"),
                     $pullUpLabel = $pullUpEl.find(".pullUpLabel"),
                     $pullUpIcon = $pullUpEl.find(".pullUpIcon");
                     var padTop = $(window).height()/2-60;
                     $("#uploadinfo_listview").html('\<div style="height:'+($(window).height()-44-20)+'\px;padding-top:\
                        '+padTop+'\px;text-align:center;color:#808080;font-size:14px; margin: 10px 0;padding-left: 20px; padding-right: 20px;">\
                        Activities are coming soon.</div>').show();
                     iScroll_allUploadInfo.allowGetMore = false;

                 setTimeout(function() {
                     var $cornerAllgHeight = $(window).height()-44-20-50-10;
                     if(iScroll_allUploadInfo.myScroll){
                         iScroll_allUploadInfo.myScroll.refresh();
                     }
                     $pullUpEl.show();
                     $pullUpIcon.hide();
                     $pullUpLabel.text("");
                     $("#pullUp_allUploadInfo").hide();
                     $("#uploadinfo_listview").css("min-height",$cornerAllgHeight+"px");
                     disableClickEvent(false);
                 }, 800);
             }
             else{
                    var fileList = response.data.fileList;
//                    var uploadInfos =  {"data":{
//                    "fileList":[
//                        {
//                            "id": 37,
//                            "img_video_path": "http://uploadmedia.oss-cn-shenzhen.aliyuncs.com/upload/image/20160511/1462935909079099412.jpg",
//                            "title": "123",
//                            "upload_time": 1462935909
//                        },
//                        {
//                            "id": 36,
//                            "img_video_path": "http://uploadmedia.oss-cn-shenzhen.aliyuncs.com/upload/image/20160511/1462935905791031386.jpg",
//                            "title": "123",
//                            "upload_time": 1462935908
//                        }
//                    ]}};
//                    var fileList = uploadInfos.data.fileList;
                    var fileListLength = fileList.length;
                    if (fileListLength > 0)  {
                        getUploadHtml(fileList);
                        currentPageNumer++;
                    }
                    var $pullUpEl = $("#wrapper_allUploadInfo").find("#pullUp_allUploadInfo"),
                        $pullUpLabel = $pullUpEl.find(".pullUpLabel"),
                        $pullUpIcon = $pullUpEl.find(".pullUpIcon");
                    if (fileListLength == 0) {
                        if(refresh){
                            var padTop = $(window).height()/2-60;
                            $("#uploadinfo_listview").html('\<div style="height:'+($(window).height()-44-20)+'\px;padding-top:\
                        '+padTop+'\px;text-align: center;color:#808080;font-size:14px; margin: 10px 0;padding-left: 20px; padding-right: 20px;">\
                        Activities are coming soon.</div>');
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
                            $("#pullUp_allUploadInfo").hide();
                        }
                        else{
                            $("#pullUp_allUploadInfo").show();
                            $cornerAllgHeight = $(window).height()-44-20;
                        }
            
                        if(refresh){
                            $("#uploadinfo_listview").show();
                        }
                        $("#uploadinfo_listview").css("min-height",$cornerAllgHeight+"px");
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

    // function getVideoImg(id,index){
    //   var video, output;
    //   var scale = 0.8;
    //   var initialize = function() {
    //     output = document.getElementById("output");
    //     video = document.getElementById("video");
    //     video.addEventListener('loadeddata',captureImage);
    //   }; 
    //   var captureImage = function() {
    //       var canvas = document.createElement("canvas");
    //       canvas.width = video.videoWidth * scale;
    //       canvas.height = video.videoHeight * scale;
    //       canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    //       var img = document.createElement("img");
    //       img.src = canvas.toDataURL("image/png");
    //       output.appendChild(img);
    //       if(index){ 
    //         $("#pullUp_allUploadInfo").show();
    // //        $("#uploadinfo_listview").listview("refresh");
    //         if (iScroll_allUploadInfo.myScroll == null) {
    //             iScroll_allUploadInfo.loaded("wrapper_allUploadInfo");
    //         }
    //       }
    //   }; 
    //   initialize();
    // }

    function getUploadHtml(uploadInfos){
        var uploadinfoArry = [];
        $.each(uploadInfos,function(index,uploadInfo){ 
           var uploadDate = new Date(uploadInfo.upload_time * 1000);
           var month = getMonthString(uploadDate.getMonth());
           var uploadTime = 'Upload at ' + pad(uploadDate.getHours(),2) + ':' + pad(uploadDate.getMinutes(),2) + ', ' + uploadDate.getDate() + " " + getMonthString(uploadDate.getMonth()) + " " + uploadDate.getFullYear();
           var typeFlag = uploadInfo.videoImgFlag;
           var typeHtml = '<img src="'+uploadInfo.img_video_path+'" style="width: 80px;height:80px;float: left;">';
           if(typeFlag == "video"){
                var u = navigator.userAgent, app = navigator.appVersion; 
                var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
                if(isAndroid){
                    typeHtml = '<div  class="videoimg" style="width: 80px;height:80px;float: left;border:1px solid #ccc;" videoPath="'+uploadInfo.img_video_path+'" uploadId="'+uploadInfo.id+'" id="videoimg_'+uploadInfo.id+'"></div>';
                }
                else{              
                    typeHtml = '<video style="width: 80px;height:80px;float: left;" controls="controls" preload="auto" id="video_'+uploadInfo.id+'"><source src="'+uploadInfo.img_video_path+'"></video> ';
                }
           }
           var uploadInfoHtml = '\<li data-role="none" style="margin:0;padding:10px;border-bottom:1px solid #E0E0E0;list-style:none;">'+typeHtml+'\
           <div style="min-height: 80px;margin-left: 96px;overflow: hidden;"><div style="font-size: 16px;margin-bottom: 5px;\
           color: #404040;">'+uploadInfo.title+'</div><div style="font-size: 14px;\
           color: #808080">'+uploadTime+'</div></div></li>';
           uploadinfoArry.push(uploadInfoHtml);
        });
        $("#uploadinfo_listview").append(uploadinfoArry.join("")); 
         $("#pullUp_allUploadInfo").show();
  //        $("#uploadinfo_listview").listview("refresh");
          if (iScroll_allUploadInfo.myScroll == null) {
              iScroll_allUploadInfo.loaded("wrapper_allUploadInfo");
          }
    } 
    $("#uploadinfo").off("click").on("click","div.close",function(){
        $("#uploadinfo .uploadPlayVideo").hide().empty();
    });
    $("#uploadinfo_listview").off("click").on("click","div.videoimg",function(){
        $("#uploadinfo .uploadPlayVideo").empty();
        $("#uploadinfo .uploadPlayVideo").show();
        var img_video_path = $(this).attr("videoPath");   
        $("#uploadinfo .uploadPlayVideo").css("height",$(window).height());    
        var margin = ($(window).height()-280 )/2;          
        $("#uploadinfo .uploadPlayVideo").html('<div class="close" style="position: absolute; right: 0;top:20px;z-index:9999999;"></div><video class="edui-upload-video  vjs-default-skin video-js" controls="" preload="none" width="100%" style="margin:0;height:100%;width: 100%;" src="'+img_video_path+'" data-setup="{}"><source src="'+img_video_path+'" type="video/mp4"></video></div>');
    }); 
 
    function vidplay(evt) {
        var video = $("#uploadinfo .uploadPlayVideo video");
        if (video.canPlayType) { 
            if (video.src == "") { 
              getVideo();
            }
            if (video.paused) {  
              video.play();
            } 
        }
    }
    $("#uploadinfo").on( "pagebeforeshow", function( event ) {
        window.setBodyOverflow($(document.body));
        $('#uploadinfo_content').css('height',($(window).height()-44)-20);
        initPageLoad("wrapper_allUploadInfo");
        $('#uploadinfo_listview li').remove();
        $('#uploadinfo_listview div').remove();
        $('#uploadinfo_listview').hide();
        $('#pullUp_allUploadInfo').show();
    /*$("#uploadinfo").on( "pageshow", function( event ) {
    });*/
        disableClickEvent(true);
        getUploadInfo(true);
        // window.historyView = [];
        /*splash.hidden(null, function(){
        }, function(){
        });*/
    });
    function initPageLoad(wrapper) {
        var $wrapper = $("#" + wrapper),
            $pullDownEl = $wrapper.find("#pullUp_allUploadInfo"),
            $pullDownLabel = $pullDownEl.find(".pullDownLabel");
        $wrapper.find(".scroller").css(window.getVendorStyle("transform"), "translate(0, 0)");
        $pullDownEl.attr("class", "loading");
        $pullDownLabel.text("Loading...");
        $("#pullUp_allUploadInfo").show();
    }
    function compatibility() {
        /* Logon */
        $('#uploadinfo_header_title').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#uploadinfo_header_title').css('postion', 'absulute')
            .css('width', '240px')
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
