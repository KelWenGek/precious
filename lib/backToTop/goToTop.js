(function ($, util) {


    var GotoTop = function () {

        var options;
        if (0 in arguments) {
            options = arguments[0];
        } else {
            options = {};
        }

        this.options = $.extend(true, {}, GotoTop.defaults, options);
        this.$container = this.options.container ? $(this.options.container) : $(window);
        console.log(this.$container);
        this.init.call(this);
    };
    GotoTop.defaults = {

        'cls': 'goto-top',
        'id': 'J_goto_top',
        speed: 300,
        tpl: function () {
            return '<div><span class="iconfont icon-xiangshang"></span></div>'
        }
    };

    GotoTop.prototype = {

        init: function () {
            var self = this;
            $(function () {
                var $scripts = $('body')
                        .find('script'),
                    $gotoTop = self.$gotoTop = $(self.options.tpl()),
                    $container = self.$container[0] != window ? self.$container.parent() : $(window);

                console.log($container);
                $gotoTop.attr(
                    {
                        'class': self.options.cls,
                        'id': self.options.id
                    }
                )
                        .insertBefore($scripts[0]);

                function gotoHideOrNot() {

                    if (self.$container.scrollTop() >= $container.height()) {

                        $gotoTop.show();
                    } else {
                        $gotoTop.hide();
                    }
                }

                gotoHideOrNot();


                self.$container.on('scroll', gotoHideOrNot);
                $(document)
                    .on('click', '#' + self.options.id, function (e) {
                        ( self.$container[0] != window ? self.$container : $('html body'))
                            .animate({
                                scrollTop: 0
                            }, self.options.speed);
                        e.stopPropagation();
                    });
            });
        }
    };

    util.GotoTop = GotoTop;

})(window.Zepto || window.jQuery, window.util || (window.util = {}));
