define('api/test/testApi', ['config/url'], function (configUrl) {
    return {
        testView: {
            url: "http://192.168.100.131:30015/json/reply/BaseRegionRequest",
            method: "jsonp",
            post: {
                FatherRegionId: "?",
                UserId: "?",
                Guid: "?",
                DisplayLabel: "?",
                SourceTypeSysNo: "2",
                AreaSysNo: "?",
                ChannelID: "?",
                ExtensionSysNo: "?",
                OperatorSysNo: "?",
                OperatorName: "?",
                IP: "?",
            }
        }
    }
})