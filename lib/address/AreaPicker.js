var level = 0;

function iterator(arr) {
	var str = [], item, lv = level++;
	for (var i = 0, len = arr.length; i < len; i++) {
		item = arr[i];
		str.push('<a data-level="' + lv + '" data-id="' + item['id'] + '" data-name="' + item['name'] + '" title="' + item['name'] + '">' + item['name'] + '</a>');
	}
	return str;
}

function setSingle(inputId, areaId, areaVal) {
	if (document.getElementById(inputId) == null) {
		var hArea = $('<input>', {
			type     : 'hidden',
			name     : inputId,
			"data-id": areaId,
			id       : inputId,
			val      : areaVal
		});
		this.$el.after(hArea);
	}
	else {
		$("#" + inputId).val(areaVal).attr("data-id", areaId);

	}
}
AreaPicker.type = ['hProv', 'hCity', 'hArea'];
AreaPicker.areaTabUlId = '_citys0';
AreaPicker.highlightCls = 'citySel';
AreaPicker.valueFormatter = ' ';
AreaPicker.areaCls = '_citys1';

function AreaPicker(option) {
	var self = this;
	self.$el = option.el;
	self.value = [];
	self.initialize.call(self);
}


AreaPicker.prototype = {
	constructor: AreaPicker,
	initialize : function () {
		var self = this;
		self.$el.on('click', function (e) {
			self.value = [];
			var tpl = self.template();
			Iput.show({id: self.$el[0], event: e, content: tpl, width: "470"});
			self.getProvince();
			self.delegate();
		});
	},
	delegate   : function () {
		var self = this;
		//省市区标签点击事件
		$('.' + AreaPicker.areaCls).each(function (idx) {
			$(this).on('click', 'a', function () {
				var id = $(this).data('id'), val = $(this).data('name'), strArr = [], n = idx + 1;
				if (n <= 2) {
					$('#' + AreaPicker.areaTabUlId).find('li').eq(n).addClass(AreaPicker.highlightCls).siblings().removeClass(AreaPicker.highlightCls);
					strArr = self.getInfo(AreaPicker.type[n], id);
					console.log(strArr);
					$('.' + AreaPicker.areaCls).hide();
					$('.' + AreaPicker.areaCls).eq(n).html(strArr.join('')).show();
				}
				$(this).addClass(AreaPicker.highlightCls).siblings().removeClass(AreaPicker.highlightCls);
				self.value[idx] = val;
				self.$el.val(self.value.join(AreaPicker.valueFormatter));
				setSingle.call(self, AreaPicker.type[idx], id, val);
				n > 2 && Iput.colse();
			});
		});
		//pop关闭事件
		$("#cColse").on('click', function () {
			Iput.colse();
		});
		//省市区tab切换时tab高亮
		$('#' + AreaPicker.areaTabUlId).on('click', 'li', function () {
			$(this).addClass(AreaPicker.highlightCls).siblings().removeClass(AreaPicker.highlightCls);
			var s = $(this).index('#' + AreaPicker.areaTabUlId + '>li');
			$('.' + AreaPicker.areaCls).hide();
			$('.' + AreaPicker.areaCls).eq(s).show();
		});
	},
	template   : function () {
		//设置地址选择弹出层模板
		var tpl = '<div class="_citys">' +
			'<span title="关闭" id="cColse" >×</span>' +
			'<ul id="' + AreaPicker.areaTabUlId + '">' +
			'<li class="' + AreaPicker.highlightCls + '">省份</li>' +
			'<li>城市</li>' +
			'<li>区县</li>' +
			'</ul>' +
			'<div class="' + AreaPicker.areaCls + '"></div>' +
			'<div style="display:none"  class="' + AreaPicker.areaCls + '"></div>' +
			'<div style="display:none"  class="' + AreaPicker.areaCls + '"></div>' +
			'</div>';
		return tpl;
	},
	//创建省
	getProvince: function () {
		var self = this, provStr = iterator(province);
		$('.' + AreaPicker.areaCls).eq(0).html(provStr.join(''));
	},
	getInfo: function (type, id) {
		var self = this;
		switch (type) {
			case 'hCity':
			{
				return self.getCity(id);
			}
			case 'hArea':
			{
				return self.getArea(id);
			}
		}
	},
	//获取城市
	getCity: function (id) {
		var city, cityStrArr;
		for (var i = 0, plen = province.length; i < plen; i++) {
			if (parseInt(province[i]['id']) == id) {
				city = province[i]['city'];
				break;
			}
		}
		cityStrArr = iterator(city);
		return cityStrArr;
	},
	//获取县区
	getArea: function (id) {
		var areaArr = [], areaStrArr;
		for (var i = 0, plen = area.length; i < plen; i++) {
			if (parseInt(area[i]['pid']) == id) {
				areaArr.push(area[i]);
			}
		}
		areaStrArr = iterator(areaArr);
		return areaStrArr;
	}
};