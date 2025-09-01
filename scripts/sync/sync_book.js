import DB from "../../scripts/connect_db.js";
var SYNC_BOOK = {
	/*
	서재에 있는 작품 목록 업데이트
	*/
	updateLib: async function() {
		try {
			var unitCnt = sessionStorage.getItem("unitCnt") || "500";
			var res = await UTIL.request(URL.LIBRARY_BASE+"items/main/?offset=0&limit="+unitCnt, null, { isResultJson: true });
			
			var items = res.items;
			items.forEach(function(unit) {
				unit.unit_id = UTIL.toNumber(unit.unit_id);
				DB.updateData("store_unit", unit.unit_id, unit, "update");
			});
			// await SYNC_BOOK.updateUnitDetail();
			return true;
		}
		catch(e) {
			console.error("updateLib 오류:", e);
		}
	},
	updateUnitDetail: async function() {
		try {
			var checkedListById = await DB.getValueByIdx("store_unit", "unit_id", { direction: "prev"});
			checkedListById = checkedListById.map((u) => UTIL.toString(u.unit_id));
			var unitListRes = await UTIL.request(URL.LIBRARY_BASE+"books/units", {unit_ids:checkedListById}, { isResultJson: true });

			async function processUnit(e) {
				var unitId = UTIL.toNumber(e.id);
				var booksRes = await UTIL.request(URL.LIBRARY_BASE+"books/units/"+e.id+"/order?offset=0&limit=1&order_type=unit_order&order_by=asc", null, { isResultJson: true });
				var items = booksRes.items;
				var bookIds = [...new Set(items.flatMap(obj => UTIL.toString(obj.b_ids)))];
				var bookInfosRes = await UTIL.request(URL.BOOK_API_BASE+"books?b_ids="+bookIds.join(","), null, { isResultJson: true });
				var unitInfo = {
					unit_id: unitId,
					total_cnt: e.total_count
				}
				unitInfo = {...bookInfosRes[0], ...unitInfo};
				DB.updateData("store_unit", unitId, unitInfo, "update");
			};
			const tasks = unitListRes.units.map((e) => () => processUnit(e));
			await UTIL.runWithConcurrencyLimit(tasks, 10);
			return true;
		}
		catch(e) {
			console.error("updateBook 오류:", e);
		}
	},
	updateBook: async function(checkedListById) {
		try {
			if(UTIL.isEmpty(checkedListById)) return;
			var unitListRes = await UTIL.request(URL.LIBRARY_BASE+"books/units", {unit_ids: checkedListById.map((u) => UTIL.toString(u))}, { isResultJson: true });
			for(var e of unitListRes.units) {
				var startOffset = 0;
				var limit = 100;
				var totalCnt = e.total_count;
//				var limit = 10;
//				var totalCnt = 20;
				for(var offset=startOffset; offset<totalCnt; offset=offset+limit) {
					var booksRes = await UTIL.request(URL.LIBRARY_BASE+"books/units/"+e.id+"/order?offset="+UTIL.toString(offset)+"&limit="+UTIL.toString(limit)+"&order_type=unit_order&order_by=asc", null, { isResultJson: true });
					var items = booksRes.items;
					var bookIds = [...new Set(items.flatMap(obj => UTIL.toString(obj.b_ids)))];
					var [bookInfosRes, bookPurchaseInfosRes] = await Promise.all([
						UTIL.request(URL.BOOK_API_BASE+"books?b_ids="+bookIds.join(","), null, { isResultJson: true }),
						UTIL.request(URL.LIBRARY_BASE+"items", {b_ids: bookIds}, { isResultJson: true })
					])
					
					var purchaseMap = new Map(bookPurchaseInfosRes.items.map(obj => [UTIL.toNumber(obj.b_id), obj]));
					var mergedList = bookInfosRes.map(item => {
						item.service_type = "none" //미구매표시용으로 insert때만 기본값, 환불생각하면 그냥 기본값?
						var other = purchaseMap.get(item.id);
						return other ? {...item, ...other} : item;
					});
					mergedList.forEach(function(bookInfo) {
						bookInfo.book_id = UTIL.toNumber(bookInfo.id);
						bookInfo.unit_id = UTIL.toNumber(e.id);
						DB.updateData("store_book", bookInfo.book_id, bookInfo, "update");
					});
				}
			}
			return true;
		}
		catch(e) {
			console.error("updateBook 오류:", e);
		}
	},
	updateBook2: async function() {
		try {
			async function saveEmptyBook() {
				var orderList = await DB.getValueByIdx("store_order", "order_no", null);
				for(var orderItem of orderList) {
					var bookList = orderItem.book_list;
					for(var bookId of Object.keys(bookList)) {
						var bookData = await DB.getUniqueValue("store_book", "book_id", UTIL.toNumber(bookId));
						if(UTIL.isEmpty(bookData)) {
							bookData = {
								book_id: UTIL.toNumber(bookId),
								unit_id: 0
							}
							await DB.updateData("store_book", bookData.book_id, bookData, "update");
						}
					}
				}
			}
			await saveEmptyBook();

			var bookIdList = await DB.getValueByIdx("store_book", "book_id", {filter: {unit_id: 0}});
			var startOffset = 0;
			var limit = 100;
			var totalCnt = bookIdList.length;
			for(var offset=startOffset; offset<totalCnt; offset=offset+limit) {
				var bookIds = bookIdList.slice(offset, offset + limit);
				bookIds = [...new Set(bookIds.flatMap(obj => UTIL.toString(obj.book_id)))];
				var [bookInfosRes, bookPurchaseInfosRes] = await Promise.all([
					UTIL.request(URL.BOOK_API_BASE+"books?b_ids="+bookIds.join(","), null, { isResultJson: true }),
					UTIL.request(URL.LIBRARY_BASE+"items", {b_ids: bookIds}, { isResultJson: true })
				])
				
				var purchaseMap = new Map(bookPurchaseInfosRes.items.map(obj => [UTIL.toNumber(obj.b_id), obj]));
				var mergedList = bookInfosRes.map(item => {
					item.service_type = "none" //미구매표시용으로 insert때만 기본값, 환불생각하면 그냥 기본값?
					var other = purchaseMap.get(item.id);
					return other ? {...item, ...other} : item;
				});
				mergedList.forEach(async function(bookInfo) {
					var bookId = UTIL.toNumber(bookInfo.id);
					bookInfo.book_id = bookId;
					var tempBookId = UTIL.toNumber(bookInfo.property.review_display_id);

					var displayData = await DB.getUniqueValue("store_book", "book_id", tempBookId);
					if(UTIL.isEmpty(displayData)) {
						await DB.updateData("store_book", tempBookId, {
							book_id: tempBookId,
							unit_id: 0
						}, "update");
					}
					bookInfo.unit_id = UTIL.toNumber(displayData.unit_id) || 0;
					DB.updateData("store_book", bookInfo.book_id, bookInfo, "update");
				});
			}
		}
		catch(e) {
			console.error("updateBook 오류:", e);
		}
	},
	test: async function() {
		var bookIdList = await DB.getValueByIdx("store_book", "book_id", {filter: {unit_id: 0}});
		bookIdList.map((b) => {
			DB.deleteData("store_book", b.book_id);
		});
	}
//	
//			series_id: b.series.id,
//			
//			title: b.title.main,
//			thumbnail: b.thumbnail,
//			authors: b.authors,
//			categories: b.categories,
//			
//			prev_books: b.series.property.prev_books,	//nullable
//			next_books: b.series.property.next_books,	//nullable
//		
//			price_info: b.price_info.buy,
//			
//			file_size: b.file.size,
//			character_count: b.file.character_count,
//			
//			publish: b.publish,
//			
//			
//			expire_date: moment(b.expire_date).toDate(),
//			purchase_date: moment(b.purchase_date).toDate(),
//			is_deleted: b.is_deleted,
//			remain_time: b.remain_time,
//			service_type: b.service_type
//		}
//		DB.updateData("store_book", bookInfo.book_id, bookInfo, "update");
//	}
};
export default SYNC_BOOK;