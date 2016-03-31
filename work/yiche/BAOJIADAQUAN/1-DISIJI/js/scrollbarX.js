

(function ($) {
	/*默认值*/
//	Object.extend = function (destination, source) {
//	    if (!destination) return source;
//	    for (var property in source) {
//	        if (!destination[property]) {
//	            destination[property] = source[property];
//	        }
//	    }
//	    return destination;
//	};

    //触摸屏事件
    $.fn.touches = function (options) {
        var defaults = {
            init: null,//初始化
            touchstart: null,  //按下
            touchmove: null, //滑动
            touchend: null //抬起
        };
        
		var options = $.extend(defaults, options);
       // options = Object.extend(options, setting);
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
    

    //X向滚动
    $.fn.dragX = function (options) {
        var defaults = {
            onstart: null,
            onmove: null,
            onend: null,
        }
        
		var options = $.extend(defaults, options);
        //options = Object.extend(options, setting);
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
        var defaults = {
            current: '.current',
            init: null,
            touchmove: null,
            touchstart: null,
            touchend: null
        }
        
		var options = $.extend(defaults, options);
        //options = Object.extend(options, setting);
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
           //console.log(parseInt(maxW - x) / maxW, (1 - parseInt(maxW - x) / maxW), (1 - parseInt(maxW - x) / maxW) * max);
           return parseInt((1 - parseInt(maxW - x) / maxW) * max)
           //return parseInt((1 - (parseInt(maxW - x) / maxW)).toFixed(1) * max)
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
        
        //
        this.on('refresh', function () {
		            toWindow();
		})
    }
})(jQuery);
