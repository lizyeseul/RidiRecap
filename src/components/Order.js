const { useState } = React;

import SYNC_ORDER from "../../scripts/sync/sync_order.js"

function Order() {
	const [lastPageNum, setLastPageNum] = useState(sessionStorage.getItem("lastPageNum"));
	const [fromPage, setFromPage] = useState(1);
	const [toPage, setToPage] = useState(lastPageNum);
	const [isSync, setIsSync] = useState(false);
	const [ingPage, setIngPage] = useState(null);
	function syncOrder() {
		setIsSync(true);
		SYNC_ORDER.syncOrderList(fromPage, toPage, setIngPage);
		setIsSync(false);
	}
	return (
		<div>
			<span>lastPageNum: {lastPageNum}</span>
			<span>{isSync? 'sync: '+ingPage : 'end'}</span>
			<br/>
			<div>
				<input type="number"	name="fromPage"	value={fromPage}	onChange={(e) => setFromPage(e.target.value)}/>
				<input type="number"	name="toPage"	value={toPage}		onChange={(e) => setToPage(e.target.value)}/>
				<button onClick={syncOrder}>sync order</button>
			</div>
		</div>
	);
}

export default Order;
