/*
syncOrderList
결제내역 화면 전체 반복하면서 저장
*/
async function syncOrderList() {
	$("#parse_log")[0].innerText = "sync order list start";
	// await updatePageInfo();
	
	var lastPageNum = sessionStorage.getItem("lastPageNum");

	for(var pageIdx=1; pageIdx<=lastPageNum; pageIdx++) {	//TODO 주석해제, 전체 데이터 refresh버전
//	for(var pageIdx=2; pageIdx>=1; pageIdx--) {	//TODO 테스트용
//	for(var pageIdx=lastPageNum; pageIdx>=lastPageNum-1; pageIdx--) {	//TODO 테스트용
		$("#parse_log")[0].innerText = pageIdx + "/" + lastPageNum;
		var isContinue = await parseHistoryListPage(pageIdx);
		if(!isContinue) {
			break;
		}
	}
	$("#parse_log")[0].innerText = "sync order list end";
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
		
		var maxOrderSeq = await getMaxOnIdx("o_order_header","order_seq");
		sessionStorage.setItem("maxOrderSeq", maxOrderSeq || -1);
	}
	catch(e) {
		console.error("updateLastPageInfo 오류:", e);
	}
}
/*
parseHistoryListPage
param pageIdx 크롤링할 결제내역 페이지 번호
*/
async function parseHistoryListPage(pageIdx) {
	try {
		const res = await UTIL.request(URL.base+URL.history+"?page="+pageIdx, null, null);
		var htmlDOM = parser.parseFromString(res, "text/html");
		var sectionElement = $(htmlDOM).find("#page_buy_history");
//		return parseHistoryListItem(UTIL.toNumber(pageIdx), sectionElement);
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
	
		var maxOrderSeq = UTIL.toNumber(sessionStorage.getItem("maxOrderSeq")) || -1;
		
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
			var curPage = UTIL.toNumber(pageIdx);
			var midPageCnt = 15 * Math.max(0, lastPageNum - curPage -1);
			var orderSeq = (midPageCnt + lastPageCnt + ((lastPageNum!=curPage)?15:0) - i);
			orderValue.order_seq = orderSeq;
			
			//총 결제금액
			var totalAmtStr = $(orderItem).find(".main_value span")[0].innerText;
			var totalAmt = UTIL.getNumber(totalAmtStr);
			orderValue.total_amt = totalAmt;
			
			setData("o_order_header", orderNo, orderValue);
			
			if(orderSeq <= maxOrderSeq) {
				return false;
			}
		}
		return true;
	}
	catch(e) {
		console.error("parseHistoryListPage 오류:", e);
	}
}

/*
syncOrderDetail
결제내역 화면 전체 반복하면서 저장
*/
async function syncOrderDetail() {
	$("#parse_log")[0].innerText = "sync order detail start";
	
	var maxOrderSeq = UTIL.toNumber(sessionStorage.getItem("maxOrderSeq")) || -1;
	if(maxOrderSeq < 0) {
		$("#parse_log")[0].innerText = "no order detail to sync";
		return;
	}
//	for(var i=maxOrderSeq; i>=1; i--) {	//TODO yslee 개수가 많아서 분할하든 비동기로 바꾸든 해야할 듯
	for(var i=maxOrderSeq; i>=maxOrderSeq-10; i--) {	//TEST
		var orderItem = await getUniqueValue("o_order_header", "order_seq", i);
		if(UTIL.isNotEmpty(orderItem)) {
//			var isExist = UTIL.isNotEmpty(await getValueByIdx("o_order_detail", "order_no", orderItem.order_no));
//			if(isExist) {
//				$("#parse_log")[0].innerText = "sync order detail end1";
//				return;
//			}
			$("#parse_log")[0].innerText = "detail: "+(maxOrderSeq-i) + "/" + maxOrderSeq;
			await parseHistoryDetailPage(orderItem.order_no);
		}
	}

	$("#parse_log")[0].innerText = "sync order detail end";
}
/*
parseHistoryDetailPage
param pageIdx 크롤링할 주문내역 페이지 번호
*/
async function parseHistoryDetailPage(orderNo) {
	try {
		const res = await UTIL.request(URL.base+URL.history+"/"+orderNo, null, null);
		var htmlDOM = parser.parseFromString(res, "text/html");
		var sectionElement = $(htmlDOM).find(".buy_history_detail_table");
		
		var bookIdList = {};
		//책 목록
		var bookTd = UTIL.findNextTdByThTxt(sectionElement, "구분");
		var bookList = $(bookTd).find(".book_title");
		bookList.each(function() {
			//책 ID
			var bookE = $(this).find("a");
			var bookId = bookE.attr("href").replace("/books/","");
			
			//구매금액
			var priceStr = $(this).find(".price").text();
			var price = UTIL.getNumber(priceStr);
			
			bookIdList[bookId] = price;
			
			//TODO book 테이블에서 book_id 검색 후 없으면 need update flag Y로 insert
		});
		
		var orderHeaderItem = {book_list: bookIdList};
		//금액관련
		orderHeaderItem.amt_total = UTIL.findNextTdByThTxt(sectionElement, "주문 금액").find("span.museo_sans").text();
		orderHeaderItem.amt_discount_cupon = UTIL.findNextTdByThTxt(sectionElement, "쿠폰 할인").find("span.museo_sans").text();
		orderHeaderItem.amt_cash = UTIL.findNextTdByThTxt(sectionElement, "리디캐시 사용액").find("span.museo_sans").text();
		orderHeaderItem.amt_point = UTIL.findNextTdByThTxt(sectionElement, "리디포인트 사용액").find("span.museo_sans").text();
//		orderHeaderItem.amt_point_limited = UTIL.findNextTdByThTxt(sectionElement, "리디포인트 사용액").find("span.museo_sans").text();
		orderHeaderItem.amt_pg = UTIL.findNextTdByThTxt(sectionElement, "PG 결제 금액").find("span.museo_sans").text();
		orderHeaderItem.pay_way = UTIL.findNextTdByThTxt(sectionElement, "결제 수단").text();
		orderHeaderItem.reward_ridipoint = UTIL.findNextTdByThTxt(sectionElement, "적립 리디포인트").find("span.museo_sans").text();

		orderHeaderItem.amt_total = UTIL.getNumber(orderHeaderItem.amt_total);
		orderHeaderItem.amt_discount_cupon = UTIL.getNumber(orderHeaderItem.amt_discount_cupon);
		orderHeaderItem.amt_cash = UTIL.getNumber(orderHeaderItem.amt_cash);
		orderHeaderItem.amt_point = UTIL.getNumber(orderHeaderItem.amt_point);
		orderHeaderItem.amt_pg = UTIL.getNumber(orderHeaderItem.amt_pg);
		orderHeaderItem.reward_ridipoint = UTIL.getNumber(orderHeaderItem.reward_ridipoint);

		updateData("o_order_header", orderNo, orderHeaderItem);
		return true;
	}
	catch(e) {
		console.error("parseHistoryDetailPage 오류:", e);
	}
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
