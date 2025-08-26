import DB from "../../scripts/connect_db.js";
import purchaseClass from "../../scripts/schema/purchase.js";

var SYNC_PURCHASE = {
	syncPurchase: async function() {
//		var orderList = await DB.getValueByIdx("store_order", "order_no", null);
		var orderList = await DB.getUniqueValue("store_order", "order_no", "2025041866111106");
		orderList = [orderList];
		for(var orderItem of orderList) {
			var bookList = orderItem.book_list;
			for(var bookId of Object.keys(bookList)) {
				var bookData = await DB.getUniqueValue("store_book", "book_id", UTIL.toString(bookId));
				var unitData = await DB.getUniqueValue("store_unit", "unit_id", UTIL.toString(bookData.unit_id));
				
				var purchaseItem = new purchaseClass();
				purchaseItem.setRawClass(orderItem, unitData, bookData);
				console.log(purchaseItem)
			}
		}
	}
};
export default SYNC_PURCHASE;