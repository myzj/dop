define('widget/sidebarHP', ['lib/common', 'config/url', 'widget/imgErr'], function ($, url,imgerr) {
    function sidebarHP(data,type) {
        var html = '<div class="touchweb_mask">' +
            '			<div class="sidebar_back">' +
            '				<span>点击此处返回</span>' +
            '			</div>' +
            '			<div class="sidebar_nav">' +
            '				<div class="sidebar_header">赠品换购</div>' +
            '				<div class="sidebar_nav_list">' +
            '					<ul>';
                        if (type==1) {
                            html += "<li class='cart_select_huan'>提示:换购商品请在购物车领取</li>";
                        };
        html +=
            '						{{each data as value i}}' +
            '						<li>' +
            '							<div class="sidebar_title">' +
            '								<div class="sidebar_title_text">{{value.PromTitle}}</div>' +
            '								<div class="sidebar_title_Icon"><i class="iconfont">&#xe608;</i></div>' +
            '							</div>' +
            '							<div class="sidebar_list">' +
            '								<ul>' +
            '						{{each value.Json as item j}}' +
            '									<li>' +
            '										<div class="sidebar_product">' +
            '											<div class="sidebar_product_img {{if item.Stock==0}}imgdisable{{/if}}">' +
            '												<img src="{{if item.PicUrl!=null}}{{item.PicUrl | ProductImg:2}}{{else}}{{item.ShowImgUrl | ProductImg:2}}{{/if}}" data-imgsrc="' + url.LocalUrl + 'img/imgerr/err72x72.png"/>' +
            '											</div>' +
            '											<div class="sidebar_product_text">' +
            '												<div class="sidebar_text_count">' +
            '													<div class="sidebar_product_name">{{if item.ProductName!=null}}{{if item.ProductName.length    < 25 }}{{item.ProductName}}{{else}}{{item.ProductName.substring(0,25)}}…{{/if}}{{/if}}</div>' +
            '													<div class="sidebar_product_num">¥{{item.PromPriceShow==null ? item.SalePrice:item.PromPriceShow}}</div>' +
            '												</div>' +
            '											{{if value.isUse}}	<div class="sidebar_text_CK {{if item.Stock==0 || item.IsSaleState==false}}ckdisable{{/if}}">' +
            '													<span class="checkbox" data-ProductId="{{item.ProductId}}" data-PromSysNos="{{item.PromSysNos}}" data-ProductType="{{item.ProductType}}">' +
            '												        <input type="radio" id="ck{{item.ProductId}}" name="ra{{value.PromID}}" {{if item.Stock==0 || item.IsSaleState==false}}disabled="disabled"{{/if}} {{if item.ProductId==value.isSelID}}checked="checked"{{/if}}/>' +
            '												        <label for="ck{{item.ProductId}}" data-on="a"><i class="icon iconfont">&#xe617;</i></label>' +
            '    												</span>' +
            '												</div> {{/if}}' +
            '											</div>' +
            '										</div>' +
            '									</li>' +
            '						{{/each}}' +
            '								</ul>' +
            '							</div>' +
            '						</li>' +
            '						{{/each}}' +
            '								</ul>' +
            '							</div>' +
            '						</li>' +
            '					</ul>' +
            '				</div>' +
            '			</div>' +
            '		</div>';
        var render = $.tpl.compile(html);
        var info = render(data);
        $(".touchweb_mask").remove();
        $("body").append(info).addClass("disablescroll"); 
        $(".touchweb_mask").show().addClass("sidebarshow");
        $(".sidebar_back").on("click", function () {
            $(".touchweb_mask").removeClass("sidebarshow").hide();
            $("body").append(info).removeClass("disablescroll"); 
        });
        imgerr.error({});
    }
    return {
        sidebarHP: sidebarHP
    }
});