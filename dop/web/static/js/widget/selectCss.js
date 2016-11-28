define('widget/selectCss',['lib/common'], function($) {

     var params={
        css1:"c3c",
        css2:"c9c",
        index:1
     }
     /**
     * 设置 变量 params
     * @params css1 css2
     * shaokr
     */
     function setParam(param){
        $.extend(params,param);
     }
     /**
     * 在data-selectCss的标签上绑定change事件，（事件委派）
     * @param css1 css2
     * shaokr
     */
     function onCss(css1,css2){
        $('[data-selectCss]').on('change.selectCss','select',function(){
           setCss($(this),css1,css2)
        });
    }
    /**
     * 设置样式
     * @param 
     *      D_this : $(select)元素
     *      css1   : 选取项大于param.index时使用的样式名
     *      css2   : 选取项小于param.index时使用的样式名
     * shaokr
     */
    function setCss(D_this,css1,css2){
        css1=D_this.data('css1') || css1 || params.css1;
        css2=D_this.data('css2') || css2 || params.css2;
        _index=D_this[0].selectedIndex;
        if(_index>=params.index){
            D_this.removeClass(css2).addClass(css1);
        }else{
            D_this.removeClass(css1).addClass(css2);
        }
    }

    return {
        setParam : setParam,
        onCss    : onCss,
        setCss   : setCss
    }
})