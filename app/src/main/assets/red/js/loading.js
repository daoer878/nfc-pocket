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
     * 返回控件HTML
     * @param title 标题
     * @param message 提示信息
     * @param buttons 按钮数组，可以有多个按钮 例如:['Ok', 'Cancel']
     * @returns {string} 控件HTML
     * @private
     */
    function _template(title, message, buttons) {
        var html_buttons = '';
        $.each(buttons, function(index, value) {
            html_buttons += _templateButton(value);
        });
        return '\
        \<div alt="整个屏幕的大背景" style="position: fixed; left: 0; top: 0;\
        width: 100%; height: 100%;\
        background-color: rgba(0, 0, 0, 0.5);">\
            <div alt="垂直居中div" style="display: -webkit-flex; display: flex;\
            height: 100%;">\
                <div alt="Alert框" style="width: 280px; height: auto; min-height: 180px;\
                margin: auto;\
                background-color: #ffffff;\
                border: none;">\
                    <div alt="标题" style="padding: 10px 0;\
                    font-family: Arial; font-size:12px; color:404040; font-weight: bold; text-align: center;">\
                    ' + title + '\
                    \</div>\
                    <div alt="分割线" style="border-bottom: solid 1px #f26647">\
                    </div>\
                    <div alt="信息" style="padding-top: 20px; margin: auto 20px;\
                    font-family: Arial; font-size:12px; color: #404040; line-height: 25px;">\
                    ' + message + '\
                    \</div>\
                    <div alt="按钮组" style="display: -webkit-flex; display: flex;\
                        height: auto;\
                        margin: 20px auto;">\
                        ' + html_buttons + '\
                    \</div>\
                </div>\
            </div>\
        </div>';
    }

    /**
     * 返回按钮HTML
     * @param title 按钮标题
     * @returns {string} 按钮HTML
     * @private
     */
    function _templateButton (title) {
        return '\<a href="javascript:void(0);" name="dialogs_alert_button" style="height:28px; min-width:80px; \
                    margin: auto; padding: 5px 30px;\
                    background-color: #f26647;\
                    font-family: Arial; font-size:14px; color: #ffffff; text-decoration: none;">\
                ' + title + '\
                \</a>';
    }

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
        alert : function(title, message, buttons, onSelect) {
            assertType(title, /String/, 'title 类型 应该是 String');
            assertType(message, /String/, 'message 类型 应该是 String');
            assertType(buttons, /Array/, 'buttons 类型 应该是 Array');
            assertType(onSelect, /Function/, 'onSelect 类型 应该是 Function');

            $(document).ready(function() {
                ui_main = $(_template(title, message, buttons)).appendTo(document.body);
                $('a[name="dialogs_alert_button"]').unbind().bind().click(function() {
                    $(this).unbind();
                    onSelect($.trim($(this).text()));
                    $(ui_main).remove();
                });
            });

        }
    }
});