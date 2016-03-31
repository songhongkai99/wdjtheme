/*默认值*/
Object.extend = function (destination, source) {
    if (!destination) return source;
    for (var property in source) {
        if (!destination[property]) {
            destination[property] = source[property];
        }
    }
    return destination;
};

(function ($) {
    /*二次封装滑动幻灯片*/
    $.fn.slider = function (options) {
        var setting = {
            mode: "horizontal", //屏幕方向
            loop: false, //循环
            init: null, //初始化
            setIndex: null, //初始化索引
            autoplay: false, //是否自动播放
            time: 3000, //幻灯片间隔时间
            calculateHeight: false
        }
        var interval = 0;
        options = Object.extend(options, setting);
        var $this = this;
        $this.slider = new Swiper($this[0], {
            mode: options.mode,
            loop: options.loop,
            grabCursor: true,
            paginationClickable: false,
            calculateHeight: options.calculateHeight,
            visiblilityFullfit: false,
            onSlideChangeStart: function (swiper) {
                options.setIndex && options.setIndex.call($this, swiper);
            },
            onTouchStart: function () {
                $this.trigger('stop');
            }
        });

        //自定义播放事件
        $this.on('play', function () {
            $this.trigger('stop');
            interval = setInterval(function () {
                $this.slider.swipeNext($this.slider.activeLoopIndex);
            }, options.time);
        });

        $this.on('stop', function () {
            clearInterval(interval);
        })

        options.autoplay && $this.trigger('play');
        options.init && options.init.call($this);
    }
})(jQuery);
$(function () {
    //滑动幻灯片
    var $body = $(document.body);
    $body.on('swiper', function (ev, options) {
        var setting = {
            container: '.swiper-container',
            resizeFn: function () {
                var $this = this;
                var li = $this.find('.swiper-slide');
                /*解决高度自适应问题*/
                $(window).resize(function () {
                    setTimeout(function () {
                        var height = $this.find('img').height();
                        if (height > 0) {
                            li.height(height);
                            li.parent().height(height);
                        }
                        $container.css('opacity', 1);
                    }, 50);
                }).trigger('resize');
            }
        }
        options = Object.extend(options, setting);
        var $container = $(options.container),
            items = $container.find('.swiper-wrapper li'),
            $menu = $container.find('.menu'),
            $menuUl = $menu.find('ul');
        var loop = $container.attr('data-loop') || 'true';
        var autoplay = $container.attr('data-autoplay') || 'true';
        $container.css('opacity', 0);
        $container.show();
        if (items.length == 0) { $container.css('opacity', 1); return };
        var menu = [];
        items.each(function (index, curr) {
            menu.push('<li></li>')
        })
        $menuUl.width(items.length * 14);
        $menuUl.html(menu.join(''));
        $container.on('setIndex', function (event, idx) {
            var $li = $(items[idx]);
            var arrli = $menuUl.find('li');
            arrli.each(function (index, curr) {
                $(curr).removeClass('current');
            })
            $(arrli[idx]).addClass('current');
        });
        $container.trigger('setIndex', 0);
        // 焦点图切换
        $container.slider({
            autoplay: autoplay == 'true',
            loop: loop == 'true',
            calculateHeight: false,
            setIndex: function (swiper) {
                this.trigger('setIndex', swiper.activeLoopIndex);
                autoplay == 'true' && this.trigger('play');
            },
            init: function () {
                //自适应高度
                options.resizeFn && options.resizeFn.call(this);
            }
        })
    });
})