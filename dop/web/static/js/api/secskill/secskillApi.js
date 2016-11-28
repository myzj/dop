define('api/secskill/secskillApi', ['config/url'], function (configUrl) {
    return {
        secskillMyList:{
            url: configUrl.secskillMyList,
            method:"jsonp",
            post:{
                channel_id : "?",
                user_guid : "?",
                user_id :"?",
            }
        },
        secskillListByTime:{
            url: configUrl.secskillListByTime,
            method:"jsonp",
            post: {
                MjsName: "?",
                channel_id : "?",
                user_guid : "?",
                user_id :"?",
            }
        }

    }
});