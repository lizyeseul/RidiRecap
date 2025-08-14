const { useEffect, useState } = React;

//import AfterLogin from "./components/App.js"

function InitPage({onSetIsLogin}) {
	const [isCheckingLogin, setIsCheckingLogin] = useState(false);
	function checkLogin() {
//		localStorage.removeItem("copyRidi");
		setIsCheckingLogin(true);
		setTimeout( () => {
			setIsCheckingLogin(false);
			if(false) {
				onSetIsLogin(true);
			}
			else {
				onSetIsLogin(false);
			}
		}, 1000);
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
			<script src="../sciprts/static.js"/>
			<script src="../sciprts/utils.js"/>
			{isLogin ? null : <InitPage onSetIsLogin={onSetIsLogin}/>}
		</div>
	);
}

ReactDOM.render(<Container/>, document.getElementById("root"));