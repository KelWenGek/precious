KISSY.add("tb-page/taobao-home/0.0.62/mods/requestAnimationFrame",
		function () {
			var e = navigator.userAgent.toLowerCase().indexOf("taobrowser") > -1;
			window.requestNextAnimationFrame = function () {
				if (e) return function (e) {
					setTimeout(function () {
						e && e()
					})
				};
				var t = void 0,
					o = void 0,
					n = 0,
					a = navigator.userAgent,
					r = 0,
					i = this;
				return window.webkitRequestAnimationFrame && (o = function (e) {
							void 0 === e && (e = +new Date),
								i.callback(e)
						},
						t = window.webkitRequestAnimationFrame,
						window.webkitRequestAnimationFrame = function (e, n) {
							i.callback = e,
								t(o, n)
						}),


					window.mozRequestAnimationFrame && (r = a.indexOf("rv:"), -1 != a.indexOf("Gecko") && (n = a.substr(r + 3, 3), "2.0" === n && (window.mozRequestAnimationFrame = void 0))),


					window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function (e, t) {
						var o, n;
						window.setTimeout(function () {
								o = +new Date,
									e(o),
									n = +new Date,
									i.timeout = 1e3 / 60 - (n - o)
							},
							i.timeout)
					}
			}();

			window.cancelNextRequestAnimationFrame = window.cancelRequestAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout
		}),
	KISSY.add("tb-page/taobao-home/0.0.62/mods/mod-loader", ["dom", "event", "node", "json", "./monitor", "reporter", "datalazyload"],
		function (e, t) {
			t("dom"),
				t("event");
			var o = t("node"),
				n = t("json"),
				a = t("./monitor"),
				r = t("reporter"),
				i = t("datalazyload");
			new a;
			var d = 0,
				s = o.all,
				m = new i({
					diff: {
						top: 50,
						bottom: 50
					},
					autoDestroy: !0
				}),

				//模块加载构造器
				c = function () {
					this.init.apply(this, arguments)
				};

			return window.tmsInit = function (e, t, o) {
					new c(e, t, o)
				},
				c.prototype.init = function (e, t, o) {
					{
						var n = this,
							a = s(e);
						a.attr("tms-datakey") || ""
					}
					if (o) return void n.loadModule(a);
					var r = a.attr("preload-distance");
					r
						?
						(r = Number(r), new i({
							diff: {
								top: r || 50,
								bottom: r || 50
							},
							autoDestroy: !0
						}).addCallback(a,
							function () {
								n.loadModule(a, t)
							})) :
						m.addCallback(a,
							function () {
								n.loadModule(a, t)
							})
				},
				c.prototype.loadModule = function (e, t) {
					var o = e,
						i = o.attr("tms"), //例如"tbh-banner/0.0.2","tbh-search/0.0.2"
						s = o.attr("tms-datakey") || ""; //例如"222243"
					if (!t) {
						var m = o.attr("tms-data");
						m && (t = n.parse(m))
					}
					var c = ++d;
					c = 10 > c ?
						"0" + c :
						c;
					var u = +new Date;
					if (!o.hasClass("tbh-loaded")) {
						//Loader加载模块时，发现模块不存在
						if (!i) return void r.send({
								category: "ERROR_Loader_Crash",
								msg: "Loader\u52a0\u8f7d\u6a21\u5757\u65f6\uff0c\u53d1\u73b0\u6a21\u5757\u4e0d\u5b58\u5728 " + s
							},
							"warn");
						//加载模块
						//变量i代表模块名
						KISSY.use("tb-mod/" + i + "/index",
							function (e, n) {
								o.addClass("tbh-loaded"),

									//绑定加载事件
									o.on("M:load",
										function () {
											var e = i + "~" + s;
											o.removeClass("tbh-loading"),
												o.all(".tb-loading").removeClass("tb-loading"),
												o.detach("M:load"),
												//模块序号及模块名
												a.tin("\u6a21\u5757\u5e8f\u53f7: " + c + ", \u6a21\u5757\u540d: " + e, u)
										}),

									//构造模块,模块真正加载的开始,触发加载事件
									new n(o, t),


									//8s之后查看模块是否加载成功
									setTimeout(function () {
											//都过了 8s 了，模块未完成加载
											o.hasClass("tbh-loading") && (r.send({
													msg: "\u90fd\u8fc7\u4e86 8s \u4e86\uff0c\u6a21\u5757\u672a\u5b8c\u6210\u52a0\u8f7d: " + i + "~" + s
												},
												"warn"), o.removeClass("tbh-loading"), o.all(".tb-loading").removeClass("tb-loading"))
										},
										8e3)
							})
					}
				},
				c
		}),
	KISSY.add("tb-page/taobao-home/0.0.62/mods/performance", ["node", "reporter", "promise", "json", "event"],
		function (e, t) {
			function o() {
				function t(e) {
					return n(".tbh-promo img", e).item(0).attr("src")
				}

				function o(e) {
					var t = [];
					return n(".mod-first img", e).each(function (e) {
							var o = n(e).attr("src");
							t.push(o)
						}),
						t
				}

				function a(e) {
					var t = [];
					return n(".tbh-tanx img", e).each(function (e) {
							t.push(n(e).attr("src"))
						}),
						t
				}

				var i = n(".J_Screen"),
					d = [],
					s = 0,
					m = "",
					c = null;
				return new r(function (r, u) {
					n(window).on("load",
						function () {
							setTimeout(function () {
									d.push(t(i)),
										d = d.concat(o(i)),
										d = d.concat(a(i)),
										e.each(d,
											function (e) {
												e = "//" == e.slice(0, 1) ?
													"https:" + e :
													e;
												var t = performance.getEntriesByName(e)[0];
												t && t.responseEnd > s && (s = t.responseEnd, m = e, c = t)
											}),
										r({
											firstPaint: s,
											lastImg: m,
											resourceTiming: c
										})
								},
								6e3)
						})
				})
			}

			var n = t("node").all,
				a = t("reporter"),
				r = t("promise"),
				i = t("json");
			t("event"),
				window.performance && window.performance.getEntriesByName && o().then(function (e) {
					a.send({
							category: "DATA_Performance_firstPaint",
							msg: i.stringify(e)
						},
						"warn")
				}).fail(function (e) {
					a.send({
							category: "WARN_Performance_get_error",
							msg: e
						},
						"warn")
				})
		}),
	KISSY.add("tb-page/taobao-home/0.0.62/mods/monitor", ["event", "node", "offline", "reporter"],
		function (e, t) {
			t("event");
			var o = t("node"),
				n = t("offline"),
				a = t("reporter"),
				r = o.all,
				i = new n,
				d = function () {
					d.__loaded || (d.__loaded = !0, d.startTime = +new Date, this.init(), d.tin("Monitor"))
				};
			return d.tin = function (e, t) {
					var o = +new Date,
						n = +new Date,
						r = "";
					window.g_config && (o = 1 * window.g_config.startDate),
						window.performance && window.performance.timing && window.performance.now && (o = performance.timing.connectStart, n = performance.now() + o),
						t && (r = ", \u82b1\u9500\u65f6\u95f4: " + parseInt(n - t) + "ms"); //花销时间
					var i = e + " \u5f00\u59cb\u65f6\u95f4: " + parseInt(+n - d.startTime) + "ms" + r; //开始时间
					d.startTime ?
						a.send({
							msg: i
						}) :
						d.startTime = o || +new Date
				},
				r(document).on("DOMContentLoaded",
					function () {
						d.tin("DOMContentLoaded")
					}),
				r(window).on("load",
					function () {
						d.tin("Window onload")
					}),
				d.prototype.init = function () {
					var e = this;
					this.checkOffline(),
						this.cacheUsage(),
						r(window).on("load",
							function () {
								e.addClickTracker(),
									e.scrollPV(),
									e.modulePVDots()
							})
				},
				d.prototype.modulePVDots = function () {
					var e = [],
						t = {};
					r("div[preload-distance]").each(function (o) {
							var n = r(o),
								a = n.offset().top;
							t[a] = o,
								e.push(a)
						}),
						e = e.sort(function (e, t) {
							return e > t ?
								1 :
								-1
						});
					var o, n = r(window);
					n.on("scroll", o = function () {
							if (0 === e.length) return void n.detach("scroll", o);
							for (var i = n.scrollTop() + n.height(), d = 0, s = e.length; s > d; d++) {
								var m = e[d],
									c = r(t[m]);
								if (i >= m && c.hasClass("tbh-loaded")) {
									e.splice(d, 1),
										s--;
									var u = c.attr("tms") + "-" + c.attr("tms-datakey") || "",
										l = c.attr("data-name") || "",
										f = c.one('a[href*="pvid"]'),
										w = f && f.attr("href"),
										p = w && w.match(/pvid=([^&$#]*)/);
									a.send({
										msg: "\u53d1\u9001\u771f\u5b9e\u66dd\u5149\u57cb\u70b9(" + l + "): " + u, //发送真实曝光埋点
										goldlog: ["/tbindex.20160406.1", "", {
												name: l,
												pvid: p && p[1] || ""
											},
											"H46985920"
										]
									})
								}
							}
						}),
						o()
				},
				d.prototype.checkOffline = function () {
					try {
						i.setItem("OFFLINE_CHECKER", "1")
					} catch (e) {
						i.clear()
					} finally {
						i.removeItem("OFFLINE_CHECKER")
					}
					return i.setItem("__OFFLINE_ENABLE_CHECK", "Barret"),
						"Barret" !== i.getItem("__OFFLINE_ENABLE_CHECK") ?
						void a.send({
								category: "ERROR_Not_Support_Offline",
								msg: "\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u672c\u5730\u50a8\u5b58\uff0c\u54ce....\u592a\u632b\u4e86"
							},
							"warn") :
						void i.removeItem("__OFFLINE_ENABLE_CHECK")
				},
				d.prototype.cacheUsage = function () {
					var e = parseInt(i.usedByte() / 1024 / 1024);
					e >= 2.5 && a.send({
								category: "WARN_Memory-Explosion",
								msg: "LocalStorage \u5185\u5b58\u8d85\u8fc7 2.5M"
							},
							"warn"),
						e >= 4 && (i.clear(), a.send({
								category: "ERROR_Memory-Overflow",
								msg: "LocalStorage \u5185\u5b58\u8d85\u8fc7 20M\uff0c\u5df2\u7ecf\u5f3a\u5236\u6e05\u7a7a\u5185\u5b58\uff01"
							},
							"warn"))
				},
				d.prototype.scrollPV = function () {
					for (var t = [], o = r(window), n = [], i = 700, d = 350, s = 0; 30 > s; s++) t.push(i + d * s);
					var m;
					o.on("scroll", m = function () {
							var r = o.scrollTop();
							e.each(t,
									function (e) {
										r >= e && !KISSY.inArray(e, n) && (n.push(e), a.send({
											goldlog: ["/tbindex.2014.10", "", {
													top: e
												},
												"H46896546"
											],
											msg: e + "px \u89e6\u53d1\u57cb\u70b9" //触发埋点
										}))
									}),
								t.length == n.length && o.detach("scroll", m)
						}),
						m()
				},
				d.prototype.addClickTracker = function () {
					function e(e, t, o, n) {
						var a, i = r(e);
						i && !i.attr("data-spm-click") && (t = t ?
							";name=" + t :
							"", n = n || "/tbindex", o = o || "d2016", a = "gostr=" + n + ";locaid=" + o + t, i.attr("data-spm-click", a))
					}

					e(".J_Conve a[href*='zhaocaibao.alipay.com']", "\u8682\u8681\u91d1\u670d\u62db\u8d22\u5b9d\u9996\u9875"), //"蚂蚁金服招财宝首页"
						e(".J_QrFt", "\u4e8c\u7ef4\u7801\u5173\u95ed\u6309\u94ae"), //二维码关闭按钮
						e(".J_PromoOpt .prev", "\u9996\u7126prev\u6309\u94ae", "d500"), //首焦prev按钮
						e(".J_PromoOpt .next", "\u9996\u7126next\u6309\u94ae", "d600"),
						e(".J_TmallOpt .prev", "\u5929\u732bprev\u6309\u94ae", "d500"), //天猫prev按钮
						e(".J_TmallOpt .next", "\u5929\u732bnext\u6309\u94ae", "d600")
				},
				d
		}),
	KISSY.add("tb-page/taobao-home/0.0.62/index", ["./mods/requestAnimationFrame", "ua", "dom", "node", "reporter", "./mods/mod-loader", "./mods/performance"],
		function (e, t) {
			t("./mods/requestAnimationFrame");
			var o = t("ua"),
				n = t("dom"),
				a = t("node"),
				r = t("reporter"),
				i = t("./mods/mod-loader");
			t("./mods/performance");
			var d = a.all,
				s = [];
			if (!(o.ie && o.ie < 8)) {
				//类名js钩子,用于模块构造
				d(".J_Module").each(function (e) {
					var t = d(e),
						o = t.attr("tms"),
						n = t.attr("tms-data");
					return t.hasClass("tb-pass") ?
						void r.send({
							msg: "\u8df3\u8fc7\u6a21\u5757 " + o
						}) :
						void(/promo|tmall|tanx|notice|member/.test(o) //首屏关键模块优先加载
							?
							window.requestNextAnimationFrame(function () {
								new i(t, n, /tanx/.test(o))
							}) :
							s.push({
								$mod: t,
								data: n,
								force: /fixedtool|decorations|bubble|tbh-sale|fix-bottom/.test(o)
							})) //非首屏关键模块推入懒加载队列
				});
				var m = !1,
					c = function () {
						if (!m) {
							m = !0,
								d(window).detach("mousemove scroll mousedown touchstart touchmove keydown resize onload", c);
							//当首屏关键模块加载后,在用户交互的时候加载其他模块
							for (var e; e = s.shift();)
								~ function (e) {
									window.requestNextAnimationFrame(function () {
										new i(e.$mod, e.data, e.force)
									})
								}(e)
						}
					};

				//在首屏加载期间,当用户处于以下事件交互时,触发构造其他模块
				d(window).on("mousemove scroll mousedown touchstart touchmove keydown resize onload", c),


					//5s后加载其他模块
					window.requestNextAnimationFrame(function () {
							c()
						},
						5e3),


					//页面缩放时加入特定类来控制页面排版
					d(window).on("resize",
						function () {
							var e = d("body"),
								t = n.viewportWidth();
							KISSY.each([990, 1024, 1190, 1365, 1440],
								function (o) {
									o >= t ?
										e.addClass("s" + o) :
										e.removeClass("s" + o)
								})
						}).fire("resize")
			}
		}),
	KISSY.add("tms/xtemplate", ["cookie", "json", "xtemplate"],
		function (e, t) {
			var o = t("cookie"),
				n = t("json"),
				a = t("xtemplate"),
				r = {
					cookies: o,
					JSON: n,
					Math: Math,
					RegExp: RegExp,
					"typeof": function (e) {
						return null === e ?
							"null" :
							void 0 === e ?
							"undefined" :
							Array.isArray(e) ?
							"array" :
							e instanceof Date ?
							"date" :
							typeof e
					},
					url: function () {
						var t = {};
						return e.each("href,protocol,host,hostname,port,pathname,search,hash".split(","),
								function (e) {
									t[e] = location[e]
								}),
							t.query = e.unparam(location.search.slice(1)),
							t
					}(),
					now: +new Date
				},
				i = ["assets", "tms", "redirect"],
				d = function () {};
			e.each(i,
				function (e) {
					a.addCommand(e, d)
				});
			var s = a.prototype.render;
			return a.prototype.render = function () {
					return arguments[0] = new a.Scope(arguments[0], {
							$env: r
						}),
						s.apply(this, arguments)
				},
				a
		});