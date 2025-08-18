/*
서재에 있는 작품 목록 업데이트
*/
async function syncLibInfo() {
	//https://library-api.ridibooks.com/items/main/?offset=0&limit=500
	$("#parse_log")[0].innerText = "sync lib start";
	
	try {
		//TODO: https://library-api.ridibooks.com/items/main/count/ 이용해서 limit=unit_total_count 숫자 세팅
		//{"item_total_count":11298,"unit_total_count":162}
		
		var res = await UTIL.request(URL.LIBRARY_BASE+"/items/main/?offset=0&limit=500", null, { isResultJson: true });
		
		var items = res.items;
		
		
		
		
		
		
		
		
		
		
		
		
	}
	catch(e) {
		console.error("updateLastPageInfo 오류:", e);
	}
	$("#parse_log")[0].innerText = "sync lib end";
}




/*
책 정보 저장
*/
async function syncBookInfo() {
}
