import { Sequelize } from "sequelize";

/**
 * @param {Sequelize} sequelize
 */
export default (sequelize) => {
  const { DataTypes } = sequelize.Sequelize;
  const model = sequelize.define(
    "room",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      creatorId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: sequelize.models.user,
          key: 'id'
        },
      },
    },
    {
      underscored: true,
    }
  );
  if (model !== sequelize.models.room) {
    throw new Error("model reference mismatch");
  }
};
