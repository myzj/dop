require(['lib/common', 'model/testModel/testModel', 'model/token'],
    function ($, testModel,modelToken) {

        var json = $.getCurrentLocation(function(json){
            //$("#getInfo").html(json.res)
            alert("a="+json.DoFlag);
        });

    }
);