define(['jquery', 'jquerymobile', 'net', 'dialogs','swiper','mustache','text','text!club_firstBanner','text!shop_detail','MeScroll'], function($, m, net, dialog,Swiper,mustache,text,category_name,shop_detail,MeScroll) {

    var Shop = {
            initEvents:function(){
            $("#shopDetailsPage-content").on('swiperight',function(){
                Shop.goBack('shopDetailsPage');
            });
            $("#ShopHome-content").on('swiperight',function(){
                Shop.goBack('ShopHome');
            });
            $("#ShopHome").on("pagebeforeshow",function(){
               //计算content的高度
               Shop.calcuPageHeight();
               //隐藏底部导航菜单
               Shop.hideNewsFooter();
               //加載商鋪列表
                Shop.getShopList();

              /* if(Shop.fromePage==true){

               }else{
                   return false;
               }*/
            });

           $("#shopDetailsPage").on("pagehide",function(){
               $("#shopDetailsPage-content").empty();
           })
           $("#ShopHome-content ").on("click",".shop-ul-li-other",function(e){
               var $this_index = $(this).attr("id");
               Shop.getShopDetailById($this_index);
           });
           $(".shopBack").on("click",function(){
               var $fromPage = ($(this).parent().parent().attr("id"));
               Shop.goBack($fromPage);
           });
           $("#shop-card").on("tap",function(){
               $.mobile.newChangePage("#electronic-signage",{transition:"slide",reverse: false,changeHash: false});
           });
           $("#card-pic").on("tap",function(){
               Shop.getIdcardPic();
           });
       },
       /**
        * Get Shop List Top 30 Items Sorted By Time
        *
        * @Param {String} param
        * @Returns {List<shop>}
        * @Author Linda
        * @Date 18/07/2017
        */
       getShopList:function(param){
           var commandParams = param || "";
           var listUrl = "shops/searchShopsByApp";
           net.post(listUrl,commandParams,function(error){
               console.error(error);
               MeScroll.endErr()
           },function(response){
               MeScroll.endSuccess();
               Shop.toRenderingShopList(response);

           })
       },
       /**
        * Get Shop Active Detail By shop_id
        *
        * @Param {String} shopId
        * @Returns {Shop}
        * @Author Linda
        * @Date 18/07/2017
        */
       getShopDetailById:function(shopId){
           $.mobile.newChangePage("#shopDetailsPage",{transition:"slide",reverse: false,changeHash: false});
          var detailUrl = "shops/findById";
          if(!shopId){
              dialog.alert('Tips','This Shop has not display there active details yet.',['OK'],function(){
                  return false;
              })
          }
          net.post(detailUrl,{"id":shopId},function (error) {
             console.log("Error:Get Detail Page Error."+error);
          },function(data){
              Shop.toShopDetailPage(data);
          })

       },
       initSwiper:function(){
           var mySwiper = new Swiper('#ShopHome-content .swiper-container', {
               pagination : '.swiper-pagination',//可选选项，自动滑动
               freeMode : false,
               touchMoveStopPropagation: true,
               followFinger: false,
               resistanceRatio: 0,
               observer: true,
               observeParents: true,
               onTap:function(swiper,event){
                   if($(event.target).hasClass('swiper-pagination-bullet')||$(event.target).hasClass('swiper-slide')||$(event.target).hasClass('shop-ul')||$(event.target).hasClass('swiper-pagination')){return false;}
                   if($(event.target).attr('id')){
                       Shop.getShopDetailById( $(event.target).attr('id') );
                   }else if($(event.target).parent(".shop-ul-li").attr("id")){
                       Shop.getShopDetailById( $(event.target).parent(".shop-ul-li").attr("id") );
                   }
               }
           });
       },
       toRenderingShopList:function(shopList){
          var html = '';
          if(!shopList){
              return false;
          }
          if(shopList.length < 1){
              var emptyHTML = "<div class='textEmpty'>There is no activity now.</div>";
              $('#redShops-list').html(emptyHTML);
              $('#waitting-page').hide();
              return false;
          }else{
              $.each(shopList.data , function (i, val) {
                  if (val.storeList.length >0) {
                      if(i==0){
                          html+='<div class="top-squre">'+ mustache.render(category_name,val);
                      }else{
                          html+= '<div class="squre-shop-other">'+ mustache.render(category_name,val);
                      }
                      if (val.storeList.length == 1 && val.storeList[0].length == 1) {
                          if (val.storeList[0][0].shopImage == null) {
                              val.storeList[0][0].shopImage = 'images/noimage.jpg';
                          }
                          if(val.storeList[0][0].subject.length>30){
                              val.storeList[0][0].subject = val.storeList[0][0].subject.slice(0,30)+'...';
                          }
                          html += '\<div class="shop-ul-other">\
                                    <div class="shop-ul-li-other" id=' + val.storeList[0][0].id + ' >\
                                        <img   src=" '+ val.storeList[0][0].shopImage + '" class="ShopHome-img"/>\
                                       <div class="shop-name-other">' + val.storeList[0][0].subject + '</div>'
                          if(val.storeList[0][0].remainingDay < 4)  {
                                html += '<div class="shop-other-dateLine">仅剩'+ val.storeList[0][0].remainingDay +'天</div>';
                          }
                          if(i ==shopList.data.length-1){html+='</div></div></div>'}else{
                              html+=  '</div>\
                                </div></div><div class="bundle-line"></div>';
                          }
                      } else {
                          html += '<div class="shop-ul swiper-container">\
                            <div class="swiper-wrapper">';
                          $.each(val.storeList, function (index, value) {
                              html += '<div class="swiper-slide">'
                              for (var j = 0; j < value.length; j++) {
                                  if (value[j].shopImage == null) {
                                      value[j].shopImage = 'images/noimage.jpg';
                                  }
                                  if(value[j].shopName.length>10){
                                      value[j].shopName = value[j].shopName.slice(0,10)+'...';
                                  }

                              html += '\<div class="shop-ul-li" id="' + value[j].id + '">\
                                                 <img src="' + value[j].shopImage + '" alt="" class="ShopHome-img" />\
                                                 <div class="shop-name-title">' + value[j].shopName + '</div>'
                               if(value[j].remainingDay < 4){
                                   /*  html+='<div class="triangle-topright"></div><div class="limmit-day"><div>仅剩</div><div>'+ value[j].remainingDay +'天</div></div>'*/
                                   html += '<div class="shop-dateLine">仅剩'+ value[j].remainingDay  +'天</div>';
                               }html+='</div>'; }
                              html += '</div>';
                          });
                              html += '</div>';
                          if (val.storeList.length > 1) {
                              html += '<div class="swiper-pagination"></div>'
                          }else{
                              html += '<div class="swiper-pagination" style="display: none"></div>'
                          }
                          if(i==shopList.data.length-1){
                              html+='</div></div>';
                          }else{
                              html += '</div></div><div class="bundle-line"></div>';
                          }
                      }
                  }
              });
              $('#redShops-list').html(html);
              $('#waitting-page').hide();
              Shop.initSwiper();
          }
       },
       toShopDetailPage:function(data){
           if(!data && data.length > 0){
               //forward to Detail Page and tip there are no messages yet.
               return false;
           }else{
               if(data.data.posterImage==null){
                   data.data.posterImage='images/noimage.jpg';
               }
               //展示详情
               //$('#shopDetailsPage-content').html(mustache.render(shop_detail, data));
               var html=``;
               html+=`<div class="shop-detail">
                            <div class="shop-poster">
                                <img src=${data.data.posterImage} alt="" class="ShopHome-img-detail"/>
                            </div>
                            <div class="shop-detail-info">
                                <p>${data.data.shopName}</p>
                                <div>${data.data.subject}</div>
                                <b>免责声明:该活动最终解释权归商家所有</b>
                                <div class="triangle"></div>
                            </div>
                    </div>`;
               $('#shopDetailsPage-content').html(html);
           }
       },
       /*kiki add the following function*/
       hideNewsFooter:function(){
           $("#news_footer").hide();
       },
       goBack:function($fromPage){
           if($fromPage =='ShopHome')
           $.mobile.newChangePage("#assistantHome",{transition:"slide",reverse: true,changeHash: false});
           if($fromPage =='shopDetailsPage'){
           //Shop.fromePage = false;
           $.mobile.newChangePage("#ShopHome",{transition:"slide",reverse: true,changeHash: false});
           }
           if($fromPage == 'electronic-signage'){
           $.mobile.newChangePage("#profile",{transition:"slide",reverse: true,changeHash: false});
           }
       },
       getIdcardPic:function(){
           iconUpload.iconNotes(
               function(data){
                   if(data){
                      console.log(data);
                   }
               },
               function(error) {

               });
       },
       calcuPageHeight:function(){
         $('#ShopHome-content,#shopDetailsPage-content,#shopFilterPage-content').css('height', ($(window).height() - 44 - 20));
       }
   }
    var  MeScroll = new MeScroll("ShopsList", {
        down: {
            callback: Shop.getShopList //下拉回调,此处可简写; 相当于 callback: function (page) { getListData(page);  }
        },
        up:{
            use:false
        }
    });
   Shop.initEvents();
   /*
   * export the via to let other Modules use it.
   * */
   return Shop;
});

