const { useState } = React;

import DB from "../../scripts/connect_db.js";
import SYNC_BOOK from "../../scripts/sync/sync_book.js";

function Book() {
	const [isSync, setIsSync] = useState(false);
	
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
			</div>
		</div>
	);
}

export default Book;
