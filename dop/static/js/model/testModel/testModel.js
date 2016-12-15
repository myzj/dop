define('model/testModel/testModel', ['lib/common', 'api/test/testApi'],
     function ($, testApi) {
         //初始化订单
         function getBaseRegionRequestObj() {
             var bizBaseRegionRequestData = {
                 post: {
                     FatherRegionId: "?",
                     UserId: "?",
                     Guid: "?",
                     DisplayLabel: "?",
                     AreaSysNo: "?",
                     ChannelID: "?",
                     ExtensionSysNo: "?",
                     OperatorSysNo: "?",
                     OperatorName: "?",
                     IP: "?",
                 }
             };
             return bizBaseRegionRequestData;
         }

         function getBaseRegionRequest(dataInfo, callback) {
             var bizDataObj = getBaseRegionRequestObj();
             var dataInfo = dataInfo || {};
             if (dataInfo.post) {
                 $.merge(bizDataObj.post, dataInfo.post);
             };
             $.xsr($.makeUrl(testApi.testView, bizDataObj.post), function (res) {
                 try {
                     callback && callback(res);
                 } catch (e) {
                     //TODO handle the exception
                     throw e;
                 }
             });
         }
         return {
             getBaseRegionRequest: getBaseRegionRequest//订单节点数量
         }
     }
);