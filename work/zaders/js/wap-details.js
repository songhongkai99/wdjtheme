$(function () {

    var swiperNav = new Swiper('#swiper-nav', {
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        slidesPerView: 5,
        onTap: function () {
            swiperMain.slideTo(swiperNav.clickedIndex);
            swiperSecondary.slideTo(swiperNav.clickedIndex);
        },
        onInit: function(){
            $("#swiper-nav").removeClass("vis-hide");
        }
    })

    var swiperMain = new Swiper('#swiper-main', {
        slidesPerView: 1, //default params is 1
        spaceBetween: 0, //槽宽度
        effect: 'slide', //slide fade cube coverflow
        longSwipesRatio: 0.1, // 拖动比例触发切换 默认0.5
        resistance: true, //回弹 开始和结束
        onSlideChangeStart: function () {
            updateNavPosition();
        }
    })

    var swiperSecondary = new Swiper("#swiper-secondary", {
        effect: 'fade',
        fade: {
            crossFade: true
        },
        onlyExternal: true
    })

    function updateNavPosition() {
        $('#swiper-nav .active-nav').removeClass('active-nav')
        var activeNav = $('#swiper-nav .swiper-slide').eq(swiperMain.activeIndex).addClass('active-nav');
        if (!activeNav.hasClass('swiper-slide-visible')) {
            if (activeNav.index() > swiperNav.activeIndex) {
                var thumbsPerNav = Math.floor(swiperNav.width / activeNav.width()) - 1
                swiperNav.slideTo(activeNav.index() - thumbsPerNav)
            }
            else {
                swiperNav.slideTo(activeNav.index())
            }
        }
        //console.log("切换其他DOM元素")
        swiperSecondary.slideTo(activeNav.index());
    }

    window.swiperMainApi = swiperMain; //export to window object

    //价格计算逻辑
    var $body = $("body"), //文档
        $taoxiPaishe = $(".taoxi-paishe"), //套系拍摄选择
        taoxiPaishe_Price = $taoxiPaishe.find(".active").data("price"),
        $taoxiShengji = $(".taoxi-shengji"), //套系升级选择
        taoxiShengji_Price = $taoxiShengji.find(".active").data("addprice"),
        $fuzhuangDapei = $(".fuzhuangdapei"), //服装搭配
        fuzhuangDapei_Price = $fuzhuangDapei.find(".active").data("addprice"),
        $baobaoShuliang = $(".baobaoshuliang"), //宝宝数量
        baobaoShuliang_Per = $baobaoShuliang.find(".active").data("addper"),
        $taoxiZhaiyao = $(".taoxi-zhaiyao"), //套系摘要
        $totalPrice = $(".totalPrice"); //总价

    //摘要变量
    var $zhaiyaoTaoxi = $taoxiZhaiyao.find(".zhaiyao-taoxi"), //套系摘要
        $zhaiyaoTaoxiShengji = $taoxiZhaiyao.find(".zhaiyao-taoxishengji"), //升级摘要
        $zhaiyaoType = $taoxiZhaiyao.find(".zhaiyao-type"), //类型
        $zhaiyaoRuceshuliang = $taoxiZhaiyao.find(".zhaiyao-ruceshuliang"), //入册数量
        $zhaiyaoDipian = $taoxiZhaiyao.find(".zhaiyao-dipian"), //底片
        $zhaiyaoXiangce = $taoxiZhaiyao.find(".zhaiyao-xiangce"), //相册摘要
        $zhaiyaoFuzhuang = $taoxiZhaiyao.find(".zhaiyao-fuzhuangdapei"), //服装搭配
        $zhaiyaoBaobaoshuliang = $taoxiZhaiyao.find(".zhaiyao-baobaoshuliang"); //宝宝数量

    function updateTotalmoney() {
        var totalPrice = ( taoxiPaishe_Price + taoxiShengji_Price + fuzhuangDapei_Price ) * ( 1 + baobaoShuliang_Per );
        $totalPrice.html(formatMoney(totalPrice, 0));
        return totalPrice;
    }

    function updateSummary() {

    }

    function updatePriceDiff($this, identity) {
        if (identity != "paishe") {
            $this.siblings(".zaders-taoxi").find(".price").removeClass("hide").end().end().find(".price").addClass("hide");
            var _base = $this.data("addprice") == 0 ? 0 : $this.data("addprice") || $this.data("addper");
            $.each($this.siblings(".zaders-taoxi"), function (i, ele) {
                var this_c = $(ele).data("addprice") == 0 ? 0 : $(ele).data("addprice") || $(ele).data("addper");
                var this_m = formatMoney(Math.abs(this_c - _base), 0);
                if (identity == "baobaoshuliang") {
                    this_m = this_m * 100 + "%";
                }
                if (this_c - _base > 0) {
                    $(ele).find(".price").html("+RMB " + this_m);
                } else {
                    $(ele).find(".price").html("-RMB " + this_m);
                }
            })
        }
    }

    //价格初始化
    updateTotalmoney();

    $body.on("tap", ".zaders-taoxi", function (e) {
        var $this = $(this);
        var identity = $this.closest(".section-list").data("identity");
        $this.siblings(".active").removeClass("active").end().addClass("active");
        updatePriceDiff($this, identity); //更新价格差异
        switch (identity) {
            case "paishe":
                taoxiPaishe_Price = $this.data("price");
                $zhaiyaoTaoxi.html($this.find(".title").html());
                break;
            case "shengji":
                taoxiShengji_Price = $this.data("addprice");
                $zhaiyaoTaoxiShengji.html($this.find(".title").html());
                break;
            case "fuzhuangdapei":
                fuzhuangDapei_Price = $this.data("addprice");
                $zhaiyaoFuzhuang.html($this.find(".title").html());
                break;
            case "baobaoshuliang":
                baobaoShuliang_Per = $this.data("addper");
                $zhaiyaoBaobaoshuliang.html($this.find(".title").html());
                break;
            default:
                break;
        }
        updateTotalmoney();
        updateSummary();
    })

    /*
     * formatMoney(s,type)
     * 功能：金额按千位逗号分割
     * 参数：s，需要格式化的金额数值.
     * 参数：type,判断格式化后的金额是否需要小数位.
     * 返回：返回格式化后的数值字符串.
     */
    function formatMoney(s, type) {
        if (/[^0-9\.]/.test(s))
            return "0";
        if (s == null || s == "")
            return "0";
        s = s.toString().replace(/^(\d*)$/, "$1.");
        s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
        s = s.replace(".", ",");
        var re = /(\d)(\d{3},)/;
        while (re.test(s))
            s = s.replace(re, "$1,$2");
        s = s.replace(/,(\d\d)$/, ".$1");
        if (type == 0) {// 不带小数位(默认是有小数位)
            var a = s.split(".");
            if (a[1] == "00") {
                s = a[0];
            }
        }
        return s;
    }

    ;(function () {
        var timer; //节流阀 几个功能就需要几个节流阀 互不干扰

        $("body").on("scroll", animateForDii);
        $("body").triggerHandler("scroll"); //控制在当前位置刷新触发

        /*core function*/
        function doScroll($target, offset, callback, offEv) {
            var docScroll = $(document).scrollTop(),
                winHeight = $(window).height();
            if (docScroll + winHeight - $target.offset().top - $target.height() > offset) {
                callback && callback();
            }else{
                $("body").removeClass("footer-fixed-bottom");
            }
        }

        function animateForDii() {
            clearTimeout(timer);
            timer = setTimeout(function () {
                doScroll($(".taoxi-paishe"), 0, function () {
                    $("body").addClass("footer-fixed-bottom");
                }, animateForDii);
            }, 10);
        }
    })();
})