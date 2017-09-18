(function (a, b, c) {
	function checkIsNativeObject(a) {
		return null != a && "object" == typeof a && Object.getPrototypeOf(a) == Object.prototype;
	}

	function setHandlerTimeout(a, b) {
		var c, d, e, f = null,
			g = 0,
			h = function () {
				g = Date.now();
				f = null;
				e = a.apply(c, d);
			};
		return function () {
			var i = Date.now();
			j = b - (i - g);
			c = this;
			d = arguments;
			if (0 >= j) {
				clearTimeout(f);
				f = null;
				g = i;
				e = a.apply(c, d);

			} else {
				f || (f = setTimeout(h, j));
			}
		}
	}


	function convertToString(a) {
		var b = "";
		Object.keys(a).forEach(function (c) {
			b += c + ":" + a[c] + ";";
		});
		return b;
	}

	function StickyTab(a, c) {

		if (!c && checkIsNativeObject(a)) {
			c = a;
			a = c.element;
		}
		c = c || {};
		a.nodeType != b.ELEMENT_NODE && "string" == typeof a && (a = b.querySelector(a));
		var e = this;
		e.element = a;
		e.top = c.top || 0;
		e.withinParent = void 0 == c.withinParent ? !1 : c.withinParent;
		e.init();
	}

	var parseInt = a.parseInt,
		i = navigator.userAgent,
		j = !!i.match(/Firefox/i),
		k = !!i.match(/IEMobile/i),
		l = j ? "-moz-" : k ? "-ms-" : "-webkit-",
		m = j ? "Moz" : k ? "ms" : "webkit",
		n = function () {
			var a = b.createElement("div"),
				c = a.style;
			c.cssText = "position:" + l + "sticky;position:sticky;";
			return -1 != c.position.indexOf("sticky");
		}();

	StickyTab.prototype = {
		constructor    : StickyTab,
		init           : function () {
			var a = this,
				b = a.element,
				c = b.style;
			c[m + "Transform"] = "translateZ(0)";
			c.transform = "translateZ(0)";
			a._originCssText = c.cssText;

			if (n) {

				c.position = l + "sticky";
				c.position = "sticky";
				c.top = a.top + "px";
			} else {
				a._simulateSticky();
				a._bindResize();
			}

		},
		_bindResize    : function () {
			var b = this,
				c = /android/gi.test(navigator.appVersion),
				d = b._resizeEvent = "onorientationchange" in a ? "orientationchange" : "resize",
				e = b._resizeHandler = function () {
					setTimeout(function () {
							b.refresh();
						},
						c ? 200 : 0);
				};
			a.addEventListener(d, e, !1);
		},
		refresh        : function () {
			var a = this;
			if (!n) {
				a._detach();
				a._simulateSticky();
			}

		},
		_addPlaceholder: function (a) {
			var c, d = this,
				e = d.element,
				g = a.position;
			if (-1 != ["static", "relative"].indexOf(g)) {
				c = d._placeholderElement = b.createElement("div");
				var i = parseInt(a.width) + parseInt(a.marginLeft) + parseInt(a.marginRight),
					j = parseInt(a.height);


				//如果不是border-box,需要宽高需要加上border和padding
				if ("border-box" != a.boxSizing) {

					i += parseInt(a.borderLeftWidth) + parseInt(a.borderRightWidth) + parseInt(a.paddingLeft) + parseInt(a.paddingRight);
					j += parseInt(a.borderTopWidth) + parseInt(a.borderBottomWidth) + parseInt(a.paddingTop) + parseInt(a.paddingBottom);

				}
				c.style.cssText = convertToString({
					display        : "none",
					visibility     : "hidden",
					width          : i + "px",
					height         : j + "px",
					margin         : 0,
					"margin-top"   : a.marginTop,
					"margin-bottom": a.marginBottom,
					border         : 0,
					padding        : 0,
					"float"        : a["float"] || a.cssFloat
				});

				e.parentNode.insertBefore(c, e);
			}
			return c;
		},
		_simulateSticky: function () {
			var c = this,
				d = c.element,
				g = c.top,
				i = d.style,
				j = d.getBoundingClientRect(),
				k = getComputedStyle(d, ""),
				l = d.parentNode,
				m = getComputedStyle(l, ""),
				n = c._addPlaceholder(k),
				o = c.withinParent,
				p = c._originCssText,
				q = j.top - g + a.pageYOffset,



				r = l.getBoundingClientRect().bottom - parseInt(m.paddingBottom) - parseInt(m.borderBottomWidth) - parseInt(k.marginBottom) - j.height - g + a.pageYOffset,
				s = p + convertToString({
						position    : "fixed",
						top         : g + "px",
						width       : k.width,
						"margin-top": 0
					}),
				t = p + convertToString({
						position: "absolute",
						top     : r + "px",
						width   : k.width
					}),
				u = 1,
				isMove=false,
			//tab条固定位置的3种方式
				v = c._scrollHandler = setHandlerTimeout(function () {

						var b = a.pageYOffset;
						if(q>b){

							if(isMove){

								isMove=false;
								a.lib.Transition.move(footer[0], 0, -footer[0].offsetHeight, function () {
									console.log('collapse');
								});

							}


						}else{
							if(!isMove){
								isMove=true;
								a.lib.Transition.move(footer[0], 0, footer[0].offsetHeight, function () {
									console.log('collapse');
								});
							}



						}


						if (q > b) {
							if (1 != u) {

								i.cssText = p;
								n && (n.style.display = "none");
								u = 1;
							}
						} else if (!o && b >= q || o && b >= q && r > b) {
							if (2 != u) {

								i.cssText = s;
								n && 3 != u && (n.style.display = "block");
								u = 2;
							}


						} else {
							if (o && 3 != u) {
								i.cssText = t;
								n && 2 != u && (n.style.display = "block");
								u = 3
							}
						}


					},
					100);

			$(a).on('scroll',v);

			//a.addEventListener("scroll", v, !1);
			//if (a.pageYOffset >= q) {
			//	var w = b.createEvent("HTMLEvents");
			//	w.initEvent("scroll", !0, !0);
			//	a.dispatchEvent(w);
			//}
		},

		//解除锁定
		_detach: function () {
			var b = this,
				c = b.element;
			c.style.cssText = b._originCssText;
			if (!n) {
				var d = b._placeholderElement;
				//移除placeholder
				d && c.parentNode.removeChild(d);

				$(a).off('scroll',b._scrollHandler);
				a.removeEventListener("scroll", b._scrollHandler, !1);
			}
		},
		//
		destroy: function () {
			var b = this;
			b._detach();
			var c = b.element.style;
			c.removeProperty(l + "transform");
			c.removeProperty("transform");
			n || a.removeEventListener(b._resizeEvent, b._resizeHandler, !1);
		}
	};
	c.Sticky = StickyTab;
}(window, document, window.lib || (window.lib = {})));

(function (a, b) {


	var tab = {
		_duration   : 300,
		_isAnimating: !1,
		afterRender : function (obj) {


			var d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x;
			s = this;
			s.$el = $(obj.content);
			d = this.$contEl = s.$el.find(obj.container);
			e = d.parent();
			f = this.$tabUl = this.$el.find(obj.tabUl);
			a.scrollTo(0, 0);
			m = a.innerHeight - f.height();

			//- $("#J_footer").height()

			h = void 0;
			q = f.offset().top;


			o = 0;


			e.css("min-height", m);

			s.$el.on("click", obj.tabLi,
				function () {
					var b;
					b = $(this).index();
					//console.log('click idx;' + b);
					if (h !== b) {
						//console.log('before:' + h);
						if ("undefined" != typeof h) {
							a.scrollTo(0, q);

						}
						s._switchTab(h, b);
					}

					h = b;

					//console.log('after:' + h);
				});
			j = -1 !== navigator.userAgent.indexOf("Android");
			j || (b.stickyTab = this.stickyTab = new lib.Sticky(f.get(0), o));
			i = $(obj.main).get(0);
			p = i.scrollHeight;


			//设定定时器监听 J_detail_main元素的高度变化,一旦变化就执行 sticky.refresh


			setInterval(function () {
					var a, c;

					a = i.scrollHeight;
					//console.log(a);
					//console.log(p);

					if (a !== p) {
						console.log('if');
						p = a;
						c = b.stickyTab;
						if (null != c) {
							c.refresh()
						} else {
							return void 0;
						}
					} else {
						return void 0;
					}
				},
				700);


			//判断是否进入图文详情完整查看模式
			r = navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/i);
			k = r ? !0 : !1;
			t = r && r.length > 2 ? r[2].split("_") : [5];
			// l = c.getParam().lay,
			g = location.hash.slice(1);

			if (t[0] < 5 || "fulldesc" === g) {

				s.initEvent();
			} else if (l && "description" === l) {

				s.initEvent();
				a.scrollTo(0, q)

			} else {

				s.listen();

			}

		},
		listen      : function () {
			var b, c, d;
			d = this;
			b = $(a);
			c = function () {
				var e;
				e = d.$el.offset().top;

				if (1 >= e || e < a.pageYOffset + a.innerHeight + 100) {

					d.initEvent();
					b.off("scroll", c);
				}
			};
			b.on("scroll", c);
			b.trigger("scroll");
		},
		initEvent   : function () {
			this.$tabUl.find('li').eq(0).trigger("click");
		},
		_switchTab  : function (b, c) {
			var d, e, f, g, h, i, j, k, l;

			if (!this._isAnimating) {


				this._isAnimating = !0;
				k = this;
				j = "undefined" != typeof b;
				f = k.$tabUl.find("li");
				e = j ? f.eq(b) : null;
				h = f.eq(c);
				e && e.removeClass("sel");
				h.addClass("sel")
					.css({
						opacity: .5
					})
					.animate(
						{
							opacity: 1
						},
						k._duration, "linear");


				d = k.$contEl;
				g = this.$contEl.find('.dt-detail').eq(c);
				l = void 0;
				i = a.innerWidth;
				g && g.addClass("visible").show();

				if (j) {

					l = d.find(".visible").length;
					if (2 >= l) {

						d.css({
							width: "200%"
						});

					} else {
						d.css({
							width: 100 * l + "%"
						});
					}

					if (c > b) {
						d.css({
							"-webkit-transform": "translateX(0)"
						});
						lib.Transition.move(d[0], -i, 0, function () {
							g.siblings() && g.siblings().removeClass("visible").hide();
							d.attr("style", "");
							k._isAnimating = !1;
							k._disX = void 0;
						});

					} else {
						d.css({
							"-webkit-transform": "translateX(-" + i + "px)"
						});

						lib.Transition.move(d[0], i, 0, function () {
							g.siblings() && g.siblings().removeClass("visible").hide();
							d.attr("style", "");
							k._isAnimating = !1;
							k._disX = void 0;
						});
					}

				} else {
					this._isAnimating = !1
				}


			}

		},

		destroy: function () {

			this.$el.off("click");

		}

	};

	b.Tab = tab;
}(window, window.lib || (window.lib = {})));


