require(['lib/common', 'lib/jquery.twbsPagination.min', 'lib/prism'],
    function () {
        angular.element(document).ready(function () {
            var app = $.getApp();
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
                    beautify(source, function(val){
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

                //查看生成代码
                $scope.code_view = function (id) {
                    $scope.code_dialog_show = true;
                    $http.get('/api/qry/code_model')
                        .success(function (data) {
                            var dataList = [];
                            $scope.code_t_list_selected = data.result[0];
                            if (data.errorcode == 0) {
                                $.each(data.result, function (i, list) {
                                    if (list.child != null && list.child.length > 0) {
                                        dataList.push(
                                            {
                                                "type": 2,  //2有子节点
                                                "id": list.id,
                                                "name": list.name
                                            }
                                        );
                                        $.each(list.child, function (i, item) {
                                            dataList.push(
                                                {
                                                    "type": 3,  //3为子节点
                                                    "id": item.id,
                                                    "name": item.name
                                                }
                                            );
                                        });
                                    } else {
                                        dataList.push(
                                            {
                                                "type": 1,  //1为没有子节点
                                                "id": list.id,
                                                "name": list.name
                                            }
                                        );
                                    }
                                })
                                $scope.code_type_list = dataList;
                                //判断是否已经选择过语言种类
                                if(window.localStorage.codeId){
                                    var selectObj = {};
                                    $.each($scope.code_type_list, function(i, list){
                                        if(parseInt(list.id) == parseInt(window.localStorage.codeId)){
                                            selectObj = list;
                                        }
                                    });
                                    $scope.code_selected = selectObj;
                                }else{
                                    $scope.select_res = dataList[0]
                                }


                            }
                        });


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
                $scope.document_click = function(){
                    var target = event.target;
                    if ($(target).isChildAndSelfOf(".code-selected")) {
                        $scope.code_select_tips = true;
                    }else{
                        $scope.code_select_tips = false;
                    }
                };

                //点击选中语言种类
                $scope.chose_code_type = function(typeId){
                    window.localStorage.codeId = typeId;
                    var selectObj = {};
                    $.each($scope.code_type_list, function(i, list){
                        if(list.id == typeId){
                            selectObj = list;
                        }
                    });

                    $scope.code_selected = selectObj;
                    $scope.code_select_tips = false;
                };

            });
            angular.bootstrap(document, ['app']);
        });

    });
