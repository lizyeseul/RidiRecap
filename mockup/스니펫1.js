var dbCon;
var dbReq;

var connectDB = function() {
    dbReq = indexedDB.open("RIDI TEST", 1);
    dbReq.onsuccess = (e) => { dbCon = e.target.result; };
}
// connectDB();

var getObjectStore = function(store_nm, mode) {
    return dbCon.transaction(store_nm, mode).objectStore(store_nm);
};


var resultList = [];
new Promise((resolve, reject) => {
    // var store = getObjectStore("store_book","readonly");
    var store = getObjectStore("store_book","readonly");
    // var index = store.index("unit_id");
    var index = store.index("book_id");
    // var index = store.index("order_no");
    
    var filter = {
        // unit_title: "문과라도 안 죄송한 이세계로 감"
        // unit_id: 3824758
    }
    var existsFilter = [
        // "categories"
        // "series"
        // "price_info"
        // "serial_thumbnail"
        // "setbook"
   ]
    var notExistsFilter = [
        // "authors"
        // "thumbnail"
        // "series"
        // "price_info"
   ]
    var results = [];
    var cursorReq = index.openCursor(null, "next");
    cursorReq.onsuccess = (e) => {
        var cursor = e.target.result;
        if (cursor) {
            var includeFlag = true;
            if(filter) {
                for (const key in filter) {
                    if (cursor.value[key] !== filter[key]) {
                        includeFlag = false;
                        break;
                    }
                }
            }
            if(existsFilter) {
                for (const key in existsFilter) {
                    if(!cursor.value.hasOwnProperty(existsFilter[key])) {
                        includeFlag = false;
                        break;
                    }
                }
            }
            if(notExistsFilter) {
                for (const key in notExistsFilter) {
                    if(cursor.value.hasOwnProperty(notExistsFilter[key])) {
                        includeFlag = false;
                        break;
                    }
                }
            }
            
            if (includeFlag) results.push(cursor.value);
            cursor.continue();
        }
        else {
            // resultList = results;
            resolve(results);
        }
    };
})
.then((results) => {
    resultList = results;
});
;
