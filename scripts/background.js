var BG = {
    request: function(callUrl, body, sendResponse) {
        var mtd = (body != null && typeof body != 'undefined') ? "POST" : "GET";
        fetch(callUrl, {
            method: mtd,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
    return true; // 비동기 sendResponse를 위한 필수 리턴
  }
});