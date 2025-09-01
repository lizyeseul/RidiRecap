const { useState } = React;

import SYNC_ORDER from "../../scripts/sync/sync_order.js";
import DB from "../../scripts/connect_db.js";

function Order() {
	const [lastPageNum, setLastPageNum] = useState(sessionStorage.getItem("lastPageNum"));
	const [maxOrderSeq, setMaxOrderSeq] = useState(sessionStorage.getItem("maxOrderSeq"));
	const [fromPage, setFromPage] = useState(1);
	const [toPage, setToPage] = useState(lastPageNum);
	const [isSync, setIsSync] = useState(false);
	const [ingPage, setIngPage] = useState(null);
	
	function setIngPageLabel(from, to, cur) {
		var start = cur - from + 1;
		var end = to - from + 1;
		setIngPage(start + "/" + end);
	}
	
	const [orderInfo, setOrderInfo] = useState([]);
	
	async function syncOrder() {
		setIsSync(true);
		var from = UTIL.toNumber(fromPage);
		var to = UTIL.toNumber(toPage);
		if(from > to) {
			var temp = from;
			from = to;
			to = temp;
		}
		await SYNC_ORDER.syncOrder(from, to, setIngPageLabel);
		setIsSync(false);
	}
	async function syncOrderList() {
		setIsSync(true);
		await SYNC_ORDER.syncOrderList(fromPage, toPage, setIngPage);
		setIsSync(false);
	}
	async function syncOrderDetail() {
		setIsSync(true);
		await SYNC_ORDER.syncOrderDetail(fromPage, toPage, setIngPage);
		setIsSync(false);
	}
	async function findRecentOrder() {
		setIsSync(true);
		var tempList = await DB.getValueByIdx("store_order", "order_seq", { direction: "prev", limit: 100 });
		setOrderInfo(tempList);
		setIsSync(false);
	}
	function OrderInfoRow({orderInfo}) {
		return (
			<li>
				{orderInfo.order_no} : {moment(orderInfo.order_dttm).format("YYYYMMDD")}, {orderInfo.total_amt}
			</li>
		)
	}
	return (
		<div>
			<span>lastPageNum: {lastPageNum}</span><br/>
			<span>maxOrderSeq: {maxOrderSeq}</span><br/>
			<span>{isSync? 'sync: '+ingPage : 'end'}</span><br/>
			<div>
				<input type="number"	name="fromPage"	value={fromPage}	onChange={(e) => setFromPage(e.target.value)}/>
				<input type="number"	name="toPage"	value={toPage}		onChange={(e) => setToPage(e.target.value)}/>
				<button onClick={syncOrder} disabled={isSync}>주문 동기화</button>
				<button onClick={syncOrderList} disabled={true}>sync order</button>
				<button onClick={syncOrderDetail} disabled={true}>sync order detail</button>
				<button onClick={findRecentOrder} disabled={isSync}>조회(100개)</button>
			</div>
			<hr/>
			<ul>
			{
				orderInfo.map((o) => (
					<OrderInfoRow orderInfo={o}/>
				))
			}
			</ul>
		</div>
	);
}

export default Order;
