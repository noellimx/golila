import * as Cookies from "js-cookie";
const cookier = Cookies.default;

const clientAuth = ((Cookies) => {
  const AUTH_COOKIE_NAME = "s-token";

  let status_msg = "";

  const getAuthToken = () => Cookies.get(AUTH_COOKIE_NAME);

  const setAuth = ({ securityToken, msg }) => {
    if (!securityToken) {
      console.log("[setAuth] removing authorization");
      Cookies.remove(AUTH_COOKIE_NAME);
    } else {
      Cookies.set(AUTH_COOKIE_NAME, securityToken);
    }
    status_msg = msg;
  };
  const getStatus = () => status_msg;

  const hasToken = () => !!getAuthToken();
  return {
    hasToken,
    setAuth,
    getAuthToken,
    getStatus,
  };
})(cookier);

export default clientAuth;
