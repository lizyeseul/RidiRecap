const {
  useState,
  useEffect
} = React;
import SYNC_BOOK from "../../scripts/sync/sync_book.js";
import DB from "../../scripts/connect_db.js";
function Book() {
  const [isSync, setIsSync] = useState(false);
  const [unitInfo, setUnitInfo] = useState([]);
  const [isUnitAllChecked, setIsUnitAllChecked] = useState(false);
  const [checkedListById, setCheckedListById] = useState([]);
  useEffect(() => {
    findLibList();
  }, []);
  const onCheckUnit = id => {
    setCheckedListById(prev => checkedListById.includes(id) ? prev.filter(el => el !== id) : [...prev, id]);
  };
  function onCheckUnitAll() {
    setIsUnitAllChecked(!isUnitAllChecked);
    setCheckedListById(isUnitAllChecked ? [] : unitInfo.map(b => {
      return b.unit_id;
    }));
  }
  function UnitInfoRow({
    unitInfo
  }) {
    return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      name: unitInfo.unit_id,
      type: "checkbox",
      onChange: () => onCheckUnit(unitInfo.unit_id),
      checked: checkedListById.includes(unitInfo.unit_id)
    })), /*#__PURE__*/React.createElement("td", null, unitInfo.unit_id), /*#__PURE__*/React.createElement("td", null, unitInfo.unit_title), /*#__PURE__*/React.createElement("td", null, unitInfo.unit_type));
  }
  async function findLibList() {
    setIsSync(true);
    var tempList = await DB.getValueByIdx("store_unit", "unit_id", {
      direction: "prev"
    });
    setUnitInfo(tempList.filter(u => {
      return true;
      u.property = u.property || {
        is_adult_only: true
      };
      return u.property.is_adult_only === false;
    }));
    setIsSync(false);
  }
  async function updateLib() {
    setIsSync(true);
    await SYNC_BOOK.updateLib();
    setIsSync(false);
  }
  async function updateUnitDetail() {
    setIsSync(true);
    await SYNC_BOOK.updateUnitDetail();
    setIsSync(false);
  }
  async function updateBook() {
    setIsSync(true);
    await SYNC_BOOK.updateBook(checkedListById);
    setIsSync(false);
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, isSync ? 'sync' : 'end'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: updateLib,
    disabled: isSync
  }, "unit \uBAA9\uB85D update"), /*#__PURE__*/React.createElement("button", {
    onClick: updateUnitDetail,
    disabled: true
  }, "unit \uC0C1\uC138 update"), /*#__PURE__*/React.createElement("button", {
    onClick: updateBook,
    disabled: isSync
  }, "\uCC45 \uC0C1\uC138 update"), /*#__PURE__*/React.createElement("button", {
    onClick: findLibList,
    disabled: isSync
  }, "\uBAA9\uB85D \uC870\uD68C")), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    onChange: () => onCheckUnitAll(),
    checked: isUnitAllChecked
  })), /*#__PURE__*/React.createElement("td", null, "unit_id"), /*#__PURE__*/React.createElement("td", null, "\uC81C\uBAA9"), /*#__PURE__*/React.createElement("td", null, "unit\uC885\uB958")), unitInfo.map(o => /*#__PURE__*/React.createElement(UnitInfoRow, {
    unitInfo: o
  }))));
}
export default Book;