define('model/signinModel/signinModel', ['lib/common', 'api/signin/signinApi'],
     function ($, signinApi) {
         function queryMemberSignRecord(callback) {
             $.xsr($.makeUrl(signinApi.queryMemberSignRecord), function (res) {
                 try {
                     callback && callback(res);
                 } catch (e) {
                     //TODO handle the exception
                     throw e;
                 }
             });
         }

         function memberSign(callback) {
             $.xsr($.makeUrl(signinApi.memberSign), function (res) {
                 try {
                     callback && callback(res);
                 } catch (e) {
                     //TODO handle the exception
                     throw e;
                 }
             });
         }

         function memberGetinfo(callback) {
             $.xsr($.makeUrl(signinApi.memberGetinfo), function (res) {
                 try {
                     callback && callback(res);
                 } catch (e) {
                     //TODO handle the exception
                     throw e;
                 }
             });
         }
         return {
             queryMemberSignRecord: queryMemberSignRecord,
             memberSign: memberSign,
             memberGetinfo:memberGetinfo,
         }
     }
);