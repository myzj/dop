/**
 * 下载app操作
 * returns {Object} 客户端浏览器引擎、浏览器、操作系统信息、场景
 */
define("widget/app", ["lib/common", "widget/ua", "config/url", "config/constant", 'widget/stat'], function($, widgetUa, configUrl, configConstant, widgetStat){
	
	var popAppdownDiv,	//appdown外层Div的className
		showBtmNavP,	//导航栏的className
		appDownClose,	//appdown关闭的className
		appDown,	//appdown下载className
        safariPrompt,   //safari提示的className
        safariPromptHide,   //safari提示关闭的className
        appCloseFlag,  //判断是否appdown关闭或下载
        promptCloseFlag;   //判断是否safariPrompt关闭
		
	/**
	 *显示底部导航栏，隐藏app下载
	 */
	function _closeAppDown(){
		
		popAppdownDiv.hide();
		showBtmNavP.show();

	}
	
	/**
	 * 根据用户当天是否第一次登陆来显示或隐藏app下载
	 * @params {Object} obj 传递的参数，如{type:'0|1使用app算法时间，0按天算，1按相隔毫秒算'，
	 * 								  time：'单位毫秒，只有type为1才用'}
	 */
	function _judgeShowHide(obj){
		
		var time = 60 * 60 * 24 * 365,
            nowDate,
			nowTime,
            tempDate = new Date(),
            appDownFlag = $.cookie.getH5("appDownFlag") || 0,
            safariPromptFlag = $.cookie.getH5("safariPromptFlag") || 0;

        if(obj.type == 0){
            var tempTime = new Date(parseInt(appDownFlag)),
                safariTempTime = new Date(parseInt(safariPromptFlag));
            nowDate = tempDate.getFullYear() + "-" + tempDate.getMonth() + "-" + tempDate.getDate();
            appDownFlag = tempTime.getFullYear() + "-" + tempTime.getMonth() + "-" + tempTime.getDate();
            safariPromptFlag = safariTempTime.getFullYear() + "-" + safariTempTime.getMonth() + "-" + safariTempTime.getDate();
//            var nextTime = newDate(tempTime + 86400000 - (tempTime.getHours() * 60 * 60 + tempTime.getMinutes() * 60 +
//                tempTime.getSeconds()) * 1000);
            nowTime = tempDate.getTime();
        }
        else{
            obj.time = obj.time || 60 * 60 * 24 * 1000;
            appDownFlag += parseInt(obj.time);
            safariPromptFlag += parseInt(obj.time);
            nowTime = nowDate = tempDate.getTime();
        }
		if(nowDate <= appDownFlag){
			popAppdownDiv.hide();
			showBtmNavP.show();
            if(widgetUa.broswer == 1 && nowDate > safariPromptFlag){
                safariPrompt.show();
                if(promptCloseFlag){
                    safariPrompt.hide();
                    $.cookie.addH5("safariPromptFlag", nowTime, "/", time, configUrl.cookieDomain);
                }
            }
		}
		else{
			popAppdownDiv.css("display", "table");	//这个需要注意一下 、特例
			showBtmNavP.hide();
            if(appCloseFlag){
                $.cookie.addH5("appDownFlag", nowTime, "/", time, configUrl.cookieDomain);
            }
		}

	}

	/**
	 * 根据不同的场景跳转下载地址
	 * @params {Objcet} obj 跳转的对象包含url和绑定跳转的按钮，如{iphoneUrl:'',androidUrl:''}
	 */
	function _redirectUrl(obj){
		
		var _url;	//跳转的地址
		obj.etcUrl = obj.etcUrl || $.url.getTouchBaseUrl() + "download/index";
		if(widgetUa.scene == 1){
			_url = obj.iphoneUrl || configConstant.iphoneAppUrl;	//iphone浏览器
			//上报
	        var iosData = {
	            'track_tag_name': '1015',
	            'result': '',
	            'page_content': '1',
	            'message': _url
	        };
	        widgetStat.shangbao(iosData);
		}
		else if(widgetUa.scene == 2){
			_url = obj.androidUrl || $.url.getTouchBaseUrl() + "download/index";//configConstant.apkUrl;	//android浏览器
		}
		else{
			_url = obj.etcUrl;	//etc
		}
        location.href = _url;

	}
	
	/**
	 * 跳转的对象包含url和绑定跳转的按钮，如obj={iphoneUrl:'',androidUrl:'', popAppdown: 外层appDownDiv的'className',
	 * 								showBtmNav: 导航栏的'className', appDownClose： appDown关闭按钮的'className',
	 * 							    safariPrompt: safari提示框的'className', safariPromptHide: safariPrompt关闭的'className',
	 * 								type:'0|1使用app算法时间，0按天算，1按相隔毫秒算',
	 * 								time：'单位毫秒，只有type为1才用'}
	 */
	function _init(obj) {

        var obj = obj || {};
		popAppdownDiv = $("." + (obj.popAppdown || "J_popAppdown"));
		showBtmNavP = $("." + (obj.showBtmNav || "J_showBtmNav"));
		appDownClose = $("." + (obj.appDownClose || "J_appDownClose"));
		appDown = $("." + (obj.appDown || "J_appDown"));
        safariPrompt = $("." + (obj.safariPrompt || "J_safariPrompt"));
        safariPromptHide = $("." + (obj.safariPromptHide || "J_safariPromptHide"));
        promptCloseFlag = appCloseFlag = false;
        _judgeShowHide(obj);
        appDown.on("click", function(){
            appCloseFlag = true;
            _judgeShowHide(obj);
            _closeAppDown();
            _redirectUrl(obj);
        });
		appDownClose.on("click", function(){
            appCloseFlag = true;
            _judgeShowHide(obj);
            _closeAppDown();
        });
        safariPromptHide.on("click", function(){
            promptCloseFlag = true;
            _judgeShowHide(obj);
        });
		
	}
	
	return {
		
		init: _init
		
	}
	
});