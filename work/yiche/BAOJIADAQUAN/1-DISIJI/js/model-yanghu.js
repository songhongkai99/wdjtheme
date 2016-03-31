/*
开发者：王亮
功能:移动端组件封装
时间:2014.5.5
*/

/*公共方法*/
//样式查找
document.deepCss = function (who, css) {
    if (!who || !who.style) return '';
    var sty = css.replace(/\-([a-z])/g, function (a, b) {
        return b.toUpperCase();
    });
    if (who.currentStyle) {
        return who.style[sty] || who.currentStyle[sty] || '';
    }
    var dv = document.defaultView || window;
    return who.style[sty] ||
    dv.getComputedStyle(who, "").getPropertyValue(css) || '';
}

/*接口默认配置 datatype=0 是在销 ，1 是包含停销*/
var api = {
    'brand': {
        url: 'http://api.car.bitauto.com/CarInfo/GetCarDataJson.ashx?action=master', callName: 'businessBrandCallBack', templteName: '#brandTemplate',
        currentid: ''
    },
    'car': {
        url: 'http://api.car.bitauto.com/CarInfo/GetCarDataJson.ashx?action=serial&pid={0}&datatype=1', callName: 'businessCarCallBack', templteName: '#carTemplate',
        currentid: '',
        clickEnd: null
    },
    'model': {
        url: 'http://api.car.bitauto.com/CarInfo/GetCarDataJson.ashx?action=car&pid={0}&datatype=1', callName: 'businessModelCallBack', templteName: '#modelTemplate',
        currentid: '',
        clickEnd: null
    }
};

//公共配置项
var settings = {
    iscroll: {
        bonuce: true //是否超出反弹
    },
    sliderBox: {
        onlyOne: true //折叠是否始终打开一个
    }
}

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

/*查找首次出现*/
Array.prototype.indexOf || (Array.prototype.indexOf = function (v) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == v) {
            return i;
        }
    }
    return -1;
})

/*返回删除索引*/
Array.prototype.removeIndex || (Array.prototype.removeIndex = function (index) {
    for (var i = 0; i < this.length; i++) {
        if (i == index) {
            this.splice(i, 1);
            i--;
            break;
        }
    }
})

/*删除符合条件*/
Array.prototype.remove || (Array.prototype.remove = function (v) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == v) {
            this.splice(i, 1);
            i--;
        }
    }
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

$.rnd = function (n, m) {
    return Math.floor(Math.random() * (m + 1 - n) + n);
};

var rdArr = {};
//随机数
function useRandom(min, max, key) {
    if (min > max) { alert('输入值不正确'); }
    var key = key || 'random';
    rdArr[key] = rdArr[key] || [];
    if (rdArr[key].length == 0) {
        for (var i = min; i <= max; i++) {
            rdArr[key].push(i);
        }
    }
    var random = -1;
    var arr = rdArr[key];
    do {
        random = $.rnd(min, max);
    } while (arr.indexOf(random) == -1 && arr.length != 0);
    arr.remove(random);
    return random;
}

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

            try {
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
            catch (e) { }
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
            oneEnd: null,
            closeEnd: null,
            currentid: null,
            selected: false, ///如果为真，查找currentid是否相等，如果符合就触发回调事件
            onBeforeScrollStart: function (ev) {
                ev.preventDefault();
            },
            clickCallBack: function (clickEnd) { //点击默认回调方法
                clickEnd.call(this);
            }
        };

        function clickEnd() {
            var $this = this;
            var $leftPopup = $('.leftPopup.' + $this.attr('data-action'));
            $leftPopup[0].style.zIndex = options.zindex;
            options.oneEnd && options.oneEnd.call($leftPopup);
            var $back = $('.' + $leftPopup.attr('data-back'));
            if ($back.length > 0) {
                $back.css('z-index', options.zindex - 10000);
                $back.show();
            }
            $leftPopup.rightSwipeAction({
                clickEnd: function (display) {
                    if (display != 'none') {
                        var $swipeLeft = $leftPopup.find('.swipeLeft');
                        $leftPopup.show();
                        setTimeout(function () { $swipeLeft.addClass('swipeLeft-block'); }, 200);
                        if ($back.length > 0) {
                            $back.parents('body').css('overflow', 'hidden');
                            $back.on('close', function (ev, params) {
                                if (!params || !params.leftPopup) {
                                    setTimeout(function () {
                                        $(options.back).each(function (index, curr) {
                                            curr.style.display = 'none';
                                        })
                                    }, 300);
                                    var $alert = $(options.alert).children().removeClass('swipeLeft-block').end();
                                    $back.parents('body').css('overflow', 'inherit');
                                    setTimeout(function () { $alert.hide(); options.closeEnd }, 200);
                                    options.closeEnd && options.closeEnd.call($swipeLeft, $back);
                                } else {
                                    var $alert = params.leftPopup.children().removeClass('swipeLeft-block').end();
                                    setTimeout(function () { $alert.hide(); params.leftPopup[0].style.display = 'none'; }, 200);

                                    options.closeEnd && options.closeEnd.call(params.leftPopup.children(), $back);
                                }

                            })

                            $back.touches({
                                touchstart: function () {
                                    $back.trigger('close');
                                }
                            });
                        }
                        $swipeLeft.transitionEnd({ end: function () { options.clickEnd && options.clickEnd.call($leftPopup, true, $this); } })
                    } else {
                        options.clickEnd && options.clickEnd.call($leftPopup, true, $this);
                    }
                }
            });
        }
        options = Object.extend(options, setting);
        if (this.length == 0) { return; }
        this.each(function (index, curr) {
            var $curr = $(curr);
            (function ($this) {
                $this.isclick = true;
                $this.click(function (ev) {
                    options.onBeforeScrollStart.call($this, ev);
                    options.isclick && ($this.isclick = options.isclick.call($this));
                    if ($this.isclick == false) {
                        return;
                    }
                    options.clickCallBack.call($this, clickEnd);
                })
                //查找默认选中值，如果符合就触发回调事件
                if (options.selected && options.currentid && options.currentid.toString() == $curr.attr('data-id')) {
                    options.clickCallBack.call($this, clickEnd)
                    return;
                }
            })($curr);
        })
    }

    //iscroll扩展
    $.fn.iScroll = function (options) {
        var setting = {
            init: null,
            snap: null
        }
        options = Object.extend(options, setting);
        var $this = this;

        var myScroll = new iScroll($this[0], {
            snap: options.snap,
            momentum: true,
            click: true,
            bounce: settings.iscroll.bonuce,
            bounceLock: true,
            checkDOMChanges: true,
            onBeforeScrollStart: function (ev) { }
        });

        options.init && options.init.call($this);
    }

    //标签切换
    $.fn.tag = function (options) {
        var setting = {
            tagName: '.tag_board',
            tag_select: 'current',
            tag_content_active: 'active',
            index: 0,
            fnEnd: null
        };

        options = Object.extend(options, setting);
        var $tag_board = this.find(options.tagName), tags = this.find(options.tagName.split('_')[0]), tagli = $tag_board.find('li');

        options.index = parseInt($tag_board.attr('data-index')) || options.index;
        var $temp_tag = null;
        $tag_board.on('selectTag', function (event, idx) {
            var $current = $(tagli[idx]);
            if ($temp_tag == $current) return;
            if ($temp_tag && $temp_tag.length > 0) {
                $temp_tag.removeClass(options.tag_select);
            }
            $current.addClass(options.tag_select);
            $tag_board.trigger('selectContent', idx);
            $temp_tag = $current;
        });

        var $temp_content = null;
        $tag_board.on('selectContent', function (event, idx) {
            if ($temp_content && $temp_content.length > 0) {
                $temp_content.removeClass(options.tag_content_active);
            }
            $(tags[idx]).addClass(options.tag_content_active);
            $temp_content = $(tags[idx]);
            options.fnEnd && options.fnEnd.call($temp_content, idx);
        })

        $tag_board.find('li').each(function (index, curr) {
            $(curr).click(function (ev) {
                ev.preventDefault();
                $tag_board.trigger('selectTag', $(this).index())
            })
        })

        $tag_board.trigger('selectTag', options.index);
    }

    //折叠菜单
    $.fn.sliderBox = function (options) {
        var setting = {
            index: -1,
            onlyOne: false,
            loadEnd: null,
            click: null,
            clickEnd: null,
            animateEnd: null,
            heightFn: function (idx) { return this.height(); },
            isCloseFn: function (idx, index) { return idx != index && idx != 'all'; }
        }
        options = Object.extend(options, setting);
        var idx = -1
        if (options.index) {
            if (typeof options.index == 'number') {
                idx = options.index - 1;
            } else {
                idx = options.index;
            }
        } else {
            this.parents('ul,div').each(function (index, curr) {
                var $curr = $(curr);
                if ($curr.attr('data-index') != undefined) {
                    idx = parseInt($curr.attr('data-index'));
                }
            })
        }
        var $first = $(this[0]);
        var header = this;
        header.each(function (index, curr) {
            var $next = $(curr).next();
            $next.attr('data-height', options.heightFn.call($next, index));
        })

        var s = [], $temp = null, $temp_k = null;
        function fnSlider(event, current) {
            var $this = $(current);
            var $box = $this.next(), height = parseInt($box.attr('data-height'));

            if (options.onlyOne && $temp && $temp.attr('index') != $this.attr('index')) {
                $temp.next().stop().animate({ height: 0 }, 'fast', function () {
                    options.animateEnd && options.animateEnd.call($this);
                });
                $temp_k = $temp;
            }

            $box.animate({ height: $box.height() == 0 ? height : 0 }, 'fast', function () {
                if ($box.height() > 0) {
                    $box.height('100%').removeClass('height');
                }
                options.animateEnd && options.animateEnd.call($this);
            });
            options.clickEnd && options.clickEnd.call($this, { k: $box.height() == 0 ? 'down' : 'up', temp: $temp_k });

            $temp = $this;
        }
        $first.off('slider');
        $first.on('slider', fnSlider);

        this.each(function (index, curr) {
            var $curr = $(curr);
            $curr.unbind('click').bind('click', function (ev) {
                ev.preventDefault();
                if (options.click == null) {
                    $first.trigger('slider', $(this));
                } else {
                    options.click.call($curr, $first);
                }
                return false;
            })

            if (options.isCloseFn.call($curr.next(), idx, index)) {
                $curr.next().height(0);
            } else {
                $temp = $curr;
                s.push(index);
            }
            $curr.attr('index', index);
        })
        if (s.length > 0)
            options.loadEnd && options.loadEnd.call(this, s);
    }

    //ajax解析成HTML
    $.fn.swipeApi = function (options) {
        var setting = {
            id: 0,
            url: '',
            templateid: '#modelTemplate',
            jsonpCallback: 'a',
            flatFn: function (data) { return data },
            analysis: function (data) {
                var tp1 = $(options.templateid).html();
                var template = _.template(tp1);
                var jb = options.flatFn(data);
                return template(jb);
            },
            callback: null
        }
        options = Object.extend(options, setting);

        /*模板配置*/
        _.templateSettings = {
            evaluate: /{([\s\S]+?)}/g,
            interpolate: /{=([\s\S]+?)}/g,
            escape: /{-([\s\S]+?)}/g
        };

        var $leftPopup = this;
        try {
            $.ajax({
                url: options.url.replace('{0}', options.id),
                dataType: "jsonp",
                jsonpCallback: options.jsonpCallback,
                cache: true,
                success: function (data) {
                    options.callback && options.callback.call($leftPopup, options.analysis && options.analysis.call($leftPopup, data));
                }
            });
        }
        catch (ev) { }
    }

    //json解析成HTML
    $.fn.swipeData = function (options) {
        var setting = {
            data: null,
            callback: null,
            templateid: '',
            flatFn: function (data) { return data },
            analysis: function (data) {
                var tp1 = $(options.templateid).html();
                var template = _.template(tp1);
                var jb = options.flatFn(data);
                return template(jb);
            }
        }
        options = Object.extend(options, setting);

        /*模板配置*/
        _.templateSettings = {
            evaluate: /{([\s\S]+?)}/g,
            interpolate: /{=([\s\S]+?)}/g,
            escape: /{-([\s\S]+?)}/g
        };

        var $this = this;
        options.callback && options.callback.call($this, options.analysis && options.analysis.call($this, options.data));
    }

    //弧线运动
    $.fn.arcAnimation = function ($target, options) {
        var element = this[0], target = $target[0];
        /*
         * 网页模拟现实需要一个比例尺
         * 如果按照1像素就是1米来算，显然不合适，因为页面动不动就几百像素
         * 页面上，我们放两个物体，200~800像素之间，我们可以映射为现实世界的2米到8米，也就是100:1
         * 不过，本方法没有对此有所体现，因此不必在意
        */
        var setting = {
            speed: 300.67, // 每帧移动的像素大小，每帧（对于大部分显示屏）大约16~17毫秒
            curvature: 0.001,  // 实际指焦点到准线的距离，你可以抽象成曲率，这里模拟扔物体的抛物线，因此是开口向下的
            progress: null,
            complete: null
        };

        var params = Object.extend(options, setting);

        var exports = {
            mark: function () { return this; },
            position: function () { return this; },
            move: function () { return this; },
            init: function () { return this; }
        };

        /* 确定移动的方式 
         * IE6-IE8 是margin位移
         * IE9+使用transform
        */
        var moveStyle = "margin", testDiv = document.createElement("div");
        if ("oninput" in testDiv) {
            ["", "ms", "webkit"].forEach(function (prefix) {
                var transform = prefix + (prefix ? "T" : "t") + "ransform";
                if (transform in testDiv.style) {
                    moveStyle = transform;
                }
            });
        }

        // 根据两点坐标以及曲率确定运动曲线函数（也就是确定a, b的值）
        /* 公式： y = a*x*x + b*x + c;
        */
        var a = params.curvature, b = 0, c = 0;

        // 是否执行运动的标志量
        var flagMove = true;

        if (element && target && element.nodeType == 1 && target.nodeType == 1) {
            var rectElement = {}, rectTarget = {};

            // 移动元素的中心点位置，目标元素的中心点位置
            var centerElement = {}, centerTarget = {};

            // 目标元素的坐标位置
            var coordElement = {}, coordTarget = {};

            // 标注当前元素的坐标
            exports.mark = function () {
                if (flagMove == false) return this;
                if (typeof coordElement.x == "undefined") this.position();
                element.setAttribute("data-center", [coordElement.x, coordElement.y].join());
                target.setAttribute("data-center", [coordTarget.x, coordTarget.y].join());
                return this;
            }

            //低版本浏览器requestAnimationFrame兼容方法
            window.requestAnimationFrame = (function () {
                return window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        function (callback) {
                            window.setTimeout(callback, 1000 / 60);
                        };
            })();

            exports.position = function () {
                if (flagMove == false) return this;

                var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft,
                    scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

                // 初始位置
                if (moveStyle == "margin") {
                    element.style.marginLeft = element.style.marginTop = "0px";
                } else {
                    element.style[moveStyle] = "translate(0, 0)";
                }

                // 四边缘的坐标
                rectElement = element.getBoundingClientRect();
                rectTarget = target.getBoundingClientRect();

                // 移动元素的中心点坐标
                centerElement = {
                    x: rectElement.left + (rectElement.right - rectElement.left) / 2 + scrollLeft,
                    y: rectElement.top + (rectElement.bottom - rectElement.top) / 2 + scrollTop
                };

                // 目标元素的中心点位置
                centerTarget = {
                    x: rectTarget.left + (rectTarget.right - rectTarget.left) / 2 + scrollLeft,
                    y: rectTarget.top + (rectTarget.bottom - rectTarget.top) / 2 + scrollTop
                };

                // 转换成相对坐标位置
                coordElement = {
                    x: 0,
                    y: 0
                };
                coordTarget = {
                    x: -1 * (centerElement.x - centerTarget.x),
                    y: -1 * (centerElement.y - centerTarget.y)
                };

                /*
                 * 因为经过(0, 0), 因此c = 0
                 * 于是：
                 * y = a * x*x + b*x;
                 * y1 = a * x1*x1 + b*x1;
                 * y2 = a * x2*x2 + b*x2;
                 * 利用第二个坐标：
                 * b = (y2+ a*x2*x2) / x2
                */
                // 于是
                b = (coordTarget.y - a * coordTarget.x * coordTarget.x) / coordTarget.x;

                return this;
            };

            // 按照这个曲线运动
            exports.move = function () {
                // 如果曲线运动还没有结束，不再执行新的运动
                if (flagMove == false) return this;

                var startx = 0, rate = coordTarget.x > 0 ? 1 : -1;

                var step = function () {
                    // 切线 y'=2ax+b
                    var tangent = 2 * a * startx + b; // = y / x
                    // y*y + x*x = speed
                    // (tangent * x)^2 + x*x = speed
                    // x = Math.sqr(speed / (tangent * tangent + 1));
                    startx = startx + rate * Math.sqrt(params.speed / (tangent * tangent + 1));
                    // 防止过界
                    if ((rate == 1 && startx > coordTarget.x) || (rate == -1 && startx < coordTarget.x)) {
                        startx = coordTarget.x;
                    }
                    var x = startx, y = a * x * x + b * x;

                    // 标记当前位置，这里有测试使用的嫌疑，实际使用可以将这一行注释
                    element.setAttribute("data-center", [Math.round(x), Math.round(y)].join());

                    // x, y目前是坐标，需要转换成定位的像素值
                    if (moveStyle == "margin") {
                        element.style.marginLeft = x + "px";
                        element.style.marginTop = y + "px";
                    } else {
                        element.style[moveStyle] = "translate(" + [x + "px", y + "px"].join() + ")";
                    }

                    if (startx !== coordTarget.x) {
                        params.progress && params.progress(x, y);
                        window.requestAnimationFrame(step);
                    } else {
                        // 运动结束，回调执行
                        params.complete && params.complete();
                        flagMove = true;
                    }
                };
                window.requestAnimationFrame(step);
                flagMove = false;

                return this;
            };
            // 初始化方法
            exports.init = function () {
                this.position().mark().move();
            };
        }
        return exports;
    };

    //滑动层效果
    $.fn.rightSwipeAnimation = function (options) {
        var setting = {
            model: '.brandlayer',
            cache: false,
            site: '', //滑动方向
            fnEnd: null
        }
        options = Object.extend(options, setting);
        var $this = this;
        var clientHeight = document.documentElement.clientHeight,
            clientWidth = document.documentElement.clientWidth;
        var $model = $(options.model);



        switch (options.site) {
            case 'up':
                $model.addClass('selectModelsUp');
                break;
            case 'right':
                $model.addClass('selectModelsRight');
                break;
            default:
                $model.addClass('selectModels');
                break;
        }

        //加载完回调
        function clickEnd($current) {
            var $model = this;
            $model.addClass('swipeModels-block');
            options.fnEnd && options.fnEnd.call($model);
        }

        $model.on('closeWindow', function (ev) {
            $model.removeClass('swipeModels-block');
        })

        this.each(function (index, curr) {
            var $current = $(this);
            (function ($o) {
                $o.click(function (ev) {
                    var $current = $(this);
                    if (options.cache && $model.html() != '') {
                        clickEnd.call($model, $current, ev);
                    } else {
                        $model.loadHtml({
                            end: function (html) {
                                $model.html(html)
                                clickEnd.call($model, $current, ev);
                            }
                        })
                    }
                })
            })($current);
        })
    }

    //ajax加载
    $.fn.loadHtml = function (options) {
        var setting = {
            end: null,
            url: ''
        }
        options = Object.extend(options, setting);
        var $this = this,
        url = $this.attr('data-url') || options.url;
        if (!url) {
            options.end && options.end.call($this);
        } else {
            $.get(url, function (data) {
                options.end && options.end.call($this, data);
            })
        }
    }

    var tips = {};
    //弹出提示层
    $.fn.tip = function (json, options) {
        var setting = {
            tempateName: '#tipTempate', //模板名称
            delay: 1000
        }
        options = Object.extend(options, setting);
        var $this = this,
            $tipTempate = $(options.tempateName);

        if (tips[options.tempateName]) {
            return;
        }

        var tempateText = $tipTempate.html()
        for (var n in json) {
            tempateText = tempateText.replace(eval('/{' + n + '}/g'), json[n]);
        }

        tips[options.tempateName] = true;
        var $model = $('<div>').html(tempateText).children(0);
        $this[0].appendChild($model[0]);
        setTimeout(function () {
            $model.remove();
            tips[options.tempateName] = false;
        }, options.delay);
    }
})(jQuery);