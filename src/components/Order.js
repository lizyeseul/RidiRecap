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
	
	const [orderInfo, setOrderInfo] = useState([]);
	
	function syncOrder() {
		setIsSync(true);
		SYNC_ORDER.syncOrderList(fromPage, toPage, setIngPage);
		setIsSync(false);
	}
	function syncOrderDetail() {
		setIsSync(true);
		SYNC_ORDER.syncOrderDetail(fromPage, toPage, setIngPage);
		setIsSync(false);
	}
	async function findRecentOrder() {
		setIsSync(true);
		var tempList = await DB.getValueByIdx("store_order", "order_seq", { direction: "prev", limit: 15 });
		setOrderInfo(tempList);
		setIsSync(false);
	}
	function OrderInfoRow({orderInfo}) {
		console.log(orderInfo);
		return (
			<li>
				{orderInfo.order_no} : {orderInfo.order_dt}, {orderInfo.total_amt}
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
				<button onClick={syncOrder} disabled={isSync}>sync order</button>
				<button onClick={syncOrderDetail} disabled={isSync}>sync order detail</button>
				<button onClick={findRecentOrder} disabled={isSync}>조회(15개)</button>
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
