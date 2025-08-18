const {
  useState
} = React;
import SYNC_ORDER from "../../scripts/sync/sync_order.js";

function Order() {
  const [lastPageNum, setLastPageNum] = useState(sessionStorage.getItem("lastPageNum"));
  const [fromPage, setFromPage] = useState(1);
  const [toPage, setToPage] = useState(lastPageNum);
  const [isSync, setIsSync] = useState(false);
  const [ingPage, setIngPage] = useState(null);

  function syncOrder(formData) {
    setIsSync(true);
    SYNC_ORDER.syncOrderList(fromPage, toPage, setIngPage);
    setIsSync(false);
  }

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "lastPageNum: ", lastPageNum), /*#__PURE__*/React.createElement("span", null, isSync ? 'sync: ' + ingPage : 'end'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("form", {
    action: syncOrder
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    name: "fromPage",
    value: fromPage,
    onChange: e => setFromPage(e.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    name: "toPage",
    value: toPage,
    onChange: e => setToPage(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit"
  }, "sync order")));
}

export default Order;