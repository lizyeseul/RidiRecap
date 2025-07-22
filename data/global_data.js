var GD = {
	"section_id": "page_buy_history",
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