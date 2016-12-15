/**
 * Created by holyca on 2016/4/21.
 */
define('lib/geetestValidation',
    ['model/MemberManagement/MemberManagementModel', 'http://static.geetest.com/static/tools/gt.js'],
    function (modelAccount) {

        var _default = {
            appendEle: document.getElementById("geetDom"),
            bindEle: document.getElementById("triggerGeetBtn"),
            product: 'embed'
        };

        function getGeetestService(obj, callback) {
            $.merge(_default, obj);
            modelAccount.GetGeePictureBack(function (data) {
                // 使用initGeetest接口
                // 参数1：配置参数，与创建Geetest实例时接受的参数一致
                // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
                initGeetest({
                    gt: data.gt,
                    challenge: data.challenge,
                    product: _default.product, // 产品形式
                    offline: !data.success
                }, function (captchaObj) {

                    $(_default.appendEle).length && captchaObj.appendTo(_default.appendEle);
                    $(_default.bindEle).length && captchaObj.bindOn(_default.bindEle);

                    $(_default.bindEle).on('click',function(){
                        captchaObj.refresh();
                        $(_default.appendEle).show()
                    });

                    $(_default.appendEle).click(function(){
                        $(_default.appendEle).hide();

                    });

                    captchaObj.onReady(function(){
                        _default.appendEle.firstChild.addEventListener("click", function (e) {
                            e.stopPropagation();
                        });
                    });

                    captchaObj.onSuccess(function () {

                        // 如果验证成功，返回验证码的结果（三个需要传给后台进行二次验证的值）对象。其他情况返回false。

                        //将二次验证对象参数，先分割成数组在组成字符串 格式为 key1=value1&key2=value2
                        var geetSecondItem = captchaObj.getValidate();
                        var validateMsgArr = [];

                        for (var i in geetSecondItem) {

                            if (i == "geetest_challenge") {
                                validateMsgArr.push("fnGeetestChallenge=" + geetSecondItem.geetest_challenge)
                            }
                            if (i == "geetest_validate") {
                                validateMsgArr.push("fnGeetestValidate=" + geetSecondItem.geetest_validate)
                            }
                            if (i == "geetest_seccode") {
                                validateMsgArr.push("fnGeetestSeccode=" + geetSecondItem.geetest_seccode)
                            }
                        }
                        $(_default.appendEle).hide();
                        callback && callback(captchaObj, validateMsgArr.join("&"));
                    });
                });

            })

        }

        return {

            getGeetestService: getGeetestService //二次验证参数

        }

    });