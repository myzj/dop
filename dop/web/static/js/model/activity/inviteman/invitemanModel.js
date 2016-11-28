define('model/activity/inviteman/invitemanModel', ['lib/common', 'api/activity/inviteman/invitemanApi'],
    function ($, invitemanApi) {
        function getInviteDoyen(dataInfo, callback) {
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(invitemanApi.getInviteDoyen, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    //TODO handle the exception
                    throw e;
                }
            });
        };
        function getInviteMyShareFriends(dataInfo,callback){
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(invitemanApi.getInviteMyShareFriends, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    //TODO handle the exception
                    throw e;
                }
            });
        };
        function GetPrizeInfoReq(dataInfo,callback){
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(invitemanApi.GetPrizeInfoReq, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    //TODO handle the exception
                    throw e;
                }
            });
        };

        return {
            getInviteDoyen: getInviteDoyen,   //
            getInviteMyShareFriends: getInviteMyShareFriends,   //
            GetPrizeInfoReq:GetPrizeInfoReq,      //
         }
    }
);
