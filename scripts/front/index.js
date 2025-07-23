async function checkLogin() {
	$("#login_try_result")[0].innerText = "ing...";
	localStorage.removeItem("copyRidi");
	try {
		const res = await UTIL.request(URL.base + URL.auth, null, { isResultJson: true });
		var auth = res.auth || {};
		if(auth.loggedUser != null) {
			window.location.href = "after_login.html"
		}
		else {
			failLogin();
		}
	} catch (e) {
		failLogin();
	}
}
function failLogin() {
	$("#login_try_result")[0].innerText = "fail";
}

$(document).ready(function() {
	$(document).on("click", "#check_login", () => checkLogin())
	checkLogin();
});

