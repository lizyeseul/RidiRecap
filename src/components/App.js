const { useEffect, useState } = React;

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  useEffect(() => {
    fetch("https://api.coinpaprika.com/v1/tickers?limit=10")
      .then((res) => res.json())
      .then((json) => {
        setCoins(json);
        setLoading(false);
      });
  }, []);
  return (
    <div>
      <h1>The Coins ({coins.length})</h1>
      {loading ? <strong>Loading...</strong> : null}
      <ul>
        {coins.map((coin) => {
          return (
            <li>
              {coin.name} ({coin.symbol}): {coin.quotes.USD.price} USD
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
