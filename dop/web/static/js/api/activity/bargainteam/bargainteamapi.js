define('api/activity/bargainteam/bargainteamapi', ['config/url'], function (configUrl) {
    return {
        getGoodsDetail:{
            url: configUrl.getGoodsDetail,
            method:"jsonp",
            post: {
                "ActKey":"?",
                "UserId":"?",
                "GoodsId": '?'
            }
        },

        
        bargainGoodsList:{
            url: configUrl.bargainGoodsList,
            method:"jsonp",
            post: {
                "ActKey": '?',
                "UserId":"?",
                "PageIndex":"?",
                "PageSize":"?",
            }
        },
        createGroup:{
            url: configUrl.createGroup,
            method:"get",
            post: {
                "ActKey":"?",
                "GoodsId": '?',
                "Token":window.Token,
                "isApp":window.isMyzjApp
            }
        },
        
        joinTeam:{
            url: configUrl.joinTeam,
            method:"get",
            post: {
                "GroupKey":"?",
                "Token":window.Token,
                "isApp":window.isMyzjApp
            }
        },
        inviteFriends:{
            url: configUrl.inviteFriends,
            method:"jsonp",
            post: {
                "GroupKey":"?"
            }
        },
        getMyBargainList:{
            url: configUrl.getMyBargainList,
            method:"get",
            post: {
                "Token":window.Token,
                "isApp":window.isMyzjApp,
                "PageIndex": '?',
                "PageSize":"?"
            }
        },
        getBroadCast:{
            url: configUrl.getBroadCast,
            method:"jsonp",
            post: {
                "UserId": '?',
            }
        },
    }
});