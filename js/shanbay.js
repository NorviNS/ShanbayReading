
$(function(){
	if(window.location.href != "http://www.theguardian.com/international" && window.location.href.indexOf("www.theguardian.com")>=0){
		if(localStorage.getItem('shanbay') == 1){
			hide();
			addDict();
			addPage();
			console.log("1");
		}
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) {
				if (request.message == "start" && localStorage.getItem('shanbay') != 1){
					hide();
					addDict();
					addPage();
					console.log("2");
					localStorage.setItem('shanbay',1);
				}else if(request.message == "stop" && localStorage.getItem('shanbay') != 0) {
					localStorage.setItem('shanbay',0);
					window.location.href=window.location.href;
				}
			}
		);
	}
});

$(window).dblclick(function(e){
	$(".selection-sharing").remove();
	var word = window.getSelection().getRangeAt(0).toString();
	if(word != null && word != ""){
		var rng = window.getSelection().getRangeAt(0);
		$.get("https://api.shanbay.com/bdc/search/?word=" + word,function(data){
			var shanbayData = eval(data);
			if(shanbayData["msg"] == "SUCCESS"){
				var imgURL = chrome.extension.getURL("img/pronunciation.png");
				showDict(shanbayData,e.pageX,e.pageY,imgURL);
			}
		});
	}
});

function clickOutDict(e){
	var word = window.getSelection().getRangeAt(0).toString();
	//判断鼠标不在wordDict范围内
	var dictLeft = eval($("#wordDict").css('left').substring(0,$("#wordDict").css('left').length-2));
	var dictTop = eval($("#wordDict").css('top').substring(0,$("#wordDict").css('top').length-2));
	if(e.pageX < dictLeft || e.pageX > dictLeft+$("#wordDict").width() || e.pageY < dictTop || e.pageY > dictTop + $("#wordDict").height()){
		$("#wordDict").hide();
		$(window).click(function(){});
	}
}

function hide(){
	$("div").hide();
	$(".l-side-margins").show();
	$(".l-side-margins #article div").show();
	$(".l-side-margins #article aside").remove();
	$(".content__labels").remove();
	$(".content__meta-container").remove();
	$(".content__secondary-column").remove();
	$(".submeta").remove();
}

function addDict(){
	var appendStr = "";
	appendStr += "<div class='wordDict' id='wordDict'>";
	appendStr += "<audio src='' controls='controls' style='display:none;' id='audio'></audio>"
	appendStr += "<div id='dictArea'></div>";
	appendStr += "</div>";
	appendStr += "<style>.content__main-column{margin: auto 0;max-width: none;}";
	appendStr += "figure{width:80%;margin:auto !important;}</style>";
	$("body").append(appendStr);
	var pageStr  = "<div class='pageUL'></div>";
	$(".l-side-margins").append(pageStr);
}

function addPage(){
	if($(".l-side-margins").height() > $(window).height()){
		var pageStr = "";
		for(var i=0;i<($("body").height()/($(window).height()-90));i++){
			pageStr += "<a>" + (i+1) + "</a>";
		}
		$(".l-side-margins .pageUL").empty();
		$(".l-side-margins .pageUL").append(pageStr);

		var styleStr = "<style style='text/css'>#article{height:" + ($(window).height()-85) + "px;";
		styleStr += "overflow:hidden;}</style>";
		styleStr += "<script>$('.pageUL a').click(function(){";
		styleStr += "$('.pageUL a').each(function(){$(this).css('background','transparent')});";
		styleStr += "$(this).css('background','#E1FFEA');";
		styleStr += "var pageNum = $(this).html()-1;";
		styleStr += "if(pageNum == 0) {$('header.content__head').animate({'margin-top': '0px'},600);}";
		styleStr += "else { console.log(pageNum + ',' + ($(window).height()-20) + ',' + (-pageNum*($(window).height()-70) + 100) + 'px');";
		styleStr += "$('header.content__head').animate({'margin-top':(-pageNum*($(window).height()-90)) + 'px'},600);}";
		styleStr += "});</script>";
		$(".l-side-margins .pageUL").append(styleStr);
	}
}

function changePage(pageNum){
	alert(pageNum);
}

function showDict(data,left,top,imgURL){
	var appendStr = "";
	appendStr += "<p>读音：" + data["data"]["pronunciation"] + "<span>";
	appendStr += "<img onclick='document.getElementById(\"audio\").play()' src='" + imgURL + "' class='pronunciation' id='pronunciation'/>";
	appendStr += "</span></p><br>";
	appendStr += "<p>翻译：" + data["data"]["cn_definition"]["defn"] + "<br></p>";
	$("#wordDict audio").attr("src",data["data"]["audio"]);
	$("#dictArea").empty();
	$("#dictArea").append(appendStr);
	if(left+$("#wordDict").width() < $(window).width()){
		$("#wordDict").css('left',left-25);
		$("#wordDict").removeClass("left");
	}
	else {
		$("#wordDict").css('left',left-$("#wordDict").width()+25);
		$("#wordDict").addClass("left");
	}
	if(top + 55 - $(window).scrollTop()+$("#wordDict").height() < $(window).height()){
		$("#wordDict").css('top',top+15);
		$("#wordDict").removeClass("up");
	}
	else{
		$("#wordDict").css('top',top-$("#wordDict").height()-65);
		$("#wordDict").addClass("up");
		var triTop = $("#wordDict:before").css('top');
		console.log(triTop);
		triTop += $("#wordDict").height();
		$("#wordDict.up:before").css('top',triTop);
	}
	
	$("#wordDict").show();
	$(window).click(function(e){
		clickOutDict(e);
	});
}