const { HashRouter: Router, Switch, Route } = ReactRouterDOM;

import InitPage from "./login.js"
import AfterLogin from "./components/App.js"
import Home from "./components/Home.js"

function Container() {
	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<InitPage/>
				</Route>
				<Route exact path="/App">
					<AfterLogin/>
				</Route>
				<Route exact path="/Home">
					<Home/>
				</Route>
			</Switch>
		</Router>
	);
}

ReactDOM.render(<Container/>, document.getElementById("root"));