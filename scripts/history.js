
function insertRefList(li) {
	var dt = {"order_no": li[0]};
	addData("order_list",dt,dt.order_no);
}

function setList(sectionElement) {
	var listItemList = sectionElement.querySelector(".buy_list_wrap").querySelectorAll("li.list_item a");
	var refList = [];
	for(var i=0; i<listItemList.length; i++){
		var temp = listItemList[i].getAttribute("href");
		temp = temp.replace(history_url+"/","");
		refList.push(temp);
	}
	insertRefList(refList);
}

function setRidiGlobalVal() {
	var scripts = $(GD.historyDOM).find("script");
	var targetStr = null;
	scripts.each(function() {
		var cd = $(this).text();
		if(cd.includes("var Ridi")) {
			targetStr = $(this);
			return false;
		}
	});
	
	if(targetStr) {
		if(RR.isEmpty(targetStr)) return;
		
		var code = targetStr[0].innerText;
		var match = code.match(/Ridi\.globals\s*=\s*({[\s\S]*?});/);
		if(match){
			var jsonLike = match[1];
			copyRidi.globals = JSON.parse(RR.jsObjectToJson(jsonLike));
		}
		
		match = code.match(/Ridi\.Auth\s*=\s*([\s\S]*?);/);
		if(match){
			var temp = match[1];
			copyRidi.Auth = (temp == 'true');
		}
		
		match = code.match(/Ridi\.Platform\s*=\s*'([\s\S]*?)';/);
		if(match){
			var temp = match[1];
			copyRidi.Platform = temp;
		}
	}
	
	
//		var sectionElement = htmlDOM.querySelector("#"+GD.section_id);
//		setList(sectionElement);
}

function getRidiHistoryHTML() {
	RR.request(GD.base_url+GD.history_url, null, function(res) {
		var htmlDOM = parser.parseFromString(res, "text/html");
		GD.historyDOM = htmlDOM;
		setRidiGlobalVal();
	}, function(e) {
		console.log("fail");
	});
}