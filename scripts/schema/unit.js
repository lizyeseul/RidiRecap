/*{
    "unit_id": "3396974",
    "unit_count": 978,
    "unit_title": "서브 남주가 파업하면 생기는 일",
    "unit_type": "series",
    "unit_type_int": 2,
    "last_update_unit": "2025-08-25T06:30:33.000Z",
    "last_update_dttm": "2025-08-25T08:21:41.915Z",
    "series_id": "425193499",
    "is_completed": false,
    "is_serial": true,
    "is_serial_complete": false,
    "opened_last_volume_id": "425563231",
    "title": "서브 남주가 파업하면 생기는 일",
    "total_book_count": 1315,
    "unit": "화",
    "is_webtoon": false,
    "property": {
        "is_adult_only": false,
        "is_magazine": false,
        "is_new_book": false,
        "is_novel": false,
        "is_open": true,
        "is_somedeal": false,
        "is_trial": false,
        "is_wait_free": false,
        "use_free_serial_schedule": false,
        "preview_rate": 0
    },
    "publisher": {
        "id": 425,
        "name": "문피아",
        "cp_name": "문피아_E/P"
    },
    "service_type": "none",
    "total_cnt": 1042,
    "is_adult_only": false,
    "is_magazine": false,
    "is_new_book": false,
    "is_novel": false,
    "is_open": true,
    "is_somedeal": false,
    "is_trial": false,
    "is_wait_free": false,
    "use_free_serial_schedule": false,
    "preview_rate": 0
}*/
class unit {
	constructor(data) {
		var me = this;
		Object.keys(data).forEach(function(key) {
			me[key] = data[key];
		})
	}
	
	unit_id;
	
	static schema = {
		unit_id: "unit 식별번호", //key, index, unique
		
		unit_count: "현재 공개된 화수",	//삭제된? 화가 있을 때 count될지는 모르겠음 그런 불미스러운일이 일어날수가 있나
		unit_title: "작품명",
		unit_type: "series|book|shelf, 의미는 모름, 1은 뭘까",
		unit_type_int: "(int) 2(series)|3(book)|4(shelf), 의미는 모름",
		
		series_id: "시리즈 첫번째 book_id",
		is_completed: "(Boolean) 완결여부",
		is_serial: "(Boolean) ",
		is_serial_complete: "(Boolean) ",
		is_webtoon: "(Boolean) 웹툰여부",
		
		opened_last_volume_id: "(int) unit_count랑 같은 정보",
		total_book_count: "(int) 공개 전 에피 포함 전체 화수",
		unit: "단위 ex)화, 권",
		property: {
			is_adult_only: false,
			is_magazine: false,
			is_new_book: true,
			is_novel: false,
			is_open: true,
			is_somedeal: false,
			is_trial: false,
			is_wait_free: false,
			review_display_id: "5211000001",
			use_free_serial_schedule: false,
			preview_rate: 0
		},
		publisher: {
			"id": 5211,
			"name": "익시드",
			"cp_name": "박정연(대대원)_개인_IAP_익시드"
		},
		last_update_dttm: "(Date) 데이터 마지막 업데이트 시각"
	}
	
	get jsonObj() {
		return JSON.parse(JSON.stringify(this));
	}
	
	validate() {
		return true;
	}
}