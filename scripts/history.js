/*
getRidiHistoryHTML
결제내역 화면 전체 반복하면서 저장

250724 테스트용으로 마지막페이지만 파싱
*/
async function getRidiHistoryHTML() {
	$("#parse_log")[0].innerText = "start";
	await updatePageInfo();
	
	//updateLastPageInfo 테스트 후 주석 해제
	var lastPageNum = sessionStorage.getItem("lastPageNum");
//	await parseHistory(lastPageNum);
//	await parseHistory(1);

//	for(var pageIdx=1; pageIdx<=lastPageNum; pageIdx++) {	//TODO 주석해제, 전체 데이터 refresh버전
//	for(var pageIdx=2; pageIdx>=1; pageIdx--) {	//TODO 테스트용
	for(var pageIdx=lastPageNum; pageIdx>=lastPageNum-1; pageIdx--) {	//TODO 테스트용
		$("#parse_log")[0].innerText = pageIdx;
		var isContinue = await parseHistory(pageIdx);
		if(!isContinue) {
			break;
		}
	}
	$("#parse_log")[0].innerText = "end";
}
/*
updatePageInfo
결제내역 마지막 페이지 번호, 마지막 페이지에 있는 목록 아이템 수 파싱 및 세션에 저장
*/
async function updatePageInfo() {
	try {
		const res = await UTIL.request(URL.base+URL.history+"?page=999", null, null);
		var htmlDOM = parser.parseFromString(res, "text/html");
		//class="btn_next" 없으면 마지막페이지
		sessionStorage.setItem("lastPageNum", 999);
		if($(htmlDOM).find(".btn_next").length == 0) {
			var itemList = $(htmlDOM).find(".page_this a");
			if(itemList.length > 0) {
				sessionStorage.setItem("lastPageNum", $(htmlDOM).find(".page_this a")[0].innerText);
				sessionStorage.setItem("lastPageCnt", $(htmlDOM).find(".js_rui_detail_link").length);
			}
		}
		
		//class="btn_prev" 없으면 첫페이지
		sessionStorage.setItem("lastPageCnt", 1);
		const res2 = await UTIL.request(URL.base+URL.history+"?page="+sessionStorage.getItem("lastPageNum"), null, null);
		var htmlDOM2 = parser.parseFromString(res2, "text/html");
		sessionStorage.setItem("lastPageCnt", 1);
		if($(htmlDOM2).find(".btn_next").length == 0) {
			sessionStorage.setItem("lastPageCnt", $(htmlDOM2).find(".js_rui_detail_link").length);
		}
		
		var maxOrderSeq = await searchMaxOnIdx("o_order_header","order_seq");
		sessionStorage.setItem("maxOrderSeq", maxOrderSeq);
	}
	catch(e) {
		console.error("updateLastPageInfo 오류:", e);
	}
}

/*
parseHistory
param pageIdx 크롤링할 결제내역 페이지 번호
*/
async function parseHistory(pageIdx) {
	try {
		const res = await UTIL.request(URL.base+URL.history+"?page="+pageIdx, null, null);
		var htmlDOM = parser.parseFromString(res, "text/html");
		var sectionElement = $(htmlDOM).find("#page_buy_history");
		return setList(UTIL.toNumber(pageIdx), sectionElement);
	}
	catch(e) {
		console.error("parseHistory 오류:", e);
	}
}

function setList(curPage, sectionElement) {
	var orderItemList = [];
	var attr = "href";
	var copyRidi = JSON.parse(localStorage.getItem("copyRidi"));
	if(copyRidi.globals.isPc == true) {
		attr = "data-href";
		orderItemList = $(sectionElement).find(".buy_history_table tbody tr.js_rui_detail_link");
	}
	else {
		//TODO 테스트 전, PC/모바일 세팅 방법 모르겠음
		orderItemList = sectionElement.querySelector(".buy_list_wrap").querySelectorAll("li.list_item a");
	}

	var maxOrderSeq = UTIL.toNumber(sessionStorage.getItem("maxOrderSeq"));
	
	for(var i=0; i<orderItemList.length; i++) {
		var orderItem = orderItemList[i];
		var orderValue = {};

		//주문번호
		var orderNo = orderItem.getAttribute(attr);
		orderNo = orderNo.replace(URL.history+"/","");
		orderValue.order_no = orderNo;
		
		//주문시간
		var tdList = $(orderItem).find("td");
		var orderDttm = tdList[0].innerText;
		var dtStr = orderDttm.match(/\d{4}\.\d{2}\.\d{2}/).toString();
		var tmStr = orderDttm.match(/\d{2}:\d{2}/).toString();
		orderValue.order_dttm = moment(dtStr+" "+tmStr, "YYYY.MM.DD HH:mm").toDate();
		orderValue.order_dt = dtStr.replaceAll(".","");
		
		//주문 seq
		var lastPageNum = UTIL.toNumber(sessionStorage.getItem("lastPageNum"));
		var lastPageCnt = UTIL.toNumber(sessionStorage.getItem("lastPageCnt"));
		var midPageCnt = 15 * Math.max(0, lastPageNum - curPage -1);
		var orderSeq = (midPageCnt + lastPageCnt + ((lastPageNum!=curPage)?15:0) - i);
		orderValue.order_seq = orderSeq;
		
		//총 결제금액
		var totalAmtStr = $(orderItem).find(".main_value span")[0].innerText;
		var totalAmt = UTIL.getNumber(totalAmtStr);
		orderValue.total_amt = totalAmt;
		
		//마지막 업데이트 시각
		orderValue.last_update_dttm = moment().toDate();
		
		setData("o_order_header", orderValue, orderNo);
		
		if(orderSeq <= maxOrderSeq) {
			return false;
		}
	}
	return true;
}

async function setRidiGlobalVal() {
	try {
		localStorage.removeItem("copyRidi");
		const res = await UTIL.request(URL.base+URL.history+"?page=999", null, null);
		var htmlDOM = parser.parseFromString(res, "text/html");
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
