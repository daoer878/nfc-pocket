
require(['jquery', 'jquerymobile', 'net', 'dialogs','panle'], function($, m, net, dia,panle) {
	//点击进入invoice上传记录页面
	$('#upload_invoices').off('click').on('click',function(evt){
        $("#uploadinvoice").attr("frompage","eInvoice");
        $.mobile.newChangePage("#uploadinvoice",{ transition: "slide",reverse: false,changeHash: false});
    });
	
	//点击进入rules界面
	$('#eInvoice_rules').off('click').on('click',function(evt){
        $("#eInvoice_rule").attr("frompage","eInvoice");
        $.mobile.newChangePage("#eInvoice_rule",{ transition: "slide",reverse: false,changeHash: false});
    });
    //点击返回AssistantHome界面
    /*$('#eInvoice-back').off('click').on('click',function(evt){
        $.mobile.newChangePage("#assistantHome",{ transition: "slide",reverse: true,changeHash: false});
    });*/
	
	
	//点击进入introduction界面
	$('#eInvoice_instruction_btn').off('click').on('click',function(evt){
        $("#eInvoice_instruction").attr("frompage","eInvoice");
        $.mobile.newChangePage("#eInvoice_instruction",{ transition: "slide",reverse: false,changeHash: false});
    });
	

	
    $("#eInvoice").on( "pagecreate", function() {
        $( "body > [data-role='panel']" ).panel();
        $( "body > [data-role='panel'] [data-role='listview']" ).listview();
        
    });
    //changePassword页面 设置内容高度是Header剩下的高度
    $("#eInvoice").on( "pagebeforeshow", function( event ) {
        $('#news_footer').hide();
        window.shouldPageRefresh.newsroom = true; 
        $('#eInvoice_content').css('height', ($(window).height()-44-20));  
        $('#eInvoice_content_info').css('min-height', ($(window).height()-44));  
        // window.historyView = [];
        //showPdf();
    });  
    
//    function showPdf(){
//    	global.PDFJS.workerSrc = '../www/libs/pdf/worker_loader.js';
//
//    	  // Fetch the PDF document from the URL using promises.
//    	  api.getDocument('http://demoappdownload.oss-cn-hangzhou.aliyuncs.com/upload/einvoice/20161226/123456_Doa.pdf').then(function (pdf) {
//    	    // Fetch the page.
//    	    pdf.getPage(1).then(function (page) {
//    	      var scale = 1.5;
//    	      var viewport = page.getViewport(scale);
//
//    	      // Prepare canvas using PDF page dimensions.
//    	      var canvas = document.getElementById('the-canvas');
//    	      var context = canvas.getContext('2d');
//    	      canvas.height = viewport.height;
//    	      canvas.width = viewport.width;
//
//    	      // Render PDF page into canvas context.
//    	      var renderContext = {
//    	        canvasContext: context,
//    	        viewport: viewport
//    	      };
//    	      page.render(renderContext);
//    	    });
//    	  });
//	}
    
    
    function compatibility() {
        /* Logon */
        $('#title_eInvoice').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_eInvoice').css('postion', 'absulute')
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

