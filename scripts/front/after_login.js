$(document).ready(function() {
    initDB();
    setRidiGlobalVal();
    updatePageInfo();
    $(document).on("click", "#init_db", () => initDB());
    $(document).on("click", "#init_page_info", () => updatePageInfo());
    $(document).on("click", "#load_order_list", () => syncOrderList());
    $(document).on("click", "#load_detail_list", () => syncOrderDetail());
    $(document).on("click", "#test", () => test());
    // $(document).on("click", "#load_index", () => {
    //     window.location.href = "index.html"
    // })
}) ;

function test() {
	var p = UTIL.request(
		"https://library-api.ridibooks.com/items" 
		// , null
		, {b_ids: ["2008055514","2008055510","2008055513","875145890","875145874"]}
		// , null
		, {isResultJson: true}
	);
	p.then((res) => console.log(res));
//	console.log(res);
}
