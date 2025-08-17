const { HashRouter: Router, Switch, Route, useHistory } = ReactRouterDOM;
const { useEffect, useState } = React;

import Order from "./Order.js"
import initDB from "../../scripts/connect_db.js"

function Home() {
	const history = useHistory();
	useEffect(() => {
		initDB();
	}, []);
	return (
		<div>
			<button onClick={() => history.push("/Home/order")}order></button>
			<Switch>
				<Route exact path="/Home/order">
					<Order/>
				</Route>
			</Switch>
		</div>
	);
}

export default Home;
