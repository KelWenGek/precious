(function (lib) {
	function getMinScrollLeft(a) {
		return 0 - (a.bounceLeft || 0)
	}

	function getMaxScrollLeft(a) {
		var b = a.getBoundingClientRect(),
			d = a.parentNode.getBoundingClientRect(),
			e = getMinScrollLeft(a),
			f = 0 - b.width + d.width;
		return Math.min(f + (a.bounceRight || 0), e)
	}


	function checkOverBoundaryX(a, b) {
		return b > a.minScrollLeft ? b - a.minScrollLeft : b < a.maxScrollLeft ? a.maxScrollLeft - b : void 0
	}



	function getBoundaryX(a, b) {
		b > a.minScrollLeft ? b = a.minScrollLeft : b < a.maxScrollLeft && (b = a.maxScrollLeft);
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

				console.log(c);
				r.style.webkitBackfaceVisibility = "hidden";
				r.style.webkitTransformStyle = "preserve-3d";
				r.style.webkitTransition = "";
				r.style.webkitTransform = w.makeTranslateString(c.x, c.y);
			}
		}
		return false;
	}

//滑动事件开始处理器
	function panStartHandler() {
		if (!stopBounce && r) {

			r.transformOffset = w.getTransformOffset(r);

			console.log(r.transformOffset);

			r.minScrollLeft = getMinScrollLeft(r);
			r.maxScrollLeft = getMaxScrollLeft(r);
			x = 2.5;
			stopBounce = !1;
			y = !1;
			dispatchCustomEvent(r, "scrollstart");
		}
		return false;
	}

	function touchMoveHandler(a){
		a.stopPropagation();
		a.preventDefault();
		return !1;
	}


//触摸结束,不做任何事情
	function touchEndHandler() {
		return false;
	}

//触摸滚动事件处理器
	function panMoveHandlerX(a) {
		a.stopPropagation();
		if (!stopBounce && r) {

			console.log(r.transformOffset.y);
			var b = r.transformOffset.x + a.displacementX;


			if (b > r.minScrollLeft) {

				b = r.minScrollLeft + (b - r.minScrollLeft) / x;
				x *= 1.003;
				x > 4 && (x = 4);

			} else if (b < r.maxScrollLeft) {
				b = r.maxScrollLeft - (r.maxScrollLeft - b) / x;
				x *= 1.003;
				x > 4 && (x = 4);
			}

			if (checkOverBoundaryX(r, b)) {
				if (b > r.minScrollLeft) {
					var c = "pullright",
						d = Math.abs(b - r.minScrollLeft);
				}
				else if (b < r.maxScrollLeft) {
					c = "pullleft";
					d = Math.abs(r.maxScrollLeft - b);
				}
				r.bounceOffset = d;
				dispatchCustomEvent(r, c);
			}
			r.style.webkitTransition = "";
			r.style.webkitTransform = w.makeTranslateString(b, r.transformOffset.y);
		}
		return false;
	}

	//垂直方向上的pan事件处理器
	function panMoveHandlerY(a){
		a.stopPropagation();
		a.preventDefault();
		return !1;
	}

//触摸滚动结束后判断是否超出上下边界的事件处理器
	function panEndHandlerX() {
		if (!stopBounce && r) {
			var a = w.getTransformOffset(r).x;
			checkOverBoundaryX(r, a) ? bounceMoveX() : bounceEnd();
		}
		return false;
	}


//回弹过程开始
	function bounceStartX(a) {
		if (!stopBounce && r) {
			var b = w.getTransformOffset(r).x,
				c = .008 * (a / Math.abs(a)),
				t = a / c,
				s = b + t * a / 2;
			dispatchCustomEvent(r, "bounceStartX");
			w.translate(r, t.toFixed(0) + "ms", "cubic-bezier(" + w.genCubicBezier(-t, 0) + ")", "0s", s.toFixed(0), r.transformOffset.y, bounceMoveX);
		}
	}


//回弹过程中
	function bounceMoveX() {
		if (!stopBounce && r) {
			var a = w.getTransformOffset(r).x;
			a = getBoundaryX(r, a); //左右边界值
			w.translate(r, "0.4s", "ease-in-out", "0s",a, r.transformOffset.y,
				function () {
					dispatchCustomEvent(r, "bounceMoveX");
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


//滑动过程中,元素被拉离边界时处理器
	function flickHandlerX(a) {
		if (!stopBounce && r) {
			var b, c, d, e, f, g, h, i = w.getTransformOffset(r).x;
			y = !0;
			if (i > r.minScrollLeft || i < r.maxScrollLeft) {
				bounceStartX(b);
			} else {
				b = a.velocityX;
				b > 1.5 && (b = 1.5);
				-1.5 > b && (b = -1.5);
				c = .0015 * (b / Math.abs(b));
				d = b / c;
				e = i + d * b / 2;
				if (e > r.minScrollLeft) {

					g = r.minScrollLeft - i;
					h = (b - Math.sqrt(-2 * c * g + b * b)) / c;
					f = b - c * h;
					w.translate(r, h.toFixed(0) + "ms", "cubic-bezier(" + w.genCubicBezier(-d, -d + h) + ")", "0s", r.minScrollLeft, r.transformOffset.y,
						function () {
							bounceStartX(f);
						});

				} else if (e < r.maxScrollLeft) {
					g = r.maxScrollLeft - i;
					h = (b + Math.sqrt(-2 * c * g + b * b)) / c;
					f = b - c * h;
					w.translate(r, h.toFixed(0) + "ms", "cubic-bezier(" + w.genCubicBezier(-d, -d + h) + ")", "0s", r.maxScrollLeft, r.transformOffset.y,
						function () {
							bounceStartX(f);
						});
				} else {

					w.translate(r, d.toFixed(0) + "ms", "cubic-bezier(" + w.genCubicBezier(-d, 0) + ")", "0s", e.toFixed(0), r.transformOffset.y, bounceEnd);

				}
			}
		}
		return false;
	}


	var r, u = window.document,
		v = u.documentElement, //html根元素
		w = window.lib.Animation,
		x = 2,
		y = !1,
		stopBounce = !1,
		prevented = !1;
	var scrollH = {

		//开启滚动
		//参数b用于设置上下回弹间距
		enable : function (a, b) {

			var c = a.parentNode || a.offsetParent;

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
				c.addEventListener("horizontalpan", panMoveHandlerX, !1);
				c.addEventListener("verticalpan", panMoveHandlerY, !1);
				c.addEventListener("panend", panEndHandlerX, !1);
				c.addEventListener("flick", flickHandlerX, !1);
			}

			//绑定滚动目标
			c.boundScrollElement = a;

			if (b) {
				a.bounceLeft = b.bounceLeft;
				a.bounceRight = b.bounceRight;
			}
			else {
				a.bounceLeft = 0;
				a.bounceRight = 0;
			}
			//初始化变换
			var d = w.getTransformOffset(a).y,
				e = -a.bounceLeft;
			a.style.webkitTransition = "";
			a.style.webkitTransform = w.makeTranslateString(e, d);
			//刷新
			this.refreshX(a);
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
		},

		//获取可滚动高度
		getScrollWidth: function (a) {
			return a.getBoundingClientRect().width - (a.bounceLeft || 0) - (a.bounceRight || 0);
		},
		//获取当前滚动位置
		getScrollLeft   : function (a) {
			var b = w.getTransformOffset(a);
			return -(b.x + (a.bounceLeft || 0));
		},
		refreshX        : function (a) {
			//a.style.height = "auto";
			a.style.height = a.offsetHeight + "px";
			a.style.width = a.offsetWidth + "px";

			//获取当前变换
			a.offset = w.getTransformOffset(a);

			//最小滚动高度
			a.minScrollLeft = getMinScrollLeft(a);

			//最大滚动高度
			a.maxScrollLeft = getMaxScrollLeft(a);

			//回到容器顶部
			this.scrollTo(a, -a.offset.x - a.bounceLeft);
		},
		scrollTo       : function (a, b) {
			var c = w.getTransformOffset(a).y;
			//此处计算出来的b为元素当前变换的y值 向上滚动时为负数
			b = -b - (a.bounceLeft || 0);
			b = getBoundaryX(a, b);
			a.style.webkitTransition = "";
			a.style.webkitTransform = w.makeTranslateString(b, c);
		},
		offset         : function (a, b) {
			var c = a.getBoundingClientRect(),
				d = b.getBoundingClientRect(),
				e = {
					top   : d.top - ((a.bounceLeft || 0) + c.top),
					left  : d.left - c.left,
					right : c.right - d.right,
					width : d.width,
					height: d.height
				};
			e.bottom = e.top + d.height;
			return e;
		},

		scrollToElementX  : function (a, b) {
			var c = this.offset(a, b);
			this.scrollTo(a, c.left);
		},
		getViewWidth    : function (a) {
			return a.parentNode.getBoundingClientRect().width;
		},
		getBoundaryXOffset: function (a) {
			var b = w.getTransformOffset(a).x;
			return checkOverBoundaryX(a, b);
		},
		stopBounceX       : function (a) {
			stopBounce = !0;
			var b = w.getTransformOffset(a),
				e = getMinScrollLeft(a),
				f = getMaxScrollLeft(a),
				g = null;

			if (b.x > e + (a.bounceLeft || 0)) {
				g = e + (a.bounceLeft || 0);


			} else if (b.x < f - (a.bounceRight || 0)) {

				g = f - (a.bounceRight || 0);

			}

			null != g && w.translate(a, "0.4s", "ease-in-out", "0s", g, b.y);
		},
		resumeBounceX     : function (a) {
			stopBounce = !1;
			var b, e = w.getTransformOffset(a),
				f = getMinScrollLeft(a),
				g = getMaxScrollLeft(a);

			if (e.x > f) {
				b = f;

			} else if (g > e) {

				b = g;
			}

			null != b && w.translate(a, "0.4s", "ease-in-out", "0s", b, e.y);
		}
	};
	lib.ScrollH = scrollH;
}(window.lib || (window.lib = {})));