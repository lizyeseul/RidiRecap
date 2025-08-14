import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
const {
  useEffect,
  useState
} = React;
function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  useEffect(() => {
    fetch("https://api.coinpaprika.com/v1/tickers?limit=10").then(res => res.json()).then(json => {
      setCoins(json);
      setLoading(false);
    });
  }, []);
  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsxs("h1", {
      children: ["The Coins (", coins.length, ")"]
    }), loading ? /*#__PURE__*/_jsx("strong", {
      children: "Loading..."
    }) : null, /*#__PURE__*/_jsx("ul", {
      children: coins.map(coin => {
        return /*#__PURE__*/_jsxs("li", {
          children: [coin.name, " (", coin.symbol, "): ", coin.quotes.USD.price, " USD"]
        });
      })
    })]
  });
}
export default App;