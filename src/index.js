const { useEffect, useState } = React;

import AfterLogin from "./components/App.js"

function InitPage({onSetIsLogin}) {
	const [isCheckingLogin, setIsCheckingLogin] = useState(false);
	async function checkLogin() {
		localStorage.removeItem("copyRidi");
		setIsCheckingLogin(true);
		const res = await UTIL.request(URL.base + URL.auth, null, { isResultJson: true });
		var auth = res.auth || {};
		onSetIsLogin(auth.loggedUser != null);
	}
	useEffect(() => {
		checkLogin();
	}, []);
	return (
		<div>
			<h2>{isCheckingLogin ? 'checking...' : 'end check'}</h2>
			<button onClick={checkLogin}>
				재시도
			</button>
		</div>
	);
}

function Container() {
	const [isLogin, setIsLogin] = useState(false);
	const onSetIsLogin = (e) => { setIsLogin(e) };
	return (
		<div>
			{isLogin ? <AfterLogin/> : <InitPage onSetIsLogin={onSetIsLogin}/>}
		</div>
	);
}

ReactDOM.render(<Container/>, document.getElementById("root"));