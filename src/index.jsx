const { HashRouter: Router, Switch, Route } = ReactRouterDOM;

import InitPage from "./login.jsx"
import Home from "./components/Home.jsx"

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