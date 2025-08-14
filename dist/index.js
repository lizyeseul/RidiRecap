const {
  useEffect,
  useState
} = React;
import AfterLogin from "./components/App.js";

function InitPage({
  onSetIsLogin
}) {
  const [isCheckingLogin, setIsCheckingLogin] = useState(false);

  async function checkLogin() {
    localStorage.removeItem("copyRidi");
    setIsCheckingLogin(true);
    const res = await UTIL.request(URL.base + URL.auth, null, {
      isResultJson: true
    });
    var auth = res.auth || {};
    onSetIsLogin(auth.loggedUser != null);
  }

  useEffect(() => {
    checkLogin();
  }, []);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, isCheckingLogin ? 'checking...' : 'end check'), /*#__PURE__*/React.createElement("button", {
    onClick: checkLogin
  }, "\uC7AC\uC2DC\uB3C4"));
}

function Container() {
  const [isLogin, setIsLogin] = useState(false);

  const onSetIsLogin = e => {
    setIsLogin(e);
  };

  return /*#__PURE__*/React.createElement("div", null, isLogin ? /*#__PURE__*/React.createElement(AfterLogin, null) : /*#__PURE__*/React.createElement(InitPage, {
    onSetIsLogin: onSetIsLogin
  }));
}

ReactDOM.render( /*#__PURE__*/React.createElement(Container, null), document.getElementById("root"));