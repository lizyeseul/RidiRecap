const {
  useState,
  useEffect
} = React;
import DB from "../../scripts/connect_db.js";
import SYNC_PURCHASE from "../../scripts/sync/sync_purchase.js";
function Purchase() {
  const [tempData, setTempData] = useState();
  const [selectedStore, setSelectedStore] = useState();
  const [searchKey, setSearchKey] = useState();
  const [searchValue, setSearchValue] = useState();
  const [searchLimit, setSearchLimit] = useState();
  async function findData() {
    var r;
    if (UTIL.isNotEmpty(searchValue)) {
      r = await DB.getUniqueValue("store_" + selectedStore, searchKey, searchValue);
    } else {
      r = await DB.getValueByIdx("store_" + selectedStore, searchKey, {
        limit: searchLimit
      });
    }
    setTempData(JSON.stringify(r));
  }
  async function syncPurchase() {
    SYNC_PURCHASE.syncPurchase();
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: findData
  }, "\uB370\uC774\uD130 \uC870\uD68C"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setTempData();
    }
  }, "\uB370\uC774\uD130 \uCD08\uAE30\uD654"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("select", {
    name: "store",
    onChange: e => {
      setSelectedStore(e.target.value);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "order"
  }, "order"), /*#__PURE__*/React.createElement("option", {
    value: "unit"
  }, "unit"), /*#__PURE__*/React.createElement("option", {
    value: "book"
  }, "book")), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "storeKey",
    placeholder: "key",
    onChange: e => setSearchKey(e.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "storeSearchValue",
    placeholder: "value",
    onChange: e => setSearchValue(e.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    name: "storeLimit",
    placeholder: "limit",
    onChange: e => setSearchLimit(e.target.value)
  })), /*#__PURE__*/React.createElement("hr", null), tempData, UTIL.isNotEmpty(tempData) ? /*#__PURE__*/React.createElement("hr", null) : null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: syncPurchase
  }, "\uB370\uC774\uD130 \uB3D9\uAE30\uD654")));
}
export default Purchase;