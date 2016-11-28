define('widget/selectOpt', function () {

    function selectOpt(id) {
        this.objSelect = document.getElementById(id);
        this.options = this.objSelect.options;
    }

    // 判断select选项中 是否存在Value="paraValue"的Item
    selectOpt.prototype.isExit = function (objItemValue) {
        var isExit = false;
        for (var i = 0; i < this.options.length; i++) {
            if (this.options[i].value == objItemValue) {
                isExit = true;
                break;
            }
        }
        return isExit;
    };

    // 向select选项中 加入一个Item
    selectOpt.prototype.addItem = function (objItemText, objItemValue) {
        //判断是否存在
        if (this.isExit(this.objSelect, objItemValue)) {
            // 该Item的Value值已经存在
            return;
        } else {
            var varItem = new Option(objItemText, objItemValue);
            this.options.add(varItem);
        }
    };

    /**
     * 向select选项中 加入多个Item
     * @param objItemS {json} demo:{{k:"xxx", v:"xxx"}, {k:"xxx", v:"xxx"}}
     * @param _case {json} 如果objItemS等于 {{k:"xxx", v:"xxx"}, {k:"xxx", v:"xxx"}}，则_case传参数为 {text:"k", value:"v"}
     */
    selectOpt.prototype.addItems = function (objItemS, _case) {
        _case = _case || {text:"text", value:"value"};
        for(var j in objItemS) {
            if(objItemS.hasOwnProperty(j)) {
                this.addItem(objItemS[j][_case['text']], objItemS[j][_case['value']]);
            }
        }
    };

    // 从select选项中 删除一个Item
    selectOpt.prototype.remove = function (objItemValue) {
        //判断是否存在
        if (this.isExit(this.objSelect, objItemValue)) {
            for (var i = 0; i < this.options.length; i++) {
                if (this.options[i].value == objItemValue) {
                    this.objSelect.options.remove(i);
                    break;
                }
            }
        }
    };

    // 保留前l个select选项，其余删除
    selectOpt.prototype.removeAll = function (l) {
        var l = l || 0;
        //document.all[this.objSelect].options.length = 0;
        //this.options.length = l;
		try {
			this.options.length = l;
		} catch (e) {
			for ( var i = 0, a = this.options; i < a.length; i++) {
				if(i>=l){
					a[i].remove();
				}
			}
		}
    };

    // 删除select中选中的项
    selectOpt.prototype.removeSelected = function () {
        var length = this.options.length - 1;
        for (var i = length; i >= 0; i--) {
            if (this.options[i].selected == true) {
                this.options[i] = null;
            }
        }
    };

    // 得到被选择项的索引
    selectOpt.prototype.index = function() {
        return this.objSelect.selectedIndex;
    };

    // 得到选择项的文本值
    selectOpt.prototype.text = function () {
        return this.options[this.objSelect.selectedIndex].text;
    };

    // 修改select选项中 value="paraValue"的text为"paraText"
    selectOpt.prototype.updateText = function (objItemText, objItemValue) {
        //判断是否存在
        if (this.isExit(this.objSelect, objItemValue)) {
            for (var i = 0,j=this.options.length; i < j; i++) {
                if (this.options[i].value == objItemValue) {
                    this.options[i].text = objItemText;
                    break;
                }
            }
        }
    };

    // 设置select中text="paraText"的第一个Item为选中
    selectOpt.prototype.selectByText = function (objItemText) {
        for (var i = 0,j=this.options.length; i < j; i++) {
            if (this.options[i].text == objItemText) {
                this.options[i].selected = true;
            }
        }
    };




   return {
       selectOpt : selectOpt
    }
})