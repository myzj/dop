require(['lib/common','model/login/loginModel'],
    function($,loginModel){
        $('.form-btn').on('click',function(){
            var datainfo = {
                post:{
                    "username": $('#form-username').val().trim(),
                    "password": $('#form-password').val().trim()
                    }
            };
            loginModel.login(datainfo,function(data){
                if(data.success){
                    window.location.href = window.webRoot + 'teamlist'
                }
            });
        })
});
