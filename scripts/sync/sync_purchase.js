import DB from "../../scripts/connect_db.js";
import purchaseClass from "../../scripts/schema/purchase.js";

var SYNC_PURCHASE = {
	syncPurchase: async function() {
//		var orderList = await DB.getValueByIdx("store_order", "order_no", null);
		var orderList = await DB.getUniqueValue("store_order", "order_no", "2024121965524800");
		orderList = [orderList];
		for(var orderItem of orderList) {
			var bookList = orderItem.book_list;
			for(var bookId of Object.keys(bookList)) {
				var bookData = await DB.getUniqueValue("store_book", "book_id", UTIL.toNumber(bookId));
				if(UTIL.isEmpty(bookData)) {
					bookData = {
						book_id: UTIL.toNumber(bookId),
						unit_id: null
					}
					DB.updateData("store_book", bookData.book_id, bookData, "update");
					continue;
				}
				var unitData = await DB.getUniqueValue("store_unit", "unit_id", UTIL.toNumber(bookData.unit_id));
				
				var purchaseItem = new purchaseClass();
				purchaseItem.setRawClass(orderItem, unitData, bookData);
				console.log(purchaseItem);
				console.log(purchaseItem.order.dataForPurchase);
			}
		}
	}
};
export default SYNC_PURCHASE;