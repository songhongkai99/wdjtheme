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
    /*百分圆*/
    $.fn.circle = function (options) {
        var setting = {
            barWidth: 10,
            displayNumber: false,
            speed: 10,
            parentName: '.col-2'
        }
        options = Object.extend(options, setting);
        var arr = [];
        this.each(function (index, current) {
            (function ($circle) {
                var barbgcolor = $circle.attr('data-barbgcolor') || '#f19c93',
					barcolor = $circle.attr('data-barcolor') || '#fcedeb',
					value = $circle.attr('data-value') || 0,
					minValue = $circle.attr('data-minvalue') || 0,
					maxvalue = $circle.attr('data-maxvalue') || 100;
                if (maxvalue < 100) {
                    value = (value / maxvalue).toFixed(2) * 100;
                }
                $circle.radialObj = $circle.radialIndicator({
                    barColor: barcolor,
                    barBgColor: barbgcolor,
                    barWidth: options.barWidth,
                    initValue: 0,
                    roundCorner: true,
                    percentage: true,
                    displayNumber: options.displayNumber,
                    minValue: minValue,
                    maxvalue: maxvalue,
                    frameTime: options.speed,
                    onChange: function (val) {
                        var $canvasbox = $(this), format = $canvasbox.attr('data-format');
                        if (maxvalue < 100) {
                            val = (val * maxvalue / 100).toFixed(1);
                        }
                        $canvasbox.find('span').html(format.replace('{0}', val));
                    }
                });
                arr.push({ $circle: $circle, top: $circle.parents(options.parentName)[0].offsetTop, play: false, value: value });
            })($(current));
        })

        $(window).scrollListener({
            scrollTo: function () {
                var bottom = document.body.scrollTop + document.documentElement.clientHeight;
                arr = $.grep(arr, function (n, i) {
                    return n.play == false
                })

                for (var i = 0; i < arr.length; i++) {
                    var o = arr[i];
                    if (document.body.scrollTop <= o.top && o.top <= bottom) {
                        o.$circle.radialObj.data('radialIndicator').animate(o.value);
                    }
                }
            }
        })
    }
    //延时加载bar
    $.fn.lazybar = function (options) {
        var setting = {
            current: 'win',
            leftName: '.bl',
            rightName: '.br',
            speed: 2.5
        }
        options = Object.extend(options, setting);

        var arrImg = [];
        this.each(function (index, bar) {
            (function ($bar) {
                var $left = $bar.find(options.leftName);
                var $right = $bar.find(options.rightName);
                arrImg.push({ $left: $left, leftwidth: $left.attr('data-width'), $right: $right, rightwidth: $right.attr('data-width'), top: $bar[0].offsetTop, play: false })
            })($(bar));
        })

        function setValue() {
            var value = parseInt(this.attr('data-value'));
            var options = {
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.',
                prefix: '',
                suffix: ''
            };
            new CountUp(this.find('em')[0], 0, value, 0, options.speed, options).start();
        }


        $(window).scrollListener({
            scrollTo: function () {
                var bottom = document.body.scrollTop + document.documentElement.clientHeight;
                arrImg = $.grep(arrImg, function (n, i) {
                    return n.play == false
                })

                for (var i = 0; i < arrImg.length; i++) {
                    var o = arrImg[i];
                    if (document.body.scrollTop <= o.top && o.top <= bottom) {
                        o.$left.width(o.leftwidth);
                        o.$right.width(o.rightwidth);
                        if (o.$left.attr('data-value')) {
                            setValue.call(o.$left);
                        }
                        if (o.$right.attr('data-value')) {
                            setValue.call(o.$right);
                        }
                        o.play = true;
                    }
                }
            }
        })
    }
})(jQuery);
