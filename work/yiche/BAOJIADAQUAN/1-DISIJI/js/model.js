/*
开发者：王亮
功能:仿jquery类库（功能强大，可扩展）
时间:2014.5.5
*/

/*默认值*/
Object.extend = function (destination, source) {
    if (!destination) return source;
    for (var property in source) {
        if (!destination[property]) {
            destination[property] = source[property];
        }
    }
    return destination;
}

/*排序*/
Array.prototype.sortValue || (Array.prototype.sortValue = function (sortby) {
    var temp = null;
    //从高到低
    function desc(i, j) {
        if (this[i] < this[j]) {
            temp = this[i];
            this[i] = this[j];
            this[j] = temp;
        }
    }
    //从低到高
    function asc(i, j) {
        if (this[i] > this[j]) {
            temp = this[i];
            this[i] = this[j];
            this[j] = temp;
        }
    }

    var c = sortby == 'desc' ? desc : asc;
    function each(arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] instanceof Array) {
                each(arr[i]);
            } else {
                for (var j = i + 1; j < arr.length; j++) {
                    c.call(arr, i, j);
                }
            }
        }
    }
    each(this);
    return this;
})
//屏幕旋转完成事件(横屏:horizontal|竖屏:vertical)
$.rotateEnd = function (fn) {
    var supportsOrientationChange = "onorientationchange" in window,
               orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

    window.addEventListener(orientationEvent, function () {
        var winW = document.documentElement.clientWidth || document.body.clientWidth,
            winH = document.documentElement.clientHeight || document.body.clientHeight;
        fn && fn(winW > winH ? "horizontal" : "vertical");
    }, false);
};

var classNames = ['Webkit', 'ms', 'Moz', 'O', ''];
var eventNames = ['webkit', 'moz', 'o'];
(function ($) {
    //添加css3样式
    $.fn.addClass3 = function (name, value) {
        var o = this[0];
        var cName = name.charAt(0).toUpperCase() + name.substring(1);
        for (var i = 0; i < classNames.length; i++) {
            o.style[classNames[i] + cName] = value;
        }
        return $(o);
    }

    //transition事件监听
    $.fn.transitionEnd = function (options) {
        var setting = {
            listen: 'TransitionEnd',
            end: null
        }
        options = Object.extend(options, setting);
        var $this = this;
        function seatTransitionEnd() {
            for (var i = 0; i < eventNames.length; i++) {
                if (eventNames[i] == 'moz') {
                    $this.removeEvent(options.listen.toLocaleLowerCase(), seatTransitionEnd);
                } else {
                    $this.removeEvent(eventNames[i] + options.listen, seatTransitionEnd);
                }
            }
            options.end && options.end.call($this);
        }
        for (var i = 0; i < eventNames.length; i++) {
            if (eventNames[i] == 'moz') {
                $this.addEvent(options.listen.toLocaleLowerCase(), seatTransitionEnd);
            } else {
                $this.addEvent(eventNames[i] + options.listen, seatTransitionEnd);
            }
        }
    }

    //添加事件
    $.fn.addEvent = function (name, fn) {
        var obj = this[0];
        var cName = name.charAt(0).toUpperCase() + name.substring(1);
        for (var i = 0; i < eventNames.length; i++) {
            obj.addEventListener(eventNames[i] + cName, fn, false);
        }
        obj.addEventListener(name.charAt(0).toLowerCase() + name.substring(1), fn, false);
    }

    //删除事件
    $.fn.removeEvent = function (name, fn) {
        var obj = this[0];
        var cName = name.charAt(0).toUpperCase() + name.substring(1);
        for (var i = 0; i < eventNames.length; i++) {
            obj.removeEventListener(eventNames[i] + cName, fn, false);
        }
        obj.removeEventListener(name.charAt(0).toLowerCase() + name.substring(1), fn, false);
    }

    $.fn.offsetHeight = function () {
        return this.height() + parseInt(this.css('padding-top')) + parseInt(this.css('padding-bottom')) + parseInt(this.css('margin-top')) + parseInt(this.css('margin-bottom'));
    }

    //滚动监听
    $.fn.scrollListener = function (options) {
        var setting = {
            scrollTo: null
        }
        options = Object.extend(options, setting);
        var $this = this;

        function scrollTo() {
            clearTimeout($this.timeout)
            $this.timeout = setTimeout(function () {
                var scrollT = document.documentElement.scrollTop || document.body.scrollTop;
                var h = document.documentElement.clientHeight || document.body.clientHeight;
                $this.scrollTop = scrollT;
                $this.clientHeight = h;
                options.scrollTo && options.scrollTo.call($this);
            }, 10);


        }

        $this.touches({
            touchmove: function () {
                scrollTo();
            }
        })

        $this.scroll(function () {
            scrollTo();
        }).trigger('scroll');
    }

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
        if (!$this[0]) return;
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
    //导航插件
    $.fn.navigate = function (options) {
        var setting = {
            sandAjax: null,
            selectFn: null,
            scrollTo: null,
            init: null,
            upsort: null,
            downsort: null,
            speed: 100,
            top: 0
        }
        options = Object.extend(options, setting);
        var $this = this, sections = [];
        $this.rows = 0;
        var site = [], f1 = 0, otop = 0, t = 0;
        var $first = $this.first();
        $first.on('to', function (event, r) {
            var site = sections.sortValue(function (i, j) {
                if (this[i].top > this[j].top) {
                    temp = this[i];
                    this[i] = this[j];
                    this[j] = temp;
                }
            });

            var section = $(site).eq(r), pos = section[0].top;
            //滚动屏幕
            $("html,body").animate({
                scrollTop: pos
            }, options.speed);

        })
        var winh = document.body.clientHeight > document.documentElement.clientHeight ? document.documentElement.clientHeight != 0 ? document.documentElement.clientHeight : document.body.clientHeight : document.body.clientHeight,
            scrollh = document.body.scrollHeight > document.documentElement.scrollHeight ? document.documentElement.scrollHeight != 0 ? document.documentElement.scrollHeight : document.body.scrollHeight : document.body.scrollHeight;

        var upsections = downsections = 0;

        function toscroll() {
            options.scrollTo && options.scrollTo.call($this)
            var temp = null;
            //排序 从小到大
            site = sections.sortValue(function (i, j) {
                if (this[i].top > this[j].top) {
                    temp = this[i];
                    this[i] = this[j];
                    this[j] = temp;
                }
            });
            $this.site = site;
            var currentTOP = $(window).scrollTop() + options.top,
                f1 = site[0].top;
            var st = currentTOP > otop ? 'down' : 'up';
            $this.currentTOP = currentTOP;

            switch (st) {
                case 'down': //向下
                    $this.sections = sections;
                    //console.log('down');
                    //检查是否滚到最下面

                    //$('.navs a:last').html((lastArr.maxValue() + winh) + ' ' + (sections[sections.length - 1].top));
                    if ((currentTOP + winh) >= downsections[upsections.length - 1].top) {
                        //$('.navs a:last').html(sections.length - 1)
                        options.selectFn && options.selectFn.call(sections[sections.length - 1], sections.length - 1);
                    } else {
                        for (var i = 0; i < downsections.length; i++) {
                            var index = downsections[i + 1] ? i + 1 : i;
                            if (currentTOP >= downsections[i].top - downsections[i].h && currentTOP <= downsections[index].top) {
                                //$('.navs a:last').html(i)
                                options.selectFn && options.selectFn.call($this, i);
                            }
                        }
                    }

                    for (var i = 0; i < downsections.length; i++) {
                        var index = downsections[i + 1] ? i + 1 : i;
                        if (currentTOP >= downsections[i].top - downsections[i].h && currentTOP <= downsections[index].top) {
                            //$('.navs a:last').html(i)
                            options.selectFn && options.selectFn.call($this, i);
                        }
                    }
                    break;
                default:  //向上
                    $this.sections = sections;
                    for (var i = 0; i < upsections.length; i++) {
                        var index = upsections[i - 1] ? i - 1 : i;
                        if (currentTOP <= upsections[i].top && currentTOP >= upsections[index].top) {
                            options.selectFn && options.selectFn.call($this, index);
                        }
                    }
                    break;
            }
            otop = currentTOP;
        }

        $this.each(function (index, curr) {
            var $current = $(curr);
            $current.on('succeed', function (event, obj) {
                var $o = $(obj);
                if ($this.length - 1 == $this.rows) { //加载成功
                    $this.each(function (index, c) {
                        var $c = $(c);
                        sections.push({ section: $c, top: $c.offset().top, h: $c.height() });
                    });
                    upsections = downsections = sections;
                    if (options.downsort) {
                        downsections = options.downsort.call(sections);
                    }
                    if (options.upsort) {
                        upsections = options.upsort.call(sections);
                    }
                    //$(window).scroll(toscroll).trigger('scroll');
                    $(window).scrollListener({
                        scrollTo: function () {
                            toscroll();
                        }
                    })
                    options.init && options.init.call($first);
                }
                $this.rows++;
            });
            $current.index = index;
            if ($current.attr('data-ajax') == 'true') {
                options.sandAjax && options.sandAjax.call($current);
            } else {
                $current.trigger('succeed', $current);
            }
        });
    }

    //手势插件
    $.fn.gesture = function (options) {
        var setting = {
            items: 'a',
            selectFn: null,
            top: 0,
            offsetTop: 0,
            init: null,
            delay: 60
        };
        options = Object.extend(options, setting);
        var items = this.find(options.items);
        var itemH = items.eq(0).height();
        var $this = this, otop = 0, okey = '', timeout = 0, secs = [];
        $this.on('compareTop', function (event, ev) {
            var isdelay = ev.type != 'touchstart';
            if (!isdelay) {
                secs.length = 0;
                items.each(function (idx, c) {
                    secs.push({ key: c.innerHTML, top: c.offsetTop + options.offsetTop });
                })
            }
            var currentTOP = ev.targetTouches[0].pageY - (document.body.scrollTop + options.top);
            var st = currentTOP > otop ? 'down' : 'up';
            if (st == 'down') { //向下
                var downs = [];
                for (var i = 0; i < secs.length; i++) {
                    if (currentTOP >= secs[i].top) {
                        downs.push(secs[i].key);
                    }
                }
                var key = downs[downs.length - 1];
                if (key && key != okey) {
                    clearTimeout(timeout)
                    if (isdelay) {
                        timeout = setTimeout(function () {
                            options.selectFn && options.selectFn(key);
                        }, options.delay);
                    } else {
                        options.selectFn && options.selectFn(key);
                    }

                }
                okey = key;
            } else { //向上
                var ups = [];
                for (var i = 0; i < secs.length; i++) {
                    var index = secs[i - 1] ? i - 1 : i;

                    if (currentTOP < itemH) {
                        ups.push(secs[0].key);
                    }
                    else if (currentTOP - itemH <= secs[i].top && currentTOP - itemH >= secs[index].top) {
                        ups.push(secs[i].key)
                    }
                }

                var key = ups[ups.length - 1];
                if (key && key != okey) {
                    clearTimeout(timeout)
                    if (isdelay) {
                        timeout = setTimeout(function () {
                            options.selectFn && options.selectFn(key);
                        }, options.delay);
                    } else {
                        options.selectFn && options.selectFn(key);
                    }
                }
                okey = key;
            }
            otop = currentTOP;
        })
        options.init && options.init.call($this);
    }

    //右侧弹出层
    $.fn.rightSwipeAction = function (options) {
        var setting = {
            show: 'swipeLeft-block',
            clickEnd: null
        };
        options = Object.extend(options, setting);
        var $child = $(this.children(1)), display = 'none';
        if ($child.hasClass(options.show)) {
            display = 'none';
        } else {
            display = 'block';
        }
        options.clickEnd && options.clickEnd.call($child, display);
    };

    //右侧附加选择层插件
    $.fn.rightSwipe = function (options) {
        var $temp = null;
        var setting = {
            isclick: null,
            zindex: 999999,
            back: '.leftmask',
            alert: '.leftPopup',
            clickEnd: null, //打开关闭层回调事件
            oneEnd: null,
            closeEnd: null
        };
        options = Object.extend(options, setting);
        this.each(function (index, curr) {
            var $curr = $(curr);
            (function ($this) {
                $this.isclick = true;
                $this.click(function (ev) {
                    ev.preventDefault();
                    options.isclick && ($this.isclick = options.isclick.call($this));
                    if ($this.isclick == false) {
                        return;
                    }
                    var $leftPopup = $('.leftPopup.' + $this.attr('data-action'));
                    $leftPopup[0].style.zIndex = options.zindex;
                    options.oneEnd && options.oneEnd.call($leftPopup, true);
                    $leftPopup.rightSwipeAction({
                        clickEnd: function (display) {
                            var $back = $('.' + $leftPopup.attr('data-back')),
                                $swipeLeft = $leftPopup.find('.swipeLeft');
                            $back.css('z-index', options.zindex - 10000);
                            $back.show();
                            $leftPopup.show();
                            setTimeout(function () { $swipeLeft.addClass('swipeLeft-block'); }, 200);
                            $back.parents('body').css('overflow', 'hidden');
                            $back.on('close', function () {
                                var $alert = $(options.alert).children().removeClass('swipeLeft-block').end();
                                $(options.back).each(function (index, curr) {
                                    curr.style.display = 'none';
                                })
                                $back.parents('body').css('overflow', 'auto');
                                setTimeout(function () { $alert.css('z-index', 0).hide(); }, 200);
                            })

                            $back.touches({
                                touchstart: function () {
                                    $back.trigger('close');
                                    options.closeEnd && options.closeEnd.call($swipeLeft, $back);
                                }
                            })
                            $swipeLeft.transitionEnd({ end: function () { options.clickEnd && options.clickEnd.call($leftPopup, true, $this); } })
                        }
                    });
                })
            })($curr);
        })
    };

    //X向滚动
    $.fn.dragX = function (options) {
        var setting = {
            onstart: null,
            onmove: null,
            onend: null,
        }
        options = Object.extend(options, setting);
        var $this = this;
        $this.X = $this.disX = 0;
        $this.touches({
            touchstart: function (ev) {
                ev.preventDefault();
                $this.disX = ev.targetTouches[0].pageX - $this.X;
                options.onstart && options.onstart.call($this, $this.disX, ev.targetTouches[0].pageX);
            },
            touchmove: function (ev) {
                ev.preventDefault();
                $this.X = ev.targetTouches[0].pageX - $this.disX;
                options.onmove && options.onmove.call($this, $this.X);
            },
            touchend: function (ev) {
                options.onend && options.onend.call($this, $this.X, ev.changedTouches[0].pageX)
            }
        })
    }

    //滑动轴(X轴)
    $.fn.scrollbarX = function (options) {
        var setting = {
            current: '.current',
            init: null,
            touchmove: null,
            touchstart: null,
            touchend: null
        }
        options = Object.extend(options, setting);
        var $this = this, currentIndex = 0, siteJson = {};
        var currents = $this.find(options.current),
            width = $this.width(),
            $i = currents.first().children(0),
            minW = $i.width(),
            maxW = $this.width(),
            min = parseInt($this.attr('data-min')),
            max = parseInt($this.attr('data-max')),
            labelLeft = maxW / max;
        //计算当前选择值
        function getCurrent(x) {
            return parseInt((1 - parseInt(maxW - x) / maxW) * max)
        }

        currents.each(function (index, curr) {
            var $current = $(curr);
            $current.on('setindex', function (event, i) {
                var x = i * labelLeft;
                $current.width(x - 1);
                $current.X = x;
            });

            $current.dragX({
                onstart: function (x, pageX) {
                    var currentIndex = parseInt($current.attr('data-index') || 0);
                    var site = $current.attr('data-site') || 'left';
                    options.touchstart && options.touchstart.call($current, { currentIndex: currentIndex });
                },
                onmove: function (x) {
                    var currentIndex = getCurrent(x, maxW);
                    var currentsite = $current.attr('data-site') || 'left';
                    if (currentIndex < min) { currentIndex = min; return; }
                    if (currentIndex > max) { currentIndex = max; return; }
                    options.touchmove && options.touchmove.call($current, { currentIndex: currentIndex, x: x });


                },
                onend: function (x) {
                    options.touchend && options.touchend.call($current);
                }
            });
        });

        function toWindow() {
            minW = $i.width();
            maxW = $this.width();
            labelLeft = maxW / max;
            options.init && options.init.call($this);
            currents.each(function (index, curr) {
                (function ($o) {
                    var currentIndex = $o.attr('data-index') || 0;
                    $o.trigger('setindex', currentIndex);
                })($(curr));
            })
            siteJson = {};
            if (currents.length > 1) {
                currents.each(function (index, curr) {
                    var $current = $(curr);
                    var site = $current.attr('data-site') || 'left';
                    var currentIndex = parseInt($current.attr('data-index') || 0);
                    if (site == 'left') {
                        siteJson['right'] = { min: currentIndex, max: max }
                    } else if (site == 'right') {
                        siteJson['left'] = { min: min, max: currentIndex }
                    }
                });
            } else {
                siteJson['left'] = { min: min, max: max }
            }
        }

        $(window).resize(toWindow).trigger('resize');
    }
})(jQuery);
