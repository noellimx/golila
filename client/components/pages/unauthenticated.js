const NO_OP = () => {};

const getLoginPage = () => {
  const wrap = document.createElement("div");

  const username = document.createElement("input");
  username.setAttribute("type", "text");
  const password = document.createElement("input");
  password.setAttribute("type", "text");

  const button = document.createElement("button");
  button.innerHTML = "LOGIN";

  let onloginrequest = NO_OP;
  button.addEventListener("click", () => {
    const username_val = username.value;
    const password_val = password.value;
    onloginrequest(username_val, password_val);
  });

  const desc = document.createElement("div");

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

const loginPage = getLoginPage();

export default loginPage;
