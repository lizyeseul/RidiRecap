const {
  HashRouter: Router,
  Switch,
  Route
} = ReactRouterDOM;
import InitPage from "./login.js";
import AfterLogin from "./components/App.js";
import Home from "./components/Home.js";

function Container() {
  return /*#__PURE__*/React.createElement(Router, null, /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/"
  }, /*#__PURE__*/React.createElement(InitPage, null)), /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/App"
  }, /*#__PURE__*/React.createElement(AfterLogin, null)), /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/Home"
  }, /*#__PURE__*/React.createElement(Home, null))));
}

ReactDOM.render( /*#__PURE__*/React.createElement(Container, null), document.getElementById("root"));