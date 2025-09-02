const { Switch, Route, useHistory, useRouteMatch } = ReactRouterDOM;
const { useEffect } = React;

import DB from "../../scripts/connect_db.js";
import SESSION from "../../scripts/session.js";

import Setting from "./Setting.js";
import Order from "./Order.js";
import Book from "./Book.js";
import Purchase from "./Purchase.js";

function Home() {
	const history = useHistory();
	const { path, url } = useRouteMatch();
	useEffect(() => {
		DB.initDB();
		SESSION.setRidiGlobalVal();
		SESSION.updatePageInfo();
	}, []);
	return (
		<div>
			<button onClick={() => history.push(`/Home`)}>Home</button>
			<button onClick={() => history.push(`/Home/Setting`)}>Setting</button>
			<hr/>
			<Switch>
				<Route exact path={path}>
					<button onClick={() => history.push(`${url}/order`)}>order</button>
					<button onClick={() => history.push(`${url}/book`)}>book</button>
					<button onClick={() => history.push(`${url}/purchase`)}>purchase</button>
				</Route>
				<Route exact path={`${path}/Setting`}>
					<Setting/>
				</Route>
				<Route exact path={`${path}/order`}>
					<Order/>
				</Route>
				<Route exact path={`${path}/book`}>
					<Book/>
				</Route>
				<Route exact path={`${path}/purchase`}>
					<Purchase/>
				</Route>
			</Switch>
		</div>
	);
}

export default Home;
