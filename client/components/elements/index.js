import { ADD_CLASS } from "../helpers.js";

const newTag = (tag) => {
  const ele = document.createElement(tag);
  ele.style.display = "flex";
  return ele;
};
const newDivTag = (desc) => {
  const ele = newTag("div");
  if (desc) {
    ele.innerHTML = `${desc}`;
  }

  return ele;
};

const newPasswordInput = () => {
  const ele = newTag("input");
  ele.setAttribute("type", "password");
  return ele;
};
const newTextInput = () => {
  const ele = newTag("input");
  ele.setAttribute("type", "text");
  return ele;
};
const newButton = (opts = {}) => {
  const { desc = "" } = opts;
  const ele = document.createElement("button");
  ADD_CLASS(ele, "btn");
  ele.style.display = "flex";
  ele.innerHTML = `${desc}`;
  return ele;
};
export { newTextInput, newButton, newDivTag, newPasswordInput };
