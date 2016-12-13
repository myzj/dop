define('model/atm/atmModel', ['lib/common', 'api/atm/atmApi'],
    function ($, atmApi) {
        function team_list(dataInfo, callback) {
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(atmApi.team_list, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    //TODO handle the exception
                    throw e;
                }
            });
        };
        return {
            team_list: team_list,   //
         }
    }
);
