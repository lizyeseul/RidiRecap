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
	return dbConnect.transaction(store_nm, mode).objectStore(store_nm);
}

function setData(tbNm, data, key) {
	var store = getObjectStore(tbNm,"readwrite");
	var cursorRequest = store.openCursor(key);
	cursorRequest.onsuccess = function(e) {
		var cursor = e.target.result;
		if(cursor) {
			cursor.update(data);
		}
		else {
			store.add(data, key);
		}
	}
	cursorRequest.onerror = (e) => {console.error("커서 요청 오류: "+e.target.error)};
}
