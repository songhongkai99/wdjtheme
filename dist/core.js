console.log("Hello Git"); //init

//滚动屏幕节流阀

(function () {
    var timer, timer2; //节流阀 几个功能就需要几个节流阀 互不干扰

    $(window).on("scroll", animateForDii);
    $(window).on("scroll", animateForStamp);
    $(window).triggerHandler("scroll"); //控制在当前位置刷新触发

    /*core function*/
    function doScroll($target, offset, callback, offEv) {
        var docScroll = $(document).scrollTop(),
            winHeight = $(window).height();
        if (docScroll + winHeight - $target.offset().top - $target.height() > offset) {
            $(window).off("scroll", offEv);
            callback && callback();
        }
    }

    function animateForDii() {
        clearTimeout(timer);
        timer = setTimeout(function () {
            doScroll($(".details-information-main:first"), 0, function () {
                $(".details-information-ico em").removeClass("vis-hide").addClass("zoomIn");
            }, animateForDii);
        }, 100);
    }

    function animateForStamp() {
        clearTimeout(timer2);
        timer2 = setTimeout(function () {
            doScroll($(".qc-qualified").closest(".qc-report"), -500, function () {
                $(".qc-qualified").removeClass("vis-hide").addClass("zoomIn");
            }, animateForStamp);
        }, 100);
    }
})(jQuery || window.$);


//倒计时片段
(function ($) {
    var inter = null;
    $(".btn.re-send").on("tap", function () {
        if (inter) return false;
        var $this = $(this), timer = 5;
        $this.prop("disabled", true).html(timer + "s");
        inter = setInterval(function () {
            $this.html(--timer + "s");
            if (timer == 0) {
                clearInterval(inter);
                inter = null;
                $this.prop("disabled", false).html("重新发送");
            }
        }, 1000);
    })
})(jQuery || windows.$)

//取url参数
function getURLParameter(param, url) {
    var params = (url.substr(url.indexOf("?") + 1)).split("&");
    if (params != null) {
        for (var i = 0; i < params.length; i++) {
//iPanel.debug("params=="+params[i]);
            var strs = params[i].split("=");
//iPanel.debug("strs=="+strs);
            if (strs[0] == param) {
//iPanel.debug("strs[1]=="+strs[1]);
                return strs[1];
            }
        }
    }
    return "";
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURIComponent(r[2]);
    return null;
}

//placeholder hacker

