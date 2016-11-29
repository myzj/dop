require(['lib/common'],
    function () {
        angular.element(document).ready(function () {
            var app = $.getApp();
            app.controller('ProjectMain', function ($scope, $http) {
                $scope.isLast = true;
                $scope.isDialogShow = false;
                var curIndex = 1,        //当前页数
                    pageSize = 3,        //加载数量
                    isLoadOut = true,   //是否已加载完       true: 未加载完, false：已加载完
                    onloading = true,   //接口是否在访问ing  true:空闲中 ,false：访问中
                    dataArr = [],        //数组content
                    isAutoLoad;
                loadDate(true);
                function loadDate(autoLoad) {
                    var winScroll = $('body').scrollTop();  //窗口卷起的高度
                    var loadTipsSH = $('.loadTips').offset().top - winScroll;  //提示条距离窗口顶部的高度
                    var isLoad = loadTipsSH - $(window).height() <= 20 ? true : false;   //是否加载下一页
                    if(isLoad){
                        isAutoLoad = autoLoad;                 //列表没有
                    }else{
                        isAutoLoad = false;
                    }
                    console.log(isLoad)
                    if (isLoad && onloading && isLoadOut) {
                        onloading = false;
                        getTeamDate(curIndex,isAutoLoad);
                    }
                };
                window.onscroll = function () {
                    loadDate();
                }
                function getTeamDate(index,isAutoLoad) {
                    var datainfo = {
                        "pageIndex": index,
                        "pageSize": pageSize
                    };
                    $http.get('/api/req_project_list?pageIndex=' + datainfo.pageIndex + '&pageSize=' + datainfo.pageSize)
                        .success(function (data) {
                            onloading = true;
                            curIndex++;
                            if (data.errorcode == 0) {
                                var getdata = data.result.projectList;
                                if (getdata.length < pageSize) {
                                    isLoadOut = false;
                                    $scope.isLast = false;
                                }
                                for (i = 0; i < getdata.length; i++) {
                                    dataArr.push(getdata[i])
                                }
                                $scope.projectArr = dataArr;
                                if(isAutoLoad){
                                    loadDate(true);
                                }
                            } else if (data.errorcode == 300021) {      //300021 列表页码已超出实际页数
                                isLoadOut = false;
                                $scope.isLast = false;
                            }
                        });
                };
                //添加team
                $scope.addTeam = function () {
                    $scope.isDialogShow = true;
                    $scope.closeDialog = function () {
                        $scope.isDialogShow = false;
                    };
                    $scope.saveProject = function () {
                        var datainfo = {
                            "pName": $('.pName').val(),
                            "team_id": $.url.getParam("team"),
                            "tdec": $('.tDec').val(),
                            "thost":$('.thost').val()
                        };
                        $http({
                            method: 'post',
                            url: '/api/add_project?team_name',
                            data: {
                                project_name: datainfo.pName,
                                host: datainfo.thost,
                                team_id: datainfo.team_id,
                                description: datainfo.tdec
                            }
                        }).success(function (data) {
                            if (data.errorcode == 0) {

                            }
                        });
                    }
                }
            });
            angular.bootstrap(document, ['app']);
        });

    });
