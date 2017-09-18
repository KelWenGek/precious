(function (a, b, c) {
    function isPlainObject(a) {
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

        if (!c && isPlainObject(a)) {
            c = a;
            a = c.element;
        }
        c = c || {};
        a.nodeType != b.nodeType && "string" == typeof a && (a = b.querySelector(a));
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
                //tab条固定位置的3种方式
                v = c._scrollHandler = setHandlerTimeout(function () {
                        var b = a.pageYOffset;
                        if (q > b) {
                            if (1 != u) {
                                i.cssText = p;
                                n && (n.style.display = "none");
                                u = 1;
                            }
                        } else {
                            if (!o && b >= q || o && b >= q && r > b && 2 != u) {
                                i.cssText = s;
                                n && 3 != u && (n.style.display = "block");
                                u = 2;
                            } else if (o && 3 != u) {
                                i.cssText = t;
                                n && 2 != u && (n.style.display = "block");
                                u = 3
                            }
                        }
                    },
                    100);

            a.addEventListener("scroll", v, !1);

            //往上滚动window时,发布scroll事件,即通过setHandlerTimeout构造出来的事件定时器进行实时触发_scrollHandler,并消除时间误差
            if (a.pageYOffset >= q) {
                var w = b.createEvent("HTMLEvents");
                w.initEvent("scroll", !0, !0);
                a.dispatchEvent(w);
            }
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