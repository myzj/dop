define('model/activity/bargainteam/bargainteammodel', ['lib/common', 'api/activity/bargainteam/bargainteamapi'],
    function ($, bargainTeamApi) {
        function getGoodsDetail(dataInfo, callback) {
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(bargainTeamApi.getGoodsDetail, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    throw e;
                }
            });
        }

        function bargainGoodsList(dataInfo, callback) {
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(bargainTeamApi.bargainGoodsList, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    throw e;
                }
            });
        }

        function createGroup(dataInfo, callback) {
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(bargainTeamApi.createGroup, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    throw e;
                }
            });
        }

        function joinTeam(dataInfo, callback) {
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(bargainTeamApi.joinTeam, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    throw e;
                }
            });
        }

        function inviteFriends(dataInfo, callback) {
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(bargainTeamApi.inviteFriends, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    throw e;
                }
            });
        }

        function getMyBargainList(dataInfo, callback){
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(bargainTeamApi.getMyBargainList, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    throw e;
                }
            });
        }

        function getBroadCast(dataInfo, callback){
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(bargainTeamApi.getBroadCast, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    throw e;
                }
            });
        }

        return {
            bargainGoodsList: bargainGoodsList,
            getGoodsDetail: getGoodsDetail,   //返回商品详情介绍
            createGroup: createGroup,
            inviteFriends: inviteFriends,
            getMyBargainList: getMyBargainList,
            getBroadCast: getBroadCast,
            joinTeam: joinTeam
         }
    }
);