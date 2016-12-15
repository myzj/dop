define("widget/cartApp", ["lib/common", "model/cart/cart", "widget/appApi", "widget/addCartAnim", "widget/loading"],
    function($, modelCartCart, widgetAppApi, widgetAddCartAnim, widgetLoading){

        "use strict"

        var osType = widgetAppApi.getAppid(),
            fnArr = [initAndroidApp, initIphoneApp, initTouch, "", "", "", "", "", initTouch],  //场景数组
            appApi = widgetAppApi.distScene(osType, fnArr);
        appApi.addCartOver = addCartOver;

        /**
         * 添加购物车结束
         * @param {Object} data 结束后的返回参数
         */
        function addCartOver(data, thisObj, appendObj, imgSize){

            widgetLoading.on(false);
            if(data.errorCode == 0) {
                widgetAddCartAnim.cartAnim(thisObj, appendObj, imgSize, data.body.total_items);
            } else {
                $.alert(data.errorDesc || "~亲 ,加入购物车失败,请重新加入");
            }

        }

        /**
         * 添加购物车
         */
        function addShopCart(cartData, thisObj, appendObj, imgSize){

            if(osType == 1){
                var data = appApi.bridge.callHandler("addCart", JSON.stringify(cartData));
                addCartOver(data, thisObj, appendObj, imgSize);
                return true;
            }
            else if(osType == 2){
                appApi.bridge.callHandler("addCart", JSON.stringify(cartData), function(data){
                    addCartOver(data, thisObj, appendObj, imgSize);
                    return true;
                });
            }
            else{
                modelCartCart.addCart(cartData, function(data) {
                    addCartOver(data, thisObj, appendObj, imgSize);
                    return true;
                });
            }

        }

        /**
         * iphone app添加购物车
         */
        function iphoneAddShopCart(cartData, callback){

            appApi.bridge.callHandler("addCart", JSON.stringify(cartData), function(data){
                callback && callback(data);
            });

        }

        /**
         * android app添加购物车
         */
        function androidAddShopCart(cartData, callback){

            var data = appApi.bridge.callHandler("addCart", JSON.stringify(cartData));
            callback && callback(data);
        }

        /**
         * 触屏添加购物车
         */
        function touchAddShopCart(cartData, callback){

            modelCartCart.addCart(cartData, function(data) {
                callback && callback(data);
            });

        }

        /**
         * iphone app修改购物车
         * @param {Object} cartData
         */
        function iphoneModifyShopCart(cartData, callback){

            appApi.bridge.callHandler("modifyShopCart", JSON.stringify(cartData), function(data){
                callback && callback(data);
            });

        }

        /**
         * android app修改购物车
         * @param {Object} cartData
         */
        function androidModifyShopCart(cartData, callback){

            var data = appApi.bridge.callHandler("modifyShopCart", JSON.stringify(cartData));
            callback && callback(data);

        }

        /**
         * 触屏修改购物车
         * @param {Object} cartData
         */
        function touchModifyShopCart(cartData, callback){

            modelCartCart.editCart(cartData, function(data){
                callback && callback(data);
            });

        }

        /**
         * iphone app删除购物车
         */
        function iphoneRemoveShopCart(cartData, callback){

            appApi.bridge.callHandler("removeShopCart", JSON.stringify(cartData), function(data){
                callback && callback(data);
            });

        }

        /**
         * android app删除购物车
         */
        function androidRemoveShopCart(cartData, callback){

            var data = appApi.bridge.callHandler("removeShopCart", JSON.stringify(cartData));
            callback && callback(data);

        }

        /**
         * touch删除购物车
         */
        function touchRemoveShopCart(cartData, callback){

            modelCartCart.delCart(cartData, function(data){
                callback && callback(data);
			});

        }

        /**
         * iphone app查询购物车
         * @param {Object} cartData
         */
        function iphoneQueryShopCart(cartData, callback){

            appApi.bridge.callHandler("queryShopCart", JSON.stringify(cartData), function(data){
                callback && callback(data);
            });

        }

        /**
         * android app查询购物车
         * @param {Object} cartData
         */
        function androidQueryShopCart(cartData, callback){

            var data = appApi.bridge.callHandler("queryShopCart", JSON.stringify(cartData));
            callback && callback(data);

        }

        /**
         * 触屏查询购物车
         * @param {Object} cartData
         */
        function touchQueryShopCart(cartData, callback){

            modelCartCart.queryCart(cartData, function(data){
                callback && callback(data);
            });

        }

        /**
         * 获取iphone app购物车数量
         * @param callback
         */
        function iphoneQueryShopCartNum(callback){

            appApi.bridge.callHandler("queryShopCartNum", "", function(data){
                callback && callback(data);
            });

        }

        /**
         * 获取android app购物车数量
         * @param callback
         */
        function androidQueryShopCartNum(callback){

            var data = appApi.bridge.callHandler("queryShopCartNum", "");
            callback && callback(data);

        }

        /**
         * 初始化iphone app
         */
        function initIphoneApp(){

            appApi.addShopCart = iphoneAddShopCart;
            appApi.modifyShopCart = iphoneModifyShopCart;
            appApi.removeShopCart = iphoneRemoveShopCart;
            appApi.queryShopCart = iphoneQueryShopCart;
            appApi.queryShopCartNum = iphoneQueryShopCartNum;

        }

        /**
         * 初始化android app
         */
        function initAndroidApp(){

            appApi.addShopCart = androidAddShopCart;
            appApi.modifyShopCart = androidModifyShopCart;
            appApi.removeShopCart = androidRemoveShopCart;
            appApi.queryShopCart = androidQueryShopCart;
            appApi.queryShopCartNum = androidQueryShopCartNum;

        }

        /**
         * 初始化触屏
         */
        function initTouch(){

            appApi.addShopCart = touchAddShopCart;
            appApi.modifyShopCart = touchModifyShopCart;
            appApi.removeShopCart = touchRemoveShopCart;
            appApi.queryShopCart = touchQueryShopCart;
            appApi.queryShopCartNum = function(){};

        }

        return {
            appApi: appApi
        }

    }
);