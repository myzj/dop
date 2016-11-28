define('widget/orderHelper', function() {
        //定单传个各个页面的参数
        var paramA = ['addr','store', 'store_search', 'point','card','pay','invoice','ci', 'order_flag', 'supportStore', 'defaultStoreInfo'];


        function paramAstr() {
            return paramA.join(',');
        }


        return {
            paramA : paramA,
            paramAstr: paramAstr,
            paramJoin : function(a, ignore) { // 仅忽略一个参数的情况
                var ignore = ignore || '';
                var a = a || 'a';
                // 拼接参数，传递给其它页面
                //var paramStr = a + '='+encodeURIComponent(paramAstr());
                var paramStr = a + '='+paramAstr();
                for(var i in paramA) {
                    if(ignore && ignore == paramA[i]) {
                        continue;
                    }
                    var _pa = $.url.getParam(paramA[i]) || '';
                    //paramStr += '&' + paramA[i] + '=' + encodeURIComponent(_pa);
                    paramStr += '&' + paramA[i] + '=' + _pa;
                }
                return paramStr;

            },
            initPara:function(a) {
                var a = a || 'a';
                // 拼接参数，传递给其它页面
                //var paramStr = a + '='+encodeURIComponent(paramAstr());
                var obj = {};
                obj[a] = paramAstr();
                for(var i in paramA) {
                    var _pa = $.url.getParam(paramA[i]) || '';
                    //obj[paramA[i]] =  encodeURIComponent(_pa);
                    obj[paramA[i]] =  _pa;
                }
                return obj;
            }



        }


    }
);