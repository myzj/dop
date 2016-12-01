require(['lib/common'],
    function () {
        angular.element(document).ready(function () {
            var app = $.getApp();
            app.controller('myDoc', function ($scope, $http) {
                $scope.isEdit = true;
                $scope.doEdit = function () {
                    $scope.isEdit = false;
                    var boxId = $('.tab').find('li.active').attr('id');
                    $('#' + boxId + '_Main').find('input,textarea,select').removeAttr('disabled')
                }
                var datainfo = {
                    "api_id": $.url.getParam("apiid"),
                };
                $http.get('/api/qry/api_detail?api_id=' + datainfo.api_id)
                    .success(function (data) {
                        if (data.errorcode == 0) {
                            var ApiDate = data.result;
                            if (ApiDate.base) {
                                $scope.Base = ApiDate.base;
                            }
                            if (ApiDate.error_code) {
                                $scope.errorCode = ApiDate.error_code;
                            }
                            if (ApiDate.request) {

                                //ApiDate.request.body.data[0].child_item.push( ApiDate.request.body.data[1]);

                                //console.log("body",ApiDate.request.body);

                                $scope.Request = ApiDate.request;
                            }
                            if (ApiDate.response) {
                                $scope.Response = ApiDate.response;
                            }
                            $scope.out = function () {
                                console.log(data)
                            }
                            //header 删除/添加命令
                            $scope.Add_headerDate = function () {
                                ApiDate.request.headers.push({});
                                console.log(ApiDate)
                            };
                            $scope.Del_headerDate = function (index) {
                                ApiDate.request.headers.splice(index, 1)
                            };
                            //QueryStringDate 删除/添加命令
                            $scope.Add_QueryStringDate = function () {
                                ApiDate.request.query_string.push({});
                            };
                            $scope.Del_QueryStringDate = function (index) {
                                ApiDate.request.query_string.splice(index, 1)
                            };
                            // body删除/添加命令
                            $scope.Add_bodyDate = function(){
                                ApiDate.request.body.data.push({});
                            };
                            $scope.Add_bodyChildDate = function(){
                                ApiDate.request.body.data.push({});
                            };
                            $scope.Del_bodyDate = function(index){
                                ApiDate.request.body.data.splice(index,1);
                            };
                            $scope.a = function () {
                                console.log(ApiDate)
                            }
                        }
                    });
            });
            angular.bootstrap(document, ['app']);
        });

    });
