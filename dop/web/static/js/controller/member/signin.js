require(['lib/common', 'model/signinModel/signinModel','lib/calendarwidget'],
    function ($, signinModel, calendarwidget) {
        $.hiddenShareBtn();
        queryMemberSignRecord();
        function queryMemberSignRecord(){
            $.loading(true);
            signinModel.queryMemberSignRecord(function(res){
                $.loading(false);
                var data = res.result;
                data.callback = function(){
                    $("#CalendarMain,.signin-more ,.rule").show();
                }
                if(res.success){
                    $("#sign-content").remove();
                    $.tplRender("tpl_signin", data);
                    calendarwidget.calendar(res.result);
                }
                bindAction();
            });
        }
        function bindAction(){
            $.getMemberInfo(function(res){
                if(res.result.MemberEntity.HeadImg != null && res.result.MemberEntity.HeadImg.length >0){
                    $("#userLogo").append("<img src=" + $.replaceHttp(res.result.MemberEntity.HeadImg) +">");
                }else{
                    $("#userLogo").append('<img src="' +  window.boodll + 'images/20.png">');
                }
                $("#userLogo img").attr("onerror", "this.src='"+ window.boodll +"images/20.png'");

            });
            $("#sign").not(".hasSign").unbind().bind("click", function(){
                $.loading(true);
                signinModel.memberSign(function(data) {
                    $.loading(false);
                    if($('#dialoginfo').length > 0){
                        $('#dialoginfo').css('display','none');
                    }
                    var res = data.result;
                    if(data.success){
                        if(res.DoFlag){
                            queryMemberSignRecord();
                            $("#dialoginfo").css('display','block');
                            $(".dialoginfo_tit").html("签到成功");
                            $(".dialoginfo_con").html(res.DoResult);
                            $(".close_box").unbind().bind("click", function(){
                                $("#dialoginfo").css('display','none');
                            });
                            $(".share").unbind().bind("click", function(){
                                signinModel.memberGetinfo(function(res){
                                    $.loading(false);
                                    var data = res.result;
                                    if(res.success){
                                        $.appShareFunction({
                                            imgUrl: window.httpType + ":" + window.boodll +"images/member/share_coupon.jpg",
                                            url: window.httpType + ":" +  window.webRoot + 'sales/member/signinshare?babycoin='+ data.TotalBabyCurrency + '&coupon='+ data.TotalCouponAmount,
                                            desc: "签到也可以赚红包，母婴之家送钱还送宝贝币。我要做个勤俭的败家娘们！",
                                            title: '我在母婴之家签到赚红包',
                                        });
                                    }
                                });
                                });
                       }else{
                            $.iosDialog({
                                tips:res.DoResult,
                                cancelHtml:"知道了"
                            });
                        }
                    }else{
                        $.iosDialog({
                            tips:data.errormsg,
                            cancelHtml:"确定"
                        });
                    }
                });
            });
        }
    }
);



