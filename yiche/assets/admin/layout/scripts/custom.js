var hkcustom = {

    showKeyPress: function (evt) { //捕获键盘事件
        var keynum;
        if (window.event) {
            keynum = evt.keyCode;
        } else if (evt.which) {
            keynum = evt.which;
        }
        return this.checkSpecificKey(keynum);
    },

    checkSpecificKey: function (keyCode) { //禁止输入特殊字符
        var specialKey = "_|{}\/\\<>()^*\'\"+,";
        var realkey = String.fromCharCode(keyCode);
        var flg = false;
        flg = (specialKey.indexOf(realkey) >= 0);
        if (flg) {
            console.log('select2插件禁止输入特殊字符: ' + realkey);
            return false;
        } else {
            return true;
        }
    },

    preventSelect2_custominput: function () { //阻止select2 输入特殊字符
        $(document).on("keypress", "[id^='s2id_']", function (e) {
            return hkcustom.showKeyPress(e);
        })
    },

    initBootstrapModal: function () { //模态框编辑修改初始化,多个模态框请用,分隔
        $(".modal").on("hidden.bs.modal", function () { // hidden 完全隐藏出发 防止因为溢出层导致的不必要触发
            $("form", this).each(function () {
                $(this)[0].reset();
                $("#id").val("");
                $.fn.validate && $(this).validate().resetForm();
                $(".form-group", this).removeClass("has-error");
            })
        })
    },

    handleIframeHeight: function () {
        if ($(".page-iframe").length) {
            var e = $(window.top.document.getElementById("page-iframe"));
            if (e.parent().height() > $(document).height())
                e.css("height", e.parent().height() + "px");
            else
                e.css("height", ($(document).height() <= 400 ? 400 : $(document).height()) + "px");
        }
    },

    handleTopMenubar: function () {
        $("#topMenubar").on("click", "li", function () {
            $(this).siblings("li").removeClass("active").end().addClass("active");
            var $leftbar = $(".leftMenubar"),
                $thisa = $leftbar.filter(".for-topmenubar-" + $(this).index()).first().find("ul:first li:first a");
            $leftbar.removeClass("active").addClass("hide").filter(".for-topmenubar-" + $(this).index()).removeClass("hide").first().find("ul:first li:first a").click();
            ($thisa.attr("href") != "#" && $.trim($thisa.attr("href")) != "" && $thisa.attr("href") != "javascript:;") && $("#page-iframe").attr("src", $thisa.attr("href"));
        })
    },

    handleSidebarMenu: function () {
        $(".page-sidebar-menu").on("click", ">li>ul>li>a", function () {
            $(".page-sidebar-menu>li").removeClass("active");
            $(this).closest("ul").closest("li").addClass("active");
            $(".page-sidebar-menu>li li").removeClass("active");
            $(this).closest("li").addClass("active");
        })
    },

    handleDatePicker: function () {
        $().datepicker && $(".date-picker").datepicker({
            autoclose: true,
            format: "yyyy-mm-dd",
            language: "zh-CN"
        });
    },

    handleSelect2: function () {
        $().select2 && $(".select2").select2({
            minimumResultsForSearch: -1 //disable search option
        });
    },

    handleModalPosition: function () {
        $(".page-iframe").on("show.bs.modal", ".modal", function () {
            var st = $(top).scrollTop();
            $(".modal-dialog", this).css({
                "marginTop": (st > 30 ? st : st + 30) + "px"
            })
        })
    },

    handleValidateForm: function () {
        if ($.validator) {
            var form1 = $('form');
            form1.each(function (i, e) {
                var error1 = $('.alert-danger', $(this));
                var success1 = $('.alert-success', $(this));
                $(this).validate({
                    errorElement: 'span', //default input error message container
                    errorClass: 'help-block help-block-error', // default input error message class
                    focusInvalid: true, // do not focus the last invalid input

                    ignore: "",  // validate all fields including form hidden input
                    rules: {},

                    invalidHandler: function (event, validator) { //display error alert on form submit
                        //alert("您的输入有误, 请您更正错误后重新提交.")
                    },

                    highlight: function (element) { // hightlight error inputs
                        $(element)
                            .closest('.form-group').addClass('has-error'); // set error class to the control group
                    },

                    unhighlight: function (element) { // revert the change done by hightlight
                        $(element)
                            .closest('.form-group').removeClass('has-error'); // set error class to the control group
                    },

                    success: function (label) {
                        label
                            .closest('.form-group').removeClass('has-error'); // set success class to the control group
                    },

                    submitHandler: function (form) {
                        form.submit();
                    }
                });
            })
        }

    },

    hanldeDataTableInit: function () {
        $.fn.dataTable && ($.fn.dataTable.defaults.fnInitComplete = function () {
            //hkcustom.handleIframeHeight();
        })
    },

    handleLoginStatus: function () {
        if(!localStorage.getItem("wdj-logon-status") && !sessionStorage.getItem("wdj-logon-status")) {
            location = "login.html"
        }
    },

    getURLParameter: function () {
        var result = {};
        var params = (window.location.search.split('?')[1] || '').split('&');
        for (var param in params) {
            if (params.hasOwnProperty(param)) {
                var paramParts = params[param].split('=');
                result[paramParts[0]] = decodeURIComponent(paramParts[1] || "");
            }
        }
        return result;
    },

    init: function () {
        this.preventSelect2_custominput();
        this.initBootstrapModal();
        this.handleTopMenubar();
        this.handleSidebarMenu();
        this.handleIframeHeight();
        Base.addResizeHandler(hkcustom.handleIframeHeight);
        this.handleDatePicker();
        this.handleSelect2();
        this.handleModalPosition();
        this.handleValidateForm();
        this.hanldeDataTableInit();
        this.handleLoginStatus();
    }

};