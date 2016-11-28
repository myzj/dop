define('api/activity/lottery/lotteryApi', ['config/url'], function (configUrl) {
    return {
        LuckDraw:{
            url: configUrl.LuckDraw,
            method:"get",
            post: {
                "Guid":window.UserGuid,
                "ActivityKey":'?',
                "ClientIp": window.ClientIp,
                "Token":window.Token,
                "isApp":window.isMyzjApp
            }
        },
        GetUserDrawCountReq:{
            url: configUrl.GetUserDrawCountReq,
            method:"jsonp",
            post: {
                "UserId": '?',
                "SourceTypeSysNo": '?',
                "DisplayLabel": '?',
                "ActivityKey":'?',
                "Guid":'?',
                "ClientIp":'?',
            }
        },
        GetDrawAwardUserCountReq:{
            url: configUrl.GetDrawAwardUserCountReq,
            method:"jsonp",
            post: {
                "UserId": '?',
                "SourceTypeSysNo": '?',
                "DisplayLabel": '?',
                "ActivityKey":'?',
                "Guid":'?',
                "ClientIp":'?',
            }
        },
        UserDrawAwardRecordReq:{
            url: configUrl.UserDrawAwardRecordReq,
            method:"jsonp",
            post: {
                "UserId": '?',
                "SourceTypeSysNo": '?',
                "DisplayLabel": '?',
                "ActivityKey":'?',
                "Guid":'?',
                "ClientIp":'?',
                "RecordSysNo":'?'
            }
        },
        //弹幕
        DrawAwardTipsReq:{
            url: configUrl.DrawAwardTipsReq,
            method:"jsonp",
            post: {
                "UserId": '?',
                "SourceTypeSysNo": '?',
                "DisplayLabel": '?',
                "ActivityKey":'?',
                "Guid":'?',
                "ClientIp":'?',
            }
        },
        //拆红包
        OpenRedPackets:{
            url: configUrl.OpenRedPackets,
            method:"jsonp",
            post: {
                "UserId": '?',
                "SourceTypeSysNo": '?',
                "DisplayLabel": '?',
                "ActivityKey":'?',
                "Guid":'?',
                "ClientIp":'?',
            }
        },
    }
});
