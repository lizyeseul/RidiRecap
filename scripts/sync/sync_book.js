import DB from "../../scripts/connect_db.js";
var SYNC_BOOK = {
	/*
	서재에 있는 작품 목록 업데이트
	*/
	updateLib: async function() {
		try {
			var unitCnt = sessionStorage.getItem("unitCnt") || "500";
			var res = await UTIL.request(URL.LIBRARY_BASE+"items/main/?offset=0&limit="+unitCnt, null, { isResultJson: true });
			
			var serverDt = moment(res.server_info.server_date);
			var items = res.items;
			items.forEach(function(e) {
				var unit = {
					unit_id: UTIL.toString(e.unit_id),
					unit_count: e.unit_count,
					unit_title: e.unit_title,
					unit_type: e.unit_type,
					unit_type_int: e.unit_type_int,
					last_update_unit: serverDt.toDate()
				};
				DB.updateData("store_unit", UTIL.toString(e.unit_id), unit, "update");
			});
			return true;
		}
		catch(e) {
			console.error("updateLib 오류:", e);
		}
	},
	updateBook: async function() {
		try {
			var unitId = "3396974"; //TODO yslee 입력값으로 변경
			//https://library-api.ridibooks.com/books/units
			var unitListRes = await UTIL.request(URL.LIBRARY_BASE+"books/units", {unit_ids:[unitId]}, { isResultJson: true });
			await unitListRes.units.forEach(async function(e) {
				var startOffset = 0;
				var limit = 50;
//				var totalCnt = e.total_count;
				var totalCnt = 500;
				
				for(var offset=startOffset; offset<totalCnt; offset=offset+limit) {
					var booksRes = await UTIL.request(URL.LIBRARY_BASE+"books/units/"+e.id+"/order?offset="+UTIL.toString(offset)+"&limit="+UTIL.toString(limit)+"&order_type=unit_order&order_by=asc", null, { isResultJson: true });
					var items = booksRes.items;
					var bookIds = [];
					items.forEach(function(obj) {
						bookIds.push(obj.b_ids[obj.b_ids.length-1]);
					});
					bookIds = bookIds.substr(0,bookIds.length-1);
					var bookInfosRes = await UTIL.request(URL.BOOK_API_BASE+"books?b_ids="+bookIds.join(","), null, { isResultJson: true });
					var bookPurchaseInfosRes = await UTIL.request(URL.LIBRARY_BASE+"items", {b_ids: bookIds}, { isResultJson: true });
		
					if(offset==startOffset) {
						var b0 = bookInfosRes[0];
						var unitInfo = {
							unit_id: unitId,
							
							series_id: b0.series.id,
							is_completed: b0.series.property.is_completed,	//update 가능성
							is_serial: b0.series.property.is_serial,
							is_serial_complete: b0.series.property.is_serial_complete,	//update 가능성
							opened_last_volume_id: b0.series.opened_last_volume_id,	//update 가능성
							title: b0.series.property.title,
							total_book_count: b0.series.property.total_book_count,	//update 가능성
							unit: b0.series.property.unit,
							
							is_webtoon: b0.file.is_webtoon,
							property: b0.property,
							publisher: b0.publisher,
							
							service_type: "none"//미구매표시용으로 insert때만 기본값, 환불생각하면 그냥 기본값?
						}
						DB.updateData("store_unit", unitId, unitInfo, "update");
					}
					
					bookInfosRes.forEach(async function(bookInfo) {
						await SYNC_BOOK.upsertBookInfo(unitId, bookInfo);
					});
					bookPurchaseInfosRes.forEach(async function(bookInfo) {
						await SYNC_BOOK.upsertBookInfo(unitId, bookInfo);
					});
				}
			});
			return true;
		}
		catch(e) {
			console.error("updateBook 오류:", e);
		}
	},
	upsertBookInfo: async function(unitId, b) {
		var bookInfo = {
			book_id: UTIL.toString(b.id),
			unit_id: unitId,
			volume: b.series.volume,
	
			series_id: b.series.id,
			
			title: b.title.main,
			thumbnail: b.thumbnail,
			authors: b.authors,
			categories: b.categories,
			
			prev_books: b.series.property.prev_books,	//nullable
			next_books: b.series.property.next_books,	//nullable
		
			price_info: b.price_info.buy,
			
			file_size: b.file.size,
			character_count: b.file.character_count,
			
			publish: b.publish
		}
		DB.updateData("store_book", bookInfo.book_id, bookInfo, "update");
	}
};
export default SYNC_BOOK;