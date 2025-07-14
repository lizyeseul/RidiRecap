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
		return object === null || "undefined" === typeof object || (RR.isObject(object) && !Object.keys(object).length && !RR.isDate(object)) || (RR.isString(object) && object.trim() === "") || (RR.isArray(object) && object.length === 0);
//		if(obj === null) return true;
//		if(typeof(obj) === 'undefined') return true;
//		if(typeof(obj) == "string") {
//			if(obj == '') return true;
//		}
//		if(typeof(obj) == 'array' && obj.length == 0) return true;
//		if(typeof(obj) == 'object' && Object.keys(obj).length == 0) return true;
//		return false;
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
