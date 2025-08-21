const {
  useState
} = React;
import SYNC_BOOK from "../../scripts/sync/sync_book.js";
import DB from "../../scripts/connect_db.js";

function Book() {
  const [isSync, setIsSync] = useState(false);
  const [bookInfo, setBookInfo] = useState([]);

  function BookInfoRow({
    bookInfo
  }) {
    return /*#__PURE__*/React.createElement("li", null, bookInfo.unit_id, ": ", bookInfo.unit_title);
  }

  async function findLibList() {
    setIsSync(true);
    var tempList = await DB.getValueByIdx("store_unit", "unit_id", {
      direction: "prev"
    });
    setBookInfo(tempList);
    setIsSync(false);
  }

  async function updateLib() {
    setIsSync(true);
    await SYNC_BOOK.updateLib();
    setIsSync(false);
  }

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, isSync ? 'sync: ' : 'end'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: updateLib,
    disabled: isSync
  }, "\uCC45 \uBAA9\uB85D update"), /*#__PURE__*/React.createElement("button", {
    onClick: findLibList,
    disabled: isSync
  }, "\uBAA9\uB85D \uC870\uD68C")), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("ul", null, bookInfo.map(o => /*#__PURE__*/React.createElement(BookInfoRow, {
    bookInfo: o
  }))));
}

export default Book;