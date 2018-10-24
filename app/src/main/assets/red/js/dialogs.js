/**
 * Created by steve on 14-9-27.
 */
/**
 * 对话框
 */
define(['jquery'], function($) {

    /**
     * UI Root
     * @type {object}
     */
    var ui_main = null;

    /**
     * 高度
     * @type {number}
     */
    var height = -1;
    var exist = false;

    /**
     * 返回控件HTML
     * @param title 标题
     * @param message 提示信息
     * @param buttons 按钮数组，可以有多个按钮 例如:['Ok', 'Cancel']
     * @returns {string} 控件HTML
     * @private
     */
    function _template(title, message, buttons,btnInverse) {
        var html_buttons = '';
        var idte = 'dialogs_alert_button_' + new Date().getTime().toString() + '_'  + (parseInt(10000 * Math.random()));
        var ids =[];
        $.each(buttons, function(index, value) {
            var id_s = idte + (parseInt(10000 * Math.random()));
            html_buttons += _templateButton(value,id_s,index,buttons.length,btnInverse);
            ids.push(id_s);
        });
        return ['\
        \<div id="errorAlert" alt="整个屏幕的大背景" style="position: fixed; left: 0; top: 0;\
        width: 100%; height: 100%;z-index:10002;\
        background-color: rgba(0, 0, 0, 0.5);">\
            <div alt="垂直居中div" style="display:table; width:100%; height:100%;">\
                <div style="vertical-align:middle; display:table-cell; text-align:center; _position:absolute; _top:50%; _left:50%;">\
                    <div style="display:inline-block; _position:relative; _top:-50%; _left:-50%;">\
                        <div alt="Alert框" style="width: 280px; height: auto;overflow:auto;\
                        background-color: #ffffff;\
                        border: none;">\
                            <div alt="标题" style="padding: 10px 0;\
                            font-family: Arial; font-size:12px; color:404040; font-weight: bold; text-align: center;height: 35px;">\
                            ' + title + '\
                            \</div>\
                            <div alt="分割线" style="border-bottom: solid 1px #f26647">\
                            </div>\
                            <div alt="信息" style="padding-top: 20px; margin: auto 20px;\
                            font-family: Arial; font-size:12px; color: #404040; line-height: 15px; text-align:left;">\
                            ' + message + '\
                            \</div>\
                            <div>\
                                <div alt="按钮组" style="height: auto;\
                                    margin: 20px;overflow: hidden">\
                                    ' + html_buttons + '\
                                \</div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>',ids];
    }

    /**
     * 返回按钮HTML
     * @param title 按钮标题
     * @returns {string} 按钮HTML
     * @private
     */
    function _templateButton (title, id,index,length,btnInverse) {
        var css1 =" background-color: #f26647; color: #ffffff;";
        var css2 = " color: #f26647;  background-color: #fff; border:1px solid #f26647;";
        if(!btnInverse){
            btnInverse = {};
        }
        if(btnInverse.btnInverse){
            css1 = " color: #f26647;  background-color: #fff; border:1px solid #f26647;";
            css2 =" background-color: #f26647; color: #ffffff;";
        }
        if(length  == 1){
            return '\<a id="' + id + '" href="javascript:void(0);" style="height:28px; min-width:80px; \
                                margin: auto; padding: 5px 30px;display: inline-block;\
                                font-family: Arial; font-size:14px; text-decoration: none;\
                                '+css1+'"\> \
                            ' + title + '\
                            \</a>';
        }
        else{
            if(index == 0){
                return '\<a id="' + id + '" href="javascript:void(0);" style="height: 28px; width: 45%; margin: 0 5% 0 0;\
                                float: left; line-height: 28px;\
                                font-family: Arial; font-size:14px; text-decoration: none;\
                        '+css2+'"\> \
                    ' + title + '\
                    \</a>';
            }
            else{
                return '\<a id="' + id + '" href="javascript:void(0);" style="height: 28px; width:45%; margin: 0 0 0 5%;\
                                float: left; line-height: 28px;\
                                font-family: Arial; font-size:14px; text-decoration: none;\
                                '+css1+'"\> \
                            ' + title + '\
                            \</a>';
            }
        }
    }

//    $(document).ready(function() {
//        height = $(window).height();
//    });

    /**
     * 断言类型
     * @param v 变量
     * @param type 类型
     * @param errorMessage 错误信息
     * @returns {boolean} 断言成功失败
     */
    function assertType(v, type, errorMessage) {
        if (v == null)
            throw new Error(errorMessage);

        if (!(v.constructor+'').match(type))
            throw new Error(errorMessage);
    }

    return {
        alert : function(title, message, buttons, onSelect,btnInverse) {
            assertType(title, /String/, 'title 类型 应该是 String');
            assertType(message, /String/, 'message 类型 应该是 String');
            assertType(buttons, /Array/, 'buttons 类型 应该是 Array');
            assertType(onSelect, /Function/, 'onSelect 类型 应该是 Function');
            $(".ui-panel-wrapper").addClass("wrapperpanleremove").removeClass("ui-panel-wrapper");
            if($("#errorAlert:visible").size() > 0 || exist == true){
                if(exist == true){
                    exist = false;
                }
                return false;
            }
            exist = true;
            $(document).ready(function() {
                setTimeout(function(){
                    var template = _template(title, message, buttons,btnInverse);
                    ui_main = $(template[0]).appendTo(document.body);
                    var ids = template[1];
                    $.each(ids,function(index){
                        $('#' + ids[index]).off('touchend')
                            .on('touchend', {main: ui_main}, function (evt) {
                                evt.preventDefault();
                                $(this).off('touchend');
                                $(evt.data.main).remove();
                                exist = false;
                                if($("#errorAlert:visible").size() < 1) {
                                    $(".wrapperpanleremove").addClass("ui-panel-wrapper").removeClass("wrapperpanleremove");
                                }
                                onSelect($.trim($(this).text()));
                            });
                    });
                }, 500);
            });
        }
    }
});