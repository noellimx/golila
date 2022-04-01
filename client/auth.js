import * as Cookies from "js-cookie";
const cookier = Cookies.default;

const clientAuth = ((Cookies) => {
  const AUTH_COOKIE_NAME = "s-token";
  return {
    setAuth: (token) => {
      Cookies.set(AUTH_COOKIE_NAME, token);
    },

    getAuthToken: () => {
      return Cookies.get(AUTH_COOKIE_NAME);
    },
  };
})(cookier);

export default clientAuth;
