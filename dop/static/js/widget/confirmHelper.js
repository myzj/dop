define('widget/confirmHelper', ['lib/common'], function($) {
	function confirmHP(paramData,okcallback,cancelCallback){
		//tipsContent 弹窗内容 
		//confirm 确认按钮显示的文字 
		//cancel 取消按钮显示的文字 
		//okcallback 成功调用的回调函数
		//cancelCallback 取消回调函数
		var confirmCfg = {
						'tipsContent':'',
						'confirm':'',
						'cancel':'',
						'calssName':''
		};
		var paramData = paramData || {};
		$.merge(confirmCfg,paramData);
		confirmCfg.confirm=confirmCfg.confirm||'确认';
		confirmCfg.cancel=confirmCfg.cancel||'取消';
		confirmCfg.calssName=confirmCfg.calssName||'popcon_nr';
		var contentHtml='<div class="popcon_box J_box"><div class="popcon J_showChangeCity"><div class="popcon_box"><div class="popcon_nrbox"><p class="popcon_tit clearfix"></p><p class="'+confirmCfg.calssName+'">'+confirmCfg.tipsContent+'</p><p class="popc_btnbox clearfix"><a href="javascript:;" class="btnb J_confirm">'+confirmCfg.confirm+'</a> <a href="javascript:;" class="btna J_cancel">'+confirmCfg.cancel+'</a></p></div></div></div>';
		$('body').append(contentHtml);
		$(".J_confirm").on("click",function(){
			$(".J_box").remove();
			okcallback()||'';
		});
		$('.J_cancel').on("click",function(){
			$(".J_box").remove();
			cancelCallback||'';
		});
	}
	return {
		confirmHP:confirmHP
	}
});