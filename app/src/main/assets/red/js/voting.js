/**
 * Created by Gino on 15-2-14.
 */

define(['jquery', 'jquerymobile', 'net', 'md5','dialogs','panle'], function($, m, net, md5, dia,panle) {
	var myScroll = null;
    $("#voting").on( "pagecreate", function() {
        $( "body > [data-role='panel']" ).panel();
        $( "body > [data-role='panel'] [data-role='listview']" ).listview();
    });
    $("#voting").off('pageshow').on( "pageshow", function( event ) {
        console.error("voting");
        window.setBodyOverflow($(document.body));
        $('#voting_content').css('height',($(window).height()-44-20));
		$('#voting_content > div:nth-child(1)').css('min-height',($(window).height()-61-4));

		for(var i = 0;i < $('.rrCheckbox,.rrRadio').length;i++){
			$('.rrCheckbox,.rrRadio').eq(i).attr('name',$('.rrCheckbox,.rrRadio').eq(i).attr('id').split('_')[1]);
		}

		// window.historyView = [];
            // 兼容其他浏览器
            compatibility();

        // Nick added for pull to refresh start
        window.shouldPageRefresh.newsroom = true; 
        // Nick added for pull to refresh end
    });
	$('#btn_voting_intro').on ('click', function(evt){
		net.post('voting/check', {
			votingId:1
        }, function(error){

        }, function(response){
			if(response.code == -1){
				$('#voting_intro').css('display', 'none');
				$('#voting_individuals').css('display', 'none');
				$('#voting_team').css('display', 'none');
				$('#voting_end').css('display', 'block');
			}else{
				$('#voting_intro').css('display', 'none');
				$('#voting_individuals').css('display', 'block');
				$('#voting_team').css('display', 'none');
				$('#voting_end').css('display', 'none');

				myScroll = window.scrollForAndroid('voting_content');
			}
		});

		/*$('#voting_intro').css('display', 'none');
		$('#voting_individuals').css('display', 'block');
		$('#voting_team').css('display', 'none');
		$('#voting_end').css('display', 'none');*/
	});

	$('#btn_voting_individuals').on ('click', function(evt){

		if(!checkIndividuals()){
			return;
		}

		$('#voting_intro').css('display', 'none');
        $('#voting_individuals').css('display', 'none');
		$('#voting_team').css('display', 'block');
		$('#voting_end').css('display', 'none');

		$('#voting_team')[0].scrollIntoView(true);

		if(myScroll){
			setTimeout(function(){
				myScroll.refresh();
			},800);
		}
	});

	$('#btn_voting_team').on ('click', function(evt){

		if(!checkTeams()){
			return;
		}

		var optionsId = [];
		var itemsId = [];
		var itemName = null;

		for(var i = 0;i < $('#voting_content .sel,#voting_content .selRadio').length;i++){
			itemName = $('#voting_content .sel,#voting_content .selRadio').eq(i).attr('name');

			if(itemName){
				optionsId.push(itemName);
				itemsId.push((itemName.match(/[a-zA-Z]+/))[0]);
			}
		}

		net.post('voting/join', {
            votingId:1,
			optionsId:optionsId.toString(),
			itemsId:itemsId.toString()
        }, function(error){
			$('#voting_intro').css('display', 'none');
			$('#voting_individuals').css('display', 'none');
			$('#voting_team').css('display', 'none');
			$('#voting_end').css('display', 'block');
        }, function(response){
			$('#voting_intro').css('display', 'none');
			$('#voting_individuals').css('display', 'none');
			$('#voting_team').css('display', 'none');
			$('#voting_end').css('display', 'block');
		});

		if(myScroll){
			setTimeout(function(){
				myScroll.refresh();
			},800);
		}
	});

	$('#btn_voting_end').on ('click', function(evt){
		resetVotingPage();
		initPageLoading("news_wrapper");
		$.mobile.newChangePage("#newsroom",{ transition: "slide",reverse: false,changeHash: false});
	});

	$('.rrCheckbox').parent().on ('click', function(evt){
		$(this).children('.rrCheckbox').toggleClass('sel');
	});

	$('#caringStar .rrRadio').parent().on ('click', function(evt){
		if($(this).children('.rrRadio').hasClass('selRadio')){

		}else{
			$('#caringStar .rrRadio').removeClass('selRadio');
			$(this).children('.rrRadio').addClass('selRadio');
		}
	});

	$('#diversity .rrRadio').parent().on ('click', function(evt){
		if($(this).children('.rrRadio').hasClass('selRadio')){

		}else{
			$('#diversity .rrRadio').removeClass('selRadio');
			$(this).children('.rrRadio').addClass('selRadio');
		}
	});

    function initPageLoading(wrapper) {
		var $wrapper = $("#" + wrapper),
		$pullDownEl = $wrapper.find("#pullDown"),
		$pullDownLabel = $pullDownEl.find(".pullDownLabel");

		if ($wrapper.find("ul").html()) {
		   $wrapper.find(".scroller").css(window.getVendorStyle("transform"), "translate(0, 0)");
		   $pullDownEl.attr("class", "loading");
		   $pullDownLabel.text("Loading...")
		}
    }

	function resetVotingPage(){
		$('#voting_content .sel').removeClass('sel');
		$('#voting_content .selRadio').removeClass('selRadio');
		$('#voting_content .warningText').hide();

		$('#voting_intro').css('display', 'block');
		$('#voting_individuals').css('display', 'none');
		$('#voting_team').css('display', 'none');
		$('#voting_end').css('display', 'none');

		if(myScroll){
			setTimeout(function(){
				myScroll.refresh();
			},800);
		}
	}

	function checkIndividuals(){
		if($('#brightestStar .sel').length != 2){$('#brightestStar .warningText').show();}else{$('#brightestStar .warningText').hide();}
		if($('#guidingStar .sel').length != 2){$('#guidingStar .warningText').show();}else{$('#guidingStar .warningText').hide();}
		if($('#prodSupportStar .sel').length != 2){$('#prodSupportStar .warningText').show();}else{$('#prodSupportStar .warningText').hide();}
		if($('#shine .sel').length != 3){$('#shine .warningText').show();}else{$('#shine .warningText').hide();}
		if($('#supportStar .sel').length != 2){$('#supportStar .warningText').show();}else{$('#supportStar .warningText').hide();}

		if(myScroll){
			setTimeout(function(){
				myScroll.refresh();
			},800);
		}

		return $('#voting_individuals .warningText:visible').length == 0 ? true : false;
	}

	function checkTeams(){
		if($('#allStar .sel').length != 3){$('#allStar .warningText').show();}else{$('#allStar .warningText').hide();}
		if($('#qualityStar .sel').length != 2){$('#qualityStar .warningText').show();}else{$('#qualityStar .warningText').hide();}
		if($('#caringStar .selRadio').length != 1){$('#caringStar .warningText').show();}else{$('#caringStar .warningText').hide();}
		if($('#diversity .selRadio').length != 1){$('#diversity .warningText').show();}else{$('#diversity .warningText').hide();}
		if($('#innovationStar .sel').length != 2){$('#innovationStar .warningText').show();}else{$('#innovationStar .warningText').hide();}
		if($('#synergy .sel').length != 2){$('#synergy .warningText').show();}else{$('#synergy .warningText').hide();}

		if(myScroll){
			setTimeout(function(){
				myScroll.refresh();
			},800);
		}

		return $('#voting_team .warningText:visible').length == 0 ? true : false;
	}

    function compatibility() {
        /* Logon */
        $('#title_voting').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_voting').css('postion', 'absulute')
            .css('width', '120px')
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


