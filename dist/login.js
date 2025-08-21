const {
  useEffect,
  useState
} = React;
const {
  useHistory
} = ReactRouterDOM;
function InitPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [isCheckingLogin, setIsCheckingLogin] = useState(false);
  const history = useHistory();
  async function checkLogin() {
    localStorage.removeItem("copyRidi");
    setIsCheckingLogin(true);
    var res = await UTIL.request(URL.base + URL.auth, null, {
      isResultJson: true
    });
    var auth = res.auth || {};
    setIsCheckingLogin(false);
    setIsLogin(auth.loggedUser != null);
  }
  useEffect(() => {
    checkLogin();
  }, []);
  useEffect(() => {
    if (isLogin) {
      history.push("/Home");
    }
  }, [isLogin]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, isCheckingLogin ? 'checking...' : 'end check'), /*#__PURE__*/React.createElement("button", {
    onClick: checkLogin
  }, "\uC7AC\uC2DC\uB3C4"));
}
export default InitPage;