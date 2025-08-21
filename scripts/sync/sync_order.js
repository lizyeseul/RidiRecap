import DB from "../../scripts/connect_db.js";
var SYNC_ORDER = {
	syncOrder: async function(fromPage, toPage, setIngPageLabel) {
		setIngPageLabel(fromPage*15-14, toPage*15,fromPage*15-14);
		for(var pageIdx=fromPage; pageIdx<=toPage; pageIdx++) {
			var orderNoList = await this.parseHistoryListPage(pageIdx, false);
			for(var i=0; i<orderNoList.length; i++) {
				setIngPageLabel(fromPage*15-14, toPage*15, pageIdx*15-14+i);
				await this.parseHistoryDetailPage(orderNoList[i]);
			}
		}
	},
	syncOrderList: async function(fromPage, toPage, setIngPage) {
		for(var pageIdx=fromPage; pageIdx<=toPage; pageIdx++) {
			setIngPage((pageIdx-fromPage) + "/" + (toPage-fromPage));
			await this.parseHistoryListPage(pageIdx, false);
			/*
			var isContinue = 
			if(orderSeq <= maxOrderSeq && !isTest) {
				var maxOrderSeq = await getMaxOnIdx("store_order","order_seq");
				sessionStorage.setItem("maxOrderSeq", maxOrderSeq || -1);
				return false;
			}
			if(!isContinue) {
				break;
			}
			*/
		}
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
				//TODO 테스트 전, PC/모바일 세팅 방법 모르겠음
				orderItemList = $(sectionElement).find(".buy_list_wrap li.list_item a");
			}
			var orderNoList = [];
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
				
				DB.updateData("store_order", orderNo, orderValue, "reset");
			}
			var maxOrderSeq = await DB.getMaxOnIdx("store_order","order_seq");
			sessionStorage.setItem("maxOrderSeq", maxOrderSeq || -1);
			
			return orderNoList;
		}
		catch(e) {
			console.error("parseHistoryListPage 오류:", e);
		}
	},
	/*
	결제내역 화면 전체 반복하면서 저장
	*/
	syncOrderDetail: async function(fromSeq, toSeq, setIngPage) {
		/*
		var maxOrderSeq = UTIL.toNumber(sessionStorage.getItem("maxOrderSeq")) || -1;
		if(maxOrderSeq < 0) {
			$("#parse_log")[0].innerText = "no order detail to sync";
			return;
		}
		*/
	//	for(var i=maxOrderSeq; i>=1; i--) {	//TODO yslee 개수가 많아서 분할하든 비동기로 바꾸든 해야할 듯, 15개 동시에 쏘고 리턴 모아서 처리 가능한가?
		for(var i=fromSeq; i<=toSeq; i++) {
			setIngPage((i-fromSeq) + "/" + (toSeq-fromSeq));
			var orderItem = await DB.getUniqueValue("store_order", "order_seq", i);
			if(UTIL.isNotEmpty(orderItem)) {
				await this.parseHistoryDetailPage(orderItem.order_no);
			}
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
	
			DB.updateData("store_order", orderNo, orderHeaderItem, "update");
			return true;
		}
		catch(e) {
			console.error("parseHistoryDetailPage 오류:", e);
		}
	}
};
export default SYNC_ORDER;

async function deleteHistoryListPage(orderNo) {
	deleteData("store_order", orderNo);
}