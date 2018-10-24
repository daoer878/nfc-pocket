define(['jquery', 'jquerymobile', 'net', 'dialogs','panle'], function($, m, net, dia,panle) {
	
	var hotlineInfo;
	
	var htmlTemplate = "";
	
	$("#eInvoice_instruction").off('pagebeforeshow').
		on( "pagebeforeshow", function(event) {
			//根据是否是第一次登陆显示按钮
            $('#news_footer').hide();
            backBtnDisplay();
		});
		
	
	//设置内容高度是Header剩下的高度
    $("#eInvoice_instruction").off('pageshow')
        .on( "pageshow", function( event ) {
			$(this).find('#eInvoice-instruction-content').scrollTop(0);
            window.setBodyOverflow($(document.body));
            $('#eInvoice-instruction-content').css('height',($(window).height()-44-20-20));
            //$('#eInvoice-instruction-content-info').css('min-height',($(window).height()-44-20));
            // 兼容其他浏览器
            compatibility();
            // window.historyView = [];
        });
    
    
  //einvoice-introduction界面的back按钮
	$('#eInvoice_introduction_btn_menu, #eInvoice_introduction_btn_back').off('click').on('click', function() {
    	var fromPage = $("#eInvoice_instruction").attr('frompage');
    	if(fromPage == null || fromPage == undefined || fromPage == ""){
    		fromPage = 'eInvoice';
    	} else {
    		$("#eInvoice_instruction").removeAttr('frompage');
    	}
        $.mobile.backChangePage("#" + fromPage,{ transition: "slide",reverse: false,changeHash: false});

    });


	function backBtnDisplay(){
		chrome.storage.internal.get({"firstLogonFlag":''}, function(item){
			var firstLogonFlag = item.firstLogonFlag;
			if(firstLogonFlag == 'Y'){
				$("#eInvoice_introduction_btn_menu").css('display', 'none');
				$("#eInvoice_introduction_btn_back").css('display', 'none');
				$("#eInvoice-introduction-foot-btn").css('display', 'block');
			} else {
				$("#eInvoice_introduction_btn_menu").css('display', 'block');
				$("#eInvoice_introduction_btn_back").css('display', 'block');
				$("#eInvoice-introduction-foot-btn").remove();
			}
		});
	}
    

    function compatibility() {
        /* Logon */
        $('#title_eInvoice_instruction').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_eInvoice_instruction').css('postion', 'absulute')
            .css('width', '200px')
            .css('height','20px')
            .css('margin', '8px auto auto auto')
            .css('text-align', 'center');
    }
    
	
	
	
	$(document).ready(function(){
		setTimeout(function() {
            // 兼容其他浏览器
            compatibility();
        },1000);
	});

});