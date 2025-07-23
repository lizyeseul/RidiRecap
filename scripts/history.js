async function getRidiHistoryHTML() {
	await updateLastPageInfo();
	
	//updateLastPageInfo 테스트 후 주석 해제
	var lastPageNum = sessionStorage.getItem("lastPageNum");
	// console.log("lastPageNum:", lastPageNum);
	await parseHistory(lastPageNum);
	// for(var pageIdx=lastPageNum; pageIdx>=1; pageIdx--) {
	// 	await parseHistory(pageIdx);
	// }
}

async function updateLastPageInfo() {
	try {
		const res = await UTIL.request(URL.base+URL.history+"?page=999", null, null);
		var htmlDOM = parser.parseFromString(res, "text/html");
		//class="btn_prev" 없으면 첫페이지
		//class="btn_next" 없으면 마지막페이지
		if($(htmlDOM).find(".btn_next").length == 0) {
			var itemList = $(htmlDOM).find(".page_this a");
			if(itemList.length > 0) {
				sessionStorage.setItem("lastPageNum", $(htmlDOM).find(".page_this a")[0].innerText);
				sessionStorage.setItem("lastPageCnt", $(htmlDOM).find(".page_this a").length);
			}
		}
	}
	catch(e) {
		console.error("updateLastPageInfo 오류:", e);
	}
}

async function parseHistory(pageIdx) {
	try {
		const res = await UTIL.request(URL.base+URL.history+"?page="+pageIdx, null, null);
		var htmlDOM = parser.parseFromString(res, "text/html");
		var sectionElement = $(htmlDOM).find("#page_buy_history");
		setList(sectionElement);
	}
	catch(e) {
		console.error("parseHistory 오류:", e);
	}
}

function setList(sectionElement) {
	var listItemList = [];
	var attr = "href";
	var copyRidi = JSON.parse(localStorage.getItem("copyRidi"));
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

async function setRidiGlobalVal() {
	try {
		localStorage.removeItem("copyRidi");
		const res = await UTIL.request(URL.base+URL.history+"?page=999", null, null);
		var htmlDOM = parser.parseFromString(res, "text/html");
		//class="btn_prev" 없으면 첫페이지
		//class="btn_next" 없으면 마지막페이지
		var scripts = $(htmlDOM).find("script");
		var targetStr = null;
		scripts.each(function() {
			var cd = $(this).text();
			if(cd.includes("var Ridi")) {
				targetStr = $(this);
				return false;
			}
		});
		
		if(targetStr) {
			var copyRidi = {};
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

			localStorage.setItem("copyRidi", JSON.stringify(copyRidi));
		}
	}
	catch(e) {
		console.error("setRidiGlobalVal 오류:", e);
	}
}
