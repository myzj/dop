require(['lib/common'],
    function () {
        angular.element(document).ready(function () {
            var app = $.getApp();
            app.controller('myDoc', function ($scope, $http) {
                $scope.isEdit = true;
                $scope.doEdit = function () {
                    $scope.isEdit = false;
                    var boxId = $('.tab').find('li.active').attr('id');
                    $('#'+ boxId + '_Main').find('input,textarea,select').removeAttr('disabled')
                }
                var datainfo = {
                    "api_id": $.url.getParam("apiid"),
                };
                $http.get('/api/qry/api_detail?api_id=' + datainfo.api_id)
                    .success(function (data) {
                        if (data.errorcode == 0) {
                            var ApiDate = data.result;
                            if (ApiDate.base) {
                                $scope.spanBase = ApiDate.base;
                            }
                            if (ApiDate.error_code) {
                                $scope.errorCode = ApiDate.error_code;
                            }
                            if (ApiDate.request) {
                                $scope.Request = ApiDate.request;
                            }
                            if (ApiDate.response) {
                                $scope.Response = ApiDate.response;
                            }
                        }
                    });
            });
            angular.bootstrap(document, ['app']);
        });

    });
