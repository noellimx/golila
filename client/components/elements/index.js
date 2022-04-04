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
const newTextInput = () => {
  const ele = newTag("input");
  ele.setAttribute("type", "text");
  return ele;
};
const newButton = (opts = {}) => {
  const { desc = "" } = opts;
  const ele = document.createElement("button");
  ele.innerHTML = `${desc}`;
  return ele;
};
export { newTextInput, newButton, newDivTag };
