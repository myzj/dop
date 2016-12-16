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

            console.log("datainfo.post=", datainfo.post);
            loginModel.signUp(datainfo, function (data) {
                if (data.success) {
                    window.location.href = window.webRoot + 'teamlist'
                }
            });
        })
    });
