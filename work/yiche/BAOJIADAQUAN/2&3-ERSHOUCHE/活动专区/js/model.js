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
    function toResize() {
        var winW = document.documentElement.clientWidth,
           winH = document.documentElement.clientHeight;
        setTimeout(function () { fn && fn(winW > winH ? "horizontal" : "vertical"); }, 200);
    }
    $(window).resize(toResize).trigger('resize');
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
            top: 0,
            toOffsetY: 0
        }
        options = Object.extend(options, setting);
        var $this = this, sections = [];
        $this.rows = 0;
        var site = [], f1 = 0, otop = 0, t = 0;
        var $first = $this.first();
        $first.on('to', function (event, r) {
            var offsetY = options.toOffsetY || 0
            var site = sections.sortValue(function (i, j) {
                if (this[i].top > this[j].top) {
                    temp = this[i];
                    this[i] = this[j];
                    this[j] = temp;
                }
            });

            var section = $(site).eq(r), pos = section[0].top;
            console.log(offsetY)
            //滚动屏幕
            $("html,body").animate({
                scrollTop: pos + offsetY
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


    //top
    $.fn.top = function (options) {
        var setting = {
            speed: 40,
            scroll: null
        };

        options = Object.extend(options, setting);
        var $this = this;
        function scrollTo() {
            var scrollT = document.documentElement.scrollTop || document.body.scrollTop;
            var h = document.documentElement.clientHeight || document.body.clientHeight;
            if (scrollT - h >= 0) {
                $this.show();
            } else {
                $this.hide();
            }
            options.scroll && options.scroll.call($this, scrollT)
        }
        $this.click(function () {
            var h = document.documentElement.clientHeight || document.body.clientHeight;
            var scrollh = document.documentElement.scrollHeight || document.body.scrollHeight;
            clearInterval($this.interval);
            $this.interval = setInterval(function () {
                var scrollT = document.documentElement.scrollTop || document.body.scrollTop;
                if (scrollT <= 0) {
                    clearInterval($this.interval);
                }
                window.scrollBy(0, -(scrollh / h * options.speed));
            }, 30);
        });

        $(window).scroll(scrollTo).trigger('scroll');
    }


    //自适应页底
    $.fn.footer = function (options) {
        var setting = {
            footer: '.footer-box',
            bottom: 0
        }
        options = Object.extend(options, setting);
        var $body = this;
        function autoheight() {
            var $footer = $body.find(options.footer);
            if ($body.height() <= $(window).height() - 5) {
                $footer.css('position', 'absolute').css('bottom', options.bottom).css('width', '100%');
            } else {
                $footer.css('position', 'relative');
            }
            $footer.show();
        }
        $(this).resize(autoheight).trigger('resize');
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
            oneEnd: null
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
                    options.oneEnd && options.oneEnd.call($leftPopup);
                    var $back = $('.' + $leftPopup.attr('data-back'));
                    $back.css('z-index', options.zindex - 10000);
                    $back.show();
                    $leftPopup.rightSwipeAction({
                        clickEnd: function (display) {
                            var $swipeLeft = $leftPopup.find('.swipeLeft');
                            $leftPopup.show();
                            setTimeout(function () { $swipeLeft.addClass('swipeLeft-block'); }, 200);
                            $back.parents('body').css('overflow', 'hidden');
                            $back.on('close', function () {
                                $(options.back).each(function (index, curr) {
                                    curr.style.display = 'none';
                                })
                                var $alert = $(options.alert).children().removeClass('swipeLeft-block').end();
                                $back.parents('body').css('overflow', 'inherit');
                                setTimeout(function () { $alert.css('z-index', 0).hide(); }, 200);
                            })

                            $back.touches({
                                touchstart: function () {
                                    $back.trigger('close');
                                }
                            });
                            $swipeLeft.transitionEnd({ end: function () { options.clickEnd && options.clickEnd.call($leftPopup, true, $this); } })
                        }
                    });
                })
            })($curr);
        })
    }



    $.fn.audio = function () {
        var $this = this, init = false;
        var notes = $('.note', $this), audio = document.getElementById('audio');
        $this.on('disable', function (event, $current) {
            notes.addClass('note-stop');
            audio.pause();
        })

        $this.on('enabled', function (event, $current) {
            notes.removeClass('note-stop');
            audio.play();
        })
        notes.each(function (index, curr) {
            var $current = $(curr);
            (function ($o, i) {
                $o.on('click',function(ev){
			         ev.preventDefault();
					 
					 
					   if (init == false) {
                        $this.trigger('disable', $o);
                        init = true;
                    }
                    else if (audio.paused) {
                        $this.trigger('enabled', $o);
                    } else {
                        $this.trigger('disable', $o);
                    }
		        })

            })($current, index);
        })
    }



})(jQuery);

$(function () {
    //top 向上按钮
    $('#m-top').top();

    //自适应页脚
    $(document.body).footer({ footer: '.footer-box' });
})
