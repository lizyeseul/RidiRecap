const {
  useState
} = React;
import SYNC_ORDER from "../../scripts/sync/sync_order.js";
import DB from "../../scripts/connect_db.js";
import SESSION from "../../scripts/session.js";

function Setting() {
  const [isSync, setIsSync] = useState(false);
  const [ingPage, setIngPage] = useState(null);
  const [orderInfo, setOrderInfo] = useState([]);

  async function syncOrderAll() {
    setIsSync(true);
    await SYNC_ORDER.syncOrder(1, sessionStorage.getItem("lastPageNum"), setIngPage);
    setIsSync(false);
  }

  async function syncOrderRecent() {
    setIsSync(true);
    await SYNC_ORDER.syncOrderRecent(setIngPage);
    setIsSync(false);
  }

  async function findRecentOrder() {
    setIsSync(true);
    var tempList = await DB.getValueByIdx("store_order", "order_seq", {
      direction: "prev",
      limit: 100
    });
    setOrderInfo(tempList);
    setIsSync(false);
  }

  function OrderInfoRow({
    orderInfo
  }) {
    return /*#__PURE__*/React.createElement("li", null, orderInfo.order_no, " : ", moment(orderInfo.order_dttm).format("YYYYMMDD"), ", ", orderInfo.total_amt);
  }

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: DB.initDB
  }, "DB \uC5F0\uACB0"), /*#__PURE__*/React.createElement("button", {
    onClick: SESSION.setRidiGlobalVal
  }, "\uB9AC\uB514 \uC804\uC5ED\uBCC0\uC218 \uC138\uD305"), /*#__PURE__*/React.createElement("button", {
    onClick: SESSION.updatePageInfo
  }, "\uCD08\uAE30\uAC12 \uC138\uD305"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("span", null, isSync ? 'sync ' + ingPage : 'end'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: syncOrderAll,
    disabled: isSync
  }, "\uACB0\uC81C\uB0B4\uC5ED \uC804\uCCB4 \uB3D9\uAE30\uD654"), /*#__PURE__*/React.createElement("button", {
    onClick: syncOrderRecent,
    disabled: isSync
  }, "\uACB0\uC81C\uB0B4\uC5ED \uC5C5\uB370\uC774\uD2B8"), /*#__PURE__*/React.createElement("button", {
    onClick: findRecentOrder,
    disabled: isSync
  }, "\uC870\uD68C(100\uAC1C)")), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("ul", null, orderInfo.map(o => /*#__PURE__*/React.createElement(OrderInfoRow, {
    orderInfo: o
  }))));
}

export default Setting;
