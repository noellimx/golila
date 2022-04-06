const ARROW_LEFT = "38";
const ARROW_RIGHT = "37";
const ARROW_DOWN = "40";
const ARROW_UP = "39";

const ARROWS = [ARROW_DOWN, ARROW_LEFT, ARROW_UP];

const MODE_EASY = 1;
const MODE_TEST = 1;

const LENGTHS = {
  [MODE_EASY]: 10,
  [MODE_TEST]: 2,
};

const COLOR_GREEN = ARROW_DOWN;
const COLOR_BLUE = ARROW_LEFT;
const COLOR_RED = ARROW_RIGHT;
const COLOR_BLACK = ARROW_UP;
const COLORS = {
  [ARROW_DOWN]: COLOR_GREEN,
  [ARROW_LEFT]: COLOR_BLUE,
  [ARROW_RIGHT]: COLOR_RED,
  [ARROW_UP]: COLOR_BLACK,
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const shuffleChain = (_chain) => {
  const chain = [..._chain];
  const le = chain.length;
  for (let i = 0; i < le; i += 1) {
    const j = Math.floor(Math.random() * (le - i)) + i;
    [chain[j], chain[i]] = [chain[i], chain[j]];
  }

  return chain;
};

const getRandomChain = (difficulty = MODE_TEST) => {
  console.log(`[getRandomChain]`);
  const length = LENGTHS[difficulty];

  const cutoffs = [getRandomInt(length), getRandomInt(length)];
  cutoffs.sort();
  console.log(`[getRandomChain] cut ${cutoffs}`);

  const lengthDown = cutoffs[0] - 0;
  const lengthLeft = cutoffs[1] - cutoffs[0];
  const lengthUp = length - cutoffs[1];

  const neatchain = [lengthDown, lengthLeft, lengthUp].reduce(
    (acc, length, index) => {
      const list = [];
      while (length > 0) {
        list.push(ARROWS[index]);
        length -= 1;
      }
      return [...acc, ...list];
    },
    []
  );

  const randomchain = shuffleChain(neatchain);

  return randomchain;
};

const CHAIN_DELIMITER = ",";
const chainToString = (chain) => {
  return chain.join(CHAIN_DELIMITER);
};

const stringToChain = (stringChain) => {
  return stringChain.split(CHAIN_DELIMITER);
};

const valueOfChainString = (chainString) => {
  return stringToChain(chainString).length;
};
export { getRandomChain, chainToString, stringToChain, valueOfChainString };
