define("widget/slide", ["lib/common"], function($){

    "use strict"

    /**
     * 滑动函数
     * @param {Object} container 最外层包含框标签
     * @param {Object} option: {startIndex: int, startIndex: int, continuous: boolean, showNum: int, slideSpeed: int}
     */
    function slide(container, option){

        var container = container || {},
            innerContainer = container.children && container.children[0],
            option = option || {},
            startIndex = option.startIndex | 0,
            continuous = !!option.continuous,
            showNum = option.showNum || 3,
            slideSpeed = option.speed || 300,
            scrollFlag = !!option.scrollFlag,
            touchFlag, slides, slidesLength, slideWidth, slidesPos, transitionFlag,
            startPoint, deltaPoint, touchSlide, slideBoundFlag;

        if(!container || !innerContainer){
            return;
        }

        this.doSlide = doSlide;

        /**
         * 初始化
         */
        function init(){

            var bound = container.getBoundingClientRect(),
                width = bound && (bound.width || (bound.right - bound.left)) || container.offsetWidth;

            touchFlag = "ontouchstart" in window;
            slides = innerContainer.children;
            slidesLength = slides.length;
            slideWidth = (width / showNum) | 0;
            slidesPos = new Array(slidesLength);
            innerContainer.style.width = slidesLength * slideWidth + "px";
            slideBoundFlag = false;
            transitionFlag = (function(tag){
                var prop = ["transition", "WebkitTransition", "MozTransition", "OTransition", "msTransition"];
                for(var i=0, length=prop.length; i<length; i++){
                    if(tag.style[prop[i]] !== undefined){
                        return true;
                    }
                }
                return false;
            })(container);
            for(var i=0; i<slidesLength; i++){
                slides[i].style.width = slideWidth + "px";
                if(transitionFlag){
                	slides[i].setAttribute("data-index", i);
                    slides[i].style.left = -(i * slideWidth) + "px";
                    move(i, Math.min(Math.max(i - startIndex, -1), showNum) * slideWidth, 0 , 0);
                }
                else{
                    slides[i].style.left = slideWidth * (i - startIndex) + "px";
                }
            }
            container.style.overflow = innerContainer.style.overflow = "hidden";

        }

        function exitExecution(fun){

            var fun = fun || function(){};
            setTimeout(fun, 0)

        }

        /**
         * 获取指定的父元素
         * @param {Object} target 目标对象
         * @returns {Object} 指定元素
         */
        function getAppointParent(target){

            if(target && target.getAttribute("data-index") == "0" || target.getAttribute("data-index")){
                return target;
            }
            else{
                if(target.parentElement){
                    return getAppointParent(target.parentElement);
                }
                else{
                    return {};
                }
            }

        }

        /**
         * 获得下标位置
         * @param {Int} index 下标
         * @returns {Int} index 下标
         */
        function modulus(index){

            return (slidesLength + index) % slidesLength;

        }

        /**
         * 限制值
         * @param {Int} index 下标
         * @param {Int} low 下限
         * @param {Int} up 上限
         * @returns {Int} 限制值
         */
        function constraint(index, low, up){

            return Math.min(Math.max(index, low), up);

        }

        /**
         * 移动
         * @param {Int} index 下标
         * @param {Int} distX X轴的距离
         * @param {Int} distY Y轴的距离
         * @param {Int} speed 速度
         */
        function move(index, distX, distY, speed){

            translate(index, distX, distY, speed);
            slidesPos[index] = distX || distY || 0;

        }

        /**
         * 后退
         * @param {Int} speed 速度
         */
        function previous(speed){

            if(continuous || startIndex){
                doSlide(startIndex - 1, speed);
            }

        }

        /**
         * 前进
         * @param {Int} speed 速度
         */
        function next(speed){

            if(continuous || (startIndex < slidesLength - 1 - showNum)){
                doSlide(startIndex + 1, speed);
            }

        }

        /**
         * 滑动
         * @param {Int} to 目标下标
         * @param {Int} speed 速度
         */
        function doSlide(to, speed){

            var to = to,
                speed = speed || slideSpeed,
                distX = 0,
                distY = 0,
                directionDiff,
                diff = 0,
                direction;
            if(to !== 0 && !to || to == startIndex || slidesLength <= showNum){
                return ;
            }
            if(speed !== 0){
                speed = speed || slideSpeed;
            }

            if(transitionFlag){
                directionDiff = startIndex - to;
                direction = Math.abs(startIndex - to) / (startIndex - to);
                diff = Math.abs(directionDiff);
                if(continuous){
                    for(var i=0; i<diff; i++){
                        distX = slidesPos[i] + directionDiff * slideWidth;
                        move(startIndex + direction * i, distX , distY, speed);
                    }
                }
                else{
                    if(direction < 0){
                        if(to > slidesLength - showNum){
                            to = slidesLength - showNum;
                        }
                        for(var i=0; i<diff + showNum; i++){
                            distX = Math.max((startIndex + i - to) * slideWidth, -slideWidth);
                            move(startIndex + i, distX, distY, speed);
                        }
                    }
                    else{
                        for(var i=0; i<diff + showNum; i++){
//                            distX = Math.min((to + i) * slideWidth, showNum * slideWidth);
                            distX = Math.min(i * slideWidth, showNum * slideWidth);
                            move(to + i, distX, distY, speed);
                        }
                    }
                    to = modulus(to);
                    startIndex = to;
                }
            }
            else{
                //TODO JS动画
                animate();
            }

        }

        /**
         * 移动
         * @param {Int} index 下标
         * @param {Int} dist 距离
         * @param {Int} speed 速度
         */
        function translate(index, distX, distY, speed){
            //TODO Y轴
            var index = (index !==0 && !index) ? startIndex : index;
            if(slides[index] === undefined || !slides[index].style){
                return ;
            }
            var style = slides[index].style,
                speed = (speed !== 0 && !speed) ? slideSpeed : speed,
                distX = distX | 0,
                distY = distY | 0,
                durationProp = ["transitionDuration", "webkitTransitionDuration", "MozTransitionDuration", "OTransitionDuration", "msTransitionDuration"],
                dLength = durationProp.length;
                //transFormProp = ["transForm", "webkitTransform", "MozTransform", "OTransform", "msTransform"],
                //tLength = transFormProp.length;

            for(var i=0; i<dLength; i++){
                slides[index].style[durationProp[i]] = speed + "ms";
                //slides[index].style[transFormProp[i]] ="translate(" + distX + "px, " + distY + "px)" + "translateZ(0)";
            }
            style.webkitTransform = "translate(" + distX + "px," + distY + "px)" + "translateZ(0)";
            style.msTransform =
            style.MozTransform =
            style.OTransform = "translate(" + distX + "px," + distY + "px)";

        }

        /**
         * 动画
         *
         */
        function animate(){

        }

        /**
         * 事件
         */
        var events = {

            handleEvent: function(event){
                switch(event.type){
                    case "touchstart":
                        this.touchStart(event);
                        break;
                    case "touchmove":
                        this.touchMove(event);
                        break;
                    case "touchend":
                        exitExecution(this.touchEnd(event));
                        break;
                    case "transitionend":
                    case "webkitTransitionEnd":
                    case "msTransitionEnd":
                    case "oTransitionEnd":
                    case "otransitionend":
                        exitExecution(this.transitionEnd(event));
                        break;
                    case "resize":
                        exitExecution(init);
                        break;
                }
            },
            changeHandlerEvent: function(event){
            	//TODO 更改事件
            },
            touchStart: function(event){
                var event = event || window.event,
                    touch = event.touches[0] || {};
                //event.preventDefault();
                touchSlide = getAppointParent(touch.target);
                startPoint = {
                    "x": touch.pageX,
                    "y": touch.pageY,
                    "time": new Date()
                };
                innerContainer.addEventListener('touchmove', this, false);
                //innerContainer.addEventListener('touchend', this, false);
            },
            touchMove: function(event){
                var event = event || window.event;
                event.preventDefault();
                if(event.touches.length > 1 || event.scale && event.scale !== 1){
                    return ;
                }
                var touch = event.touches[0];
                deltaPoint = {
                    "x": touch.pageX - startPoint["x"],
                    "y": touch.pageY - startPoint["y"]
                };
                if(!scrollFlag){
                    if(continuous){
                        //TODO 循环
                    }
                    else{
                        var direction = Math.abs(deltaPoint["x"]) / deltaPoint["x"];    //-1左，1右
                            //touchIndex = touchSlide.getAttribute("data-index") | 0,
                        	//tempIndex = deltaPoint["x"] > 0 ? (startIndex - 1) : (deltaPoint["x"] == 0 ? startIndex : startIndex + 1);
//                            tempIndex = startIndex;
                        if(direction < 0 && startIndex + showNum >= slidesLength || direction > 0 && startIndex <= 0 || startPoint["x"] <= 0 || startPoint["x"] >= showNum * slideWidth){
                            slideBoundFlag = true;
                            startPoint["x"] = touch.pageX;
                            deltaPoint["x"] = 0;
                            return ;
                        }
                        if(direction > 0){
                            for(var i=-1; i<showNum; i++){
                                translate(startIndex + i, deltaPoint["x"] + slidesPos[startIndex + i], 0, 0);
//                                if(i == startIndex + showNum-1){
//                                    slidesPos[startIndex + i] += slideWidth;
//                                }
//                                else{
//                                    slidesPos[startIndex + showNum-1] = showNum * slideWidth;
//                                }
//                                startIndex -- ;
//                                startPoint["x"] += slideWidth;
                            }
                        }
                        else{
                            for(var i=0; i<=showNum; i++){
                                translate(startIndex + i, deltaPoint["x"] + slidesPos[startIndex + i], 0, 0);
//                                if(deltaPoint["x"] <= -slideWidth){
//                                    if(i === 0){
//                                        slidesPos[startIndex] = -slideWidth;
//                                    }
//                                    else{
//                                        slidesPos[startIndex + i] -= slideWidth;
//                                    }
//                                    startIndex ++ ;
//                                    startPoint["x"] -= slideWidth;
//                                }
                            }
                        }
//                        for(var i=0; i<=showNum; i++){
//                        	var index = tempIndex + i + (direction < 0 ? 0 : -1);
//                            translate(index, deltaPoint["x"] + slidesPos[index], 0, 0);
//                        }

                        if(deltaPoint["x"] <= -slideWidth){
                            slidesPos[startIndex] = -slideWidth;
                            for(var i=1; i<=showNum; i++){
                                slidesPos[startIndex + i] -= slideWidth;
                            }
                            startIndex++ ;
                            startPoint["x"] -= slideWidth;
                        }
                        else if(deltaPoint["x"] >= slideWidth){
                            slidesPos[startIndex + showNum-1] = showNum * slideWidth;
                            for(var i=-1; i<showNum-1; i++){
                                slidesPos[startIndex + i] += slideWidth;
                            }
                            startIndex-- ;
                            startPoint["x"] += slideWidth;
                        }
                        slideBoundFlag = false;
                    }
                }
                else{
                    //TODO Y轴移动
                }
                innerContainer.addEventListener('touchend', this, false);
            },
            touchEnd: function(event){
                var event = event || window.event,
                    duration = new Date() - startPoint["time"],
                    isValidSlide,
                    direction;
                event.preventDefault();
                if(!scrollFlag){
                    isValidSlide = ((duration | 0) < 250) && Math.abs(deltaPoint["x"]) > 30 || Math.abs(deltaPoint["x"]) > slideWidth / 2;
//                    direction = Math.abs(deltaPoint["x"]) / deltaPoint["x"];
                    direction = deltaPoint["x"] > 0;
                    if(continuous){
                    	//TODO 循环
                    }
                    else{
                        if(direction){
                            if(isValidSlide && !slideBoundFlag && startIndex > 0){
                                for(var i=-1; i<showNum; i++){
                                    move(startIndex + i, slidesPos[startIndex + i] + slideWidth, 0, slideSpeed);
                                }
                                startIndex -- ;
                            }
                            else{
                                for(var i=-1; i<showNum; i++){
                                    move(startIndex + i, slidesPos[startIndex + i], 0, slideSpeed);
                                }
                            }
                        }
                        else{
                            if(isValidSlide && !slideBoundFlag && startIndex < (slidesLength - showNum)){
                                for(var i=0; i<=showNum; i++){
                                    move(startIndex + i, slidesPos[startIndex + i] - slideWidth, 0, slideSpeed);
                                }
                                startIndex ++ ;
                            }
                            else{
                                for(var i=0; i<=showNum; i++){
                                    move(startIndex + i, slidesPos[startIndex + i], 0, slideSpeed);
                                }
                            }
                        }
                    }
                }
                else{
                    //TODO Y轴
                }
                innerContainer.removeEventListener('touchmove', this, false)
                innerContainer.removeEventListener('touchend', this, false)
            },
            transitionEnd: function(event){

            }

        }

        init();

        if(window.addEventListener){
            if(touchFlag){
                innerContainer.addEventListener("touchstart", events, false);
            }
            if(transitionFlag){
                innerContainer.addEventListener("webkitTransitionEnd", events, false);
                innerContainer.addEventListener("msTransitionEnd", events, false);
                innerContainer.addEventListener("oTransitionEnd", events, false);
                innerContainer.addEventListener("otransitionend", events, false);
                innerContainer.addEventListener("transitionend", events, false);
            }
            window.addEventListener("resize", events, false);
        }
        else{
            window.onresize = function(){
                init();
            };
        }

        if(slidesLength <= showNum){
            return;
        }

    }

    return {
        slide: slide
    }

});
