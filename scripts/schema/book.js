class book {
	constructor(data) {
		var me = this;
		Object.keys(data).forEach(function(key) {
			me[key] = data[key];
		})
	}
	
	unit_id;
	book_id;
	
	static schema = {
		book_id: "book 식별번호", //key, index, unique
		unit_id: "unit 식별번호", //index
		last_update_dttm: "(Date) 데이터 마지막 업데이트 시각"
	}
	
	get jsonObj() {
		return JSON.parse(JSON.stringify(this));
	}
	
	validate() {
		return true;
	}
}