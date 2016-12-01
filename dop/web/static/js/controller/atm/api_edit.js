require(['lib/common'],
    function () {
        angular.element(document).ready(function () {
            var app = $.getApp();
            app.controller('myDoc', function ($scope, $http) {
                $scope.isEdit = true;
                $scope.doEdit = function () {
                                $scope.isEdit = false;
                                alert($scope.isEdit)
                            }
                var datainfo = {
                    "api_id": $.url.getParam("apiid"),
                };
                $http.get('/api/qry/api_detail?api_id=' + datainfo.api_id)
                    .success(function (data) {
                        if (data.errorcode == 0) {

                            var ApiDate = data.result;
                            if (ApiDate.base) {
                                $scope.api_base = ApiDate.base;
                            }
                            if (ApiDate.error_code) {
                                api_error_code = ApiDate.error_code;
                            }
                            if (ApiDate.request) {
                                api_request = ApiDate.request;
                            }
                            if (ApiDate.response) {
                                api_response = ApiDate.response;
                            }
                        }
                    });
            });
            angular.bootstrap(document, ['app']);
        });

    });
