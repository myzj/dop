require(['lib/common'],
    function () {
        angular.element(document).ready(function () {
            var app = $.getApp();
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
                    var keywordStr = "";
                    var keyword = $.url.getParam("keyword");
                    if(keyword != null && keyword.length >0){
                        datainfo.keyword = keyword;
                        keywordStr = "&keyword=" + keyword;
                    }
                    $http.get('/api/req_team_list?pageIndex=' + datainfo.pageIndex + '&pageSize=' + datainfo.pageSize + keywordStr)
                        .success(function (data) {
                            onloading = true;
                            curIndex++;
                            if (data.errorcode == 0) {
                                var getdata = data.result.teamList;
                                if (getdata.length < pageSize) {
                                    isLoadOut = false;
                                    $scope.isLast = false;
                                }
                                for (i = 0; i < getdata.length; i++) {
                                    dataArr.push(getdata[i])
                                }
                                $scope.teamArr = dataArr;
                                if(isAutoLoad){
                                    loadDate(true);
                                }
                                console.log(dataArr)
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
                                alert("添加成功")
                            }else{
                                alert(data.errormsg);
                            }
                        });
                    }
                }
            });
            angular.bootstrap(document, ['app']);
        });

    });
