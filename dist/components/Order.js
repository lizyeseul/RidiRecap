const {
  useState
} = React;
import SYNC_ORDER from "../../scripts/sync/sync_order.js";
import DB from "../../scripts/connect_db.js";
function Order() {
  const [lastPageNum, setLastPageNum] = useState(sessionStorage.getItem("lastPageNum"));
  const [maxOrderSeq, setMaxOrderSeq] = useState(sessionStorage.getItem("maxOrderSeq"));
  const [fromPage, setFromPage] = useState(1);
  const [toPage, setToPage] = useState(lastPageNum);
  const [isSync, setIsSync] = useState(false);
  const [ingPage, setIngPage] = useState(null);
  function setIngPageLabel(from, to, cur) {
    var start = cur - from + 1;
    var end = to - from + 1;
    setIngPage(start + "/" + end);
  }
  const [orderInfo, setOrderInfo] = useState([]);
  async function syncOrder() {
    setIsSync(true);
    var from = UTIL.toNumber(fromPage);
    var to = UTIL.toNumber(toPage);
    if (from > to) {
      var temp = from;
      from = to;
      to = temp;
    }
    await SYNC_ORDER.syncOrder(from, to, setIngPageLabel);
    setIsSync(false);
  }
  async function syncOrderList() {
    setIsSync(true);
    await SYNC_ORDER.syncOrderList(fromPage, toPage, setIngPage);
    setIsSync(false);
  }
  async function syncOrderDetail() {
    setIsSync(true);
    await SYNC_ORDER.syncOrderDetail(fromPage, toPage, setIngPage);
    setIsSync(false);
  }
  async function findRecentOrder() {
    setIsSync(true);
    var tempList = await DB.getValueByIdx("store_order", "order_seq", {
      direction: "prev",
      limit: 15
    });
    setOrderInfo(tempList);
    setIsSync(false);
  }
  function OrderInfoRow({
    orderInfo
  }) {
    return /*#__PURE__*/React.createElement("li", null, orderInfo.order_no, " : ", orderInfo.order_dt, ", ", orderInfo.total_amt);
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "lastPageNum: ", lastPageNum), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", null, "maxOrderSeq: ", maxOrderSeq), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", null, isSync ? 'sync: ' + ingPage : 'end'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
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
    onClick: syncOrder,
    disabled: isSync
  }, "\uC8FC\uBB38 \uB3D9\uAE30\uD654"), /*#__PURE__*/React.createElement("button", {
    onClick: syncOrderList,
    disabled: isSync
  }, "sync order"), /*#__PURE__*/React.createElement("button", {
    onClick: syncOrderDetail,
    disabled: isSync
  }, "sync order detail"), /*#__PURE__*/React.createElement("button", {
    onClick: findRecentOrder,
    disabled: isSync
  }, "\uC870\uD68C(15\uAC1C)")), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("ul", null, orderInfo.map(o => /*#__PURE__*/React.createElement(OrderInfoRow, {
    orderInfo: o
  }))));
}
export default Order;