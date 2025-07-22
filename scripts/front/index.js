function checkLogin() {
	GD.isLogin = false;
	$("#login_try_result")[0].innerText = "ing...";
	UTIL.request(URL.base + URL.auth, null, function(res) {
		var auth = res.auth || {};
		if(auth.loggedUser != null) {
			GD.isLogin = true;
			window.location.href = "after_login.html"
		}
		else {
			failLogin();
		}
	}, function(e) {
		failLogin();
	}, {isResultJson: true});
}
function failLogin() {
	GD.isLogin = false;
	$("#login_try_result")[0].innerText = "fail";
}

$(document).ready(function() {
	$(document).on("click", "#check_login", () => checkLogin())
	checkLogin();
});

