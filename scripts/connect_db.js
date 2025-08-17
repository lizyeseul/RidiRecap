var dbConnect;

function initDB() {
	var request = indexedDB.open(DB.name, DB.version);
	request.onerror = (e) => { console.log("err") };
	request.onsuccess = (e) => { dbConnect = e.target.result; }
	request.onupgradeneeded = (e) => {
		dbConnect = e.target.result;
		var os;
		if(!dbConnect.objectStoreNames.contains("store_order")) {
			os = dbConnect.createObjectStore("store_order", {autoIncrement: false});
			os.createIndex("order_no", "order_no", {unique: true});
			os.createIndex("order_dt", "order_dt", {unique: false});
			os.createIndex("order_seq", "order_seq", {unique: true});
		}
		if(!dbConnect.objectStoreNames.contains("store_unit")) {
			os = dbConnect.createObjectStore("store_unit", {autoIncrement: false});
			os.createIndex("unit_id", "unit_id", {unique: true});
		}
		if(!dbConnect.objectStoreNames.contains("store_book")) {
			os = dbConnect.createObjectStore("store_book", {autoIncrement: false});
			os.createIndex("book_id", "book_id", {unique: true});
			os.createIndex("unit_id", "unit_id", {unique: false});
		}
		if(!dbConnect.objectStoreNames.contains("store_purchase")) {
			os = dbConnect.createObjectStore("store_purchase", {autoIncrement: true});
			os.createIndex("order_no", "order_no", {unique: false});
			os.createIndex("unit_id", "unit_id", {unique: false});
			os.createIndex("book_id", "book_id", {unique: false});
			os.createIndex("order_dt", "order_dt", {unique: false});
			os.createIndex("is_completed", "is_completed", {unique: false});
			os.createIndex("service_type", "service_type", {unique: false});
		}
	}
}
export default initDB;
function getObjectStore(store_nm, mode) {
	//TODO transaction oncomplete dbConnect.close 추가
	//TODO transaction 끊겼을 때 재연결하는 로직 필요
	if(!dbConnect) {
		console.error("DB 연결이 되어 있지 않습니다.");
		return Promise.reject("DB 연결이 되어 있지 않습니다.");
	}
	return dbConnect.transaction(store_nm, mode).objectStore(store_nm);
}


function getUniqueValue(tbNm, idxNm, idxVal) {
	return new Promise((resolve, reject) => {
		getValueByIdx(tbNm, idxNm, { rangeOption:"only", range: idxVal, limit: 1 })
		.then((results) => {
			resolve(results[0] || null);
		})
		.catch(reject);
	});
}
function getValueByIdx(tbNm, idxNm, options) {
	options = options || {};
	var rangeOption = options.rangeOption || "only";
	var keyRange = options.range || null;
	var limit = options.limit || -1;
	var direction = options.direction || "next";

	return new Promise((resolve, reject) => {
		var store = getObjectStore(tbNm,"readonly");
		var index = store.index(idxNm);

		var results = [];
		var queryParam = (keyRange) ? IDBKeyRange[rangeOption](keyRange) : null;
		var cursorReq = index.openCursor(queryParam, direction);
		cursorReq.onsuccess = (e) => {
			var cursor = e.target.result;
			if (cursor) {
				results.push(cursor.value);
				if(limit != -1 && results.length >= limit) {
					resolve(results);
					return;
				}
				cursor.continue();
			}
			else {
				resolve(results);
			}
		};
		cursorReq.onerror = (e) => {console.error("커서 요청 오류-getValueByIdx: "+e.target.error)};
	});
}
function getMaxOnIdx(tbNm, idxNm) {
	return new Promise((resolve, reject) => {
		var store = getObjectStore(tbNm,"readonly");
		var index = store.index(idxNm);
		
		var cursorReq = index.openCursor(null, "prev");
		cursorReq.onsuccess = (e) => {
			var cursor = e.target.result;
			if(cursor) {
				resolve(cursor.value[idxNm]);
			}
			else {
				resolve(null);
			}
		}
		cursorReq.onerror = (e) => {console.error("커서 요청 오류-getMaxOnIdx: "+e.target.error)};
	});
}

/**
@param mode string 'reset':기존 value 무시하고 data로 set, 'update':기존 value에 data assign
*/
function updateData(tbNm, key, data, mode) {
	mode = mode || "reset";
	var store = getObjectStore(tbNm,"readwrite");
	var cursorRequest = store.openCursor(key);
	cursorRequest.onsuccess = function(e) {
		var cursor = e.target.result;
		data.last_update_dttm = moment().toDate();
		if(cursor) {
			var updateData = data;
			if(mode == "update") {
				var cursorValue = cursor.value;
				updateData = Object.assign(cursorValue, data);
			}
			console.debug("update: ",key,updateData);
			cursor.update(updateData);
		}
		else {
			console.debug("insert: ",key,data);
			store.add(data, key);
		}
	}
	store.onerror = (e) => {console.error("store 요청 오류-updateData: "+e.target.error)};
	cursorRequest.onerror = (e) => {console.error("커서 요청 오류-updateData: "+e.target.error)};
}

function deleteData(tbNm, key) {
	var store = getObjectStore(tbNm,"readwrite");
	var cursorRequest = store.openCursor(key);
	cursorRequest.onsuccess = function(e) {
		var cursor = e.target.result;
		if(cursor) {
			console.debug("delete: ",key);
			cursor.delete();
		}
	}
	store.onerror = (e) => {console.error("store 요청 오류-deleteData: "+e.target.error)};
	cursorRequest.onerror = (e) => {console.error("커서 요청 오류-deleteData: "+e.target.error)};
}