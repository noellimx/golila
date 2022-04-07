import "./unauthenticated.css";
import {
  newTextInput,
  newDivTag,
  newButton,
  newPasswordInput,
} from "../elements/index.js";
import { NO_OP, ADD_CLASS, DETACH, UPDATE_TEXT } from "../helpers.js";

const getLoginForm = () => {
  const frame = newDivTag();
  ADD_CLASS(frame, "form-login-frame");

  const username = newTextInput();
  const password = newPasswordInput();

  username.placeholder = "username";
  password.placeholder = "password";

  [password, username].forEach((e) => ADD_CLASS(e, "login-form-input"));

  const loginButton = newButton({ desc: "LOGIN" });
  ADD_CLASS(loginButton, "form-login-button");

  let onloginrequest = NO_OP;
  loginButton.addEventListener("click", () => {
    const username_val = username.value;
    const password_val = password.value;
    onloginrequest(username_val, password_val);
  });

  const iAmNewBtn = newButton({ desc: "I'M NEW" });
  ADD_CLASS(iAmNewBtn, "form-go-to-register-button");
  let iamnewbtnLn = NO_OP;
  iAmNewBtn.addEventListener("click", () => {
    iamnewbtnLn();
  });

  const regbtnwrap = newDivTag();
  ADD_CLASS(regbtnwrap, "reg-btns-wrap");

  regbtnwrap.replaceChildren(loginButton, iAmNewBtn);

  frame.replaceChildren(username, password, regbtnwrap);

  const detach = () => {
    DETACH(frame);
  };
  return {
    frame,
    detach,

    whenLoginRequest: (fn) => {
      onloginrequest = fn;
    },
    whenViewRegistrationRequest: (fn) => {
      iamnewbtnLn = fn;
    },
  };
}; // END OF LOGIN FORM

const getRegistrationForm = () => {
  const frame = newDivTag();
  ADD_CLASS(frame, "form-registration-frame");

  const username = newTextInput();
  const password = newPasswordInput();
  const password2 = newPasswordInput();

  username.placeholder = "username";
  password.placeholder = "password";
  password2.placeholder = "confirm password";
  [password, username, password2].forEach((e) =>
    ADD_CLASS(e, "login-form-input")
  );

  const regbtnwrap = newDivTag();
  ADD_CLASS(regbtnwrap, "reg-btns-wrap");

  const registerButton = newButton({ desc: "REGISTER" });
  ADD_CLASS(registerButton, "form-register-button");

  let onregisterrequest = NO_OP;
  registerButton.addEventListener("click", () => {
    const username_val = username.value;
    const password_val = password.value;
    const password2_val = password2.value;
    onregisterrequest(username_val, password_val, password2_val);
  });

  const iWantToLoginBtn = newButton({ desc: "GOTO LOGIN" });
  ADD_CLASS(iWantToLoginBtn, "form-go-to-login-button");
  let iwanttologinLn = NO_OP;
  iWantToLoginBtn.addEventListener("click", () => {
    iwanttologinLn();
  });

  regbtnwrap.replaceChildren(registerButton, iWantToLoginBtn);
  frame.replaceChildren(username, password, password2, regbtnwrap);

  const detach = () => {
    DETACH(frame);
  };

  const succeed = () => {
    console.log("succeed");
    username.value = "";
    password.value = "";
    password2.value = "";
  };
  const notSucceed = () => {
    password.value = "";
    password2.value = "";
  };
  return {
    frame,
    detach,
    notSucceed,
    succeed,

    whenRegisterRequest: (fn) => {
      onregisterrequest = fn;
    },
    whenViewLoginRequest: (fn) => {
      iwanttologinLn = fn;
    },
  };
}; // END OF REGISTRATION FORM

const newImg = () => document.createElement("img");

const getLoginPage = () => {
  const frame = newDivTag();
  ADD_CLASS(frame, "page-customs-frame");

  const staticwrap = newDivTag();
  ADD_CLASS(staticwrap, "page-login-static-wrap");

  const logowrap = newDivTag();
  ADD_CLASS(logowrap, "logo-img-container");
  const logo = newDivTag();
  ADD_CLASS(logo, "logo-img");
  logowrap.appendChild(logo);

  const loginForm = getLoginForm();
  const registrationForm = getRegistrationForm();
  loginForm.whenViewRegistrationRequest(() => {
    loginForm.detach();
    staticwrap.appendChild(registrationForm.frame);
  });
  registrationForm.whenViewLoginRequest(() => {
    registrationForm.detach();
    staticwrap.appendChild(loginForm.frame);
  });

  const desc = newDivTag();
  ADD_CLASS(desc, "form-customs-page-desc");

  let interv;

  const clearIntervAndResetDesc = () => {
    clearInterval(interv);
    desc.innerHTML = ``;
    desc.style.color = `#D82148`;
  };

  const flashingDesc = (why, count = 5, every = 600, color) => {
    desc.innerHTML = ``;

    let show = false;
    const toggle = () => {
      if (!show) {
        desc.innerHTML = `${why}`;
      } else {
        desc.innerHTML = ``;
      }
      show = !show;
    };
    clearIntervAndResetDesc();

    if (color) {
      desc.style.color = `${color}`;
    }
    toggle();
    interv = setInterval(() => {
      toggle();
      count -= 1;
      if (count < 0) {
        clearIntervAndResetDesc();
      }
    }, every);
  };
  const loginFailed = flashingDesc;
  const registrationResponse = ([createdUser, msg]) => {
    if (!createdUser) {
      registrationForm.notSucceed();
      flashingDesc(msg);
    } else {
      registrationForm.succeed();
      flashingDesc(msg, 1, 5000, "green");
    }
  };

  const init = () => {
    staticwrap.replaceChildren(logowrap, loginForm.frame);
    frame.replaceChildren(staticwrap, desc);
  };

  init();

  return {
    frame: frame,
    whenLoginRequest: (fn) => loginForm.whenLoginRequest(fn),
    whenRegisterRequest: (fn) => registrationForm.whenRegisterRequest(fn),
    loginFailed,
    registrationResponse,
  };
};

export default getLoginPage;
