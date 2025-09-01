const { HashRouter: Router, Switch, Route } = ReactRouterDOM;

import InitPage from "./login.js"
import Home from "./components/Home.js"

function Container() {
	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<InitPage/>
				</Route>
				<Route path="/Home">
					<Home/>
				</Route>
			</Switch>
		</Router>
	);
}

ReactDOM.render(<Container/>, document.getElementById("root"));