define('api/signin/signinApi', ['config/url'], function (configUrl) {
    return {
        queryMemberSignRecord:{
            url: configUrl.queryMemberSignRecord,
            method:"get",
            post: {
                "Token":window.Token,
                "isApp":window.isMyzjApp
            }
        },

        memberSign:{
            url: configUrl.memberSign,
            method:"get",
            post: {
                "Token":window.Token,
                "isApp":window.isMyzjApp
            }
        },

        memberGetinfo:{
            url: configUrl.memberGetinfo,
            method:"get",
            post: {
                "Token":window.Token,
                "isApp":window.isMyzjApp,
            }
        },

    }
});