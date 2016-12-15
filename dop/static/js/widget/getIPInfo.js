define("widget/getIPInfo", ["lib/common"], function ($) {
   
        //获得ip
        function getIp()
        {
            var url = 'http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_=' + Math.random();
            $.getJSON(url, function (data) {
                return data.Ip;
            });
        }

    return {
        getIp: getIp

    }
})




