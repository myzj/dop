define('api/login/loginApi', ['config/url'], function (configUrl) {
    return {
        login:{
            url: configUrl.login,
            method:"get",
            post: {
                "username":'?',
                "password":'?'
            }
        },
        signUp:{
            url: configUrl.signUp,
            method:"POST",
            post: {
                "username":'?',
                "password":'?',
                "checkcode":'?'
            }
        }
    }
});