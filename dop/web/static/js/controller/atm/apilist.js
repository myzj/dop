require(['lib/common', 'lib/jquery.twbsPagination.min', 'lib/prism'],
    function () {
        angular.element(document).ready(function () {
            var app = $.getApp();
            app.filter('to_trusted', ['$sce', function ($sce) {
                return function (text) {
                    return $sce.trustAsHtml(text);
                };
            }]);
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
                                $scope.project = $.url.getParam("project");
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
                                    if (isInit) {
                                        $("#pagination .page").eq(0).addClass("active")
                                    }
                                }
                            } else if (data.errorcode == 300021) {      //300021 列表页码已超出实际页数
                                isLoadOut = false;
                                $scope.isLast = false;
                            }

                        });
                };
                $scope.copy_dialog = false;
                $scope.show_importDialo = function () {
                    $scope.import_box = true
                };
                $scope.import_action = function () {

                    var a = $.trim($scope.text);
                    if (a.length <= 0) {
                        return;
                    }

                    try {
                        var json = eval("(" + a + ")");
                    } catch (e) {
                        alert("数据格式不正确");
                    }

                    json.is_replace = $("input[name='is_replace']:checked").val() === "true";
                    $http({
                        method: 'POST',
                        url: '/api/add/new_api/',
                        data: json,
                    }).success(function (data) {
                        alert(data.errormsg);
                        if (data.errorcode == 0) {
                            getTeamDate(1, true);  //重新刷新
                        }
                    });
                };

                $scope.hide_importDialog = function () {
                    $scope.text = "";
                    $scope.import_box = false;
                };
                $scope.format = function () {
                    var source = $("#code_data").val();
                    beautify(source, function (val) {
                        $("#code_data").val(val);
                    });
                };
                function beautify(txt, callback) {
                    var source = txt;
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
                    var formated = js_beautify(source, opts);
                    callback(formated)
                };

                $scope.close_dialog = function () {
                    $("#copy_success").hide();
                    $scope.copy_dialog = false;
                };

                $scope.open_copy_dialog = function (id, url) {
                    $scope.copy_success = false;
                    $scope.copy_url = "http://" + window.location.host + "/mockdata/" + id + url;
                    $scope.copy_dialog = true;
                    var client = new ZeroClipboard(document.getElementById("copy_btn"));
                    client.on("ready", function () {
                        client.on("aftercopy", function () {
                            $("#copy_success").html("复制成功").show();
                        });
                    });
                };

                $scope.code_select_tips = false;
                $scope.open_code_tips = function () {
                    if ($scope.code_select_tips) {
                        $scope.code_select_tips = false;
                    } else {
                        $scope.code_select_tips = true;
                    }
                };
                //判断:当前元素是否是被筛选元素的子元素
                jQuery.fn.isChildOf = function (b) {
                    return (this.parents(b).length > 0);
                };
                //判断:当前元素是否是被筛选元素的子元素或者本身
                jQuery.fn.isChildAndSelfOf = function (b) {
                    return (this.closest(b).length > 0);
                };


                function insertChild(res, index) {
                    var obj = [];
                    var code_template = [
                        {
                            id: 1,
                            "className": "csharp"
                        }, {
                            id: 2,
                            "className": "csharp"
                        }, {
                            id: 3,
                            "className": "java"
                        }, {
                            id: 4,
                            "className": "java"
                        }, {
                            id: 5,
                            "className": "objectivec"
                        }, {
                            id: 6,
                            "className": "objectivec"
                        }, {
                            id: 7,
                            "className": "js"
                        }, {
                            id: 8,
                            "className": "go"
                        }, {
                            id: 9,
                            "className": "python"
                        }
                    ];
                    $.each(res, function (i, list) {
                        var list_obj = {
                            "type": index,
                            "id": list.id,
                            "name": list.name
                        };
                        $.each(code_template, function (i, item) {
                            if (item.id == list.id) {
                                list_obj.codeType = item.className;
                            } else {
                                list_obj.codeType = "js";
                            }
                        });
                        obj.push(list_obj);
                        if (list.child != null && list.child.length > 0) {
                            var childType = index + 1;
                            var childData = insertChild(list.child, childType);
                            $.each(childData, function (childI, childItem) {
                                var list_child_obj = {
                                    "type": childType,
                                    "id": childItem.id,
                                    "name": childItem.name
                                };
                                var str2 = "";
                                for (var i = 0; i < childType; i++) {
                                    str2 += "&nbsp;";
                                }
                                $.each(code_template, function (i, item) {
                                    if (item.id == childItem.id) {
                                        list_child_obj.codeType = item.className;
                                    } else {
                                        list_obj.codeType = "js";
                                    }
                                });
                                list_child_obj.html = str2;
                                obj.push(list_child_obj);
                            });
                        }
                    });
                    return obj;
                };
                $scope.refresh_code_dialog = function(){
                    var selectObj =  $scope.code_selected
                    code_template(selectObj);
                };
                var chose_code_selected = function (selectObj) {
                    $scope.code_selected = selectObj;
                    code_template(selectObj);
                };
                function code_template(selectObj){
                    $http({
                        method: 'get',
                        url: '/api/qry/api_code?' + 'api_id=' + $scope.code_view_id + '&template_id=' + selectObj.id,
                    }).success(function (data) {
                        if (data.errorcode == 0) {
                            $scope.code_res = data.result;
                            $scope.code_area = true;
                            $("#code-content-area").removeAttr("class").addClass("line-numbers code-toolbar language-" + selectObj.codeType);
                            var str = $("#code-content-area").text();
                            $("#code-content-area").html(str)
                            Prism.highlightElement(document.getElementById("code-content-area"), true);
                        } else {
                            $scope.code_res = data.errormsg;
                            $scope.code_area = true;
                            $("#code-content-area").removeAttr("class").addClass("line-numbers code-toolbar language-" + selectObj.codeType);
                            var str = $("#code-content-area").text();
                            $("#code-content-area").html(str)
                            Prism.highlightElement(document.getElementById("code-content-area"), true);
                        }
                    });
                };

                //查看生成代码
                $scope.code_view = function (id) {
                    $scope.code_view_id = id;
                    $scope.code_dialog_show = true;
                    $http.get('/api/qry/code_model')
                        .success(function (data) {
                            if (data.errorcode == 0) {
                                $scope.code_type_list = insertChild(data.result, 1);
                                //判断是否已经选择过语言种类
                                if (window.localStorage.codeId) {
                                    var selectObj = {};
                                    $.each($scope.code_type_list, function (i, list) {
                                        if (parseInt(list.id) == parseInt(window.localStorage.codeId)) {
                                            selectObj = list;
                                        }
                                    });
                                    chose_code_selected(selectObj);
                                } else {
                                    chose_code_selected($scope.code_type_list[0]);
                                    $scope.select_res = $scope.code_type_list;
                                }
                            }
                        });

                    $scope.code_blank = function (type) {
                        var str = "";
                        for (var i = 0; i < type; i++) {
                            str += "&nbsp;&nbsp;";
                        }
                        return str;
                    }

                    var client = new ZeroClipboard(document.getElementById("copy_code_btn"));
                    client.on("ready", function () {
                        client.on("aftercopy", function () {
                            $("#copy_code_success").html("复制成功").show();
                        });
                    });
                };

                $scope.close_code_dialog = function () {
                    $("#copy_code_success").hide();
                    $scope.code_dialog_show = false;
                };
                $scope.document_click = function () {
                    var target = event.target;
                    if ($(target).isChildAndSelfOf(".code-selected")) {
                        $scope.code_select_tips = true;
                    } else {
                        $scope.code_select_tips = false;
                    }
                };

                //点击选中语言种类
                $scope.chose_code_type = function (typeId) {
                    window.localStorage.codeId = typeId;
                    var selectObj = {};
                    $.each($scope.code_type_list, function (i, list) {
                        if (list.id == typeId) {
                            selectObj = list;
                        }
                    });
                    chose_code_selected(selectObj);
                    $scope.code_select_tips = false;
                };


            });
            angular.bootstrap(document, ['app']);
        });

    });
