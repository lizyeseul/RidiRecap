const {
  useEffect,
  useState
} = React; //import AfterLogin from "./components/App.js"

function InitPage({
  onSetIsLogin
}) {
  const [isCheckingLogin, setIsCheckingLogin] = useState(false);

  function checkLogin() {
    //		localStorage.removeItem("copyRidi");
    setIsCheckingLogin(true);
    setTimeout(() => {
      setIsCheckingLogin(false);

      if (false) {
        onSetIsLogin(true);
      } else {
        onSetIsLogin(false);
      }
    }, 1000);
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

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("script", {
    src: "../sciprts/static.js"
  }), /*#__PURE__*/React.createElement("script", {
    src: "../sciprts/utils.js"
  }), isLogin ? null : /*#__PURE__*/React.createElement(InitPage, {
    onSetIsLogin: onSetIsLogin
  }));
}

ReactDOM.render( /*#__PURE__*/React.createElement(Container, null), document.getElementById("root"));