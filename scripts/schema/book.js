export default class bookClass {
	constructor(data) {
		var me = this;
		if(UTIL.isString(data)) {
			data = JSON.parse(data);
		}
		if(!UTIL.isArray(data) && UTIL.isObject(data)) {
			Object.keys(data).forEach(function(key) {
				me[key] = data[key];
			})
		}
		else {
//			console.debug("type err")
		}
	}
	
	unit_id;
	book_id;
	
	static schema = {
		book_id: "book 식별번호", //key, index, unique
		unit_id: "unit 식별번호", //index
		last_update_dttm: "(Date) 데이터 마지막 업데이트 시각"
	}
	
	get dataForPurchase() {
		return {
			book_id: this.book_id,
			authors: this.authors,
			categories: this.categories,
			display_order: this.display_order,
			display_title: this.display_title,
			expire_date: moment(this.expire_date),
			is_expired: this.is_expired,
			file: this.get_file,
			unit_title: this.unit_title,
			unit_title: this.unit_title,
			unit_title: this.unit_title,
			unit_title: this.unit_title,
			unit_title: this.unit_title,
			unit_title: this.unit_title,
			unit_title: this.unit_title,
			unit_title: this.unit_title,
			unit_title: this.unit_title,
			unit_title: this.unit_title,
			unit_title: this.unit_title,
			unit_title: this.unit_title,
		}
	}
	
	get get_file() {
		var f = this.file;
		if(f.format === "webtoon") {
			return {
				
			}
		}
		return (this.search_type === "book" || this.service_type === "normal");
	}
	get is_expired() {
		return (this.service_type === "rent" || this.service_type === "normal");
	}
	get jsonObj() {
		return JSON.parse(JSON.stringify(this));
	}
	
	validate() {
		return true;
	}
}