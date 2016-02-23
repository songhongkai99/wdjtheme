/*简单扩展Zepto基本功能 和 jQuery类似*/
;(function ($) {
    $.fn.end = function () {
        return this.prevObject || $()
    }
    $.fn.andSelf = function () {
        return this.add(this.prevObject || $())
    }
    'filter,add,not,eq,first,last,find,closest,parents,parent,children,siblings'.split(',').forEach(function (property) {
        var fn = $.fn[property]
        $.fn[property] = function () {
            var ret = fn.apply(this, arguments)
            ret.prevObject = this
            return ret
        }
    })
})(Zepto);

/*基于jQuery2x or Zepto*/
(function ($) {
    window.Bitauto_caichebiao = function () {
        var settings = {
            isEveryInterval: true, //是否每关重新计时
            leftSeconds: 15, //游戏时间15s, 当isEveryInterval为false是启用
            doubleSeconds: 0, //小于该时间双精度倒计时
            timeInterval: 1000, //计时器间隔ms
            loadedTimedout: 200, //加载完成后显示延迟时间ms
            windowOnloadShow: "#page-start",
            beforePlay: function () {
                //console.log("beforePlay")
            },
            afterClick: function () {
                //console.log("afterClick")
            },
            errorClick: function () { //call $(errorEle) object
                this.addClass("error").siblings().removeClass("error")
                //console.log("errorClick")
            },
            correctClick: function () { //call $(errorEle) object
                this.addClass("correct")
                //console.log("correctClick")
            },
            stopPlay: function () { // call $(currentSection) object
                this.find("[data-correct]").addClass("correct")
                //console.log("afterPlay")
            }
        }

        /*公共计时器*/
        var timeInterval = null;

        /*公共方法显示当前层*/
        function ShowLayer(element) {
            $(element).siblings().addClass("vis-hide").end().removeClass("vis-hide")
        }

        /*页面加载完成后隐藏加载层*/
        var _initWindowOnload = function (options) {
            /*参数合并*/
            $.extend(settings, options)
            Bitauto_caichebiao.settings = settings
            var $loadingLogo = $("#loading-logo"),
                $loadingTextEm = $("#loading-text").children("em"),
                loadingInterval = null;
            $loadingLogo.on("load", function () {
                $(this).css("opacity", "1")
            })
            $loadingLogo.attr("src", $loadingLogo.attr("src")) //触发load事件
            /*...*/
            var i = 1, text
            loadingInterval = setInterval(function () {
                (i == 4) && (i = 1)
                text = ""
                for (var j = 0; j < i; j++) {
                    text += "."
                }
                $loadingTextEm.text(text)
                i++
            }, 300)
            $(window).on("load", function () {
                setTimeout(function () {
                    clearInterval(loadingInterval)
                    ShowLayer(settings.windowOnloadShow)
                }, settings.loadedTimedout)
            })
            //微信浏览器a标签默认行为
            $(document).on("click", "a[href]", function (e) {
                var attrHref = $(this).attr("href")
                if (attrHref.indexOf("javascript:") < 0) {
                    e.preventDefault();
                    location = attrHref
                }
            })
            //微信浏览器阻止滚动暂定计时器
            $("#page-playing").on("scroll touchmove", function (e) {
                e.preventDefault();
                return false;
            }).on("touchstart", function (e) {
                //console.log(e.timeStamp)
                settings.timePaused = e.timeStamp
                //settings.timeNow = settings.leftSeconds
            }).on("touchend", function (e) {
                //console.log((e.timeStamp - settings.timePaused) / 1000)
                //if (settings.timeNow == settings.leftSeconds)
                settings.leftSeconds -= (e.timeStamp - settings.timePaused) / 1000;
            })
        }

        /*游戏各组件功能绑定*/
        var _initButtonFunc = function () {
            function _eventFunc() {
                $(".this-brand", $("#page-playing-play")).on("click", _initSelectBrand)
                settings.beforePlay.call() //api
                setTimeout(function () {
                    ShowLayer("#page-playing")
                    /*默认从第一关开始*/
                    ShowLayer("#page-playing-play > section:first-child")
                    _initPlayingStatus(0)
                }, 200)
            }

            /*开始按钮*/
            $("#this-start").on("click", function () {
                //$(this).addClass("js-click")
                _eventFunc()
            }).on({
                touchstart: function () {
                    $(this).addClass("js-click")
                },
                touchend: function () {
                    $(this).removeClass("js-click")
                },
                touchcancel: function () {
                    $(this).removeClass("js-click")
                }
            })

            function showSharePop(ele) {
                $(ele).removeClass("vis-hide").one("click", function () {
                    $(this).addClass("vis-hide")
                })
            }

            /*炫耀按钮*/
            $("#this-xuanyao").on("click", function () {
                showSharePop("#popup-layer")
            })

            /*下载引导*/
            $("#this-download").on("click", function () {
                showSharePop("#popup-layer")
            })

            /*邀请朋友*/
            $("#this-yaoqing").on("click", function () {
                showSharePop("#popup-layer2")
            })
        }

        /*状态控制*/
        var _initPlayingStatus = function (index) {
            /*初始化计时器*/
            timeInterval && clearInterval(timeInterval)
            parseInt(index) >= 0 || (index = 0)
            var $currentSection = $("#page-playing-play").children().eq(index),
                currentLevel = $currentSection.data("level"),
                currentBrand = $currentSection.data("brand"),
                secondsEm = $("#this-seconds").children("em"),
                levelEm = $("#this-level").children("em"),
                brandEm = $("#this-brand").children("em");
            /*倒计时 等级 品牌初始值*/
            secondsEm.parent().removeClass("red")
            if (settings.isEveryInterval) {
                settings.leftSeconds = parseFloat($currentSection.data("seconds"))
                secondsEm.text(settings.leftSeconds)
            }
            levelEm.text(currentLevel)
            brandEm.text(currentBrand)
            /*计时器*/
            timeInterval = setInterval(function () {
                settings.leftSeconds -= settings.timeInterval / 1000
                //倒计时变色
                if (settings.leftSeconds <= 3) {
                    secondsEm.parent().addClass("red")
                }
                //触发小数点倒计时
                if (settings.leftSeconds < settings.doubleSeconds) {
                    settings.leftSeconds = settings.leftSeconds.toFixed(2)
                    secondsEm.text("0" + settings.leftSeconds)
                } else {
                    secondsEm.text(settings.leftSeconds.toFixed(0))
                }
                //游戏时间结束
                if (settings.leftSeconds <= 0) {
                    secondsEm.text("0")
                    _stopPlaying($currentSection)
                }
            }, settings.timeInterval)
        }

        /*点击车标控制*/
        var _initSelectBrand = function (e) {
            var $eventTarget = $(e.target),
                $eventSection = $(e.target).closest("section"),
                rightstop = parseFloat($eventSection.data("rightstop"));
            /*判断是否为正确车标*/
            if ($eventTarget.data("correct")) {
                settings.correctClick.call($eventTarget) //api
                /*传入当前游戏section*/
                _initNextStep($eventSection)
            } else {
                settings.errorClick.call($eventTarget) //api
                if (!!rightstop && settings.leftSeconds > rightstop) {
                    var $secondsEm = $("#this-seconds").children("em")
                    settings.leftSeconds -= rightstop
                    settings.leftSeconds <= 3 && $secondsEm.parent().addClass("red")
                    $secondsEm.text(settings.leftSeconds.toFixed(0))
                } else {
                    _stopPlaying($eventSection, false)
                }
            }
            settings.afterClick.call($eventSection) //api
        }

        /*下一关控制*/
        var _initNextStep = function (section) {
            if (section.next().length == 0) {
                _stopPlaying(section, true)
            } else {
                setTimeout(function () {
                    ShowLayer(section.next())
                    _initPlayingStatus(section.next().index())
                }, 100)
            }
        }

        /*游戏结束控制*/
        var _stopPlaying = function (section, isCorrect) {
            clearInterval(timeInterval)
            $(".this-brand", $("#page-playing-play")).off("click")
            var level = 0 //初始等级为0
            if (!isCorrect) { //传入失败动作
                if (section.prev().length != 0) { // 如果不是第一关等级为上一关的等级
                    level = parseInt(section.prev().data("level"))
                }
            } else {
                level = parseInt(section.data("level"))
            }
            /*模拟代码, 实际以服务器做判断*/
            switch (level) {
                case 0:
                case 1:
                case 2:
                case 3:
                    _failPlaying(level)
                    break;
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                    _successPlaying(level)
                    break;
                default:
                    break;
            }
            settings.stopPlay.call(section) //api
        }

        /*测试方法*/
        var _successPlaying = function (level) {
            //console.log("您的等级 " + level + " , 车标高级选手, 中奖了")
            location.href = "win.html?level=" + level
        }

        /*测试方法*/
        var _failPlaying = function (level) {
            //console.log("您的等级 " + level + " , 车标初级称号, 未中奖")
            location.href = "fail.html?level=" + level
        }

        /*上线方法*/
        var _redirectPage = function (level) {
            location.href = "xxx.do?level=" + level //向服务器发送请求来判断是否中奖, 必须判断是否有referrer
        }

        /*返回核心方法*/
        return {
            init: function (options) {
                _initWindowOnload(options)
                _initButtonFunc()
            }
        }

    }()

})(Zepto)
;
