define(['jquery', 'jquerymobile', 'net', 'dialogs','panle'], function($, m, net, dia,panle) {
	
	var hotlineInfo = {
        "h_001"		:	{
            "team"		:	"General Admin",
            "telNo"		:	"718630-88888",
            "lotusNote"	:	"General Administration China GLT"
        },
        "h_002"		:	{
            "team"		:	"Facility Admin",
            "telNo"		:	"718630-88712",
            "lotusNote"	:	"Facility Administration China GLT"
        },
        "h_003"		:	{
            "team"		:	"Technology Support",
            "telNo"		:	"718630-89999",
            "lotusNote"	:	"System Administration China GLT"
        },
        "h_004"		:	{
            "team"		:	"Capacity & Resources Plan",
            "telNo"		:	"718630-85864",
            "lotusNote"	:	"Capacity And Resources Plan HSDC"
        },
        "h_005"		:	{
            "team"		:	"Security Fraud & Risk",
            "telNo"		:	"718630-89002/ +86 20 3858 0101 (24hrs)",
            "lotusNote"	:	"Security Service China GLT"
        },
        "h_006"		:	{
            "team"		:	"Travel Desk",
            "telNo"		:	"718630-88689",
            "lotusNote"	:	"Travel Desk HSDC"
        },
        "h_007"		:	{
            "team"		:	"JLL Support",
            "telNo"		:	"718620-83338/ +86 20 3858 3338 (24hrs)",
            "lotusNote"	:	"JLL HelpdeskTKH HDPG"
        },
        "h_008"		:	{
            "team"		:	"HR Direct HelpDesk",
            "telNo"		:	"718630-40029",
            "lotusNote"	:	"N/A"
        }
	};
	
	var htmlTemplate = "";

    $("#hotlines").on( "pagecreate", function() {
        $( "body > [data-role='panel']" ).panel();
        $( "body > [data-role='panel'] [data-role='listview']" ).listview();
    });

	//设置内容高度是Header剩下的高度
    $("#hotlines").on( "pagebeforeshow", function( event ) {
        	$('#news_footer').hide();
        	window.setBodyOverflow($(document.body));
        	$('#hotlines-content').css('height',($(window).height()-44-20));
            $('#hotlines-content-info').css('min-height',($(window).height()-44));
            // $('#hotline_show').css('min-height',($(window).height()-44));
            // window.historyView = [];
            // 兼容其他浏览器
        });
    	


    $('#hotline-btn-menu').off('click')
        .on('click', function() {
            $.mobile.backChangePage("#hotlines",{ transition: "slide",reverse: true,changeHash: false});
        });
    

    function compatibility() {
        /* Logon */
        $('#title_hotline').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_hotline').css('postion', 'absulute')
            .css('width', '120px')
            .css('height','20px')
            .css('margin', '8px auto auto auto')
            .css('text-align', 'center');
    }

	
    
    
    //动态生成列表
	function fillHotlineList(){
		if($("#hotline_show").children().length > 0){
			null;
		} else {
			$.each(hotlineInfo, function(index, val){
				htmlTemplate += '<div style="height:10px;width:100%;background-color:#e4e4e4">&nbsp;</div>' +
					            '<div style="margin:0px;border-radius: 0px;list-style-type:none" data-role="listview">' +                 
					                    '<div style="font-size: 16px;margin:0px 10px;padding-top:10px;word-wrap: break-word;line-height:20px;">' + val.team + '</div>' +
					                    '<hr style="border:0;background-color:#e4e4e4;height:1px;width:100%;margin:10px 0 0 0;"/>' +
					                    '<div style="white-space: normal;font-weight: normal;line-height: 1.5;font-size: 14px;font-family: Arial;padding: 15px 0px;">' +
					                        '<div style="float:left;height:50px;width:60px;">' +
					                            '<div style="margin-left:10px;" class="hot1"></div>' +
					                        '</div>' +
					                        '<div>' +
				                            	'<div style="color:#999999">Tel No.</div>' +
				                            	'<div>' + val.telNo + '</div>' +
					                        '</div>' +
					                        '<hr style="margin: 15px;border:0;background-color:#e4e4e4;height:1px;"/>' +
					                        '<div style="float:left;width:60px;">' +
					                           '<div style="margin-left:10px;"class="hot2"></div>' +
					                        '</div>' +
					                        '<div>' +
				                            	'<div style="color:#999999">Email</div>' +
				                            	'<div>' + val.lotusNote + '</div>' +
					                        '</div>' +
					                    '</div>' +
					            '</div>';
			});
			$("#hotline_show").html(htmlTemplate);
		}
		
		
	}
	
	
	
	$(document).ready(function(){
        fillHotlineList();
		setTimeout(function() {
            // 兼容其他浏览器
            compatibility();
        },1000);
	});

});