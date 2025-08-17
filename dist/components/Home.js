const {
  HashRouter: Router,
  Switch,
  Route,
  useHistory
} = ReactRouterDOM;
const {
  useEffect,
  useState
} = React;
import Order from "./Order.js";
import initDB from "../../scripts/connect_db.js";

function Home() {
  const history = useHistory();
  useEffect(() => {
    initDB();
  }, []);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => history.push("/Home/order"),
    order: true
  }), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/Home/order"
  }, /*#__PURE__*/React.createElement(Order, null))));
}

export default Home;