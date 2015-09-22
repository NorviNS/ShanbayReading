$(function(){
	chrome.tabs.query({active: true, currentWindow: true},function(tabs){
		var currentUrl = tabs[0].url;
		if (currentUrl == "http://www.theguardian.com/international"){
			$("#switch a").hide();
			var indexStr = "<p style='text-align:left;'>请进入本站任意一篇文章以启用扇贝阅读^_^</p>";
			$("#noSwitch").append(indexStr);
		}
		else if(currentUrl.indexOf("www.theguardian.com") >=0){
			var state = localStorage.getItem('shanbay');
			$("#switch a").show();
			if(state == 1){
				$("#switch").addClass("stop");
				$("#switch a").html("关闭扇贝阅读模式");
				sendMessage("start");
			}
		}
		else {
			$("#switch a").hide();
			var urlWrongStr = "<p>抱歉，本插件暂不支持该网站</p>";
			$("#noSwitch").append(urlWrongStr);
		}
	});
});


$("#switch a").click(function(){
	if($("#switch").hasClass("stop")){
		$("#switch").removeClass("stop");
		$(this).html("开启扇贝阅读模式");
		localStorage.setItem('shanbay',0);
		sendMessage("stop");
	}
	else {
		$("#switch").addClass("stop");
		$(this).html("关闭扇贝阅读模式");
		localStorage.setItem('shanbay',1);
		sendMessage("start");
	}
});

function sendMessage(msg){
	console.log("send");
	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		console.log(tabs[0].url.indexOf("www.theguardian.com"));
		chrome.tabs.sendMessage(tabs[0].id, {message:msg});
	});
}