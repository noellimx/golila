import { newButton, newDivTag } from "../elements/index.js";
import { ADD_CLASS, UPDATE_TEXT } from "../helpers.js";

const newBananaFlash = (count) => {
  return newDivTag(`${count}` ?? "?");
};
const getBanana = (clientUser) => {
  const frame = newDivTag();

  ADD_CLASS(frame, "bananas");

  const flashBanana = (banana) => {
    console.log(`[flashBanana] ${banana}`);

    const div = newBananaFlash(banana);
    frame.replaceChildren(div);
  };

  const init = () => {
    clientUser.howYellowAmI().then(flashBanana);
    clientUser.onMoreBanana(() => clientUser.howYellowAmI().then(flashBanana));
  };

  init();

  return {
    frame,
  };
}; // End of Banana
const getNavBar = (clientAuth, clientUser) => {
  const frame = newDivTag("frame");

  const mynameDiv = newDivTag();

  const bananas = getBanana(clientUser);
  const logoutButton = newButton({ desc: "logout" });

  logoutButton.addEventListener("click", () => {
    clientAuth.iWantToLogOut();
  });

  const init = () => {
    console.log(`[Nav Bar] init`);
    clientUser.whatIsMyName().then((name) => {
      UPDATE_TEXT(mynameDiv, name);
    });

    frame.replaceChildren(mynameDiv, bananas.frame, logoutButton);
  };

  init();
  return {
    frame,
  };
};

export default getNavBar;
