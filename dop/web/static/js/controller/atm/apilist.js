require(['lib/common'],
    function () {
        angular.element(document).ready(function () {
            var app = $.getApp();
            app.controller('apiMain', function ($scope, $http) {
                var pageSize = 6,
                    dataArr = [];        //数组content
                getTeamDate(1);
                function getTeamDate(index) {
                    var datainfo = {
                        "projectId": $.url.getParam("project"),
                        "pageIndex": index,
                        "pageSize": pageSize
                    };
                    $http.get('/api/req_api_list?project_id=' + datainfo.projectId + '&pageIndex=' + datainfo.pageIndex + '&pageSize=' + datainfo.pageSize)
                        .success(function (data) {
                            if (data.errorcode == 0) {
                                var getdata = data.result.apiList;
                                for (i = 0; i < getdata.length; i++) {
                                    dataArr.push(getdata[i])
                                }
                                $scope.apiArr = dataArr;
                            } else if (data.errorcode == 300021) {      //300021 列表页码已超出实际页数
                                isLoadOut = false;
                                $scope.isLast = false;
                            }
                        });
                };
                //添加team
                /*$scope.addTeam = function () {
                 $scope.isDialogShow = true;
                 $scope.closeDialog = function () {
                 $scope.isDialogShow = false;
                 };
                 $scope.saveDate = function () {
                 var tname = $('.tName').val();
                 var tpic = $('.tPic').val();
                 var tdec = $('.tDec').val();
                 var datainfo = {
                 "tname": tname,
                 "tpic": tpic,
                 "tdec": tdec
                 };
                 $http({
                 method: 'post',
                 url: '/api/add_team?team_name',
                 data: {team_name: datainfo.tname, pic_url: datainfo.tpic, description: datainfo.tdec}
                 }).success(function (data) {
                 if (data.errorcode == 0) {

                 }
                 });
                 }
                 }*/
            });
            angular.bootstrap(document, ['app']);
        });

    });
