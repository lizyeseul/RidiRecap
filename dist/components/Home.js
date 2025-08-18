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
import DB from "../../scripts/connect_db.js";
import SESSION from "../../scripts/session.js";

function Home() {
  const history = useHistory();
  useEffect(() => {
    DB.initDB();
    SESSION.setRidiGlobalVal();
    SESSION.updatePageInfo();
  }, []);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: DB.initDB
  }, "DB \uC5F0\uACB0"), /*#__PURE__*/React.createElement("button", {
    onClick: SESSION.setRidiGlobalVal
  }, "\uB9AC\uB514 \uC804\uC5ED\uBCC0\uC218 \uC138\uD305"), /*#__PURE__*/React.createElement("button", {
    onClick: SESSION.updatePageInfo
  }, "\uCD08\uAE30\uAC12 \uC138\uD305"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    onClick: () => history.push("/Home/order")
  }, "order"), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/Home/order"
  }, /*#__PURE__*/React.createElement(Order, null))));
}

export default Home;