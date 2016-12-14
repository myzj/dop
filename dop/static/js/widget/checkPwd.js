define('widget/checkPwd',['lib/common'] ,function($) {

	var params={
		leng   : /^[0-9A-Za-z`~!@#$%^&*()_\-+=\[\]{}\\|;'':"",.\/<>?]{6,16}$/, // 6-16位
		digit  : /^[0-9]+$/,                                                   // 匹配数字
		letter : /^[A-Za-z]+$/,                                                // 匹配字母
		symbol : /^[`~!@#$%^&*()_\-+=\[\]{}\\|;'':"",.\/<>?]+$/                // 匹配符号
	}
	// 获取变量
	function getParams(){
		return params;
	}
	
	// 密码验证方法
	function pwdValidate(pwddata) {
		//不能为纯数子，纯字母，必须大于或等6个字符，必须字母数组组合
		if(!pwddata.match(params.leng)){
			return false;
		}
		if(pwddata.match(params.digit) || pwddata.match(params.letter) || pwddata.match(params.symbol)){
			return false;
		}
		return true;
	}

	// 通用验证 'widget/validateForm' 中的 validateForm.verify() 中使用
	function geVerify(){
		return [
			{info:'密码不能为空'},
	    	{info:'密码不能存在中文',regular:/^[^\u4e00-\u9fa5]+$/},
	    	{info:'密码格式错误,请输6~16个英文字符加数字组合',regular:params.leng},
	    	{info:'密码不能为纯数字、纯英文、纯符号',return:pwdValidate}
	    ]
	}

	return {
		pwdValidate : pwdValidate,
		getParams   : getParams,
		geVerify    : geVerify
	}
})