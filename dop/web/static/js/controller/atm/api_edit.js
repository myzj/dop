require(['lib/common'],
    function () {
        angular.element(document).ready(function () {
            var app = $.getApp();
            app.controller('myDoc', function ($scope, $http) {
                $scope.isEdit = true;
                $scope.head_visible = false;
                $scope.Response_visible = false;
                $scope.query_string_visible = false;
                $scope.body_visible = false;
                $scope.ErrorCodes_visible = false;
                $scope.doEdit = function () {
                    $scope.isEdit = false;
                    var boxId = $('.tab').find('li.active').attr('id');
                    $('#' + boxId + '_Main').find('input,textarea,select').removeAttr('disabled')
                };
                var datainfo = {
                    "api_id": $.url.getParam("apiid"),
                };
                $http.get('/api/qry/api_detail?api_id=' + datainfo.api_id)
                    .success(function (data) {
                        if (data.errorcode == 0) {
                            var ApiDate = data.result;
                            $scope.ApiDate = data.result
                            if (!ApiDate.base) {
                                ApiDate.base = [];
                            }
                            if (!ApiDate.error_code) {
                                ApiDate.error_code = [];
                            }
                            if (!ApiDate.request) {
                                //ApiDate.request.body.data[0].child_item.push( ApiDate.request.body.data[1]);
                                //console.log("body",ApiDate.request.body);
                                ApiDate.request = [];
                            }
                            if (!ApiDate.response) {
                                ApiDate.response = [];
                            }
                            $scope.Base = ApiDate.base;
                            $scope.errorCodes = ApiDate.error_code;
                            $scope.Request = ApiDate.request;
                            $scope.Response = ApiDate.response;
                            $scope.toggleBulkEdit = function ($event, EditId) {
                                if ($event.target.innerHTML == 'BulkEdit') {
                                    $event.target.innerHTML = 'KeyValue';
                                    if (EditId == 'Rq_headers') {
                                        $scope.head_visible = !$scope.head_visible;
                                        $scope.Request.headersBulk = JSON.stringify($scope.Request.headers);
                                    }
                                    if (EditId == 'Rq_query_string') {
                                        $scope.query_string_visible = !$scope.query_string_visible;
                                        $scope.Request.query_stringBulk = JSON.stringify($scope.Request.query_string);
                                    }
                                    if (EditId == 'Rq_body') {
                                        $scope.body_visible = !$scope.body_visible;
                                        $scope.Request.BodyBulk = JSON.stringify($scope.Request.body.data);
                                    }
                                    if (EditId == 'Response') {
                                        $scope.Response_visible = !$scope.Response_visible;
                                        $scope.ResponseBulk = JSON.stringify($scope.Response.body);
                                    }
                                    if (EditId == 'ErrorCodes') {
                                        $scope.ErrorCodes_visible = !$scope.ErrorCodes_visible;
                                        $scope.ErrorCodesBulk = JSON.stringify($scope.errorCodes);
                                    }
                                } else if ($event.target.innerHTML == 'KeyValue') {
                                    $event.target.innerHTML = 'BulkEdit';
                                    if (EditId == 'Rq_headers') {
                                        $scope.head_visible = !$scope.head_visible;
                                        $scope.Request.headers = JSON.parse($scope.Request.headersBulk);
                                    }
                                    if (EditId == 'Rq_query_string') {
                                        $scope.query_string_visible = !$scope.query_string_visible;
                                        $scope.Request.query_string = JSON.parse($scope.Request.query_stringBulk);
                                    }
                                    if (EditId == 'Rq_body') {
                                        $scope.body_visible = !$scope.body_visible;
                                        $scope.Request.body.data = JSON.parse($scope.Request.BodyBulk);
                                    }
                                    if (EditId == 'Response') {
                                        $scope.Response_visible = !$scope.Response_visible;
                                        $scope.Response.body = JSON.parse($scope.ResponseBulk);
                                    }
                                    if (EditId == 'ErrorCodes') {
                                        $scope.ErrorCodes_visible = !$scope.ErrorCodes_visible;
                                        $scope.errorCodes = JSON.parse($scope.ErrorCodesBulk);
                                    }
                                }
                            }

                            //header 删除/添加数据
                            $scope.Add_headerDate = function () {
                                ApiDate.request.headers.push({});
                            };
                            $scope.Del_headerDate = function (index) {
                                ApiDate.request.headers.splice(index, 1)
                            };
                            //QueryStringDate 删除/添加数据
                            $scope.Add_QueryStringDate = function () {
                                ApiDate.request.query_string.push({});
                            };
                            $scope.Del_QueryStringDate = function (index) {
                                ApiDate.request.query_string.splice(index, 1)
                            };
                            // body删除/添加数据
                            $scope.Add_bodyDate = function () {
                                ApiDate.request.body.data.push({});
                            };
                            $scope.Add_bodyChildDate = function () {
                                ApiDate.request.body.data.push({});
                            };
                            $scope.Del_bodyDate = function (index) {
                                ApiDate.request.body.data.splice(index, 1);
                            };
                            //Add_ResponseDate 删除/添加数据
                            $scope.Add_ResponseDate = function () {
                                ApiDate.response.body.push({});
                            };
                            $scope.Add_ResponseChildDate = function () {
                                ApiDate.response.body.push({});
                            }
                            $scope.Del_ResponseDate = function (index) {
                                ApiDate.response.body.splice(index, 1)
                            };
                            //Add_ErrorCodeDate 删除/添加数据
                            $scope.Add_ErrorCodeDate = function () {
                                $scope.errorCodes.push({});
                                console.log(ApiDate.error_code)
                            };
                            $scope.Del_ErrorCodeDate = function (index) {
                                $scope.errorCodes.splice(index, 1)
                            }

                        }
                    });
                $scope.enterTag = function (e) {
                    var keycode = window.event ? e.keyCode : e.which;
                    console.log(keycode)
                    if (keycode == 13 || keycode == 186) {
                        $scope.Base.tags.push(e.target.value.replace(/;；/g,''));
                        e.target.value = '';
                        console.log($scope.Base)
                    }
                }
                $scope.saveData = function () {
                    var upData = {
                        "project": '17',
                        "api_id": '165',
                        "Arryitem": $scope.ApiDate
                    };
                    $http({
                        method: 'PATCH',
                        url: '/api/mdf/api_info',
                        data: {
                            info: {
                                "project": upData.project,
                                "api_id": upData.api_id
                            },
                            item: [upData.Arryitem]
                        }
                    }).success(function (data) {
                        if (data.errorcode == 0) {

                        }
                    });
                }
            });
            angular.bootstrap(document, ['app']);
        });

    });
