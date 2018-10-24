// /**
//  * Created by kiki on 2017/4/14.
//  */
// define(['jquery', 'jquerymobile', 'net', 'EvenRegister'], function($, m, net, EvenRegister) {
//
//     var pageEvent = {
//
//       /**
//       * 当前页面显示前
//       */
//       pageBeforeShow: function() {
//         pageEvent.calcuPageHeight();
//         pageEvent.hideNewsFooter();
//       },
//
//       /**
//       * header back button click事件
//       */
//       pageBackBtnClick: function(e) {
//         $.mobile.newChangePage("#assistantHome",{ transition: "slide",reverse: true,changeHash: false});
//       },
//
//       /**
//       * content swiperright 事件
//       */
//       contentSwiperRight: function() {
//         $.mobile.backChangePage("#assistantHome",{ transition: "slide",reverse: true,changeHash: false});
//       },
//
//       /**
//        * 计算content 高度
//        */
//       calcuPageHeight : function() {
//         $('#artificial_content').css('height', ($(window).height() - 44 - 20 - 10 - 10 - 20));
//         $('#artificial_content_info').css('height', ($(window).height() - 44 - 20 - 20));
//       },
//
//       /**
//        * 隐藏Footer
//        */
//       hideNewsFooter: function() {
//         $("#news_footer").hide();
//       },
//
//       /**
//       * 有新的回复消息时，展示消息页面滑动
//       */
//       scrollContent: function() {
//         var speak_height = $('.speak_box').height()+20;
//         $('.speak_box,.speak_window').animate({scrollTop: speak_height}, 500);
//       },
//
//       /**
//       * 光标聚焦在Input Field，自动弹出键盘
//       */
//       focusOnInput: function() {
//         $('#artificial_keyup').focus();
//       },
//
//       /**
//       * 消息内容宽度计算
//       */
//       autoWidth: function() {
//         $('.question_text,.answer_text').css('max-width', $('.question').width() - 82);
//       },
//
//       /**
//       * 获取用户图片
//       * @return {String} 返回用户photo的地址
//       */
//       getUerImg: function() {
//         return localStorage.getItem('login_user_photo')== "" ? "images/userDefault.png": localStorage.getItem('login_user_photo');
//       },
//
//       /**
//       * 显示发送者的消息内容
//       * @params {String} user_photo,用户图片链接
//       * @params {String} text，发送者发送的消息内容
//       */
//       showSenderMsg: function(user_photo, text) {
//         var str = '<div class="question">'
//                   + '<div class="heard_img right"><img src=' + user_photo +' /></div>'
//                   + '<div class="question_text clear"><p>' + text + '</p><i></i>'
//                   + '</div></div>';
//           $('.speak_box').append(str);
//       },
//
//       /**
//       * 发送消息到机器人，获取机器人答复
//       */
//       recieveMessage: function() {
//         var user_photo = pageEvent.getUerImg();
//         var text = $('#artificial_keyup').val();
//         if (text === '' || text === ' ') {
//             pageEvent.focusOnInput();
//         } else {
//             pageEvent.showSenderMsg(user_photo, text);
//             $('#artificial_keyup').val('');
//             pageEvent.focusOnInput();
//             pageEvent.autoWidth();
//             pageEvent.scrollContent();
//             var requestConfig = {
//               domainType: 'AI'
//             };
//             var postData = {
//               "message":text,
//               "user":q['user'].userId
//             };
//             net.post('ichat/chat/recieveMessage', postData, pageEvent.recieveMsgfail,
//               pageEvent.recieveMsgCallback, null, requestConfig);
//         }
//       },
//
//       /**
//       * 请求失败处理
//       */
//       recieveMsgfail: function(error) {
//         //TODO...
//       },
//
//       /**
//       * 请求成功处理
//       */
//       recieveMsgCallback: function(response) {
//         setTimeout(function () {
//             var ans = '<div class="answer"><div class="heard_img left"><img src="footer_images/image/icon-help-desk.png"/></div>';
//             ans += '<div class="answer_text"><p>' + response.message + '</p><i></i>';
//             ans += '</div></div>';
//             $('.speak_box').append(ans);
//             pageEvent.scrollContent();
//         }, 300);
//       }
//     }
//
//     EvenRegister.addListener("#artificial_keyup", "click", pageEvent.scrollContent);
//     EvenRegister.addListener("#artificialPage_send_btn", "click", pageEvent.recieveMessage);
//     EvenRegister.addListener("#artificialPage_back_btn", "click", pageEvent.pageBackBtnClick);
//     EvenRegister.addListener("#artificial-content", "swiperight", pageEvent.contentSwiperRight);
//     EvenRegister.addListener("#artificial_page", "pagebeforeshow", pageEvent.pageBeforeShow);
//
//     $(document).ready(
//         function () {
//           pageEvent.focusOnInput();
//           pageEvent.scrollContent();
//         }
//     );
// });
