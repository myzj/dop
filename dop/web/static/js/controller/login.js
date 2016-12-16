require(['lib/common', 'model/login/loginModel'],
    function ($, loginModel) {
        $('#loginIn-btn').on('click', function () {
            var datainfo = {
                post: {
                    "username": $('#form-username').val().trim(),
                    "password": $('#form-password').val().trim()
                }
            };
            loginModel.login(datainfo, function (data) {
                if (data.success) {
                    window.location.href = window.webRoot + 'teamlist'
                }
            });
        });

        $('#signUp-btn').on('click', function () {
            var datainfo = {
                post: {
                    "username": $('#form-username').val().trim(),
                    "password": $('#form-password').val().trim(),
                    "checkcode": $('#form-imgCode').val().trim()
                }
            };
            loginModel.signUp(datainfo, function (data) {
                if (data.success) {
                    if(data.errorcode == 0){
                        alert('您已注册成功，点击确定进行登陆！');
                        window.location.href = window.webRoot + 'login'
                    }else{
                        alert(data.errormsg)
                    }
                }else{
                    alert(data.errormsg)
                }
            });
        })
    });
