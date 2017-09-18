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
				g.isVertical ? dispatchCustomEvent(g.element, "verticalpan", {
					displacementY: i,
					touch        : f,
					touchEvent   : a
				}) : dispatchCustomEvent(g.element, "horizontalpan", {
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

						p.isVertical ? dispatchCustomEvent(p.element, "verticalflick", {
							duration     : q,
							velocityY    : s,
							displacementY: u,
							touch        : n,
							touchEvent   : a
						}) : dispatchCustomEvent(p.element, "horizontalflick", {
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