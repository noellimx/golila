const NO_OP = () => {};

const ADD_CLASS = (element, className) => {
  element.classList.add(className);
};

const UPDATE_TEXT = (element, text) => {
  element.innerText = `${text}`;
};
const DETACH = (element) => {
  element.parentElement?.removeChild(element);
};
export { NO_OP, ADD_CLASS, UPDATE_TEXT, DETACH };
