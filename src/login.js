const { useEffect, useState } = React;
const { useHistory } = ReactRouterDOM;

function InitPage() {
	const [isLogin, setIsLogin] = useState(false);
	const [isCheckingLogin, setIsCheckingLogin] = useState(false);
	const history = useHistory();
	async function checkLogin() {
		localStorage.removeItem("copyRidi");
		setIsCheckingLogin(true);
		const res = await UTIL.request(URL.base + URL.auth, null, { isResultJson: true });
		var auth = res.auth || {};
		setIsCheckingLogin(false);
		setIsLogin(auth.loggedUser != null);
	}
	useEffect(() => {
		checkLogin();
	}, []);
	useEffect(() => {
		if(isLogin) {
			history.push("/App");
		}
	}, [isLogin]);
	return (
		<div>
			<h2>{isCheckingLogin ? 'checking...' : 'end check'}</h2>
			<button onClick={checkLogin}>
				재시도
			</button>
		</div>
	);
}

export default InitPage;