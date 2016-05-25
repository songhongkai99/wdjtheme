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

/*取得url参数*/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURIComponent(r[2]);
    return null;
}

function wdjthemeCheck(element, type, value) {
    var checkvalue = value.replace(/(^\s*)|(\s*$)/g, "");
    switch (type) {
        case "required":
            return /[^(^\s*)|(\s*$)]/.test(checkvalue);
            break;
        case "chinese":
            return /^[\u0391-\uFFE5]+$/.test(checkvalue);
            break;
        case "number":
            return /^([+-]?)\d*\.?\d+$/.test(checkvalue);
            break;
        case "integer":
            return /^-?[1-9]\d*$/.test(checkvalue);
            break;
        case "plusinteger":
            return /^[1-9]\d*$/.test(checkvalue);
            break;
        case "unplusinteger":
            return /^-[1-9]\d*$/.test(checkvalue);
            break;
        case "znumber":
            return /^[1-9]\d*|0$/.test(checkvalue);
            break;
        case "fnumber":
            return /^-[1-9]\d*|0$/.test(checkvalue);
            break;
        case "double":
            return /^[-\+]?\d+(\.\d+)?$/.test(checkvalue);
            break;
        case "plusdouble":
            return /^[+]?\d+(\.\d+)?$/.test(checkvalue);
            break;
        case "unplusdouble":
            return /^-[1-9]\d*\.\d*|-0\.\d*[1-9]\d*$/.test(checkvalue);
            break;
        case "english":
            return /^[A-Za-z]+$/.test(checkvalue);
            break;
        case "username":
            return /^[a-z]\w{3,}$/i.test(checkvalue);
            break;
        case "mobile":
            return /^\s*(15\d{9}|13\d{9}|14\d{9}|17\d{9}|18\d{9})\s*$/.test(checkvalue);
            break;
        case "phone":
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/.test(checkvalue);
            break;
        case "tel":
            return /^((\(\d{3}\))|(\d{3}\-))?13[0-9]\d{8}?$|15[89]\d{8}?$|170\d{8}?$|147\d{8}?$/.test(checkvalue) || /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/.test(checkvalue);
            break;
        case "email":
            return /^[^@]+@[^@]+\.[^@]+$/.test(checkvalue);
            break;
        case "url":
            return /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(checkvalue);
            break;
        case "ip":
            return /^[\d\.]{7,15}$/.test(checkvalue);
            break;
        case "qq":
            return /^[1-9]\d{4,10}$/.test(checkvalue);
            break;
        case "currency":
            return /^\d+(\.\d+)?$/.test(checkvalue);
            break;
        case "zipcode":
            return /^[1-9]\d{5}$/.test(checkvalue);
            break;
        case "chinesename":
            return /^[\u0391-\uFFE5]{2,15}$/.test(checkvalue);
            break;
        case "englishname":
            return /^[A-Za-z]{1,161}$/.test(checkvalue);
            break;
        case "age":
            return /^[1-99]?\d*$/.test(checkvalue);
            break;
        case "date":
            return /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$/.test(checkvalue);
            break;
        case "datetime":
            return /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-)) (20|21|22|23|[0-1]?\d):[0-5]?\d:[0-5]?\d$/.test(checkvalue);
            break;
        case "idcard":
            return /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/.test(checkvalue);
            break;
        case "bigenglish":
            return /^[A-Z]+$/.test(checkvalue);
            break;
        case "smallenglish":
            return /^[a-z]+$/.test(checkvalue);
            break;
        case "color":
            return /^#[0-9a-fA-F]{6}$/.test(checkvalue);
            break;
        case "ascii":
            return /^[\x00-\xFF]+$/.test(checkvalue);
            break;
        case "md5":
            return /^([a-fA-F0-9]{32})$/.test(checkvalue);
            break;
        case "zip":
            return /(.*)\.(rar|zip|7zip|tgz)$/.test(checkvalue);
            break;
        case "img":
            return /(.*)\.(jpg|gif|ico|jpeg|png)$/.test(checkvalue);
            break;
        case "doc":
            return /(.*)\.(doc|xls|docx|xlsx|pdf)$/.test(checkvalue);
            break;
        case "mp3":
            return /(.*)\.(mp3)$/.test(checkvalue);
            break;
        case "video":
            return /(.*)\.(rm|rmvb|wmv|avi|mp4|3gp|mkv)$/.test(checkvalue);
            break;
        case "flash":
            return /(.*)\.(swf|fla|flv)$/.test(checkvalue);
            break;
        case "radio":
            var radio = element.closest('form').find('input[name="' + element.attr("name") + '"]:checked').length;
            return eval(radio == 1);
            break;
        default:
            var $test = type.split('#');
            if ($test.length > 1) {
                switch ($test[0]) {
                    case "compare":
                        return eval(Number(checkvalue) + $test[1]);
                        break;
                    case "regexp":
                        return new RegExp($test[1], "gi").test(checkvalue);
                        break;
                    case "length":
                        var $length;
                        if (element.attr("type") == "checkbox") {
                            $length = element.closest('form').find('input[name="' + element.attr("name") + '"]:checked').length;
                        } else {
                            $length = checkvalue.replace(/[\u4e00-\u9fa5]/g, "***").length;
                        }
                        return eval($length + $test[1]);
                        break;
                    case "ajax":
                        var $getdata;
                        var $url = $test[1] + checkvalue;
                        $.ajaxSetup({
                            async: false
                        });
                        $.getJSON($url, function (data) {
                            $getdata = data.getdata;
                        });
                        if ($getdata == "true") {
                            return true;
                        }
                        break;
                    case "repeat":
                        return checkvalue == jQuery('input[name="' + $test[1] + '"]').eq(0).val();
                        break;
                    default:
                        return true;
                        break;
                }
                break;
            } else {
                return true;
            }
    }
}


$(function () {
    /*表单验证*/
    $("body").append('<div class="error-container"></div>');
    var errorFlag = true;
    $('form').on("submit", function (e) {
        $(this).find('input[data-validate],textarea[data-validate],select[data-validate]').each(function (i, ele) {
            var e = $(ele);
            var $checkdata = e.attr("data-validate").split(',');
            var $checkvalue = e.val();
            var $checktext = "";
            if (e.attr("placeholder") == $checkvalue) {
                $checkvalue = "";
            }
            if ($checkvalue != "" || e.attr("data-validate").indexOf("required") >= 0) {
                for (var ii = 0; ii < $checkdata.length; ii++) {
                    var $checktype = $checkdata[ii].split(':');
                    if (!wdjthemeCheck(e, $checktype[0], $checkvalue)) {
                        errorFlag = false;
                        $checktext = $checktext + "<p>" + $checktype[1] + "</p>";
                        if (errorFlag) {

                        } else {
                            $(".error-container").html($checktext).stop(true,true).fadeIn(200).delay(1000).fadeOut();
                        }
                        return false; //退出循环 抛出第一个错误
                    }else{
                        errorFlag = true;
                    }
                }
            }
        });
        if (!errorFlag) {
            return false;
        }
    });

    /*发送验证码*/
    var inter = null;
    $(".btn.re-send").on("tap", function () {
        var $zmobile = $("#zMobile");
        if(!wdjthemeCheck($zmobile,"mobile",$zmobile.val())){
            alert("请输入正确的手机号");
            return false;
        }
        if (inter) return false;
        //发送验证码
        var $this = $(this), timer = 5; //自定义时间多少秒
        $.ajax({
            type: "GET",
            url: "data1.json?zmobile=" + $zmobile.val(), //服务端接口
            dataType: "json",
            success: function (data) { //json格式{"status":"ok"}
                if (data.status == "ok") {
                    $this.prop("disabled", true).html(timer + "s");
                    inter = setInterval(function () {
                        $this.html(--timer + "s");
                        if (timer == 0) {
                            clearInterval(inter);
                            inter = null;
                            $this.prop("disabled", false).html("重新发送");
                        }
                    }, 1000);
                } else {
                    alert("发送验证码错误")
                }
            },
            error: function (xhr, textstatus, et) {
                //console.log(xhr.responseText);
                alert(textstatus + et);
            }
        })
    })


})
