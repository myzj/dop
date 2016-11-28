define('api/activity/inviteman/invitemanApi', ['config/url'], function (configUrl) {
    return {
        getInviteDoyen:{
            url: configUrl.getInviteDoyen,
            method:"jsonp",
            post: {
                "UserId": '?',
                "SourceTypeSysNo": '?',
                "DisplayLabel": '?'
            }
        },
        getInviteMyShareFriends:{
            url: configUrl.getInviteMyShareFriends,
            method:"jsonp",
            post: {
                "UserId": '?',
                "SourceTypeSysNo": '?',
                "DisplayLabel": '?'
            }
        },
        GetPrizeInfoReq:{
            url: configUrl.GetPrizeInfoReq,
            method:"jsonp",
            post: {
                "UserId": '?',
                "SourceTypeSysNo": '?',
                "DisplayLabel": '?'
            }
        }
    }
});
