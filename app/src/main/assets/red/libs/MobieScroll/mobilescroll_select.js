function initSelectList(id, dataSelect){
    var theme = "ios", mode = "scroller", display = "bottom", lang = "zh";   
    var stringOption = "";
    var select = $('#' + id).get(0);
    $('#' + id).html("");
    if(dataSelect.length == 0){
        var opt = document.createElement('option');
        opt.text = 'No data so far.';
        opt.value = '';
        select.add(opt, null);
    }
    for (var i=0;i<dataSelect.length;i++){  
        var obj = dataSelect[i];
        var opt = document.createElement('option');
            opt.text = obj.name;
            opt.value = obj.id;

            if(obj.flag){
                //stringOption += "<option flag="+obj.flag+"  value=" + obj.id + ">"+obj.name+"</option>";
                opt.setAttribute('flag', obj.flag);
            }
            else{
                //stringOption += "<option value=" + obj.id + ">"+obj.name+"</option>";
            }
        select.add(opt, null);
    }
    //var opt = document.createElement('option');
    //opt.text = '&lt;script&gt;alert(4);&lt;&#47;script&gt;';
    //
    //$("#" + id).get(0).add(opt, null);
    //$("#" + id).append(stringOption);
    var instance = mobiscroll.select("#" + id,{
        theme: theme, // Specify theme like: theme: 'ios' or omit setting to use default
        mode: mode, // Specify scroller mode like: mode: 'mixed' or omit setting to use default
        display: display, // Specify display mode like: display: 'bottom' or omit setting to use default
        lang: lang,
        rows: 4
    });
    $("#" + id).parent().click(function (){
        if($("#" + id+"_dummy").size() > 0){
            var select_dummy = $("#" + id+"_dummy").val() ;
            var selectVal = $("#" + id).val();
            instance.show();
            if(select_dummy == ""){
                $("#" + id+"_dummy").val("") ;
            }
            if(selectVal == ""){
                $("#" + id).val("");
            }
        }
        else{
            instance.destroy();
        }
    });  
    $("#" + id+"_dummy").val("").hide();
    $("#" + id).val(""); 
}