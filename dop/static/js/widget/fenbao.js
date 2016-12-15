define('widget/fenbao',['lib/common'], function($) {

    /**
     * 拼接分包唯一key
     * @param obj
     * @returns {boolean} = {h5type:0, fdl_seq:fdl_seq值商品出貨者, freight_number:freight_number值运费id号} 其中h5type表示分包方案，默认0
     */
    function fenbaoKey(obj){
       var _h5Type = obj.h5type || 0;
        var _k = '0';
        if(_h5Type == '0') {
           _k = obj.fdl_seq + '_' + obj.freight_number;
       } else {
           //todo

       }
        return _k;
    }
    /**
     * 处理购物车中的分包，会创建一个为fenbao的对象
     * @body obj 购物车查询成功后body的数据
     */
    function renderCartData(body){

        var i,
            _St,
            _key,
            _length = body.shopcartList.length,
            _i = 1,  // 包裹
            dataSt = {}; // 分包数据

        for (i = 0; i <_length; i++) {
            _St  = body.shopcartList[i];
            _key = fenbaoKey(_St.main); // 获取key
            if(dataSt[_key]){
                // 判断是否已经存在key对象
                dataSt[_key].list.push(_St)
            }
            else{
                dataSt[_key]={
                    i                : _i++,
                    ds_name          : _St.main.ds_name,
                    deliver_deadline : _St.main.deliver_deadline,
                    ds_desc : _St.main.ds_desc,
                    list             : [_St],
                    is_pre_ord: _St.main.is_pre_ord,
                    ref_etd_dt: _St.main.ref_etd_dt
                };
            }
        };
        body.packages=dataSt;
        body.shippingFee=body.price_show;
        return body;
    }

    return {
        fenbaoKey   : fenbaoKey,
        renderCartData: renderCartData
    }
})