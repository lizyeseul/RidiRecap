var dbConnect;

function initDB() {
	var request = indexedDB.open(DB.name, DB.version);
	request.onerror = (e) => {console.log("err")};
	request.onsuccess = (e) => { dbConnect = e.target.result; }
	request.onupgradeneeded = (e) => {
		dbConnect = e.target.result;
		var os;
		if(!dbConnect.objectStoreNames.contains("order_list")) {
			os = dbConnect.createObjectStore("order_list", {autoIncrement: false});
			os.createIndex("order_no", "order_no", {unique: false});
		}

		if(!dbConnect.objectStoreNames.contains("o_order_header")) {
			os = dbConnect.createObjectStore("o_order_header", {autoIncrement: false});
			os.createIndex("order_no", "order_no", {unique: true});
			os.createIndex("order_dt", "order_dt", {unique: false});
			os.createIndex("order_seq", "order_seq", {unique: true});
		}
		if(!dbConnect.objectStoreNames.contains("o_order_detail")) {
			os = dbConnect.createObjectStore("o_order_detail", {autoIncrement: false});
			os.createIndex("order_no", "order_no", {unique: false});
			os.createIndex("book_id", "book_id", {unique: false});
		}
	}
}
function getObjectStore(store_nm, mode) {
	//TODO transaction oncomplete dbConnect.close 추가
	//TODO transaction 끊겼을 때 재연결하는 로직 필요
	return dbConnect.transaction(store_nm, mode).objectStore(store_nm);
}

function setData(tbNm, data, key) {
	var store = getObjectStore(tbNm,"readwrite");
	var cursorRequest = store.openCursor(key);
	cursorRequest.onsuccess = function(e) {
		var cursor = e.target.result;
		if(cursor) {
//			console.info("update",data);
			cursor.update(data);
		}
		else {
//			console.info("insert",key,data);
			store.add(data, key);
		}
	}
	store.onerror = (e) => {console.error("store 요청 오류-setData: "+e.target.error)};
	cursorRequest.onerror = (e) => {console.error("커서 요청 오류-setData: "+e.target.error)};
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

function getUniqueValue(tbNm, idxNm, idxVal) {
	return new Promise((resolve, reject) => {
		getValueByIdx(tbNm, idxNm, idxVal, 1)
		.then((results) => {
			resolve(results[0] || null);
		})
		.catch(reject);
	});
}
function getValueByIdx(tbNm, idxNm, idxVal, limit) {
	limit = limit || -1;
	return new Promise((resolve, reject) => {
		var store = getObjectStore(tbNm,"readonly");
		var index = store.index(idxNm);

		var results = [];
		var cursorReq = index.openCursor(IDBKeyRange.only(idxVal));
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
