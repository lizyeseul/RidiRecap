const {
  useState
} = React;
import DB from "../../scripts/connect_db.js";
import SESSION from "../../scripts/session.js";
import SYNC_ORDER from "../../scripts/sync/sync_order.js";
import SYNC_BOOK from "../../scripts/sync/sync_book.js";

function Setting() {
  const [isSync, setIsSync] = useState(false);
  const [ingPage, setIngPage] = useState(null);

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

  async function syncLib() {
    setIsSync(true);
    await SYNC_BOOK.updateLib();
    setIsSync(false);
  }

  async function syncBookAllByUnit() {
    setIsSync(true);
    await SYNC_BOOK.syncBookAllByUnit();
    setIsSync(false);
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
  }, "\uACB0\uC81C\uB0B4\uC5ED \uC804\uCCB4"), /*#__PURE__*/React.createElement("button", {
    onClick: syncOrderRecent,
    disabled: isSync
  }, "\uACB0\uC81C\uB0B4\uC5ED")), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "\uCC45 \uC815\uBCF4 \uC5C5\uB370\uC774\uD2B8"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", {
    onClick: syncLib,
    disabled: isSync
  }, "\uC11C\uC7AC \uBAA9\uB85D"), /*#__PURE__*/React.createElement("button", {
    onClick: syncBookAllByUnit,
    disabled: isSync
  }, "\uD45C\uC9C0 \uAE30\uC900")));
}

export default Setting;
