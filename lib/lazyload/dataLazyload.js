define("x/datalazyload", ['util', 'dom', 'event', 'base'], function (require, exports, module) {
	var o,
		a,
		_ = require('util'),
		r = require("dom"),
		i = require("event"),
		c = require("base");
	//包含用于检测是否支持webp图片格式方法的对象
	o = function (t) {
		"use strict";
		//设置webpsupport以标记支持webp图片格式
		function checkWebpSupport(t) {
			//本地缓存中已设置webpsupport，则直接根据webpsupport来设置_isSupport
			var e = window.localStorage && window.localStorage.getItem("webpsupport");
			return null !== e ?
				void t("true" === e) :
				void isWebpSupport(function (e) { //如果没有设置，则根据 函数isWebpSupport来检测是否支持并设置webpsupport
					window.localStorage && window.localStorage.setItem("webpsupport", e);
					t(e);
				});
		}

		//检测是否支持webp图片格式,并同时进行帧测试,检验帧时间是否超过16ms
		function isWebpSupport(t) {
			var e, n = new Image;
			n.onload = n.onerror = function () {
				if (!e) {
					e = !0;
					//图片加载失败时,n.width && 2 === n.height为false.
					t(2 === n.width && 2 === n.height);
				}
			};
			setTimeout(function () {
				if (!e) {
					e = !0;
					t(!1);
				}
			}, 16);
			//如果图片载入超过16ms,即一帧的时间超过了16ms,超过16ms表示帧时间太长,也等同于不支持webp图片格式
			//如果图片在16ms内成功载入 则setItem("webpsupport", true),否则setItem("webpsupport", false)
			n.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA"
		}

		//检验是否支持 web storage
		function isLocalStorageNameSupported() {
			var t = window;
			if ("object" == typeof localStorage) {
				var e = "test",
					n = window.sessionStorage;
				try {
					n.setItem(e, "1");
					n.removeItem(e);
					t.__isLocalStorageNameSupported__ = 1;
					return !0;
				} catch (o) {
					t.__isLocalStorageNameSupported__ = -1;
					return !1;
				}
			}
		}

		var webp = window.WebP = {};

		//用于设置_isSupport
		webp.isSupport = function (t) {
			var n = window;
			if (t) {
				!n.__isLocalStorageNameSupported__ && isLocalStorageNameSupported();
				if (-1 === n.__isLocalStorageNameSupported__) {
					//判断如果不支持web storage,则同时表示不支持webp图片格式,直接用原来的图片src路径
					t(!1);
				} else if (1 === n.__isLocalStorageNameSupported__) {
					//判断如果支持web storage
					if (void 0 === a._isSupport) {
						return void checkWebpSupport(function (e) {
							//如果一帧时间在16ms以内,则图片成功载入后设置_isSupport=true,同时设置webpsupport
							t(a._isSupport = e);
						});
					}
					t(a._isSupport);
				} else {
					t(!1);
				}
			}
		};
		return t = webp;
	}();
	a = function (t) {
		"use strict";

		//转换图片后缀为webp
		function webpReplacer(t) {
			var e = !!~t.indexOf(".alicdn.com"),
				n = t.indexOf(".jpg") || t.indexOf(".png");
			e && n && (t += "_.webp");
			return t;
		}

		//图片占位符处理
		function placeholder(t) {
			var e, n, o, a = [];
			return function (r, i) {
				0 === i || i || (i = 1);
				if (1 & i && !n) {
					n = !0;
					t(function (t) {
						for (e = t; o = a.shift();) {
							try {
								o && o.apply(null, [e])
							} catch (n) {
								setTimeout(function () {
									throw n;
								}, 0);
							}
						}
					});
				}
				return e ?
					(r && r.apply(null, [e]), e) :
					(2 & i || r && a.push(r), e);
			}
		}

		//节流函数,一定时间间隔中不连续触发,后来触发的覆盖之前触发的，保证在时间间隔中只触发一次，
		function throttle(t, e, n) {
			function o() {
				if (a) {
					a.cancel();
					a = 0;
				}
				r = _.now();
				t.apply(n || this, arguments);
				i = _.now();
			}

			var a, r = 0,
				i = 0,
				e = e || 150;
			return _.mix(function () {
				if (!r || i >= r && _.now() - i > e || r > i && _.now() - r > 8 * e) {
					o();
				} else {
					a && a.cancel();
					a = _.later(o, e, 0, null, arguments);
				}
			}, {
				stop: function () {
					if (a) {
						a.cancel();
						a = 0;
					}
				}
			});
		}


		//l(this, t.get("execScript"), t.get("onStart"))

		function l(t, e, n) {
			t.style.display = I;
			t.className = "";
			var o = p.create("<div>");
			t.parentNode.insertBefore(o, t);
			var a = t.value;
			if (_.isFunction(n)) {
				var r = n({
					type: "textarea",
					elem: t,
					value: a
				});
				r && (a = r);
			}
			//将textarea中的值写入div并执行其中的script
			//做法是用于异步渲染
			p.html(o, a, e);
			return o;
		}

		//获取模块懒加载宽度
		function getWidth(t) {
			return t._ks_lazy_width ?
				t._ks_lazy_width :
				t._ks_lazy_width = p.outerWidth(t)
		}

		//获取模块懒加载高度
		function getHeight(t) {
			return t._ks_lazy_height ?
				t._ks_lazy_height :
				t._ks_lazy_height = p.outerHeight(t)
		}


		//获取模块容器offset 并判断是否出现在可视区域内
		function isDisplay(t, e, n) {
			if (!t.offsetWidth) return !1;
			var o, a = p.offset(t),
				r = !0,
				i = a.left,
				c = a.top,
				l = {
					left: i,
					top: c,
					right: i + getWidth(t),
					bottom: c + getHeight(t)
				};
			o = isOverlap(e, l);
			o && n && (r = isOverlap(n, l));
			return r && o;
		}


		//判断模块元素容器是否出现在可视区域内 即元素容器是否与可视区域相交
		function isOverlap(t, e) {
			var n = {};
			n.top = Math.max(t.top, e.top);
			n.bottom = Math.min(t.bottom, e.bottom);
			n.left = Math.max(t.left, e.left);
			n.right = Math.min(t.right, e.right);
			return n.bottom >= n.top && n.right >= n.left;
		}

		function loadCustomLazyData(t, e, n, o) {
			"img-src" === e && (e = "img");
			_.isArray(t) || (t = [p.get(t)]);
			var a = new LazyLoad(w, {});
			a.set("imgFlag", n || b + S);
			a.set("areaFlag", n || k + S);
			a.set("onStart", o);
			a.set("force", !0);
			a.addElements(t, e);
		}

		//	r = t("dom"),
		//	i = t("event"),
		//	c = t("base");
		var
			p = r,
			h = i,
			v = c,
			y = modulex.Env.host, //window
			w = y.document,
			b = "data-ks-lazyload",
			k = "ks-datalazyload",
			S = "-custom",
			A = "default",
			I = "none",
			x = "scroll",
			F = "touchmove",
			H = "resize",
			N = 100,
			z = 0,
			//C(this, t.get("imgFlag"), t.get("onStart"), t.get("webpReplacer"), t.get("webp"))
			imgLazyLoad = function (t, n, a, r, i) {
				n = n || b;
				var c = t.getAttribute(n),
					l = {
						type: "img",
						elem: t,
						src: c
					},
					s = !_.isFunction(a) || a(l) !== !1,
					u = o;
				s && l.src && ! function () {
					//图片懒加载
					var o = function (e) {
						t.src != e && (t.src = e);
						t.removeAttribute(n); //图片懒加载完之后移除懒加载标志
					};
					_.isFunction(r) //如果自定义webp图片转换规则存在
						?
						u.isSupport(function (t) {
							o(t ?
								r(l.src) :
								l.src)
						}) :
						i ?
						u.isSupport(function (t) {
							o(t ?
								webpReplacer(l.src) : //利用默认webp图片转换规则
								l.src)
						}) :
						o(l.src); //如果都不存在则不进行webp格式转换,还是用原先的图片格式
				}()
			};

		function LazyLoad(t, e) {
			var n = this;
			if (!(n instanceof d)) return new LazyLoad(t, e);
			var o = t;
			//参数t可以单独传递一个dom元素充当container
			if (!_.isPlainObject(o)) {
				o = e || {};
				t && (o.container = t);
			}
			//将ATTRS对象属性中的值进行替换
			d.superclass.constructor.call(n, o);
			n._callbacks = {};
			n._containerIsNotDocument = 9 != n.get("container").nodeType; //false
			_.isArray(o.container) && (n._backCompact = 1); //this._backCompact == undefined
			n._initLoadEvent();
			o.container && n.addElements(o.container);
			n._loadFn();
			_.ready(function () {
				n._loadFn();
			});
			n.resume();
		}


		LazyLoad.ATTRS = {
			diff: {
				value: A
			},
			placeholder: {
				value: "//g.alicdn.com/s.gif" //图片占位符 1X1的一张透明图片
			},
			execScript: {
				value: !0
			},
			container: {
				setter: function (t) {
					t = t || w;
					_.isWindow(t) ?
						t = t.document :
						(t = p.get(t), "body" == p.nodeName(t) && (t = t.ownerDocument));
					return t;
				},
				valueFn: function () {
					return w;
				}
			},
			autoDestroy: {
				value: !0
			},
			onStart: {
				value: null
			}
		};
		_.extend(LazyLoad, v, {
			_initLoadEvent: function () {
				var t = this,
					e = t.get("autoDestroy"); //e==true
				t.imgHandle = function () {
					imgLazyLoad(this, t.get("imgFlag"), t.get("onStart"), t.get("webpReplacer"), t.get("webp"));
				};
				t.textareaHandle = function () {
					t.addElements(l(this, t.get("execScript"), t.get("onStart")));
				};
				//初始化时的loadFn为了加载首屏关键模块,还一个用处是,在将除非首屏模块加入懒加载队列时,5s之后是直接构造好该模块
				t._loadFn = throttle(function () {
					e && 0 == t._counter && _.isEmptyObject(t._callbacks) && t.destroy();
					t._loadItems();
				}, N, t);
			},
			refresh: function () {
				this._loadFn()
			},
			_loadItems: function () {
				var t = this,
					e = t.get("container");

				if (!t._containerIsNotDocument || e.offsetWidth) {

					//获取窗口可视区域及元素容器可视区域位置
					t._windowRegion = t._getBoundingRect();
					if (!t._backCompact && t._containerIsNotDocument) {
						t._containerRegion = t._getBoundingRect(t.get("container"));
					}

					//初始化时 _callbacks为空对象
					_.each(t._callbacks, function (e, n) {
						e && t._loadItem(n, e);
					});
				}

			},
			_loadItem: function (t, e) {
				var n = this,
					e = e || n._callbacks[t];
				if (!e) return !0;
				var o = e.el,
					a = !1,
					r = e.fn;
				//懒加载判断,如果模块出现窗口可视区域并且出现在模块容器元素可视区域内,则加载模块
				//首屏模块直接出现在可视区域中,即在初始化时直接加载
				//其他模块在初始化时并没有加载,需要滚动至窗口可视区域才加载
				if (n.get("force") || isDisplay(o, n._windowRegion, n._containerRegion)) try {
					a = r.call(o);
				} catch (i) {
					setTimeout(function () {
							throw i;
						},
						0);
				}
				a !== !1 && delete n._callbacks[t];
				return a;
			},

			//通过添加进行加载
			addCallback: function (t, e) {
				t = p.get(t);
				var n = this,
					o = n._callbacks,
					a = {
						el: t || document,
						fn: e || _.noop
					},
					r = ++z;
				o[r] = a;
				n._windowRegion ?
					n._loadItem(r, a) :
					n.refresh();
			},
			removeCallback: function (t, e) {
				t = p.get(t);
				var n = this._callbacks;
				_.each(n, function (o, a) {
					o.el == t && (e ?
						o.fn == e :
						1) && delete n[a];
				});
			},
			getElements: function () {
				var t = this,
					e = [],
					n = [],
					o = t._callbacks;
				return _.each(o, function (o) {
					o.fn == t.imgHandle && e.push(o.el);
					o.fn == t.textareaHandle && n.push(o.el);
				}), {
					images: this._images,
					textareas: this._textareas
				}
			},
			addElements: function (t, e) {
				"string" == typeof t
					?
					t = p.query(t) :
					_.isArray(t) || (t = [t]);
				var o = this;
				o._counter = o._counter || 0;
				_.each(t, function (t) {
					if (!(e && "img" !== e)) {
						//过滤出所有需要懒加载的图片img元素
						var filtered = _.filter([t].concat(p.query("img", t)), function (t) {
							return t.getAttribute && t.getAttribute(o.get("imgFlag") || b);
						}, o);
						_.each(filtered, function (t) {
							//设置图片懒加载占位符
							o.onPlaceHolder = o.onPlaceHolder || placeholder(function (t) {
								var e = new Image,
									//默认占位符
									n = o.get("placeholder");
								e.src = n;
								e.onload = e.onerror = function () {
									//不管图片加载成功还是失败都先设置成图片占位符
									t(n);
								}
							});
							//对所有过滤出来的需要懒加载的图片img元素添加进懒加载器中
							//图片已载入
							if (t.offsetWidth) {
								//t为当前图片img元素
								o.addCallback(t, o.imgHandle);
							}
							//R'UR' d'R'F' R2U' R'UR' FRF
							//图片未载入
							else {
								o._counter++;
								t.onload = function () {
									o._counter--;
									o.addCallback(t, o.imgHandle);
								};
								t.src || o.onPlaceHolder(function (e) {
									t.src || (t.src = e);
								});
							}
						});
					}
					if (!(e && "textarea" !== e)) {
						_.each(p.query("textarea." + (o.get("areaFlag") || k), t), function (t) {
							//t表示textarea元素
							o.addCallback(t, o.textareaHandle);
						});
					}
				});
			},
			removeElements: function (t) {
				"string" == typeof t
					?
					t = p.query(t) :
					_.isArray(t) || (t = [t]);
				var e = this,
					n = e._callbacks;
				_.each(n, function (e, o) {
					_.inArray(e.el, t) && delete n[o];
				});
			},
			_getBoundingRect: function (t) {
				var e, n, o, a;
				//传递t变量
				if (void 0 !== t) {
					e = p.outerHeight(t);
					n = p.outerWidth(t);
					var r = p.offset(t);
					o = r.left;
					a = r.top
				} else { //未传递t变量
					n = p.viewportWidth();
					e = p.viewportHeight();
					o = p.scrollLeft();
					a = p.scrollTop();
				}
				var i = this.get("diff"),
					c = i === A ?
					n :
					i,
					l = 0,
					s = c,
					u = i === A ?
					e :
					i,
					f = 0,
					d = u,
					g = o + n, //n+o代表文档最左侧距离屏幕右侧边缘的距离
					m = a + e; //e+a代表文档最顶端距离屏幕底部边缘的距离

				if (_.isObject(i)) {
					l = i.left || 0;
					s = i.right || 0;
					f = i.top || 0;
					d = i.bottom || 0;
				}
				//l=0,
				//s=0,
				//f=200,
				//d=200,

				o -= l;
				g += s;
				a -= f; //代表从底部出现在屏幕的时机
				m += d;

				//返回当前document文档在屏幕上的区域距离文档左上角的rect  offset对象
				//文档向上滚动
				return {
					left: o, //可视区域距离文档最左侧的左边界 减去提前预加载的距离之后得到
					top: a, //可视区域距离文档最顶部的上边界 减去提前预加载的距离之后得到
					right: g, //可视区域距离文档最左侧的右边界 加上提前预加载的距离之后得到
					bottom: m //可视区域距离文档最顶部的下边界 加上提前预加载的距离之后得到
				};
			},
			pause: function () {
				var t = this,
					e = t._loadFn;

				if (!t._destroyed) {
					h.remove(y, x, e);
					h.remove(y, F, e);
					h.remove(y, H, e);
					e.stop();

				}
				if (t._containerIsNotDocument) {
					var n = t.get("container");
					h.remove(n, x, e);
					h.remove(n, F, e);
				}
			},
			resume: function () {
				var t = this,
					e = t._loadFn;
				//x== 'scroll'  F=='touchmove' H=='resize'
				if (!t._destroyed) {
					h.on(y, x, e);
					h.on(y, F, e);
					h.on(y, H, e);
				}
				//在document和模块容器上绑定滚动事件,触摸事件,缩放事件 来触发懒加载
				if (t._containerIsNotDocument) {
					var n = t.get("container");
					h.on(n, x, e);
					h.on(n, F, e);
				}
			},
			destroy: function () {
				var t = this;
				t.pause();
				t._callbacks = {};
				t.fire("destroy");
				t._destroyed = 1;
			}
		});
		LazyLoad.loadCustomLazyData = m;
		_.DataLazyload = LazyLoad;
		return t = LazyLoad;
	}();
	module.exports = a;
});