import { newButton, newDivTag } from "../elements/index.js";
import { ADD_CLASS, UPDATE_TEXT } from "../helpers.js";

import "./navbar.css";

const newBananaFlash = (count) => {
  return newDivTag();
};
const getBanana = (clientUser) => {
  const frame = newDivTag();

  ADD_CLASS(frame, "nav-bananas-frame");

  const div = newBananaFlash();
  ADD_CLASS(div, "div-text-center");

  let interv;

  const flashBanana = (banana, flashcount = 10, every = 150) => {
    const desc = `🍌${banana}` ?? "💸";

    console.log(`[flashBanana]  ${desc}`);

    const clearIntervalAndReset = () => {
      clearInterval(interv);
    };
    let show = true;
    const toggle = () => {
      if (show) {
        UPDATE_TEXT(div, "");
      } else {
        UPDATE_TEXT(div, desc);
      }
      show = !show;
    };
    clearIntervalAndReset();
    interv = setInterval(() => {
      toggle();
      flashcount -= 1;
      if (flashcount < 0) {
        clearIntervalAndReset();

        UPDATE_TEXT(div, desc);
      }
    }, every);
  };

  const init = () => {
    clientUser.howYellowAmI().then(flashBanana);
    clientUser.onMoreBanana(() => clientUser.howYellowAmI().then(flashBanana));

    frame.replaceChildren(div);
  };

  init();

  return {
    frame,
  };
}; // End of Banana
const getNavBar = (clientAuth, clientUser) => {
  const frame = newDivTag("frame");
  ADD_CLASS(frame, "nav-bar-frame");

  const logoDiv = newDivTag("🦍");
  ADD_CLASS(logoDiv, "logo-div");
  const mynameDiv = newDivTag();
  ADD_CLASS(mynameDiv, "nav-name-div");
  ADD_CLASS(mynameDiv, "div-text-center");

  const bananas = getBanana(clientUser);

  const logoutButton = newButton({ desc: "logout" });
  ADD_CLASS(logoutButton, "nav-logout-button");

  logoutButton.addEventListener("click", () => {
    clientAuth.iWantToLogOut();
  });

  const init = () => {
    console.log(`[Nav Bar] init`);
    clientUser.whatIsMyName().then((name) => {
      UPDATE_TEXT(mynameDiv, name);
    });

    frame.replaceChildren(logoDiv, mynameDiv, bananas.frame, logoutButton);
  };

  init();
  return {
    frame,
  };
};

export default getNavBar;
