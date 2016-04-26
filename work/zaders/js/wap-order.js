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
        closeOnClear: false
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
        $(".picker__nav--next").click();
        //pickadateApi.set("view", pickadateApi.get("view").month)
        swiperApi.slideNext();
    }).on("swiperight", function (e) {
        $(".picker__nav--prev").click();
        swiperApi.slidePrev();
    });
})