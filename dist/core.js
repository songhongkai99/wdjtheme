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

