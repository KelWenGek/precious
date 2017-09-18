KISSY.add("tb-mod/tbh-banner/0.0.2/index", ["kg/offline/6.0.4/index", "node", "anim"],
	function (t, n) {
		function i(t) {
			this.el = t,
				this.init(),
				t.fire("M:load")//触发加载事件用于dom操作及消息发布
		}

		var e = n("kg/offline/6.0.4/index"),
			a = new e,
			r = n("node"),
			s = r.all;
		return n("anim"),
			i.prototype = {
				init      : function () {
					this.bannerEl = s(".topBanner", this.el);
					var t = this.bannerEl.hasClass("anim"),
						n = this.bannerEl.attr("data-continue");
					if (t) if (this._hasShow()) this._anim();
					else {
						var i = this;
						setTimeout(function () {
								i._anim()
							},
							1e3 * n || 3e3)
					}
				},
				_anim     : function () {
					var t = this,
						n = this.bannerEl.attr("data-width"),
						i = this.bannerEl.attr("data-height"),
						e = this.bannerEl.attr("data-img");
					this.bannerEl.animate({
							height : i,
							opacity: .5
						},
						{
							duration: .3,
							easing  : "ease-in",
							complete: function () {
								t.bannerEl.height(i),
									t.bannerEl.animate({
											opacity: 1
										},
										{
											duration: .3
										}),
									s("img", t.bannerEl)
										.css({
											width : n,
											height: i
										})
										.attr("src", e),
									t._setExpire()
							}
						})
				},
				_hasShow  : function () {
					return a.getItem("activity-banner")
				},
				_setExpire: function () {
					if (!a.get("activity-banner")) {
						var t = new Date,
							n = t.getHours(),
							i = t.getMinutes(),
							e = t.getSeconds(),
							r = 60 * (23 - n) * 60 * 1e3 + 60 * (59 - i) * 1e3 + 1e3 * (59 - e);
						a.setItem("activity-banner", "1", r)
					}
				}
			},
			i
	});
KISSY.add("tb-mod/tbh-search/0.0.2/sticky", ["anim", "ua", "node"],
	function (e, a) {
		a("anim");
		var t = a("ua"),
			o = a("node"),
			n = o.all,
			s = n(window),
			r = function () {
				t.ie && t.ie <= 8 || this.init()
			};
		return r.prototype.init = function () {
			var e = "wrap-fixed",
				a = !1,
				t = !1,
				o = n("#J_SiteNav"),
				r = o.height(),
				l = n(".J_Cup"),
				i = n(".J_Top"),
				c = function () {
					var o = s.scrollTop(),
						c = l.offset().top;
					if (o > c + 100) {

						if (!a) {
							a = !0;
							l.addClass(e);
							TB.isFixed && i.animate(
								{
									top: r
								},
								{
									duration: .2,
									easing  : "easeOut"
								}
							);
						}

						if (!t && TB.$sug) {

							t = !0;
							TB.$sug.css({
								position: "fixed",
								top     : TB.isFixed
									? r + 39
									: 39
							});

						}
						n("#J_SearchFt")
							.hide();
					} else {


						if (a) {

							a = !1;
							i.css("top", 0);
							l.removeClass(e);

						}
						if (t && TB.$sug) {
							t = !1, TB.$sug.css({
								position: "absolute",
								top     : c + 91
							});
						}

						n("#J_SearchFt")
							.show();
						n("#J_SearchIcon")
							.show();

					}
				};
			c();
			s.on("scroll", c);
		},
			r
	}),
	KISSY.add("tb-mod/tbh-search/0.0.2/index", ["io", "ua", "anim", "json", "node", "cookie", "./sticky", "reporter", "xtemplate", "event-binder"],
		function (e, a) {
			var t = a("io"),
				o = a("ua"),
				n = a("anim"),
				s = a("json"),
				r = a("node"),
				l = a("cookie"),
				i = a("./sticky"),
				c = a("reporter"),
				h = a("xtemplate"),
				d = a("event-binder"),
				u = r.all,
				m = document,
				p = window.HubCache = window.HubCache || {},
				g = function (e) {
					var a = this,
						t = this.el = u(e);
					this.$tab = t.one(".J_SearchTabBox"),
						this.$q = u("#q"),
						this.$label = t.one(".J_Placeholder"),
						this.forms = m.forms.search,
						this.$icon = t.one(".J_SearchIcon"),
						this.events = {
							"mouseenter #J_SearchTab": "toggleTabHandler",
							"mouseleave #J_SearchTab": "toggleTabHandler",
							"click .J_SearchTab"     : "clickTabHandler",
							"focusin #q"             : "focusInputHandler",
							"focusout #q"            : "blurInputHandler",
							"keyup #q"               : "keyupInputHandler",
							"input #q"               : "keyupInputHandler",
							"click #J_SearchIcon"    : "clickIconHandler"
						},
						new i,
						a.cloneLine(),
						a.loadAlimamaWord(),
						a.placeholder(),
						a.init()
				};
			g.prototype.cloneLine = function () {
				u(".search-hots-lines")
					.append(u(".search-hots-fline")
						.clone(!0)
						.attr({
							"class"      : "search-hots-sline",
							"data-spm-ab": "sline"
						}))
			},
				g.prototype.init = function () {
					var e = this;
					e.initSearchSuggest(),
						e.setSPM("taobao-item"),
						d(this),
						e.el.fire("M:load")
				},
				g.prototype.placeholder = function () {
					function a(a) {
						var t = a.match(/(\w+?:\/\/[^\?#&]+)(\?([^$#]+))?/);
						return t && t[1] && t[3]
							? {
							action: t[1],
							params: e.unparam(t[3])
						}
							: !1
					}

					var o = this,
						n = u(".J_TbSearchContent label"),
						s = "//s.taobao.com/search?app=api&m=word&oeid=",
						r = n.attr("data-oeid");
					r && t({
						scriptCharset: "gbk",
						url          : s + r,
						dataType     : "jsonp",
						success      : function (e) {
							if (p.be_search_input = e, e && e.success && e.data.length > 0) {
								var t = e.data[0],
									l = "<span style='display:none;'>" + t.word_keyword + "</span>" + (t.word_title || t.word_keyword);
								if (n.html(l)
									 .attr("data-searchtype-item", l)
									 .show(), !t.word_url) return;
								var i = a(t.word_url);
								u(".J_SearchPanel form")
									.attr("action", i.action);
								for (var h in i.params)"q" != h && o.hidden(!0, h, i.params[h])
							} else n.show(),
								c.send({
										category: "ERROR_NODATA_" + s + r,
										msg     : "API: " + +s + r
									},
									"warn")
						},
						error        : function () {
							n.show(),
								c.send({
										category: "ERROR_FAILED_" + s + r,
										msg     : "API: " + +s + r
									},
									"warn")
						}
					})
				};
			var f = window.suggestModuleVersion || "6.2.3";
			return g.prototype.initSearchSuggest = function () {
				var a = this;
				e.use("kg/search-suggest/" + f + "/index,kg/search-suggest/" + f + "/plugin/history,kg/search-suggest/" + f + "/plugin/cloud,kg/search-suggest/" + f + "/plugin/tab,kg/search-suggest/" + f + "/plugin/history-magic,kg/search-suggest/" + f + "/plugin/imgsearch,kg/search-suggest/" + f + "/theme/pailitao/,kg/search-suggest/" + f + "/new_suggest.css",
					function (e, t, n, s, r, l, i, h) {
						var d = this,
							p = ["channelEntry", "history", "c2c_activity", "dapei_top", "cat", "global", "list", "dapei_bottom", "scene", "shop", "tmall", "cloud"],
							g = [new n, new r({
								activeCls: "selected",
								node     : a.el.all("li.J_SearchTab")
							}), new s, new l],
							f = "//suggest.taobao.com/sug?k=1&area=c2c",
							b = !(u(m)
								.scrollTop() > 0),
							_ = "";
						if (!(o.ie && o.ie <= 7)) {
							var v = new i({
								input: "#J_IMGSeachUploadBtn",
								type : "iframe",
								theme: new h({
									formNode   : "#J_TSearchForm",
									queueTarget: "#J_UploaderMessage"
								})
							});
							g.push(v),
								u("#J_UploaderPanel")
									.show()
						}
						var y = new t({
							placeholder: {
								show: !0,
								node: "#tbSearchContent",
								api : "//suggest.taobao.com/sug?area=shade_recommand&code=utf-8"
							},
							plugins    : g,
							sugConfig  : {
								sourceUrl   : f,
								node        : "#q",
								focused     : b,
								resultFormat: _
							},
							mods       : {
								sort : p,
								tmall: {
									tmpl: ['<div class="{prefixCls}menu-extras-cate extras-mall" data-key="q={tmall}&suggest=tmall_{$index}&tab=mall">', '<span class="{prefixCls}menu-key">{tmall}</span>', "<b>\u5929\u732b\u76f8\u5173</b>", "</div>"].join("")
								},
								scene: {
									tmpl: ['<div class="{prefixCls}menu-extras-cate extras-scene" data-action="http://fa.taobao.com/search" data-key="q={scene}&suggest=scene_{$index}">', '<span class="{prefixCls}menu-key">{scene}</span>', "<b>\u88c5\u4fee\u5b9d\u5178/\u9009\u8d2d\u79d8\u7c4d</b>", "</div>"].join("")
								}
							}
						});
						y.on("beforeImageSuccess",
							function () {
								c.send({
									msg: "\u56fe\u7247\u4e0a\u4f20\u6210\u529f"
								})
							}),
							y.comboBox.on("beforeShow",
								function () {
									TB.$sug || (TB.$sug = y.get("menu")
														   .get("el"))
								}),
							y.comboBox.on("click",
								function () {
									c.send(u(".J_Cup")
										.hasClass("wrap-fixed")
										? {
										goldlog: ["/tbindex.2014.11", "", {
											type: 2
										},
											"H46896547"]
									}
										: {
										goldlog: ["/tbindex.2014.11", "", {
											type: 1
										},
											"H46896547"]
									})
								}),
						o.ie && 11 === o.ie && y.comboBox.get("menu")
												.on("afterRenderUI",
													function () {
														this.get("el")
															.on("click", {
																fn  : function (e) {
																	y.comboClick(e)
																},
																once: !0
															})
													}),
							a.comboBox = y.comboBox,
						b || d.forms && (d.forms.className = ""),
							u(".btn-search")
								.on("click",
									function (t) {
										t.halt();
										var o, n = a.$q,
											s = u("#J_TSearchForm");
										if ("" === e.trim(n.val())) {
											if (a.isTmall) o = u(".J_TmallPlaceholder")
												.children("label")
												.attr("data-q"),
												a.hidden(!0, "from", "tbmain_1_placeholder");
											else {
												a.setSPM("taobao-item");
												var r = u("span", ".J_TbPlaceholder");
												r && r.length && (o = r.text(), s.append('<input type="hidden" name="hintq" value="1">')),
													a.hidden(!1)
											}
											a.$label.hide(),
												n.val(o)
										} else a.setSPM("taobao-item");
										s.fire("submit")
									})
					})
			},
				g.prototype.setSPM = function (a) {
					var t = this,
						o = [u("meta[name=spm-id]")
							.attr("content")];
					o.push(u("body")
						.attr("data-spm")),
						o.push(t.el.attr("data-spm") + "-" + a),
						o.push(e.trim(u("#q")
							.val())
							? "1"
							: "2"),
						t.forms.spm.value = o.join(".")
				},
				g.prototype.toggleTabHandler = function (e) {
					var a = this,
						t = e.type;
					"mouseenter" === t
						? a.$tab.addClass("triggers-hover")
						: a.$tab.removeClass("triggers-hover")
				},
				g.prototype.clickTabHandler = function (e) {
					var a = this,
						t = u(e.currentTarget);
					if (u(".J_Cup")
							.hasClass("wrap-fixed")) {
						var o = u("ul", a.$tab),
							n = o.item(0);
						t[0] !== n[0] && o.prepend(t)
					}
					a.forms.search_type.value = t.attr("data-searchType"),
						a.isTmall = "true" === t.attr("data-tmall"),
						a.isTmall
							? (u(".J_SearchPanel")
							.addClass("tmall-search-panel"), a.setSPM("tmall"), a.loadTmallWord(), u(".J_TmallSearchContent")
							.show(), u(".J_TbSearchContent")
							.hide())
							: (u(".J_SearchPanel")
							.removeClass("tmall-search-panel"), a.setSPM("taobao-item"), u(".J_TmallSearchContent")
							.hide(), u(".J_TbSearchContent")
							.show()),
					a.$q.val() && u(".J_TmallSearchContent, .J_TbSearchContent")
						.hide()
				},
				g.prototype.hidden = function (e, a, t) {
					var o = u(".J_SearchPanel")
						.all("form");
					if (e) {
						var n = '<input type="hidden" name="{{name}}" value="{{value}}" class="hidden-{{name}}">',
							s = new h(n).render({
								name : a,
								value: t
							});
						u(".hidden-" + a).length || o.append(s)
					} else {
						var r = u(".hidden-" + a);
						r.length && r.remove()
					}
				},
				g.prototype.loadAlimamaWord = function () {
					var e = this,
						a = TB && TB.Global && TB.Global.getNick(),
						o = l.get("cna"),
						n = "//textlink.simba.taobao.com";
					t({
						scriptCharset: "gbk",
						url          : n,
						dataType     : "jsonp",
						data         : {
							name : "tbhs",
							cna  : o,
							nn   : encodeURIComponent(a) || "",
							count: 13,
							pid  : "430266_1006"
						},
						timeout      : 4
					})
						.then(function (a) {
							var t = a[0];
							if (p.be_search_hotlinks = t, t.success && t.data && t.data.length > 0) {
								var o = '{{#each (data)}}<a href="{{link}}" {{#if (highlight)}} class="h"{{/if}}>{{query}}</a>{{/each}}',
									r = new h(o).render(t);
								u(".search-hots-sline")
									.html(r),
									e._alimamaWordRun()
							} else c.send({
									category: "ERROR_NODATA_" + n,
									msg     : "API: " + n + ", DATA: " + s.stringify(t)
																		  .slice(0, 500),
									sampling: 10
								},
								"warn")
						})
						.fail(function () {
							c.send({
									category: "ERROR_FAILED_" + n,
									msg     : "API: " + n
								},
								"warn")
						})
				},
				g.prototype._alimamaWordRun = function () {
					var e = .6,
						a = "ease-out";
					u(".search-hots-lines")
						.css("top", 0),
						setTimeout(function () {
								new n(u(".search-hots-lines"), {
										top: -23
									},
									e, a).run()
							},
							10)
				},
				g.prototype.loadTmallWord = function () {
					var e = this;
					if (e.tmallWord) return e.tmallWord;
					var a = '<div class="search-hots">{{#each (list)}}<a href="http://list.tmall.com/search_product.htm?sourceId=tb.index&commend=all&q={{query}}&from=tbmain_1.{{xindex}}_hq" {{#if (highlight)}} class="h"{{/if}}>{{query}}</a>{{/each}}</div>',
						o = "//suggest.taobao.com/sug?area=tmall-hq&code=utf-8&src=tbmain";
					t({
						scriptCharset: "gbk",
						url          : o,
						dataType     : "jsonp"
					})
						.then(function (t) {
							var o = t[0];
							if (p.be_search_tmall = o, o.success) {
								e.tmallWord = o;
								var n = o.model,
									s = n.placeholder && n.placeholder[0];
								s && u(".J_TmallPlaceholder")
									.all("label")
									.text(s.text)
									.attr("data-q", s.query);
								var r = new h(a).render(n);
								u(".J_TmallHotWord")
									.html(r)
							}
						})
				},
				g.prototype.focusInputHandler = function () {
					var e = this;
					e.forms.className = "search-panel-focused"
				},
				g.prototype.blurInputHandler = function () {
					var a = this;
					"" === e.trim(a.$q.val()) && (a.forms.className = "")
				},
				g.prototype.keyupInputHandler = function () {
					var a = this;
					"" === e.trim(a.$q.val())
						? (u(".J_Placeholder")
						.hide(), a.isTmall
						? u(".J_TmallSearchContent")
						.show()
						: u(".J_TbPlaceholder")
						.show(), a.$icon.show())
						: (a.$label.hide(), a.$icon.hide()),
					a.$q.val() && u(".J_TmallSearchContent, .J_TbSearchContent")
						.hide()
				},
				g.prototype.clickIconHandler = function () {
					var e = this;
					e.$q.fire("focus")
				},
				g
		});
KISSY.add("tb-mod/tbh-logo/0.0.1/index", ["node"],
	function (n, t) {
		function o() {
			this.init()
		}

		{
			var i = t("node");
			i.all
		}
		return o.prototype.init = function () {},
			o
	});
KISSY.add("tb-mod/tbh-qr/0.0.1/index", ["node", "webp", "event-binder"],
	function (e, t) {
		var i = t("node"),
			n = t("webp"),
			d = t("event-binder"),
			r = i.all,
			o = function (e) {
				this.el = r(e),
					this.events = {
						"click .J_QrFt": "hideHandler"
					},
					this.init()
			};
		return o.prototype.init = function () {
			d(this),
				n(this.el.all("img"))
		},
			o.prototype.hideHandler = function () {
				var e = this;
				e.el.hide()
			},
			o
	});
KISSY.add("tb-mod/tbh-nav/0.0.2/index",
	function (n, t) {
		var d = function (n) {};
		return d
	});
KISSY.add("tb-mod/tbh-tanx/0.0.1/index", ["tanx"],
	function (n, t) {
		var a = t("tanx");
		return a
	});
KISSY.add("tb-mod/tbh-promo/0.0.3/index", ["webp", "tanx", "node", "aladdin", "slide", "reporter", "event-binder"],
	function (e, n) {
		var o = n("webp"),
			t = n("tanx"),
			a = n("node"),
			r = n("aladdin"),
			l = n("slide"),
			i = n("reporter"),
			d = n("event-binder"),
			s = a.all,
			p = function () {
				this.init.apply(this, arguments)
			};
		return p.prototype.init = function (e) {
			var n = this;
			n.el = s(e),
				n.$opt = n.el.all(".J_PromoOpt"),
				n.events = {
					"click .J_Prev": "prevHandler",
					"click .J_Next": "nextHandler"
				},
				d(this);
			var o = n.index = n.el.one(".promo-bd")
							   .attr("data-index") || 0;
			o = parseInt(o);
			var t = window.location.search.slice(1),
				a = n.el.one(".mod-six");
			if (a && t) {
				var r = KISSY.unparam(t);
				r && null !== r.six
					? n.gosix = 1
					: a.remove()
			} else a && a.remove();
			n.initSlider(o)
		},
			p.prototype.initSlider = function (e) {
				var n = this;
				if (!s(".promo-bd .mod").length) return void i.send({
						category: "ERROR_Promo_Module_Init_Faild",
						msg     : "Promo \u6a21\u5757\u5728\u670d\u52a1\u5668\u6784\u5efa\u5931\u8d25" //"Promo 模块在服务器构建失败"
					},
					"warn");
				if (n.slide = new l(n.el, {
						contentClass: "promo-bd",
						pannelClass : "mod",
						navClass    : "promo-nav",
						effect      : "hSlide",
						timeout     : 5e3,
						carousel    : !0,
						autoSlide   : !0,
						touchmove   : !0,
						defaultTab  : parseInt(e)
					}), n.el.on("mouseenter",
						function () {
							n.$opt.show()
						}), n.el.on("mouseleave",
						function () {
							n.$opt.hide()
						}), n.slide.on("beforeSwitch",
						function (e) {
							var t = e.pannelnode;
							o(t.all("img"), null, "IGNORE_WEBP"),
								n.loadContent(t)
						}), n.gosix) return n.slide.go(6),
					void n.el.fire("M:load");
				n.renderTanx(),
				0 == e && e++;
				var t = n.slide.pannels.item(e);
				n.loadContent(t),
					n.el.fire("M:load")
			},
			p.prototype.renderTanx = function () {
				this.el.all(".J_Tanx")
					.each(function (e) {
						var n = s(e),
							o = Number(n.attr("data-lazychance"));
						o = isNaN(o)
							? 1
							: o;
						var a = Math.random() >= o;
						a && (new t(n), n.removeClass("J_Tanx"))
					})
			},
			p.prototype.loadContent = function (e) {
				var n = e.hasClass("J_Tanx"),
					o = e.hasClass("J_Ald");
				n && (new t(e), e.removeClass("J_Tanx")),
				o && (new r(e), e.removeClass("J_Ald"))
			},
			p.prototype.prevHandler = function (e) {
				var n = this;
				e.preventDefault(),
					n.slide.previous()
			},
			p.prototype.nextHandler = function (e) {
				var n = this;
				e.preventDefault(),
					n.slide.next()
			},
			p
	});
KISSY.add("tb-mod/tbh-tmall/0.0.11/index", ["webp", "tanx", "node", "aladdin", "slide", "reporter", "event-binder"],
	function (e, a) {
		var n = (a("webp"), a("tanx")),
			t = a("node"),
			l = a("aladdin"),
			o = a("slide"),
			d = a("reporter"),
			r = a("event-binder"),
			i = t.all,
			s = {},
			m = function (e) {
				this.el = i(e),
					this.$opt = this.el.all(".J_TmallOpt"),
					this.events = {
						"click .J_Prev": "prevHandler",
						"click .J_Next": "nextHandler"
					},
					this.init()
			};
		return m.prototype.init = function () {
			var e = this;
			e.initSlider(),
				r(this)
		},
			m.prototype.initSlider = function () {
				var e = this;
				if (!i(".tmall-bd .mod").length) return void d.send({
						category: "ERROR_Tmall_Module_Init_Faild",
						msg     : "Tmall \u6a21\u5757\u5728\u670d\u52a1\u5668\u6784\u5efa\u5931\u8d25" //"Tmall 模块在服务器构建失败"
					},
					"warn");
				e.slide = new o(e.el, {
					contentClass: "tmall-bd",
					pannelClass : "mod",
					navClass    : "tmall-nav",
					effect      : "hSlide",
					timeout     : 5e3,
					carousel    : !0,
					autoSlide   : !0,
					touchmove   : !0
				}),
					e.el.on("mouseenter",
						function () {
							e.$opt.show()
						}),
					e.el.on("mouseleave",
						function () {
							e.$opt.hide()
						}),
					e.slide.on("beforeSwitch",
						function (a) {
							var n = a.pannelnode,
								t = n.index();
							7 == n.index() && (t = 1),
							0 == n.index() && (t = 6),
								i(".tmall-hd strong i")
									.text(t),
								e.loadContent(n, t),
								e.loadTanx(n)
						}),
					e.renderTanx();
				var a = e.slide.pannels.item(1);
				e.loadContent(a, 1),
					e.el.fire("M:load")
			},
			m.prototype.prevHandler = function (e) {
				var a = this;
				e.preventDefault(),
					a.slide.previous()
			},
			m.prototype.nextHandler = function (e) {
				var a = this;
				e.preventDefault(),
					a.slide.next()
			},
			m.prototype.renderTanx = function () {
				this.el.all(".J_Tanx")
					.each(function (e) {
						var a = i(e),
							t = Number(a.attr("data-lazychance"));
						t = isNaN(t)
							? 1
							: t;
						var l = Math.random() >= t;
						l && (new n(a), a.removeClass("J_Tanx"))
					})
			},
			m.prototype.loadContent = function (e, a) {
				if (!e.hasClass("tanx-wrapper")) {
					var n = e.all("a").length;
					n = n >= 12
						? 12
						: n >= 5
						? 6
						: null,
						e.removeClass("mod-6")
						 .removeClass("mod-12"),
					n && e.addClass("mod-" + n)
				}
				if (e.addClass("mod-loaded"), e.hasClass("J_TanxWrapper")) return a in s || (s[a] = 1, d.send({
					goldlog: ["/tbindex.2016201863.1", "", {
						frame: a
					},
						"H47671113"],
					msg    : "\u5929\u732b\u7cbe\u9009\u7b2c " + a + " \u5e27\u66dd\u5149"
				})),
					void this.loadTanx(e);
				if (e.hasClass("J_Ald")) {
					a in s || (s[a] = 1, d.send({
						goldlog: ["/tbindex.2016201863.1", "", {
							frame: a
						},
							"H47671113"],
						msg    : "\u5929\u732b\u7cbe\u9009\u7b2c " + a + " \u5e27\u66dd\u5149"
					}));
					var o = e.attr("data-id"),
						r = t.one(".J_Ald_" + o);
					if (r && !r.hasClass("J_Ald")) return e.html(r.html()),
						void e.removeClass("J_Ald");
					var i = "_240x240.jpg";
					e.hasClass("mod-6") && (i = "_300x300.jpg"),
					e.hasClass("mod-12") && (i = "_100x100.jpg"),
						new l(e,
							function (a) {
								if (a && a[o] && a[o].data && a[o].data.length > 0) {
									var n = a[o].data.length;
									n = n >= 12
										? 12
										: n >= 5
										? 6
										: null,
										e.removeClass("mod-6")
										 .removeClass("mod-12"),
									n && e.addClass("mod-" + n)
								}
							},
							i),
						e.removeClass("J_Ald")
				}
			},
			m.prototype.loadTanx = function (e) {
				if (e.hasClass("J_TanxWrapper")) {
					var a = e.all(".J_Tanx");
					a.each(function (e) {
						new n(e)
					});
					var l, o = !1,
						d = function () {
							if (!o) {
								var a = t.one(".tanx-wrapper");
								if (a.all("img").length) {
									var n = a.html();
									e.html(n)
									 .removeClass("J_TanxWrapper"),
										o = !0
								} else l = setTimeout(d, 50)
							}
						};
					d()
				}
			},
			m
	});
KISSY.add("tb-mod/tbh-member/0.0.5/login-xtpl",
	function (e, t, a, r) {
		var i = r.exports = function (e) {
			{
				var t, a = this,
					r = a.root,
					i = a.buffer,
					o = a.scope,
					n = (a.runtime, a.name, a.pos),
					s = o.data,
					m = o.affix,
					l = r.nativeCommands,
					c = r.utils;
				c.callFn,
					c.callDataFn,
					c.callCommand,
					l.range,
					l["void"],
					l.foreach,
					l.forin,
					l.each,
					l["with"],
					l["if"],
					l.set,
					l.include,
					l.parse,
					l.extend,
					l.block,
					l.macro,
					l["debugger"]
			}
			i.data += '<div class="member-column-4">\n    <a href="//buyertrade.taobao.com/trade/itemlist/list_bought_items.htm?cell_change=1&action=itemlist/QueryAction&event_submit_do_query=1&auctionStatus=SEND&tradeRemindFrom=SEND">\n        <strong>',
				n.line = 3;
			var d = (t = m.a) !== e
				? t
				: (t = s.a) !== e
				? t
				: o.resolveLooseUp(["a"]);
			i = i.writeEscaped(d),
				i.data += '</strong>\u5f85\u6536\u8d27\n    </a>\n    <a href="//buyertrade.taobao.com/trade/itemlist/list_bought_items.htm?action=itemlist/QueryAction&event_submit_do_query=1&auctionStatus=NOT_SEND&tradeRemindFrom=NOT_SEND">\n        <strong>',
				n.line = 6;
			var u = (t = m.d) !== e
				? t
				: (t = s.d) !== e
				? t
				: o.resolveLooseUp(["d"]);
			i = i.writeEscaped(u),
				i.data += '</strong>\u5f85\u53d1\u8d27\n    </a>\n    <a href="//buyertrade.taobao.com/trade/itemlist/list_bought_items.htm?cell_change=1&action=itemlist/QueryAction&event_submit_do_query=1&auctionStatus=NOT_PAID&tradeRemindFrom=NOT_PAID&mytaobao_daifukuan">\n        <strong>',
				n.line = 9;
			var b = (t = m.b) !== e
				? t
				: (t = s.b) !== e
				? t
				: o.resolveLooseUp(["b"]);
			i = i.writeEscaped(b),
				i.data += '</strong>\u5f85\u4ed8\u6b3e\n    </a>\n    <a href="//buyertrade.taobao.com/trade/itemlist/list_bought_items.htm?cell_change=1&action=itemlist/QueryAction&event_submit_do_query=1&auctionStatus=ALL&commentStatus=I_HAS_NOT_COMMENT&tradeRemindFrom=I_HAS_NOT_COMMENT">\n        <strong>',
				n.line = 12;
			var _ = (t = m.c) !== e
				? t
				: (t = s.c) !== e
				? t
				: o.resolveLooseUp(["c"]);
			return i = i.writeEscaped(_),
				i.data += "</strong>\u5f85\u8bc4\u4ef7\n    </a>\n</div>",
				i
		};
		i.TPL_NAME = r.id || r.name
	}),
	KISSY.add("tb-mod/tbh-member/0.0.5/index", ["io", "node", "cookie", "offline", "reporter", "./login-xtpl", "tms/xtemplate"],
		function (e, t) {
			function a() {
				return u.getTag()
			}

			function r(e) {
				return u.getNick(e)
			}

			var i = t("io"),
				o = t("node"),
				n = t("cookie"),
				s = t("offline"),
				m = t("reporter"),
				l = t("./login-xtpl"),
				c = t("tms/xtemplate"),
				d = new s,
				u = window.TB && TB.Global,
				b = u && u.isLogin(),
				_ = {
					"\u5317\u4eac": "member-bg-beijing",
					"\u4e0a\u6d77": "member-bg-shanghai",
					"\u5e7f\u5dde": "member-bg-guangzhou",
					"\u6df1\u5733": "member-bg-shenzhen",
					"\u676d\u5dde": "member-bg-hangzhou",
					"default"     : "member-bg-default"
				},
				h = o.all,
				p = "//ju.mmstat.com/?url=//i.taobao.com/my_taobao.htm?ad_id=&am_id=&cm_id=&pm_id=1501036000a02c5c3739",
				g = "//wwc.alicdn.com/avatar/getAvatar.do?userNick={userNick}&width=80&height=80&type=sns&_input_charset=UTF-8",
				f = "//vip.taobao.com",
				v = "//i.taobao.com/json/my_taobao_remind_data.htm",
				y = "//taojinbi.taobao.com/index.htm",
				N = y + "?auto_take=true",
				M = function (e) {
					this.el = h(e),
						this.tag = a(),
						this.init(),
						b
							? this.setBg()
							: this.el.addClass(_["default"])
				};
			return M.prototype.setBg = function () {
				var e = d.getItem("city");
				return e && _[e]
					? void this.el.addClass(_[e])
					: (this.el.addClass(_["default"]), void setTimeout(function () {
						i({
							url     : "//tbip.alicdn.com/api/queryip",
							dataType: "jsonp",
							success : function (e) {
								if (e && e.data && e.data.city) {
									var t = e.data.city,
										a = /\u5317\u4eac|\u4e0a\u6d77|\u5e7f\u5dde|\u6df1\u5733|\u676d\u5dde/.exec(t);
									a = a && a[0],
									a && d.setItem("city", a)
								}
							}
						})
					},
					8e3))
			},
				M.prototype.init = function () {
					var t = this;
					if (this.renderApass(), b) {
						var a = t.el.all(".J_MemberClub");
						t.tag < 1 && a.attr("href", "//new.taobao.com");
						var i = t.el.all(".J_MemberPunch");
						i.attr({
							href      : y,
							"data-spm": "d1"
						}),
							t.render()
					} else t.el.all(".J_MemberAvatar")
							.attr({
								src: e.substitute(g, {
									userNick: r(!0)
								})
							}),
						t.el.fire("M:load")
				},
				M.prototype.render = function () {
					var t = this,
						o = t.el.all(".J_MemberHome"),
						n = t.el.all(".J_MemberNick"),
						s = t.el.all(".J_MemberAvatar"),
						l = t.el.all(".J_MemberVip");
					o.attr("href", p),
					r() && n.html(r()),
						s.attr({
							src: e.substitute(g, {
								userNick: r(!0)
							})
						}),
					isNaN(t.tag) || (l.addClass("vip-icon vip-icon-" + a())
									  .attr("href", f)
									  .css("display", "inline-block"), i({
						scriptCharset: "gbk",
						url          : v,
						dataType     : "jsonp",
						success      : function (e) {
							t.remind(e)
						},
						error        : function () {
							m.send({
									category: "ERROR_Member_Login_Detect_Crash",
									msg     : "\u4f1a\u5458\u533a\u57df\uff0c\u67e5\u8be2\u6536\u8d27\u4fe1\u606f\u63a5\u53e3\u83b7\u53d6\u5931\u8d25"
								},//"会员区域，查询收货信息接口获取失败"
								"warn")
						}
					})),
						t.el.fire("M:load")
				},
				M.prototype.renderApass = function () {
					var e = n.get("uc1"),
						t = e && e.match(/pas=(\d)/),
						a = ~~(t && t[1]);
					a && h(".J_MemberApass")
						.attr("href", "//apass.taobao.com/")
						.css("display", "inline-block")
				},
				M.prototype.remind = function (e) {
					var t = this,
						a = t.el.all(".J_MemberLogin"),
						r = t.el.all(".J_MemberLogout"),
						i = "true" === e[6];
					if (i) {
						h(".member-tjb")
							.addClass("member-tjb-login");
						var o = new c(l),
							n = o.render({
								a: e[3] || 0,
								b: e[1][0] || 0,
								c: e[2] || 0,
								d: e[7] || 0
							});
						a.html(n)
						 .show(),
							r.animate({
									marginTop: "-25px"
								},
								.2, "easeOut");
						var s = t.el.all(".J_MemberPunch");
						s.attr({
							href      : N,
							"data-spm": "d2"
						})
					}
				},
				M
		});
KISSY.add("tb-mod/tbh-notice/0.0.2/item-xtpl",
	function (e, a, n, t) {
		var i = t.exports = function (e) {
			function a(e, a, n) {
				var t = e.data,
					i = e.affix;
				a.data += '\n    <li><a href="',
					p.line = 5;
				var o = (d = i.link) !== n
					? d
					: (d = t.link) !== n
					? d
					: e.resolveLooseUp(["link"]);
				a = a.write(o),
					a.data += '">';
				var r = (d = i.title) !== n
					? d
					: (d = t.title) !== n
					? d
					: e.resolveLooseUp(["title"]);
				return a = a.writeEscaped(r),
					a.data += "</a></li>\n    ",
					a
			}

			function n(e, n, t) {
				var i = e.data,
					o = e.affix;
				n.data += "\n    ",
					p.line = 4,
					p.line = 4;
				var r = (d = o.xindex) !== t
						? d
						: (d = i.xindex) !== t
						? d
						: e.resolveLooseUp(["xindex"]),
					l = r;
				return l = 5 > r,
					n = y.call(c, e, {
							params: [l],
							fn    : a
						},
						n),
					n.data += "\n  ",
					n
			}

			function t(e, a, n) {
				e.data,
					e.affix;
				return a.data += " hide",
					a
			}

			function i(e, a, n) {
				e.data,
					e.affix;
				return a.data += " first",
					a
			}

			function o(e, a, n) {
				e.data,
					e.affix;
				return a.data += ' class="h"',
					a
			}

			function r(e, a, n) {
				var t = e.data,
					i = e.affix;
				a.data += '\n      <li>\n        <a href="',
					p.line = 16;
				var r = (d = i.link) !== n
					? d
					: (d = t.link) !== n
					? d
					: e.resolveLooseUp(["link"]);
				a = a.write(r),
					a.data += '"';
				var l = (d = i.enhance) !== n
						? d
						: (d = t.enhance) !== n
						? d
						: e.resolveLooseUp(["enhance"]),
					s = l;
				s = 1 === l;
				var v = s;
				if (!v) {
					var f = (d = i.enhance) !== n
							? d
							: (d = t.enhance) !== n
							? d
							: e.resolveLooseUp(["enhance"]),
						u = f;
					u = f === !0,
						v = u
				}
				var m = v;
				if (!m) {
					var x = (d = i.enhance) !== n
							? d
							: (d = t.enhance) !== n
							? d
							: e.resolveLooseUp(["enhance"]),
						h = x;
					h = "true" === x,
						m = h
				}
				a = y.call(c, e, {
						params: [m],
						fn    : o
					},
					a),
					a.data += ">";
				var g = (d = i.text) !== n
					? d
					: (d = t.text) !== n
					? d
					: e.resolveLooseUp(["text"]);
				return a = a.writeEscaped(g),
					a.data += "</a>\n      </li>\n    ",
					a
			}

			function l(e, a, n) {
				var o = e.data,
					l = e.affix;
				a.data += '\n  <div class="mod',
					p.line = 12;
				var s = (d = l.xindex) !== n
						? d
						: (d = o.xindex) !== n
						? d
						: e.resolveLooseUp(["xindex"]),
					v = s;
				v = 0 !== s,
					a = y.call(c, e, {
							params : [v],
							fn     : t,
							inverse: i
						},
						a),
					a.data += '" data-spm-ab="';
				var f = (d = l.xindex) !== n
					? d
					: (d = o.xindex) !== n
					? d
					: e.resolveLooseUp(["xindex"]);
				a = a.writeEscaped(f),
					a.data += '">\n    <ul>\n    ',
					p.line = 14,
					p.line = 14;
				var u = (d = l.items) !== n
					? d
					: (d = o.items) !== n
					? d
					: e.resolveLooseUp(["items"]);
				return a = g.call(c, e, {
						params: [u],
						fn    : r
					},
					a),
					a.data += "\n    </ul>\n  </div>\n",
					a
			}

			{
				var d, c = this,
					s = c.root,
					v = c.buffer,
					f = c.scope,
					p = (c.runtime, c.name, c.pos),
					u = f.data,
					m = f.affix,
					x = s.nativeCommands,
					h = s.utils,
					g = (h.callFn, h.callDataFn, h.callCommand, x.range, x["void"], x.foreach, x.forin, x.each),
					y = (x["with"], x["if"]);
				x.set,
					x.include,
					x.parse,
					x.extend,
					x.block,
					x.macro,
					x["debugger"]
			}
			v.data += '<div class="notice-hd" data-spm-ab="nav">\n  <ul>\n  ',
				p.line = 3,
				p.line = 3;
			var w = (d = m.category) !== e
				? d
				: (d = u.category) !== e
				? d
				: f.resolveLooseUp(["category"]);
			v = g.call(c, f, {
					params: [w],
					fn    : n
				},
				v),
				v.data += '\n  </ul>\n</div>\n<div class="notice-bd">\n',
				p.line = 11,
				p.line = 11;
			var b = (d = m.category) !== e
				? d
				: (d = u.category) !== e
				? d
				: f.resolveLooseUp(["category"]);
			return v = g.call(c, f, {
					params: [b],
					fn    : l
				},
				v),
				v.data += "\n</div>\n\n",
				v
		};
		i.TPL_NAME = t.id || t.name
	}),
	KISSY.add("tb-mod/tbh-notice/0.0.2/index", ["event", "anim", "io", "webp", "node", "json", "slide", "xctrl", "offline", "reporter", "xtemplate", "./item-xtpl"],
		function (e, a) {
			a("event"),
				a("anim");
			var n = (a("io"), a("webp"), a("node")),
				t = a("json"),
				i = a("slide"),
				o = a("xctrl"),
				r = a("offline"),
				l = a("reporter"),
				d = a("xtemplate"),
				c = a("./item-xtpl"),
				s = n.all,
				v = new r,
				f = window.HubCache = window.HubCache || {},
				p = function (e, a) {
					this.el = s(e),
						this.cfg = a,
						this.init()
				};
			return p.prototype.init = function () {
				var e = this;
				e.requestModuleData()
			},
				p.prototype.requestModuleData = function () {
					var e = this;
					e.cfg && o.dynamic({
						data    : e.cfg,
						key     : "category",
						callback: function (a) {
							var n;
							return f.tce_notice = a,
								a && a.category && a.category.length > 0
									? (v.setItem("cache-notice-tce", t.stringify(a)), n = new d(c).render(a), e.el.one(".notice")
																											   .html(n)
																											   .hide()
																											   .fadeIn(.3), void e.initSlider())
									: (a = v.getItem("cache-notice-tce"))
									? (a = t.parse(a), n = new d(c).render(a), e.el.one(".notice")
																				.html(n), l.send({
									category: "ERROR_notice_data_err",
									msg     : "\u6a21\u5757 notice \u6570\u636e\u8bf7\u6c42\u5931\u8d25, \u8d70\u7f13\u5b58" //"模块 notice 数据请求失败, 走缓存"
								}), void e.initSlider())
									: void l.send({
										category: "ERROR_notice_crash",
										msg     : "\u6a21\u5757 notice \u6570\u636e\u8bf7\u6c42\u5931\u8d25, \u5929\u7a97"//"模块 notice 数据请求失败, 天窗"
									},
									"warn")
						}
					})
				},
				p.prototype.initSlider = function () {
					var e = this;
					return e.el.fire("M:load"),
						s(".notice-bd .mod").length
							? void new i(e.el, {
							contentClass: "notice-bd",
							pannelClass : "mod",
							navClass    : "notice-hd",
							eventType   : "mouseenter"
						})
							: void l.send({
								category: "ERROR_Notice_Module_InitSlider_Faild",
								msg     : "\u6a21\u5757 Notice \u6570\u636e\u9519\u8bef, slider \u521d\u59cb\u5316\u5931\u8d25" //"模块 Notice 数据错误, slider 初始化失败"
							},
							"warn")
				},
				p
		});
KISSY.add("tb-mod/tbh-conve/0.0.3/index", ["io", "node", "slide", "reporter", "event-binder"],
	function (e, o) {
		function t(e) {
			this.el = r(e),
				this.init()
		}

		var n = o("io"),
			a = o("node"),
			s = o("slide"),
			i = o("reporter"),
			l = o("event-binder"),
			r = a.all,
			c = {
				game   : "/markets/tbhome/bianming-game",
				baoxian: "/markets/tbhome/bianming-baoxian",
				trip   : "/markets/tbhome/bianming-trip",
				phone  : "/markets/tbhome/bianming-phone"
			},
			d = "//www.taobao.com";
		return /(alicdn|taobao)\.com$/.test(window.location.host) && (d = "//" + window.location.host),
		"tms-preview.taobao.com" === window.location.host && (d = "//tms-preview.taobao.com/wh/tms/taobao/page"),
			t.prototype.init = function () {
				var e = this;
				e.$floats = r(".conve-list .conve-float"),
					e.events = {
						"mouseenter .conve-float"  : "showConveBox",
						"mousemove .conve-float"   : "showConveBox",
						"click .conve-bd-box-close": "closeConveBox"
					},
					l(e),
					e.bindCloseAction(),
					e.el.fire("M:load")
			},
			t.prototype.showConveBox = function (e) {
				var o = this,
					t = r(e.currentTarget),
					n = t.index();
				if (t.hasClass("conve-float")) {
					if (o.el.one(".conve")
						 .addClass("conve_on"), o.el.one(".conve_on") && (o.el.all(".conve-float")
																		   .removeClass("selected"), t.addClass("selected")), o.slide) return clearTimeout(o.timer),
						void(o.timer = setTimeout(function () {
								t.addClass("selected"),
									o.slide.go(n)
							},
							100));
					t.addClass("selected"),
						o.slide = new s(o.el, {
							contentClass   : "conve-bd-box",
							pannelClass    : "conve-bd-item",
							navClass       : "conve-list",
							selectedClass  : "selected",
							triggerSelector: ".conve-float",
							triggerDelay   : 300,
							eventType      : "mouseenter",
							defaultTab     : n + 1
						}),
						o.slide.on("beforeSwitch",
							function (e) {
								o["goto"](e.index)
							}),
						o["goto"](n)
				}
			},
			t.prototype["goto"] = function (e) {
				var o = this,
					t = o.el.all(".conve-list li")
						 .item(e)
						 .attr("data-name");
				if (t) {
					var a = r(".J_Conve_" + t);
					r(".J_convePop")
						.hide(),
					a.hasClass("loading") && n({
						scriptCharset: "gbk",
						url          : d + c[t],
						cache        : !1,
						dataType     : "html",
						success      : function (e) {
							return e
								? void a.removeClass("loading")
										.html(e, !0)
								: void i.send({
								category: "Error_conve_load_html_err",
								msg     : "\u83b7\u53d6 conve \u6a21\u5757\u7684 " + t + " \u5931\u8d25\uff01" //"获取 conve 模块的 失败！"
							})
						},
						error        : function () {
							i.send({
								category: "Error_conve_load_html_err",
								msg     : "\u83b7\u53d6 conve \u6a21\u5757\u7684 " + t + " \u5931\u8d25\uff01"
							})
						}
					})
				}
			},
			t.prototype.closeConveBox = function () {
				var e = this;
				clearTimeout(e.timer),
					e.el.one(".conve")
					 .removeClass("conve_on"),
					e.el.all(".conve-float")
					 .removeClass("selected")
			},
			t.prototype.bindCloseAction = function () {
				var e = this;
				r("body")
					.on("mousedown",
						function (o) {
							var t = r(o.target),
								n = t.parent(".J_Module"),
								a = o.target.nodeName.toLowerCase();
							("body" === a || t.hasClass("cup") || n && !n.parent(".J_Module") && !n.hasClass("tbh-conve")) && e.closeConveBox()
						})
			},
			t
	});
KISSY.add("tb-mod/tbh-service/0.0.10/cat-xtpl",
	function (e, a, t, r) {
		var i = r.exports = function (e) {
			function a(e, a, t) {
				var r = e.data,
					i = e.affix;
				a.data += '\n    <a href="',
					p.line = 7;
				var n = (o = i.link) !== t
					? o
					: (o = r.link) !== t
					? o
					: e.resolveLooseUp(["link"]);
				a = a.write(n),
					a.data += '"><img src="';
				var s = (o = i.logo) !== t
					? o
					: (o = r.logo) !== t
					? o
					: e.resolveLooseUp(["logo"]);
				a = a.write(s),
					a.data += '_60x60.jpg" alt="';
				var d = (o = i.name) !== t
					? o
					: (o = r.name) !== t
					? o
					: e.resolveLooseUp(["name"]);
				a = a.writeEscaped(d),
					a.data += '"/><em>';
				var l = (o = i.name) !== t
					? o
					: (o = r.name) !== t
					? o
					: e.resolveLooseUp(["name"]);
				a = a.writeEscaped(l),
					a.data += '</em></a>\n    <a href="',
					p.line = 8;
				var c = (o = i.more) !== t
					? o
					: (o = r.more) !== t
					? o
					: e.resolveLooseUp(["more"]);
				return a = a.write(c),
					a.data += '"><span>\u66f4\u591a <i class="tb-icon">&#x27a4;</i></span></a>\n    ',
					a
			}

			function t(e, a, t) {
				e.data,
					e.affix;
				return a.data += ' class="h"',
					a
			}

			function r(e, a, r) {
				var i = e.data,
					n = e.affix;
				a.data += "\n    ",
					p.line = 13;
				var s = (o = n.h) !== r
						? o
						: (o = i.h) !== r
						? o
						: e.resolveLooseUp(["h"]),
					l = s;
				l = s === !0;
				var c = l;
				if (!c) {
					var v = (o = n.h) !== r
							? o
							: (o = i.h) !== r
							? o
							: e.resolveLooseUp(["h"]),
						m = v;
					m = 1 === v,
						c = m
				}
				var u = c;
				if (!u) {
					var f = (o = n.h) !== r
							? o
							: (o = i.h) !== r
							? o
							: e.resolveLooseUp(["h"]),
						h = f;
					h = "true" === f,
						u = h
				}
				var g;
				g = w.call(d, e, {
						hash: [{
							key  : ["h"],
							value: u,
							depth: 0
						}]
					},
					a);
				var x = g;
				a = a.writeEscaped(x),
					a.data += '\n    <a href="',
					p.line = 14;
				var L = (o = n.link) !== r
					? o
					: (o = i.link) !== r
					? o
					: e.resolveLooseUp(["link"]);
				a = a.write(L),
					a.data += '"';
				var _ = (o = n.h) !== r
					? o
					: (o = i.h) !== r
					? o
					: e.resolveLooseUp(["h"]);
				a = b.call(d, e, {
						params: [_],
						fn    : t
					},
					a),
					a.data += ">";
				var I = (o = n.name) !== r
					? o
					: (o = i.name) !== r
					? o
					: e.resolveLooseUp(["name"]);
				return a = a.writeEscaped(I),
					a.data += "</a>\n  ",
					a
			}

			function i(e, t, i) {
				var n = e.data,
					l = e.affix;
				t.data += '\n<div class="service-panel">\n  <h5>\n    ',
					p.line = 5;
				var c = (o = l.head) !== i
						? o
						: (o = n.head) !== i
						? o
						: e.resolveLooseUp(["head"]),
					v = c;
				if (v) {
					var m = (o = l.head) !== i
						? null != o
						? s = o[0]
						: o
						: (o = n.head) !== i
						? null != o
						? s = o[0]
						: o
						: e.resolveLooseUp(["head", 0]);
					v = m
				}
				var u;
				u = w.call(d, e, {
						hash: [{
							key  : ["head"],
							value: v,
							depth: 0
						}]
					},
					t);
				var f = u;
				t = t.writeEscaped(f),
					t.data += "\n    ",
					p.line = 6,
					p.line = 6;
				var h = (o = l.head) !== i
					? o
					: (o = n.head) !== i
					? o
					: e.resolveLooseUp(["head"]);
				t = x.call(d, e, {
						params: [h],
						fn    : a
					},
					t),
					t.data += "\n  </h5>\n  <p>\n  ",
					p.line = 12,
					p.line = 12;
				var b = (o = l.list) !== i
					? o
					: (o = n.list) !== i
					? o
					: e.resolveLooseUp(["list"]);
				return t = g.call(d, e, {
						params: [b],
						fn    : r
					},
					t),
					t.data += "\n  </p>\n</div>\n",
					t
			}

			function n(e, a, t) {
				var r = e.data,
					n = e.affix;
				a.data += "\n",
					p.line = 2,
					p.line = 2;
				var s = (o = n.xindex) !== t
						? o
						: (o = r.xindex) !== t
						? o
						: e.resolveLooseUp(["xindex"]),
					l = s;
				return l = 3 > s,
					a = b.call(d, e, {
							params: [l],
							fn    : i
						},
						a),
					a.data += "\n",
					a
			}

			{
				var o, s, d = this,
					l = d.root,
					c = d.buffer,
					v = d.scope,
					p = (d.runtime, d.name, d.pos),
					m = v.data,
					u = v.affix,
					f = l.nativeCommands,
					h = l.utils,
					g = (h.callFn, h.callDataFn, h.callCommand, f.range, f["void"], f.foreach, f.forin, f.each),
					x = f["with"],
					b = f["if"],
					w = f.set;
				f.include,
					f.parse,
					f.extend,
					f.block,
					f.macro,
					f["debugger"]
			}
			c.data += "",
				p.line = 1;
			var L = (o = u.data) !== e
				? o
				: (o = m.data) !== e
				? o
				: v.resolveLooseUp(["data"]);
			return c = g.call(d, v, {
					params: [L],
					fn    : n
				},
				c),
				c.data += "\n",
				c
		};
		i.TPL_NAME = r.id || r.name
	}),
	KISSY.add("tb-mod/tbh-service/0.0.10/item-xtpl",
		function (e, a, t, r) {
			var i = r.exports = function (e) {
				{
					var a, t = this,
						r = t.root,
						i = t.buffer,
						n = t.scope,
						o = (t.runtime, t.name, t.pos),
						s = n.data,
						d = n.affix,
						l = r.nativeCommands,
						c = r.utils;
					c.callFn,
						c.callDataFn,
						c.callCommand,
						l.range,
						l["void"],
						l.foreach,
						l.forin,
						l.each,
						l["with"],
						l["if"],
						l.set,
						l.include,
						l.parse,
						l.extend,
						l.block,
						l.macro,
						l["debugger"]
				}
				i.data += '<div class="service-float-item" data-index="';
				var v = (a = d.index) !== e
					? a
					: (a = s.index) !== e
					? a
					: n.resolveLooseUp(["index"]);
				i = i.writeEscaped(v),
					i.data += '">\n  <div class="service-fi-links loading" data-spm-ab="links-',
					o.line = 2;
				var p = (a = d.index) !== e
					? a
					: (a = s.index) !== e
					? a
					: n.resolveLooseUp(["index"]);
				i = i.writeEscaped(p),
					i.data += '"></div>\n  <div class="service-rmd">\n    <h3><i class="tb-icon">&#xe618;</i>\u731c\u4f60\u559c\u6b22</h3>\n    <div class="desc">\u5b9e\u65f6\u63a8\u8350\u6700\u9002\u5408\u4f60\u7684\u5b9d\u8d1d</div>\n    <div class="service-rmd-list loading" data-spm-ab="rmds-',
					o.line = 6;
				var m = (a = d.index) !== e
					? a
					: (a = s.index) !== e
					? a
					: n.resolveLooseUp(["index"]);
				return i = i.writeEscaped(m),
					i.data += '"></div>\n  </div>\n</div>\n',
					i
			};
			i.TPL_NAME = r.id || r.name
		}),
	KISSY.add("tb-mod/tbh-service/0.0.10/banner-xtpl",
		function (e, a, t, r) {
			var i = r.exports = function (e) {
				function a(e, a, t) {
					var i = e.data,
						n = e.affix;
					a.data += '\n<a href="',
						d.line = 3;
					var o = (r = n.url) !== t
							? r
							: (r = i.url) !== t
							? r
							: e.resolveLooseUp(["url"]),
						s = o;
					if (!s) {
						var l = (r = n.link) !== t
							? r
							: (r = i.link) !== t
							? r
							: e.resolveLooseUp(["link"]);
						s = l
					}
					a = a.write(s),
						a.data += '"><img src="//g.alicdn.com/s.gif" data-src="';
					var c = (r = n.pic) !== t
							? r
							: (r = i.pic) !== t
							? r
							: e.resolveLooseUp(["pic"]),
						v = c;
					if (!v) {
						var p = (r = n.img) !== t
							? r
							: (r = i.img) !== t
							? r
							: e.resolveLooseUp(["img"]);
						v = p
					}
					a = a.write(v),
						a.data += '_150x150.jpg" alt="';
					var m = (r = n.itemName) !== t
							? r
							: (r = i.itemName) !== t
							? r
							: e.resolveLooseUp(["itemName"]),
						u = m;
					if (!u) {
						var f = (r = n.title) !== t
							? r
							: (r = i.title) !== t
							? r
							: e.resolveLooseUp(["title"]);
						u = f
					}
					a = a.writeEscaped(u),
						a.data += '"/><span>';
					var h = (r = n.itemName) !== t
							? r
							: (r = i.itemName) !== t
							? r
							: e.resolveLooseUp(["itemName"]),
						g = h;
					if (!g) {
						var x = (r = n.title) !== t
							? r
							: (r = i.title) !== t
							? r
							: e.resolveLooseUp(["title"]);
						g = x
					}
					return a = a.writeEscaped(g),
						a.data += "</span></a>\n",
						a
				}

				function t(e, t, n) {
					var o = e.data,
						s = e.affix;
					t.data += "\n",
						d.line = 2,
						d.line = 2;
					var l = (r = s.xindex) !== n
							? r
							: (r = o.xindex) !== n
							? r
							: e.resolveLooseUp(["xindex"]),
						c = l;
					return c = 6 > l,
						t = u.call(i, e, {
								params: [c],
								fn    : a
							},
							t),
						t.data += "\n",
						t
				}

				{
					var r, i = this,
						n = i.root,
						o = i.buffer,
						s = i.scope,
						d = (i.runtime, i.name, i.pos),
						l = s.data,
						c = s.affix,
						v = n.nativeCommands,
						p = n.utils,
						m = (p.callFn, p.callDataFn, p.callCommand, v.range, v["void"], v.foreach, v.forin, v.each),
						u = (v["with"], v["if"]);
					v.set,
						v.include,
						v.parse,
						v.extend,
						v.block,
						v.macro,
						v["debugger"]
				}
				o.data += "",
					d.line = 1;
				var f = (r = c.recItemList) !== e
					? r
					: (r = l.recItemList) !== e
					? r
					: s.resolveLooseUp(["recItemList"]);
				return o = m.call(i, s, {
						params: [f],
						fn    : t
					},
					o),
					o.data += "\n",
					o
			};
			i.TPL_NAME = r.id || r.name
		}),
	KISSY.add("tb-mod/tbh-service/0.0.10/index", ["anim", "io", "webp", "node", "json", "aladdin", "offline", "reporter", "xtemplate", "./cat-xtpl", "./item-xtpl", "./banner-xtpl"],
		function (e, a) {
			a("anim");
			var t = a("io"),
				r = a("webp"),
				i = a("node"),
				n = a("json"),
				o = a("aladdin"),
				s = a("offline"),
				d = a("reporter"),
				l = a("xtemplate"),
				c = a("./cat-xtpl"),
				v = a("./item-xtpl"),
				p = a("./banner-xtpl"),
				m = i.all,
				u = -1,
				f = {},
				h = "service",
				g = new s,
				x = "cache-service-banners",
				b = "https://tui.taobao.com/recommend?appid=2807",
				w = "//tce.alicdn.com/api/data.htm",
				L = window.HubCache = window.HubCache || {},
				_ = function (e) {
					this.el = m(e),
						this.init()
				};
			return _.prototype.init = function () {
				this.bind(),
					this.collectData(),
					this.showFooter(),
					this.showHotTags(),
					this.itemXtpl = new l(v),
					this.catXtpl = new l(c),
					this.bannerXtpl = new l(p)
			},
				_.prototype.bind = function () {
					var e = this,
						a = m(".service-bd"),
						t = m(".service-bd li"),
						r = m(".service-float");
					t.on("mouseenter",
						function () {
							var a = m(this);
							e.enterTime && clearTimeout(e.enterTime),
								e.enterTime = setTimeout(function () {
										u = a.index(),
											t.removeClass("on"),
											a.addClass("on"),
											r.fadeIn(.3),
											e.showFloat()
									},
									100)
						}),
						a.on("mouseleave",
							function (a) {
								var i = m(a.relatedTarget || a.toElement || a.fromElement);
								i.hasClass("service-float") || i.parent(".service-float") || (e.enterTime && clearTimeout(e.enterTime), u = -1, t.removeClass("on"), r.hide())
							}),
						r.on("mouseenter",
							function () {
								u > -1 && (e.enterTime && clearTimeout(e.enterTime), t.item(u)
																					  .addClass("on"), r.fadeIn(.3), e.showFloat())
							})
						 .on("mouseleave",
							 function (a) {
								 var i = m(a.relatedTarget || a.toElement || a.fromElement);
								 i.hasClass("service-bd") || i.parent(".service-bd") || (e.enterTime && clearTimeout(e.enterTime), u = -1, t.removeClass("on"), r.hide())
							 }),
						e.el.fire("M:load")
				},
				_.prototype.collectData = function () {
					for (var e = n.parse(this.el.one("textarea")
											 .val()), a = [], t = [], r = 0, i = e.length; i > r; r++) {
						for (var o = e[r], s = [], d = [], l = 0, c = o.categories.length; c > l; l++) {
							var v = o.categories[l];
							s.push(v.cid),
								d.push(v.dataId),
								t.push(v.dataId)
						}
						a.push({
							groupId : o.groupId,
							closePer: 1 == o.closePer,
							backup  : o.banners,
							cids    : s,
							dataids : d,
							pvid    : 1 == o.addPvid
						})
					}
					this.config = f = a,
						this.mids = t
				},
				_.prototype.showFloat = function () {
					var e = this,
						a = m(".service-float-item"),
						t = i.one('.service-float-item[data-index="' + u + '"]');
					if (-1 == u || t) return a.hide(),
						void(t && t.show());
					var r = this.itemXtpl.render({
						index: u
					});
					m(".service-float")
						.append(r),
						a.hide(),
						i.one('.service-float-item[data-index="' + u + '"]')
						 .show(),
						e.renderModuleData(),
						e.renderBanners()
				},
				_.prototype.renderBanners = function () {
					var e = this,
						a = u,
						t = f[a].groupId,
						n = f[a].backup;
					e.requestBannerData(function (o) {
						var s = {
							recItemList: n
						};
						o = o && o.result || [];
						for (var d = 0,
								 l = o.length; l > d; d++) if (o[d] && o[d].topicId == t && o[d].recItemList && o[d].recItemList.length >= 6) {
							s = o[d];
							break
						}
						var c = e.bannerXtpl.render(s),
							v = i.one('.service-float-item[data-index="' + a + '"] .service-rmd-list');
						v.html(c)
						 .removeClass("loading"),
							r(v.all("img"))
					})
				},
				_.prototype.renderModuleData = function () {
					var e = this,
						a = u,
						t = f[a].dataids,
						n = [];
					e.requestModuleData(function (o) {
						for (var s = 0,
								 l = t.length; l > s; s++) {
							var c = t[s];
							o[c] && o[c].value && n.push(o[c].value)
						}
						var v = e.catXtpl.render({
								data: n
							}),
							p = i.one('.service-float-item[data-index="' + a + '"] .service-fi-links');
						p.html(v)
						 .removeClass("loading"),
							r(p.all("img"));
						try {
							e._addPvid(p, a)
						} catch (m) {
							d.send({
									category: "ERROR_service_cat_data_piv_err",
									msg     : h + m.message + " \u7684 cat \u6570\u636e\u6dfb\u52a0 PVID \u51fa\u9519"
								},
								"warn")
						}
					})
				},
				_.prototype._addPvid = function (e, a) {
					var t = this;
					f[a].pvid && this.pvid && m("a", e)
						.each(function (e) {
							itemEl = m(e);
							var a = itemEl.attr("href");
							if (a && a.indexOf("//") > -1) {
								var r = a.split("#")[1];
								if (a = a.split("#")[0], a.indexOf("pvid=") > -1) return;
								var i = "pvid=" + t.pvid;
								if (a.indexOf("?") > -1) {
									var n = a.split("?");
									a = n[0] + "?" + (n[1]
											? n[1] + "&" + i
											: i)
								} else a = a + "?" + i;
								a += r
									? "#" + r
									: "",
									itemEl.attr("href", a)
							}
						})
				},
				_.prototype.requestModuleData = function (e) {
					var a = this,
						r = "tce_" + h;
					return L[r]
						? void(e && e(L[r]))
						: (a.moduleRenderQueue = a.moduleRenderQueue || [], a.moduleRenderQueue.push(e), void t({
						url     : w,
						timeout : 5,
						dataType: "jsonp",
						data    : {
							ids: this.mids.join(",")
						},
						success : function (t) {
							if (L[r] = t, !t || KISSY.isEmptyObject(t)) if (t = g.getItem("cache-service-tce")) for (t = n.parse(t), e && e(t); a.moduleRenderQueue.shift();) e && e(t);
							else d.send({
										category: "ERROR_service_cat_data_err",
										msg     : "\u6a21\u5757 " + h + " \u7684 cat \u6570\u636e\u8bf7\u6c42\u683c\u5f0f\u9519\u8bef, \u65e0\u672c\u5730\u7f13\u5b58"
									},
									"warn");
							else for (g.setItem("cache-service-tce", n.stringify(t)), e && e(t); a.moduleRenderQueue.shift();) e && e(t)
						},
						error   : function () {
							var t = g.getItem("cache-service-tce");
							if (t) for (t = n.parse(t), L[r] = t, e && e(t); a.moduleRenderQueue.shift();) e && e(t);
							else d.send({
									category: "ERROR_service_cat_data_err",
									msg     : "\u6a21\u5757 " + h + " \u7684 cat \u6570\u636e\u8bf7\u6c42\u5931\u8d25, \u65e0\u672c\u5730\u7f13\u5b58"
								},
								"warn")
						}
					}))
				},
				_.prototype.requestBannerData = function (e) {
					var a = this,
						r = "tpp_" + h;
					return L[r]
						? void(e && e(L[r]))
						: (a.bannerRenderQueue = a.bannerRenderQueue || [], a.bannerRenderQueue.push(e), void t({
						url     : b,
						dataType: "jsonp",
						timeout : 3,
						success : function (t) {
							if (L[r] = t, t && t.result && t.result.length > 0) {
								for (var i = [], o = 0; 3 > o; o++) t.result[o] && t.result[o].topicId && i.push(t.result[o].topicId);
								for (i.length && g.setItem("service-hot", i.join(",")), g.setItem(x, n.stringify(t)), e && e(t); a.bannerRenderQueue.shift();) e && e(t);
								a.pvid = t.pvid
							} else if (t = g.getItem(x)) {
								for (t = n.parse(t), L[r] = t, e && e(t); a.bannerRenderQueue.shift();) e && e(t);
								d.send({
									category: "WARN_Get_Service_Per_Err",
									msg     : "\u6a21\u5757 " + h + " \u83b7\u53d6\u4e2a\u6027\u5316\u6570\u636e\u683c\u5f0f\u9519\u8bef, \u8d70\u672c\u5730\u7f13\u5b58"
								})
							} else for (d.send({
									category: "WARN_Get_Service_Per_Err",
									msg     : "\u6a21\u5757 " + h + " \u83b7\u53d6\u4e2a\u6027\u5316\u6570\u636e\u683c\u5f0f\u9519\u8bef, \u65e0\u672c\u5730\u7f13\u5b58, \u8d70\u786c\u515c\u5e95"
								},
								"warn"), L[r] = {},
										e && e(t); a.bannerRenderQueue.shift();) e && e(t)
						},
						error   : function () {
							var t = g.getItem(x);
							if (t) {
								for (t = n.parse(t), L[r] = t, e && e(t); a.bannerRenderQueue.shift();) e && e(t);
								d.send({
									category: "WARN_Get_Service_Per_Err",
									msg     : "\u6a21\u5757 " + h + " \u83b7\u53d6\u4e2a\u6027\u5316\u6570\u636e\u5931\u8d25, \u8d70\u672c\u5730\u7f13\u5b58"
								})
							} else for (d.send({
									category: "WARN_Get_Service_Per_Err",
									msg     : "\u6a21\u5757 " + h + " \u83b7\u53d6\u4e2a\u6027\u5316\u6570\u636e\u5931\u8d25, \u65e0\u672c\u5730\u7f13\u5b58, \u8d70\u786c\u515c\u5e95"
								},
								"warn"), L[r] = {},
										e && e(t); a.bannerRenderQueue.shift();) e && e(t)
						}
					}))
				},
				_.prototype.showFooter = function () {
					new o(m(".service-ft"))
				},
				_.prototype.showHotTags = function () {
					var e = g.getItem("service-hot");
					if (e) {
						e = e.split(",");
						for (var a = 0,
								 t = e.length; t > a; a++) m('.service-bd li[data-groupid="' + e[a] + '"] span')
							.addClass("tbh-tag")
					}
				},
				_
		});
KISSY.add("tb-mod/tbh-belt/0.0.6/belt-xtpl",
	function (e, t, a, i) {
		var r = i.exports = function (e) {
			function t(e, t, a) {
				e.data,
					e.affix;
				t.data += "\n      ",
					d.line = 8;
				var i;
				i = b.call(n, e, {
						hash: [{
							key  : ["num"],
							value: "\u6700\u65b0\u53d1\u73b0",
							depth: 0
						}]
					},
					t);
				var r = i;
				return t = t.writeEscaped(r),
					t.data += "\n    ",
					t
			}

			function a(e, t, a) {
				var i = e.data,
					r = e.affix;
				t.data += "\n      ",
					d.line = 10;
				var s = '<i class="tb-icon">&#xe623;</i>\u4eba\u6c14',
					o = (l = r.num) !== a
						? l
						: (l = i.num) !== a
						? l
						: e.resolveLooseUp(["num"]);
				s = '<i class="tb-icon">&#xe623;</i>\u4eba\u6c14' + o;
				var c;
				c = b.call(n, e, {
						hash: [{
							key  : ["num"],
							value: s,
							depth: 0
						}]
					},
					t);
				var p = c;
				return t = t.writeEscaped(p),
					t.data += "\n    ",
					t
			}

			function i(e, i, r) {
				var s = e.data,
					o = e.affix;
				i.data += "\n    ",
					d.line = 7,
					d.line = 7;
				var c = (l = o.num) !== r
						? l
						: (l = s.num) !== r
						? l
						: e.resolveLooseUp(["num"]),
					p = c;
				return p = 100 > c,
					i = f.call(n, e, {
							params : [p],
							fn     : t,
							inverse: a
						},
						i),
					i.data += "\n  ",
					i
			}

			function r(e, t, a) {
				e.data,
					e.affix;
				t.data += "\n    ",
					d.line = 13;
				var i;
				i = b.call(n, e, {
						hash: [{
							key  : ["num"],
							value: "\u6700\u65b0\u53d1\u73b0",
							depth: 0
						}]
					},
					t);
				var r = i;
				return t = t.writeEscaped(r),
					t.data += "\n  ",
					t
			}

			{
				var l, n = this,
					s = n.root,
					o = n.buffer,
					c = n.scope,
					d = (n.runtime, n.name, n.pos),
					p = c.data,
					u = c.affix,
					v = s.nativeCommands,
					m = s.utils,
					f = (m.callFn, m.callDataFn, m.callCommand, v.range, v["void"], v.foreach, v.forin, v.each, v["with"], v["if"]),
					b = v.set;
				v.include,
					v.parse,
					v.extend,
					v.block,
					v.macro,
					v["debugger"]
			}
			o.data += '<a href="';
			var h = (l = u.link) !== e
					? l
					: (l = p.link) !== e
					? l
					: c.resolveLooseUp(["link"]),
				g = h;
			if (!g) {
				var U = (l = u.clickUrl) !== e
					? l
					: (l = p.clickUrl) !== e
					? l
					: c.resolveLooseUp(["clickUrl"]);
				g = U
			}
			o = o.write(g),
				o.data += '" class="belt-item-';
			var x = (l = u.index) !== e
					? l
					: (l = p.index) !== e
					? l
					: c.resolveLooseUp(["index"]),
				L = x;
			L = x + 1,
				o = o.writeEscaped(L),
				o.data += '" style="visibility: visible">\n  <img src="',
				d.line = 2;
			var w = (l = u.img) !== e
					? l
					: (l = p.img) !== e
					? l
					: c.resolveLooseUp(["img"]),
				y = w;
			if (!y) {
				var k = (l = u.picUrl) !== e
					? l
					: (l = p.picUrl) !== e
					? l
					: c.resolveLooseUp(["picUrl"]);
				y = k
			}
			o = o.write(y),
				o.data += '_80x80.jpg" alt="';
			var _ = (l = u.info) !== e
					? l
					: (l = p.info) !== e
					? l
					: c.resolveLooseUp(["info"]),
				E = _;
			if (!E) {
				var N = (l = u.subtitle) !== e
					? l
					: (l = p.subtitle) !== e
					? l
					: c.resolveLooseUp(["subtitle"]);
				E = N
			}
			o = o.writeEscaped(E),
				o.data += '"/>\n  <strong>',
				d.line = 3;
			var C = (l = u.type) !== e
					? l
					: (l = p.type) !== e
					? l
					: c.resolveLooseUp(["type"]),
				A = C;
			if (!A) {
				var B = (l = u.title) !== e
					? l
					: (l = p.title) !== e
					? l
					: c.resolveLooseUp(["title"]);
				A = B
			}
			o = o.writeEscaped(A),
				o.data += "</strong>\n  <span>",
				d.line = 4;
			var D = (l = u.info) !== e
					? l
					: (l = p.info) !== e
					? l
					: c.resolveLooseUp(["info"]),
				I = D;
			if (!I) {
				var W = (l = u.subtitle) !== e
					? l
					: (l = p.subtitle) !== e
					? l
					: c.resolveLooseUp(["subtitle"]);
				I = W
			}
			o = o.writeEscaped(I),
				o.data += "</span>\n  ",
				d.line = 5;
			var j = (l = u.gNum) !== e
					? l
					: (l = p.gNum) !== e
					? l
					: c.resolveLooseUp(["gNum"]),
				R = j;
			if (!R) {
				var S = (l = u.pop) !== e
					? l
					: (l = p.pop) !== e
					? l
					: c.resolveLooseUp(["pop"]);
				R = S
			}
			var M;
			M = b.call(n, c, {
					hash: [{
						key  : ["num"],
						value: R,
						depth: 0
					}]
				},
				o);
			var q = M;
			o = o.writeEscaped(q),
				o.data += "\n  ",
				d.line = 6,
				d.line = 6;
			var F = (l = u.num) !== e
				? l
				: (l = p.num) !== e
				? l
				: c.resolveLooseUp(["num"]);
			o = f.call(n, c, {
					params : [F],
					fn     : i,
					inverse: r
				},
				o),
				o.data += "\n  <em>",
				d.line = 15;
			var H = (l = u.num) !== e
				? l
				: (l = p.num) !== e
				? l
				: c.resolveLooseUp(["num"]);
			return o = o.write(H),
				o.data += "</em>\n</a>\n",
				o
		};
		r.TPL_NAME = i.id || i.name
	}),
	KISSY.add("tb-mod/tbh-belt/0.0.6/index", ["io", "webp", "node", "json", "offline", "reporter", "./belt-xtpl", "tms/xtemplate"],
		function (e, t) {
			function a(e) {
				this.el = l.one(e),
					this.url = this.el.one(".belt")
								   .attr("data-permalink"),
				p(".J_Belt", this.el)
					.attr("data-hide") || this.init()
			}

			var i = t("io"),
				r = t("webp"),
				l = t("node"),
				n = t("json"),
				s = t("offline"),
				o = t("reporter"),
				c = t("./belt-xtpl"),
				d = t("tms/xtemplate"),
				p = l.all,
				u = new s,
				v = new d(c),
				m = window.HubCache = window.HubCache || {},
				f = "https://tui.taobao.com/recommend?appid=2952&from=PCtaobao";
			return a.prototype.init = function () {
				this.renderBEData()
			},
				a.prototype.renderBEData = function () {
					var e = this,
						t = this.el.all("a"),
						a = e.beList = [],
						i = t.filter(function () {
							var e = p(this),
								t = 1 == e.attr("data-local");
							return t
								? (e.css("visibility", "visible"), r(e.one("img")), !1)
								: (a.push({
								item : e,
								index: e.index()
							}), !0)
						});
					i.length
						? this.requestBEData(function (t) {
						if (t && t.length >= a.length) for (var l = 0,
																n = a.length; n > l; l++) {
							var s = t[l];
							s.picUrl && s.clickUrl && s.title && s.subtitle && s.clickUrl.indexOf("?") > -1 && (e.url && s.clickUrl.indexOf("?") > -1 && (s.clickUrl = e.url + "?" + s.clickUrl.split("?")[1]), s.index = a[l].index, a[l].item.replaceWith(v.render(s)))
						} else i.each(function () {
							p(this)
								.css("visibility", "visible")
						});
						r(i.all("img")),
							e.el.fire("M:load")
					})
						: this.el.fire("M:load")
				},
				a.prototype.requestBEData = function (e) {
					var t = "tpp_belt";
					i({
						scriptCharset: "gbk",
						url          : f,
						dataType     : "jsonp",
						timeout      : 5,
						success      : function (a) {
							m[t] = a,
								a && a.result && a.result[0] && a.result[0].itemList
									? (a = a.result[0].itemList, u.setItem("cache-belt", n.stringify(a)), e && e(a))
									: (a = u.getItem("cache-belt"), a
									? (o.send({
									category: "WARN_belt_data_err",
									msg     : "\u6a21\u5757 belt \u6570\u636e\u683c\u5f0f\u9519\u8bef, \u8d70\u672c\u5730\u7f13\u5b58"
								}), a = n.parse(a), e && e(a))
									: (o.send({
									category: "WARN_belt_data_err",
									msg     : "\u6a21\u5757 belt \u6570\u636e\u683c\u5f0f\u9519\u8bef, \u65e0\u672c\u5730\u7f13\u5b58, \u8d70\u5bb9\u707e\u6570\u636e"
								}), e && e()))
						},
						error        : function () {
							var t = u.getItem("cache-belt");
							t
								? (o.send({
								category: "WARN_belt_data_err",
								msg     : "\u6a21\u5757 belt \u6570\u636e\u8bf7\u6c42\u5931\u8d25, \u8d70\u672c\u5730\u7f13\u5b58"
							}), t = n.parse(t), e && e(t))
								: (o.send({
								category: "WARN_belt_data_err",
								msg     : "\u6a21\u5757 belt \u6570\u636e\u8bf7\u6c42\u5931\u8d25, \u65e0\u672c\u5730\u7f13\u5b58, \u8d70\u5bb9\u707e\u6570\u636e"
							}), e && e())
						}
					})
				},
				a
		});
KISSY.add("tb-mod/tbh-belt-activity/0.0.5/index", ["node", "kg/datalazyload/6.0.5/index"],
	function (t, n) {
		function a() {
			this.init.apply(this, arguments)
		}

		var i = n("node"),
			d = n("kg/datalazyload/6.0.5/index");
		return a.prototype = {
			init     : function (t, n) {
				var a = this;
				a._node = i.one(t),
					new d(".tbh-belt-activity"),
					a._node.fire("M:load"),
					n
						? a.loadData(n)
						: a.bindEvent()
			},
			loadData : function (t) {},
			bindEvent: function () {}
		},
			a
	});
KISSY.add("tb-mod/tbh-app/0.0.2/apps-xtpl",
	function (a, e, n, t) {
		var r = t.exports = function (a) {
			function e(a, e, n) {
				var t = a.data,
					r = a.affix;
				e.data += '<a href="';
				var i = (p = r.link) !== n
					? p
					: (p = t.link) !== n
					? p
					: a.resolveLooseUp(["link"]);
				e = e.write(i),
					e.data += '">';
				var s = (p = r.name) !== n
					? p
					: (p = t.name) !== n
					? p
					: a.resolveLooseUp(["name"]);
				return e = e.writeEscaped(s),
					e.data += "</a>",
					e
			}

			function n(a, e, n) {
				var t = a.data,
					r = a.affix;
				e.data += "";
				var i = (p = r.name) !== n
					? p
					: (p = t.name) !== n
					? p
					: a.resolveLooseUp(["name"]);
				return e = e.writeEscaped(i),
					e.data += "",
					e
			}

			function t(a, t, r) {
				var i = a.data,
					s = a.affix;
				t.data += "\n<h3>\n  ",
					f.line = 4;
				var o = (p = s.link) !== r
					? p
					: (p = i.link) !== r
					? p
					: a.resolveLooseUp(["link"]);
				t = w.call(d, a, {
						params : [o],
						fn     : e,
						inverse: n
					},
					t),
					t.data += '\n  <a class="more" href="',
					f.line = 5;
				var l = (p = s.more) !== r
					? p
					: (p = i.more) !== r
					? p
					: a.resolveLooseUp(["more"]);
				return t = t.write(l),
					t.data += '">\u66f4\u591a <i class="tb-icon">&#x27a4;</i></a>\n</h3>\n',
					t
			}

			function r(a, e, n) {
				var t = a.data,
					r = a.affix;
				e.data += "";
				var i = (p = r.link) !== n
					? p
					: (p = t.link) !== n
					? p
					: a.resolveLooseUp(["link"]);
				return e = e.write(i),
					e.data += "",
					e
			}

			function i(a, e, n) {
				a.data,
					a.affix;
				return e.data += "javascript:;",
					e
			}

			function s(a, e, n) {
				var t = a.data,
					s = a.affix;
				e.data += '\n      <li class="nav">\n        <a href="',
					f.line = 14;
				var o = (p = s.link) !== n
					? p
					: (p = t.link) !== n
					? p
					: a.resolveLooseUp(["link"]);
				e = w.call(d, a, {
						params : [o],
						fn     : r,
						inverse: i
					},
					e),
					e.data += '">\n          <img data-src="',
					f.line = 15;
				var l = (p = s.img) !== n
					? p
					: (p = t.img) !== n
					? p
					: a.resolveLooseUp(["img"]);
				e = e.write(l),
					e.data += '_60x60.jpg" src="//g.alicdn.com/s.gif" alt="\u624b\u673aapp - ';
				var c = (p = s.name) !== n
					? p
					: (p = t.name) !== n
					? p
					: a.resolveLooseUp(["name"]);
				e = e.writeEscaped(c),
					e.data += '" class="app-icon" />\n        </a>\n        <div class="app-qr">\n          <img data-src="',
					f.line = 18;
				var v = (p = s.qr) !== n
					? p
					: (p = t.qr) !== n
					? p
					: a.resolveLooseUp(["qr"]);
				e = e.writeEscaped(v),
					e.data += '_80x80.jpg" src="//g.alicdn.com/s.gif" alt="\u4f7f\u7528\u624b\u673a\u626b\u63cf';
				var m = (p = s.name) !== n
					? p
					: (p = t.name) !== n
					? p
					: a.resolveLooseUp(["name"]);
				e = e.writeEscaped(m),
					e.data += '\u7684\u4e8c\u7ef4\u7801" />\n          <p>\u626b\u4e00\u626b',
					f.line = 19;
				var u = (p = s.name) !== n
					? p
					: (p = t.name) !== n
					? p
					: a.resolveLooseUp(["name"]);
				return e = e.writeEscaped(u),
					e.data += "</p>\n          <em></em><span></span>\n        </div>\n      </li>\n      ",
					e
			}

			function o(a, e, n) {
				var t = a.data,
					r = a.affix;
				e.data += "\n      ",
					f.line = 12,
					f.line = 12;
				var i = (p = r.xindex) !== n
						? p
						: (p = t.xindex) !== n
						? p
						: a.resolveLooseUp(["xindex"]),
					o = i;
				return o = 9 >= i,
					e = w.call(d, a, {
							params: [o],
							fn    : s
						},
						e),
					e.data += "\n      ",
					e
			}

			{
				var p, l, d = this,
					c = d.root,
					v = d.buffer,
					m = d.scope,
					f = (d.runtime, d.name, d.pos),
					u = m.data,
					h = m.affix,
					x = c.nativeCommands,
					g = c.utils,
					b = (g.callFn, g.callDataFn, g.callCommand, x.range, x["void"], x.foreach, x.forin, x.each),
					L = x["with"],
					w = x["if"],
					U = x.set;
				x.include,
					x.parse,
					x.extend,
					x.block,
					x.macro,
					x["debugger"]
			}
			v.data += "";
			var k = (p = h.head) !== a
					? p
					: (p = u.head) !== a
					? p
					: m.resolveLooseUp(["head"]),
				E = k;
			if (E) {
				var y = (p = h.head) !== a
					? null != p
					? l = p[0]
					: p
					: (p = u.head) !== a
					? null != p
					? l = p[0]
					: p
					: m.resolveLooseUp(["head", 0]);
				E = y
			}
			var S;
			S = U.call(d, m, {
					hash: [{
						key  : ["head"],
						value: E,
						depth: 0
					}]
				},
				v);
			var I = S;
			v = v.writeEscaped(I),
				v.data += "\n",
				f.line = 2,
				f.line = 2;
			var j = (p = h.head) !== a
				? p
				: (p = u.head) !== a
				? p
				: m.resolveLooseUp(["head"]);
			v = L.call(d, m, {
					params: [j],
					fn    : t
				},
				v),
				v.data += '\n<div class="apps-wrapper" data-spm-ab="apps">\n  <div class="apps-bd">\n    <ul class="apps-nav">\n      ',
				f.line = 11,
				f.line = 11;
			var q = (p = h.apps) !== a
				? p
				: (p = u.apps) !== a
				? p
				: m.resolveLooseUp(["apps"]);
			return v = b.call(d, m, {
					params: [q],
					fn    : o
				},
				v),
				v.data += "\n    </ul>\n  </div>\n</div>\n\n\n",
				v
		};
		r.TPL_NAME = t.id || t.name
	}),
	KISSY.add("tb-mod/tbh-app/0.0.2/index", ["anim", "node", "webp", "json", "xctrl", "offline", "reporter", "./apps-xtpl", "tms/xtemplate"],
		function (a, e) {
			function n(a, e) {
				this.el = c(a),
					e
						? this.loadData(e)
						: this.init()
			}

			e("anim");
			var t = e("node"),
				r = e("webp"),
				i = e("json"),
				s = e("xctrl"),
				o = e("offline"),
				p = e("reporter"),
				l = e("./apps-xtpl"),
				d = e("tms/xtemplate"),
				c = t.all,
				v = new o;
			return n.prototype.init = function () {
				this.bindEvent(),
					this.initSlider(),
					this.el.fire("M:load")
			},
				n.prototype.loadData = function (a) {
					var e = this,
						n = new d(l);
					a && s.dynamic({
						data    : a,
						key     : ["head", "apps"],
						callback: function (a) {
							a.head && a.apps && !KISSY.isEmptyObject(a.head) && !KISSY.isEmptyObject(a.apps)
								? v.setItem("cache-apps-tce", i.stringify(a))
								: (p.send({
								msg: "\u6a21\u5757 apps \u7684 TCE \u63a5\u53e3\u8bf7\u6c42\u6570\u636e\u4e3a\u7a7a, \u4f7f\u7528\u672c\u5730\u50a8\u5b58"
							}), a = i.parse(v.getItem("cache-apps-tce") || ""));
							var t = n.render(a);
							e.el.one(".apps")
							 .html(t)
							 .hide()
							 .fadeIn(.3),
								e.init()
						}
					})
				},
				n.prototype.bindEvent = function () {
					c(".apps-bd .nav")
						.on("mouseenter",
							function (a) {
								r(c(a.currentTarget)
									.one(".app-qr img"), null, "IGNORE")
							})
				},
				n.prototype.initSlider = function () {
					c(".app-icon")
						.each(function (a) {
							r(c(a), null, "IGNORE")
						})
				},
				n
		});
KISSY.add("tb-mod/tbh-headline/0.0.2/headline-xtpl",
	function (e, a, i, n) {
		var t = n.exports = function (e) {
			function a(e, a, i) {
				e.data,
					e.affix;
				return a.data += " hide",
					a
			}

			function i(e, i, l) {
				var d = e.data,
					r = e.affix;
				i.data += '\n<div class="mod',
					o.line = 2;
				var s = (n = r.xindex) !== l
						? n
						: (n = d.xindex) !== l
						? n
						: e.resolveLooseUp(["xindex"]),
					c = s;
				c = 0 !== s,
					i = m.call(t, e, {
							params: [c],
							fn    : a
						},
						i),
					i.data += '">\n  <a href="',
					o.line = 3;
				var h = (n = r.link) !== l
						? n
						: (n = d.link) !== l
						? n
						: e.resolveLooseUp(["link"]),
					f = h;
				if (!f) {
					var p = (n = r.url) !== l
						? n
						: (n = d.url) !== l
						? n
						: e.resolveLooseUp(["url"]);
					f = p
				}
				i = i.write(f),
					i.data += '">\n    <img src="//g.alicdn.com/s.gif" data-src="',
					o.line = 4;
				var v = (n = r.img) !== l
						? n
						: (n = d.img) !== l
						? n
						: e.resolveLooseUp(["img"]),
					u = v;
				if (!u) {
					var g = (n = r.pic) !== l
						? n
						: (n = d.pic) !== l
						? n
						: e.resolveLooseUp(["pic"]);
					u = g
				}
				i = i.writeEscaped(u),
					i.data += '_120x120.jpg" alt="';
				var _ = (n = r.title) !== l
						? n
						: (n = d.title) !== l
						? n
						: e.resolveLooseUp(["title"]),
					b = _;
				if (!b) {
					var x = (n = r.name) !== l
						? n
						: (n = d.name) !== l
						? n
						: e.resolveLooseUp(["name"]);
					b = x
				}
				i = i.writeEscaped(b),
					i.data += '"/>\n    <em>',
					o.line = 5;
				var w = (n = r.title) !== l
						? n
						: (n = d.title) !== l
						? n
						: e.resolveLooseUp(["title"]),
					y = w;
				if (!y) {
					var L = (n = r.name) !== l
						? n
						: (n = d.name) !== l
						? n
						: e.resolveLooseUp(["name"]);
					y = L
				}
				i = i.write(y),
					i.data += "</em>\n    <p>",
					o.line = 6;
				var U = (n = r.detail) !== l
						? n
						: (n = d.detail) !== l
						? n
						: e.resolveLooseUp(["detail"]),
					H = U;
				if (!H) {
					var R = (n = r.dec) !== l
						? n
						: (n = d.dec) !== l
						? n
						: e.resolveLooseUp(["dec"]);
					H = R
				}
				return i = i.write(H),
					i.data += "</p>\n  </a>\n</div>\n",
					i
			}

			{
				var n, t = this,
					l = t.root,
					d = t.buffer,
					r = t.scope,
					o = (t.runtime, t.name, t.pos),
					s = r.data,
					c = r.affix,
					h = l.nativeCommands,
					f = l.utils,
					p = (f.callFn, f.callDataFn, f.callCommand, h.range, h["void"], h.foreach, h.forin, h.each),
					m = (h["with"], h["if"]);
				h.set,
					h.include,
					h.parse,
					h.extend,
					h.block,
					h.macro,
					h["debugger"]
			}
			d.data += "",
				o.line = 1;
			var v = (n = c.headlines) !== e
				? n
				: (n = s.headlines) !== e
				? n
				: r.resolveLooseUp(["headlines"]);
			return d = p.call(t, r, {
					params: [v],
					fn    : i
				},
				d),
				d.data += "\n",
				d
		};
		t.TPL_NAME = n.id || n.name
	}),
	KISSY.add("tb-mod/tbh-headline/0.0.2/index", ["anim", "io", "json", "node", "webp", "xctrl", "slide", "offline", "reporter", "tms/xtemplate", "./headline-xtpl"],
		function (e, a) {
			function i() {
				this.init.apply(this, arguments)
			}

			a("anim");
			var n = a("io"),
				t = a("json"),
				l = a("node"),
				d = a("webp"),
				r = a("xctrl"),
				o = a("slide"),
				s = a("offline"),
				c = a("reporter"),
				h = a("tms/xtemplate"),
				f = a("./headline-xtpl"),
				p = l.all,
				m = new s,
				v = window.HubCache = window.HubCache || {};
			return i.prototype.init = function (e, a) {
				this.el = p(e),
					this.cfg = a,
					this.loadData()
			},
				i.prototype.loadData = function () {
					var e = this,
						a = "//headline.taobao.com/feed/homeFeed.do";
					n({
						scriptCharset: "gbk",
						url          : a,
						jsonp        : "callBack",
						dataType     : "jsonp",
						timeout      : 5,
						success      : function (a) {
							v.be_headline = a;
							var i = a && a.data;
							if (i && i.length) m.setItem("cache-headline-be", t.stringify(i)),
								e.render({
									headlines: i
								});
							else {
								if (i = m.getItem("cache-headline-be")) return i = t.parse(i),
									c.send({
										category: "ERROR_Headlines_get_null_data",
										msg     : "headline \u8bf7\u6c42\u6570\u636e\u4e3a\u7a7a\uff0c\u8d70\u515c\u5e95\u5bb9\u707e"
									}),
									void e.render({
										headlines: i
									});
								e._failed()
							}
						},
						error        : function () {
							var a = m.getItem("cache-headline-be");
							return a
								? (a = t.parse(a), c.send({
								category: "ERROR_Headlines_get_null_data",
								msg     : "headline \u8bf7\u6c42\u6570\u636e\u5931\u8d25\uff0c\u8d70\u515c\u5e95\u5bb9\u707e"
							}), void e.render({
								headlines: a
							}))
								: void e._failed()
						}
					})
				},
				i.prototype.render = function (e) {
					var a = this,
						i = new h(f),
						n = this.el.one(".headline-bd");
					n.html(i.render(e))
					 .hide()
					 .fadeIn(.3),
						a.el.one("h3")
						 .fadeIn(.3),
						a.initSlider(),
						a.el.fire("M:load")
				},
				i.prototype._failed = function () {
					var e = this;
					e.cfg || c.send({
						category: "Error_Headlines_get_data_err",
						msg     : "Headlines \u6a21\u5757\u83b7\u53d6\u6570\u636e\u5931\u8d25\uff0c\u5e76\u4e14\u6ca1\u6709\u5907\u4efd\u515c\u5e95\u6570\u636e"
					}),
						r.dynamic(e.cfg, "headlines",
							function (a) {
								a && a.headlines && a.headlines.length
									? e.render(a)
									: (c.send({
									category: "Error_Headlines_Crash",
									msg     : "Headlines \u6a21\u5757\u83b7\u53d6\u6570\u636e\u5931\u8d25\uff0c\u5e76\u4e14\u6ca1\u6709\u5907\u4efd\u515c\u5e95\u6570\u636e\uff0c\u5929\u7a97"
								}), e.el.fire("M:load"))
							})
				},
				i.prototype.initSlider = function () {
					var e = this;
					return p(".headline-bd .mod").length
						? (e.slide = new o(".headline", {
						contentClass: "headline-bd",
						pannelClass : "mod",
						effect      : "vSlide",
						timeout     : 5e3,
						autoSlide   : !0,
						touchmove   : !0
					}), void d(e.el.all("img")))
						: void c.send({
							category: "ERROR_Headlines_Module_Init_Faild",
							msg     : "Headlines \u6a21\u5757\u5728\u670d\u52a1\u5668\u6784\u5efa\u5931\u8d25"
						},
						"warn")
				},
				i
		});
KISSY.add("tb-mod/tbh-discover-goods/0.0.9/goods-xtpl",
	function (e, t, a, o) {
		var n = o.exports = function (e) {
			function t(e, t, a) {
				var n = e.data,
					r = e.affix;
				t.data += '\n<a href="',
					l.line = 3;
				var s = (o = r.url) !== a
					? o
					: (o = n.url) !== a
					? o
					: e.resolveLooseUp(["url"]);
				t = t.write(s),
					t.data += '">\n  <span><img src="//g.alicdn.com/s.gif" data-src="',
					l.line = 4;
				var i = (o = r.pic) !== a
					? o
					: (o = n.pic) !== a
					? o
					: e.resolveLooseUp(["pic"]);
				t = t.write(i),
					t.data += '_120x120.jpg" alt="';
				var d = (o = r.title) !== a
					? o
					: (o = n.title) !== a
					? o
					: e.resolveLooseUp(["title"]);
				t = t.writeEscaped(d),
					t.data += '"/></span>\n  <strong>',
					l.line = 5;
				var c = (o = r.title) !== a
					? o
					: (o = n.title) !== a
					? o
					: e.resolveLooseUp(["title"]);
				t = t.writeEscaped(c),
					t.data += "</strong>\n  <p>",
					l.line = 6;
				var p = (o = r.content) !== a
					? o
					: (o = n.content) !== a
					? o
					: e.resolveLooseUp(["content"]);
				t = t.writeEscaped(p),
					t.data += "</p>\n  <em>",
					l.line = 7;
				var u = (o = r.zanTotal) !== a
					? o
					: (o = n.zanTotal) !== a
					? o
					: e.resolveLooseUp(["zanTotal"]);
				return t = t.writeEscaped(u),
					t.data += " \u4eba\u8bf4\u597d</em>\n</a>\n",
					t
			}

			function a(e, a, r) {
				var s = e.data,
					i = e.affix;
				a.data += "\n",
					l.line = 2,
					l.line = 2;
				var d = (o = i.xindex) !== r
						? o
						: (o = s.xindex) !== r
						? o
						: e.resolveLooseUp(["xindex"]),
					c = d;
				return c = 10 > d,
					a = m.call(n, e, {
							params: [c],
							fn    : t
						},
						a),
					a.data += "\n",
					a
			}

			{
				var o, n = this,
					r = n.root,
					s = n.buffer,
					i = n.scope,
					l = (n.runtime, n.name, n.pos),
					d = i.data,
					c = i.affix,
					p = r.nativeCommands,
					u = r.utils,
					f = (u.callFn, u.callDataFn, u.callCommand, p.range, p["void"], p.foreach, p.forin, p.each),
					m = (p["with"], p["if"]);
				p.set,
					p.include,
					p.parse,
					p.extend,
					p.block,
					p.macro,
					p["debugger"]
			}
			s.data += "",
				l.line = 1;
			var g = (o = c.result) !== e
				? o
				: (o = d.result) !== e
				? o
				: i.resolveLooseUp(["result"]);
			return s = f.call(n, i, {
					params: [g],
					fn    : a
				},
				s),
				s.data += "\n",
				s
		};
		n.TPL_NAME = o.id || o.name
	}),
	KISSY.add("tb-mod/tbh-discover-goods/0.0.9/index", ["anim", "io", "webp", "json", "node", "xctrl", "offline", "reporter", "./goods-xtpl", "tms/xtemplate"],
		function (e, t) {
			function a() {
				this.init.apply(this, arguments)
			}

			t("anim");
			var o = (t("io"), t("webp")),
				n = t("json"),
				r = t("node"),
				s = t("xctrl"),
				i = t("offline"),
				l = t("reporter"),
				d = t("./goods-xtpl"),
				c = t("tms/xtemplate"),
				p = r.all,
				u = !1,
				f = "goods",
				m = !1,
				g = new i,
				h = "cache-" + f,
				v = window.HubCache = window.HubCache || {};
			return a.prototype.init = function (e, t) {
				this.el = p(e),
					this.cfg = t,
					this.requestTime = 0,
					this.pageSize = 9,
					this.$refresh = this.el.one(".goods-refresh"),
					this.permalink = this.el.one(".goods")
										 .attr("data-permalink"),
					this.bind(),
					this.requestModuleData()
			},
				a.prototype.bind = function () {
					var e = this;
					e.el.one(".goods-refresh")
					 .on("click",
						 function (t) {
							 t.halt(),
							 m || (m = !0, e.$refresh.addClass("disable")
											.one("span")
											.text("\u6b63\u5728\u52a0\u8f7d\u4e2d..."), e.requestModuleData())
						 })
				},
				a.prototype.requestModuleData = function () {
					var e = this;
					return e.cfg
						? void s.dynamic({
						data    : e.cfg,
						key     : "result",
						request : "taobao",
						callback: function (t) {
							v["be_" + f] = t,
								t && t.result && t.result.length >= e.pageSize
									? (e.requestTime++, g.setItem(h, n.stringify(t.result)), e.render(t.result))
									: (t = g.getItem(h), t
									? (l.send({
									category: "WARN_Goods_Data_err",
									msg     : "\u6a21\u5757 " + f + " \u8bf7\u6c42\u6570\u636e\u683c\u5f0f\u9519\u8bef\u6216\u8005\u957f\u5ea6\u5c11\u4e8e 10, \u8d70\u515c\u5e95"
								}), t = n.parse(t), e.render(t))
									: l.send({
										category: "ERR_Goods_DATA_NULl",
										msg     : "\u6a21\u5757 " + f + " \u83b7\u53d6\u672c\u5730\u7f13\u5b58\u6570\u636e\u5931\u8d25, \u5929\u7a97\u4e86"
									},
									"warn"))
						},
						extra   : {
							startIndex: e.requestTime * e.pageSize,
							pageSize  : e.pageSize
						}
					})
						: (l.send({
							category: "ERROR_Goods_Data_Null",
							msg     : "\u6a21\u5757 " + f + " \u65e0\u5907\u4efd\u63a5\u53e3\u914d\u7f6e, \u5929\u7a97"
						},
						"warn"), m = !1, e.$refresh.removeClass("disable")
										  .one("span")
										  .text("\u6362\u4e00\u7ec4\u770b\u770b"), void(u || e.el.fire("M:load")))
				},
				a.prototype.render = function (e) {
					var t = this;
					KISSY.each(e,
						function (e) {
							if (t.permalink) {
								var a = t.permalink.indexOf("?") > -1
									? "&"
									: "?";
								e.url = t.permalink + a + "contentId=" + e.contentId
							}
						});
					var a = new c(d).render({
						result: e
					});
					t.el.one(".goods-list")
					 .hide()
					 .html(a)
					 .removeClass("tb-loading")
					 .fadeIn(.3,
						 function () {
							 m = !1,
								 t.$refresh.removeClass("disable")
								  .one("span")
								  .text("\u6362\u4e00\u7ec4\u770b\u770b")
						 }),
						o(t.el.all(".goods-list img")),
					u || (u = !0, t.el.fire("M:load"))
				},
				a
		});
KISSY.add("tb-mod/tbh-footprint/0.0.2/footprint-xtpl",
	function (t, e, a, r) {
		var o = r.exports = function (t) {
			function e(t, e, a) {
				var o = t.data,
					n = t.affix;
				e.data += " footprint-tag-";
				var i = (r = n.marks) !== a
					? r
					: (r = o.marks) !== a
					? r
					: t.resolveLooseUp(["marks"]);
				return e = e.writeEscaped(i),
					e.data += " footprint-tag",
					e
			}

			function a(t, a, i) {
				var s = t.data,
					l = t.affix;
				a.data += "\n<li>\n",
					p.line = 3;
				var d = (r = l.extMap) !== i
						? r
						: (r = s.extMap) !== i
						? r
						: t.resolveLooseUp(["extMap"]),
					m = d;
				if (m) {
					var c = (r = l.extMap) !== i
						? null != r
						? o = r.marks
						: r
						: (r = s.extMap) !== i
						? null != r
						? o = r.marks
						: r
						: t.resolveLooseUp(["extMap", "marks"]);
					m = c
				}
				var f;
				f = u.call(n, t, {
						hash: [{
							key  : ["tag"],
							value: m,
							depth: 0
						}]
					},
					a);
				var g = f;
				a = a.writeEscaped(g),
					a.data += '\n<a href="',
					p.line = 4;
				var v = (r = l.url) !== i
					? r
					: (r = s.url) !== i
					? r
					: t.resolveLooseUp(["url"]);
				a = a.write(v),
					a.data += '">\n  <img data-src="',
					p.line = 5;
				var x = (r = l.pic) !== i
					? r
					: (r = s.pic) !== i
					? r
					: t.resolveLooseUp(["pic"]);
				a = a.writeEscaped(x),
					a.data += '_160x160.jpg" src="//g.alicdn.com/s.gif" alt="';
				var w = (r = l.itemName) !== i
					? r
					: (r = s.itemName) !== i
					? r
					: t.resolveLooseUp(["itemName"]);
				a = a.writeEscaped(w),
					a.data += '" />\n  <span class="wall-item-desc',
					p.line = 6;
				var b = (r = l.marks) !== i
					? r
					: (r = s.marks) !== i
					? r
					: t.resolveLooseUp(["marks"]);
				a = h.call(n, t, {
						params: [b],
						fn    : e
					},
					a),
					a.data += '">\n    <strong>',
					p.line = 7;
				var k = (r = l.itemName) !== i
					? r
					: (r = s.itemName) !== i
					? r
					: t.resolveLooseUp(["itemName"]);
				a = a.writeEscaped(k),
					a.data += '</strong><i></i>\n  </span>\n</a>\n<span class="footprint-item-time">',
					p.line = 10;
				var _ = (r = l.time) !== i
					? r
					: (r = s.time) !== i
					? r
					: t.resolveLooseUp(["time"]);
				return a = a.writeEscaped(_),
					a.data += "</span>\n</li>\n",
					a
			}

			{
				var r, o, n = this,
					i = n.root,
					s = n.buffer,
					l = n.scope,
					p = (n.runtime, n.name, n.pos),
					d = l.data,
					m = l.affix,
					c = i.nativeCommands,
					f = i.utils,
					g = (f.callFn, f.callDataFn, f.callCommand, c.range, c["void"], c.foreach, c.forin, c.each),
					h = (c["with"], c["if"]),
					u = c.set;
				c.include,
					c.parse,
					c.extend,
					c.block,
					c.macro,
					c["debugger"]
			}
			s.data += "",
				p.line = 1;
			var v = (r = m.result) !== t
				? r
				: (r = d.result) !== t
				? r
				: l.resolveLooseUp(["result"]);
			return s = g.call(n, l, {
					params: [v],
					fn    : a
				},
				s),
				s.data += "\n",
				s
		};
		o.TPL_NAME = r.id || r.name
	}),
	KISSY.add("tb-mod/tbh-footprint/0.0.2/index", ["anim", "io", "node", "webp", "xctrl", "reporter", "./footprint-xtpl", "tms/xtemplate"],
		function (t, e) {
			e("anim");
			var a = e("io"),
				r = e("node"),
				o = e("webp"),
				n = e("xctrl"),
				i = e("reporter"),
				s = e("./footprint-xtpl"),
				l = e("tms/xtemplate"),
				p = r.all,
				d = "footprint",
				m = "https://tui.taobao.com/recommend?appid=325",
				c = window.HubCache = window.HubCache || {},
				f = function (t, e) {
					var a = this;
					a.el = p(t),
						a.cfg = e,
						a.load()
				};
			return f.prototype.load = function () {
				var t = this;
				a({
					scriptCharset: "gbk",
					url          : m,
					dataType     : "jsonp",
					timeout      : 5
				})
					.then(function (e) {
						var a = e[0];
						c["be_" + d] = a,
							a && a.result && a.result.length > 0
								? t.render(a)
								: i.send({
								category: "ERROR_" + d + "_load_crash",
								msg     : "\u6a21\u5757" + d + "\u6570\u636e\u683c\u5f0f\u4e0d\u6b63\u786e\u6216\u8005\u6570\u76ee\u8fc7\u5c11"
							})
					})
					.fail(function () {
						i.send({
								category: "ERROR_" + d + "_load_crash",
								msg     : "\u6a21\u5757" + d + "\u52a0\u8f7d\u6570\u636e\u5931\u8d25"
							},
							"warn")
					})
			},
				f.prototype.render = function (t) {
					var e = this;
					if (!(t.result.length < 6)) {
						p(".tbh-discover-goods .goods")
							.removeClass("goods-stretch"),
							e.el.one(".footprint")
							 .show();
						var a = new l(s).render(t);
						e.el.one(".footprint-bd")
						 .html(a)
						 .hide()
						 .fadeIn(.3),
							o(e.el.all("img")),
						p(".footprint-tag").length && e.cfg && n.dynamic(e.cfg, "map",
							function (t) {
								t && t.map && t.map.length
									? KISSY.each(t.map,
									function (t) {
										t.tag && t.img && t.width && t.height && e.box.all(".footprint-tag-" + t.tag + " i")
																				  .css({
																					  backgroundImage: "url(" + t.img + ")",
																					  width          : t.width,
																					  height         : t.height,
																					  right          : t.right,
																					  bottom         : t.bottom
																				  })
																				  .text(t.name)
									})
									: i.send({
									category: "ERROR_" + d + "_tag_err",
									msg     : "\u6a21\u5757" + d + "\u6253\u6807\u5931\u8d25"
								})
							})
					}
				},
				f
		});
KISSY.add("tb-mod/tbh-discover-shop/0.0.8/shop-xtpl",
	function (e, a, r, t) {
		var i = t.exports = function (e) {
			function a(e, a, r) {
				e.data,
					e.affix;
				return a.data += ' class="shop-list-last"',
					a
			}

			function r(e, a, r) {
				var t = e.data,
					i = e.affix;
				a.data += "\n  <p>",
					p.line = 6;
				var n = (o = i.cNum) !== r
					? o
					: (o = t.cNum) !== r
					? o
					: e.resolveLooseUp(["cNum"]);
				return a = a.writeEscaped(n),
					a.data += "</p>\n  ",
					a
			}

			function t(e, a, r) {
				e.data,
					e.affix;
				return a.data += '\n  <p class="shop-reason-null">\u6682\u65e0\u5e97\u94fa\u8bc4\u4ef7</p>\n  ',
					a
			}

			function i(e, i, n) {
				var l = e.data,
					d = e.affix;
				i.data += '\n<li data-sid="',
					p.line = 3;
				var c = (o = d.shopId) !== n
					? o
					: (o = l.shopId) !== n
					? o
					: e.resolveLooseUp(["shopId"]);
				i = i.writeEscaped(c),
					i.data += '"';
				var u = (o = d.xindex) !== n
						? o
						: (o = l.xindex) !== n
						? o
						: e.resolveLooseUp(["xindex"]),
					f = u;
				f = 3 === u,
					i = g.call(s, e, {
							params: [f],
							fn    : a
						},
						i),
					i.data += '>\n  <a href="',
					p.line = 4;
				var m = (o = d.url) !== n
					? o
					: (o = l.url) !== n
					? o
					: e.resolveLooseUp(["url"]);
				i = i.write(m),
					i.data += '"><strong data-cid="';
				var h = (o = d.categoryId) !== n
					? o
					: (o = l.categoryId) !== n
					? o
					: e.resolveLooseUp(["categoryId"]);
				i = i.writeEscaped(h),
					i.data += '">';
				var v = (o = d.categoryName) !== n
					? o
					: (o = l.categoryName) !== n
					? o
					: e.resolveLooseUp(["categoryName"]);
				i = i.writeEscaped(v),
					i.data += "</strong></a>\n  ",
					p.line = 5,
					p.line = 5;
				var x = (o = d.cNum) !== n
					? o
					: (o = l.cNum) !== n
					? o
					: e.resolveLooseUp(["cNum"]);
				i = g.call(s, e, {
						params : [x],
						fn     : r,
						inverse: t
					},
					i),
					i.data += '\n  <div class="shop-thumbs">\n    <a href="',
					p.line = 11;
				var w = (o = d.url) !== n
					? o
					: (o = l.url) !== n
					? o
					: e.resolveLooseUp(["url"]);
				i = i.write(w),
					i.data += '" class="shop-big">\n    <img src="//g.alicdn.com/s.gif" data-src="',
					p.line = 12;
				var b = (o = d.picThumb) !== n
					? o
					: (o = l.picThumb) !== n
					? o
					: e.resolveLooseUp(["picThumb"]);
				i = i.write(b),
					i.data += '_200x200.jpg"/>\n  </a>\n  <a href="',
					p.line = 14;
				var y = (o = d.url) !== n
					? o
					: (o = l.url) !== n
					? o
					: e.resolveLooseUp(["url"]);
				i = i.write(y),
					i.data += '">\n    <img src="//g.alicdn.com/s.gif" data-src="',
					p.line = 15;
				var I = (o = d.pic1) !== n
					? o
					: (o = l.pic1) !== n
					? o
					: e.resolveLooseUp(["pic1"]);
				i = i.write(I),
					i.data += '_100x100.jpg"/>\n  </a>\n  <a href="',
					p.line = 17;
				var L = (o = d.url) !== n
					? o
					: (o = l.url) !== n
					? o
					: e.resolveLooseUp(["url"]);
				i = i.write(L),
					i.data += '">\n    <img src="//g.alicdn.com/s.gif" data-src="',
					p.line = 18;
				var U = (o = d.pic2) !== n
					? o
					: (o = l.pic2) !== n
					? o
					: e.resolveLooseUp(["pic2"]);
				return i = i.write(U),
					i.data += '_100x100.jpg"/>\n  </a>\n  </div>\n</li>\n',
					i
			}

			function n(e, a, r) {
				var t = e.data,
					n = e.affix;
				a.data += "\n",
					p.line = 2,
					p.line = 2;
				var l = (o = n.xindex) !== r
						? o
						: (o = t.xindex) !== r
						? o
						: e.resolveLooseUp(["xindex"]),
					d = l;
				return d = 4 > l,
					a = g.call(s, e, {
							params: [d],
							fn    : i
						},
						a),
					a.data += "\n",
					a
			}

			{
				var o, s = this,
					l = s.root,
					d = s.buffer,
					c = s.scope,
					p = (s.runtime, s.name, s.pos),
					u = c.data,
					f = c.affix,
					m = l.nativeCommands,
					h = l.utils,
					v = (h.callFn, h.callDataFn, h.callCommand, m.range, m["void"], m.foreach, m.forin, m.each),
					g = (m["with"], m["if"]);
				m.set,
					m.include,
					m.parse,
					m.extend,
					m.block,
					m.macro,
					m["debugger"]
			}
			d.data += "",
				p.line = 1;
			var x = (o = f.list) !== e
				? o
				: (o = u.list) !== e
				? o
				: c.resolveLooseUp(["list"]);
			return d = v.call(s, c, {
					params: [x],
					fn    : n
				},
				d),
				d.data += "\n\n",
				d
		};
		i.TPL_NAME = t.id || t.name
	}),
	KISSY.add("tb-mod/tbh-discover-shop/0.0.8/index", ["anim", "io", "webp", "json", "node", "xctrl", "offline", "reporter", "./shop-xtpl", "tms/xtemplate"],
		function (e, a) {
			function r() {
				this.init.apply(this, arguments)
			}

			a("anim");
			var t = (a("io"), a("webp")),
				i = a("json"),
				n = a("node"),
				o = a("xctrl"),
				s = a("offline"),
				l = a("reporter"),
				d = a("./shop-xtpl"),
				c = a("tms/xtemplate"),
				p = n.all,
				u = "shop",
				f = new s,
				m = "cache-" + u,
				h = window.HubCache = window.HubCache || {};
			return r.prototype.init = function (e, a) {
				this.el = p(e),
					this.cfg = a,
					this.pageSize = 5,
					this.permalink = this.el.one(".shop")
										 .attr("data-permalink"),
					this.requestModuleData()
			},
				r.prototype.requestModuleData = function () {
					var e = this;
					return e.cfg
						? void o.dynamic({
						data    : e.cfg,
						key     : "list",
						request : "taobao",
						callback: function (a) {
							h["be_" + u] = a,
								a && a.list && a.list.length >= e.pageSize
									? (f.setItem(m, i.stringify(a.list)), e.render(a.list))
									: (a = f.getItem(m), a
									? (l.send({
									category: "WARN_Shop_Data_err",
									msg     : "\u6a21\u5757 " + u + " \u8bf7\u6c42\u6570\u636e\u683c\u5f0f\u9519\u8bef\u6216\u8005\u957f\u5ea6\u5c11\u4e8e 10, \u8d70\u515c\u5e95"
								}), a = i.parse(a), e.render(a))
									: l.send({
										category: "ERR_Shop_DATA_NULl",
										msg     : "\u6a21\u5757 " + u + " \u83b7\u53d6\u672c\u5730\u7f13\u5b58\u6570\u636e\u5931\u8d25, \u5929\u7a97\u4e86"
									},
									"warn"))
						}
					})
						: (l.send({
							category: "ERROR_Shop_Data_Null",
							msg     : "\u6a21\u5757 " + u + " \u65e0\u5907\u4efd\u63a5\u53e3\u914d\u7f6e, \u5929\u7a97"
						},
						"warn"), void e.el.fire("M:load"))
				},
				r.prototype.render = function (e) {
					var a = this;
					KISSY.each(e,
						function (e) {
							if (a.permalink) {
								var r = a.permalink.indexOf("?") > -1
									? "&"
									: "?";
								e.url = a.permalink + r + "categoryId=" + e.categoryId + "&shopId=" + e.shopId
							}
						});
					var r = new c(d).render({
						list: e
					});
					a.el.one(".shop-list")
					 .hide()
					 .html(r)
					 .removeClass("tb-loading")
					 .fadeIn(.3),
						t(a.el.all(".shop-list img"), null, "IGNORE"),
						a.el.fire("M:load")
				},
				r
		});
KISSY.add("tb-mod/tbh-sale/0.0.1/index", ["node", "reporter"],
	function (e, a) {
		function t() {
			this.init.apply(this, arguments)
		}

		var r = a("node"),
			n = a("reporter"),
			o = r.all;
		return t.prototype.init = function (e) {
			var a = this;
			a.el = o(e);
			var t = o(e)
				.one("#J_SaleBd");
			if (!t.length) return void n.send({
				category: "ERROR_Sale_Hook_NotFound",
				msg     : "\u6a21\u5757 Sale \u6e32\u67d3\u94a9\u5b50\u6ca1\u627e\u5230\uff0c\u670d\u52a1\u5668\u6e32\u67d3\u51fa\u4e86\u95ee\u9898"
			});
			var r = t.attr("data-use");
			KISSY.use(r,
				function (e, t) {
					t
						? (new t, a.el.fire("M:load"), o(".sale-wrapper")
						.removeClass("loading"))
						: n.send({
						category: "ERROR_Sale_Crash",
						msg     : "Sale \u6a21\u5757\u52a0\u8f7d\u521d\u59cb\u5316\u811a\u672c\u5931\u8d25"
					})
				})
		},
			t
	});
KISSY.add("tb-mod/tbh-hotsale/0.0.2/hotsale-xtpl",
	function (a, e, t, s) {
		var o = s.exports = function (a) {
			function e(a, e, t) {
				a.data,
					a.affix;
				e.data += "";
				var s;
				s = M.call(d, a, {
						hash: [{
							key  : ["suffix"],
							value: "_300x300.jpg",
							depth: 0
						}]
					},
					e);
				var o = s;
				return e = e.writeEscaped(o),
					e.data += "",
					e
			}

			function t(a, e, t) {
				a.data,
					a.affix;
				return e.data += ' data-ad="1"',
					e
			}

			function s(a, e, t) {
				a.data,
					a.affix;
				return e.data += ' class="hotsale-album"',
					e
			}

			function o(a, e, t) {
				var s = a.data,
					o = a.affix;
				e.data += " ";
				var i = (n = o.marks) !== t
					? n
					: (n = s.marks) !== t
					? n
					: a.resolveLooseUp(["marks"]);
				return e = e.write(i),
					e.data += "",
					e
			}

			function i(a, e, t) {
				a.data,
					a.affix;
				return e.data += " hotsale-hide",
					e
			}

			function r(a, e, t) {
				var s = a.data,
					o = a.affix;
				e.data += '<span class="hotsale-item-sales">\u9500\u91cf:';
				var i = (n = o.saleCnt) !== t
					? n
					: (n = s.saleCnt) !== t
					? n
					: a.resolveLooseUp(["saleCnt"]);
				return e = e.writeEscaped(i),
					e.data += "</span>",
					e
			}

			function l(a, l, c) {
				var u = a.data,
					m = a.affix;
				l.data += "\n  ",
					h.line = 2;
				var f = (n = m.extMap) !== c
						? n
						: (n = u.extMap) !== c
						? n
						: a.resolveLooseUp(["extMap"]),
					v = f;
				if (v) {
					var x = (n = m.extMap) !== c
							? null != n
							? p = n.isAd
							: n
							: (n = u.extMap) !== c
							? null != n
							? p = n.isAd
							: n
							: a.resolveLooseUp(["extMap", "isAd"]),
						b = x;
					b = 1 === x;
					var g = b;
					if (!g) {
						var A = (n = m.extMap) !== c
								? null != n
								? p = n.isAd
								: n
								: (n = u.extMap) !== c
								? null != n
								? p = n.isAd
								: n
								: a.resolveLooseUp(["extMap", "isAd"]),
							k = A;
						k = A === !0,
							g = k
					}
					var L = g;
					if (!L) {
						var U = (n = m.extMap) !== c
								? null != n
								? p = n.isAd
								: n
								: (n = u.extMap) !== c
								? null != n
								? p = n.isAd
								: n
								: a.resolveLooseUp(["extMap", "isAd"]),
							y = U;
						y = "true" === U,
							L = y
					}
					v = L
				}
				var C;
				C = M.call(d, a, {
						hash: [{
							key  : ["isAd"],
							value: v,
							depth: 0
						}]
					},
					l);
				var _ = C;
				l = l.writeEscaped(_),
					l.data += "\n  ",
					h.line = 3;
				var E = (n = m.extMap) !== c
						? n
						: (n = u.extMap) !== c
						? n
						: a.resolveLooseUp(["extMap"]),
					S = E;
				if (S) {
					var N = (n = m.extMap) !== c
							? null != n
							? p = n.isAlbum
							: n
							: (n = u.extMap) !== c
							? null != n
							? p = n.isAlbum
							: n
							: a.resolveLooseUp(["extMap", "isAlbum"]),
						z = N;
					z = 1 === N;
					var H = z;
					if (!H) {
						var j = (n = m.extMap) !== c
								? null != n
								? p = n.isAlbum
								: n
								: (n = u.extMap) !== c
								? null != n
								? p = n.isAlbum
								: n
								: a.resolveLooseUp(["extMap", "isAlbum"]),
							D = j;
						D = j === !0,
							H = D
					}
					var F = H;
					if (!F) {
						var I = (n = m.extMap) !== c
								? null != n
								? p = n.isAlbum
								: n
								: (n = u.extMap) !== c
								? null != n
								? p = n.isAlbum
								: n
								: a.resolveLooseUp(["extMap", "isAlbum"]),
							P = I;
						P = "true" === I,
							F = P
					}
					S = F
				}
				var J;
				J = M.call(d, a, {
						hash: [{
							key  : ["isAlbum"],
							value: S,
							depth: 0
						}]
					},
					l);
				var K = J;
				l = l.writeEscaped(K),
					l.data += "\n  ",
					h.line = 4;
				var T = (n = m.extMap) !== c
						? n
						: (n = u.extMap) !== c
						? n
						: a.resolveLooseUp(["extMap"]),
					Y = T;
				if (Y) {
					var q = (n = m.extMap) !== c
						? null != n
						? p = n.marks
						: n
						: (n = u.extMap) !== c
						? null != n
						? p = n.marks
						: n
						: a.resolveLooseUp(["extMap", "marks"]);
					Y = q
				}
				var B;
				B = M.call(d, a, {
						hash: [{
							key  : ["marks"],
							value: Y,
							depth: 0
						}]
					},
					l);
				var G = B;
				l = l.writeEscaped(G),
					l.data += "\n  ",
					h.line = 5;
				var O;
				O = M.call(d, a, {
						hash: [{
							key  : ["suffix"],
							value: "_250x250.jpg",
							depth: 0
						}]
					},
					l);
				var Q = O;
				l = l.writeEscaped(Q),
					l.data += "\n  ",
					h.line = 6;
				var R = (n = m.isAlbum) !== c
					? n
					: (n = u.isAlbum) !== c
					? n
					: a.resolveLooseUp(["isAlbum"]);
				l = w.call(d, a, {
						params: [R],
						fn    : e
					},
					l),
					l.data += "\n  <li",
					h.line = 7;
				var V = (n = m.isAd) !== c
					? n
					: (n = u.isAd) !== c
					? n
					: a.resolveLooseUp(["isAd"]);
				l = w.call(d, a, {
						params: [V],
						fn    : t
					},
					l),
					l.data += "";
				var W = (n = m.isAlbum) !== c
					? n
					: (n = u.isAlbum) !== c
					? n
					: a.resolveLooseUp(["isAlbum"]);
				l = w.call(d, a, {
						params: [W],
						fn    : s
					},
					l),
					l.data += '>\n    <a href="',
					h.line = 8;
				var X = (n = m.url) !== c
					? n
					: (n = u.url) !== c
					? n
					: a.resolveLooseUp(["url"]);
				l = l.writeEscaped(X),
					l.data += '" class="hotsale-item">\n      <span class="hotsale-imgwrapper"><img src="//g.alicdn.com/s.gif" data-ks-lazyload="',
					h.line = 9;
				var Z = (n = m.pic) !== c
					? n
					: (n = u.pic) !== c
					? n
					: a.resolveLooseUp(["pic"]);
				l = l.writeEscaped(Z),
					l.data += "";
				var $ = (n = m.suffix) !== c
					? n
					: (n = u.suffix) !== c
					? n
					: a.resolveLooseUp(["suffix"]);
				l = l.writeEscaped($),
					l.data += '" alt="';
				var aa = (n = m.itemName) !== c
					? n
					: (n = u.itemName) !== c
					? n
					: a.resolveLooseUp(["itemName"]);
				l = l.write(aa),
					l.data += '"/></span>\n      <p><span>',
					h.line = 10;
				var ea = (n = m.itemName) !== c
					? n
					: (n = u.itemName) !== c
					? n
					: a.resolveLooseUp(["itemName"]);
				l = l.write(ea),
					l.data += '</span></p>\n    </a>\n    <p class="hotsale-item-info">\n      <span class="hotsale-item-marks',
					h.line = 13;
				var ta = (n = m.marks) !== c
					? n
					: (n = u.marks) !== c
					? n
					: a.resolveLooseUp(["marks"]);
				l = w.call(d, a, {
						params : [ta],
						fn     : o,
						inverse: i
					},
					l),
					l.data += '"></span>\n      <span class="hotsale-item-price"><em>&yen;</em>',
					h.line = 14;
				var sa = (n = m.promotionPrice) !== c
					? n
					: (n = u.promotionPrice) !== c
					? n
					: a.resolveLooseUp(["promotionPrice"]);
				l = l.writeEscaped(sa),
					l.data += "</span>\n      ",
					h.line = 15;
				var oa = (n = m.saleCnt) !== c
					? n
					: (n = u.saleCnt) !== c
					? n
					: a.resolveLooseUp(["saleCnt"]);
				return l = w.call(d, a, {
						params: [oa],
						fn    : r
					},
					l),
					l.data += "\n    </p>\n  </li>\n",
					l
			}

			{
				var n, p, d = this,
					c = d.root,
					u = d.buffer,
					m = d.scope,
					h = (d.runtime, d.name, d.pos),
					f = m.data,
					v = m.affix,
					x = c.nativeCommands,
					b = c.utils,
					g = (b.callFn, b.callDataFn, b.callCommand, x.range, x["void"], x.foreach, x.forin, x.each),
					w = (x["with"], x["if"]),
					M = x.set;
				x.include,
					x.parse,
					x.extend,
					x.block,
					x.macro,
					x["debugger"]
			}
			u.data += "",
				h.line = 1;
			var A = (n = v.backup) !== a
				? n
				: (n = f.backup) !== a
				? n
				: m.resolveLooseUp(["backup"]);
			return u = g.call(d, m, {
					params: [A],
					fn    : l
				},
				u)
		};
		o.TPL_NAME = s.id || s.name
	}),
	KISSY.add("tb-mod/tbh-hotsale/0.0.2/index", ["io", "ua", "xctrl", "json", "webp", "node", "offline", "reporter", "datalazyload", "tms/xtemplate", "./hotsale-xtpl"],
		function (a, e) {
			function t(a, e) {
				this.el = r.one(a),
					this.box = this.el.one(".J_HotSale"),
					this.cfg = e,
					this.init()
			}

			var s = e("io"),
				o = (e("ua"), e("xctrl")),
				i = e("json"),
				r = (e("webp"), e("node")),
				l = e("offline"),
				n = e("reporter"),
				p = e("datalazyload"),
				d = e("tms/xtemplate"),
				c = window.HubCache = window.HubCache || {},
				u = "//tui.taobao.com/recommend?appid=2493",
				m = e("./hotsale-xtpl"),
				h = "cache-hotsale",
				f = new l;
			return t.prototype.init = function () {
				var a = this.box.attr("data-switch");
				return "off" === a
					? void this.box.hide()
					: void this.load()
			},
				t.prototype.load = function () {
					var a = this,
						e = {},
						t = this.box.attr("data-size");
					t && (e.size = t),
						s({
							scriptCharset: "gbk",
							url          : u,
							data         : e,
							dataType     : "jsonp",
							timeout      : 5,
							success      : function (e) {
								if (c.tpp_hotsale = e, e && e.result && e.result.length >= 20) {
									e = e.result.slice(0, 200);
									var t = e.length;
									t -= r.one(".s1190")
										? t % 4
										: t % 5,
										e = e.slice(0, t),
										f.setItem(h, i.stringify(e)),
										a.render(e)
								} else a.getDataFromCache()
							},
							error        : function () {
								a.getDataFromCache()
							}
						})
				},
				t.prototype.getDataFromCache = function () {
					var a = i.parse(f.getItem(h));
					a
						? this.render(a)
						: this.failed()
				},
				t.prototype.render = function (a) {
					var e = new d(m).render({
							backup: a
						}),
						t = this.box.one("ul");
					t.html(e),
						this.box.one(".tb-loading")
							.remove(),
						this.box.one(".hotsale-end")
							.show(),
						t.all("img")
						 .show(),
						this.bind()
				},
				t.prototype.bind = function () {
					var e = this;
					new p(".J_HotSale", {
						autoDestroy: !0,
						placeholder: "//g.alicdn.com/s.gif"
					});
					var t = r.one(window);
					t.on("resize",
						function () {
							var a = e.box.one("ul")
									 .all("li"),
								s = a.length;
							if (t.width() < 1190) {
								if (a.show(), s % 4 == 0) return;
								a.slice(s % 4 * -1)
								 .hide()
							} else {
								if (a.show(), s % 5 == 0) return;
								a.slice(s % 5 * -1)
								 .hide()
							}
						}),
					this.cfg && o.dynamic(this.cfg, "map",
						function (t) {
							t && t.map && t.map.length && a.each(t.map,
								function (a) {
									a.tag && a.img && a.width && a.height && e.box.all("." + a.tag)
																			  .css({
																				  backgroundImage: "url(" + a.img + ")",
																				  width          : a.width,
																				  height         : a.height,
																				  left           : a.left,
																				  top            : a.top
																			  })
								})
						})
				},
				t.prototype.failed = function () {
					var a = this,
						e = this.cfg;
					return this.cfg
						? void(e && o.dynamic(e, "backup",
						function (e) {
							e && e.backup
								? a.render(e.backup)
								: n.send({
								category: "Err_HotSale_load_data_Crash",
								msg     : "\u731c\u4f60\u559c\u6b22\u6a21\u5757\u83b7\u53d6\u515c\u5e95\u6570\u636e\u5931\u8d25"
							})
						}))
						: void n.send({
						category: "Err_HotSale_load_data_Crash",
						msg     : "\u731c\u4f60\u559c\u6b22\u6a21\u5757\u83b7\u53d6\u515c\u5e95\u6570\u636e\u5931\u8d25"
					})
				},
				t
		});
KISSY.add("tb-mod/tbh-helper/0.0.1/helper-xtpl",
	function (e, a, n, t) {
		var r = t.exports = function (e) {
			function a(e, a, n) {
				e.data,
					e.affix;
				return a.data += " mod-last",
					a
			}

			function n(e, a, n) {
				var t = e.data,
					r = e.affix;
				a.data += '\n            <li><a href="',
					c.line = 11;
				var i = (l = r.link) !== n
					? l
					: (l = t.link) !== n
					? l
					: e.resolveLooseUp(["link"]);
				a = a.writeEscaped(i),
					a.data += '">';
				var o = (l = r.text) !== n
					? l
					: (l = t.text) !== n
					? l
					: e.resolveLooseUp(["text"]);
				return a = a.writeEscaped(o),
					a.data += "</a></li>\n            ",
					a
			}

			function t(e, t, r) {
				var i = e.data,
					s = e.affix;
				t.data += '\n<div class="mod',
					c.line = 3;
				var d = (l = s.xindex) !== r
						? l
						: (l = i.xindex) !== r
						? l
						: e.resolveLooseUp(["xindex"]),
					p = d;
				p = d + 1;
				var f = p,
					m = (l = s.xcount) !== r
						? l
						: (l = i.xcount) !== r
						? l
						: e.resolveLooseUp(["xcount"]);
				f = p === m,
					t = u.call(o, e, {
							params: [f],
							fn    : a
						},
						t),
					t.data += '" data-spm-ab="';
				var v = (l = s.xindex) !== r
						? l
						: (l = i.xindex) !== r
						? l
						: e.resolveLooseUp(["xindex"]),
					h = v;
				h = v + 1,
					t = t.writeEscaped(h),
					t.data += '">\n    <div class="mod-wrap">\n        <h4>\n            <i class="tb-icon">&#',
					c.line = 6;
				var g = (l = s.icon) !== r
					? l
					: (l = i.icon) !== r
					? l
					: e.resolveLooseUp(["icon"]);
				t = t.write(g),
					t.data += ";</i>\n            <span>",
					c.line = 7;
				var b = (l = s.name) !== r
					? l
					: (l = i.name) !== r
					? l
					: e.resolveLooseUp(["name"]);
				t = t.writeEscaped(b),
					t.data += "</span>\n        </h4>\n        <ul>\n            ",
					c.line = 10,
					c.line = 10;
				var L = (l = s.items) !== r
					? l
					: (l = i.items) !== r
					? l
					: e.resolveLooseUp(["items"]);
				return t = x.call(o, e, {
						params: [L],
						fn    : n
					},
					t),
					t.data += "\n        </ul>\n    </div>\n</div>\n",
					t
			}

			function r(e, a, n) {
				var r = e.data,
					i = e.affix;
				a.data += "\n",
					c.line = 2,
					c.line = 2;
				var s = (l = i.helpers) !== n
					? l
					: (l = r.helpers) !== n
					? l
					: e.resolveLooseUp(["helpers"]);
				return a = x.call(o, e, {
						params: [s],
						fn    : t
					},
					a),
					a.data += "\n",
					a
			}

			{
				var l, i, o = this,
					s = o.root,
					d = o.buffer,
					p = o.scope,
					c = (o.runtime, o.name, o.pos),
					f = p.data,
					m = p.affix,
					v = s.nativeCommands,
					h = s.utils,
					x = (h.callFn, h.callDataFn, h.callCommand, v.range, v["void"], v.foreach, v.forin, v.each),
					u = (v["with"], v["if"]);
				v.set,
					v.include,
					v.parse,
					v.extend,
					v.block,
					v.macro,
					v["debugger"]
			}
			d.data += "",
				c.line = 1;
			var g = (l = m.helpers) !== e
				? null != l
				? i = l.length
				: l
				: (l = f.helpers) !== e
				? null != l
				? i = l.length
				: l
				: p.resolveLooseUp(["helpers", "length"]);
			return d = u.call(o, p, {
					params: [g],
					fn    : r
				},
				d)
		};
		r.TPL_NAME = t.id || t.name
	}),
	KISSY.add("tb-mod/tbh-helper/0.0.1/index", ["anim", "json", "node", "xctrl", "offline", "reporter", "tms/xtemplate", "./helper-xtpl"],
		function (e, a) {
			function n() {
				this.loadData.apply(this, arguments)
			}

			a("anim");
			var t = a("json"),
				r = a("node"),
				l = a("xctrl"),
				i = a("offline"),
				o = a("reporter"),
				s = a("tms/xtemplate"),
				d = a("./helper-xtpl"),
				p = new i,
				c = "cache-helper-tce";
			return n.prototype.loadData = function (e, a) {
				var n = this;
				n.el = r.one(e),
				a && l.dynamic(a, "helpers",
					function (e) {
						if (e && e.helpers && e.helpers.length > 0) p.setItem(c, t.stringify(e)),
							n.render(e);
						else {
							var a = p.getItem(c);
							n.render(t.parse(a))
						}
					})
			},
				n.prototype.render = function (a) {
					var n = this.el,
						t = new s(d).render(a);
					e.trim(t) || o.send({
							category: "ERROR_Helper_get_null_data",
							msg     : "\u5e2e\u52a9\u6a21\u5757\u83b7\u53d6\u6570\u636e\u4e3a\u7a7a"
						},
						"warn"),
						n.one(".helper")
						 .html(t)
						 .css("visibility", "visible")
						 .hide()
						 .fadeIn(.3),
						n.fire("M:load")
				},
				n
		});
KISSY.add("tb-mod/tbh-decorations/0.0.5/dec-xtpl",
	function (e, a, r, t) {
		var o = t.exports = function (e) {
			function a(e, a, r) {
				var t = e.data,
					o = e.affix;
				a.data += "right:";
				var i = -1,
					n = (h = o.right) !== r
						? h
						: (h = t.right) !== r
						? h
						: e.resolveLooseUp(["right"]);
				return i = -1 * n,
					a = a.writeEscaped(i),
					a.data += "px",
					a
			}

			function r(e, a, r) {
				var t = e.data,
					o = e.affix;
				a.data += "left:";
				var i = -1,
					n = (h = o.left) !== r
						? h
						: (h = t.left) !== r
						? h
						: e.resolveLooseUp(["left"]);
				return i = -1 * n,
					a = a.writeEscaped(i),
					a.data += "px",
					a
			}

			function t(e, a, r) {
				e.data,
					e.affix;
				return a.data += "z-index:3;",
					a
			}

			function o(e, a, r) {
				e.data,
					e.affix;
				return a.data += "z-index:-1;",
					a
			}

			function i(e, a, r) {
				var t = e.data,
					o = e.affix;
				a.data += 'data-img="';
				var i = (h = o.img) !== r
					? h
					: (h = t.img) !== r
					? h
					: e.resolveLooseUp(["img"]);
				a = a.write(i),
					a.data += '" data-hover="';
				var n = (h = o.hover) !== r
					? h
					: (h = t.hover) !== r
					? h
					: e.resolveLooseUp(["hover"]);
				return a = a.write(n),
					a.data += '"',
					a
			}

			function n(e, n, l) {
				var s = e.data,
					d = e.affix;
				n.data += '\n    <a href="',
					b.line = 5;
				var v = (h = d.link) !== l
					? h
					: (h = s.link) !== l
					? h
					: e.resolveLooseUp(["link"]);
				n = n.write(v),
					n.data += '" class="decorations-item" style="background:url(';
				var p = (h = d.img) !== l
					? h
					: (h = s.img) !== l
					? h
					: e.resolveLooseUp(["img"]);
				n = n.write(p),
					n.data += ") no-repeat;width:";
				var c = (h = d.width) !== l
					? h
					: (h = s.width) !== l
					? h
					: e.resolveLooseUp(["width"]);
				n = n.writeEscaped(c),
					n.data += "px;height:";
				var f = (h = d.height) !== l
					? h
					: (h = s.height) !== l
					? h
					: e.resolveLooseUp(["height"]);
				n = n.writeEscaped(f),
					n.data += "px;";
				var g = (h = d.isRight) !== l
					? h
					: (h = s.isRight) !== l
					? h
					: e.resolveLooseUp(["isRight"]);
				n = k.call(u, e, {
						params : [g],
						fn     : a,
						inverse: r
					},
					n),
					n.data += ";bottom:";
				var m = (h = d.bottom) !== l
					? h
					: (h = s.bottom) !== l
					? h
					: e.resolveLooseUp(["bottom"]);
				n = n.writeEscaped(m),
					n.data += "px;top:";
				var w = (h = d.top) !== l
					? h
					: (h = s.top) !== l
					? h
					: e.resolveLooseUp(["top"]);
				n = n.writeEscaped(w),
					n.data += "px;";
				var y = (h = d.overlayer) !== l
					? h
					: (h = s.overlayer) !== l
					? h
					: e.resolveLooseUp(["overlayer"]);
				n = k.call(u, e, {
						params: [y],
						fn    : t
					},
					n),
					n.data += "";
				var x = (h = d.belowlayer) !== l
					? h
					: (h = s.belowlayer) !== l
					? h
					: e.resolveLooseUp(["belowlayer"]);
				n = k.call(u, e, {
						params: [x],
						fn    : o
					},
					n),
					n.data += '" ';
				var L = (h = d.hover) !== l
					? h
					: (h = s.hover) !== l
					? h
					: e.resolveLooseUp(["hover"]);
				n = k.call(u, e, {
						params: [L],
						fn    : i
					},
					n),
					n.data += ">";
				var U = (h = d.title) !== l
					? h
					: (h = s.title) !== l
					? h
					: e.resolveLooseUp(["title"]);
				return n = n.writeEscaped(U),
					n.data += "</a>\n    ",
					n
			}

			function l(e, a, r) {
				var t = e.data,
					o = e.affix;
				a.data += "right:";
				var i = -1,
					n = (h = o.right) !== r
						? h
						: (h = t.right) !== r
						? h
						: e.resolveLooseUp(["right"]);
				return i = -1 * n,
					a = a.writeEscaped(i),
					a.data += "px",
					a
			}

			function s(e, a, r) {
				var t = e.data,
					o = e.affix;
				a.data += "left:";
				var i = -1,
					n = (h = o.left) !== r
						? h
						: (h = t.left) !== r
						? h
						: e.resolveLooseUp(["left"]);
				return i = -1 * n,
					a = a.writeEscaped(i),
					a.data += "px",
					a
			}

			function d(e, a, r) {
				e.data,
					e.affix;
				return a.data += "z-index:3;",
					a
			}

			function v(e, a, r) {
				e.data,
					e.affix;
				return a.data += "z-index:-1;",
					a
			}

			function p(e, a, r) {
				var t = e.data,
					o = e.affix;
				a.data += 'data-img="';
				var i = (h = o.img) !== r
					? h
					: (h = t.img) !== r
					? h
					: e.resolveLooseUp(["img"]);
				a = a.write(i),
					a.data += '" data-hover="';
				var n = (h = o.hover) !== r
					? h
					: (h = t.hover) !== r
					? h
					: e.resolveLooseUp(["hover"]);
				return a = a.write(n),
					a.data += '"',
					a
			}

			function c(e, a, r) {
				var t = e.data,
					o = e.affix;
				a.data += '\n    <i class="decorations-item" style="background:url(',
					b.line = 7;
				var i = (h = o.img) !== r
					? h
					: (h = t.img) !== r
					? h
					: e.resolveLooseUp(["img"]);
				a = a.write(i),
					a.data += ") no-repeat;width:";
				var n = (h = o.width) !== r
					? h
					: (h = t.width) !== r
					? h
					: e.resolveLooseUp(["width"]);
				a = a.writeEscaped(n),
					a.data += "px;height:";
				var c = (h = o.height) !== r
					? h
					: (h = t.height) !== r
					? h
					: e.resolveLooseUp(["height"]);
				a = a.writeEscaped(c),
					a.data += "px;";
				var f = (h = o.isRight) !== r
					? h
					: (h = t.isRight) !== r
					? h
					: e.resolveLooseUp(["isRight"]);
				a = k.call(u, e, {
						params : [f],
						fn     : l,
						inverse: s
					},
					a),
					a.data += ";bottom:";
				var g = (h = o.bottom) !== r
					? h
					: (h = t.bottom) !== r
					? h
					: e.resolveLooseUp(["bottom"]);
				a = a.writeEscaped(g),
					a.data += "px;top:";
				var m = (h = o.top) !== r
					? h
					: (h = t.top) !== r
					? h
					: e.resolveLooseUp(["top"]);
				a = a.writeEscaped(m),
					a.data += "px;";
				var w = (h = o.overlayer) !== r
					? h
					: (h = t.overlayer) !== r
					? h
					: e.resolveLooseUp(["overlayer"]);
				a = k.call(u, e, {
						params: [w],
						fn    : d
					},
					a),
					a.data += "";
				var y = (h = o.belowlayer) !== r
					? h
					: (h = t.belowlayer) !== r
					? h
					: e.resolveLooseUp(["belowlayer"]);
				a = k.call(u, e, {
						params: [y],
						fn    : v
					},
					a),
					a.data += '" ';
				var x = (h = o.hover) !== r
					? h
					: (h = t.hover) !== r
					? h
					: e.resolveLooseUp(["hover"]);
				a = k.call(u, e, {
						params: [x],
						fn    : p
					},
					a),
					a.data += ">";
				var L = (h = o.title) !== r
					? h
					: (h = t.title) !== r
					? h
					: e.resolveLooseUp(["title"]);
				return a = a.writeEscaped(L),
					a.data += "</i>\n    ",
					a
			}

			function f(e, a, r) {
				var t = e.data,
					o = e.affix;
				a.data += "\n    ",
					b.line = 2;
				var i = (h = o.overlayer) !== r
						? h
						: (h = t.overlayer) !== r
						? h
						: e.resolveLooseUp(["overlayer"]),
					l = i;
				l = 1 === i;
				var s = l;
				if (!s) {
					var d = (h = o.overlayer) !== r
							? h
							: (h = t.overlayer) !== r
							? h
							: e.resolveLooseUp(["overlayer"]),
						v = d;
					v = d === !0,
						s = v
				}
				var p = s;
				if (!p) {
					var f = (h = o.overlayer) !== r
							? h
							: (h = t.overlayer) !== r
							? h
							: e.resolveLooseUp(["overlayer"]),
						g = f;
					g = "true" === f,
						p = g
				}
				var m;
				m = S.call(u, e, {
						hash: [{
							key  : ["overlayer"],
							value: p,
							depth: 0
						}]
					},
					a);
				var w = m;
				a = a.writeEscaped(w),
					a.data += "\n    ",
					b.line = 3;
				var y = (h = o.belowlayer) !== r
						? h
						: (h = t.belowlayer) !== r
						? h
						: e.resolveLooseUp(["belowlayer"]),
					x = y;
				x = 1 === y;
				var L = x;
				if (!L) {
					var U = (h = o.belowlayer) !== r
							? h
							: (h = t.belowlayer) !== r
							? h
							: e.resolveLooseUp(["belowlayer"]),
						E = U;
					E = U === !0,
						L = E
				}
				var R = L;
				if (!R) {
					var I = (h = o.belowlayer) !== r
							? h
							: (h = t.belowlayer) !== r
							? h
							: e.resolveLooseUp(["belowlayer"]),
						z = I;
					z = "true" === I,
						R = z
				}
				var K;
				K = S.call(u, e, {
						hash: [{
							key  : ["belowlayer"],
							value: R,
							depth: 0
						}]
					},
					a);
				var O = K;
				a = a.writeEscaped(O),
					a.data += "\n    ",
					b.line = 4,
					b.line = 4;
				var Y = (h = o.link) !== r
					? h
					: (h = t.link) !== r
					? h
					: e.resolveLooseUp(["link"]);
				return a = k.call(u, e, {
						params : [Y],
						fn     : n,
						inverse: c
					},
					a),
					a.data += "\n",
					a
			}

			{
				var h, u = this,
					g = u.root,
					m = u.buffer,
					w = u.scope,
					b = (u.runtime, u.name, u.pos),
					y = w.data,
					x = w.affix,
					L = g.nativeCommands,
					U = g.utils,
					E = (U.callFn, U.callDataFn, U.callCommand, L.range, L["void"], L.foreach, L.forin, L.each),
					k = (L["with"], L["if"]),
					S = L.set;
				L.include,
					L.parse,
					L.extend,
					L.block,
					L.macro,
					L["debugger"]
			}
			m.data += "",
				b.line = 1;
			var R = (h = x.decorations) !== e
				? h
				: (h = y.decorations) !== e
				? h
				: w.resolveLooseUp(["decorations"]);
			return m = E.call(u, w, {
					params: [R],
					fn    : f
				},
				m),
				m.data += "\n",
				m
		};
		o.TPL_NAME = t.id || t.name
	}),
	KISSY.add("tb-mod/tbh-decorations/0.0.5/index", ["anim", "node", "webp", "xtemplate", "./dec-xtpl"],
		function (e, a) {
			function r(e, a) {
				return a || (e = n[e] && n[e][0] && n[e][0].on),
				1 === e || "true" === e || e === !0
			}

			var t = (a("anim"), a("node")),
				o = (a("webp"), a("xtemplate")),
				i = a("./dec-xtpl"),
				n = {},
				l = t.all,
				s = new o(i),
				d = !1,
				v = window.location.search;
			v && (v = KISSY.unparam(v.slice(1)), d = v.hasOwnProperty("noDeco"));
			var p = function (e) {
				return this.el = l(e),
					d
						? void l(".cup .decorations-box")
						.remove()
						: void this.init()
			};
			return p.prototype.init = function () {
				var e = this,
					a = this.el.one("textarea");
				a && (n = JSON.parse(a.val()), KISSY.each("padding hideLogo left right bgs".split(" "),
					function (a) {
						r(a) && "function" == typeof e["run" + a] && e["run" + a](n[a][0])
					}), this.bind()),
					e.el.fire("M:load")
			},
				p.prototype.runpadding = function (e) {
					var a = parseInt(e.height);
					a > 0 && l(".cup .decorations-box")
						.height(a)
						.show()
				},
				p.prototype.runsearch = function (e) {
					l(".search-wrap")
						.css({
							backgroundImage : "url(" + e.img + ")",
							backgroundRepeat: "no-repeat",
							left            : e.left,
							top             : e.top
						})
				},
				p.prototype.hidelogo = function (e) {
					l(".logo-bd")
						.fadeOut(.3)
				},
				p.prototype.runleft = function (e) {
					var a = s.render(e);
					l(".tbh-service")
						.prepend(a)
				},
				p.prototype.runright = function (e) {
					e.isRight = !0;
					var a = s.render(e);
					l(".ca-extra")
						.prepend(a)
				},
				p.prototype.bind = function () {
					l(".decorations-item")
						.each(function () {
							var e = l(this),
								a = e.attr("data-hover"),
								r = e.attr("data-img");
							r && a && a.indexOf("//") > -1 && e.on("mouseenter",
								function () {
									e.css("background-image", "url(" + a + ")")
								})
															   .on("mouseleave",
																   function () {
																	   e.css("background-image", "url(" + r + ")")
																   })
						})
				},
				p
		});
KISSY.add("tb-mod/tbh-fixedtool/0.0.8/index", ["anim", "ua", "node", "attr-anim"],
	function (o, t) {
		t("anim");
		var e = t("ua"),
			i = t("node"),
			a = t("attr-anim"),
			n = i.all,
			l = n(window),
			s = e && e.ie && 8 === e.ie,
			r = s
				? 0
				: .4,
			d = function (o) {
				return this.el = n(o),
					this.$tools = i.one(".J_FixedTool"),
					e.ipad || e.android
						? void this.el.hide()
						: void(this.$tools && this.init())
			};
		return d.prototype.init = function () {
			this.bind(),
				this.el.fire("M:load")
		},
			d.prototype.bind = function () {
				var o = this,
					t = this.$tools.one('a[data-tool="gotop"]'),
					e = o.$tools.all("a"),
					d = {},
					f = [],
					u = {};
				e.each(function (o) {
					var t = n(o),
						e = t.attr("data-tool"),
						a = i.one('div[data-name="' + e + '"]');
					if (e && a) {
						var l = a.offset().top - 48;
						d[e] = {
							obj : a,
							item: t,
							top : l
						},
							f.push(l),
							u[l] = {
								obj : a,
								item: t
							}
					}
				}),
					f = f.sort(function (o, t) {
						return o > t
							? 1
							: -1
					}),
					o.$tools.all("a")
					 .on("click",
						 function (t) {
							 var e = n(this),
								 i = e.attr("data-tool");
							 if (!i) return !0;
							 if (t.halt(), "gotop" === i) return s
								 ? void n(window)
								 .scrollTop(0)
								 : (new a(n("html"), {
									 scrollTop: 0
								 },
								 {
									 duration: r,
									 easing  : "easeOut"
								 }).run(), void new a(n("body"), {
									 scrollTop: 0
								 },
								 {
									 duration: r,
									 easing  : "easeOut"
								 }).run());
							 if (d[i]) {
								 var l = d[i].item,
									 f = d[i].top;
								 if (o.el.all(".on")
									  .removeClass("on"), l.addClass("on"), s) return n("body")
									 .scrollTop(f),
									 void n("html")
										 .scrollTop(f);
								 new a(n("body"), {
										 scrollTop: f
									 },
									 {
										 duration: r,
										 easing  : "easeOut"
									 }).run(),
									 new a(n("html"), {
											 scrollTop: f
										 },
										 {
											 duration: r,
											 easing  : "easeOut"
										 }).run()
							 }
						 }),
					l.on("scroll",
						function () {
							var e = l.scrollTop(),
								i = n(".tbh-conve")
										.offset().top + 2,
								a = 49;
							if (e > l.height()
									? t.show()
									: t.hide(), i - a >= e) {
								var s = o.el.one("a")
										 .attr("data-tool");
								d[s] && d[s].obj.addClass("on"),
									o.$tools.css({
										position: "absolute",
										top     : i
									})
							} else {
								o.$tools.css({
									position: "fixed",
									top     : a
								});
								var r = f[f.length - 1];
								if (e >= r) return o.el.all(".on")
													.removeClass("on"),
									void u[r].item.addClass("on");
								for (var h = 1,
										 c = f.length; c > h; h++) if (e >= f[h - 1] && e < f[h]) {
									o.el.all(".on")
									 .removeClass("on"),
										u[f[h - 1]].item.addClass("on");
									break
								}
							}
						})
					 .fire("scroll"),
					l.on("resize",
						function () {
							var t = l.width(),
								e = o.el.one(".fixedtool");
							t > 1190 && 1311 > t
								? e.addClass("ft1190")
								: e.removeClass("ft1190"),
								1111 > t
									? e.addClass("ft990")
									: e.removeClass("ft990")
						})
					 .fire("resize"),
					o.$tools.fadeIn(.5)
			},
			d
	});
KISSY.add("tb-mod/tbh-bubble/0.0.1/index", ["io", "node", "json", "offline", "reporter"],
	function (e, t) {
		var o = t("io"),
			a = t("node"),
			n = t("json"),
			b = t("offline"),
			r = t("reporter"),
			i = a.all,
			c = new b,
			l = TB.Global.getNick(),
			u = window.HubCache = window.HubCache || {},
			s = n.parse(c.getItem("cache-bubble_data")),
			f = "//vip.taobao.com/ajax/getUserOccurScene.do",
			d = function (e) {
				return this.el = i(e),
					a.one(".bubble")
						? (this.init(), void this.el.fire("M:load"))
						: void this.el.fire("M:load")
			};
		return d.prototype = {
			init   : function () {
				var e = this;
				if ("" != l) {
					var t = c.getItem("cache-bubble_req"),
						o = t
							? t.split(":")[0]
							: 0,
						a = t
							? t.split(":")[1]
							: null,
						n = t
							? t.split(":")[2]
							: null,
						b = (new Date).getDate(),
						r = (new Date).getHours();
					t && s && o == b && l == n && (1 > a && 1 > r || a >= 1 && r >= 1 && 12 > a && 12 > r || a >= 12 && r >= 12)
						? e.render(s)
						: e.getInfo()
				}
			},
			render : function (e) {
				if (e && e.code && e.status) {
					var t, o, a = e.code,
						b = c.getItem("cache-bubble_tap_" + l),
						u = b
							? b.split(":")[0]
							: 0,
						s = b
							? b.split(":")[1]
							: 0,
						f = (new Date).getDate(),
						d = (new Date).getHours();
					if (f != u && window.localStorage) for (o in localStorage) / cache - bubble_tap /.test(o) && localStorage.removeItem(o);
					if (0 == a) return void r.send({
						category: "ERROR_Bubble_Crash",
						msg     : "bubble\u6a21\u5757\u8bf7\u6c42\u5931\u8d25"
					});
					if (-1 != a && 1 == a) {
						if (c.setItem("cache-bubble_req", f + ":" + d + ":" + l), c.setItem("cache-bubble_data", n.stringify(e)), t = e.data.info || [], b && u == f && "1" == s) return;
						if (3 != t.length) return;
						var h = i(".J_Cup"),
							p = t[0] + "<a href='" + t[2] + "' target='_blank'>" + t[1] + "</a>",
							g = -1 * (h.offset().top - i(".tbh-sitenav")
									.height() - 6);
						i(".bubble-box")
							.prepend(p),
							i(".J_Bubble")
								.prependTo(h)
								.css("top", g)
								.show(),
							c.setItem("cache-bubble_tap_" + l, f + ":0"),
							i(".bubble-box b")
								.on("click",
									function (e) {
										e.halt(),
											i(e.currentTarget)
												.parent()
												.remove()
									}),
							i(".bubble-box a")
								.on("click",
									function () {
										c.setItem("cache-bubble_tap_" + l, f + ":1")
									})
					}
				}
			},
			getInfo: function () {
				var e = this;
				o({
					url     : f,
					type    : "GET",
					dataType: "jsonp",
					data    : {
						nick: l
					},
					cache   : !1,
					timeout : 5,
					success : function (t) {
						u.be_bubble = t,
							e.render(t)
					},
					error   : function () {
						e.render(s)
					}
				})
			}
		},
			d
	});
KISSY.add("tb-mod/tbh-fix-bottom/0.0.5/item-xtpl",
	function (n, e, t, i) {
		var a = i.exports = function (n) {
			function e(n, e, t) {
				n.data,
					n.affix;
				return e.data += " hide ",
					e
			}

			function t(n, e, t) {
				var i = n.data,
					o = n.affix;
				e.data += '\n        <a href="',
					f.line = 8;
				var l = (a = o.link) !== t
					? a
					: (a = i.link) !== t
					? a
					: n.resolveLooseUp(["link"]);
				e = e.writeEscaped(l),
					e.data += '" target="_blank" title="';
				var s = (a = o.name) !== t
					? a
					: (a = i.name) !== t
					? a
					: n.resolveLooseUp(["name"]);
				e = e.writeEscaped(s),
					e.data += '">\n          <img src="//g.alicdn.com/s.gif" alt="',
					f.line = 9;
				var d = (a = o.name) !== t
					? a
					: (a = i.name) !== t
					? a
					: n.resolveLooseUp(["name"]);
				e = e.writeEscaped(d),
					e.data += '" data-ks-lazyload="';
				var r = (a = o.img) !== t
					? a
					: (a = i.img) !== t
					? a
					: n.resolveLooseUp(["img"]);
				return e = e.writeEscaped(r),
					e.data += '">\n        </a>\n        ',
					e
			}

			function i(n, e, t) {
				n.data,
					n.affix;
				return e.data += " show ",
					e
			}

			{
				var a, o, l = this,
					s = l.root,
					d = l.buffer,
					r = l.scope,
					f = (l.runtime, l.name, l.pos),
					c = r.data,
					m = r.affix,
					g = s.nativeCommands,
					u = s.utils,
					h = (u.callFn, u.callDataFn, u.callCommand, g.range, g["void"], g.foreach, g.forin, g.each),
					_ = (g["with"], g["if"]);
				g.set,
					g.include,
					g.parse,
					g.extend,
					g.block,
					g.macro,
					g["debugger"]
			}
			d.data += '<div class="util-wrap J_tb_lazyload">\n  <div class="inner">\n    <div class="banner J_Banner ',
				f.line = 3;
			var v = (a = m.showAll) !== n
				? a
				: (a = c.showAll) !== n
				? a
				: r.resolveLooseUp(["showAll"]);
			d = _.call(l, r, {
					params: [v],
					fn    : e
				},
				d),
				d.data += ' ">\n      <div class="links clearfix" id="J_TbhFixBottomLinks">\n        <span class="fold J_Fold">\u6536\u8d77</span>\n        <span class="close J_Close">\u5173\u95ed</span>\n        ',
				f.line = 7,
				f.line = 7;
			var p = (a = m.links) !== n
				? a
				: (a = c.links) !== n
				? a
				: r.resolveLooseUp(["links"]);
			d = h.call(l, r, {
					params: [p],
					fn    : t
				},
				d),
				d.data += '\n      </div>\n    </div>\n    <div class="J_Unfold unfold ',
				f.line = 14;
			var b = (a = m.showAll) !== n
				? a
				: (a = c.showAll) !== n
				? a
				: r.resolveLooseUp(["showAll"]);
			d = _.call(l, r, {
					params: [b],
					fn    : i
				},
				d),
				d.data += '" style="background:url(';
			var x = (a = m.config) !== n
				? null != a
				? o = a.img
				: a
				: (a = c.config) !== n
				? null != a
				? o = a.img
				: a
				: r.resolveLooseUp(["config", "img"]);
			return d = d.writeEscaped(x),
				d.data += ') 0 0 no-repeat;"></div>\n  </div>\n </div>',
				d
		};
		a.TPL_NAME = i.id || i.name
	}),
	KISSY.add("tb-mod/tbh-fix-bottom/0.0.5/index", ["tms/xtemplate", "xctrl", "node", "promise", "kg/reporter/0.0.2/index", "anim", "kg/offline/6.0.4/index", "kg/datalazyload/6.0.5/index", "./item-xtpl"],
		function (n, e) {
			function t() {
				this.init.apply(this, arguments)
			}

			var i = e("tms/xtemplate"),
				a = e("xctrl"),
				o = e("node"),
				l = e("promise"),
				s = e("kg/reporter/0.0.2/index"),
				d = o.all;
			e("anim");
			var r = e("kg/offline/6.0.4/index"),
				f = e("kg/datalazyload/6.0.5/index"),
				c = e("./item-xtpl"),
				m = new r;
			return t.prototype = {
				init      : function (n, e) {
					var t = this;
					t._node = o.one(n),
						e = e || t._node.find(".J_Conf")
								  .html(),
						e
							? t.loadData(e)
							   .then(function (n) {
									   var e = "true" === n.config.enabled || 1 === n.config.enabled || n.config.enabled === !0;
									   if (!e) return void t._hide();
									   var a = parseInt(3 * Math.random()),
										   o = n.links.slice(10 * a, 10 * (a + 1));
									   10 !== o.length && (o = n.links.slice(0, 10));
									   var l = new i(c).render({
										   config : n.config,
										   links  : o,
										   showAll: t._needShow()
									   });
									   t._setExpire(),
										   t._node.html(l),
										   t.configData = n.config,
										   t._lazyload(),
										   t._initAttrs(),
										   t.bindEvent(),
										   t._setBG()
								   },
								   function () {
									   t._hide()
								   })
							   .fail(function () {
								   t._hide()
							   })
							   .then(function () {
								   t._node.fire("M:load")
							   })
							: t.bindEvent()
				},
				loadData  : function (n) {
					return new l(function (e, t) {
						n && a.dynamic({
							data    : n,
							key     : ["config", "links"],
							callback: function (n) {
								if (n || (n = m.getItem("cache-fix-bottom"), s.send({
										category: "ERROR_fix_bottom_data_err",
										msg     : "\u6a21\u5757 fix_bottom \u6570\u636e\u8bf7\u6c42\u9519\u8bef\uff0c\u4f7f\u7528\u7f13\u5b58"
									})), n && n.config && n.config[0] && n.links && n.links.length >= 10) {
									var i = n.config[0],
										a = n.links;
									if (i.bgSmallImg && i.bgImg && i.img) return m.set("cache-fix-bottom", JSON.stringify(n)),
										void e({
											links : a,
											config: i
										});
									s.send({
										category: "ERROR_fix_bottom_data_err",
										msg     : "\u6a21\u5757 fix_bottom \u6570\u636e\u914d\u7f6e\u9519\u8bef"
									})
								}
								t()
							}
						})
					})
				},
				bindEvent : function () {
					var n = this._node;
					n.delegate("click", ".J_Fold", this._fold, this),
						n.delegate("click", ".J_Close", this._close, this),
						n.delegate("click", ".J_Unfold", this._unfold, this),
						d(window)
							.on("resize", this._setBG, this)
				},
				_fold     : function () {
					var n = this;
					this.bannerEl.animate({
							left: "-100%"
						},
						{
							duration: .5,
							complete: function () {
								n.unfoldEl.animate({
										left: 10
									},
									{
										duration: .5
									})
							}
						})
				},
				_unfold   : function () {
					var n = this;
					n.unfoldEl.animate({
							left: "-110"
						},
						{
							duration: .3,
							complete: function () {
								n.bannerEl.show()
								 .removeClass("hide"),
									n.bannerEl.animate({
											left: 0
										},
										{
											duration: .5,
											complete: function () {
												n.lazyload.refresh()
											}
										})
							}
						})
				},
				_close    : function () {
					var n = this;
					this._node.fadeOut(.3,
						function () {
							n._node.remove()
						})
				},
				_needShow : function () {
					return m.getItem("activity-fixed-bottom")
				},
				_setExpire: function () {
					if (!m.get("activity-fixed-bottom")) {
						var n = new Date,
							e = n.getHours(),
							t = n.getMinutes(),
							i = n.getSeconds(),
							a = 60 * (23 - e) * 60 * 1e3 + 60 * (59 - t) * 1e3 + 1e3 * (59 - i);
						m.setItem("activity-fixed-bottom", "1", a)
					}
				},
				_hide     : function () {
					d(".J_tb_lazyload", this._node)
						.hide()
				},
				_initAttrs: function () {
					this.unfoldEl = d(".J_Unfold", this._node),
						this.bannerEl = d(".J_Banner", this._node)
				},
				_setBG    : function () {
					var n = d("body"),
						e = this.configData.bgImg;
					n.hasClass("s1190") && (e = this.configData.bgSmallImg),
						this.bannerEl.css({
							backgroundImage: "url(" + e + ")"
						})
				},
				_lazyload : function () {
					this.lazyload = new f("#J_TbhFixBottomLinks")
				}
			},
				t
		});
KISSY.add("tb-mod/tbh-inject/0.0.1/index",
	function (n, t) {
		function d() {}

		return d
	});
KISSY.add("tb-mod/tbh-favorite/0.0.8/overall-xtpl",
	function (a, e, r, t) {
		var o = t.exports = function (a) {
			function e(a, e, r) {
				var t = a.data,
					o = a.affix;
				e.data += '\n    <a href="',
					h.line = 8;
				var n = (b = o.link) !== r
					? b
					: (b = t.link) !== r
					? b
					: a.resolveLooseUp(["link"]);
				e = e.write(n),
					e.data += '" class="fi-logo" style="background-color:';
				var l = (b = o.basecolor) !== r
					? b
					: (b = t.basecolor) !== r
					? b
					: a.resolveLooseUp(["basecolor"]);
				e = e.writeEscaped(l),
					e.data += ';"><em>';
				var s = (b = o.name) !== r
					? b
					: (b = t.name) !== r
					? b
					: a.resolveLooseUp(["name"]);
				e = e.writeEscaped(s),
					e.data += '</em><img src="';
				var i = (b = o.logo) !== r
					? b
					: (b = t.logo) !== r
					? b
					: a.resolveLooseUp(["logo"]);
				e = e.write(i),
					e.data += '_150x150.jpg" alt="';
				var d = (b = o.name) !== r
					? b
					: (b = t.name) !== r
					? b
					: a.resolveLooseUp(["name"]);
				return e = e.writeEscaped(d),
					e.data += '"/></a>\n    ',
					e
			}

			function r(a, e, r) {
				a.data,
					a.affix;
				return e.data += ' class="tbh-tag"',
					e
			}

			function t(a, e, t) {
				var o = a.data,
					n = a.affix;
				e.data += "\n        ",
					h.line = 14;
				var l = (b = n.isHot) !== t
						? b
						: (b = o.isHot) !== t
						? b
						: a.resolveLooseUp(["isHot"]),
					s = l;
				s = l === !0;
				var i = s;
				if (!i) {
					var d = (b = n.isHot) !== t
							? b
							: (b = o.isHot) !== t
							? b
							: a.resolveLooseUp(["isHot"]),
						v = d;
					v = 1 === d,
						i = v
				}
				var p = i;
				if (!p) {
					var c = (b = n.isHot) !== t
							? b
							: (b = o.isHot) !== t
							? b
							: a.resolveLooseUp(["isHot"]),
						f = c;
					f = "true" === c,
						p = f
				}
				var x;
				x = j.call(u, a, {
						hash: [{
							key  : ["isHot"],
							value: p,
							depth: 0
						}]
					},
					e);
				var m = x;
				e = e.writeEscaped(m),
					e.data += '\n          <a href="',
					h.line = 15;
				var L = (b = n.link) !== t
					? b
					: (b = o.link) !== t
					? b
					: a.resolveLooseUp(["link"]);
				e = e.write(L),
					e.data += '"';
				var U = (b = n.isHot) !== t
					? b
					: (b = o.isHot) !== t
					? b
					: a.resolveLooseUp(["isHot"]);
				e = _.call(u, a, {
						params: [U],
						fn    : r
					},
					e),
					e.data += ">";
				var g = (b = n.text) !== t
					? b
					: (b = o.text) !== t
					? b
					: a.resolveLooseUp(["text"]);
				return e = e.writeEscaped(g),
					e.data += "</a>\n        ",
					e
			}

			function o(a, e, r) {
				a.data,
					a.affix;
				return e.data += ' data-inter="1"',
					e
			}

			function n(a, e, r) {
				var t = a.data,
					o = a.affix;
				e.data += ' data-type="';
				var n = (b = o.type) !== r
					? b
					: (b = t.type) !== r
					? b
					: a.resolveLooseUp(["type"]);
				return e = e.writeEscaped(n),
					e.data += '"',
					e
			}

			function l(a, e, r) {
				var t = a.data,
					l = a.affix;
				e.data += '\n        <a href="',
					h.line = 29;
				var s = (b = l.link) !== r
					? b
					: (b = t.link) !== r
					? b
					: a.resolveLooseUp(["link"]);
				e = e.write(s),
					e.data += '"';
				var i = (b = l.inter) !== r
					? b
					: (b = t.inter) !== r
					? b
					: a.resolveLooseUp(["inter"]);
				e = _.call(u, a, {
						params: [i],
						fn    : o
					},
					e),
					e.data += "";
				var d = (b = l.inter) !== r
					? b
					: (b = t.inter) !== r
					? b
					: a.resolveLooseUp(["inter"]);
				e = _.call(u, a, {
						params: [d],
						fn    : n
					},
					e),
					e.data += '><img src="//g.alicdn.com/s.gif" data-src="';
				var v = (b = l.img) !== r
					? b
					: (b = t.img) !== r
					? b
					: a.resolveLooseUp(["img"]);
				e = e.write(v),
					e.data += '_80x80.jpg" alt="';
				var p = (b = l.text) !== r
					? b
					: (b = t.text) !== r
					? b
					: a.resolveLooseUp(["text"]);
				e = e.writeEscaped(p),
					e.data += '"/><span>';
				var c = (b = l.text) !== r
					? b
					: (b = t.text) !== r
					? b
					: a.resolveLooseUp(["text"]);
				return e = e.writeEscaped(c),
					e.data += "</span></a>\n        ",
					e
			}

			function s(a, e, r) {
				var t = a.data,
					o = a.affix;
				e.data += "\n        ",
					h.line = 27;
				var n = (b = o.inter) !== r
						? b
						: (b = t.inter) !== r
						? b
						: a.resolveLooseUp(["inter"]),
					s = n;
				s = "true" === n;
				var i = s;
				if (!i) {
					var d = (b = o.inter) !== r
							? b
							: (b = t.inter) !== r
							? b
							: a.resolveLooseUp(["inter"]),
						v = d;
					v = d === !0,
						i = v
				}
				var p = i;
				if (!p) {
					var c = (b = o.inter) !== r
							? b
							: (b = t.inter) !== r
							? b
							: a.resolveLooseUp(["inter"]),
						f = c;
					f = 1 === c,
						p = f
				}
				var x;
				x = j.call(u, a, {
						hash: [{
							key  : ["inter"],
							value: p,
							depth: 0
						}]
					},
					e);
				var m = x;
				e = e.writeEscaped(m),
					e.data += "\n        ",
					h.line = 28,
					h.line = 28;
				var L = (b = o.xindex) !== r
						? b
						: (b = t.xindex) !== r
						? b
						: a.resolveLooseUp(["xindex"]),
					U = L;
				return U = 2 > L,
					e = _.call(u, a, {
							params: [U],
							fn    : l
						},
						e),
					e.data += "\n        ",
					e
			}

			function i(a, e, r) {
				var t = a.data,
					o = a.affix;
				e.data += '\n      <a href="',
					h.line = 34;
				var n = (b = o.link) !== r
					? b
					: (b = t.link) !== r
					? b
					: a.resolveLooseUp(["link"]);
				e = e.write(n),
					e.data += '" class="fi-banner-s fi-fl"><img src="//g.alicdn.com/s.gif" data-src="';
				var l = (b = o.img) !== r
					? b
					: (b = t.img) !== r
					? b
					: a.resolveLooseUp(["img"]);
				e = e.write(l),
					e.data += '_300x300.jpg" alt="';
				var s = (b = o.text) !== r
					? b
					: (b = t.text) !== r
					? b
					: a.resolveLooseUp(["text"]);
				return e = e.writeEscaped(s),
					e.data += '"/></a>\n      ',
					e
			}

			function d(a, e, r) {
				var t = a.data,
					o = a.affix;
				e.data += '\n      <a href="',
					h.line = 37;
				var n = (b = o.link) !== r
					? b
					: (b = t.link) !== r
					? b
					: a.resolveLooseUp(["link"]);
				e = e.write(n),
					e.data += '" class="fi-banner-m fi-fl"><img src="//g.alicdn.com/s.gif" data-src="';
				var l = (b = o.img) !== r
					? b
					: (b = t.img) !== r
					? b
					: a.resolveLooseUp(["img"]);
				e = e.write(l),
					e.data += '_400x400.jpg" alt="';
				var s = (b = o.text) !== r
					? b
					: (b = t.text) !== r
					? b
					: a.resolveLooseUp(["text"]);
				return e = e.writeEscaped(s),
					e.data += '"/></a>\n      ',
					e
			}

			function v(a, e, r) {
				a.data,
					a.affix;
				return e.data += ' data-inter="1"',
					e
			}

			function p(a, e, r) {
				var t = a.data,
					o = a.affix;
				e.data += ' data-type="';
				var n = (b = o.type) !== r
					? b
					: (b = t.type) !== r
					? b
					: a.resolveLooseUp(["type"]);
				return e = e.writeEscaped(n),
					e.data += '"',
					e
			}

			function c(a, e, r) {
				var t = a.data,
					o = a.affix;
				e.data += '\n        <a href="',
					h.line = 49;
				var n = (b = o.link) !== r
					? b
					: (b = t.link) !== r
					? b
					: a.resolveLooseUp(["link"]);
				e = e.write(n),
					e.data += '"';
				var l = (b = o.inter) !== r
					? b
					: (b = t.inter) !== r
					? b
					: a.resolveLooseUp(["inter"]);
				e = _.call(u, a, {
						params: [l],
						fn    : v
					},
					e),
					e.data += "";
				var s = (b = o.inter) !== r
					? b
					: (b = t.inter) !== r
					? b
					: a.resolveLooseUp(["inter"]);
				e = _.call(u, a, {
						params: [s],
						fn    : p
					},
					e),
					e.data += '><span><img src="//g.alicdn.com/s.gif" data-src="';
				var i = (b = o.img) !== r
					? b
					: (b = t.img) !== r
					? b
					: a.resolveLooseUp(["img"]);
				e = e.write(i),
					e.data += '_80x80.jpg" alt="';
				var d = (b = o.text) !== r
					? b
					: (b = t.text) !== r
					? b
					: a.resolveLooseUp(["text"]);
				e = e.writeEscaped(d),
					e.data += '"/></span><strong>';
				var c = (b = o.text) !== r
					? b
					: (b = t.text) !== r
					? b
					: a.resolveLooseUp(["text"]);
				e = e.writeEscaped(c),
					e.data += "</strong><em>";
				var f = (b = o.sub) !== r
					? b
					: (b = t.sub) !== r
					? b
					: a.resolveLooseUp(["sub"]);
				return e = e.writeEscaped(f),
					e.data += "</em></a>\n        ",
					e
			}

			function f(a, e, r) {
				var t = a.data,
					o = a.affix;
				e.data += "\n        ",
					h.line = 47;
				var n = (b = o.inter) !== r
						? b
						: (b = t.inter) !== r
						? b
						: a.resolveLooseUp(["inter"]),
					l = n;
				l = "true" === n;
				var s = l;
				if (!s) {
					var i = (b = o.inter) !== r
							? b
							: (b = t.inter) !== r
							? b
							: a.resolveLooseUp(["inter"]),
						d = i;
					d = i === !0,
						s = d
				}
				var v = s;
				if (!v) {
					var p = (b = o.inter) !== r
							? b
							: (b = t.inter) !== r
							? b
							: a.resolveLooseUp(["inter"]),
						f = p;
					f = 1 === p,
						v = f
				}
				var x;
				x = j.call(u, a, {
						hash: [{
							key  : ["inter"],
							value: v,
							depth: 0
						}]
					},
					e);
				var m = x;
				e = e.writeEscaped(m),
					e.data += "\n        ",
					h.line = 48,
					h.line = 48;
				var L = (b = o.xindex) !== r
						? b
						: (b = t.xindex) !== r
						? b
						: a.resolveLooseUp(["xindex"]),
					U = L;
				return U = 2 > L,
					e = _.call(u, a, {
							params: [U],
							fn    : c
						},
						e),
					e.data += "\n        ",
					e
			}

			{
				var b, x, u = this,
					m = u.root,
					L = u.buffer,
					U = u.scope,
					h = (u.runtime, u.name, u.pos),
					g = U.data,
					w = U.affix,
					k = m.nativeCommands,
					E = m.utils,
					y = (E.callFn, E.callDataFn, E.callCommand, k.range, k["void"], k.foreach, k.forin, k.each),
					H = k["with"],
					_ = k["if"],
					j = k.set;
				k.include,
					k.parse,
					k.extend,
					k.block,
					k.macro,
					k["debugger"]
			}
			L.data += "";
			var S = (b = w.head) !== a
					? b
					: (b = g.head) !== a
					? b
					: U.resolveLooseUp(["head"]),
				C = S;
			if (C) {
				var F = (b = w.head) !== a
					? null != b
					? x = b[0]
					: b
					: (b = g.head) !== a
					? null != b
					? x = b[0]
					: b
					: U.resolveLooseUp(["head", 0]);
				C = F
			}
			var I;
			I = j.call(u, U, {
					hash: [{
						key  : ["head"],
						value: C,
						depth: 0
					}]
				},
				L);
			var P = I;
			L = L.writeEscaped(P),
				L.data += "\n",
				h.line = 2;
			var T = (b = w.tsbanner) !== a
					? b
					: (b = g.tsbanner) !== a
					? b
					: U.resolveLooseUp(["tsbanner"]),
				D = T;
			if (D) {
				var K = (b = w.tsbanner) !== a
					? null != b
					? x = b[0]
					: b
					: (b = g.tsbanner) !== a
					? null != b
					? x = b[0]
					: b
					: U.resolveLooseUp(["tsbanner", 0]);
				D = K
			}
			var M;
			M = j.call(u, U, {
					hash: [{
						key  : ["tsbanner"],
						value: D,
						depth: 0
					}]
				},
				L);
			var N = M;
			L = L.writeEscaped(N),
				L.data += "\n",
				h.line = 3;
			var O = (b = w.tlbanner) !== a
					? b
					: (b = g.tlbanner) !== a
					? b
					: U.resolveLooseUp(["tlbanner"]),
				Y = O;
			if (Y) {
				var A = (b = w.tlbanner) !== a
					? null != b
					? x = b[0]
					: b
					: (b = g.tlbanner) !== a
					? null != b
					? x = b[0]
					: b
					: U.resolveLooseUp(["tlbanner", 0]);
				Y = A
			}
			var G;
			G = j.call(u, U, {
					hash: [{
						key  : ["tlbanner"],
						value: Y,
						depth: 0
					}]
				},
				L);
			var R = G;
			L = L.writeEscaped(R),
				L.data += "\n",
				h.line = 4;
			var $ = (b = w.bbox) !== a
					? b
					: (b = g.bbox) !== a
					? b
					: U.resolveLooseUp(["bbox"]),
				q = $;
			if (q) {
				var z = (b = w.bbox) !== a
					? null != b
					? x = b[0]
					: b
					: (b = g.bbox) !== a
					? null != b
					? x = b[0]
					: b
					: U.resolveLooseUp(["bbox", 0]);
				q = z
			}
			var B;
			B = j.call(u, U, {
					hash: [{
						key  : ["bbox"],
						value: q,
						depth: 0
					}]
				},
				L);
			var J = B;
			L = L.writeEscaped(J),
				L.data += '\n<div data-mid="',
				h.line = 5;
			var Q = (b = w.mid) !== a
				? b
				: (b = g.mid) !== a
				? b
				: U.resolveLooseUp(["mid"]);
			L = L.writeEscaped(Q),
				L.data += '" class="favorite-item favorite-overall" data-spm-ab="item-';
			var V = (b = w.spmab) !== a
				? b
				: (b = g.spmab) !== a
				? b
				: U.resolveLooseUp(["spmab"]);
			L = L.writeEscaped(V),
				L.data += '">\n  <div class="fi-sidebar" data-spm-ab="item-',
				h.line = 6;
			var W = (b = w.spmab) !== a
				? b
				: (b = g.spmab) !== a
				? b
				: U.resolveLooseUp(["spmab"]);
			L = L.writeEscaped(W),
				L.data += '-links">\n    ',
				h.line = 7,
				h.line = 7;
			var X = (b = w.head) !== a
				? b
				: (b = g.head) !== a
				? b
				: U.resolveLooseUp(["head"]);
			L = H.call(u, U, {
					params: [X],
					fn    : e
				},
				L),
				L.data += '\n    <div class="fi-links" style="background-color:',
				h.line = 10;
			var Z = (b = w.head) !== a
				? null != b
				? x = b.subcolor
				: b
				: (b = g.head) !== a
				? null != b
				? x = b.subcolor
				: b
				: U.resolveLooseUp(["head", "subcolor"]);
			L = L.writeEscaped(Z),
				L.data += ';">\n      <strong>',
				L.data += "\u70ed\u95e8TOP</strong>\n      <div>\n        ",
				h.line = 13,
				h.line = 13;
			var aa = (b = w.links) !== a
				? b
				: (b = g.links) !== a
				? b
				: U.resolveLooseUp(["links"]);
			L = y.call(u, U, {
					params: [aa],
					fn    : t
				},
				L),
				L.data += '\n      </div>\n    </div>\n  </div>\n  <div class="fi-contain">\n    <s style="border-color:',
				h.line = 21;
			var ea = (b = w.head) !== a
				? null != b
				? x = b.basecolor
				: b
				: (b = g.head) !== a
				? null != b
				? x = b.basecolor
				: b
				: U.resolveLooseUp(["head", "basecolor"]);
			L = L.writeEscaped(ea),
				L.data += '" class="fic-top"></s>\n    <s style="border-color:',
				h.line = 22;
			var ra = (b = w.head) !== a
				? null != b
				? x = b.basecolor
				: b
				: (b = g.head) !== a
				? null != b
				? x = b.basecolor
				: b
				: U.resolveLooseUp(["head", "basecolor"]);
			L = L.writeEscaped(ra),
				L.data += '" class="fic-right"></s>\n    <s style="border-color:',
				h.line = 23;
			var ta = (b = w.head) !== a
				? null != b
				? x = b.basecolor
				: b
				: (b = g.head) !== a
				? null != b
				? x = b.basecolor
				: b
				: U.resolveLooseUp(["head", "basecolor"]);
			L = L.writeEscaped(ta),
				L.data += '" class="fic-bottom"></s>\n    <div class="fi-cup">\n      <div class="fi-fl fi-cwrap fi-per">\n        ',
				h.line = 26,
				h.line = 26;
			var oa = (b = w.tbox) !== a
				? b
				: (b = g.tbox) !== a
				? b
				: U.resolveLooseUp(["tbox"]);
			L = y.call(u, U, {
					params: [oa],
					fn    : s
				},
				L),
				L.data += "\n      </div>\n      ",
				h.line = 33,
				h.line = 33;
			var na = (b = w.tsbanner) !== a
				? b
				: (b = g.tsbanner) !== a
				? b
				: U.resolveLooseUp(["tsbanner"]);
			L = H.call(u, U, {
					params: [na],
					fn    : i
				},
				L),
				L.data += "\n      ",
				h.line = 36,
				h.line = 36;
			var la = (b = w.tlbanner) !== a
				? b
				: (b = g.tlbanner) !== a
				? b
				: U.resolveLooseUp(["tlbanner"]);
			L = H.call(u, U, {
					params: [la],
					fn    : d
				},
				L),
				L.data += '\n    </div>\n    <div class="fi-cdown">\n      <a href="',
				h.line = 41;
			var sa = (b = w.bbox) !== a
				? null != b
				? x = b.link
				: b
				: (b = g.bbox) !== a
				? null != b
				? x = b.link
				: b
				: U.resolveLooseUp(["bbox", "link"]);
			L = L.write(sa),
				L.data += '" class="fi-banner-l fi-fl">\n        <img src="',
				h.line = 42;
			var ia = (b = w.bbox) !== a
				? null != b
				? x = b.img
				: b
				: (b = g.bbox) !== a
				? null != b
				? x = b.img
				: b
				: U.resolveLooseUp(["bbox", "img"]);
			L = L.write(ia),
				L.data += '_180x180.jpg" alt="';
			var da = (b = w.bbox) !== a
				? null != b
				? x = b.text
				: b
				: (b = g.bbox) !== a
				? null != b
				? x = b.text
				: b
				: U.resolveLooseUp(["bbox", "text"]);
			L = L.writeEscaped(da),
				L.data += '"/>\n        <span><em style="background: ',
				h.line = 43;
			var va = (b = w.head) !== a
				? null != b
				? x = b.subcolor
				: b
				: (b = g.head) !== a
				? null != b
				? x = b.subcolor
				: b
				: U.resolveLooseUp(["head", "subcolor"]);
			L = L.writeEscaped(va),
				L.data += '">';
			var pa = (b = w.bbox) !== a
				? null != b
				? x = b.tag
				: b
				: (b = g.bbox) !== a
				? null != b
				? x = b.tag
				: b
				: U.resolveLooseUp(["bbox", "tag"]);
			L = L.writeEscaped(pa),
				L.data += "</em><i>";
			var ca = (b = w.bbox) !== a
				? null != b
				? x = b.text
				: b
				: (b = g.bbox) !== a
				? null != b
				? x = b.text
				: b
				: U.resolveLooseUp(["bbox", "text"]);
			L = L.writeEscaped(ca),
				L.data += '</i></span>\n      </a>\n      <div class="fi-fl fi-dwrap fi-per">\n        ',
				h.line = 46,
				h.line = 46;
			var fa = (b = w.bbox2) !== a
				? b
				: (b = g.bbox2) !== a
				? b
				: U.resolveLooseUp(["bbox2"]);
			return L = y.call(u, U, {
					params: [fa],
					fn    : f
				},
				L),
				L.data += "\n      </div>\n    </div>\n  </div>\n</div>\n",
				L
		};
		o.TPL_NAME = t.id || t.name
	}),
	KISSY.add("tb-mod/tbh-favorite/0.0.8/entry-xtpl",
		function (a, e, r, t) {
			var o = t.exports = function (a) {
				function e(a, e, r) {
					var t = a.data,
						o = a.affix;
					e.data += '\n    <a href="',
						g.line = 7;
					var n = (x = o.link) !== r
						? x
						: (x = t.link) !== r
						? x
						: a.resolveLooseUp(["link"]);
					e = e.write(n),
						e.data += '" class="fi-logo" style="background-color:';
					var l = (x = o.basecolor) !== r
						? x
						: (x = t.basecolor) !== r
						? x
						: a.resolveLooseUp(["basecolor"]);
					e = e.writeEscaped(l),
						e.data += ';"><em>';
					var s = (x = o.name) !== r
						? x
						: (x = t.name) !== r
						? x
						: a.resolveLooseUp(["name"]);
					e = e.writeEscaped(s),
						e.data += '</em><img src="';
					var i = (x = o.logo) !== r
						? x
						: (x = t.logo) !== r
						? x
						: a.resolveLooseUp(["logo"]);
					e = e.write(i),
						e.data += '_150x150.jpg" alt="';
					var d = (x = o.name) !== r
						? x
						: (x = t.name) !== r
						? x
						: a.resolveLooseUp(["name"]);
					return e = e.writeEscaped(d),
						e.data += '"/></a>\n    ',
						e
				}

				function r(a, e, r) {
					a.data,
						a.affix;
					return e.data += ' class="tbh-tag"',
						e
				}

				function t(a, e, t) {
					var o = a.data,
						n = a.affix;
					e.data += "\n        ",
						g.line = 13;
					var l = (x = n.isHot) !== t
							? x
							: (x = o.isHot) !== t
							? x
							: a.resolveLooseUp(["isHot"]),
						s = l;
					s = l === !0;
					var i = s;
					if (!i) {
						var d = (x = n.isHot) !== t
								? x
								: (x = o.isHot) !== t
								? x
								: a.resolveLooseUp(["isHot"]),
							v = d;
						v = 1 === d,
							i = v
					}
					var p = i;
					if (!p) {
						var c = (x = n.isHot) !== t
								? x
								: (x = o.isHot) !== t
								? x
								: a.resolveLooseUp(["isHot"]),
							f = c;
						f = "true" === c,
							p = f
					}
					var b;
					b = S.call(m, a, {
							hash: [{
								key  : ["isHot"],
								value: p,
								depth: 0
							}]
						},
						e);
					var u = b;
					e = e.writeEscaped(u),
						e.data += '\n          <a href="',
						g.line = 14;
					var L = (x = n.link) !== t
						? x
						: (x = o.link) !== t
						? x
						: a.resolveLooseUp(["link"]);
					e = e.write(L),
						e.data += '"';
					var U = (x = n.isHot) !== t
						? x
						: (x = o.isHot) !== t
						? x
						: a.resolveLooseUp(["isHot"]);
					e = j.call(m, a, {
							params: [U],
							fn    : r
						},
						e),
						e.data += ">";
					var h = (x = n.text) !== t
						? x
						: (x = o.text) !== t
						? x
						: a.resolveLooseUp(["text"]);
					return e = e.writeEscaped(h),
						e.data += "</a>\n        ",
						e
				}

				function o(a, e, r) {
					var t = a.data,
						o = a.affix;
					e.data += '\n      <a href="',
						g.line = 25;
					var n = (x = o.link) !== r
						? x
						: (x = t.link) !== r
						? x
						: a.resolveLooseUp(["link"]);
					e = e.write(n),
						e.data += '" class="fi-banner-s fi-fl"><img src="//g.alicdn.com/s.gif" data-src="';
					var l = (x = o.img) !== r
						? x
						: (x = t.img) !== r
						? x
						: a.resolveLooseUp(["img"]);
					e = e.write(l),
						e.data += '_300x300.jpg" alt="';
					var s = (x = o.text) !== r
						? x
						: (x = t.text) !== r
						? x
						: a.resolveLooseUp(["text"]);
					return e = e.writeEscaped(s),
						e.data += '"/></a>\n      ',
						e
				}

				function n(a, e, r) {
					a.data,
						a.affix;
					return e.data += ' data-inter="1"',
						e
				}

				function l(a, e, r) {
					var t = a.data,
						o = a.affix;
					e.data += ' data-type="';
					var n = (x = o.type) !== r
						? x
						: (x = t.type) !== r
						? x
						: a.resolveLooseUp(["type"]);
					return e = e.writeEscaped(n),
						e.data += '"',
						e
				}

				function s(a, e, r) {
					var t = a.data,
						o = a.affix;
					e.data += '\n        <a href="',
						g.line = 31;
					var s = (x = o.link) !== r
						? x
						: (x = t.link) !== r
						? x
						: a.resolveLooseUp(["link"]);
					e = e.write(s),
						e.data += '"';
					var i = (x = o.inter) !== r
						? x
						: (x = t.inter) !== r
						? x
						: a.resolveLooseUp(["inter"]);
					e = j.call(m, a, {
							params: [i],
							fn    : n
						},
						e),
						e.data += "";
					var d = (x = o.inter) !== r
						? x
						: (x = t.inter) !== r
						? x
						: a.resolveLooseUp(["inter"]);
					e = j.call(m, a, {
							params: [d],
							fn    : l
						},
						e),
						e.data += '><img src="//g.alicdn.com/s.gif" data-src="';
					var v = (x = o.img) !== r
						? x
						: (x = t.img) !== r
						? x
						: a.resolveLooseUp(["img"]);
					e = e.write(v),
						e.data += '_80x80.jpg" alt="';
					var p = (x = o.text) !== r
						? x
						: (x = t.text) !== r
						? x
						: a.resolveLooseUp(["text"]);
					e = e.writeEscaped(p),
						e.data += '"/><span>';
					var c = (x = o.text) !== r
						? x
						: (x = t.text) !== r
						? x
						: a.resolveLooseUp(["text"]);
					return e = e.writeEscaped(c),
						e.data += "</span></a>\n        ",
						e
				}

				function i(a, e, r) {
					var t = a.data,
						o = a.affix;
					e.data += "\n        ",
						g.line = 29;
					var n = (x = o.inter) !== r
							? x
							: (x = t.inter) !== r
							? x
							: a.resolveLooseUp(["inter"]),
						l = n;
					l = "true" === n;
					var i = l;
					if (!i) {
						var d = (x = o.inter) !== r
								? x
								: (x = t.inter) !== r
								? x
								: a.resolveLooseUp(["inter"]),
							v = d;
						v = d === !0,
							i = v
					}
					var p = i;
					if (!p) {
						var c = (x = o.inter) !== r
								? x
								: (x = t.inter) !== r
								? x
								: a.resolveLooseUp(["inter"]),
							f = c;
						f = 1 === c,
							p = f
					}
					var b;
					b = S.call(m, a, {
							hash: [{
								key  : ["inter"],
								value: p,
								depth: 0
							}]
						},
						e);
					var u = b;
					e = e.writeEscaped(u),
						e.data += "\n        ",
						g.line = 30,
						g.line = 30;
					var L = (x = o.xindex) !== r
							? x
							: (x = t.xindex) !== r
							? x
							: a.resolveLooseUp(["xindex"]),
						U = L;
					return U = 2 > L,
						e = j.call(m, a, {
								params: [U],
								fn    : s
							},
							e),
						e.data += "\n        ",
						e
				}

				function d(a, e, r) {
					var t = a.data,
						o = a.affix;
					e.data += '\n      <a href="',
						g.line = 36;
					var n = (x = o.link) !== r
						? x
						: (x = t.link) !== r
						? x
						: a.resolveLooseUp(["link"]);
					e = e.write(n),
						e.data += '" class="fi-banner-m fi-fl"><img src="//g.alicdn.com/s.gif" data-src="';
					var l = (x = o.img) !== r
						? x
						: (x = t.img) !== r
						? x
						: a.resolveLooseUp(["img"]);
					e = e.write(l),
						e.data += '_400x400.jpg" alt="';
					var s = (x = o.text) !== r
						? x
						: (x = t.text) !== r
						? x
						: a.resolveLooseUp(["text"]);
					return e = e.writeEscaped(s),
						e.data += '"/></a>\n      ',
						e
				}

				function v(a, e, r) {
					a.data,
						a.affix;
					return e.data += ' data-inter="1"',
						e
				}

				function p(a, e, r) {
					var t = a.data,
						o = a.affix;
					e.data += ' data-type="';
					var n = (x = o.type) !== r
						? x
						: (x = t.type) !== r
						? x
						: a.resolveLooseUp(["type"]);
					return e = e.writeEscaped(n),
						e.data += '"',
						e
				}

				function c(a, e, r) {
					a.data,
						a.affix;
					return e.data += "</p><p>",
						e
				}

				function f(a, e, r) {
					var t = a.data,
						o = a.affix;
					e.data += "\n          ",
						g.line = 44;
					var n = (x = o.inter) !== r
							? x
							: (x = t.inter) !== r
							? x
							: a.resolveLooseUp(["inter"]),
						l = n;
					l = "true" === n;
					var s = l;
					if (!s) {
						var i = (x = o.inter) !== r
								? x
								: (x = t.inter) !== r
								? x
								: a.resolveLooseUp(["inter"]),
							d = i;
						d = i === !0,
							s = d
					}
					var f = s;
					if (!f) {
						var b = (x = o.inter) !== r
								? x
								: (x = t.inter) !== r
								? x
								: a.resolveLooseUp(["inter"]),
							u = b;
						u = 1 === b,
							f = u
					}
					var L;
					L = S.call(m, a, {
							hash: [{
								key  : ["inter"],
								value: f,
								depth: 0
							}]
						},
						e);
					var U = L;
					e = e.writeEscaped(U),
						e.data += '\n          <a href="',
						g.line = 45;
					var h = (x = o.link) !== r
						? x
						: (x = t.link) !== r
						? x
						: a.resolveLooseUp(["link"]);
					e = e.write(h),
						e.data += '"';
					var w = (x = o.inter) !== r
						? x
						: (x = t.inter) !== r
						? x
						: a.resolveLooseUp(["inter"]);
					e = j.call(m, a, {
							params: [w],
							fn    : v
						},
						e),
						e.data += "";
					var k = (x = o.inter) !== r
						? x
						: (x = t.inter) !== r
						? x
						: a.resolveLooseUp(["inter"]);
					e = j.call(m, a, {
							params: [k],
							fn    : p
						},
						e),
						e.data += '><span><img src="//g.alicdn.com/s.gif" data-src="';
					var E = (x = o.img) !== r
						? x
						: (x = t.img) !== r
						? x
						: a.resolveLooseUp(["img"]);
					e = e.write(E),
						e.data += '_70x70.jpg" alt="';
					var y = (x = o.text) !== r
						? x
						: (x = t.text) !== r
						? x
						: a.resolveLooseUp(["text"]);
					e = e.writeEscaped(y),
						e.data += '"/></span><em>';
					var H = (x = o.text) !== r
						? x
						: (x = t.text) !== r
						? x
						: a.resolveLooseUp(["text"]);
					e = e.writeEscaped(H),
						e.data += "</em></a>\n          ",
						g.line = 46;
					var _ = (x = o.xindex) !== r
							? x
							: (x = t.xindex) !== r
							? x
							: a.resolveLooseUp(["xindex"]),
						C = _;
					return C = 3 === _,
						e = j.call(m, a, {
								params: [C],
								fn    : c
							},
							e),
						e.data += "\n          ",
						e
				}

				function b(a, e, r) {
					var t = a.data,
						o = a.affix;
					e.data += "\n          ",
						g.line = 43,
						g.line = 43;
					var n = (x = o.xindex) !== r
							? x
							: (x = t.xindex) !== r
							? x
							: a.resolveLooseUp(["xindex"]),
						l = n;
					return l = 8 > n,
						e = j.call(m, a, {
								params: [l],
								fn    : f
							},
							e),
						e.data += "\n          ",
						e
				}

				{
					var x, u, m = this,
						L = m.root,
						U = m.buffer,
						h = m.scope,
						g = (m.runtime, m.name, m.pos),
						w = h.data,
						k = h.affix,
						E = L.nativeCommands,
						y = L.utils,
						H = (y.callFn, y.callDataFn, y.callCommand, E.range, E["void"], E.foreach, E.forin, E.each),
						_ = E["with"],
						j = E["if"],
						S = E.set;
					E.include,
						E.parse,
						E.extend,
						E.block,
						E.macro,
						E["debugger"]
				}
				U.data += "";
				var C = (x = k.head) !== a
						? x
						: (x = w.head) !== a
						? x
						: h.resolveLooseUp(["head"]),
					F = C;
				if (F) {
					var I = (x = k.head) !== a
						? null != x
						? u = x[0]
						: x
						: (x = w.head) !== a
						? null != x
						? u = x[0]
						: x
						: h.resolveLooseUp(["head", 0]);
					F = I
				}
				var P;
				P = S.call(m, h, {
						hash: [{
							key  : ["head"],
							value: F,
							depth: 0
						}]
					},
					U);
				var T = P;
				U = U.writeEscaped(T),
					U.data += "\n",
					g.line = 2;
				var D = (x = k.tsbanner) !== a
						? x
						: (x = w.tsbanner) !== a
						? x
						: h.resolveLooseUp(["tsbanner"]),
					K = D;
				if (K) {
					var M = (x = k.tsbanner) !== a
						? null != x
						? u = x[0]
						: x
						: (x = w.tsbanner) !== a
						? null != x
						? u = x[0]
						: x
						: h.resolveLooseUp(["tsbanner", 0]);
					K = M
				}
				var N;
				N = S.call(m, h, {
						hash: [{
							key  : ["tsbanner"],
							value: K,
							depth: 0
						}]
					},
					U);
				var O = N;
				U = U.writeEscaped(O),
					U.data += "\n",
					g.line = 3;
				var Y = (x = k.tlbanner) !== a
						? x
						: (x = w.tlbanner) !== a
						? x
						: h.resolveLooseUp(["tlbanner"]),
					A = Y;
				if (A) {
					var G = (x = k.tlbanner) !== a
						? null != x
						? u = x[0]
						: x
						: (x = w.tlbanner) !== a
						? null != x
						? u = x[0]
						: x
						: h.resolveLooseUp(["tlbanner", 0]);
					A = G
				}
				var R;
				R = S.call(m, h, {
						hash: [{
							key  : ["tlbanner"],
							value: A,
							depth: 0
						}]
					},
					U);
				var $ = R;
				U = U.writeEscaped($),
					U.data += '\n<div data-mid="',
					g.line = 4;
				var q = (x = k.mid) !== a
					? x
					: (x = w.mid) !== a
					? x
					: h.resolveLooseUp(["mid"]);
				U = U.writeEscaped(q),
					U.data += '" class="favorite-item favorite-entry" data-spm-ab="item-';
				var z = (x = k.spmab) !== a
					? x
					: (x = w.spmab) !== a
					? x
					: h.resolveLooseUp(["spmab"]);
				U = U.writeEscaped(z),
					U.data += '">\n  <div class="fi-sidebar" data-spm-ab="item-',
					g.line = 5;
				var B = (x = k.spmab) !== a
					? x
					: (x = w.spmab) !== a
					? x
					: h.resolveLooseUp(["spmab"]);
				U = U.writeEscaped(B),
					U.data += '-links">\n    ',
					g.line = 6,
					g.line = 6;
				var J = (x = k.head) !== a
					? x
					: (x = w.head) !== a
					? x
					: h.resolveLooseUp(["head"]);
				U = _.call(m, h, {
						params: [J],
						fn    : e
					},
					U),
					U.data += '\n    <div class="fi-links" style="background-color:',
					g.line = 9;
				var Q = (x = k.head) !== a
					? null != x
					? u = x.subcolor
					: x
					: (x = w.head) !== a
					? null != x
					? u = x.subcolor
					: x
					: h.resolveLooseUp(["head", "subcolor"]);
				U = U.writeEscaped(Q),
					U.data += ';">\n      <strong>',
					U.data += "\u70ed\u95e8TOP</strong>\n      <div>\n        ",
					g.line = 12,
					g.line = 12;
				var V = (x = k.links) !== a
					? x
					: (x = w.links) !== a
					? x
					: h.resolveLooseUp(["links"]);
				U = H.call(m, h, {
						params: [V],
						fn    : t
					},
					U),
					U.data += '\n      </div>\n    </div>\n  </div>\n  <div class="fi-contain">\n    <s style="border-color:',
					g.line = 20;
				var W = (x = k.head) !== a
					? null != x
					? u = x.basecolor
					: x
					: (x = w.head) !== a
					? null != x
					? u = x.basecolor
					: x
					: h.resolveLooseUp(["head", "basecolor"]);
				U = U.writeEscaped(W),
					U.data += '" class="fic-top"></s>\n    <s style="border-color:',
					g.line = 21;
				var X = (x = k.head) !== a
					? null != x
					? u = x.basecolor
					: x
					: (x = w.head) !== a
					? null != x
					? u = x.basecolor
					: x
					: h.resolveLooseUp(["head", "basecolor"]);
				U = U.writeEscaped(X),
					U.data += '" class="fic-right"></s>\n    <s style="border-color:',
					g.line = 22;
				var Z = (x = k.head) !== a
					? null != x
					? u = x.basecolor
					: x
					: (x = w.head) !== a
					? null != x
					? u = x.basecolor
					: x
					: h.resolveLooseUp(["head", "basecolor"]);
				U = U.writeEscaped(Z),
					U.data += '" class="fic-bottom"></s>\n    <div class="fi-cup">\n      ',
					g.line = 24,
					g.line = 24;
				var aa = (x = k.tsbanner) !== a
					? x
					: (x = w.tsbanner) !== a
					? x
					: h.resolveLooseUp(["tsbanner"]);
				U = _.call(m, h, {
						params: [aa],
						fn    : o
					},
					U),
					U.data += '\n      <div class="fi-fl fi-cwrap fi-per">\n        ',
					g.line = 28,
					g.line = 28;
				var ea = (x = k.tbox) !== a
					? x
					: (x = w.tbox) !== a
					? x
					: h.resolveLooseUp(["tbox"]);
				U = H.call(m, h, {
						params: [ea],
						fn    : i
					},
					U),
					U.data += "\n      </div>\n      ",
					g.line = 35,
					g.line = 35;
				var ra = (x = k.tlbanner) !== a
					? x
					: (x = w.tlbanner) !== a
					? x
					: h.resolveLooseUp(["tlbanner"]);
				U = _.call(m, h, {
						params: [ra],
						fn    : d
					},
					U),
					U.data += '\n    </div>\n    <div class="fi-cdown">\n      <div class="fi-infos fi-per">\n        <p>\n          ',
					g.line = 42,
					g.line = 42;
				var ta = (x = k.bpics) !== a
					? x
					: (x = w.bpics) !== a
					? x
					: h.resolveLooseUp(["bpics"]);
				return U = H.call(m, h, {
						params: [ta],
						fn    : b
					},
					U),
					U.data += "\n        </p>\n      </div>\n    </div>\n  </div>\n</div>\n",
					U
			};
			o.TPL_NAME = t.id || t.name
		}),
	KISSY.add("tb-mod/tbh-favorite/0.0.8/info-xtpl",
		function (a, e, r, t) {
			var o = t.exports = function (a) {
				function e(a, e, r) {
					var t = a.data,
						o = a.affix;
					e.data += '\n    <a href="',
						m.line = 6;
					var n = (p = o.link) !== r
						? p
						: (p = t.link) !== r
						? p
						: a.resolveLooseUp(["link"]);
					e = e.write(n),
						e.data += '" class="fi-logo" style="background-color:';
					var l = (p = o.basecolor) !== r
						? p
						: (p = t.basecolor) !== r
						? p
						: a.resolveLooseUp(["basecolor"]);
					e = e.writeEscaped(l),
						e.data += ';"><em>';
					var s = (p = o.name) !== r
						? p
						: (p = t.name) !== r
						? p
						: a.resolveLooseUp(["name"]);
					e = e.writeEscaped(s),
						e.data += '</em><img src="';
					var i = (p = o.logo) !== r
						? p
						: (p = t.logo) !== r
						? p
						: a.resolveLooseUp(["logo"]);
					e = e.write(i),
						e.data += '_150x150.jpg" alt="';
					var d = (p = o.name) !== r
						? p
						: (p = t.name) !== r
						? p
						: a.resolveLooseUp(["name"]);
					return e = e.writeEscaped(d),
						e.data += '"/></a>\n    ',
						e
				}

				function r(a, e, r) {
					a.data,
						a.affix;
					return e.data += ' class="tbh-tag"',
						e
				}

				function t(a, e, t) {
					var o = a.data,
						n = a.affix;
					e.data += "\n        ",
						m.line = 12;
					var l = (p = n.isHot) !== t
							? p
							: (p = o.isHot) !== t
							? p
							: a.resolveLooseUp(["isHot"]),
						s = l;
					s = l === !0;
					var i = s;
					if (!i) {
						var d = (p = n.isHot) !== t
								? p
								: (p = o.isHot) !== t
								? p
								: a.resolveLooseUp(["isHot"]),
							v = d;
						v = 1 === d,
							i = v
					}
					var c = i;
					if (!c) {
						var b = (p = n.isHot) !== t
								? p
								: (p = o.isHot) !== t
								? p
								: a.resolveLooseUp(["isHot"]),
							x = b;
						x = "true" === b,
							c = x
					}
					var u;
					u = y.call(f, a, {
							hash: [{
								key  : ["isHot"],
								value: c,
								depth: 0
							}]
						},
						e);
					var L = u;
					e = e.writeEscaped(L),
						e.data += '\n          <a href="',
						m.line = 13;
					var U = (p = n.link) !== t
						? p
						: (p = o.link) !== t
						? p
						: a.resolveLooseUp(["link"]);
					e = e.write(U),
						e.data += '"';
					var h = (p = n.isHot) !== t
						? p
						: (p = o.isHot) !== t
						? p
						: a.resolveLooseUp(["isHot"]);
					e = E.call(f, a, {
							params: [h],
							fn    : r
						},
						e),
						e.data += ">";
					var g = (p = n.text) !== t
						? p
						: (p = o.text) !== t
						? p
						: a.resolveLooseUp(["text"]);
					return e = e.writeEscaped(g),
						e.data += "</a>\n        ",
						e
				}

				function o(a, e, r) {
					var t = a.data,
						o = a.affix;
					e.data += '\n      <a href="',
						m.line = 25;
					var n = (p = o.link) !== r
						? p
						: (p = t.link) !== r
						? p
						: a.resolveLooseUp(["link"]);
					e = e.write(n),
						e.data += '" class="fi-banner-s fi-banner-s-';
					var l = (p = o.xindex) !== r
						? p
						: (p = t.xindex) !== r
						? p
						: a.resolveLooseUp(["xindex"]);
					e = e.writeEscaped(l),
						e.data += ' fi-fl"><img src="';
					var s = (p = o.img) !== r
						? p
						: (p = t.img) !== r
						? p
						: a.resolveLooseUp(["img"]);
					e = e.write(s),
						e.data += '_300x300.jpg" alt="';
					var i = (p = o.text) !== r
						? p
						: (p = t.text) !== r
						? p
						: a.resolveLooseUp(["text"]);
					return e = e.writeEscaped(i),
						e.data += '"/></a>\n      ',
						e
				}

				function n(a, e, r) {
					var t = a.data,
						n = a.affix;
					e.data += "\n      ",
						m.line = 24,
						m.line = 24;
					var l = (p = n.xindex) !== r
							? p
							: (p = t.xindex) !== r
							? p
							: a.resolveLooseUp(["xindex"]),
						s = l;
					return s = 2 > l,
						e = E.call(f, a, {
								params: [s],
								fn    : o
							},
							e),
						e.data += "\n      ",
						e
				}

				function l(a, e, r) {
					a.data,
						a.affix;
					return e.data += ' data-inter="1"',
						e
				}

				function s(a, e, r) {
					var t = a.data,
						o = a.affix;
					e.data += '\n        <a href="',
						m.line = 32;
					var n = (p = o.link) !== r
						? p
						: (p = t.link) !== r
						? p
						: a.resolveLooseUp(["link"]);
					e = e.write(n),
						e.data += '"';
					var s = (p = o.inter) !== r
						? p
						: (p = t.inter) !== r
						? p
						: a.resolveLooseUp(["inter"]);
					e = E.call(f, a, {
							params: [s],
							fn    : l
						},
						e),
						e.data += '>\n          <span><img src="//g.alicdn.com/s.gif" data-src="',
						m.line = 33;
					var i = (p = o.img) !== r
						? p
						: (p = t.img) !== r
						? p
						: a.resolveLooseUp(["img"]);
					e = e.write(i),
						e.data += '_80x80.jpg" alt="';
					var d = (p = o.title) !== r
						? p
						: (p = t.title) !== r
						? p
						: a.resolveLooseUp(["title"]);
					e = e.writeEscaped(d),
						e.data += '"/></span><strong>';
					var v = (p = o.title) !== r
						? p
						: (p = t.title) !== r
						? p
						: a.resolveLooseUp(["title"]);
					e = e.writeEscaped(v),
						e.data += "</strong><em>";
					var c = (p = o.sub) !== r
						? p
						: (p = t.sub) !== r
						? p
						: a.resolveLooseUp(["sub"]);
					return e = e.writeEscaped(c),
						e.data += "</em>\n        </a>\n        ",
						e
				}

				function i(a, e, r) {
					var t = a.data,
						o = a.affix;
					e.data += "\n        ",
						m.line = 30;
					var n = (p = o.inter) !== r
							? p
							: (p = t.inter) !== r
							? p
							: a.resolveLooseUp(["inter"]),
						l = n;
					l = "true" === n;
					var i = l;
					if (!i) {
						var d = (p = o.inter) !== r
								? p
								: (p = t.inter) !== r
								? p
								: a.resolveLooseUp(["inter"]),
							v = d;
						v = d === !0,
							i = v
					}
					var c = i;
					if (!c) {
						var b = (p = o.inter) !== r
								? p
								: (p = t.inter) !== r
								? p
								: a.resolveLooseUp(["inter"]),
							x = b;
						x = 1 === b,
							c = x
					}
					var u;
					u = y.call(f, a, {
							hash: [{
								key  : ["inter"],
								value: c,
								depth: 0
							}]
						},
						e);
					var L = u;
					e = e.writeEscaped(L),
						e.data += "\n        ",
						m.line = 31,
						m.line = 31;
					var U = (p = o.xindex) !== r
							? p
							: (p = t.xindex) !== r
							? p
							: a.resolveLooseUp(["xindex"]),
						h = U;
					return h = 2 > U,
						e = E.call(f, a, {
								params: [h],
								fn    : s
							},
							e),
						e.data += "\n        ",
						e
				}

				function d(a, e, r) {
					var t = a.data,
						o = a.affix;
					e.data += '\n        <a href="',
						m.line = 47;
					var n = (p = o.link) !== r
						? p
						: (p = t.link) !== r
						? p
						: a.resolveLooseUp(["link"]);
					e = e.write(n),
						e.data += '"><img src="//g.alicdn.com/s.gif" data-src="';
					var l = (p = o.img) !== r
						? p
						: (p = t.img) !== r
						? p
						: a.resolveLooseUp(["img"]);
					e = e.write(l),
						e.data += '_120x120.jpg" alt="';
					var s = (p = o.text) !== r
						? p
						: (p = t.text) !== r
						? p
						: a.resolveLooseUp(["text"]);
					e = e.writeEscaped(s),
						e.data += '"/><span>';
					var i = (p = o.text) !== r
						? p
						: (p = t.text) !== r
						? p
						: a.resolveLooseUp(["text"]);
					return e = e.writeEscaped(i),
						e.data += "</span></a>\n        ",
						e
				}

				function v(a, e, r) {
					var t = a.data,
						o = a.affix;
					e.data += "\n        ",
						m.line = 46,
						m.line = 46;
					var n = (p = o.xindex) !== r
							? p
							: (p = t.xindex) !== r
							? p
							: a.resolveLooseUp(["xindex"]),
						l = n;
					return l = 2 > n,
						e = E.call(f, a, {
								params: [l],
								fn    : d
							},
							e),
						e.data += "\n        ",
						e
				}

				{
					var p, c, f = this,
						b = f.root,
						x = f.buffer,
						u = f.scope,
						m = (f.runtime, f.name, f.pos),
						L = u.data,
						U = u.affix,
						h = b.nativeCommands,
						g = b.utils,
						w = (g.callFn, g.callDataFn, g.callCommand, h.range, h["void"], h.foreach, h.forin, h.each),
						k = h["with"],
						E = h["if"],
						y = h.set;
					h.include,
						h.parse,
						h.extend,
						h.block,
						h.macro,
						h["debugger"]
				}
				x.data += "";
				var H = (p = U.head) !== a
						? p
						: (p = L.head) !== a
						? p
						: u.resolveLooseUp(["head"]),
					_ = H;
				if (_) {
					var j = (p = U.head) !== a
						? null != p
						? c = p[0]
						: p
						: (p = L.head) !== a
						? null != p
						? c = p[0]
						: p
						: u.resolveLooseUp(["head", 0]);
					_ = j
				}
				var S;
				S = y.call(f, u, {
						hash: [{
							key  : ["head"],
							value: _,
							depth: 0
						}]
					},
					x);
				var C = S;
				x = x.writeEscaped(C),
					x.data += "\n",
					m.line = 2;
				var F = (p = U.bbox) !== a
						? p
						: (p = L.bbox) !== a
						? p
						: u.resolveLooseUp(["bbox"]),
					I = F;
				if (I) {
					var P = (p = U.bbox) !== a
						? null != p
						? c = p[0]
						: p
						: (p = L.bbox) !== a
						? null != p
						? c = p[0]
						: p
						: u.resolveLooseUp(["bbox", 0]);
					I = P
				}
				var T;
				T = y.call(f, u, {
						hash: [{
							key  : ["bbox"],
							value: I,
							depth: 0
						}]
					},
					x);
				var D = T;
				x = x.writeEscaped(D),
					x.data += '\n<div data-mid="',
					m.line = 3;
				var K = (p = U.mid) !== a
					? p
					: (p = L.mid) !== a
					? p
					: u.resolveLooseUp(["mid"]);
				x = x.writeEscaped(K),
					x.data += '" class="favorite-item favorite-info" data-spm-ab="item-';
				var M = (p = U.spmab) !== a
					? p
					: (p = L.spmab) !== a
					? p
					: u.resolveLooseUp(["spmab"]);
				x = x.writeEscaped(M),
					x.data += '">\n  <div class="fi-sidebar" data-spm-ab="item-',
					m.line = 4;
				var N = (p = U.spmab) !== a
					? p
					: (p = L.spmab) !== a
					? p
					: u.resolveLooseUp(["spmab"]);
				x = x.writeEscaped(N),
					x.data += '-links">\n    ',
					m.line = 5,
					m.line = 5;
				var O = (p = U.head) !== a
					? p
					: (p = L.head) !== a
					? p
					: u.resolveLooseUp(["head"]);
				x = k.call(f, u, {
						params: [O],
						fn    : e
					},
					x),
					x.data += '\n    <div class="fi-links" style="background-color:',
					m.line = 8;
				var Y = (p = U.head) !== a
					? null != p
					? c = p.subcolor
					: p
					: (p = L.head) !== a
					? null != p
					? c = p.subcolor
					: p
					: u.resolveLooseUp(["head", "subcolor"]);
				x = x.writeEscaped(Y),
					x.data += ';">\n      <strong>',
					x.data += "\u70ed\u95e8TOP</strong>\n      <div>\n        ",
					m.line = 11,
					m.line = 11;
				var A = (p = U.links) !== a
					? p
					: (p = L.links) !== a
					? p
					: u.resolveLooseUp(["links"]);
				x = w.call(f, u, {
						params: [A],
						fn    : t
					},
					x),
					x.data += '\n      </div>\n    </div>\n  </div>\n  <div class="fi-contain">\n    <s style="border-color:',
					m.line = 19;
				var G = (p = U.head) !== a
					? null != p
					? c = p.basecolor
					: p
					: (p = L.head) !== a
					? null != p
					? c = p.basecolor
					: p
					: u.resolveLooseUp(["head", "basecolor"]);
				x = x.writeEscaped(G),
					x.data += '" class="fic-top"></s>\n    <s style="border-color:',
					m.line = 20;
				var R = (p = U.head) !== a
					? null != p
					? c = p.basecolor
					: p
					: (p = L.head) !== a
					? null != p
					? c = p.basecolor
					: p
					: u.resolveLooseUp(["head", "basecolor"]);
				x = x.writeEscaped(R),
					x.data += '" class="fic-right"></s>\n    <s style="border-color:',
					m.line = 21;
				var $ = (p = U.head) !== a
					? null != p
					? c = p.basecolor
					: p
					: (p = L.head) !== a
					? null != p
					? c = p.basecolor
					: p
					: u.resolveLooseUp(["head", "basecolor"]);
				x = x.writeEscaped($),
					x.data += '" class="fic-bottom"></s>\n    <div class="fi-cup">\n      ',
					m.line = 23,
					m.line = 23;
				var q = (p = U.tsbanner) !== a
					? p
					: (p = L.tsbanner) !== a
					? p
					: u.resolveLooseUp(["tsbanner"]);
				x = w.call(f, u, {
						params: [q],
						fn    : n
					},
					x),
					x.data += '\n      <div class="fi-fl fi-cwrap-d fi-per">\n        ',
					m.line = 29,
					m.line = 29;
				var z = (p = U.tbox) !== a
					? p
					: (p = L.tbox) !== a
					? p
					: u.resolveLooseUp(["tbox"]);
				x = w.call(f, u, {
						params: [z],
						fn    : i
					},
					x),
					x.data += '\n      </div>\n    </div>\n    <div class="fi-cdown">\n      <a href="',
					m.line = 40;
				var B = (p = U.bbox) !== a
					? null != p
					? c = p.link
					: p
					: (p = L.bbox) !== a
					? null != p
					? c = p.link
					: p
					: u.resolveLooseUp(["bbox", "link"]);
				x = x.write(B),
					x.data += '" class="fi-banner-l fi-fl fi-detail">\n        <img src="',
					m.line = 41;
				var J = (p = U.bbox) !== a
					? null != p
					? c = p.img
					: p
					: (p = L.bbox) !== a
					? null != p
					? c = p.img
					: p
					: u.resolveLooseUp(["bbox", "img"]);
				x = x.write(J),
					x.data += '_180x180.jpg" alt="';
				var Q = (p = U.bbox) !== a
					? null != p
					? c = p.text
					: p
					: (p = L.bbox) !== a
					? null != p
					? c = p.text
					: p
					: u.resolveLooseUp(["bbox", "text"]);
				x = x.writeEscaped(Q),
					x.data += '"/>\n        <span><em style="background: ',
					m.line = 42;
				var V = (p = U.head) !== a
					? null != p
					? c = p.subcolor
					: p
					: (p = L.head) !== a
					? null != p
					? c = p.subcolor
					: p
					: u.resolveLooseUp(["head", "subcolor"]);
				x = x.writeEscaped(V),
					x.data += '">';
				var W = (p = U.bbox) !== a
					? null != p
					? c = p.tag
					: p
					: (p = L.bbox) !== a
					? null != p
					? c = p.tag
					: p
					: u.resolveLooseUp(["bbox", "tag"]);
				x = x.writeEscaped(W),
					x.data += "</em><i>";
				var X = (p = U.bbox) !== a
					? null != p
					? c = p.text
					: p
					: (p = L.bbox) !== a
					? null != p
					? c = p.text
					: p
					: u.resolveLooseUp(["bbox", "text"]);
				x = x.writeEscaped(X),
					x.data += "</i><strong>";
				var Z = (p = U.bbox) !== a
					? null != p
					? c = p.info
					: p
					: (p = L.bbox) !== a
					? null != p
					? c = p.info
					: p
					: u.resolveLooseUp(["bbox", "info"]);
				x = x.writeEscaped(Z),
					x.data += '</strong></span>\n      </a>\n      <div class="fi-fl fi-dwrap-c">\n        ',
					m.line = 45,
					m.line = 45;
				var aa = (p = U.bbox2) !== a
					? p
					: (p = L.bbox2) !== a
					? p
					: u.resolveLooseUp(["bbox2"]);
				return x = w.call(f, u, {
						params: [aa],
						fn    : v
					},
					x),
					x.data += "\n      </div>\n    </div>\n  </div>\n</div>\n",
					x
			};
			o.TPL_NAME = t.id || t.name
		}),
	KISSY.add("tb-mod/tbh-favorite/0.0.8/index", ["anim", "webp", "node", "personality", "./overall-xtpl", "./entry-xtpl", "./info-xtpl"],
		function (a, e) {
			function r(a) {
				this.init(a)
			}

			function t(a, e) {
				if (e && e.picUrl && e.clickUrl) {
					a.attr("href", e.clickUrl);
					var r = a.one("img")
							 .attr("data-src"),
						t = r.replace(/[\s\S]*?(?:(?=_\d+\x\d+\.jpg$))/, e.picUrl);
					a.one("img")
					 .attr("data-src", t)
				}
			}

			e("anim");
			var o = e("webp"),
				n = e("node"),
				l = e("personality"),
				s = e("./overall-xtpl"),
				i = e("./entry-xtpl"),
				d = e("./info-xtpl"),
				v = {};
			return r.prototype.init = function (a) {
				new l({
					box           : a,
					contain       : ".favorite",
					appids        : 2802,
					xtplFun       : [s, i, d],
					renderCallback: this.render,
					bindCallback  : this.bind
				})
			},
				r.prototype.render = function (a, e) {
					v[a.mid] = e.pData.recItemList
				},
				r.prototype.bind = function (a, e) {
					var r = a.el.one(".favorite-bd");
					r.hide()
					 .html(e),
						a.el.all(".favorite-item")
						 .each(function (a) {
							 var e = n.one(a),
								 r = v[e.attr("data-mid")];
							 r && e.all(".fi-per a")
								   .each(function (a, e) {
									   var o = n.one(a),
										   l = o.attr("data-type");
									   if (1 != o.attr("data-inter")) {
										   if (l && "0" != l) for (var s = 0,
																	   i = r.length; i > s; s++) if (r[s].type == l) {
											   t(o, r[s]);
											   break
										   }
										   t(o, r[e])
									   }
								   })
						 }),
						o(a.el.all("img"), null, "IGNORE"),
						r.fadeIn(.3),
						a.el.fire("M:load")
				},
				r
		});
KISSY.add("tb-mod/tbh-blocks/0.0.4/thumbtext-xtpl",
	function (a, e, r, o) {
		var t = o.exports = function (a) {
			function e(a, e, r) {
				var o = a.data,
					t = a.affix;
				e.data += ' data-baseid="';
				var l = (c = t.baseid) !== r
					? c
					: (c = o.baseid) !== r
					? c
					: a.resolveLooseUp(["baseid"]);
				return e = e.writeEscaped(l),
					e.data += '"',
					e
			}

			function r(a, e, r) {
				var o = a.data,
					t = a.affix;
				e.data += ' data-backup="';
				var l = (c = t.backup) !== r
					? c
					: (c = o.backup) !== r
					? c
					: a.resolveLooseUp(["backup"]);
				return e = e.writeEscaped(l),
					e.data += '"',
					e
			}

			function o(a, e, r) {
				a.data,
					a.affix;
				return e.data += " blocks-item-bg",
					e
			}

			function t(a, e, r) {
				var o = a.data,
					t = a.affix;
				e.data += ' style="background-image:url(';
				var l = (c = t.bg) !== r
					? c
					: (c = o.bg) !== r
					? c
					: a.resolveLooseUp(["bg"]);
				return e = e.write(l),
					e.data += ')"',
					e
			}

			function l(a, e, r) {
				var o = a.data,
					t = a.affix;
				e.data += '\n      <span class="blocks-qr">\n        <i class="tb-icon">&#xe610;</i>\n        <span>\n          <img src="//g.alicdn.com/s.gif" data-src="',
					u.line = 14;
				var l = (c = t.qr) !== r
					? c
					: (c = o.qr) !== r
					? c
					: a.resolveLooseUp(["qr"]);
				return e = e.write(l),
					e.data += '_100x100.jpg" alt="\u624b\u673a\u6dd8\u5b9d\u626b\u7801"/>\n          <em>\u624b\u673a\u6dd8\u5b9d\u626b\u7801</em>\n        </span>\n      </span>\n      ',
					e
			}

			function n(a, e, r) {
				var o = a.data,
					t = a.affix;
				e.data += '\n  <div class="block-title">\n    <h3 style="border-bottom-color: ',
					u.line = 8;
				var n = (c = t.color) !== r
					? c
					: (c = o.color) !== r
					? c
					: a.resolveLooseUp(["color"]);
				e = e.writeEscaped(n),
					e.data += '">\n      <a href="',
					u.line = 9;
				var s = (c = t.link) !== r
					? c
					: (c = o.link) !== r
					? c
					: a.resolveLooseUp(["link"]);
				e = e.write(s),
					e.data += '"><img src="//g.alicdn.com/s.gif" data-src="';
				var i = (c = t.img) !== r
					? c
					: (c = o.img) !== r
					? c
					: a.resolveLooseUp(["img"]);
				e = e.write(i),
					e.data += '_220x220.jpg" alt="';
				var d = (c = t.name) !== r
					? c
					: (c = o.name) !== r
					? c
					: a.resolveLooseUp(["name"]);
				e = e.writeEscaped(d),
					e.data += '"/></a>\n      ',
					u.line = 10,
					u.line = 10;
				var v = (c = t.qr) !== r
					? c
					: (c = o.qr) !== r
					? c
					: a.resolveLooseUp(["qr"]);
				return e = w.call(p, a, {
						params: [v],
						fn    : l
					},
					e),
					e.data += "\n    </h3>\n  </div>\n  ",
					e
			}

			function s(a, e, r) {
				a.data,
					a.affix;
				return e.data += ' class="last"',
					e
			}

			function i(a, e, r) {
				var o = a.data,
					t = a.affix;
				e.data += '\n    <a href="',
					u.line = 25;
				var l = (c = t.link) !== r
					? c
					: (c = o.link) !== r
					? c
					: a.resolveLooseUp(["link"]);
				e = e.write(l),
					e.data += '"';
				var n = (c = t.xindex) !== r
						? c
						: (c = o.xindex) !== r
						? c
						: a.resolveLooseUp(["xindex"]),
					i = n;
				i = n > 1,
					e = w.call(p, a, {
							params: [i],
							fn    : s
						},
						e),
					e.data += '>\n      <img src="//g.alicdn.com/s.gif" data-src="',
					u.line = 26;
				var d = (c = t.img) !== r
					? c
					: (c = o.img) !== r
					? c
					: a.resolveLooseUp(["img"]);
				e = e.write(d),
					e.data += '_80x80.jpg" alt="';
				var v = (c = t.name) !== r
					? c
					: (c = o.name) !== r
					? c
					: a.resolveLooseUp(["name"]);
				e = e.writeEscaped(v),
					e.data += '"/>\n      <strong>',
					u.line = 27;
				var b = (c = t.name) !== r
					? c
					: (c = o.name) !== r
					? c
					: a.resolveLooseUp(["name"]);
				e = e.writeEscaped(b),
					e.data += "</strong>\n      <span>",
					u.line = 28;
				var m = (c = t.sub) !== r
					? c
					: (c = o.sub) !== r
					? c
					: a.resolveLooseUp(["sub"]);
				return e = e.writeEscaped(m),
					e.data += "</span>\n    </a>\n    ",
					e
			}

			function d(a, e, r) {
				var o = a.data,
					t = a.affix;
				e.data += "\n    ",
					u.line = 24,
					u.line = 24;
				var l = (c = t.xindex) !== r
						? c
						: (c = o.xindex) !== r
						? c
						: a.resolveLooseUp(["xindex"]),
					n = l;
				return n = 4 > l,
					e = w.call(p, a, {
							params: [n],
							fn    : i
						},
						e),
					e.data += "\n    ",
					e
			}

			{
				var c, v, p = this,
					b = p.root,
					m = p.buffer,
					f = p.scope,
					u = (p.runtime, p.name, p.pos),
					h = f.data,
					x = f.affix,
					g = b.nativeCommands,
					k = b.utils,
					L = (k.callFn, k.callDataFn, k.callCommand, g.range, g["void"], g.foreach, g.forin, g.each),
					U = g["with"],
					w = g["if"],
					E = g.set;
				g.include,
					g.parse,
					g.extend,
					g.block,
					g.macro,
					g["debugger"]
			}
			m.data += "";
			var y = (c = x.head) !== a
					? c
					: (c = h.head) !== a
					? c
					: f.resolveLooseUp(["head"]),
				q = y;
			if (q) {
				var _ = (c = x.head) !== a
					? null != c
					? v = c[0]
					: c
					: (c = h.head) !== a
					? null != c
					? v = c[0]
					: c
					: f.resolveLooseUp(["head", 0]);
				q = _
			}
			var j;
			j = E.call(p, f, {
					hash: [{
						key  : ["head"],
						value: q,
						depth: 0
					}]
				},
				m);
			var S = j;
			m = m.writeEscaped(S),
				m.data += "\n",
				u.line = 2;
			var C = (c = x.head) !== a
					? c
					: (c = h.head) !== a
					? c
					: f.resolveLooseUp(["head"]),
				F = C;
			if (F) {
				var I = (c = x.head) !== a
					? null != c
					? v = c.bg
					: c
					: (c = h.head) !== a
					? null != c
					? v = c.bg
					: c
					: f.resolveLooseUp(["head", "bg"]);
				F = I
			}
			var K;
			K = E.call(p, f, {
					hash: [{
						key  : ["bg"],
						value: F,
						depth: 0
					}]
				},
				m);
			var N = K;
			m = m.writeEscaped(N),
				m.data += "\n",
				u.line = 3;
			var Y = (c = x.head) !== a
					? c
					: (c = h.head) !== a
					? c
					: f.resolveLooseUp(["head"]),
				D = Y;
			if (D) {
				var M = (c = x.head) !== a
					? null != c
					? v = c.bgcolor
					: c
					: (c = h.head) !== a
					? null != c
					? v = c.bgcolor
					: c
					: f.resolveLooseUp(["head", "bgcolor"]);
				D = M
			}
			var A;
			A = E.call(p, f, {
					hash: [{
						key  : ["bgcolor"],
						value: D,
						depth: 0
					}]
				},
				m);
			var P = A;
			m = m.writeEscaped(P),
				m.data += "\n",
				u.line = 4;
			var T = (c = x.head) !== a
					? c
					: (c = h.head) !== a
					? c
					: f.resolveLooseUp(["head"]),
				G = T;
			if (G) {
				var O = (c = x.head) !== a
					? null != c
					? v = c.color
					: c
					: (c = h.head) !== a
					? null != c
					? v = c.color
					: c
					: f.resolveLooseUp(["head", "color"]);
				G = O
			}
			var R;
			R = E.call(p, f, {
					hash: [{
						key  : ["color"],
						value: G,
						depth: 0
					}]
				},
				m);
			var z = R;
			m = m.writeEscaped(z),
				m.data += '\n<div data-mid="',
				u.line = 5;
			var B = (c = x.mid) !== a
				? c
				: (c = h.mid) !== a
				? c
				: f.resolveLooseUp(["mid"]);
			m = m.writeEscaped(B),
				m.data += '" data-spm-ab="item-';
			var H = (c = x.spmab) !== a
				? c
				: (c = h.spmab) !== a
				? c
				: f.resolveLooseUp(["spmab"]);
			m = m.writeEscaped(H),
				m.data += '"';
			var J = (c = x.baseid) !== a
				? c
				: (c = h.baseid) !== a
				? c
				: f.resolveLooseUp(["baseid"]);
			m = w.call(p, f, {
					params: [J],
					fn    : e
				},
				m),
				m.data += "";
			var Q = (c = x.backup) !== a
				? c
				: (c = h.backup) !== a
				? c
				: f.resolveLooseUp(["backup"]);
			m = w.call(p, f, {
					params: [Q],
					fn    : r
				},
				m),
				m.data += ' class="blocks-item blocks-thumbtext';
			var V = (c = x.bg) !== a
				? c
				: (c = h.bg) !== a
				? c
				: f.resolveLooseUp(["bg"]);
			m = w.call(p, f, {
					params: [V],
					fn    : o
				},
				m),
				m.data += " blocks-item-";
			var W = (c = x.index) !== a
				? c
				: (c = h.index) !== a
				? c
				: f.resolveLooseUp(["index"]);
			m = m.writeEscaped(W),
				m.data += '"';
			var X = (c = x.bg) !== a
				? c
				: (c = h.bg) !== a
				? c
				: f.resolveLooseUp(["bg"]);
			m = w.call(p, f, {
					params: [X],
					fn    : t
				},
				m),
				m.data += ">\n  ",
				u.line = 6,
				u.line = 6;
			var Z = (c = x.head) !== a
				? c
				: (c = h.head) !== a
				? c
				: f.resolveLooseUp(["head"]);
			m = U.call(p, f, {
					params: [Z],
					fn    : n
				},
				m),
				m.data += '\n  <div class="blocks-contain" style="background-color: ',
				u.line = 22;
			var $ = (c = x.bgcolor) !== a
				? c
				: (c = h.bgcolor) !== a
				? c
				: f.resolveLooseUp(["bgcolor"]);
			m = m.writeEscaped($),
				m.data += '">\n    ',
				u.line = 23,
				u.line = 23;
			var aa = (c = x.blockitem) !== a
				? c
				: (c = h.blockitem) !== a
				? c
				: f.resolveLooseUp(["blockitem"]);
			return m = L.call(p, f, {
					params: [aa],
					fn    : d
				},
				m),
				m.data += "\n  </div>\n</div>\n",
				m
		};
		t.TPL_NAME = o.id || o.name
	}),
	KISSY.add("tb-mod/tbh-blocks/0.0.4/thumb3-xtpl",
		function (a, e, r, o) {
			var t = o.exports = function (a) {
				function e(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += ' data-baseid="';
					var l = (c = t.baseid) !== r
						? c
						: (c = o.baseid) !== r
						? c
						: a.resolveLooseUp(["baseid"]);
					return e = e.writeEscaped(l),
						e.data += '"',
						e
				}

				function r(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += ' data-backup="';
					var l = (c = t.backup) !== r
						? c
						: (c = o.backup) !== r
						? c
						: a.resolveLooseUp(["backup"]);
					return e = e.writeEscaped(l),
						e.data += '"',
						e
				}

				function o(a, e, r) {
					a.data,
						a.affix;
					return e.data += " blocks-item-bg",
						e
				}

				function t(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += ' style="background-image:url(';
					var l = (c = t.bg) !== r
						? c
						: (c = o.bg) !== r
						? c
						: a.resolveLooseUp(["bg"]);
					return e = e.write(l),
						e.data += ')"',
						e
				}

				function l(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += '\n      <span class="blocks-qr">\n        <i class="tb-icon">&#xe610;</i>\n        <span>\n          <img src="//g.alicdn.com/s.gif" data-src="',
						u.line = 14;
					var l = (c = t.qr) !== r
						? c
						: (c = o.qr) !== r
						? c
						: a.resolveLooseUp(["qr"]);
					return e = e.write(l),
						e.data += '_100x100.jpg" alt="\u624b\u673a\u6dd8\u5b9d\u626b\u7801"/>\n          <em>\u624b\u673a\u6dd8\u5b9d\u626b\u7801</em>\n        </span>\n      </span>\n      ',
						e
				}

				function n(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += '\n  <div class="block-title">\n    <h3 style="border-bottom-color: ',
						u.line = 8;
					var n = (c = t.color) !== r
						? c
						: (c = o.color) !== r
						? c
						: a.resolveLooseUp(["color"]);
					e = e.writeEscaped(n),
						e.data += '">\n      <a href="',
						u.line = 9;
					var s = (c = t.link) !== r
						? c
						: (c = o.link) !== r
						? c
						: a.resolveLooseUp(["link"]);
					e = e.write(s),
						e.data += '"><img src="//g.alicdn.com/s.gif" data-src="';
					var i = (c = t.img) !== r
						? c
						: (c = o.img) !== r
						? c
						: a.resolveLooseUp(["img"]);
					e = e.write(i),
						e.data += '_220x220.jpg" alt="';
					var d = (c = t.name) !== r
						? c
						: (c = o.name) !== r
						? c
						: a.resolveLooseUp(["name"]);
					e = e.writeEscaped(d),
						e.data += '"/></a>\n      ',
						u.line = 10,
						u.line = 10;
					var v = (c = t.qr) !== r
						? c
						: (c = o.qr) !== r
						? c
						: a.resolveLooseUp(["qr"]);
					return e = E.call(p, a, {
							params: [v],
							fn    : l
						},
						e),
						e.data += "\n    </h3>\n  </div>\n  ",
						e
				}

				function s(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += "\n    ",
						u.line = 24;
					var l = (c = t.text) !== r
							? c
							: (c = o.text) !== r
							? c
							: a.resolveLooseUp(["text"]),
						n = l;
					if (n) {
						var s;
						s = L(p, a, {
								params: [" ", "<br/>"]
							},
							e, ["text", "replace"]);
						var i = s;
						n = i
					}
					var d;
					d = y.call(p, a, {
							hash: [{
								key  : ["text"],
								value: n,
								depth: 0
							}]
						},
						e);
					var v = d;
					e = e.writeEscaped(v),
						e.data += '\n    <a href="',
						u.line = 25;
					var b = (c = t.link) !== r
						? c
						: (c = o.link) !== r
						? c
						: a.resolveLooseUp(["link"]);
					e = e.write(b),
						e.data += '" class="thumb-big"><img src="//g.alicdn.com/s.gif" data-src="';
					var m = (c = t.img) !== r
						? c
						: (c = o.img) !== r
						? c
						: a.resolveLooseUp(["img"]);
					e = e.write(m),
						e.data += '_200x200.jpg" alt="';
					var f = (c = t.text) !== r
						? c
						: (c = o.text) !== r
						? c
						: a.resolveLooseUp(["text"]);
					e = e.writeEscaped(f),
						e.data += '"/><span style="background-color:';
					var h = (c = t.color) !== r
						? c
						: (c = o.color) !== r
						? c
						: a.resolveLooseUp(["color"]);
					e = e.writeEscaped(h),
						e.data += ';">';
					var x = (c = t.text) !== r
						? c
						: (c = o.text) !== r
						? c
						: a.resolveLooseUp(["text"]);
					return e = e.write(x),
						e.data += "</span></a>\n    ",
						e
				}

				function i(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += '\n    <a href="',
						u.line = 29;
					var l = (c = t.link) !== r
						? c
						: (c = o.link) !== r
						? c
						: a.resolveLooseUp(["link"]);
					e = e.write(l),
						e.data += '" class="thumb3-img';
					var n = (c = t.xindex) !== r
							? c
							: (c = o.xindex) !== r
							? c
							: a.resolveLooseUp(["xindex"]),
						s = n;
					s = n + 2,
						e = e.writeEscaped(s),
						e.data += '"><img src="//g.alicdn.com/s.gif" data-src="';
					var i = (c = t.img) !== r
						? c
						: (c = o.img) !== r
						? c
						: a.resolveLooseUp(["img"]);
					e = e.write(i),
						e.data += '_120x120.jpg" alt="';
					var d = (c = t.text) !== r
						? c
						: (c = o.text) !== r
						? c
						: a.resolveLooseUp(["text"]);
					e = e.writeEscaped(d),
						e.data += '"/><span>';
					var v = (c = t.text) !== r
						? c
						: (c = o.text) !== r
						? c
						: a.resolveLooseUp(["text"]);
					return e = e.writeEscaped(v),
						e.data += "</span></a>\n    ",
						e
				}

				function d(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += "\n    ",
						u.line = 28,
						u.line = 28;
					var l = (c = t.xindex) !== r
							? c
							: (c = o.xindex) !== r
							? c
							: a.resolveLooseUp(["xindex"]),
						n = l;
					return n = 2 > l,
						e = E.call(p, a, {
								params: [n],
								fn    : i
							},
							e),
						e.data += "\n    ",
						e
				}

				{
					var c, v, p = this,
						b = p.root,
						m = p.buffer,
						f = p.scope,
						u = (p.runtime, p.name, p.pos),
						h = f.data,
						x = f.affix,
						g = b.nativeCommands,
						k = b.utils,
						L = k.callFn,
						U = (k.callDataFn, k.callCommand, g.range, g["void"], g.foreach, g.forin, g.each),
						w = g["with"],
						E = g["if"],
						y = g.set;
					g.include,
						g.parse,
						g.extend,
						g.block,
						g.macro,
						g["debugger"]
				}
				m.data += "";
				var q = (c = x.head) !== a
						? c
						: (c = h.head) !== a
						? c
						: f.resolveLooseUp(["head"]),
					_ = q;
				if (_) {
					var j = (c = x.head) !== a
						? null != c
						? v = c[0]
						: c
						: (c = h.head) !== a
						? null != c
						? v = c[0]
						: c
						: f.resolveLooseUp(["head", 0]);
					_ = j
				}
				var S;
				S = y.call(p, f, {
						hash: [{
							key  : ["head"],
							value: _,
							depth: 0
						}]
					},
					m);
				var C = S;
				m = m.writeEscaped(C),
					m.data += "\n",
					u.line = 2;
				var F = (c = x.head) !== a
						? c
						: (c = h.head) !== a
						? c
						: f.resolveLooseUp(["head"]),
					I = F;
				if (I) {
					var K = (c = x.head) !== a
						? null != c
						? v = c.bg
						: c
						: (c = h.head) !== a
						? null != c
						? v = c.bg
						: c
						: f.resolveLooseUp(["head", "bg"]);
					I = K
				}
				var N;
				N = y.call(p, f, {
						hash: [{
							key  : ["bg"],
							value: I,
							depth: 0
						}]
					},
					m);
				var Y = N;
				m = m.writeEscaped(Y),
					m.data += "\n",
					u.line = 3;
				var D = (c = x.head) !== a
						? c
						: (c = h.head) !== a
						? c
						: f.resolveLooseUp(["head"]),
					M = D;
				if (M) {
					var A = (c = x.head) !== a
						? null != c
						? v = c.color
						: c
						: (c = h.head) !== a
						? null != c
						? v = c.color
						: c
						: f.resolveLooseUp(["head", "color"]);
					M = A
				}
				var P;
				P = y.call(p, f, {
						hash: [{
							key  : ["color"],
							value: M,
							depth: 0
						}]
					},
					m);
				var T = P;
				m = m.writeEscaped(T),
					m.data += "\n",
					u.line = 4;
				var G = (c = x.banner) !== a
						? c
						: (c = h.banner) !== a
						? c
						: f.resolveLooseUp(["banner"]),
					O = G;
				if (O) {
					var R = (c = x.banner) !== a
						? null != c
						? v = c[0]
						: c
						: (c = h.banner) !== a
						? null != c
						? v = c[0]
						: c
						: f.resolveLooseUp(["banner", 0]);
					O = R
				}
				var z;
				z = y.call(p, f, {
						hash: [{
							key  : ["banner"],
							value: O,
							depth: 0
						}]
					},
					m);
				var B = z;
				m = m.writeEscaped(B),
					m.data += '\n<div data-mid="',
					u.line = 5;
				var H = (c = x.mid) !== a
					? c
					: (c = h.mid) !== a
					? c
					: f.resolveLooseUp(["mid"]);
				m = m.writeEscaped(H),
					m.data += '" data-spm-ab="item-';
				var J = (c = x.spmab) !== a
					? c
					: (c = h.spmab) !== a
					? c
					: f.resolveLooseUp(["spmab"]);
				m = m.writeEscaped(J),
					m.data += '"';
				var Q = (c = x.baseid) !== a
					? c
					: (c = h.baseid) !== a
					? c
					: f.resolveLooseUp(["baseid"]);
				m = E.call(p, f, {
						params: [Q],
						fn    : e
					},
					m),
					m.data += "";
				var V = (c = x.backup) !== a
					? c
					: (c = h.backup) !== a
					? c
					: f.resolveLooseUp(["backup"]);
				m = E.call(p, f, {
						params: [V],
						fn    : r
					},
					m),
					m.data += ' class="blocks-item blocks-thumb3';
				var W = (c = x.bg) !== a
					? c
					: (c = h.bg) !== a
					? c
					: f.resolveLooseUp(["bg"]);
				m = E.call(p, f, {
						params: [W],
						fn    : o
					},
					m),
					m.data += " blocks-item-";
				var X = (c = x.index) !== a
					? c
					: (c = h.index) !== a
					? c
					: f.resolveLooseUp(["index"]);
				m = m.writeEscaped(X),
					m.data += '"';
				var Z = (c = x.bg) !== a
					? c
					: (c = h.bg) !== a
					? c
					: f.resolveLooseUp(["bg"]);
				m = E.call(p, f, {
						params: [Z],
						fn    : t
					},
					m),
					m.data += ">\n  ",
					u.line = 6,
					u.line = 6;
				var $ = (c = x.head) !== a
					? c
					: (c = h.head) !== a
					? c
					: f.resolveLooseUp(["head"]);
				m = w.call(p, f, {
						params: [$],
						fn    : n
					},
					m),
					m.data += '\n  <div class="blocks-contain">\n    ',
					u.line = 23,
					u.line = 23;
				var aa = (c = x.banner) !== a
					? c
					: (c = h.banner) !== a
					? c
					: f.resolveLooseUp(["banner"]);
				m = w.call(p, f, {
						params: [aa],
						fn    : s
					},
					m),
					m.data += "\n    ",
					u.line = 27,
					u.line = 27;
				var ea = (c = x.blockitem) !== a
					? c
					: (c = h.blockitem) !== a
					? c
					: f.resolveLooseUp(["blockitem"]);
				return m = U.call(p, f, {
						params: [ea],
						fn    : d
					},
					m),
					m.data += "\n  </div>\n</div>\n",
					m
			};
			t.TPL_NAME = o.id || o.name
		}),
	KISSY.add("tb-mod/tbh-blocks/0.0.4/thumb4-xtpl",
		function (a, e, r, o) {
			var t = o.exports = function (a) {
				function e(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += ' data-baseid="';
					var l = (d = t.baseid) !== r
						? d
						: (d = o.baseid) !== r
						? d
						: a.resolveLooseUp(["baseid"]);
					return e = e.writeEscaped(l),
						e.data += '"',
						e
				}

				function r(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += ' data-backup="';
					var l = (d = t.backup) !== r
						? d
						: (d = o.backup) !== r
						? d
						: a.resolveLooseUp(["backup"]);
					return e = e.writeEscaped(l),
						e.data += '"',
						e
				}

				function o(a, e, r) {
					a.data,
						a.affix;
					return e.data += " blocks-item-bg",
						e
				}

				function t(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += ' style="background-image:url(';
					var l = (d = t.bg) !== r
						? d
						: (d = o.bg) !== r
						? d
						: a.resolveLooseUp(["bg"]);
					return e = e.write(l),
						e.data += ')"',
						e
				}

				function l(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += '\n      <span class="blocks-qr">\n        <i class="tb-icon">&#xe610;</i>\n        <span>\n          <img src="//g.alicdn.com/s.gif" data-src="',
						f.line = 13;
					var l = (d = t.qr) !== r
						? d
						: (d = o.qr) !== r
						? d
						: a.resolveLooseUp(["qr"]);
					return e = e.write(l),
						e.data += '_100x100.jpg" alt="\u624b\u673a\u6dd8\u5b9d\u626b\u7801"/>\n          <em>\u624b\u673a\u6dd8\u5b9d\u626b\u7801</em>\n        </span>\n      </span>\n      ',
						e
				}

				function n(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += '\n  <div class="block-title">\n    <h3 style="border-bottom-color: ',
						f.line = 7;
					var n = (d = t.color) !== r
						? d
						: (d = o.color) !== r
						? d
						: a.resolveLooseUp(["color"]);
					e = e.writeEscaped(n),
						e.data += '">\n      <a href="',
						f.line = 8;
					var s = (d = t.link) !== r
						? d
						: (d = o.link) !== r
						? d
						: a.resolveLooseUp(["link"]);
					e = e.write(s),
						e.data += '"><img src="//g.alicdn.com/s.gif" data-src="';
					var i = (d = t.img) !== r
						? d
						: (d = o.img) !== r
						? d
						: a.resolveLooseUp(["img"]);
					e = e.write(i),
						e.data += '_220x220.jpg" alt="';
					var c = (d = t.name) !== r
						? d
						: (d = o.name) !== r
						? d
						: a.resolveLooseUp(["name"]);
					e = e.writeEscaped(c),
						e.data += '"/></a>\n      ',
						f.line = 9,
						f.line = 9;
					var p = (d = t.qr) !== r
						? d
						: (d = o.qr) !== r
						? d
						: a.resolveLooseUp(["qr"]);
					return e = U.call(v, a, {
							params: [p],
							fn    : l
						},
						e),
						e.data += "\n    </h3>\n  </div>\n  ",
						e
				}

				function s(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += '\n    <a href="',
						f.line = 24;
					var l = (d = t.link) !== r
						? d
						: (d = o.link) !== r
						? d
						: a.resolveLooseUp(["link"]);
					e = e.write(l),
						e.data += '" class="thumb4-img';
					var n = (d = t.xindex) !== r
							? d
							: (d = o.xindex) !== r
							? d
							: a.resolveLooseUp(["xindex"]),
						s = n;
					s = n + 1,
						e = e.writeEscaped(s),
						e.data += '"><img src="//g.alicdn.com/s.gif" data-src="';
					var i = (d = t.img) !== r
						? d
						: (d = o.img) !== r
						? d
						: a.resolveLooseUp(["img"]);
					e = e.write(i),
						e.data += '_120x120.jpg" alt="';
					var c = (d = t.text) !== r
						? d
						: (d = o.text) !== r
						? d
						: a.resolveLooseUp(["text"]);
					e = e.writeEscaped(c),
						e.data += '"/><span>';
					var v = (d = t.text) !== r
						? d
						: (d = o.text) !== r
						? d
						: a.resolveLooseUp(["text"]);
					return e = e.writeEscaped(v),
						e.data += "</span></a>\n    ",
						e
				}

				function i(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += "\n    ",
						f.line = 23,
						f.line = 23;
					var l = (d = t.xindex) !== r
							? d
							: (d = o.xindex) !== r
							? d
							: a.resolveLooseUp(["xindex"]),
						n = l;
					return n = 4 > l,
						e = U.call(v, a, {
								params: [n],
								fn    : s
							},
							e),
						e.data += "\n    ",
						e
				}

				{
					var d, c, v = this,
						p = v.root,
						b = v.buffer,
						m = v.scope,
						f = (v.runtime, v.name, v.pos),
						u = m.data,
						h = m.affix,
						x = p.nativeCommands,
						g = p.utils,
						k = (g.callFn, g.callDataFn, g.callCommand, x.range, x["void"], x.foreach, x.forin, x.each),
						L = x["with"],
						U = x["if"],
						w = x.set;
					x.include,
						x.parse,
						x.extend,
						x.block,
						x.macro,
						x["debugger"]
				}
				b.data += "";
				var E = (d = h.head) !== a
						? d
						: (d = u.head) !== a
						? d
						: m.resolveLooseUp(["head"]),
					y = E;
				if (y) {
					var q = (d = h.head) !== a
						? null != d
						? c = d[0]
						: d
						: (d = u.head) !== a
						? null != d
						? c = d[0]
						: d
						: m.resolveLooseUp(["head", 0]);
					y = q
				}
				var _;
				_ = w.call(v, m, {
						hash: [{
							key  : ["head"],
							value: y,
							depth: 0
						}]
					},
					b);
				var j = _;
				b = b.writeEscaped(j),
					b.data += "\n",
					f.line = 2;
				var S = (d = h.head) !== a
						? d
						: (d = u.head) !== a
						? d
						: m.resolveLooseUp(["head"]),
					C = S;
				if (C) {
					var F = (d = h.head) !== a
						? null != d
						? c = d.bg
						: d
						: (d = u.head) !== a
						? null != d
						? c = d.bg
						: d
						: m.resolveLooseUp(["head", "bg"]);
					C = F
				}
				var I;
				I = w.call(v, m, {
						hash: [{
							key  : ["bg"],
							value: C,
							depth: 0
						}]
					},
					b);
				var K = I;
				b = b.writeEscaped(K),
					b.data += "\n",
					f.line = 3;
				var N = (d = h.head) !== a
						? d
						: (d = u.head) !== a
						? d
						: m.resolveLooseUp(["head"]),
					Y = N;
				if (Y) {
					var D = (d = h.head) !== a
						? null != d
						? c = d.color
						: d
						: (d = u.head) !== a
						? null != d
						? c = d.color
						: d
						: m.resolveLooseUp(["head", "color"]);
					Y = D
				}
				var M;
				M = w.call(v, m, {
						hash: [{
							key  : ["color"],
							value: Y,
							depth: 0
						}]
					},
					b);
				var A = M;
				b = b.writeEscaped(A),
					b.data += '\n<div data-mid="',
					f.line = 4;
				var P = (d = h.mid) !== a
					? d
					: (d = u.mid) !== a
					? d
					: m.resolveLooseUp(["mid"]);
				b = b.writeEscaped(P),
					b.data += '" data-spm-ab="item-';
				var T = (d = h.spmab) !== a
					? d
					: (d = u.spmab) !== a
					? d
					: m.resolveLooseUp(["spmab"]);
				b = b.writeEscaped(T),
					b.data += '"';
				var G = (d = h.baseid) !== a
					? d
					: (d = u.baseid) !== a
					? d
					: m.resolveLooseUp(["baseid"]);
				b = U.call(v, m, {
						params: [G],
						fn    : e
					},
					b),
					b.data += "";
				var O = (d = h.backup) !== a
					? d
					: (d = u.backup) !== a
					? d
					: m.resolveLooseUp(["backup"]);
				b = U.call(v, m, {
						params: [O],
						fn    : r
					},
					b),
					b.data += ' class="blocks-item blocks-thumb4';
				var R = (d = h.bg) !== a
					? d
					: (d = u.bg) !== a
					? d
					: m.resolveLooseUp(["bg"]);
				b = U.call(v, m, {
						params: [R],
						fn    : o
					},
					b),
					b.data += " blocks-item-";
				var z = (d = h.index) !== a
					? d
					: (d = u.index) !== a
					? d
					: m.resolveLooseUp(["index"]);
				b = b.writeEscaped(z),
					b.data += '"';
				var B = (d = h.bg) !== a
					? d
					: (d = u.bg) !== a
					? d
					: m.resolveLooseUp(["bg"]);
				b = U.call(v, m, {
						params: [B],
						fn    : t
					},
					b),
					b.data += ">\n  ",
					f.line = 5,
					f.line = 5;
				var H = (d = h.head) !== a
					? d
					: (d = u.head) !== a
					? d
					: m.resolveLooseUp(["head"]);
				b = L.call(v, m, {
						params: [H],
						fn    : n
					},
					b),
					b.data += '\n  <div class="blocks-contain">\n    ',
					f.line = 22,
					f.line = 22;
				var J = (d = h.blockitem) !== a
					? d
					: (d = u.blockitem) !== a
					? d
					: m.resolveLooseUp(["blockitem"]);
				return b = k.call(v, m, {
						params: [J],
						fn    : i
					},
					b),
					b.data += "\n  </div>\n</div>\n",
					b
			};
			t.TPL_NAME = o.id || o.name
		}),
	KISSY.add("tb-mod/tbh-blocks/0.0.4/text-xtpl",
		function (a, e, r, o) {
			var t = o.exports = function (a) {
				function e(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += ' data-baseid="';
					var l = (v = t.baseid) !== r
						? v
						: (v = o.baseid) !== r
						? v
						: a.resolveLooseUp(["baseid"]);
					return e = e.writeEscaped(l),
						e.data += '"',
						e
				}

				function r(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += ' data-backup="';
					var l = (v = t.backup) !== r
						? v
						: (v = o.backup) !== r
						? v
						: a.resolveLooseUp(["backup"]);
					return e = e.writeEscaped(l),
						e.data += '"',
						e
				}

				function o(a, e, r) {
					a.data,
						a.affix;
					return e.data += " blocks-item-bg",
						e
				}

				function t(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += ' style="background-image:url(';
					var l = (v = t.bg) !== r
						? v
						: (v = o.bg) !== r
						? v
						: a.resolveLooseUp(["bg"]);
					return e = e.write(l),
						e.data += ')"',
						e
				}

				function l(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += '\n      <span class="blocks-qr">\n        <i class="tb-icon">&#xe610;</i>\n        <span>\n          <img src="//g.alicdn.com/s.gif" data-src="',
						h.line = 13;
					var l = (v = t.qr) !== r
						? v
						: (v = o.qr) !== r
						? v
						: a.resolveLooseUp(["qr"]);
					return e = e.write(l),
						e.data += '_100x100.jpg" alt="\u624b\u673a\u6dd8\u5b9d\u626b\u7801"/>\n          <em>\u624b\u673a\u6dd8\u5b9d\u626b\u7801</em>\n        </span>\n      </span>\n      ',
						e
				}

				function n(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += '\n  <div class="block-title">\n    <h3 style="border-bottom-color: ',
						h.line = 7;
					var n = (v = t.color) !== r
						? v
						: (v = o.color) !== r
						? v
						: a.resolveLooseUp(["color"]);
					e = e.writeEscaped(n),
						e.data += '">\n      <a href="',
						h.line = 8;
					var s = (v = t.link) !== r
						? v
						: (v = o.link) !== r
						? v
						: a.resolveLooseUp(["link"]);
					e = e.write(s),
						e.data += '"><img src="//g.alicdn.com/s.gif" data-src="';
					var i = (v = t.img) !== r
						? v
						: (v = o.img) !== r
						? v
						: a.resolveLooseUp(["img"]);
					e = e.write(i),
						e.data += '_220x220.jpg" alt="';
					var d = (v = t.name) !== r
						? v
						: (v = o.name) !== r
						? v
						: a.resolveLooseUp(["name"]);
					e = e.writeEscaped(d),
						e.data += '"/></a>\n      ',
						h.line = 9,
						h.line = 9;
					var c = (v = t.qr) !== r
						? v
						: (v = o.qr) !== r
						? v
						: a.resolveLooseUp(["qr"]);
					return e = E.call(b, a, {
							params: [c],
							fn    : l
						},
						e),
						e.data += "\n    </h3>\n  </div>\n  ",
						e
				}

				function s(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += '\n    <div class="btext-box">\n      <a href="',
						h.line = 25;
					var l = (v = t.link) !== r
						? v
						: (v = o.link) !== r
						? v
						: a.resolveLooseUp(["link"]);
					e = e.write(l),
						e.data += '"><img src="//g.alicdn.com/s.gif" data-src="';
					var n = (v = t.img) !== r
						? v
						: (v = o.img) !== r
						? v
						: a.resolveLooseUp(["img"]);
					e = e.write(n),
						e.data += '_120x120.jpg" alt="';
					var s = (v = t.name) !== r
						? v
						: (v = o.name) !== r
						? v
						: a.resolveLooseUp(["name"]);
					e = e.writeEscaped(s),
						e.data += '"/>\n        <strong>',
						h.line = 26;
					var i = (v = t.name) !== r
						? v
						: (v = o.name) !== r
						? v
						: a.resolveLooseUp(["name"]);
					e = e.writeEscaped(i),
						e.data += "</strong>\n        <em>",
						h.line = 27;
					var d = (v = t.sub) !== r
						? v
						: (v = o.sub) !== r
						? v
						: a.resolveLooseUp(["sub"]);
					return e = e.writeEscaped(d),
						e.data += "</em>\n      </a>\n    </div>\n    ",
						e
				}

				function i(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += "\n    ",
						h.line = 23,
						h.line = 23;
					var l = (v = t.xindex) !== r
							? v
							: (v = o.xindex) !== r
							? v
							: a.resolveLooseUp(["xindex"]),
						n = l;
					return n = 2 > l,
						e = E.call(b, a, {
								params: [n],
								fn    : s
							},
							e),
						e.data += "\n    ",
						e
				}

				function d(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += '\n    <a href="',
						h.line = 36;
					var l = (v = t.link) !== r
						? v
						: (v = o.link) !== r
						? v
						: a.resolveLooseUp(["link"]);
					e = e.write(l),
						e.data += '">';
					var n = (v = t.text) !== r
						? v
						: (v = o.text) !== r
						? v
						: a.resolveLooseUp(["text"]);
					return e = e.writeEscaped(n),
						e.data += "</a>\n    ",
						e
				}

				function c(a, e, r) {
					var o = a.data,
						t = a.affix;
					e.data += "\n    ",
						h.line = 35,
						h.line = 35;
					var l = (v = t.xindex) !== r
							? v
							: (v = o.xindex) !== r
							? v
							: a.resolveLooseUp(["xindex"]),
						n = l;
					return n = 6 > l,
						e = E.call(b, a, {
								params: [n],
								fn    : d
							},
							e),
						e.data += "\n    ",
						e
				}

				{
					var v, p, b = this,
						m = b.root,
						f = b.buffer,
						u = b.scope,
						h = (b.runtime, b.name, b.pos),
						x = u.data,
						g = u.affix,
						k = m.nativeCommands,
						L = m.utils,
						U = (L.callFn, L.callDataFn, L.callCommand, k.range, k["void"], k.foreach, k.forin, k.each),
						w = k["with"],
						E = k["if"],
						y = k.set;
					k.include,
						k.parse,
						k.extend,
						k.block,
						k.macro,
						k["debugger"]
				}
				f.data += "";
				var q = (v = g.head) !== a
						? v
						: (v = x.head) !== a
						? v
						: u.resolveLooseUp(["head"]),
					_ = q;
				if (_) {
					var j = (v = g.head) !== a
						? null != v
						? p = v[0]
						: v
						: (v = x.head) !== a
						? null != v
						? p = v[0]
						: v
						: u.resolveLooseUp(["head", 0]);
					_ = j
				}
				var S;
				S = y.call(b, u, {
						hash: [{
							key  : ["head"],
							value: _,
							depth: 0
						}]
					},
					f);
				var C = S;
				f = f.writeEscaped(C),
					f.data += "\n",
					h.line = 2;
				var F = (v = g.head) !== a
						? v
						: (v = x.head) !== a
						? v
						: u.resolveLooseUp(["head"]),
					I = F;
				if (I) {
					var K = (v = g.head) !== a
						? null != v
						? p = v.bg
						: v
						: (v = x.head) !== a
						? null != v
						? p = v.bg
						: v
						: u.resolveLooseUp(["head", "bg"]);
					I = K
				}
				var N;
				N = y.call(b, u, {
						hash: [{
							key  : ["bg"],
							value: I,
							depth: 0
						}]
					},
					f);
				var Y = N;
				f = f.writeEscaped(Y),
					f.data += "\n",
					h.line = 3;
				var D = (v = g.head) !== a
						? v
						: (v = x.head) !== a
						? v
						: u.resolveLooseUp(["head"]),
					M = D;
				if (M) {
					var A = (v = g.head) !== a
						? null != v
						? p = v.color
						: v
						: (v = x.head) !== a
						? null != v
						? p = v.color
						: v
						: u.resolveLooseUp(["head", "color"]);
					M = A
				}
				var P;
				P = y.call(b, u, {
						hash: [{
							key  : ["color"],
							value: M,
							depth: 0
						}]
					},
					f);
				var T = P;
				f = f.writeEscaped(T),
					f.data += '\n<div data-mid="',
					h.line = 4;
				var G = (v = g.mid) !== a
					? v
					: (v = x.mid) !== a
					? v
					: u.resolveLooseUp(["mid"]);
				f = f.writeEscaped(G),
					f.data += '" data-spm-ab="item-';
				var O = (v = g.spmab) !== a
					? v
					: (v = x.spmab) !== a
					? v
					: u.resolveLooseUp(["spmab"]);
				f = f.writeEscaped(O),
					f.data += '"';
				var R = (v = g.baseid) !== a
					? v
					: (v = x.baseid) !== a
					? v
					: u.resolveLooseUp(["baseid"]);
				f = E.call(b, u, {
						params: [R],
						fn    : e
					},
					f),
					f.data += "";
				var z = (v = g.backup) !== a
					? v
					: (v = x.backup) !== a
					? v
					: u.resolveLooseUp(["backup"]);
				f = E.call(b, u, {
						params: [z],
						fn    : r
					},
					f),
					f.data += ' class="blocks-item blocks-text';
				var B = (v = g.bg) !== a
					? v
					: (v = x.bg) !== a
					? v
					: u.resolveLooseUp(["bg"]);
				f = E.call(b, u, {
						params: [B],
						fn    : o
					},
					f),
					f.data += " blocks-item-";
				var H = (v = g.index) !== a
					? v
					: (v = x.index) !== a
					? v
					: u.resolveLooseUp(["index"]);
				f = f.writeEscaped(H),
					f.data += '"';
				var J = (v = g.bg) !== a
					? v
					: (v = x.bg) !== a
					? v
					: u.resolveLooseUp(["bg"]);
				f = E.call(b, u, {
						params: [J],
						fn    : t
					},
					f),
					f.data += ">\n  ",
					h.line = 5,
					h.line = 5;
				var Q = (v = g.head) !== a
					? v
					: (v = x.head) !== a
					? v
					: u.resolveLooseUp(["head"]);
				f = w.call(b, u, {
						params: [Q],
						fn    : n
					},
					f),
					f.data += '\n  <div class="blocks-contain">\n    ',
					h.line = 22,
					h.line = 22;
				var V = (v = g.blockitem) !== a
					? v
					: (v = x.blockitem) !== a
					? v
					: u.resolveLooseUp(["blockitem"]);
				f = U.call(b, u, {
						params: [V],
						fn    : i
					},
					f),
					f.data += '\n  </div>\n  <div class="blocks-links">\n    ',
					h.line = 34,
					h.line = 34;
				var W = (v = g.blocklinks) !== a
					? v
					: (v = x.blocklinks) !== a
					? v
					: u.resolveLooseUp(["blocklinks"]);
				return f = U.call(b, u, {
						params: [W],
						fn    : c
					},
					f),
					f.data += "\n  </div>\n</div>\n",
					f
			};
			t.TPL_NAME = o.id || o.name
		}),
	KISSY.add("tb-mod/tbh-blocks/0.0.4/index", ["webp", "node", "personality", "./thumbtext-xtpl", "./thumb3-xtpl", "./thumb4-xtpl", "./text-xtpl"],
		function (a, e) {
			function r(a) {
				this.init(a)
			}

			var o = e("webp"),
				t = e("node"),
				l = e("personality"),
				n = e("./thumbtext-xtpl"),
				s = e("./thumb3-xtpl"),
				i = e("./thumb4-xtpl"),
				d = e("./text-xtpl");
			return r.prototype.init = function (a) {
				new l({
					box           : a,
					contain       : ".blocks",
					appids        : [2804, 2805, 2806],
					xtplFun       : [d, n, s, i],
					renderCallback: this.render,
					bindCallback  : this.bind
				})
			},
				r.prototype.render = function (a, e) {
					var r = e.pData.recItemList;
					KISSY.each(a.blockitem,
						function (e, o) {
							r[o] && r[o].picUrl && r[o].clickUrl && (a.blockitem[o].img = r[o].picUrl, a.blockitem[o].link = r[o].clickUrl)
						})
				},
				r.prototype.bind = function (a, e) {
					a.el.one(".blocks-bd")
					 .html(e),
						o(a.el.all("h3 a img, .blocks-contain img"), null, "IGNORE"),
						a.el.all(".blocks-qr")
						 .on("mouseenter",
							 function () {
								 var a = t.one(this);
								 "1" != a.attr("loaded") && (o(a.one("img"), null, "IGNORE"), a.attr("loaded", "1"))
							 }),
						a.el.fire("M:load")
				},
				r
		});
KISSY.add("tb-mod/tbh-blocks-sh/0.0.12/item-xtpl",
	function (a, e, n, o) {
		var i = o.exports = function (a) {
			function e(a, e, n) {
				var o = a.data,
					i = a.affix;
				e.data += ' data-baseid="';
				var l = (s = i.baseid) !== n
					? s
					: (s = o.baseid) !== n
					? s
					: a.resolveLooseUp(["baseid"]);
				return e = e.writeEscaped(l),
					e.data += '"',
					e
			}

			function n(a, e, n) {
				var o = a.data,
					i = a.affix;
				e.data += ' data-backup="';
				var l = (s = i.backup) !== n
					? s
					: (s = o.backup) !== n
					? s
					: a.resolveLooseUp(["backup"]);
				return e = e.writeEscaped(l),
					e.data += '"',
					e
			}

			function o(a, e, n) {
				var o = a.data,
					i = a.affix;
				e.data += '\n      <span class="blocksh-qr">\n        <i class="tb-icon">&#xe610;</i>\n        <span>\n          <img src="//g.alicdn.com/s.gif" data-src="',
					v.line = 15;
				var l = (s = i.qr) !== n
					? s
					: (s = o.qr) !== n
					? s
					: a.resolveLooseUp(["qr"]);
				return e = e.write(l),
					e.data += '_100x100.jpg" alt="\u624b\u673a\u6dd8\u5b9d\u626b\u7801"/>\n          <em>\u624b\u673a\u6dd8\u5b9d\u626b\u7801</em>\n        </span>\n      </span>\n      ',
					e
			}

			function i(a, e, n) {
				var i = a.data,
					l = a.affix;
				e.data += '\n  <div class="blocksh-title">\n    <h3>\n      <a href="',
					v.line = 10;
				var r = (s = l.link) !== n
					? s
					: (s = i.link) !== n
					? s
					: a.resolveLooseUp(["link"]);
				e = e.write(r),
					e.data += '"><img src="//g.alicdn.com/s.gif" data-src="';
				var t = (s = l.img) !== n
					? s
					: (s = i.img) !== n
					? s
					: a.resolveLooseUp(["img"]);
				e = e.write(t),
					e.data += '_110x110.jpg" alt="';
				var c = (s = l.name) !== n
					? s
					: (s = i.name) !== n
					? s
					: a.resolveLooseUp(["name"]);
				e = e.writeEscaped(c),
					e.data += '"/></a>\n      ',
					v.line = 11,
					v.line = 11;
				var p = (s = l.qr) !== n
					? s
					: (s = i.qr) !== n
					? s
					: a.resolveLooseUp(["qr"]);
				return e = U.call(d, a, {
						params: [p],
						fn    : o
					},
					e),
					e.data += "\n    </h3>\n  </div>\n  ",
					e
			}

			function l(a, e, n) {
				var o = a.data,
					i = a.affix;
				e.data += '\n  <div class="start-time">',
					v.line = 25;
				var l = (s = i.info) !== n
					? null != s
					? t = s.startTimeDesc
					: s
					: (s = o.info) !== n
					? null != s
					? t = s.startTimeDesc
					: s
					: a.resolveLooseUp(["info", "startTimeDesc"]);
				e = e.writeEscaped(l),
					e.data += '</div>\n  <div class="bsh-contain render-per" data-name="',
					v.line = 26;
				var r = (s = i.name) !== n
					? s
					: (s = o.name) !== n
					? s
					: a.resolveLooseUp(["name"]);
				e = e.writeEscaped(r),
					e.data += '">\n    <a href="',
					v.line = 27;
				var d = (s = i.info) !== n
					? null != s
					? t = s.link
					: s
					: (s = o.info) !== n
					? null != s
					? t = s.link
					: s
					: a.resolveLooseUp(["info", "link"]);
				e = e.write(d),
					e.data += '"><img src="//g.alicdn.com/s.gif" data-src="';
				var c = (s = i.info) !== n
					? null != s
					? t = s.img
					: s
					: (s = o.info) !== n
					? null != s
					? t = s.img
					: s
					: a.resolveLooseUp(["info", "img"]);
				e = e.write(c),
					e.data += '_120x120.jpg" alt="';
				var p = (s = i.info) !== n
					? null != s
					? t = s.name
					: s
					: (s = o.info) !== n
					? null != s
					? t = s.name
					: s
					: a.resolveLooseUp(["info", "name"]);
				e = e.writeEscaped(p),
					e.data += '"/></a>\n    <a class="name-link" href="',
					v.line = 28;
				var f = (s = i.info) !== n
					? null != s
					? t = s.link
					: s
					: (s = o.info) !== n
					? null != s
					? t = s.link
					: s
					: a.resolveLooseUp(["info", "link"]);
				e = e.write(f),
					e.data += '">\n      <h4>',
					v.line = 29;
				var m = (s = i.info) !== n
					? null != s
					? t = s.itemName
					: s
					: (s = o.info) !== n
					? null != s
					? t = s.itemName
					: s
					: a.resolveLooseUp(["info", "itemName"]);
				e = e.writeEscaped(m),
					e.data += '</h4>\n    </a>\n    <span class="price"><span>&yen;</span>',
					v.line = 31;
				var u = (s = i.info) !== n
					? null != s
					? t = s.actPrice
					: s
					: (s = o.info) !== n
					? null != s
					? t = s.actPrice
					: s
					: a.resolveLooseUp(["info", "actPrice"]);
				e = e.writeEscaped(u),
					e.data += '</span>\n    <span class="sold-count">\u5df2\u62a2\u8d2d',
					v.line = 32;
				var h = (s = i.info) !== n
					? null != s
					? t = s.soldCount
					: s
					: (s = o.info) !== n
					? null != s
					? t = s.soldCount
					: s
					: a.resolveLooseUp(["info", "soldCount"]);
				return e = e.writeEscaped(h),
					e.data += "\u4ef6</span>\n  </div>\n  ",
					e
			}

			function r(a, e, n) {
				var o = a.data,
					i = a.affix;
				e.data += '\n  <div class="bsh-contain" data-name="',
					v.line = 35;
				var l = (s = i.name) !== n
					? s
					: (s = o.name) !== n
					? s
					: a.resolveLooseUp(["name"]);
				e = e.writeEscaped(l),
					e.data += '">\n    <a href="',
					v.line = 36;
				var r = (s = i.info) !== n
					? null != s
					? t = s.link
					: s
					: (s = o.info) !== n
					? null != s
					? t = s.link
					: s
					: a.resolveLooseUp(["info", "link"]);
				e = e.write(r),
					e.data += '"><img src="//g.alicdn.com/s.gif" data-src="';
				var d = (s = i.info) !== n
					? null != s
					? t = s.img
					: s
					: (s = o.info) !== n
					? null != s
					? t = s.img
					: s
					: a.resolveLooseUp(["info", "img"]);
				e = e.write(d),
					e.data += '_120x120.jpg" alt="';
				var c = (s = i.info) !== n
					? null != s
					? t = s.name
					: s
					: (s = o.info) !== n
					? null != s
					? t = s.name
					: s
					: a.resolveLooseUp(["info", "name"]);
				e = e.writeEscaped(c),
					e.data += '"/></a>\n    <span>',
					v.line = 37;
				var p = (s = i.info) !== n
					? null != s
					? t = s.name
					: s
					: (s = o.info) !== n
					? null != s
					? t = s.name
					: s
					: a.resolveLooseUp(["info", "name"]);
				e = e.writeEscaped(p),
					e.data += "</span>\n    <em>",
					v.line = 38;
				var f = (s = i.info) !== n
					? null != s
					? t = s.sub
					: s
					: (s = o.info) !== n
					? null != s
					? t = s.sub
					: s
					: a.resolveLooseUp(["info", "sub"]);
				e = e.writeEscaped(f),
					e.data += '</em>\n    <a href="',
					v.line = 39;
				var m = (s = i.info) !== n
					? null != s
					? t = s.link
					: s
					: (s = o.info) !== n
					? null != s
					? t = s.link
					: s
					: a.resolveLooseUp(["info", "link"]);
				e = e.write(m),
					e.data += '" class="bsh-btn" style="border-color:';
				var u = (s = i.head) !== n
					? null != s
					? t = s.color
					: s
					: (s = o.head) !== n
					? null != s
					? t = s.color
					: s
					: a.resolveLooseUp(["head", "color"]);
				e = e.writeEscaped(u),
					e.data += ";color:";
				var h = (s = i.head) !== n
					? null != s
					? t = s.color
					: s
					: (s = o.head) !== n
					? null != s
					? t = s.color
					: s
					: a.resolveLooseUp(["head", "color"]);
				e = e.writeEscaped(h),
					e.data += ';">';
				var b = (s = i.info) !== n
					? null != s
					? t = s.tag
					: s
					: (s = o.info) !== n
					? null != s
					? t = s.tag
					: s
					: a.resolveLooseUp(["info", "tag"]);
				return e = e.writeEscaped(b),
					e.data += "</a>\n  </div>\n  ",
					e
			}

			{
				var s, t, d = this,
					c = d.root,
					p = d.buffer,
					f = d.scope,
					v = (d.runtime, d.name, d.pos),
					m = f.data,
					u = f.affix,
					h = c.nativeCommands,
					b = c.utils,
					k = (b.callFn, b.callDataFn, b.callCommand, h.range, h["void"], h.foreach, h.forin, h.each, h["with"]),
					U = h["if"],
					L = h.set;
				h.include,
					h.parse,
					h.extend,
					h.block,
					h.macro,
					h["debugger"]
			}
			p.data += "";
			var g = (s = u.head) !== a
					? s
					: (s = m.head) !== a
					? s
					: f.resolveLooseUp(["head"]),
				w = g;
			if (w) {
				var E = (s = u.head) !== a
					? null != s
					? t = s[0]
					: s
					: (s = m.head) !== a
					? null != s
					? t = s[0]
					: s
					: f.resolveLooseUp(["head", 0]);
				w = E
			}
			var x;
			x = L.call(d, f, {
					hash: [{
						key  : ["head"],
						value: w,
						depth: 0
					}]
				},
				p);
			var y = x;
			p = p.writeEscaped(y),
				p.data += "\n",
				v.line = 2;
			var C = (s = u.head) !== a
					? s
					: (s = m.head) !== a
					? s
					: f.resolveLooseUp(["head"]),
				P = C;
			if (P) {
				var q = (s = u.head) !== a
					? null != s
					? t = s.color
					: s
					: (s = m.head) !== a
					? null != s
					? t = s.color
					: s
					: f.resolveLooseUp(["head", "color"]);
				P = q
			}
			var D;
			D = L.call(d, f, {
					hash: [{
						key  : ["color"],
						value: P,
						depth: 0
					}]
				},
				p);
			var N = D;
			p = p.writeEscaped(N),
				p.data += '\n<div data-mid="',
				v.line = 3;
			var T = (s = u.mid) !== a
				? s
				: (s = m.mid) !== a
				? s
				: f.resolveLooseUp(["mid"]);
			p = p.writeEscaped(T),
				p.data += '" data-spm-ab="item-';
			var _ = (s = u.spmab) !== a
				? s
				: (s = m.spmab) !== a
				? s
				: f.resolveLooseUp(["spmab"]);
			p = p.writeEscaped(_),
				p.data += '"\n  ',
				v.line = 4;
			var j = (s = u.baseid) !== a
				? s
				: (s = m.baseid) !== a
				? s
				: f.resolveLooseUp(["baseid"]);
			p = U.call(d, f, {
					params: [j],
					fn    : e
				},
				p),
				p.data += "\n  ",
				v.line = 5;
			var I = (s = u.backup) !== a
				? s
				: (s = m.backup) !== a
				? s
				: f.resolveLooseUp(["backup"]);
			p = U.call(d, f, {
					params: [I],
					fn    : n
				},
				p),
				p.data += '\n  class="blocksh-item blocksh-item-',
				v.line = 6;
			var S = (s = u.index) !== a
				? s
				: (s = m.index) !== a
				? s
				: f.resolveLooseUp(["index"]);
			p = p.writeEscaped(S),
				p.data += '">\n  ',
				v.line = 7,
				v.line = 7;
			var F = (s = u.head) !== a
				? s
				: (s = m.head) !== a
				? s
				: f.resolveLooseUp(["head"]);
			p = k.call(d, f, {
					params: [F],
					fn    : i
				},
				p),
				p.data += "\n  ",
				v.line = 23;
			var K = (s = u.info) !== a
					? s
					: (s = m.info) !== a
					? s
					: f.resolveLooseUp(["info"]),
				M = K;
			if (M) {
				var Y = (s = u.info) !== a
					? null != s
					? t = s[0]
					: s
					: (s = m.info) !== a
					? null != s
					? t = s[0]
					: s
					: f.resolveLooseUp(["info", 0]);
				M = Y
			}
			var A;
			A = L.call(d, f, {
					hash: [{
						key  : ["info"],
						value: M,
						depth: 0
					}]
				},
				p);
			var G = A;
			p = p.writeEscaped(G),
				p.data += "\n  ",
				v.line = 24,
				v.line = 24;
			var O = (s = u.info) !== a
				? null != s
				? t = s.renderPer
				: s
				: (s = m.info) !== a
				? null != s
				? t = s.renderPer
				: s
				: f.resolveLooseUp(["info", "renderPer"]);
			return p = U.call(d, f, {
					params : [O],
					fn     : l,
					inverse: r
				},
				p),
				p.data += "\n</div>\n",
				p
		};
		i.TPL_NAME = o.id || o.name
	}),
	KISSY.add("tb-mod/tbh-blocks-sh/0.0.12/index", ["io", "webp", "node", "./item-xtpl", "personality"],
		function (a, e) {
			function n(a) {
				this.init(a)
			}

			var o = (e("io"), e("webp")),
				i = e("node"),
				l = e("./item-xtpl"),
				r = e("personality");
			return n.prototype.init = function (a) {
				new r({
					box           : a,
					contain       : ".blocksh",
					appids        : 2803,
					xtplFun       : l,
					renderCallback: this.render,
					bindCallback  : this.bind
				})
			},
				n.prototype.render = function (a, e) {
					var n = e.pData.recItemList,
						o = "false" === a.info[0].inter || a.info[0].inter === !1;
					n && n[0] && n[0].picUrl && n[0].clickUrl && o && (a.info[0].img = n[0].picUrl, a.info[0].link = n[0].clickUrl);
					var i = "true" === e.perLayout || 1 === e.perLayout || e.perLayout === !0;
					if (i && o && n && n[0]) {
						var l = n[0];
						l.picUrl && l.clickUrl && l.startTimeDesc && l.actPrice && l.soldCount && l.itemName && (a.info[0].img = l.picUrl, a.info[0].link = l.clickUrl, a.info[0].itemName = l.itemName, a.info[0].startTimeDesc = l.startTimeDesc, a.info[0].actPrice = l.actPrice, a.info[0].soldCount = l.soldCount, a.info[0].renderPer = !0)
					}
				},
				n.prototype.bind = function (a, e) {
					a.el.one(".blocksh-bd")
					 .html(e);
					var n = a.el.all(".blocksh-item")
							 .item(0),
						l = a.el.all(".blocksh-item")
							 .item(4);
					i.one(n)
					 .addClass("blocksh-stretch"),
						i.one(l)
						 .addClass("blocksh-stretch"),
						o(a.el.all("h3 a img, .bsh-contain img"), null, "IGNORE"),
						a.el.all(".blocksh-qr")
						 .on("mouseenter",
							 function () {
								 var a = i.one(this);
								 "1" != a.attr("loaded") && (o(a.one("img")), a.attr("loaded", "1"))
							 }),
						a.el.fire("M:load")
				},
				n
		});
KISSY.add("tb-mod/tbh-ald/0.0.1/index", ["node", "aladdin"],
	function (n, d) {
		var a = d("node"),
			o = d("aladdin"),
			e = function (n) {
				new o(n,
					function () {
						a.one(n)
						 .fire("M:load")
					})
			};
		return e
	});