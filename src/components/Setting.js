const { useState } = React;

import DB from "../../scripts/connect_db.js";
import SESSION from "../../scripts/session.js";

import SYNC_ORDER from "../../scripts/sync/sync_order.js";
import SYNC_BOOK from "../../scripts/sync/sync_book.js";

function Setting() {
	const [isSync, setIsSync] = useState(false);
	const [ingPage, setIngPage] = useState(null);
	
	async function syncOrderAll() {
		setIsSync(true);
		await SYNC_ORDER.syncOrder(1, sessionStorage.getItem("lastPageNum"), setIngPage);
		setIsSync(false);
	}
	async function syncOrderRecent() {
		setIsSync(true);
		await SYNC_ORDER.syncOrderRecent(setIngPage);
		setIsSync(false);
	}
	return (
		<div>
			<button onClick={DB.initDB}>DB 연결</button>
			<button onClick={SESSION.setRidiGlobalVal}>리디 전역변수 세팅</button>
			<button onClick={SESSION.updatePageInfo}>초기값 세팅</button>
			<hr/>
			<span>{isSync? 'sync '+ingPage : 'end'}</span><br/>
			<div>
				<button onClick={syncOrderAll} disabled={isSync}>결제내역 전체 동기화</button>
				<button onClick={syncOrderRecent} disabled={isSync}>결제내역 업데이트</button>
			</div>
			<hr/>
		</div>
	);
}

export default Setting;
