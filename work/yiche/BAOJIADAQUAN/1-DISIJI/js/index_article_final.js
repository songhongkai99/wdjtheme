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


var $standard_wx_bg = $('.standard_wx_bg');
var $sectionbox = $('#fullpage'),
         $iframe = $sectionbox.find('#iframe1'),
         $touchNo = $sectionbox.find('.touchNo');

function prev() {
    $.fn.fullpage.moveSectionUp();
}

function next() {
    $.fn.fullpage.moveSectionDown();
}

function msgshow() {
    $("#standard_wx_pop").addClass("standard_wx_pop_start").stop().fadeIn();
    $standard_wx_bg.stop().fadeIn();
}

$(function () {
    $sectionbox.fullpage({
        css3: true,
        scrollingSpeed: 700,
        controlArrows: false,
        verticalCentered: false,
        anchors: ['page1', 'page2', 'page3'],
        afterLoad: function (anchorLink, index) {
            $touchNo.hide();
        },
        onLeave: function (index, nextIndex, direction) {
            var leavingSection = $(this);
            //console.log(nextIndex, direction)
            if (nextIndex == 2 && direction == 'down') {
                $('.context_scroll', $iframe[0].contentWindow.document)[0].scrollTop = 1;
                $touchNo.show();
            } else if (nextIndex == 2 && direction == 'up') {
                $('.context_scroll', $iframe[0].contentWindow.document)[0].scrollTop = $('.context_scroll', $iframe[0].contentWindow.document)[0].scrollHeight - 1;
                $touchNo.show();
            }

            $standard_wx_bg.fadeOut();
            $("#standard_wx_pop").removeClass("standard_wx_pop_start").stop().fadeOut();
        }
    });
    $iframe.height(document.body.clientHeight);
    $touchNo.height(document.body.clientHeight);
    $touchNo.touches({
        touchstart: function (ev) {
            ev.preventDefault();
        },
        touchmove: function (ev) {
            ev.preventDefault();
        }
    })

    $standard_wx_bg.touches({
        touchstart: function (ev) {
            ev.preventDefault();
            $("#standard_wx_pop").removeClass("standard_wx_pop_start").stop().fadeOut();
            $standard_wx_bg.stop().fadeOut();
        },
        touchmove: function (ev) {
            ev.preventDefault();
        }
    })
})