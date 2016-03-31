var $sectionbox = $('#fullpage'),
         $iframe = $sectionbox.find('#iframe1'),
         $touchNo = $sectionbox.find('.touchNo');

function prev() {
    $.fn.fullpage.moveSectionUp();
}

function next() {
    $.fn.fullpage.moveSectionDown();
}

function msgshow() {
    $("#standard_wx_pop").addClass("standard_wx_pop_start").show();
    $("#standard_wx_bg").show();
}

function msghide() {
    $("#standard_wx_pop").removeClass("standard_wx_pop_start").hide();
    $("#standard_wx_bg").hide();
}

$(function () {
    $sectionbox.fullpage({
        css3: true,
        scrollingSpeed: 700,
        controlArrows: false,
        verticalCentered: false,
        anchors: ['page1', 'page2'],
        afterLoad: function (anchorLink, index) {
            $touchNo.hide();
        },
        onLeave: function (index, nextIndex, direction) {

            var leavingSection = $(this);
            //console.log(nextIndex, direction)
            if (nextIndex == 2 && direction == 'down') {
                $('.context_scroll', $iframe[0].contentWindow.document)[0].scrollTop = 1;
                $touchNo.show();
            }


        }
    });
    $iframe.height(document.body.clientHeight);
    $touchNo.height(document.body.clientHeight);
    $touchNo.touches({
        touchstart: function (ev) {
            ev.preventDefault();
        }
    })
})