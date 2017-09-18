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

}(window.kel || (window.kel = {})));

//Gesture util definition
(function (a) {
	function checkDoubleTouch(a, b) {
		for (var c = a; c;) {
			if (c.contains(b) || c == b) return c;
			c = c.parentNode
		}
		return null
	}

	function dispatchCustomEvent(a, b, c) {
		var d = i.createEvent("HTMLEvents");
		d.initEvent(b, !0, !0);
		if ("object" == typeof c) for (var e in c) d[e] = c[e];
		a.dispatchEvent(d);
	}

	function makeTransformMatrix(a, b, c, d, e, f, g, h) {
		var i = Math.atan2(h - f, g - e) - Math.atan2(d - b, c - a),
			j = Math.sqrt((Math.pow(h - f, 2) + Math.pow(g - e, 2)) / (Math.pow(d - b, 2) + Math.pow(c - a, 2))),
			k = [e - j * a * Math.cos(i) + j * b * Math.sin(i), f - j * b * Math.cos(i) - j * a * Math.sin(i)];
		return {
			rotate   : i,
			scale    : j,
			translate: k,
			matrix   : [[j * Math.cos(i), -j * Math.sin(i), k[0]], [j * Math.sin(i), j * Math.cos(i), k[1]], [0, 0, 1]]
		}
	}

	//触摸开始处理器

	function domTouchStartHandler(a) {

		if (0 === Object.keys(l).length) {

			j.addEventListener("touchmove", domTouchMoveHandler, !1);
			j.addEventListener("touchend", domTouchEndHandler, !1);
			j.addEventListener("touchcancel", domTouchCancelHandler, !1);
		}
		for (var d = 0; d < a.changedTouches.length; d++) {
			var e = a.changedTouches[d],
				i = {};
			for (var m in e) i[m] = e[m];
			var n = {
				startTouch     : i,//记录触点
				startTime      : Date.now(),//记录触点状态
				status         : "tapping",//设置触点时间戳
				element        : a.srcElement, //记录触点dom元素
				pressingHandler: setTimeout(function (b) {
					return function () {
						if ("tapping" === n.status) {
							n.status = "pressing";
							dispatchCustomEvent(b, "press", {
								touchEvent: a
							});
						}
						clearTimeout(n.pressingHandler);
						n.pressingHandler = null
					}
				}(a.srcElement), 500)
			}; //记录刚触摸时的触点信息


			//缓存触点
			l[e.identifier] = n;

		}

		//多点触摸处理
		if (2 == Object.keys(l).length) {
			var o = [];
			for (var m in l) o.push(l[m].element);

			dispatchCustomEvent(checkDoubleTouch(o[0], o[1]), "dualtouchstart", {
				touches   : k.call(a.touches),
				touchEvent: a
			});
		}
	}

	//触摸滑动处理器
	function domTouchMoveHandler(a) {

		for (var e = 0; e < a.changedTouches.length; e++) {
			var f = a.changedTouches[e],
				g = l[f.identifier];
			if (!g) return;
			var h = f.clientX - g.startTouch.clientX,
				i = f.clientY - g.startTouch.clientY,
				j = Math.sqrt(Math.pow(h, 2) + Math.pow(i, 2));

			if ("tapping" === g.status && j > 10) {

				g.status = "panning";
				dispatchCustomEvent(g.element, "panstart", {
					touch     : f,
					touchEvent: a
				});

				if (Math.abs(h) > Math.abs(i)) {

					dispatchCustomEvent(g.element, "horizontalpanstart", {
						touch     : f,
						touchEvent: a
					});
					g.isVertical = !1;

				} else {

					dispatchCustomEvent(g.element, "verticalpanstart", {
						touch     : f,
						touchEvent: a
					});
					g.isVertical = !0;

				}

			}

			if ("panning" === g.status) {

				g.panTime = Date.now();


				dispatchCustomEvent(g.element, "pan", {
					displacementX: h,
					displacementY: i,
					touch        : f,
					touchEvent   : a
				});

				//判断pan方向
				g.isVertical
					? dispatchCustomEvent(g.element, "verticalpan", {
					displacementY: i,
					touch        : f,
					touchEvent   : a
				})
					: dispatchCustomEvent(g.element, "horizontalpan", {
					displacementX: h,
					touch        : f,
					touchEvent   : a
				})


			}


		}

		//缩放
		if (2 == Object.keys(l).length) {
			for (var k, m = [], n = [], o = [], e = 0; e < a.touches.length; e++) {
				var f = a.touches[e],
					g = l[f.identifier];
				m.push([g.startTouch.clientX, g.startTouch.clientY]);
				n.push([f.clientX, f.clientY])
			}
			for (var p in l) o.push(l[p].element);
			k = makeTransformMatrix(m[0][0], m[0][1], m[1][0], m[1][1], n[0][0], n[0][1], n[1][0], n[1][1]);
			dispatchCustomEvent(checkDoubleTouch(o[0], o[1]), "dualtouch", {
				transform : k,
				touches   : a.touches,
				touchEvent: a
			});
		}
	}

	//触摸结束处理器
	function domTouchEndHandler(a) {
		if (2 == Object.keys(l).length) {
			var d = [];
			for (var e in l) d.push(l[e].element);
			dispatchCustomEvent(checkDoubleTouch(d[0], d[1]), "dualtouchend", {
				touches   : k.call(a.touches),
				touchEvent: a
			})
		}
		for (var i = 0; i < a.changedTouches.length; i++) {
			var n = a.changedTouches[i],
				o = n.identifier,
				p = l[o];
			if (p) {


				if (p.pressingHandler) {

					clearTimeout(p.pressingHandler);
					p.pressingHandler = null

				}

				if ("tapping" === p.status) {


					p.timestamp = Date.now();

					dispatchCustomEvent(p.element, "tap", {
						touch     : n,
						touchEvent: a
					});
					m && p.timestamp - m.timestamp < 300 && dispatchCustomEvent(p.element, "doubletap", {
						touch     : n,
						touchEvent: a
					});

					this.lastTap = p;

				}


				if ("panning" === p.status) {
					var q = Date.now() - p.startTime,
						r = (n.clientX - p.startTouch.clientX) / q,
						s = (n.clientY - p.startTouch.clientY) / q,
						t = n.clientX - p.startTouch.clientX,
						u = n.clientY - p.startTouch.clientY;
					dispatchCustomEvent(p.element, "panend", {
						isflick   : 300 > q,
						touch     : n,
						touchEvent: a
					});

					if (300 > q) {
						dispatchCustomEvent(p.element, "flick", {
							duration     : q,
							velocityX    : r,
							velocityY    : s,
							displacementX: t,
							displacementY: u,
							touch        : n,
							touchEvent   : a
						});

						p.isVertical
							? dispatchCustomEvent(p.element, "verticalflick", {
							duration     : q,
							velocityY    : s,
							displacementY: u,
							touch        : n,
							touchEvent   : a
						})
							: dispatchCustomEvent(p.element, "horizontalflick", {
							duration     : q,
							velocityX    : r,
							displacementX: t,
							touch        : n,
							touchEvent   : a
						});


					}


				}
				"pressing" === p.status && dispatchCustomEvent(p.element, "pressend", {
					touch     : n,
					touchEvent: a
				});
				delete l[o];
			}
		}

		if (0 === Object.keys(l).length) {

			j.removeEventListener("touchmove", domTouchMoveHandler, !1);
			j.removeEventListener("touchend", domTouchEndHandler, !1);
			j.removeEventListener("touchcancel", domTouchCancelHandler, !1);

		}


	}

	//触摸取消处理器
	function domTouchCancelHandler(a) {
		if (2 == Object.keys(l).length) {
			var d = [];
			for (var e in l) d.push(l[e].element);
			dispatchCustomEvent(checkDoubleTouch(d[0], d[1]), "dualtouchend", {
				touches   : k.call(a.touches),
				touchEvent: a
			});
		}
		for (var i = 0; i < a.changedTouches.length; i++) {
			var m = a.changedTouches[i],
				n = m.identifier,
				o = l[n];

			if (o) {
				if (o.pressingHandler) {
					clearTimeout(o.pressingHandler);
					o.pressingHandler = null

				}


				"panning" === o.status && dispatchCustomEvent(o.element, "panend", {
					touch     : m,
					touchEvent: a
				});
				"pressing" === o.status && dispatchCustomEvent(o.element, "pressend", {
					touch     : m,
					touchEvent: a
				});
				delete l[n];

			}


		}

		if (0 === Object.keys(l).length) {

			j.removeEventListener("touchmove", domTouchMoveHandler, !1);
			j.removeEventListener("touchend", domTouchEndHandler, !1);
			j.removeEventListener("touchcancel", domTouchCancelHandler, !1);

		}

	}

	var i = a.document,
		j = i.documentElement,
		k = Array.prototype.slice,
		l = {},
		m = null;

	j.addEventListener("touchstart", domTouchStartHandler, !1)
}(window));


//Pan util definition
(function (lib) {


	function convertToString(a) {
		var b = "";
		Object.keys(a).forEach(function (c) {
			b += c + ":" + a[c] + ";";
		});
		return b;
	}


	function getMinScrollTop(a) {


		//bounceTop是一个正值
		return 0 - (a.bounceTop || 0);
	}

	function getMaxScrollTop(a) {
		var b = a.getBoundingClientRect(),
			d = a.parentNode.getBoundingClientRect(),
			e = getMinScrollTop(a),
			f = 0 - b.height + d.height;

		//bounceBottom是一个正值
		return Math.min(f + (a.bounceBottom || 0), e);
	}

//判断是越过上边界或者越过下边界返回一个大于0的数,否则返回void 0;
	function checkOverBoundary(a, b) {
		return b > a.minScrollTop
			? b - a.minScrollTop
			: b < a.maxScrollTop
			? a.maxScrollTop - b
			: void 0;
	}


//超出上边界,返回上边界,超出下边界,返回下边界
	function getBoundary(a, b) {
		b > a.minScrollTop
			? b = a.minScrollTop
			: b < a.maxScrollTop && (b = a.maxScrollTop);
		return b;
	}

	function dispatchCustomEvent(a, b, c) {
		var d = u.createEvent("HTMLEvents");
		d.initEvent(b, !0, !0);
		if ("object" == typeof c) for (var e in c) d[e] = c[e];
		a.dispatchEvent(d)
	}

//阻止默认行为
	function touchMoveDisabled(event) {
		event.preventDefault();
		return !1;
	}


//当触摸开始时的事件处理器
	function touchStartInit(event) {
		if (!stopBounce) {
			//从事件目标开始遍历直到找到绑定滚动事件的元素 通过 scroll.enable();
			for (var b = event.srcElement; !b.boundScrollEvent;) b = b.parentNode || b.offsetParent;

			r = b.boundScrollElement;
			if (r) {
				var c = w.getTransformOffset(r);
				r.style.webkitBackfaceVisibility = "hidden";
				r.style.webkitTransformStyle = "preserve-3d";
				r.style.webkitTransition = "";
				r.style.webkitTransform = w.makeTranslateString(c.x, c.y);
			}
		}
	}

//滑动事件开始处理器
	function panStartHandler() {
		if (!stopBounce && r) {

			r.transformOffset = w.getTransformOffset(r);
			r.minScrollTop = getMinScrollTop(r);
			r.maxScrollTop = getMaxScrollTop(r);
			x = 2.5;
			stopBounce = !1;
			y = !1;
			dispatchCustomEvent(r, "scrollstart");
		}
	}

//触摸结束,不做任何事情
	function touchEndHandler() {
	}

//触摸滚动事件处理器
	function panMoveHandler(a) {
		if (!stopBounce && r) {


			var b = r.transformOffset.y + a.displacementY;

			if (b > r.minScrollTop) {

				b = r.minScrollTop + (b - r.minScrollTop) / x;
				x *= 1.003;
				x > 4 && (x = 4);

			} else if (b < r.maxScrollTop) {
				b = r.maxScrollTop - (r.maxScrollTop - b) / x;
				x *= 1.003;
				x > 4 && (x = 4);
			}

			if (checkOverBoundary(r, b)) {

				if (b > r.minScrollTop + r.bounceTop) {
					var c = "pulldown",
						d = Math.abs(b - r.minScrollTop);

					r.boundLoadingTip && r.boundLoadingTip.toggle('down');

				}
				else if (b < r.maxScrollTop - r.bounceBottom) {
					c = "pullup";
					d = Math.abs(r.maxScrollTop - b);
					r.boundLoadingTip && r.boundLoadingTip.toggle('up');

				}
				else {


					r.boundLoadingTip && r.boundLoadingTip.refresh();


				}
				r.bounceOffset = d;
				dispatchCustomEvent(r, c);
			}
			r.style.webkitTransition = "";
			r.style.webkitTransform = w.makeTranslateString(r.transformOffset.x, b);
		}
	}

//触摸滚动结束后判断是否超出上下边界的事件处理器
//	function panEndHandler() {
//		if (!stopBounce && r) {
//			var a = w.getTransformOffset(r).y;
//			checkOverBoundary(r, a) ? bounceMove() : bounceEnd();
//		}
//	}

	//加入loading效果的panEndHandler

	function panEndHandler() {
		if (!stopBounce && r) {
			var a = w.getTransformOffset(r).y;

			if (checkOverBoundary(r, a)) {

				//需要数据加载
				if (r.dataload) {

					if (a > r.minScrollTop + r.bounceTop) {
						stopBounce = !0;
						r.boundLoadingTip && r.boundLoadingTip.show('down');


						w.translate(r, 300 + "ms", "cubic-bezier(" + w.genCubicBezier(-300, 0) + ")", "0s", r.transformOffset.x, r.minScrollTop + r.bounceTop, function () {


							//数据加载接口接入
							console.log('加载中');
							setTimeout(function () {
								console.log('刷新成功');
								stopBounce = !1;
								bounceMove();

							}, 3000);


						});
					}
					else if (a < r.maxScrollTop - r.bounceBottom) {
						stopBounce = !0;

						r.boundLoadingTip && r.boundLoadingTip.show('up');


						w.translate(r, 300 + "ms", "cubic-bezier(" + w.genCubicBezier(-300, 0) + ")", "0s", r.transformOffset.x, r.maxScrollTop - r.bounceBottom, function () {

							//数据加载接口接入
							console.log('加载中');
							setTimeout(function () {
								var div = $('<div style="height: 50px;width: 100%;color: red;">new load</div>');

								div.insertBefore('#pullup');
								stopBounce = !1;
								//pan.refresh(r);
							}, 3000);

							//el.getData();

						});
					}
				}

				bounceMove();

			} else {

				bounceEnd();

			}


		}
	}


	//手指快速轻弹一下屏幕
	function flickHandler(a) {
		if (!stopBounce && r) {
			var b, c, d, e, f, g, h, i = w.getTransformOffset(r).y;
			y = !0;
			if (i > r.minScrollTop || i < r.maxScrollTop) {
				bounceStart(b);
			} else {
				b = a.velocityY;
				b > 1.5 && (b = 1.5);
				-1.5 > b && (b = -1.5);
				c = .0015 * (b / Math.abs(b));
				d = b / c;
				e = i + d * b / 2;
				if (e > r.minScrollTop + r.bounceTop) {

					g = r.minScrollTop - i;
					h = (b - Math.sqrt(-2 * c * g + b * b)) / c;
					f = b - c * h;
					w.translate(r, h.toFixed(0) + "ms", "cubic-bezier(" + w.genCubicBezier(-d, -d + h) + ")", "0s", r.transformOffset.x, r.minScrollTop + r.bounceTop,
						function () {
							bounceStart(f);
						});

				} else if (e < r.maxScrollTop - r.bounceBottom) {
					g = r.maxScrollTop - i;
					h = (b + Math.sqrt(-2 * c * g + b * b)) / c;
					f = b - c * h;
					w.translate(r, h.toFixed(0) + "ms", "cubic-bezier(" + w.genCubicBezier(-d, -d + h) + ")", "0s", r.transformOffset.x, r.maxScrollTop - r.bounceBottom,
						function () {
							bounceStart(f);
						});

				} else {

					w.translate(r, d.toFixed(0) + "ms", "cubic-bezier(" + w.genCubicBezier(-d, 0) + ")", "0s", r.transformOffset.x, e.toFixed(0), bounceEnd);

				}


			}


		}
	}


//回弹过程开始
	function bounceStart(a) {
		if (!stopBounce && r) {
			var b = w.getTransformOffset(r).y,
				c = .008 * (a / Math.abs(a)),
				t = a / c,
				s = b + t * a / 2;
			dispatchCustomEvent(r, "bouncestart");
			w.translate(r, t.toFixed(0) + "ms", "cubic-bezier(" + w.genCubicBezier(-t, 0) + ")", "0s", r.transformOffset.x, s.toFixed(0), function () {

				//需要数据加载
				if (r.dataload) {
					if (s > r.minScrollTop + r.bounceTop) {
						stopBounce = !0;

						r.boundLoadingTip && r.boundLoadingTip.show('down');
						w.translate(r, t.toFixed(0) + "ms", "cubic-bezier(" + w.genCubicBezier(-t, 0) + ")", "0s", r.transformOffset.x, r.minScrollTop + r.bounceTop, function () {


							//数据加载接口接入
							console.log('加载中');
							setTimeout(function () {

								stopBounce = !1;
								bounceMove();

							}, 3000);


						});

					}
					else if (s < r.maxScrollTop - r.bounceBottom) {

						stopBounce = !0;
						r.boundLoadingTip && r.boundLoadingTip.show('up');
						w.translate(r, t.toFixed(0) + "ms", "cubic-bezier(" + w.genCubicBezier(-t, 0) + ")", "0s", r.transformOffset.x, r.maxScrollTop - r.bounceBottom, function () {
							//数据加载接口接入
							console.log('加载中');
							setTimeout(function () {
								var div = $('<div style="height: 50px;width: 100%;color: red;">new load</div>');

								div.insertBefore('#pullup');

								stopBounce = !1;
								pan.refresh(r);
							}, 3000);
						});

					}
				}
				else {
					bounceMove();
				}

			});
		}
	}


//回弹过程中
	function bounceMove() {
		if (!stopBounce && r) {
			var a = w.getTransformOffset(r).y;
			a = getBoundary(r, a); //上下边界值
			w.translate(r, "0.4s", "ease-in-out", "0s", r.transformOffset.x, a,
				function () {
					dispatchCustomEvent(r, "bounceMove");

					r.dataload && pan.refresh(r);
					bounceEnd();
				});
		}
	}

//回弹结束
	function bounceEnd() {

		if (!stopBounce && r) {
			y = !1;
			setTimeout(function () {
					y || (r.style.webkitBackfaceVisibility = "initial", r.style.webkitTransformStyle = "flat", r.style.webkitTransition = "", dispatchCustomEvent(r, "scrollend"))
				},
				10);
		}
	}


	var r, u = window.document,
		v = u.documentElement, //html根元素
		w = window.kel.Animation,
		x = 2,
		y = !1,
		stopBounce = !1,
		prevented = !1;
	var pan = {


		enable: function (el, option) {

			var c = el.parentNode || el.offsetParent;

			//阻止html根元素触摸事件
			if (!prevented) {
				prevented = !0;
				v.addEventListener("touchmove", touchMoveDisabled, !1);
			}
			//是否已经绑定滚动事件
			if (!c.boundScrollEvent) {
				c.boundScrollEvent = !0;
				c.addEventListener("touchstart", touchStartInit, !1);
				c.addEventListener("touchend", touchEndHandler, !1);

				c.addEventListener("panstart", panStartHandler, !1);
				c.addEventListener("pan", panMoveHandler, !1);

				c.addEventListener("panend", panEndHandler, !1);
				c.addEventListener("flick", flickHandler, !1);
			}


			//绑定滚动目标
			c.boundScrollElement = el;


			//设置弹性间隔
			el.bounceTop = option.dataload
				? option.bounceTop || 0
				: 0;
			el.bounceBottom = option.dataload
				? option.bounceBottom || 0
				: 0;

			//初始化变换
			var d = w.getTransformOffset(el).x,
				e = -el.bounceTop;
			el.style.webkitTransition = "";
			el.style.webkitTransform = w.makeTranslateString(d, e);


			//绑定loading
			option.boundLoading && (el.boundLoadingTip = new Loading(el, option));
			//数据是否载入标志
			el.dataload = option.dataload || false;
			//设置数据加载
			el.getData = option.dataload && this.setDataFunc(option);


		},

		//设置数据接口
		setDataFunc: function (option) {


			return function () {


				option.getData.call();


			};

		},

		//获取可滚动高度
		getScrollHeight: function (a) {
			return a.getBoundingClientRect().height - (a.bounceTop || 0) - (a.bounceBottom || 0);
		},
		//获取当前滚动位置
		getScrollTop   : function (a) {
			var b = w.getTransformOffset(a);
			return -(b.y + (a.bounceTop || 0));
		},
		refresh        : function (a) {
			a.style.height = "auto";
			a.style.height = a.offsetHeight + "px";

			//获取当前变换
			a.offset = w.getTransformOffset(a);

			//最小滚动高度
			a.minScrollTop = getMinScrollTop(a);

			//最大滚动高度
			a.maxScrollTop = getMaxScrollTop(a);

			//loading提示刷新
			a.boundLoadingTip && a.boundLoadingTip.refresh();

			//回到容器顶部
			//this.scrollTo(a, -a.offset.y - a.bounceTop);
		},
		scrollTo       : function (a, b) {
			var c = w.getTransformOffset(a).x;
			//此处计算出来的b为元素当前变换的y值 向上滚动时为负数
			b = -b - (a.bounceTop || 0);
			b = getBoundary(a, b);
			a.style.webkitTransition = "";
			a.style.webkitTransform = w.makeTranslateString(c, b);
		},
		offset         : function (a, b) {
			var c = a.getBoundingClientRect(),
				d = b.getBoundingClientRect(),
				e = {
					top   : d.top - ((a.bounceTop || 0) + c.top),
					left  : d.left - c.left,
					right : c.right - d.right,
					width : d.width,
					height: d.height
				};
			e.bottom = e.top + d.height;
			return e;
		},

		scrollToElement  : function (a, b) {
			var c = this.offset(a, b);
			this.scrollTo(a, c.top);
		},
		getViewHeight    : function (a) {
			return a.parentNode.getBoundingClientRect().height;
		},
		getBoundaryOffset: function (a) {
			var b = w.getTransformOffset(a).y;
			return checkOverBoundary(a, b);
		},
		stopBounce       : function (a) {
			stopBounce = !0;
			var b = w.getTransformOffset(a),
				e = getMinScrollTop(a),
				f = getMaxScrollTop(a),
				g = null;

			if (b.y > e + (a.bounceTop || 0)) {
				g = e + (a.bounceTop || 0);


			} else if (b.y < f - (a.bounceBottom || 0)) {

				g = f - (a.bounceBottom || 0);

			}

			null != g && w.translate(a, "0.4s", "ease-in-out", "0s", b.x, g);
		},
		resumeBounce     : function (a) {
			stopBounce = !1;
			var b, e = w.getTransformOffset(a),
				f = getMinScrollTop(a),
				g = getMaxScrollTop(a);

			if (e.y > f) {
				b = f;

			} else if (g > e) {

				b = g;
			}

			null != b && w.translate(a, "0.4s", "ease-in-out", "0s", e.x, b);
		},


		//禁止滚动
		disable: function (a) {
			var b, c = a.parentNode || a.offsetParent;
			if (c.boundScrollElement === a) {
				b = w.getTransformOffset(a);
				var r = c.boundScrollElement = null;
				setTimeout(function () {
						a.style.webkitTransition = "";
						a.style.webkitTransform = w.makeTranslateString(b.x, b.y);
					},
					50);
			}
		}
	};

	function Loading(el, option) {


		if (option.dataload) {
			var pullup = document.createElement('div'), pulldown = document.createElement('div');
			pullup.id = 'pullup';
			pulldown.id = 'pulldown';
			pullup.innerHTML = '上拉加载';
			pulldown.innerHTML = '下拉刷新';
			pullup.style.cssText = 'height:' + option.bounceBottom + 'px;' + 'line-height:' + option.bounceBottom + 'px;' + convertToString(option.pullup);
			pulldown.style.cssText = 'height:' + option.bounceTop + 'px;' + 'line-height:' + option.bounceTop + 'px;' + convertToString(option.pulldown);
			el.appendChild(pullup);
			el.insertBefore(pulldown, el.firstChild);
		}
		this.pullup = pullup
			? $(pullup)
			: null;
		this.pulldown = pulldown
			? $(pulldown)
			: null;
	}


	Loading.prototype = {

		constructor: Loading,

		//切换loading提示
		toggle: function (str) {
			str
				? (str == 'up'
				? ( this.pullup && this.pullup.text('释放加载'))
				: ( this.pulldown && this.pulldown.text('释放刷新')))
				: (void 0);
		},
		//显示正在加载的loading效果
		show  : function (str) {

			str
				? (str == 'up'
				? (this.pullup && this.pullup.text('正在加载'))
				: (this.pulldown && this.pulldown.text('正在加载')))
				: (void 0);
		},

		refresh: function () {

			this.pullup && this.pullup.text('上拉加载');
			this.pulldown && this.pulldown.text('下拉刷新');
		}

	};


	lib.Pan = pan;
}(window.kel || (window.kel = {})));