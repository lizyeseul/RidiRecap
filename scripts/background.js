var BG = {
	request: function(callUrl, body, sendResponse, option) {
		option = option || {};
		var mtd = (body != null && typeof body != 'undefined') ? "POST" : "GET";
		fetch(callUrl, {
			method: mtd,
			credentials: 'include',
			headers: { 
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Whale/4.32.315.22 Safari/537.36',
				'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
				"Content-Type": (option.isResultJson)?"application/json":'application/x-www-form-urlencoded'
			},
			body: mtd === "POST" ? JSON.stringify(body) : undefined
		})
		.then(async (res) => {
			try {
				if(option.isResultJson) {
					const result = await res.json(); 
					sendResponse({ success: true, data: result });
				}
				else {
					const json = await res.text(); 
					sendResponse({ success: true, data: json });
				}
			} catch (parseErr) {
				sendResponse({ success: false, error: "Response parsing error: " + parseErr.toString() });
			}
		})
		.catch((err) => {
			sendResponse({ success: false, error: err.toString() });
		});
	}
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'BG_REQUEST') {
	try {
		BG.request(message.url, message.body, sendResponse, message.option);
	} catch (e) {
		sendResponse({ success: false, error: "BG.request failed: " + e.toString() });
	}
  }
	return true; // 비동기 sendResponse를 위한 필수 리턴
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
.catch((error) => console.error(error));