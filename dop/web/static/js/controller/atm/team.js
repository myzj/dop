require(['lib/common'],
    function () {
        angular.element(document).ready(function () {
            var app = $.getApp();
            app.controller('TeamMain', function ($scope, $http) {
                var curIndex = 1,    //当前页数
                    pageSize = 2,     //加载数量
                    onloading = true;   //接口是否在访问ing  true:空闲中 ,false：访问中
                getTeamDate(curIndex);
                window.onscroll = function () {
                    var winScroll = $('body').scrollTop();  //窗口卷起的高度
                    var loadTipsSH = $('.loadTips').offset().top - $('body').scrollTop();  //提示条距离窗口顶部的高度
                    var isLoad = winScroll / loadTipsSH > 0.8 ? true : false;   //是否加载下一页
                    if (isLoad && onloading) {
                        onloading = false;
                        getTeamDate(curIndex);
                    }
                };
                function getTeamDate(index) {
                    var datainfo = {
                        "pageIndex": index,
                        "pageSize": pageSize
                    };
                    $http.get('/api/req_team_list?pageIndex=' + datainfo.pageIndex + '&pageSize=' + datainfo.pageSize)
                        .success(function (data) {
                            onloading = true;
                            curIndex++;
                            if (data.errorcode == 0) {
                                $scope.teamArr = data.result.teamList;
                            } else {

                            }
                        });
                };
            });
            angular.bootstrap(document, ['app']);
        });

    });
