define('widget/city',['lib/common','widget/selectOpt','widget/selectCss'], function($,selectOpt,selectCss) {

    var params={
        option_tv    : {text:'name',value:'name'},
        first        : "province",      // 第一个id
        city_object  : {
            "province":{
                id       : "province", // select的页面 id
                next_id  : "city",     // 关联的下一个select的id
                def      : "",         // 默认选中项
            },
            "city":{
                id       : "city",
                next_id  : "area",
                def      : ""
            },
            "area":{
                id       : "area",
                def      : ""
            }
        }
    }
    var city_object;
    //绑定地址信息
    function onCityList(CityList,param){
        var index,
            _param = $.extend({},params,param),
            _first = _param.city_object[_param.first];

        // 初始化select对象和z对象
        $.each(_param.city_object,function(k,v){
            v.select=new selectOpt.selectOpt(v.id);
            v.D_this=$('#'+v.id);
        });
        
        // 设置第一个数据
        _first.city_list=CityList;
        _first.select.removeAll(1);
        _first.select.addItems(_first.city_list,_param.option_tv);
        
        // 绑定事件;
        $.each(_param.city_object,function(k,v){
            v.D_this.on('change',function(){
                // 绑定样式选择
                selectCss.setCss(v.D_this);

                var inddex_s = v.D_this[0].selectedIndex-1;
                if(inddex_s!=-1){
                    v.on=v.city_list[inddex_s];
                }else{
                    v.on='';
                }
                if(v.next_id){
                    var _nsthis= _param.city_object[v.next_id];
        
                        //删除除第一个外数据
                        _nsthis.select.removeAll(1);
                       
                        //如果选中项不为第一个
                        if(inddex_s>=0){
                            _nsthis.city_list=v.on.child
                            _nsthis.select.addItems(_nsthis.city_list,_param.option_tv);
                        }
                        //触发下一个select的change事件
                        _nsthis.D_this.trigger('change');
                }
            });
        });

        // 循环触发事件
        $.each(_param.city_object,function(k,v){
             if(v.def){
                v.D_this.val(v.def)
                    .trigger('change');
            }
        });
        city_object=_param.city_object;
    }
    function getOnCity(){
        return $.extend(true,{},city_object);
    }


    return {
        onCityList   : onCityList,
        getOnCity    : getOnCity
    }
})