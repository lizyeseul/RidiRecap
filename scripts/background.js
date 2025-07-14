var BG = {
	request: function(callUrl, body, sendResponse) {
		var mtd = (body != null && typeof body != 'undefined') ? "POST" : "GET";
		fetch(callUrl, {
			method: mtd,
			headers: { 
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Whale/4.32.315.22 Safari/537.36',
				'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: mtd === "POST" ? body : undefined
		})
		.then(async (res) => {
			const text = await res.text(); 
			sendResponse({ success: true, data: text });
		})
		.catch((err) => {
			sendResponse({ success: false, error: err.toString() });
		});
	}
};
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'BG_REQUEST') {
	BG.request(message.url, message.body, sendResponse);
  }
	return true; // 비동기 sendResponse를 위한 필수 리턴
});

chrome.action.onClicked.addListener((tab) => {
	chrome.sidePanel.setOptions({
		tabId: tab.id,
		path:"html/index.html",
		enabled: true
	},()=>{
		chrome.sidePanel.open({tabId: tab.id});
	})
})