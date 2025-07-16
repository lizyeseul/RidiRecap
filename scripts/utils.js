var RR = {
	isObject: function(object) {
		return object !== null && "object" === typeof object;
	},
	isDate: function(object) {
		return RR.isObject(object) && typeof object.getTime === "function";
	},
	isFunction: function(object) {
		return "function" === typeof object;
	},
	isString: function(object) {
		return "string" === typeof object;
	},
	isArray: function(object) {
		return Array.isArray(object);
	},
	isEmpty: function(object) {
		return object === null
			 || "undefined" === typeof object
			 || (RR.isObject(object) && !Object.keys(object).length && !RR.isDate(object))
			 || (RR.isString(object) && object.trim() === "")
			 || (RR.isArray(object) && object.length === 0);
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
				}
				else {
					failFn(response.error);
				}
			}
		);
	},

	jsObjectToJson: function(str) {
		return str
			.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
			.replace(/'([^']*)'/g, function(_, val) {
				return '"' + val.replace(/"/g, '\\"') + '"';
			})
			.replace(/,\s*}/g, '}')
	}
};
// 단일 변수 (string 등) 추출
function extractVar(script, varName) {
    const regex = new RegExp(`var\\s+${varName}\\s*=\\s*['"]([^'"]+)['"]`, 'm');
    const match = script.match(regex);
    return match ? match[1] : null;
}

// 객체형 변수 추출
function extractObject(script, varName) {
    const regex = new RegExp(`var\\s+${varName}\\s*=\\s*(\\{[\\s\\S]*?\\});`);
    const match = script.match(regex);
    if (match && match[1]) {
        try {
            return JSON.parse(match[1]
                .replace(/(\r\n|\n|\r)/gm, '')             // 줄바꿈 제거
                .replace(/,(\s*})/g, '$1')                 // 마지막 콤마 제거
                .replace(/([a-zA-Z0-9_]+):/g, '"$1":')     // 키에 따옴표 추가
                .replace(/'/g, '"')                        // 작은따옴표를 큰따옴표로
            );
        } catch (e) {
            console.error('JSON 파싱 오류:', e);
        }
    }
    return null;
}
