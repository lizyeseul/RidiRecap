const { useState } = React;

import SYNC_BOOK from "../../scripts/sync/sync_book.js";
import DB from "../../scripts/connect_db.js";

function Book() {
	const [isSync, setIsSync] = useState(false);
	const [bookInfo, setBookInfo] = useState([]);
	function BookInfoRow({bookInfo}) {
		return (
			<li>
				{bookInfo.unit_id}: {bookInfo.unit_title}
			</li>
		)
	}
	async function findLibList() {
		setIsSync(true);
		var tempList = await DB.getValueByIdx("store_unit", "unit_id", { direction: "prev"});
		setBookInfo(tempList);
		setIsSync(false);
	}
	
	async function updateLib() {
		setIsSync(true);
		await SYNC_BOOK.updateLib();
		setIsSync(false);
	}
	return (
		<div>
			<span>{isSync? 'sync: ' : 'end'}</span><br/>
			<div>
				<button onClick={updateLib} disabled={isSync}>책 목록 update</button>
				<button onClick={findLibList} disabled={isSync}>목록 조회</button>
			</div>
			<hr/>
			<ul>
			{
				bookInfo.map((o) => (
					<BookInfoRow bookInfo={o}/>
				))
			}
			</ul>
		</div>
	);
}

export default Book;
