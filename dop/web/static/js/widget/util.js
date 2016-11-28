define('widget/util', function() {


	return {
		getTime: function() {
			return new Date().getTime();
		},
		/**
		 * 随机返回0或者1
		 * @return {Number}
		 */
		oneOrZero: function() {
			return Math.round(Math.random());
		},
		/**
		 * 前面补0
		 * @param {Number|String}
		 * @param {Number}
		 * @return {String}
		 */
		padZero: function(num, length) {
			var re = num.toString();
			do {
				var len = re.indexOf(".") > -1 ? re.indexOf(".") : re.length;
				if (len < length) {
					re = "0" + re;
				}
			} while (len < length);
			return re;
		},
		trim: function(str) {
			return str.replace(/(^\s*)|(\s*$)/g, "").replace(/(^　*)|(　*$)/g, "");
		},
		getId: function(id) {
			return document.getElementById(id);
		},
		dateFormat: function(date, format) { //util.dateFormat(1408536771253, 'yyyy年 MM月 dd日 hh:mm:ss');
			var date = new Date(date);
			var map = {
				"M": date.getMonth() + 1, //月份
				"d": date.getDate(), //日
				"h": date.getHours(), //小时
				"m": date.getMinutes(), //分
				"s": date.getSeconds(), //秒
				"q": Math.floor((date.getMonth() + 3) / 3), //季度
				"S": date.getMilliseconds() //毫秒
			};
			var format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
				var v = map[t];
				if (v !== undefined) {
					if (all.length > 1) {
						v = '0' + v;
						v = v.substr(v.length - 2);
					}
					return v;
				} else if (t === 'y') {
					return (date.getFullYear() + '').substr(4 - all.length);
				}
				return all;
			});
			return format;
		},
		escapeHtml: function(string) {
			var entityMap = {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': '&quot;',
				"'": '&#39;',
				"/": '&#x2F;'
			};
			return String(string).replace(/[&<>"'\/]/g, function(s) {
				return entityMap[s];
			});
		},
		/**
		 * 倒记时
		 * @param count {Number} 倒记时开始的数字
		 * @param unit {String}  单位
		 * @param obj {Object}   倒记时绑定的对象
		 * @param callback {Function} 结束的回调函数
		 */
		countdown: function(count, unit, obj, callback) {
			var intervalStr = setInterval(function() {
				if (0 >= count) {
					clearInterval(intervalStr);
					try {
						callback && callback();
					} catch (e) {
						throw e;
					}
					return;
				}
				var countStr = --count;
				if (count < 10) {
					countStr = '0' + count;
				}
				obj.innerHTML = countStr + unit;
			}, 1000);
		},
		/**
		 * 过滤XSS
		 * @param str {String} 原始内容
		 */
		xss: function(str) {
			if (str == undefined || typeof str!='string') {
				return str;
			}
			/**
			var filterArr = ['<', '>'];
			for (var i = 0; i < filterArr.length; i++) {
				str = str.replace(new RegExp(filterArr[i], 'g'), '');
			}*/
			str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
			return str;
		}

	}
});