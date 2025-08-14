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
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "The Coins (", coins.length, ")"), loading ? /*#__PURE__*/React.createElement("strong", null, "Loading...") : null, /*#__PURE__*/React.createElement("ul", null, coins.map(coin => {
    return /*#__PURE__*/React.createElement("li", null, coin.name, " (", coin.symbol, "): ", coin.quotes.USD.price, " USD");
  })));
}

export default App;