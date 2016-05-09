$(function () {
    var nowDate = new Date(),
        _y = nowDate.getFullYear(),
        _m = nowDate.getMonth(),
        _d = nowDate.getDate();
    var maxDate = new Date(_y, _m + 6, _d),
        new_y = maxDate.getFullYear(),
        new_m = maxDate.getMonth() + 1,
        new_d = maxDate.getDate();
    var $dateS = $(".dateSelectInput");
    //console.log(new_y + '-' + new_m + '-' + new_d)

    var initPickaDate = $dateS.pickadate({
        min: nowDate,
        max: maxDate,
        disable: [1, 7], //数组内数字指的周几 也可以是具体日期[2016, 6, 4]
        closeOnSelect: false,
        closeOnClear: false,
        onRender: function () {
            if(pickadateApi){
                var apiGet = pickadateApi.get("select");
                $(".picker__year").html(pickadateApi.get("view").year + "年" + (pickadateApi.get("view").month + 1) + "月");
                if (apiGet){
                    $(".zhaiyao-time").html(apiGet.year + "年" + (apiGet.month + 1) + "月" + apiGet.date + "日 " + $(".s-time.active").html());
                }
            }else{
                $(".picker__year").html((new Date().getFullYear()) + "年" + ((new Date()).getMonth() + 1) + "月");
            }
            //console.log(pickadateApi);
        }
    });
    var pickadateApi = initPickaDate.pickadate("picker");
    //api.set("view", new Date(_y, _m + i, _d));
    pickadateApi.open();
    $(document).off("click");
    window.pickaDateApi = pickadateApi;

    window.swiperApi = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        //paginationClickable: false,
        onlyExternal: false,
        prevButton: '.swiper-button-prev',
        nextButton: '.swiper-button-next',
        onSlideChangeStart: function () {
            updatePicka();
        }
    });

    function updatePicka() {
        //console.log(swiperApi,_m); //swiperApi.activeIndex
        pickaDateApi.set("view", new Date(_y, _m + swiperApi.activeIndex, _d));
    }

    $("#pickaDate").on("swipeleft", function (e) {
        //console.log(pickadateApi.get("view").month);
        e.preventDefault();
        e.stopPropagation();
        $(".picker__nav--next").trigger("click");
        //pickadateApi.set("view", pickadateApi.get("view").month)
        swiperApi.slideNext();
    }).on("swiperight", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".picker__nav--prev").trigger("click");
        swiperApi.slidePrev();
    });

    $(".zaders-radio").on("tap", "span", function () {
        $(this).siblings("span").removeClass("active").end().addClass("active");
        $(":radio[name='order-time']").filter(function (index) {
            return $(this).val() == $(".zaders-radio span.active").data("for");
        }).prop("checked", true);
    });

    $(".s-time").on("tap", function (e) {
        var apiGet = pickaDateApi.get("select");
        if (apiGet) {
            $(".zhaiyao-time").html(apiGet.year + "年" + (apiGet.month + 1) + "月" + apiGet.date + "日 " + $(this).html());
        }
    })

    $("#zMobile").on("input", function (e) {
        //console.log(e);
        $.trim($(this).val()) ? $(".zhaiyao-mobile").html($(this).val()) : $(".zhaiyao-mobile").html("请输入您的预约手机号");
    })

    var inter = null;
    $(".btn.re-send").on("tap", function () {
        if(inter) return false;
        var $this = $(this), timer = 5; //自定义时间多少秒
        $this.prop("disabled", true).html(timer+"s");
        inter = setInterval(function () {
            $this.html(--timer + "s");
            if(timer == 0){
                clearInterval(inter);
                inter = null;
                $this.prop("disabled", false).html("重新发送");
            }
        }, 1000);
    })

})