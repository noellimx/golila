

import db from "../index.js";

const { sequel, Sequelize } = db;
const { models } = sequel;

/**
 * Processed result of db query.
 * @typedef {Object} DBResult
 * @property {Object[]} rows
 * @property {Object[]} attributes
 */

/**
 * @returns {DBResult}
 */
const _newData = () => ({ attributes: [], rows: [] });

/**
 * @returns {DBResult}
 */
const _fromRawArray = (raw) => {
  if (!Array.isArray(raw)) {
    return _newData();
  }
  return raw.reduce((data, element) => {
    if (!element) {
      return data;
    }
    const {
      dataValues: row,
      _options: { attributes = [] },
    } = element;
    return {
      rows: [...data.rows, row],
      attributes: [...new Set([...data.attributes, ...attributes])],
    };
  }, _newData());
};
/**
 * @returns {DBResult}
 */
const _fromRawSingularElement = (raw) => _fromRawArray([raw]);
/**
 * @returns {DBResult}
 */
const selectItemAll = async () => {
  const result = await models.item.findAll();
  return _fromRawArray(result);
};
/**
 * @returns {DBResult}
 */
const selectCategoryOneByName = async (name) => {
  if (!name) {
    return _newData();
  }
  const result = await models.category.findOne({
    where: {
      name,
    },
  });
  return _fromRawSingularElement(result);
};

const insertItem = async (fields) => {
  try {
    const result = await models.item.create({
      ...fields,
    });
    return _fromRawSingularElement(result);
  } catch (err) {
    console.log("[insertItem] !!" + err);
  }
  return _newData();
};
export { selectItemAll, selectCategoryOneByName, insertItem };
