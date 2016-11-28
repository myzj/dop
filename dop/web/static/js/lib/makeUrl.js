define('lib/makeUrl', function () {
    return function (api, data) {
        data = data || {};
        var search = '', url = api.url, re = {}, getData = {};
        url = api.url.replace(/{{(\w+)}}/ig, function (all, param) {
            return data[param] || '';
        });
        re.method = 'get';
        if (api.urlEncodeCharset) {
            re.urlEncodeCharset = api.urlEncodeCharset;
        }
        if (api.get) {
            for (var param in api.get) {
                var k = param, v = api.get[param];
                var _value = getValue(v, k, data);
                getData[k] = _value;
                search += ((search.length ? '&' : '') + [k, getData[k]].join('='));
            }
        }
        //计算已经存在的searchString
        if (url.indexOf('?') > -1) {
            var _existedSearchStr = url.substring(url.indexOf('?') + 1);
            re.originUrl = url.substring(0, url.indexOf('?'));
            for (var i = 0, a = _existedSearchStr.split('&'); i < a.length; i++) {
                var o = a[i].split('=');
                getData[o[0]] = o[1] || '';
            }
        } else {
            re.originUrl = api.url;
        }
        re.getData = getData;
        if (search.length) {
            if (url.indexOf('?') > -1) {
                if (url.indexOf('?') == url.length - 1) {
                    url += search;
                } else {
                    url += '&' + search;
                }
            } else {
                url += '?' + search;
            }
        }
        re.url = url;
        if (api.post) {
            var postData = {};
            for (var param in api.post) {
                var _value = getValue(api.post[param], param, data);

                if (api.post[param] == '?' && _value == null && _value == '') {
                    //
                } else {
                    postData[param] = _value;
                }
            }
            re.method = 'post';
            re.postData = postData
        }
        if (api.isOnlyData == 1) {
            re.postData = { data: JSON.stringify(postData) };
        }
        function getValue(_v, _k, _d) {
            var v1;
            if (_v == '?') {
                if (_d[_k] === 0) {
                    v1 = 0;
                } else {
                    v1 = _d[_k] || '';
                }
            } else if (typeof _v == 'function') {
                v1 = _v(_d);
            } else if (_v == '??') {
                v1 = detailGP(_k);
            } else {
                if (_d[_k] === 0) {
                    v1 = 0;
                } else {
                    v1 = _d[_k] || _v;
                }
            }
            return v1;
        }
        //处理值为+号的
        function detailGP(GPkey) {
            var oJson = {}, _k, _v, v1;
            var _data = data[GPkey];
            var _body = api[GPkey] || {};
            for (var param in _body) {
                _k = param;
                _v = _body[param];
                if (_v == '?') {
                    if (_data[_k] === 0) {
                        v1 = 0;
                    } else {
                        v1 = _data[_k] || '';
                    }
                } else {
                    if (_data[_k] === 0) {
                        v1 = 0;
                    } else {
                        v1 = _data[_k] || _v;
                    }
                }
                oJson[param] = v1;
            }
            return oJson;
        }

        if (api.method) {
            re.method = api.method;
        }
        re.async = api.async != undefined ? api.async : true;
        return re;
    }
})