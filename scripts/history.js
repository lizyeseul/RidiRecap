function setList(sectionElement) {
	var listItemList = [];
	var refList = [];
	var attr = "href";
	if(copyRidi.globals.isPc == true) {
		attr = "data-href";
		listItemList = $(sectionElement).find(".buy_history_table tbody tr");
	}
	else {
		listItemList = sectionElement.querySelector(".buy_list_wrap").querySelectorAll("li.list_item a");
	}

	for(var i=0; i<listItemList.length; i++){
		var temp = listItemList[i].getAttribute(attr);
		temp = temp.replace(URL.history+"/","");
		addData("order_list",{"order_no": temp},temp);
	}
}

function setRidiGlobalVal() {
	var scripts = $(GD.historyDOM).find("script");
	var targetStr = null;
	scripts.each(function() {
		var cd = $(this).text();
		if(cd.includes("var Ridi")) {
			targetStr = $(this);
			return false;
		}
	});
	
	if(targetStr) {
		if(UTIL.isEmpty(targetStr)) return;
		
		var code = targetStr[0].innerText;
		var match = code.match(/Ridi\.globals\s*=\s*({[\s\S]*?});/);
		if(match){
			var jsonLike = match[1];
			copyRidi.globals = JSON.parse(UTIL.jsObjectToJson(jsonLike));
		}
		
		match = code.match(/Ridi\.Auth\s*=\s*([\s\S]*?);/);
		if(match){
			var temp = match[1];
			copyRidi.Auth = (temp == 'true');
		}
		
		match = code.match(/Ridi\.Platform\s*=\s*'([\s\S]*?)';/);
		if(match){
			var temp = match[1];
			copyRidi.Platform = temp;
		}
	}
	
	if(copyRidi.Auth == true) {
		var sectionElement = $(GD.historyDOM).find("#"+GD.section_id);
		setList(sectionElement);
	}
}

function getRidiHistoryHTML() {
	UTIL.request(URL.base+URL.history, null, function(res) {
		var htmlDOM = parser.parseFromString(res, "text/html");
		GD.historyDOM = htmlDOM;
		setRidiGlobalVal();
	}, function(e) {
		console.log("fail");
	});
}