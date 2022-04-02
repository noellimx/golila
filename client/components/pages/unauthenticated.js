import { newTextInput, newDivTag, newButton } from "../elements/index.js";
import { NO_OP, ADD_CLASS } from "../helpers.js";

const getLoginPage = () => {
  const wrap = document.createElement("div");
  ADD_CLASS(wrap, "page-login");
  const username = newTextInput();
  const password = newTextInput();

  const button = newButton({ desc: "LOGIN" });

  let onloginrequest = NO_OP;
  button.addEventListener("click", () => {
    const username_val = username.value;
    const password_val = password.value;
    onloginrequest(username_val, password_val);
  });

  const desc = newDivTag();

  const loginFailed = (why) => {
    desc.innerHTML = `${why}`;
  };

  wrap.replaceChildren(username, password, button, desc);

  return {
    frame: wrap,
    whenLoginRequest: (fn) => {
      onloginrequest = fn;
    },
    loginFailed,
  };
};

export default getLoginPage;
