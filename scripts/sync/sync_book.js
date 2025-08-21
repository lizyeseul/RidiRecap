import DB from "../../scripts/connect_db.js";
var SYNC_BOOK = {
	/*
	서재에 있는 작품 목록 업데이트
	*/
	updateLib: async function() {
		try {
			var unitCnt = sessionStorage.getItem("unitCnt") || "500";
			var res = await UTIL.request(URL.LIBRARY_BASE+"/items/main/?offset=0&limit="+unitCnt, null, { isResultJson: true });
			
			var serverDt = moment(res.server_info.server_date);
			var items = res.items;
			items.forEach(function(e, idx) {
				var unit = {
					unit_id: e.unit_id,
					unit_count: e.unit_count,
					unit_title: e.unit_title,
					unit_type: e.unit_type,
					unit_type_int: e.unit_type_int,
					last_update_unit: serverDt.toDate()
				};
				DB.updateData("store_unit", e.unit_id, unit, "update");
			});
			return true;
		}
		catch(e) {
			console.error("updateLastPageInfo 오류:", e);
		}
	}
};
export default SYNC_BOOK;