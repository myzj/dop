define("widget/verifySpechars", function(){

    /**
     * 判断是否有特殊字符
     * @param {String} obj 传入的Object参数，格式如：
     * @param {String} str 输入字符
     * @param {String} errId 显示错误信息标签的Id
     * @param {String} nameStr 错误信息的名称
     * @param {Boolean} validateFlag 验证标识
     */
    function _filterSpechars(obj){

        var _obj = obj || {},
            _validateFlag = true;
        _obj.str = _obj.str || "";
        _obj.nameStr = _obj.nameStr || "";
        _obj.str.replace(/([^\u4E00-\u9FFF_0-9a-zA-Z-#\.\·])+/,function(i, t){
            if(i){
                if(_obj.errId){
                    $("#" + _obj.errId).text(_obj.nameStr + "不允许输入特殊字符" + t);
                }
                _validateFlag = false;
            }
        });
        return _validateFlag;

    }

    /**
     * 特殊字符提示错误
     * @param {String} obj 传入的Object参数，格式如：
     * @param {String} str 输入字符
     * @param {String} errId 显示错误信息标签的Id
     * @param {String} nameStr 错误信息的名称
     * @param {Boolean} validateFlag 验证标识
     */

    function _verifySpechars(_obj, callback){

        var _flag = _filterSpechars(_obj);
        callback && callback(_flag);

    }

    return {
        filterSpechars: _filterSpechars,
        verifySpechars: _verifySpechars
    }

});
