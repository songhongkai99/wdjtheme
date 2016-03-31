var classNames = ['Webkit', 'ms', 'Moz', 'O', ''];
var eventNames = ['webkit', 'moz', 'o'];
var hv = 120;
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
                if (options.arr[i] == 'moz') {
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

    /*阅读模式*/
    $.fn.initReadWord = function (options) {
        var setting = {
            item: 'p',
            c: 'span',
            speed: 100,
            fnEnd: null
        }
        var $this = this;
        options = Object.extend(options, setting);
        var items = $this.find(options.item);
        items.each(function (index, curr) {
            var arr = curr.innerHTML.split('');
            curr.innerHTML = '';
            for (var i = 0; i < arr.length; i++) {
                var span = document.createElement(options.c);
                span.innerHTML = arr[i];
                span.style.display = 'none';
                curr.appendChild(span);
            }
        })
        var interval = 0, index = 0;
        var spans = $this.find(options.c);
        $this.on('reset', function (event) {
            index = 0;
            for (var i = 0; i < spans.length; i++) {
                spans[i].style.display = 'none';
            }
        })
        $this.on('play', function (event) {
            interval = setInterval(function () {
                spans[index] && (spans[index].style.display = 'inline-block');
                if (index >= spans.length) {
                    clearInterval(interval);
                }
                index++;
            }, options.speed);
        })
        options.fnEnd && options.fnEnd.call($this);
    }
})(jQuery);