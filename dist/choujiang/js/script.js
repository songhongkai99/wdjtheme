var g_persons = [
    "宋宏磊",
    "宋红凯",
    "王某",
    "张某",
    "朱某"
]; //设置抽奖人
var g_Interval = 6;
var g_PersonCount = 500;//参加抽奖人数
var g_Timer;
var running = false;
function beginRndNum(trigger) {
    if (running) {
        running = false;
        clearTimeout(g_Timer);
        $(trigger).val("开始");
        $('#ResultNum').css('color', 'red');
    }
    else {
        running = true;
        $('#ResultNum').css('color', 'black');
        $(trigger).val("停止");
        beginTimer();
    }
}

function updateRndNum() {
    var num = Math.floor(Math.random() * (g_persons.length + 1));
    $('#ResultNum').html(g_persons[num]);
}

function beginTimer() {
    g_Timer = setTimeout(beat, g_Interval);
}

function beat() {
    g_Timer = setTimeout(beat, g_Interval);
    updateRndNum();
}

//进入全屏
function requestFullScreen() {
    var de = document.documentElement;
    if (de.requestFullscreen) {
        de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen();
    } else if (de.msRequestFullscreen) {
        de.msRequestFullscreen();
    }
}

$(document).on("click", function () {
    requestFullScreen();
}).on("keydown", function (e) {
    console.log(e)
    if(e.which == 32 || e.keyCode == 32){
        $("#btn").click();
    }
})