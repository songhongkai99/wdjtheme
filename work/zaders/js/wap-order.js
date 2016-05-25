$(function () {

    var $form = $("#form");
    $form.find("input[name=taoxi][value=" + getUrlParam("taoxi") + "]").prop("checked", true);
    $form.find("input[name=shengji][value=" + getUrlParam("shengji") + "]").prop("checked", true);
    $form.find("input[name=fuzhuang][value=" + getUrlParam("fuzhuang") + "]").prop("checked", true);
    $form.find("input[name=baobao][value=" + getUrlParam("baobao") + "]").prop("checked", true);
    var $totalprice = $form.find("input[name=price]");
    $totalprice.val(getUrlParam("price"));
    $(".totalPrice").html(formatMoney($totalprice.val(), 0));

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
        disable: disabled_date,
        closeOnSelect: false,
        closeOnClear: false,
        onRender: function () {
            if (pickadateApi) {
                $(".picker__year").html(pickadateApi.get("view").year + "年" + (pickadateApi.get("view").month + 1) + "月");
            } else {
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
    }).on("tap", ".picker__day", function () {
        if ($(this).is(".picker__day--disabled")) return false;
        if (pickadateApi) {
            setTimeout(function () {
                var apiGet = pickadateApi.get("select");
                if (apiGet) {
                    $(".zhaiyao-time").html(apiGet.year + "年" + (apiGet.month + 1) + "月" + apiGet.date + "日 " /*+ ($(".s-time.active").html() || "")*/);
                }
                $(".zaders-radio > span").removeClass("active");
                $(".zaders-radio > :radio").prop("checked", false);
                //ajax取得上下午是否可用
                $.ajax({
                    type: "GET",
                    url: "data.json", //服务端接口
                    dataType: "json",
                    data: {"time": apiGet}, //发送时间数据
                    success: function (data) {
                        $(".zaders-radio > span:eq(0)").toggleClass("disabled", !data.am);
                        $(".zaders-radio > span:eq(1)").toggleClass("disabled", !data.pm);
                    }
                })
            }, 0);
        }
    });

    $(".zaders-radio").on("tap", "span", function () {
        if ($(this).hasClass("disabled")) return;
        $(this).siblings("span").removeClass("active").end().addClass("active");
        $(":radio[name='order-time']").filter(function (index) {
            return $(this).val() == $(".zaders-radio span.active").data("for");
        }).prop("checked", true);
        var apiGet = pickaDateApi.get("select");
        if (apiGet) {
            $(".zhaiyao-time").html(apiGet.year + "年" + (apiGet.month + 1) + "月" + apiGet.date + "日 " + $(this).html());
        }
    });

    $("#zMobile").on("input paste change", function (e) {
        //console.log(e);
        $.trim($(this).val()) ? $(".zhaiyao-mobile").html($(this).val()) : $(".zhaiyao-mobile").html("请输入您的预约手机号");
    })

})

