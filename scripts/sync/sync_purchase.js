import DB from "../../scripts/connect_db.js";
var SYNC_PURCHASE = {
	updateLib: async function() {
		var orderList = await DB.getValueByIdx("store_order", "order_no", null);
	}
};
export default SYNC_PURCHASE;