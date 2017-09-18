var carousel = {
    init: function () {
        var i = 0;
        var clone = $('.slider-main>li').first().clone();
        $('.slider-main').append(clone);
        var size = $('.slider-main>li').size();

        var imgWidth = $('.slider-main>li').width();
        for (var k = 0; k < size - 1; k++) {
            $('.slider-nav').append('<li class="slider-item"></li>')
        }
        $('.slider-nav>li').first().addClass('slider-selected');
        //鼠标划入圆点
        $('.slider-nav>li').hover(function () {
            var index = $(this).index();
            i = index;
            $('.slider-main').stop().animate({ left: -imgWidth * index }, 500);
            $(this).addClass('slider-selected').siblings().removeClass('slider-selected');
        });
        //自动轮播
        var t = setInterval(function () {
            i++;
            move();
        }, 2000);
        //对slider定时器的操作
        $('.slider').hover(function () {
            clearInterval(t);
        }, function () {
            t = setInterval(function () {
                i++;
                move();
            }, 5000);
        });
        //向左按钮
        $('.slider-prev').click(function () {
            i--;
            move();
        });
        //向右按钮
        $('.slider-next').click(function () {
            i++;
            move();
        });
        function move() {
            if (i == size) {
                $('.slider-main').css({ left: 0 });
                i = 1;
            }
            if (i == -1) {
                $('.slider-main').css({ left: -(size - 1) * imgWidth });
                i = size - 2;
            }
            $('.slider-main').stop().animate({ left: -imgWidth * i }, 500);
            if (i == size - 1) {
                $('.slider-nav>li').eq(0).addClass('slider-selected').siblings().removeClass('slider-selected');
            } else {
                $('.slider-nav>li').eq(i).addClass('slider-selected').siblings().removeClass('slider-selected');
            }
        }
    }
}

