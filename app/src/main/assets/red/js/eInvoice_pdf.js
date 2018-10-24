/**
 * created by Neil on 17/02/20
 * 
 */
require(['jquery', 'jquerymobile', 'net', 'dialogs'], function($, m, net, dia) {


    $("#eInvoice_pdfShow").on( "pagebeforeshow", function( event ) {
        $('#news_footer').hide();
        $('#eInvoice-pdfShow-content').css('height', ($(window).height()-44-20));
        $('#eInvoice_pdfShow_content_info').css('min-height', ($(window).height()-44));

    });

    $("#eInvoice_pdfShow_btn_menu").on('click',function(){
        $.mobile.newChangePage("#uploadinvoice",{ transition: "slide",reverse: true,changeHash: false});
    });
	
	
	function compatibility() {
        /* Logon */
        $('#title_eInvoice_pdfShow').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_eInvoice_pdfShow').css('postion', 'absulute')
            .css('width', '230px')
            .css('height','20px')
            .css('margin', '8px auto auto auto')
            .css('text-align', 'center');
    }
	
	$(document).ready(function () {
        setTimeout(function() {
            // 兼容其他浏览器
            compatibility();
        },1000);
        
        
    });
	
	
	
});