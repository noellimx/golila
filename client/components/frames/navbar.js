import { newButton, newDivTag } from "../elements/index.js";

const getNavBar = (clientAuth) => {
  const frame = newDivTag("frame");
  const logoutButton = newButton({ desc: "logout" });

  logoutButton.addEventListener("click", () => {
    clientAuth.iWantToLogOut();
  });
  frame.replaceChildren(logoutButton);
  return {
    frame,
  };
};

export default getNavBar;
