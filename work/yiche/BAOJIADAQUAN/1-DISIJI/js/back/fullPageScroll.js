/*
   功能：移动端滑屏分页插件
   开发: wangliang
   时间:2015-06-03
*/
var classNames = ['Webkit', 'ms', 'Moz', 'O', ''];
var eventNames = ['webkit', 'moz', 'o'];

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

var clientHeight = document.documentElement.clientHeight;

(function ($) {
    $.fn.fullPage = function (options) {
        var setting = {
            index: 0,
            init: null,
            context: null,
            touchmove: null,
            returnContext: null,
            transition: 'all 700ms ease',
            afterLoad: null //滚动到某一屏后的回调函数
        }
        options = Object.extend(options, setting);
        var $root = this;
        $root.pageIndex = options.index;
        $root.css({ 'position': 'absolute', 'top': '0px', 'left': '0px', 'overflow': 'hidden', 'width': '100%', });
        $root.addClass3('transition', options.transition);
        //纵向拖拽
        var items = $root.dragY({
            afterLoad: options.afterLoad,
            returnContext: options.returnContext,
            touchmove: options.touchmove
        });
        //设置屏幕
        function setWindow() {
            clientHeight = document.documentElement.clientHeight;
            //设置屏幕高度
            items.height(clientHeight).show();
            //重置位置
            $root.trigger('setIndex', $root.pageIndex);
            //初始化
            options.init && options.init.call($root);

        }

        $root.on('prev', function (ev) {
            $root.pageIndex = $root.pageIndex - 1;
            if ($root.pageIndex <= 0) { $root.pageIndex = 0 };
            $root.trigger('setIndex', $root.pageIndex);
        })

        $root.on('next', function (ev) {
            $root.pageIndex = $root.pageIndex + 1;
            if ($root.pageIndex >= items.length - 1) { $root.pageIndex = items.length - 1 };
            $root.trigger('setIndex', $root.pageIndex);
        })

        $root.on('setIndex', function (event, i) {
            $root.addClass3('transform', 'translate3d(' + 0 + 'px,' + (-clientHeight * i) + 'px,0)');
            $root.transitionEnd({
                end: function () {
                    options.afterLoad && options.afterLoad.call($root, $root.pageIndex);
                }
            })
        })

        $(window).resize(setWindow).trigger('resize');
    }

    //纵向滚动
    $.fn.dragY = function (options) {
        var setting = {
            section: '.section',
            returnContext: null,
            touchmove: null,
            afterLoad: null
        }
        options = Object.extend(options, setting);
        var $this = this;
        var items = $this.find(options.section);
        $this.tY = $this.oY = $this.pY = $this.opY = 0;
        $this.td = true;
        $this.touches({
            touchstart: function (ev) {
                $this.td = options.returnContext && options.returnContext.call($this);
                $this.pY = $this.disY = ev.targetTouches[0].pageY - $this.tY;
            },
            touchmove: function (ev) {
                $this.pY = ev.targetTouches[0].pageY - $this.disY;
                options.touchmove && options.touchmove.call($this, $this.pY > $this.tY ? 'up' : 'down');
                if ($this.td) {
                    ev.preventDefault();
                }
                $this.opY = $this.pY;
                if ($this.td) {
                    $this.tY = ev.targetTouches[0].pageY - $this.disY;
                    if ($this.tY >= 0) { $this.tY = 0 }
                    if ($this.tY <= -items.length * clientHeight) { $this.tY = -items.length * clientHeight; }
                    clearTimeout($this.timeout);
                    $this.timeout = setTimeout(function () { $this.addClass3('transform', 'translate3d(' + 0 + 'px,' + $this.tY + 'px,0)'); }, 300);
                }

            },
            touchend: function () {
                if ($this.td) {
                    clearTimeout($this.timeout);
                    if (($this.oY - $this.tY) > 0 && ($this.oY - $this.tY) > 30) {
                        $this.pageIndex = $this.pageIndex + 1;
                        if ($this.pageIndex > (items.length - 1)) $this.pageIndex = items.length - 1;
                        $this.addClass3('transform', 'translate(' + 0 + 'px,' + (-clientHeight * $this.pageIndex) + 'px)');
                        $this.tY = -clientHeight * $this.pageIndex;
                    }
                    else if (($this.oY - $this.tY) < 0 && ($this.oY - $this.tY) < -30) {
                        $this.pageIndex = $this.pageIndex - 1;
                        if ($this.pageIndex < 0) $this.pageIndex = 0;
                        $this.addClass3('transform', 'translate3d(' + 0 + 'px,' + (-clientHeight * $this.pageIndex) + 'px,0)');
                        $this.tY = -clientHeight * $this.pageIndex;
                    }
                    else {
                        $this.addClass3('transform', 'translate3d(' + 0 + 'px,' + (-clientHeight * $this.pageIndex) + 'px,0)');
                        $this.tY = -clientHeight * $this.pageIndex;
                    }
                    $this.transitionEnd({
                        end: function () {
                            options.afterLoad && options.afterLoad.call($this, $this.pageIndex);
                        }
                    })
                }
                $this.oY = $this.tY;
            }
        })
        return items;
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
})(jQuery);