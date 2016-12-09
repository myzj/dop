require(['lib/common', 'lib/jquery.twbsPagination.min'],
    function () {
        angular.element(document).ready(function () {
            var app = $.getApp();
            app.controller('myDoc', function ($scope, $http) {
                var pageSize = 50;
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

                $scope.show_importDialo = function () {
                    $(".import-dialog").show();
                };
                $scope.import_action = function () {

                    var a = $.trim($scope.text);
                    if(a.length <= 0){
                        return;
                    }

                    try{
                        var json = eval("(" + a + ")");
                    }catch (e){
                        alert("数据格式不正确");
                    }

                    json.is_replace = $("input[name='is_replace']:checked").val() === "true";
                    $http({
                        method: 'POST',
                        url: '/api/add/new_api/',
                        data: json,
                    }).success(function (data) {
                        alert(data.errormsg);
                        if(data.errorcode == 0){
                            getTeamDate(1, true);  //重新刷新
                        }
                    });
                };

                $scope.hide_importDialog = function () {
                    $scope.text = "";
                    $(".import-dialog").hide();
                };
                $scope.format = function () {
                    beautify();
                };
                function beautify() {
                    var source = $("#code_data").val();

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

                    $("#code_data").val(formated);

                }

            });
            angular.bootstrap(document, ['app']);
        });

    });
