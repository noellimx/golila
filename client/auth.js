import * as Cookies from "js-cookie";
import { NO_OP } from "./components/helpers.js";
const cookier = Cookies.default;

const ClientAuth = (io) => {
  return ((Cookies) => {
    const AUTH_COOKIE_NAME = "s-token";

    let status_msg = "";

    const getAuthToken = () => Cookies.get(AUTH_COOKIE_NAME);
    const setAuth = ({ securityToken, msg }) => {
      if (!securityToken) {
        console.log("[setAuth] removing authorization");
        Cookies.remove(AUTH_COOKIE_NAME);
      } else {
        console.log(`[setAuth] setting cookie ${securityToken}`);

        Cookies.set(AUTH_COOKIE_NAME, securityToken);
      }
      status_msg = msg;
    };
    const getStatus = () => status_msg;

    const hasToken = () => !!getAuthToken();

    const hiServerIsMyCredentialsValid = ({ username, password }, fn) => {
      io.emit("login-request", { username, password }, (_authResponse) => {
        console.log(
          `[clientAuth requestLogin] Obtained token ${JSON.stringify(
            _authResponse
          )}`
        );
        const authResponse = _authResponse;
        setAuth(authResponse);
        fn(hasToken());
      });
    };

    const hiServerIsMyTokenValid = (fn) => {
      const token = getAuthToken();
      console.log(`[hiServerIsMyTokenValid] my token ${JSON.stringify(token)}`);
      io.emit("verify-token", token, (_authResponse) => {
        console.log(
          `[clientAuth hiServerIsMyTokenValid] Obtained token ${JSON.stringify(
            _authResponse
          )}`
        );
        const authResponse = _authResponse;
        setAuth(authResponse);
        fn(hasToken());
      });
    };

    let loggedOutFn = NO_OP;

    const iWantToLogOut = () => {
      Cookies.remove(AUTH_COOKIE_NAME);

      loggedOutFn();
    };
    const whenLoggedOut = (fn) => {
      loggedOutFn = fn;
    };

    return {
      hasToken,
      setAuth,
      getAuthToken,
      getStatus,
      hiServerIsMyCredentialsValid,
      hiServerIsMyTokenValid,
      iWantToLogOut,
      whenLoggedOut,
      AUTH_COOKIE_NAME,
    };
  })(cookier);
};

export default ClientAuth;
