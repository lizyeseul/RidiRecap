function checkLogin() {
	RR.request(GD.base_url + GD.account_url, null, function(res) {
		GD.isLogin = true;
		window.location.href = "after_login.html"
	}, function(e) {
		console.log("fail");
		GD.isLogin = false;
	})
}

$(document).ready(function() {
	$(document).on("click", "#check_login", () => checkLogin())
	checkLogin();
});

