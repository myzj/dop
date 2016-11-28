define('model/activity/lottery/lotteryModel', ['lib/common', 'api/activity/lottery/lotteryApi'],
    function ($, lotteryApi) {
        function LuckDraw(dataInfo, callback) {
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(lotteryApi.LuckDraw, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    //TODO handle the exception
                    throw e;
                }
            });
        };
        function GetUserDrawCountReq(dataInfo, callback) {
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(lotteryApi.GetUserDrawCountReq, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    //TODO handle the exception
                    throw e;
                }
            });
        };
        function GetDrawAwardUserCountReq(dataInfo, callback){
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(lotteryApi.GetDrawAwardUserCountReq, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    //TODO handle the exception
                    throw e;
                }
            });
        };
        function UserDrawAwardRecordReq(dataInfo, callback){
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(lotteryApi.UserDrawAwardRecordReq, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    //TODO handle the exception
                    throw e;
                }
            });
        };
        //弹幕
        function DrawAwardTipsReq(dataInfo, callback){
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(lotteryApi.DrawAwardTipsReq, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    //TODO handle the exception
                    throw e;
                }
            });
        };
        //拆红包
        function OpenRedPackets(dataInfo, callback){
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(lotteryApi.OpenRedPackets, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    //TODO handle the exception
                    throw e;
                }
            });
        };


        return {
            LuckDraw: LuckDraw,   //
            GetUserDrawCountReq:GetUserDrawCountReq,
            GetDrawAwardUserCountReq:GetDrawAwardUserCountReq,
            UserDrawAwardRecordReq:UserDrawAwardRecordReq,
            DrawAwardTipsReq:DrawAwardTipsReq,
            OpenRedPackets:OpenRedPackets,
         }
    }
);
