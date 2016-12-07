require(['lib/common'],
    function () {
        angular.element(document).ready(function () {

            var app = $.getApp();

            //$.initHeadController(app);

            app.controller('myDoc', function ($scope, $http) {
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
                    if (isLoad) {
                        isAutoLoad = autoLoad;                 //列表没有
                    } else {
                        isAutoLoad = false;
                    }
                    if (isLoad && onloading && isLoadOut) {
                        onloading = false;
                        getTeamDate(curIndex, isAutoLoad);
                    }
                };
                window.onscroll = function () {
                    loadDate();
                }
                function getTeamDate(index, isAutoLoad) {
                    var datainfo = {
                        "pageIndex": index,
                        "pageSize": pageSize,
                        "team": $.url.getParam("team")
                    };
                    var teamStr = "";
                    var keywordStr = "";
                    var keyword = $.url.getParam("keyword");
                    var team = $.url.getParam("team");
                    if (keyword != null && keyword.length > 0) {
                        datainfo.keyword = keyword;
                        keywordStr = "&keyword=" + keyword;
                    }
                    if (team != null && team.length > 0) {
                        datainfo.team = team;
                        teamStr = "&team_id=" + team;
                    }
                    $http.get('/api/req_project_list?pageIndex=' + datainfo.pageIndex + '&pageSize=' + datainfo.pageSize + teamStr + keywordStr)
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
                                    dataArr.push(getdata[i]);
                                }

                                $scope.projectArr = dataArr;
                                if (isAutoLoad) {
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

                    $scope.detail_title = "Project Add";
                    $scope.EditOrAdd = "add";
                    $scope.itemData = [];
                    $scope.isDialogShow = true;
                    $http({
                        method: 'get',
                        url: '/api/req_team_list?pageSize=100&pageIndex=1',
                    }).success(function (res) {
                        $scope.team_list = res.result.teamList;
                        var selectObject = {};
                        var team = $.url.getParam("team");
                        if (team != null) {
                            $.each(res.result.teamList, function (i, list) {
                                if (list.team_id == team) {
                                    selectObject = list;
                                }
                            })
                        } else {
                            selectObject = res.result.teamList[0];
                        }

                        $scope.team_list_selected = selectObject;
                    });

                };
                $scope.closeDialog = function () {
                    $scope.isDialogShow = false;
                };
                $scope.edit_project = function (project_id, team_id) {
                    $scope.EditOrAdd = "edit";
                    $scope.isDialogShow = true;
                    $http({
                        method: 'get',
                        url: '/api/req_team_list?pageSize=100&pageIndex=1',
                    }).success(function (res) {
                        $scope.team_list = res.result.teamList;
                        var selectObject = {};
                        $.each(res.result.teamList, function (i, list) {
                            if (list.team_id == team_id) {
                                selectObject = list;
                            }
                        })
                        $scope.team_list_selected = selectObject;
                    });

                    // find project item
                    $.each($scope.projectArr, function (i, item) {

                        if (item.project_id == project_id) {
                            $scope.itemData = item;
                            return;
                        }

                    });
                    $scope.detail_title = "Project Edit : " + $scope.itemData.project_name;
                };

                $scope.saveProject = function () {
                    if($scope.itemData.project_name == null){
                        alert("项目名不能为空");
                        return;
                    }
                    if($scope.itemData.description == null){
                        alert("项目描述不能为空");
                        return;
                    }
                    if($scope.itemData.host == null){
                        alert("项目路劲不能为空");
                        return;
                    }
                    if($scope.itemData.project_pic_url == null){
                        alert("项目封面图不能为空");
                        return;
                    }
                    if ($scope.EditOrAdd == "edit") {
                        var datainfo = {
                            "project_name": $scope.itemData.project_name,
                            "host": $scope.itemData.host,
                            "team_id": $scope.team_list_selected.team_id,
                            "description": $scope.itemData.description,
                            "pic_url": $scope.itemData.project_pic_url,
                            "project_id": $scope.itemData.project_id
                        };
                        $http({
                            method: 'post',
                            url: '/api/edit_project',
                            data: datainfo,
                        }).success(function (data) {
                            if (data.errorcode == 0) {
                                $scope.isDialogShow = false;
                            } else {
                                alert(data.errormsg);
                            }
                        });
                    } else {
                        var datainfo = {
                            "project_name": $scope.itemData.project_name,
                            "host": $scope.itemData.host,
                            "team_id": $scope.team_list_selected.team_id,
                            "description": $scope.itemData.description,
                            "pic_url": $scope.itemData.project_pic_url,
                        };
                        $http({
                            method: 'post',
                            url: '/api/add_project',
                            data: datainfo,
                        }).success(function (data) {
                            if (data.errorcode == 0) {
                                window.location.href = window.location.href;
                            } else {
                                alert(data.errormsg);
                            }
                        });
                    }
                }
            });
            angular.bootstrap(document, ['app']);
        });

    });
