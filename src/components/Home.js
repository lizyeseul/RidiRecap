const { Switch, Route, useHistory } = ReactRouterDOM;
const { useEffect } = React;

import Order from "./Order.js"
import DB from "../../scripts/connect_db.js"
import SESSION from "../../scripts/session.js"

function Home() {
	const history = useHistory();
	useEffect(() => {
		DB.initDB();
		SESSION.setRidiGlobalVal();
		SESSION.updatePageInfo();
	}, []);
	return (
		<div>
			<button onClick={DB.initDB}>DB 연결</button>
			<button onClick={SESSION.setRidiGlobalVal}>리디 전역변수 세팅</button>
			<button onClick={SESSION.updatePageInfo}>초기값 세팅</button>
			<hr/>
			<button onClick={() => history.push("/Home/order")}>order</button>
			<Switch>
				<Route exact path="/Home/order">
					<Order/>
				</Route>
			</Switch>
		</div>
	);
}

export default Home;
