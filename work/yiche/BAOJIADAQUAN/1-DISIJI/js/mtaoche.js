$(document).ready(function(){
	// search popup
	$('#btnSearch').click(function(){
		$('#pSearch').fadeIn(100);
	});
	$('#btnCloseSearch').click(function(){
		$('#pSearch').fadeOut(100);
	});

	// search pop height
	var documentHeight = $(document).height();
    $('#pSearch').css('height', documentHeight);

    // 车款列表弹出层
    var documentHeight = $(document).height(); // 页面内容的高度
	var chooseCarPopupHeight = $('#chooseCarPopup').height(); // 弹出层高度
	chooseCarPopupHeight = (documentHeight > chooseCarPopupHeight) ? documentHeight : chooseCarPopupHeight; // 判断是页面高还是弹出层高，然后赋值
	$('#chooseCarPopup').css('height', chooseCarPopupHeight);


	// 选车工具弹出层
	$("#btn").click(function(){
		$(".swipeLeft").addClass("swipeLeft-block");
		$(".leftmask").show();
	});
	$(".leftmask").click(function(){
		$(".swipeLeft").removeClass("swipeLeft-block");
		$(this).hide();
	});
 
	var documentHeight = $(document).height(); // 页面内容的高度
	var leftPopupHeight = $('.leftPopup').height(); // 弹出层高度
	leftPopupHeight = (documentHeight > leftPopupHeight) ? documentHeight : leftPopupHeight;
	$('.leftmask, .leftPopup').css('height', leftPopupHeight);
	
});

