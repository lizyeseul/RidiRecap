const { useState, useEffect } = React;

import SYNC_BOOK from "../../scripts/sync/sync_book.js";
import DB from "../../scripts/connect_db.js";

function Book() {
	const [isSync, setIsSync] = useState(false);
	const [unitInfo, setUnitInfo] = useState([]);
	const [isUnitAllChecked, setIsUnitAllChecked] = useState(false);
	const [checkedListById, setCheckedListById] = useState([]);
	
	useEffect(() => {
		findLibList()
	}, []);
	
	const onCheckUnit = (id) => {
		setCheckedListById((prev) => (checkedListById.includes(id)) ? prev.filter((el) => el !== id) : [...prev, id]);
	}
	function onCheckUnitAll() {
		setIsUnitAllChecked(!isUnitAllChecked);
		setCheckedListById((isUnitAllChecked) ? [] : unitInfo.map((b)=>{return b.unit_id}));
	}
	function UnitInfoRow({unitInfo}) {
		return (
			<tr>
				<td>
					<input	name={unitInfo.unit_id} type="checkbox"
							onChange={() => onCheckUnit(unitInfo.unit_id)}
							checked={checkedListById.includes(unitInfo.unit_id)}/>
				</td>
				<td>{unitInfo.unit_id}</td>
				<td>{unitInfo.unit_title}</td>
				<td>{unitInfo.total_cnt}</td>
			</tr>
		)
	}
	async function findLibList() {
		setIsSync(true);
		var tempList = await DB.getValueByIdx("store_unit", "unit_id", { direction: "prev"});
		setUnitInfo(tempList.filter((u) => {
			return u.property.is_adult_only === false;
		}));
		setIsSync(false);
	}
	
	async function updateLib() {
		setIsSync(true);
		await SYNC_BOOK.updateLib();
		setIsSync(false);
	}
	async function updateUnitDetail() {
		setIsSync(true);
		await SYNC_BOOK.updateUnitDetail();
		setIsSync(false);
	}
	async function updateBook() {
		setIsSync(true);
		await SYNC_BOOK.updateBook(checkedListById);
		setIsSync(false);
	}
	return (
		<div>
			<span>{isSync? 'sync' : 'end'}</span><br/>
			<div>
				<button onClick={updateLib} disabled={isSync}>unit 목록 update</button>
				<button onClick={updateUnitDetail} disabled={isSync}>unit 상세 update</button>
				<button onClick={updateBook} disabled={isSync}>책 상세 update</button>
				<button onClick={findLibList} disabled={isSync}>목록 조회</button>
			</div>
			<hr/>
			<table>
				<tr>
					<td>
						<input	type="checkbox"
								onChange={() => onCheckUnitAll()}
								checked={isUnitAllChecked}/>
					</td>
					<td>unit_id</td>
					<td>제목</td>
					<td>화 수</td>
				</tr>
			{
				unitInfo.map((o) => (
					<UnitInfoRow unitInfo={o}/>
				))
			}
			</table>
		</div>
	);
}

export default Book;
