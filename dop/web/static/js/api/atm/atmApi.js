define('api/atm/atmApi', ['config/url'], function (configUrl) {
    return {
        team_list:{
            url: configUrl.req_team_list,
            method:"get",
            post: {
                "pageIndex":'?',
                "pageSize":'?'
            }
        }
    }
});