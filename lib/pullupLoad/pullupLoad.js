!function ($, util) {
    "use strict";
    function getTouches(a) {
        a.touches || (a.touches = a.originalEvent.touches);
    }


    function setTransition(a, b) {
        a.css({"-webkit-transition": "all " + b + "ms", transition: "all " + b + "ms"});
    }


    $.fn.pullUpLoad = function (options) {
        return new PullUpLoad(this, options);
    };


    var PullUpLoad = function ($el, options) {

        this.$element = $el;
        this.upInsertDOM = !1;
        this.loading = !1;
        this.isLockUp = !1;
        this.isLockDown = !1;
        this.isData = !0;
        this._scrollTop = 0;
        this._threshold = 0;
        this.init(options);
    };


    PullUpLoad.prototype = {

        init: function (options) {
            var self = this;
            this.opts = $.extend(!0, {}, {
                scrollArea: self.$element,
                domUp: {
                    domClass: "dropload-up",
                    domRefresh: '<div class="dropload-refresh">↓下拉刷新</div>',
                    domUpdate: '<div class="dropload-update">↑释放更新</div>',
                    domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
                },
                domDown: {
                    domClass: "dropload-down",
                    domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                    domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                    domNoData: '<div class="dropload-noData">已经到底</div>'
                },
                autoLoad: !0,
                distance: 50,
                threshold: "",
                loadUpFn: "",
                loadDownFn: ""
            }, options);

            if ("" != this.opts.loadDownFn) {
                this.$element.append('<div class="' + this.opts.domDown.domClass + '">' + this.opts.domDown.domRefresh + "</div>");
                this.$domDown = this.$element.find("." + this.opts.domDown.domClass);
            }


            this._threshold = this.$domDown && "" === this.opts.threshold
                ? Math.floor(1 * this.$domDown.height() / 3)
                : this.opts.threshold;

            if (this.opts.scrollArea == window) {

                this.$scrollArea = $(window);
                this._scrollContentHeight = $(document)
                    .height();
                this._scrollWindowHeight = document.documentElement.clientHeight;

            } else {

                this.$scrollArea = this.opts.scrollArea;
                this._scrollContentHeight = this.$element[0].scrollHeight;
                this._scrollWindowHeight = this.$element.height();

            }
            this.trigger();
            $(window)
                .on("resize", function () {
                    self._scrollWindowHeight = self.opts.scrollArea == window
                        ? window.innerHeight
                        : self.$element.height()
                });
            this.$element.on("touchstart", function (a) {

                if (!self.loading) {
                    getTouches(a);
                    self.setScrollY(a);
                }
            });
            this.$element.on("touchmove", function (a) {

                if (!self.loading) {
                    getTouches(a);
                    self.setDomUpTip(a);
                }
            });
            this.$element.on("touchend", function () {
                self.loading || self.resetDomUpTip();
            });
            this.$scrollArea.on("scroll", function () {
                self._scrollTop = self.$scrollArea.scrollTop();
                "" != self.opts.loadDownFn && !self.loading && !self.isLockDown &&
                self._scrollContentHeight - self._threshold <= self._scrollWindowHeight + self._scrollTop && self.load();
            })
        },


        lock: function (a) {

            void 0 === a
                ? "up" == this.direction
                ? this.isLockDown = !0
                : "down" == this.direction
                ? this.isLockUp = !0
                : (this.isLockUp = !0, this.isLockDown = !0)
                : "up" == a
                ? this.isLockUp = !0
                : "down" == a && (this.isLockDown = !0, this.direction = "up");
        },
        unlock: function () {

            this.isLockUp = !1;
            this.isLockDown = !1;
            this.direction = "up";
        },
        done: function (a) {

            void 0 === a || 1 == a
                ? this.isData = !1
                : 0 == a && (this.isData = !0);
        },
        reset: function () {
            var self = this;
            if ("down" == this.direction && this.upInsertDOM) {
                this.$domUp.css({height: "0"})
                    .on("webkitTransitionEnd mozTransitionEnd transitionend", function () {
                        self.loading = !1;
                        self.upInsertDOM = !1;
                        $(this)
                            .remove();
                        self.resetContainerHeight();
                    });
            } else if ("up" == this.direction) {
                this.loading = !1;
                if (this.isData) {
                    this.$domDown.html(this.opts.domDown.domRefresh);
                    this.resetContainerHeight();
                    this.trigger();
                } else {
                    this.$domDown.html(this.opts.domDown.domNoData);
                }
            }
        },
        trigger: function () {
            this.opts.autoLoad && this._scrollContentHeight - this._threshold <= this._scrollWindowHeight && this.load();
        },
        load: function () {
            this.direction = "up";
            this.$domDown.html(this.opts.domDown.domLoad);
            this.loading = !0;
            this.opts.loadDownFn.call(this);
        },
        setScrollY: function (event) {
            this._startY = event.touches[0].pageY;
            this.touchScrollTop = this.$scrollArea.scrollTop();
        },

        resetContainerHeight: function () {
            this._scrollContentHeight = this.opts.scrollArea == window
                ? $(document)
                .height()
                : this.$element[0].scrollHeight;
        },
        setDomUpTip: function (event) {
            this._curY = event.touches[0].pageY;
            this._moveY = this._curY - this._startY;
            this._moveY > 0
                ? this.direction = "down"
                : this._moveY < 0 && (this.direction = "up");
            var d = Math.abs(this._moveY);
            if ("" != this.opts.loadUpFn && this.touchScrollTop <= 0 && "down" == this.direction && !this.isLockUp) {
                event.preventDefault();
                this.$domUp = this.$element.find("." + this.opts.domUp.domClass);
                if (!this.upInsertDOM) {
                    this.$element.prepend('<div class="' + this.opts.domUp.domClass + '"></div>');
                    this.upInsertDOM = !0;
                }
                setTransition(this.$domUp, 0);
                if (d <= this.opts.distance) {
                    this._offsetY = d;
                    this.$domUp.html(this.opts.domUp.domRefresh);
                } else if (d > this.opts.distance && d <= 2 * this.opts.distance) {
                    this._offsetY = this.opts.distance + .5 * (d - this.opts.distance);
                    this.$domUp.html(this.opts.domUp.domUpdate);
                } else {
                    this._offsetY = this.opts.distance + .5 * this.opts.distance + .2 * (d - 2 * this.opts.distance);
                }
                this.$domUp.css({height: this._offsetY});
            }
        },

        resetDomUpTip: function () {
            var c = Math.abs(this._moveY), self = this;
            if ("" != this.opts.loadUpFn && this.touchScrollTop <= 0 && "down" == this.direction && !this.isLockUp) {
                setTransition(this.$domUp, 300);
                if (c > this.opts.distance) {
                    this.$domUp.css({
                        height: this.$domUp.children()
                                    .height()
                    });
                    this.$domUp.html(this.opts.domUp.domLoad);
                    this.loading = !0;
                    this.opts.loadUpFn.call(this);
                } else {
                    this.$domUp.css({height: "0"})
                        .on("webkitTransitionEnd mozTransitionEnd transitionend", function () {
                            self.upInsertDOM = !1;
                            $(this)
                                .remove();
                        });
                }
                this._moveY = 0;
            }
        }
    };

    util.PullUpLoad = PullUpLoad;

}(window.Zepto || window.jQuery, window.util || (window.util = {}));