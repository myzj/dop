require(['lib/common', 'lib/jquery.twbsPagination.min'],
    function () {
        angular.element(document).ready(function () {
            var app = $.getApp();
            app.controller('myDoc', function ($scope, $http) {
                var pageSize = 10;
                getTeamDate(1, true);
                function getTeamDate(index, isInit) {
                    var datainfo = {
                        "projectId": $.url.getParam("project"),
                        "pageIndex": index,
                        "pageSize": pageSize
                    };

                    var projectStr = "";
                    var keywordStr = "";
                    var keyword = $.url.getParam("keyword");
                    var project_id = $.url.getParam("project");
                    if (keyword != null && keyword.length > 0) {
                        datainfo.keyword = keyword;
                        keywordStr = "&keyword=" + keyword;
                    }
                    if (project_id != null && project_id.length > 0) {
                        projectStr = "&project_id=" + project_id;
                    }

                    $http.get('/api/req_api_list?' + 'pageIndex=' + datainfo.pageIndex + '&pageSize=' + datainfo.pageSize + projectStr + keywordStr)
                        .success(function (data) {
                            if (data.errorcode == 0) {
                                var dataArr = [];

                                var getdata = data.result.apiList;
                                for (i = 0; i < getdata.length; i++) {
                                    dataArr.push(getdata[i])
                                }
                                $scope.apiArr = dataArr;

                                if (getdata.length > 0) {
                                    $("#pages").show();
                                    $('#pagination').twbsPagination({
                                        totalPages: data.result.pageCount,
                                        visiblePages: pageSize,
                                        startPage: data.result.pageIndex,
                                        initiateStartPageClick: false,
                                        first: "首页",
                                        last: "末页",
                                        prev: "上一页",
                                        next: "下一页",
                                        loop: true,
                                        onPageClick: function (event, page) {
                                            getTeamDate(page, false);
                                        }
                                    });
                                    if(isInit){
                                        $("#pagination .page").eq(0).addClass("active")
                                    }
                                }
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
