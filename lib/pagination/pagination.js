(function (util) {
    //需要Pagination的List构造器里包含一个new Pagination,
    // 将index及size的控制权统一交给pagination
    // function List(option) {
    //     this.pagination = new Pagination();
    // }
    //默认分页参数配置
    Pager.defaults = {
        pageIndex: 1,//默认分页起始
        pageSize: 10,//默认单页数量
        step: 5,//分页页码步长
        isNumShow: true,
        isSkipShow: true,//默认分页跳码显示
        lstTopDiff: 100,
        disabledCls: 'disabled',
        activeCls: 'curr',
        container: '#J_Page',
        strategy: function () {
            if (this.amount < this.options.step) {
                this.start = 1;
                this.end = this.amount;
            } else {
                //计算分页步阶开始位置
                this.start = (this.current - this.options.step < 1)
                    ? 1
                    : this.current - this.options.step;
                //计算当前步阶结束位置
                this.end = (this.current + this.options.step > this.amount)
                    ? this.amount
                    : this.current + this.options.step;
            }
        },
        control: function () {
            this.pages.removeClass(this.options.activeCls);
            this.forward.removeClass(this.options.disabledCls);
            this.backward.removeClass(this.options.disabledCls);

            this.container.find('a[data-page-index=' + this.current + ']')
                .addClass(this.options.activeCls);
            if (!this.isPrevAble()) {
                this.forward.addClass(this.options.disabledCls);
            } else if (!this.isNextAble()) {
                this.backward.addClass(this.options.disabledCls);
            }
        }
    };



    //分页构造器
    function Pager() {

        var option;
        if (0 in arguments) {
            option = arguments[0];
        } else {
            option = {};
        }
        if (!(this instanceof Pager)) return new Pager(option);
        this.options = $.extend(true, {}, Pager.defaults, option);
        this.container = $(this.options.container);
        this.current = this.options.pageIndex;
        this.isRendered = false;
    }

    //事件代理
    Pager.prototype = {

        //获取数据
        fetch: function () {

            this.repaint();
            if (this.list) {
                this.list.pagination.options.pageIndex = this.current;
                this.list.fetch();
                $('html body')
                    .animate({
                        scrollTop: this.list.$el.offset().top - this.options.lstTopDiff
                    }, 500);
            }
        },
        //跳转页码
        goto: function (index) {
            index > this.amount
                ? this.current = this.amount
                : this.current = index;
            this.fetch();

        },


        //上一页
        isPrevAble: function () {
            return this.current != 1;
        },


        prev: function () {
            if (this.isPrevAble()) {
                this.current = this.current - 1;
                this.fetch();

            }
        },
        //下一页
        isNextAble: function () {
            return this.current != this.amount;
        },
        next: function () {
            if (this.isNextAble()) {
                this.current = this.current + 1;
                this.fetch();

            }
        },

        //渲染分页
        tpl: function () {
            var html = '';
            html += '<div class="p-wrap">';
            html += '<span class="p-num">';
            html += '<a class="J_PagePrev pn-prev p-prev-next">';
            //html += '<i>&lt;</i>';
            html += '<em>上一页</em>';
            html += '</a>';
            if (this.options.isNumShow) {
                if (this.start > 1) {

                    html += '<a class="J_PerPage" href="javascript:void(0);" data-page-index="' + 1 + '" >' + 1 + '</a>';
                    html += '<b class="pn-break J_PageBreakPrev">...</b>';
                }
                for (var i = this.start; i <= this.end; i++) {
                    html += '<a class="J_PerPage" href="javascript:void(0);" data-page-index="' + i + '" >' + i + '</a>';
                }
                if (this.end < this.amount) {
                    html += '<b class="pn-break J_PageBreakNext">...</b>';
                    html += '<a class="J_PerPage" href="javascript:void(0);" data-page-index="' + this.amount + '" >' + this.amount + '</a>';
                }
            }
            html += '<a class="J_PageNext pn-next p-prev-next">';
            html += '<em>下一页</em>';
            //html += '<i>&gt;</i>';
            html += '</a>';
            html += '</span>';

            if (this.options.isSkipShow) {
                html += '<span class="p-skip">';
                html += '<em>共<b class="p-total">&nbsp;' + this.amount + '&nbsp;</b>页&nbsp;到第&nbsp;</em>';
                html += '<input id="J_PageNumInput"  class="input-txt" type="text" value="1">';
                html += '<em>&nbsp;页</em>';
                html += '<a class="p-btn  J_PageSkip"  href="javascript:void(0);">确定</a>';
                html += '</span>';
            }
            html += '</div>';

            this.container.html(html);
            this.forward = this.container.find('.J_PagePrev');
            this.backward = this.container.find('.J_PageNext');
            this.pages = this.container.find('.J_PerPage');
            if (this.amount == 1) {
                this.container.find('.p-num')
                    .hide();
            }
        },

        //分页模板
        render: function (count) {
            this.amount = Math.ceil(count / this.options.pageSize);
            this.current > 1 ? this.goto(this.current) : this.repaint();
            this.delegate();
            this.isRendered = true;
        },
        delegate: function () {
            var self = this, delegated = false;
            if (!delegated) {
                delegated = true;
                this.container.on('click', '.J_PagePrev', function () {
                    if ($(this)
                            .hasClass(self.options.disabledCls)) {
                        return !1
                    }
                    self.prev();
                });
                this.container.on('click', '.J_PageNext', function () {
                    if ($(this)
                            .hasClass(self.options.disabledCls)) {
                        return !1
                    }
                    self.next();
                });
                // a[data-page-index]
                this.container.on('click', '.J_PerPage', function () {
                    var index = $(this)
                        .data('pageIndex');
                    self.goto(index);
                });
                this.container.on('click', '.J_PageSkip', function () {
                    var pageGoto = parseInt($('#J_PageNumInput')
                        .val(), 10);
                    self.goto(pageGoto);
                });
            }
        },
        //重置分页外观
        repaint: function () {
            this.options.strategy.call(this);
            this.tpl();
            this.options.control.call(this);
        },

        //刷新分页
        refresh: function () {
            this.current = 1;
            this.fetch();

        },
        //销毁分页
        destroy: function () {
            this.container.html('');
            this.isRendered = false;
        }

    };
    util.Pagination = Pager;

})(window.util || (window.util = {}));