$(function () {

    var swiperNav = new Swiper('#swiper-nav', {
        //watchSlidesProgress: true,
        //watchSlidesVisibility: true,
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
        swiperNav.slideTo(activeNav.index());
        /*if (!activeNav.hasClass('swiper-slide-visible')) {
            if (activeNav.index() > swiperNav.activeIndex) {
                var thumbsPerNav = Math.floor(swiperNav.width / activeNav.width()) - 1
                swiperNav.slideTo(activeNav.index() - thumbsPerNav)
            }
            else {
                swiperNav.slideTo(activeNav.index())
            }
        }*/
        //console.log("切换其他DOM元素")
        swiperSecondary.slideTo(activeNav.index());
    }

    window.swiperMainApi = swiperMain; //export to window object

    //价格计算逻辑
    var $body = $("body"), //文档
        $form = $("#form"), //隐藏表单
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
        $zhaiyaoTaoxidesc = $taoxiZhaiyao.find(".zhaiyao-taoxidesc"), //套系说明
        //$zhaiyaoType = $taoxiZhaiyao.find(".zhaiyao-type"), //类型
        //$zhaiyaoRuceshuliang = $taoxiZhaiyao.find(".zhaiyao-ruceshuliang"), //入册数量
        //$zhaiyaoDipian = $taoxiZhaiyao.find(".zhaiyao-dipian"), //底片
        //$zhaiyaoXiangce = $taoxiZhaiyao.find(".zhaiyao-xiangce"), //相册摘要
        $zhaiyaoFuzhuang = $taoxiZhaiyao.find(".zhaiyao-fuzhuangdapei"), //服装搭配
        $zhaiyaoBaobaoshuliang = $taoxiZhaiyao.find(".zhaiyao-baobaoshuliang"); //宝宝数量

    function updateTotalmoney() {
        var totalPrice = ( taoxiPaishe_Price + taoxiShengji_Price + fuzhuangDapei_Price ) * ( 1 + (+baobaoShuliang_Per) );
        $totalPrice.html(formatMoney(totalPrice, 0));
        $form.find("input[name=price]").val(totalPrice);
        return totalPrice;
    }

    function updateSummary(){
        if($taoxiShengji.find(".active").is(".basic")){
            $zhaiyaoTaoxidesc.html($taoxiPaishe.find(".active").find(".taoxidesc.basic").html());
        }else{
            $zhaiyaoTaoxidesc.html($taoxiPaishe.find(".active").find(".taoxidesc.plus").html());
        }
    }

    function updatePriceDiff($this, identity) {
        $this.siblings(".zaders-taoxi").find(".price").removeClass("hide").end().end().find(".price").addClass("hide");
        var _base = $this.data("addprice") == 0 ? 0 : $this.data("addprice") || $this.data("addper") || $this.data("price");
        $.each($this.siblings(".zaders-taoxi"), function (i, ele) {
            var this_c = $(ele).data("addprice") == 0 ? 0 : $(ele).data("addprice") || $(ele).data("addper") || $(ele).data("price");
            var this_m = formatMoney(Math.abs(this_c - _base), 0);
            var innerHtml = "";
            if (this_c - _base > 0) {
                innerHtml = "+RMB ";
                identity == "baobaoshuliang" && (this_m = this_m * 100 + "%", innerHtml = "+");
                $(ele).find(".price").html(innerHtml + this_m);
            } else {
                innerHtml = "-RMB ";
                identity == "baobaoshuliang" && (this_m = this_m * 100 + "%", innerHtml = "-");
                $(ele).find(".price").html(innerHtml + this_m);
            }
        })
        if(identity == "paishe"){
            updatePriceDiff($taoxiShengji.find(".zaders-taoxi.active"), "shengji");
        }
    }

    $body.on("tap", ".zaders-taoxi", function (e) {
        var $this = $(this);
        var identity = $this.closest(".section-list").data("identity");
        $this.siblings(".active").removeClass("active").end().addClass("active");
        switch (identity) {
            case "paishe":
                $form.find("input[name=taoxi]").eq($(".zaders-taoxi", $this.closest(".section-list")).index($this)).prop("checked", true);
                $taoxiShengji.find(".plus").data("addprice", $this.data("plus"));
                !!taoxiShengji_Price && (taoxiShengji_Price = $this.data("plus"));
                //taoxiShengji_Price = $this.data("plus");
                taoxiPaishe_Price = $this.data("price");
                $zhaiyaoTaoxi.html($this.find(".title").html());
                updateSummary();
                break;
            case "shengji":
                $form.find("input[name=shengji]").eq($(".zaders-taoxi", $this.closest(".section-list")).index($this)).prop("checked", true);
                taoxiShengji_Price = $this.data("addprice");
                $zhaiyaoTaoxiShengji.html($this.find(".title").html());
                updateSummary();
                break;
            case "fuzhuangdapei":
                $form.find("input[name=fuzhuang]").eq($(".zaders-taoxi", $this.closest(".section-list")).index($this)).prop("checked", true);
                fuzhuangDapei_Price = $this.data("addprice");
                $zhaiyaoFuzhuang.html($this.find(".title").html());
                break;
            case "baobaoshuliang":
                $form.find("input[name=baobao]").eq($(".zaders-taoxi", $this.closest(".section-list")).index($this)).prop("checked", true);
                baobaoShuliang_Per = $this.data("addper");
                $zhaiyaoBaobaoshuliang.html($this.find(".title").html());
                break;
            default:
                break;
        }
        updatePriceDiff($this, identity); //更新价格差异
        updateTotalmoney(); //更新总价格
        //console.log($form.serialize());
    });

    //初始化摘要
    $(".zaders-taoxi.active").trigger("tap");
    //价格初始化
    updateTotalmoney();

    ;(function () {
        var timer; //节流阀 几个功能就需要几个节流阀 互不干扰

        $(".scroll-container").on("scroll", animateForDii).triggerHandler("scroll"); //控制在当前位置刷新触发

        /*core function*/
        function doScroll($target, offset, callback, offEv) {
            var docScroll = $(".scroll-container").scrollTop(),
                winHeight = $(window).height();
            if (docScroll - $target.offset().top - $target.height() > offset) {
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
            }, 40);
        }
    })();

    /*弹出说明层*/
    $(".popup-notes").on("click", function (e) {
        e.preventDefault();
        $("#" + $(this).data("open")).removeClass("hide");
    })

    $(".popup-content").on("click scroll", function (e) {
        e.stopPropagation();
    })
    $(".popup-content .close").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).closest(".popup-content").addClass("hide");
    })

    $("#btn-ok").on("tap", function (e) {
        e.preventDefault();
        $form.submit();
    })
})