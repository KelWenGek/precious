//Animation module definition

(function (lib) {

	function toPx(a) {
		a += "";
		a.indexOf("px") < 0 && a.indexOf("%") < 0 && "0" !== a && (a += "px");
		return a;
	}

	function toDeg(a) {
		a += "";
		a.indexOf("deg") < 0 && "0" !== a && (a += "deg");
		return a;
	}

	function camelCase(a) {
		a = a.split("-");
		var o = a[0];
		for (var i = 1; i < a.length; i++) {
			o = o + a[i].slice(0, 1).toUpperCase() + a[i].slice(1);
		}
		return o;
	}

	function unCamelCase(a, b) {
		b || (b = "-");
		return a.replace(/([A-Z])/g, b + "$1").toLowerCase();
	}

	function timeConvert(a) {
		var b = /ms|s|m|h$/.exec(a)[0], c = {
			ms: 1,
			s : 1e3,
			m : 6e4,
			h : 36e5
		};
		return parseFloat(a) * c[b];
	}

	var reg_matrix3d = /^matrix3d\(\d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+), [-\d.]+, \d+\)/;
	var reg_matrix2d = /^matrix\(\d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+)\)$/;
	var transform_type = /^(translate|rotate|scale)(X|Y|Z|3d)?|(matrix)(3d)?|(perspective)|(skew)(X|Y)?$/i;
	var device = (/android/gi.test(navigator.appVersion)) || (/iphone|ipad/gi.test(navigator.appVersion));

	//, "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix),
	var animation = {

		translate   : function (elem, duration, timingFunction, delay, distanceX, distanceY, callback) {
			this.doTransition(elem, {
				translate: [distanceX, distanceY]
			}, {
				duration      : duration,
				timingFunction: timingFunction,
				delay         : delay,
				callback      : callback
			})
		},
		doTransition: function (a, b, g) {


			function end(event) {
				if (!t) {
					a.removeEventListener("webkitTransitionEnd", end, !1);
					if (!(event && event.srcElement !== a)) {
						t = !0;
						setTimeout(g.callback, 10);
					}
				}
			}

			var k, l = [g.duration, g.timingFunction || "ease", g.delay || "0s"].join(" "), m = "",//transform string
				n = [],//transition property array
				o = {};//not transform property object
			for (var p in b) {
				if (b.hasOwnProperty(p)) {
					var q = b[p];
					k = p.match(transform_type);
					if (k) {
						q instanceof Array || (q = [q]);
						var r = k[1] || k[3] || k[5] || k[6], s = k[2] || k[4] || k[7] || "";
						if ("translate" === r && "" === s && device) {
							s = "3d";
							q.push(0);//3d translate 时将Z轴位移设为0
						}
						if ("translate" === r) {
							q = q.map(toPx);//给数值加上px或者直接用百分比
						}
						else {
							("rotate" === r || "skew" === r) && (q = q.map(toDeg));//给数值加上deg
						}
						m += r + s + "(" + q.join(",") + ")";//构造transform style字符串


					}
					else {
						n.push(unCamelCase(p) + " " + l);//对不是transform的其他属性做transition,构造transition属性字符串
						o[p] = q; //将不是transform style 的其他属性存入数组


					}
					m && n.push("-webkit-transform " + l);//最后将-webkit-transform也加入到transition属性中,用来达到transform的过渡效果

				}
			}
			var t = !1;
			//设置变换风格
//			a.style.webkitBackfaceVisibility = "hidden";
			a.style.webkitTransformStyle = "preserve-3d";
			//绑定过渡结束事件
			g.callback && a.addEventListener("webkitTransitionEnd", end, !1);
			setTimeout(end, 1.2 * timeConvert(g.duration));
			setTimeout(function () {

				//设定元素的transition style,从而实现动画效果
				a.style.webkitTransition = n.join(", ");
				//设定元素的transform style作为要实现的动画效果
				m.length && (a.style.webkitTransform = m); 
				//把不是transform style 的其他样式属性添加给元素
				for (var b in o) {
					if (o.hasOwnProperty(b)) {
						a.style[b] = o[b];
					}
				}
			}, 10);
		},

		genCubicBezier     : function (a, b) {
			return [[(a / 3 + (a + b) / 3 - a) / (b - a), (a * a / 3 + a * b * 2 / 3 - a * a) / (b * b - a * a)],
				[(b / 3 + (a + b) / 3 - a) / (b - a), (b * b / 3 + a * b * 2 / 3 - a * a) / (b * b - a * a)]]
		},
		makeTranslateString: function (distanceX, distanceY) {
			distanceX = toPx(distanceX);
			distanceY = toPx(distanceY);
			return device
				? "translate3d(" + distanceX + ", " + distanceY + ", 0)"
				: "translate(" + distanceX + ", " + distanceY + ")";
		},
		getTransformOffset : function (elem) {
			var transformMatrix, reg_matrix, offset = {
					x: 0,
					y: 0
				},//获取元素的计算样式中的transform样式
				transformStyleStr = getComputedStyle(elem).webkitTransform;
			if ("none" !== transformStyleStr) {

				//判断是2d还是3d transform
				reg_matrix = transformStyleStr.indexOf("matrix3d") > -1
					? reg_matrix3d
					: reg_matrix2d;
				//获取transform matrix
				transformMatrix = transformStyleStr.match(reg_matrix);
				if (transformMatrix) {

					//从获取的transform matrix 提取transform offset
					offset.x = parseInt(transformMatrix[1]) || 0;
					offset.y = parseInt(transformMatrix[2]) || 0;
				}
			}
			return offset;
		}
	};

	lib.Animation = animation;

}(window.lib || (window.lib = {})));