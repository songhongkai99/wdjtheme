$(function () {
    var nowDate = new Date(),
        _y = nowDate.getFullYear(),
        _m = nowDate.getMonth(),
        _d = nowDate.getDate();
    var nextYear = new Date(_y + 1, _m, _d),
        new_y = nextYear.getFullYear(),
        new_m = nextYear.getMonth() + 1,
        new_d = nextYear.getDate();
    var $dateS = $(".dateSelectInput");
    //console.log(new_y + '-' + new_m + '-' + new_d)

    var initPickaDate = $dateS.pickadate({
        min: nowDate,
        max: nextYear,
        disable: [1, 7, [2016, 6, 4]], //数组内数字指的周几
        closeOnSelect: false,
        closeOnClear: false,
        onRender: function () {
            if(pickadateApi){
                $(".picker__year").html(pickadateApi.get("view").year + "年" + (pickadateApi.get("view").month + 1) + "月");
            }else{
                $(".picker__year").html((new Date().getFullYear()) + "年" + ((new Date()).getMonth() + 1) + "月");
            }
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
        onlyExternal: true
    });

    $("#pickaDate").on("swipeleft", function (e) {
        //console.log(pickadateApi.get("view").month);
        e.preventDefault();
        $(".picker__nav--next").trigger("click");
        //pickadateApi.set("view", pickadateApi.get("view").month)
        swiperApi.slideNext();
    }).on("swiperight", function (e) {
        e.preventDefault();
        $(".picker__nav--prev").trigger("click");
        swiperApi.slidePrev();
    });

    $(".zaders-radio").on("tap", "span", function () {
        $(this).siblings("span").removeClass("active").end().addClass("active");
        $(":radio[name='order-time']").filter(function (index) {
            return $(this).val() == $(".zaders-radio span.active").data("for");
        }).prop("checked", true);
    });

})