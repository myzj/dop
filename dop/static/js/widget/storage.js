/**
 * sessionStorage  localStorage
 * 只做对sessionStorage 和 localStorage数据存取，不做业务逻辑处理 如解析json
 */
define('widget/storage', function() {
	return {
        isSupportLocalStorage: function() {
            if((typeof localStorage == 'undefined')) {
                return false;
            }
            try {
                localStorage.setItem('testPrivate', 1);
                localStorage.removeItem('testPrivate');
            } catch (e) {
                return false;
            }
            return true;
        },
        isSupportSessionStorage: function() {
            if((typeof sessionStorage == 'undefined')) {
                return false;
            }
            try {
                sessionStorage.setItem('testPrivate', 1);
                sessionStorage.removeItem('testPrivate');
            } catch (e) {
                return false;
            }
            return true;
        },
		//获取SessionStorage
		getSessionStorage: function(key) {
            try {
			    var str = sessionStorage.getItem(key);
            } catch (e) {
                return undefined;
            }
			return str;
		},
		//设置SessionStorage
		setSessionStorage: function(key, value) {
			if (!key) {
				return;
			}
            try{
			    sessionStorage.setItem(key, str);
            } catch (e) {
                //
            }
		},
		//移除某个SessionStorage
		removeSessionStorage: function(key) {
            try {
                sessionStorage.removeItem(key);
            } catch (e) {
                //
            }
		},
		//获取LocalStorage
		getLocalStorage: function(key) {
            try{
                var str = localStorage.getItem(key);
            } catch (e) {
                return undefined;
            }
			return str;
		},
		//设置LocalStorage
		setLocalStorage: function(key, value) {
			if (!key) {
				return;
			}
			try{
			    localStorage.setItem(key, value);
            } catch (e) {
                return undefined;
            }
		},
        //移除某个localStorage
        removeLocalStorage: function(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                //
            }
        }
	}
})