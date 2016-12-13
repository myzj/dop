define('widget/TSort', ['lib/common'], ['widget/webtoolkit.md5'], function ($,MD5) {

    //排序
    function Sort(source) {

        //声明变量
        var result,
            key;

        //定义数组
        var objectList = new Array();
        function Entity(n, v) {
            this.n = n;
            this.v = v;
        }
      
        ///遍历对象
        for (key in source) {
            //存在key 同时值不等于null
            if (source.hasOwnProperty(key) && source[key]!=null) {
                objectList.push(new Entity(key, source[key]));
            }
        }


        //按字母先后顺序排序
        objectList.sort(function (a) {
            return a.n
        });
        
        for (var i = 0; i <objectList.length; i++) {
            result += objectList[i].v;
        }
        //母婴之家KEY
        result += "MYZJLHTRegis";
        //加密后
        result = MD5.GETMD5(result);

        return result;

    };
    //返回
    return {
        Sort: Sort
       
    }




})