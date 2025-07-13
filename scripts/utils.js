var RR = {
    isEmpty: function(obj) {
        if(obj === null) return true;
        if(typeof(obj) === 'undefined') return true;
        if(typeof(obj) == "string") {
            if(obj == '') return true;
        }
        if(typeof(obj) == 'array' && obj.length == 0) return true;
        if(typeof(obj) == 'object' && Object.keys(obj).length == 0) return true;
        return false;
    },
    isNotEmpty: function(obj) {
        return !RR.isEmpty(obj);
    },
    request: function(callUrl, body, okFn, failFn) {
        chrome.runtime.sendMessage(
            {
                type: 'BG_REQUEST',
                url: callUrl,
                body: body
            },
            function (response) {
                if (response?.success) {
                    okFn(response.data);
                } else {
                    failFn(response.error);
                }
            }
        );
    }
};
