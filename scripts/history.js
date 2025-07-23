async function getRidiHistoryHTML() {
	await updateLastPageInfo();
	
	//updateLastPageInfo 테스트 후 주석 해제
//	for(var pageIdx=GD.lastPageNum; pageIdx>=1; pageIdx--) {
//		await parseHistory(pageIdx);
//	}
}

function updateLastPageInfo() {
	UTIL.request(URL.base+URL.history+"?page=999", null, function(res) {
		var htmlDOM = parser.parseFromString(res, "text/html");
//		GD.historyDOM = htmlDOM;
//class="btn_prev" 없으면 첫페이지
//class="btn_next" 없으면 마지막페이지
		if(UTIL.isEmpty($(htmlDOM).find(".btn_next"))) {
			var itemList = $(htmlDOM).find(".page_this a");
			if(UTIL.isNotEmpty(itemList)) {
				GD.lastPageNum = $(".page_this a")[0].innerText;
				GD.lastPageCnt = $(".page_this a").length;
			}
		}
		resolve(true);
	}, function(e) {
		console.log("fail");
	});
}

function parseHistory(pageIdx) {
	UTIL.request(URL.base+URL.history+"?page="+pageIdx, null, function(res) {
		var htmlDOM = parser.parseFromString(res, "text/html");
		GD.historyDOM = htmlDOM;
		
		if(pageIdx >= GD.lastPageNum) {
//class="btn_prev" 없으면 첫페이지
//class="btn_next" 없으면 마지막페이지
			if(UTIL.isEmpty($(htmlDOM).find(".btn_next"))) {
				var itemList = $(htmlDOM).find(".page_this a");
				if(UTIL.isNotEmpty(itemList)) {
					GD.lastPageNum = $(".page_this a")[0].innerText;
					GD.lastPageCnt = $(".page_this a").length;
				}
			}
		}

		var sectionElement = $(htmlDOM).find("#page_buy_history");
		setList(sectionElement);
//		setRidiGlobalVal();
	}, function(e) {
		console.log("fail");
	});
}

function setList(sectionElement) {
	var listItemList = [];
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
		setData("order_list",{"order_no": temp},temp);
	}
}

function setRidiGlobalVal() {
	//250723 미사용
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
}
