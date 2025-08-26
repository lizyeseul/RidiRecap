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

/*
{
    "book_id": "425563231",
    "unit_id": "3396974",
    "volume": 1042,
    "series_id": "425193499",
    "title": "서브 남주가 파업하면 생기는 일 1042화",
    "thumbnail": {
        "small": "https://img.ridicdn.net/cover/425563231/small#1",
        "large": "https://img.ridicdn.net/cover/425563231/large#1",
        "xxlarge": "https://img.ridicdn.net/cover/425563231/xxlarge#1"
    },
    "authors": [
        {
            "id": 112937,
            "name": "숙임",
            "role": "author"
        }
    ],
    "categories": [
        {
            "id": 1752,
            "name": "퓨전 판타지",
            "genre": "fantasy",
            "sub_genre": "fantasy_serial",
            "is_series_category": true,
            "ancestor_ids": [
                1750,
                0
            ]
        }
    ],
    "prev_books": {
        "425562414": {
            "b_id": "425562414",
            "is_opened": true,
            "use_free_serial_schedule": false
        }
    },
    "price_info": {
        "regular_price": 100,
        "price": 100,
        "discount_percentage": 0
    },
    "file_size": 1438,
    "character_count": 4389,
    "publish": {
        "ebook_publish": "2025-08-22T00:00:00+09:00",
        "ridibooks_publish": "2025-08-22T14:00:08+09:00",
        "ridibooks_register": "2025-08-22T10:57:53+09:00"
    },
    "expire_date": "2025-08-25T08:21:48.288Z",
    "purchase_date": "2025-08-25T08:21:48.288Z",
    "service_type": "none",
    "last_update_dttm": "2025-08-25T08:22:02.256Z"
}
*/