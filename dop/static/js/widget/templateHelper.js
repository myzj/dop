/**
 * 常用模板助手模块
 */
define('widget/templateHelper', ['lib/common', 'widget/util'], function($, util) {
    return {
        helper: function () {
            // 时间戳格式化
            $.tpl.helper('dateFormat', function (date, format) {

                var str = util.dateFormat(date,format);
                return str;
            });
            //日期时间格式化：年-月-日 时:分:秒
            $.tpl.helper('dateTimeFormat', function(date, format){
                var _datetimeReg = /^(\d{4})(-|\/|\.)(\d{1,2})\2(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
                var dt = date.match(_datetimeReg);
                if(dt) {
                    var yyyy = dt[1];
                    var mth = parseInt(dt[3],10)-1;
                    var dd = dt[4];
                    var hh = dt[5];
                    var mm = dt[6];
                    var ss = dt[7];
                    var dobj = new Date(yyyy,mth,dd,hh,mm,ss);
                    var _time = dobj.getTime();
                    return util.dateFormat(_time, format);
                }
                return '';
            });

            /**
             * 返回时间格式如：yyyy/mm/dd
             * 传入的格式可以是：yyyy/mm/dd hh:mm:ss || yyyy-mm-dd hh:mm:ss || yyyy/mm/dd || yyyy-mm-dd等等
             * TODO
             */
            $.tpl.helper("dateYMDFormat", function(date, format){

                var _date = date || "",
                    _format = format || "";
                return _date.split(" ")[0].replace(/[\.\-\\]/g,"/");

            });

            /**
             * 转换各种类型券为中文
             */
            $.tpl.helper("pointKind", function(date){

                var _date = date || "",
                    _kind = "";
                switch(_date){
                    case "point":
                        _kind = "抵用券";
                        break;
                    case "voucher":
                        _kind = "优惠券";
                        break;
                    case "bonus":
                        _kind = "购物金";
                        break;
                }
                return _kind;

            })

            /**
             * 价格格式化
             * format   0:舍弃小数尾数0     -1：强制取整     整数：小数位数
             */
            $.tpl.helper('priceFormat', function (price, format) {

                var format = format || 0;
                var price = price || 0;

                if(format == 0) {
                    price = parseFloat(price);
                } else if(format == -1) {
                    price = parseInt(price);
                } else {
                    price = parseFloat(price).toFixed(format);
                }
                return price;

            });

            /**
             * 价格取整数部分和小数部分
             * @param {String} price 价格
             * @param {Int} format 1: 取整数部分，2: 取小数部分
             * @returns {String} 整数部分或者小数部分
             */
            $.tpl.helper("intDecimalPrice", function(price, format){

                var price = price || "0.00",
                    format = format || 1,
                    decimal = "";
                switch(format){
                    case 1:
                        return (price | 0);
                        break;
                    case 2:
                        decimal = price.split(".")[1];
                        decimal = decimal === undefined ? "00" : (decimal.length == 1 ? decimal + "0" : decimal);
                        return decimal;
                        break;
                }

            });

            //循环从1到num的option字串 : {{#num | forNumOpt: ''}}
            $.tpl.helper('forNumOpt', function (num) {
                var value = '';
                num = parseInt(num, 10);
                for(var i=1; i<=num;i++) {
                    value += '<option value="'+i+'">'+i+'</option>';
                }
                return value;
            });

        }
    }
});