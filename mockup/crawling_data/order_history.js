//목록
//------------
/*  마지막 페이지 번호 추출
<section id="page_buy_history">
	<table class="rui_table buy_history_table">
		<colgroup>
			<col class="date">
			<col class="title">
			<col class="main_value">
			<col class="payment_type">
			<col class="detail_icon">
		</colgroup>
		<thead>
			<tr>
				<th class="default">구매일</th>
				<th class="title">결제 내역</th>
				<th class="main_value">주문금액</th>
				<th class="default payment_type">결제 수단</th>
				<th class="detail_icon"></th>
			</tr>
		</thead>
		<tbody>
			<tr class="detail_link js_rui_detail_link" data-href="/order/history/2025071680537095">
				<td class="default">2025.07.16.   22:22</td>
				<td class="title">패션(PASSION) 122화</td>
				<td class="main_value">
					<span class="museo_sans">600</span>원
				</td>
				<td class="default payment_type">리디캐시</td>
				<td class="detail_icon">
					<a href="/order/history/2025071680537095">
						<span class="indent_hidden">상세보기</span>
						<span class="arrow_icon"></span>
					</a>
				</td>
			</tr>
		</tbody>
	</table>
	<div class="paging_wrapper">
		<div class="module_paging">
	<!--1page-->
			<ul class="paging_wrap">
				<li class="page_list page_list_first page_this">
					<a class="museo_sans" href="#">1</a>
				</li>
				<li class="page_list">
					<a class="museo_sans" href="/order/history?page=2">2</a>
				</li>
				...
				<li class="page_list page_list_last">
					<a class="museo_sans" href="/order/history?page=5">5</a>
				</li>
				<li class="btn_next">
					<a href="/order/history?page=2" title="2 페이지">
						<span class="indent_hidden">다음으로</span>
						<span class="icon-arrow_8_right"></span>
					</a>
				</li>
			</ul>
	<!--last page-->
			<ul class="paging_wrap">
				<li class="btn_first">
					<a href="/order/history?page=1">처음</a>
					<span class="icon-dotdotdot"></span>
				</li>
				<li class="btn_prev">
					<a href="/order/history?page=221" title="221 페이지">
						<span class="indent_hidden">이전으로</span>
						<span class="icon-arrow_8_left"></span>
					</a>
				</li>
				<li class="page_list page_list_first">
					<a class="museo_sans" href="/order/history?page=218">218</a>
				</li>
				...
				<li class="page_list page_list_last page_this">
					<a class="museo_sans" href="#">222</a>
				</li>
			</ul>
		</div>
	</div>
*/

//class="btn_prev" 없으면 첫페이지
//class="btn_next" 없으면 마지막페이지
//https://ridibooks.com/order/history?page=999
//if isEmpty($(".btn_next")) 
  var lastPageNum = $(".page_this a")[0].innerText
var lastPageCnt = $(".page_this a").length


//https://ridibooks.com/order/history?page=lastPageNum
//한페이지에 15개, 마지막페이지는 몇 개 남을지 모름

for(var i=1;i<=lastPageNum;i++){
	//https://ridibooks.com/order/history?page=curPage
	var curPage = i;
	var detailTrList = $(".js_rui_detail_link");
	for(var idx = 0; idx<detailTrList.length; idx++) {
		var link = $(a[idx]).attr("data-href"); // /order/history/2020060206698032
		var order_no = link;//끝 숫자 추출
		
		var tdList = $(a[idx]).find("td");
		for(var td;;) {
			var order_dttm = td[0].innerText;
		}
		
		//order_dt key 등록
		//{"2020060206698032" {"order_no": "2020060206698032", "order_dttm": 2020.06.01. 00:51, "order_dt":"20200601"}}
		var order_seq = (15 - idx+1) + (lastPageNum-curPage-1)*15 + (lastPageNum!=curPage)?15:0 + (lastPageNum!=curPage)?lastPageCnt:0;
		//append 2020060206698032 value {order_seq: order_seq}
	}
}







//상세
//------------
/*

<table class="buy_history_detail_table">
	<colgroup>
		<col style="width:22%;">
		<col style="width:auto;">
	</colgroup>
	<tbody>
		<tr>
			<th>주문 번호</th>
			<td>2020111249193079</td>
		</tr>
		<tr>
			<th>구분</th>
			<td class="title">
				<ul class="book_list">
					<li class="book">
						<span class="book_title">
							<a href="/books/2378013896">문과라도 안 죄송한 이세계로 감 242화</a>
							<span class="museo_sans price">(100원)</span>
						</span>
					</li>
					<li class="book">
						<span class="book_title">
							<a href="/books/2378013905">문과라도 안 죄송한 이세계로 감 243화</a>
							<span class="museo_sans price">(100원)</span>
						</span>
					</li>
					<li class="book">
						<span class="book_title">
							<a href="/books/2378013929">문과라도 안 죄송한 이세계로 감 244화</a>
							<span class="museo_sans price">(100원)</span>
						</span>
					</li>
					<li class="book">
						<span class="book_title">
							<a href="/books/2378013933">문과라도 안 죄송한 이세계로 감 245화</a>
							<span class="museo_sans price">(100원)</span>
						</span>
					</li>
					<li class="book">
						<span class="book_title">
							<a href="/books/2378013941">문과라도 안 죄송한 이세계로 감 246화</a>
							<span class="museo_sans price">(100원)</span>
						</span>
					</li>
					<li class="book">
						<span class="book_title">
							<a href="/books/2378013966">문과라도 안 죄송한 이세계로 감 247화</a>
							<span class="museo_sans price">(100원)</span>
						</span>
					</li>
					<li class="book">
						<span class="book_title">
							<a href="/books/2378013985">문과라도 안 죄송한 이세계로 감 248화</a>
							<span class="museo_sans price">(100원)</span>
						</span>
					</li>
					<li class="book">
						<span class="book_title">
							<a href="/books/2378013995">문과라도 안 죄송한 이세계로 감 249화</a>
							<span class="museo_sans price">(100원)</span>
						</span>
					</li>
					<li class="book">
						<span class="book_title">
							<a href="/books/2378014001">문과라도 안 죄송한 이세계로 감 250화</a>
							<span class="museo_sans price">(100원)</span>
						</span>
					</li>
					<li class="book">
						<span class="book_title">
							<a href="/books/2378014006">문과라도 안 죄송한 이세계로 감 251화</a>
							<span class="museo_sans price">(100원)</span>
						</span>
					</li>
				</ul>
			</td>
		</tr>
		<tr>
			<th>주문 금액</th>
			<td class="point_amount">
				<span class="museo_sans">1,000</span>
				원
			</td>
		</tr>
		<tr>
			<th>쿠폰 할인</th>
			<td class="point_amount">
				<span class="museo_sans">0</span>
				원
			</td>
		</tr>
		<tr>
			<th>리디캐시 사용액</th>
			<td class="point_amount">
				<span class="museo_sans">600</span>
				원
			</td>
		</tr>
		<tr class="has_sub">
			<th>리디포인트 사용액</th>
			<td class="point_amount">
				<span class="museo_sans">400</span>
				원
			</td>
		</tr>
		<tr class="point_period_uses sub">
			<th>기간 한정 리디포인트</th>
			<td>
				<ul>
					<li>
						<span class="square_dot"></span>
						<strong>두근두근 판타지 랜덤티켓!</strong>
						: <span class="museo_sans">-400</span>
						원<br>
					</li>
				</ul>
			</td>
		</tr>
		<tr>
			<th>PG 결제 금액</th>
			<td class="point_amount">
				<span class="museo_sans">0</span>
				원
			</td>
		</tr>
		<tr>
			<th>결제 수단</th>
			<td>리디캐시 + 리디포인트</td>
		</tr>
		<tr>
			<th>적립 리디포인트</th>
			<td>
				<span class="museo_sans">0</span>
				원
			</td>
		</tr>
		<tr>
			<th>문화비 소득공제</th>
			<td>소득공제 불가</td>
		</tr>
	</tbody>

*/

var bookList = $(".book_title");










