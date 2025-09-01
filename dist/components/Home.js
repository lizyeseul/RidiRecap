const {
  Switch,
  Route,
  useHistory,
  useRouteMatch
} = ReactRouterDOM;
const {
  useEffect
} = React;
import DB from "../../scripts/connect_db.js";
import SESSION from "../../scripts/session.js";
import Order from "./Order.js";
import Book from "./Book.js";
import Purchase from "./Purchase.js";
function Home() {
  const history = useHistory();
  const {
    path,
    url
  } = useRouteMatch();
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
  }, "\uCD08\uAE30\uAC12 \uC138\uD305"), /*#__PURE__*/React.createElement("button", {
    onClick: () => history.push(`/Home`)
  }, "Home"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: path
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => history.push(`${url}/order`)
  }, "order"), /*#__PURE__*/React.createElement("button", {
    onClick: () => history.push(`${url}/book`)
  }, "book"), /*#__PURE__*/React.createElement("button", {
    onClick: () => history.push(`${url}/purchase`)
  }, "purchase")), /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: `${path}/order`
  }, /*#__PURE__*/React.createElement(Order, null)), /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: `${path}/book`
  }, /*#__PURE__*/React.createElement(Book, null)), /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: `${path}/purchase`
  }, /*#__PURE__*/React.createElement(Purchase, null))));
}
export default Home;