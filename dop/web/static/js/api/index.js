define("api/index",["config/url","api/CommonAPI"],function(e,t){return{queryHotProductPageList:{url:e.indexDomain+"QueryHotProductPageList",post:{PageIndex:"?",PageSize:"?",SourceTypeSysNo:t.commonObj.SourceTypeSysNo,DisplayLabel:t.commonObj.DisplayLabel,ApplyPlace:"9"}},queryHotProductSpecialList:{url:e.indexDomain+"QueryHotProductSpecialList",post:{SourceTypeSysNo:t.commonObj.SourceTypeSysNo,DisplayLabel:t.commonObj.DisplayLabel,ApplyPlace:"1"}},queryTopSpecialShow:{url:e.localloginDomain+"Home/QueryTopSpecial",post:{Top:"3",PageIndex:"?",PageSize:"?"}},getHomeAdModuleDataList:{url:e.localloginDomain+"Home/GetHomeAdModuleDataList",post:{adkey:"?"}},QueryPromPriceByProdId:{url:e.orderDomain+"QueryPromPriceByProdId",post:{ProductIdList:"?",Guid:t.commonObj.Guid,SourceTypeSysNo:t.commonObj.SourceTypeSysNo,DisplayLabel:t.commonObj.DisplayLabel}},QueryHotProductSpecialPageListTrans:{url:e.indexDomain+"QueryHotProductSpecialPageListTrans",post:{ApplyPlace:"?",PageIndex:"?",PageSize:"?",UserId:"?",Guid:t.commonObj.Guid,SourceTypeSysNo:t.commonObj.SourceTypeSysNo,DisplayLabel:t.commonObj.DisplayLabel,AreaSysNo:"?",ChannelID:"?",ExtensionSysNo:"[0]",ClientIp:"?"}}}});