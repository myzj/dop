require(['lib/common'],
    function () {
        angular.element(document).ready(function () {
            var app = $.getApp();

            app.controller('myDoc', function ($scope, $http) {

                $scope.apiName = "add...";

                $scope.ApiData = {
                    base: {
                        state: true,
                        tags: [],
                    },
                    request: {
                        method: "POST",
                        content_type: "application/json",
                        headers: [],
                        query_string: [],
                        body: {
                            mode: 'raw',
                            data: []
                        }
                    },
                    response: {
                        body: []
                    },
                    error_code: []
                };

                $scope.isProjectEdit = true;

                ReloadDate();

                if ($.url.getParam("project") != null && $.url.getParam("project").length > 0) {
                    // $scope.isProjectEdit = true;
                    //初始化数据
                }
                $scope.head_visible = false;
                $scope.Response_visible = false;
                $scope.query_string_visible = false;
                $scope.body_visible = false;
                $scope.ErrorCodes_visible = false;

                $scope.doEdit = function () {
                    ReloadDate(true);
                };
                function ReloadDate(boolean) {
                    var datainfo = {
                        "api_id": $.url.getParam("apiid"),
                        "is_modify": false
                    };
                    if (boolean) {
                        datainfo.is_modify = true;
                    }
                    if (datainfo.api_id > 0) {
                        $http.get('/api/qry/api_detail?api_id=' + datainfo.api_id + '&is_modify=' + datainfo.is_modify)
                            .success(function (data) {

                                if (data.errorcode == 0) {

                                    if (data.is_lock_user) {
                                        $scope.isEdit = false;
                                    } else {
                                        $scope.isEdit = true;
                                    }

                                    // $scope.ApiData = data.result;

                                    if (data.result.base) {
                                        $scope.ApiData.base = data.result.base;
                                    }

                                    if (data.result.request) {
                                        $scope.ApiData.request = data.result.request;
                                    }

                                    if (data.result.response) {
                                        $scope.ApiData.response = data.result.response;
                                    }

                                    if (data.result.error_code) {
                                        $scope.ApiData.error_code = data.result.error_code;
                                    }

                                    $scope.apiName = data.result.base.name;
                                }
                            });
                    }
                    else {
                        $scope.ApiData.state = true;
                    }
                }

                $scope.toggleBulkEdit = function ($event, EditId) {
                    if ($event.target.innerHTML == 'BulkEdit') {
                        $event.target.innerHTML = 'KeyValue';
                        if (EditId == 'Rq_headers') {
                            $scope.head_visible = !$scope.head_visible;
                            JSbeautify()
                        }
                        if (EditId == 'Rq_query_string') {
                            $scope.query_string_visible = !$scope.query_string_visible;
                            JSbeautify()
                        }
                        if (EditId == 'Rq_body') {
                            $scope.body_visible = !$scope.body_visible;
                            JSbeautify()
                        }
                        if (EditId == 'Response') {
                            $scope.Response_visible = !$scope.Response_visible;
                            JSbeautify()
                        }
                        if (EditId == 'ErrorCodes') {
                            $scope.ErrorCodes_visible = !$scope.ErrorCodes_visible;
                            JSbeautify()
                        }
                        function JSbeautify() {
                            var opts = {
                                "indent_size": "3",
                                "indent_char": " ",
                                "max_preserve_newlines": "1",
                                "preserve_newlines": true,
                                "keep_array_indentation": false,
                                "break_chained_methods": false,
                                "indent_scripts": "normal",
                                "brace_style": "expand",
                                "space_before_conditional": true,
                                "unescape_strings": false,
                                "jslint_happy": false,
                                "end_with_newline": false,
                                "wrap_line_length": "0"
                            };
                            if (EditId == 'Rq_headers') {
                                var source = JSON.stringify($scope.ApiData.request.headers);
                                $scope.ApiData.request.headersBulk = js_beautify(source, opts)
                            } else if (EditId == 'Rq_query_string') {
                                var source = JSON.stringify($scope.ApiData.request.query_string);
                                $scope.ApiData.request.query_stringBulk = js_beautify(source, opts)
                            } else if (EditId == 'Rq_body') {
                                var source = JSON.stringify($scope.ApiData.request.body.data);
                                $scope.ApiData.request.BodyBulk = js_beautify(source, opts)
                            } else if (EditId == 'Response') {
                                var source = JSON.stringify($scope.ApiData.response.body);
                                $scope.ResponseBulk = js_beautify(source, opts)
                            } else if (EditId == 'ErrorCodes') {
                                var source = JSON.stringify($scope.errorCodes);
                                $scope.ErrorCodesBulk = js_beautify(source, opts)
                            }
                        }
                    } else if ($event.target.innerHTML == 'KeyValue') {
                        $event.target.innerHTML = 'BulkEdit';
                        if (EditId == 'Rq_headers') {
                            $scope.head_visible = !$scope.head_visible;
                            $scope.ApiData.request.headers = JSON.parse($scope.ApiData.request.headersBulk);
                        }
                        if (EditId == 'Rq_query_string') {
                            $scope.query_string_visible = !$scope.query_string_visible;
                            $scope.ApiData.request.query_string = JSON.parse($scope.ApiData.request.query_stringBulk);
                        }
                        if (EditId == 'Rq_body') {
                            $scope.body_visible = !$scope.body_visible;
                            $scope.ApiData.request.body.data = JSON.parse($scope.ApiData.request.BodyBulk);
                        }
                        if (EditId == 'Response') {
                            $scope.Response_visible = !$scope.Response_visible;
                            $scope.ApiData.response.body = JSON.parse($scope.ResponseBulk);
                        }
                        if (EditId == 'ErrorCodes') {
                            $scope.ErrorCodes_visible = !$scope.ErrorCodes_visible;
                            $scope.ApiData.error_code = JSON.parse($scope.ErrorCodesBulk);
                        }
                    }
                };

                function checkAction(act) {
                    switch (act) {
                        case "canedit":
                            if ($scope.isEdit) {
                                alert('请先点击右上角的 "编辑" 按钮!');
                            }
                            // 是否可以编辑
                            return $scope.isEdit == false;
                            break;
                    }
                    return false;
                }

                //header 删除/添加数据
                $scope.Add_headerDate = function () {
                    if (!$scope.ApiData.request.headers instanceof Array) {
                        $scope.ApiData.request.headers = [];
                    }
                    $scope.ApiData.request.headers.push({});
                };
                $scope.Del_headerDate = function (index) {
                    $scope.ApiData.request.headers.splice(index, 1);
                };
                //QueryStringDate 删除/添加数据
                $scope.Add_QueryStringDate = function () {
                    if (!$scope.ApiData.request.query_string instanceof Array) {
                        $scope.ApiData.request.query_string = [];
                    }
                    $scope.ApiData.request.query_string.push({});
                };
                $scope.Del_QueryStringDate = function (index) {
                    $scope.ApiData.request.query_string.splice(index, 1);
                };
                // body删除/添加数据
                $scope.Add_bodyDate = function () {
                    if (!$scope.ApiData.request.body.data instanceof Array) {
                        $scope.ApiData.request.body.data = [];
                    }
                    $scope.ApiData.request.body.data.push({});
                };
                $scope.Add_bodyChildDate = function () {
                    if (!$scope.ApiData.request.body instanceof Array) {
                        $scope.ApiData.request.body = [];
                    }
                    $scope.ApiData.request.body.data.push({});
                };
                $scope.Del_bodyDate = function (index) {
                    $scope.ApiData.request.body.data.splice(index, 1);
                };
                //Add_ResponseDate 删除/添加数据
                $scope.Add_ResponseDate = function () {
                    if (!$scope.ApiData.response.body instanceof Array) {
                        $scope.ApiData.response.body = [];
                    }
                    $scope.ApiData.response.body.push({});
                };
                $scope.Add_ResponseChildDate = function () {
                    if (!$scope.ApiData.response instanceof Array) {
                        $scope.ApiData.response = [];
                    }
                    $scope.ApiData.response.body.push({});
                }
                $scope.Del_ResponseDate = function (index) {
                    $scope.ApiData.response.body.splice(index, 1)
                };
                //Add_ErrorCodeDate 删除/添加数据
                $scope.Add_ErrorCodeDate = function () {
                    if (!$scope.ApiData.error_code instanceof Array) {
                        $scope.ApiData.error_code = [];
                    }
                    $scope.ApiData.error_code.push({});
                };
                $scope.Del_ErrorCodeDate = function (index) {
                    $scope.ApiData.error_code.splice(index, 1)
                };

                $scope.getProject = function () {
                    $http.get('/api/req_project_list?pageIndex=1&pageSize=150').success(function (res) {
                        $scope.projectList = res.result.projectList;
                        var project_id = $.url.getParam("project");
                        var selectObject = {};
                        if (project_id != null && project_id.length > 0) {
                            $.each(res.result.projectList, function (i, list) {
                                if (list.project_id == project_id) {
                                    selectObject = list;
                                } else {
                                    selectObject = res.result.projectList[0];
                                }
                            })
                        } else {
                            selectObject = res.result.projectList[0];
                        }
                        $scope.project_list_selected = selectObject;
                    });
                };
                $scope.getProject();

                //取消编辑
                $scope.cancelEdit = function () {

                    var apiId = $.url.getParam("apiid");

                    if (apiId > 0) {
                        $http.get('/api/cancel/lock?api_id=' + apiId).success(function (data) {

                            alert(data.errormsg);

                            if (data.errorcode == 0) {
                                ReloadDate(false);
                            }

                        });
                    }
                };

                $scope.enterTag = function (e) {
                    var keycode = window.event ? e.keyCode : e.which;
                    var tipsText = e.target.value;
                    if (keycode == 13 || keycode == 186) {

                        if (tipsText != '' && tipsText != ';' && tipsText != '；') {
                            if (!$scope.ApiData.base) {
                                $scope.ApiData.base = {};
                            }
                            if (!$scope.ApiData.base.tags) {
                                $scope.ApiData.base.tags = [];
                            }

                            if (!$scope.tagsObj) {
                                $scope.tagsObj = {};
                            }

                            var tagItem = e.target.value.replace(/;/g, '').replace(/；/g, '');

                            if (!$scope.tagsObj[tagItem]) {
                                $scope.tagsObj[tagItem] = true;
                                $scope.ApiData.base.tags.push(tagItem);
                            }
                        }
                        e.target.value = '';
                    }
                }
                $scope.delTags = function (index) {
                    if (checkAction('canedit')) {
                        $scope.ApiData.base.tags.splice(index, 1)
                    }
                }
                $scope.setState = function (boolean) {
                    if (boolean) {
                        $scope.ApiData.base.state = true
                    } else {
                        $scope.ApiData.base.state = false
                    }
                }
                $scope.saveData = function () {

                    if (!$scope.project_list_selected || $scope.project_list_selected.project_id <= 0) {
                        alert('请选择项目!');
                    }

                    var upData = {
                        project: $scope.project_list_selected.project_id,
                        api_id: $.url.getParam("apiid"),
                        Arryitem: $scope.ApiData
                    };

                    var opt = {
                        data: {
                            is_replace: false,
                            info: {
                                "project": upData.project,
                                "api_id": upData.api_id
                            },
                            item: [upData.Arryitem]
                        }
                    };

                    if (upData.api_id > 0) {
                        opt.method = 'PATCH';
                        opt.url = '/api/mdf/api_info';
                    } else {
                        opt.method = 'POST';
                        opt.url = '/api/add/new_api';
                    }

                    $http(opt).success(function (data) {

                        alert(data.errormsg);

                        if (data.errorcode == 0) {
                            if (upData.api_id > 0) {
                                ReloadDate(false);
                            } else {
                                window.location.href = "/apilist?project=" + upData.project;
                            }
                        }

                    });
                };

                $scope.formatMock = function () {

                    var val = $scope.ApiData.base.mock;
                    if (val) {
                        var opts = {
                            "indent_size": "4",
                            "indent_char": " ",
                            "max_preserve_newlines": "1",
                            "preserve_newlines": true,
                            "keep_array_indentation": false,
                            "break_chained_methods": false,
                            "indent_scripts": "normal",
                            "brace_style": "expand",
                            "space_before_conditional": true,
                            "unescape_strings": false,
                            "jslint_happy": false,
                            "end_with_newline": false,
                            "wrap_line_length": "0"
                        };

                        var newVal = js_beautify(val, opts);
                        $scope.ApiData.base.mock = newVal;
                    }

                };

            });
            angular.bootstrap(document, ['app']);
        });

    });
