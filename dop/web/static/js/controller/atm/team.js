require(['lib/common','model/atm/atmModel'],
    function($,atmModel){
        /*var app = angular.module('app',[]);
            app.controller('teamList',function($scope){
            $scope.msg='你好 hello';
        })*/
        angular.element(document).ready(function(){
            　var app = angular.module('app',[]);
              app.controller('teamList',function($scope){
                $scope.msg  = '45454'
              })
              angular.bootstrap(document,['app']);
          });
        var datainfo = {
                post:{
                    "pageIndex": 1,
                    "pageSize": 10
                    }
            };
            atmModel.team_list(datainfo,function(data){
                console.log(data)
                if(data.success){
                    //window.location.href = window.webRoot + 'teamlist'
                }
            });
});
