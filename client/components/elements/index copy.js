import { ADD_CLASS } from "../helpers.js";

import ImgCoin40 from "../../static/40.png";
import ImgCoin38 from "../../static/38.png";
import ImgCoin39 from "../../static/39.png";

const ImgCoins = {
  40: ImgCoin40,
  38: ImgCoin38,
  39: ImgCoin39,
};

import "./index.css";

const newTag = (tag) => {
  const ele = document.createElement(tag);
  ADD_CLASS(ele, "default-new-tag");
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

const newImg = (cURL, alt) => {
  const img = newTag("img");
  img.src = cURL;
  img.setAttribute("alt", `${alt}`);

  return img;
};

const newTokenImg = (token) => {
  const img = newImg(ImgCoins[token], "a token");
  ADD_CLASS(img, "token---");

  return img;
};

const revv = () => {
  // cache first

  Object.values(ImgCoins).forEach((t) => {
    newTokenImg(t);
  });
};

export {
  newTextInput,
  newButton,
  newDivTag,
  newPasswordInput,
  newImg,
  newTokenImg,
  revv,
};
