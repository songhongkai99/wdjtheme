$(document).ready(function() {
		
		
		//weixin
		$("#standard_wx").click(function(){
			$("#standard_wx_pop").addClass("standard_wx_pop_start").show();
			$("#standard_wx_bg").show();
			
		});
		$("#standard_wx_bg").click(function(){
			$("#standard_wx_pop").removeClass("standard_wx_pop_start").hide();
			$("#standard_wx_bg").hide();
		});
});
		
