import DB from "../../scripts/connect_db.js";
var SYNC_ORDER = {
	syncOrderRecent: async function(setIngPage) {
		let maxOrderSeq = await DB.getValueByIdx("store_order","order_seq", {direction: "prev", limit: 1});
		if(UTIL.isEmpty(maxOrderSeq[0])) return;

		maxOrderSeq = maxOrderSeq[0].order_seq;
		let lastPageNum = UTIL.toNumber(sessionStorage.getItem("lastPageNum"));
		let lastPageCnt = UTIL.toNumber(sessionStorage.getItem("lastPageCnt"));
		let lastOrderSeq = (lastPageNum-1) * 15 + lastPageCnt;
		if(maxOrderSeq >= lastOrderSeq) return;

		await SYNC_ORDER.syncOrder(1, Math.floor(((lastOrderSeq-maxOrderSeq)+14) / 15), setIngPage);
	},
	syncOrder: async function(fromPage, toPage, setIngPage) {
		const pageTasks = [];
		let processedCount = 0; // 전역 카운터
		setIngPage("stage 1/2 : "+UTIL.toString(processedCount)+"/"+UTIL.toString(toPage - fromPage + 1));
		for (let pageIdx = fromPage; pageIdx <= toPage; pageIdx++) {
			pageTasks.push(async () => {
				const orderNoList = await this.parseHistoryListPage(pageIdx, false);
				setIngPage("stage 1/2 : "+UTIL.toString(processedCount++)+"/"+UTIL.toString(toPage - fromPage + 1));
				return { pageIdx, orderNoList };
			});
		}

		// 1. 페이지를 병렬로 요청하여 모든 주문번호 수집
		const pageResults = await UTIL.runWithConcurrencyLimit(pageTasks, 20);
		pageResults.sort((a, b) => a.pageIdx - b.pageIdx);
		const allOrderNoList = pageResults.flatMap(res => res.orderNoList);

		// 2. 주문 상세 병렬 처리 + 진행 상황 라벨 유지
		processedCount = 0;
		let endPage = "/"+UTIL.toString((toPage * 15) - (fromPage * 15 - 14) + 1);
		setIngPage("stage 2/2 : "+UTIL.toString(processedCount)+endPage);
		const orderTasks = allOrderNoList.map(orderNo => async () => {
			await this.parseHistoryDetailPage(orderNo);
			setIngPage("stage 2/2 : "+UTIL.toString(processedCount++)+endPage);
		});
		await UTIL.runWithConcurrencyLimit(orderTasks, 50);
	},
	/*
	param pageIdx 크롤링할 결제내역 페이지 번호
	*/
	parseHistoryListPage: async function(pageIdx) {
		try {
			var res = await UTIL.request(URL.base+URL.history+"?page="+pageIdx, null, null);
			var htmlDOM = parser.parseFromString(res, "text/html");
			var sectionElement = $(htmlDOM).find("#page_buy_history");
			var orderItemList = [];
			var attr = "href";
			var copyRidi = JSON.parse(localStorage.getItem("copyRidi"));
			if(copyRidi.globals.isPc == true) {
				attr = "data-href";
				orderItemList = $(sectionElement).find(".buy_history_table tbody tr.js_rui_detail_link");
			}
			else {
				//모바일 결제내역 화면 버전, 미개발상태
				orderItemList = $(sectionElement).find(".buy_list_wrap li.list_item a");
			}
			var orderNoList = [];
			var lastPageNum = UTIL.toNumber(sessionStorage.getItem("lastPageNum"));
			var lastPageCnt = UTIL.toNumber(sessionStorage.getItem("lastPageCnt"));
			for(var i=0; i<orderItemList.length; i++) {
				var orderItem = orderItemList[i];
				var orderValue = {};
		
				//주문번호
				var orderNo = orderItem.getAttribute(attr);
				orderNo = orderNo.replace(URL.history+"/","");
				orderValue.order_no = orderNo;
				orderNoList.push(orderNo);
				
				//주문시간
				var tdList = $(orderItem).find("td");
				var orderDttm = tdList[0].innerText;
				orderValue.order_dttm = moment(UTIL.toString(UTIL.getNumber(orderDttm)), "YYYYMMDDHHmm").toDate();
//				var dtStr = orderDttm.match(/\d{4}\.\d{2}\.\d{2}/).toString();
//				var tmStr = orderDttm.match(/\d{2}:\d{2}/).toString();
//				orderValue.order_dttm = moment(dtStr+" "+tmStr, "YYYY.MM.DD HH:mm").toDate();
//				orderValue.order_dt = dtStr.replaceAll(".","");
				
				//주문 seq
				var curPage = UTIL.toNumber(pageIdx);
				var midPageCnt = 15 * Math.max(0, lastPageNum - curPage -1);
				var orderSeq = (midPageCnt + lastPageCnt + ((lastPageNum!=curPage)?15:0) - i);
				orderValue.order_seq = orderSeq;
				
				//총 결제금액
				var totalAmtStr = $(orderItem).find(".main_value span")[0].innerText;
				var totalAmt = UTIL.getNumber(totalAmtStr);
				orderValue.total_amt = totalAmt;
				
				DB.updateData("store_order", orderNo, orderValue, "reset");
			}
			
			return orderNoList;
		}
		catch(e) {
			console.error("parseHistoryListPage 오류:", e);
		}
	},
	/*
	param pageIdx 크롤링할 주문내역 페이지 번호
	*/
	parseHistoryDetailPage: async function(orderNo) {
		try {
			var res = await UTIL.request(URL.base+URL.history+"/"+orderNo, null, null);
			var htmlDOM = parser.parseFromString(res, "text/html");
			var sectionElement = $(htmlDOM).find(".buy_history_detail_table");
			
			var bookIdList = {};
			//책 목록
			var bookTd = SYNC_ORDER.findNextTdByThTxt(sectionElement, "구분");
			var bookList = $(bookTd).find(".book_title");
			bookList.each(function() {
				//책 ID
				var bookE = $(this).find("a");
				var bookId = bookE.attr("href").replace("/books/","");
				
				//구매금액
				var priceStr = $(this).find(".price").text();
				var price = UTIL.getNumber(priceStr);
				
				bookIdList[bookId] = price;
			});
			
			var orderHeaderItem = {book_list: bookIdList};
			//금액관련
			orderHeaderItem.amt_total = SYNC_ORDER.getAmt(sectionElement, "주문 금액");
			orderHeaderItem.amt_discount_cupon = SYNC_ORDER.getAmt(sectionElement, "쿠폰 할인");
			orderHeaderItem.amt_cash = SYNC_ORDER.getAmt(sectionElement, "리디캐시 사용액");
			orderHeaderItem.amt_point = SYNC_ORDER.getAmt(sectionElement, "리디포인트 사용액");
			orderHeaderItem.amt_pg = SYNC_ORDER.getAmt(sectionElement, "PG 결제 금액");
			orderHeaderItem.reward_ridipoint = SYNC_ORDER.getAmt(sectionElement, "적립 리디포인트");

			orderHeaderItem.pay_way = SYNC_ORDER.findNextTdByThTxt(sectionElement, "결제 수단").text();
	
			DB.updateData("store_order", orderNo, orderHeaderItem, "update");
			return true;
		}
		catch(e) {
			console.error("parseHistoryDetailPage 오류:", e);
		}
	},
	
	findNextTdByThTxt: function(bodyE, thTxt) {
		return $(bodyE).find("th").filter(function() {return $(this).text().trim() === thTxt;}).next("td");
	},
	getAmt: function(bodyE, thLabel) {
		return UTIL.getNumber(SYNC_ORDER.findNextTdByThTxt(bodyE, thLabel).find("span.museo_sans").text());
	}
};
export default SYNC_ORDER;
//async function deleteHistoryListPage(orderNo) {
//	deleteData("store_order", orderNo);
//}