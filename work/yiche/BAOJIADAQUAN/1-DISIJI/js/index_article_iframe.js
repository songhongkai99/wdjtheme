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
    //触摸屏事件
    $.fn.touches = function (options) {
        var setting = {
            init: null,//初始化
            touchstart: null,  //按下
            touchmove: null, //滑动
            touchend: null //抬起
        };
        options = Object.extend(options, setting);
        var $this = this, touchesDiv = $this[0];
        touchesDiv.addEventListener('touchstart', function (ev) {
            options.touchstart && options.touchstart.call($this, ev);

            function fnMove(ev) {
                options.touchmove && options.touchmove.call($this, ev);
            }

            function fnEnd(ev) {
                options.touchend && options.touchend.call($this, ev);
                document.removeEventListener('touchmove', fnMove, false);
                document.removeEventListener('touchend', fnEnd, false);
            }
            document.addEventListener('touchmove', fnMove, false);
            document.addEventListener('touchend', fnEnd, false);
            return false;
        }, false)
        options.init && options.init.call($this);
    }
})(jQuery);

$(function () {
    var $context_scroll = $('.context_scroll'),
        $section = $('#fullpage .section', parent.document);
    $context_scroll.touched = false;
    function toScroll() {
        var images = $context_scroll.find('img');//正文图片后加载

        if ($context_scroll[0].scrollTop >= 0 && $context_scroll.pY != -1) {
            $context_scroll.pY = $context_scroll[0].scrollTop;
        } else if ($context_scroll[0].scrollTop + $section.height() <= $context_scroll[0].scrollHeight && $context_scroll.pY != -2) {
            $context_scroll.pY = $context_scroll[0].scrollTop;
        }


        for (var i = 0, len = images.length; i < len; i++) {
            var el = images[i];
            if ((document.body.scrollTop || document.documentElement.scrollTop) + 500 > $(el).offset().top && $(el).offset().top != 0) {
                var img_src = el.getAttribute("img_src");
                if (img_src != null) {
                    $(el.setAttribute("src", img_src)).fadeIn().fadeOut();

                    el.removeAttribute("img_src");
                }
            }
        }
    }

    $context_scroll.scroll(toScroll);
    $context_scroll.height($section.height());
    //weixin
    $("#standard_wx").on('click', function () {
        //dcsMultiTrack('DCS.dcsuri', '/h5news/onclick/newsweixinshare.onclick', 'WT.ti', '新闻微信分享')
        parent.msgshow();
    });
    $("#standard_wx_bg", parent.document).on('click', function () {
        parent.msghide();
    });
    $context_scroll.oY = 0;
    $context_scroll.touches({
        touchstart: function (ev) {
            $context_scroll.disY = ev.targetTouches[0].pageY - $context_scroll.oY;
        },
        touchmove: function (ev) {
            var y = ev.targetTouches[0].pageY - $context_scroll.disY;
            if ($context_scroll == true) return;
            if ($context_scroll.oY < y) {
                //console.log('down');
                if ($context_scroll[0].scrollTop <= 0 && $context_scroll.pY != -1) {
                    //$context_scroll.animate({ 'scrollTop': 0 });
                    //alert($context_scroll[0].scrollTop)
                    $context_scroll.pY = -1;
                    parent.prev();
                }

            } else if ($context_scroll.oY > y) {
                //console.log('up');
                if ($context_scroll[0].scrollTop + $section.height() + 5 >= $context_scroll[0].scrollHeight) {
                    // $context_scroll.animate({ 'scrollTop': $context_scroll[0].scrollHeight });
                    //alert($context_scroll[0].scrollTop)
                    $context_scroll.pY = -2;
                    parent.next();
                }
            }
            $context_scroll.oY = y;
        },
        touchend: function (ev) {

        }
    })
})
