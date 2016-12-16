require(['lib/common', 'model/login/loginModel'],
    function ($, loginModel) {
        $(document).keydown(function (e) {
            if (e.keyCode == 13) {
                var hostUrl = window.location.href;
                var isLogin = hostUrl.indexOf('login') > 0 ? true : false;
                var isRegister = hostUrl.indexOf('register') > 0 ? true : false;
                if (isLogin) {
                    login();
                }
                ;
                if (isRegister) {
                    register();
                }
            }
        });
        $('#loginIn-btn').on('click', function () {
            login();
        });
        $('#signUp-btn').on('click', function () {
            register();
        });
        function login() {
            var datainfo = {
                post: {
                    "username": $('#form-username').val().trim(),
                    "password": $('#form-password').val().trim()
                }
            };
            loginModel.login(datainfo, function (data) {
                if (data.success) {
                    if (data.errorcode == 0) {
                        window.location.href = window.webRoot + 'teamlist'
                    } else {
                        alert(data.errormsg)
                    }
                } else {
                    alert(data.errormsg)
                }
            });
        };
        function register() {
            var datainfo = {
                post: {
                    "username": $('#form-username').val().trim(),
                    "password": $('#form-password').val().trim(),
                    "checkcode": $('#form-imgCode').val().trim()
                }
            };
            loginModel.signUp(datainfo, function (data) {
                if (data.success) {
                    if (data.errorcode == 0) {
                        alert('您已注册成功，点击确定进行登陆！');
                        window.location.href = window.webRoot + 'login'
                    } else {
                        alert(data.errormsg)
                    }
                } else {
                    alert(data.errormsg)
                }
            });
        }
    });
