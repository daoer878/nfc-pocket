
require(['jquery', 'jquerymobile', 'net', 'dialogs','panle'], function($, m, net, dia,panle) {

	//einvoice-rule界面的back按钮
	$('#eInvoice_rule_btn_menu, #eInvoice_rule_btn_back').off('click').on('click', function() {
    	var fromPage = $("#eInvoice_rule").attr('frompage');
    	$("#eInvoice_rule").removeAttr('frompage');
        $("#eInvoice_rule").removeAttr('fromNative');
        $.mobile.backChangePage("#" + fromPage,{ transition: "slide",reverse: false,changeHash: false});

    });


    $('#eInvoice_rule_btn_upload').off('click').on('click', function(){
        $("#eInvoice_rule").removeAttr('fromNative');
        eInvoiceUploadPlugin.uploadInvoice(q['user'].userId, function(s){
                if(s == 'uploadSuccess'){
                        $.mobile.newChangePage("#eInvoice",{ transition: "slide",reverse: false,changeHash: false});
                } else if(s == 'eInvoice'){
                    $.mobile.backChangePage("#eInvoice",{ transition: "slide",reverse: false,changeHash: false});
                } else if(s == 'rule'){
                    $("#eInvoice_rule").attr('fromNative', 'true');
                    $.mobile.backChangePage("#eInvoice_rule",{ transition: "slide",reverse: false,changeHash: false});       
                } else {
                    $.mobile.newChangePage("#eInvoice",{ transition: "slide",reverse: false,changeHash: false});
                }
            },function(error){
                
        });
    });

	
	$("#eInvoice_rule").on( "pagebeforeshow", function( event ) {
        $('#news_footer').hide();
        window.shouldPageRefresh.newsroom = true; 
        $('#eInvoice_rule_content').css('height', ($(window).height()-44-20));  
        $('#eInvoice_rule_content_info').css('min-height', ($(window).height()-44));  
        // window.historyView = [];
        //showPdf();
        showButton();
    });


    function showButton(){
        var fromNative = $("#eInvoice_rule").attr('fromNative');
        if(fromNative == 'true'){
            $("#eInvoice_rule_btn_back").hide();
            $("#eInvoice_rule_btn_upload").show();
        } else {
            $("#eInvoice_rule_btn_back").show();
            $("#eInvoice_rule_btn_upload").hide();
        }
    }
	
    
    
    function compatibility() {
        /* Logon */
        $('#title_eInvoice_rule').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_eInvoice_rule').css('postion', 'absulute')
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
});

