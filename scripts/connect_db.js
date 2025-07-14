var dbConnect;

function initDB() {
	var request = indexedDB.open(DB.name, DB.version);
	request.onerror = (e) => {console.log("err")};
	request.onsuccess = (e) => { dbConnect = e.target.result; }
	request.onupgradeneeded = (e) => {
		dbConnect = e.target.result;
		if(!dbConnect.objectStoreNames.contains("order_list")) {
			const os = dbConnect.createObjectStore("order_list", {autoIncrement: false});
			os.createIndex("order_no", "order_no", {unique: false});
		}
	}
}
function getObjectStore(store_nm, mode) {
	return dbConnect.transaction(store_nm, mode).objectStore(store_nm);
}

function addData(tbNm, data, key) {
	var store = getObjectStore(tbNm,"readwrite");
	var req;
	try {
		req = store.add(data, key)
	}
	catch(e) {console.log(e)}

	req.onsuccess = (e) => {console.log("success")};
}
