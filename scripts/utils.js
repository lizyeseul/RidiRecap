var UTIL = {
	isObject: function(object) {
		return object !== null && "object" === typeof object;
	},
	isDate: function(object) {
		return UTIL.isObject(object) && typeof object.getTime === "function";
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
	isNumber: function(object) {
		return "number" === typeof object;
	},
	
	toNumber: function(s) {
		if(UTIL.isString(s)) {
			s = s.replace(/[\,]/g, "");
		}
		return isNaN(s) ? 0 : Number(s);
	},
	getNumber: function(s) {
		var n = s.match(/[0-9]+/g);
		if(UTIL.isNotEmpty(n) && n.length>0) {
			var nn = UTIL.toNumber(n.join(""));
			if(UTIL.isNumber(nn)) return nn;
		}
		return null;
	},
	
	isEmpty: function(object) {
		return object === null
			 || "undefined" === typeof object
			 || (UTIL.isObject(object) && !Object.keys(object).length && !UTIL.isDate(object))
			 || (UTIL.isString(object) && object.trim() === "")
			 || (UTIL.isArray(object) && object.length === 0);
	},
	isNotEmpty: function(obj) {
		return !UTIL.isEmpty(obj);
	},

	request: function(callUrl, body, options) {
		var optionObj = options || {};
		optionObj.isResultJson = optionObj.isResultJson || false;
		return new Promise((resolve, reject) => {
			chrome.runtime.sendMessage(
				{
					type: 'BG_REQUEST',
					url: callUrl,
					body: body,
					option: optionObj
				},
				function (response) {
					if (response?.success) {
						resolve(response.data);
					}
					else {
						reject(response.error);
					}
				}
			);
		});
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
