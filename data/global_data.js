var GD = {
	"lastPageNum": 999,	//결제내역 마지막 페이지 번호
	"lastPageCnt": 15,	//결제내역 마지막 페이지의 목록 아이템 수
	
	"webViewerBaseUrl": '//view.ridibooks.com/books/',
	"isLogin": false
};
var URL = {
	"base": "https://ridibooks.com",
	"account": "/account/myridi",
	"history": "/order/history",
	"auth": '/api/global/auth-variables'
};

var DB = {
	name: "RIDI TEST",
	version: 1,
};
const parser = new DOMParser();

var historyDOM;
var copyRidi = {};