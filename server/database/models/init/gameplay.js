import { Sequelize } from "sequelize";

/**
 * @param {Sequelize} sequelize
 */
export default (sequelize) => {
  const { DataTypes } = sequelize.Sequelize;

  const { room: Room } = sequelize.models;
  if (!Room) {
    throw new Error(
      `[model] [${MODEL_NAME}] Are you sure there's valid model references? ${Room}`
    );
  }

  const model = sequelize.define(
    "gameplay",
    {
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updated_at",
      },

      // ADD ATTRIBUTES HERE
      roomId: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
          model: Room,
          key: "id",
        },
        allowNull: false,
        field: "room_id",
      },
      chain: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "chain",
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "end_date",
      },
      lastKnownRound: {
        type: DataTypes.STRING,
        field: "last_known_round"
      }
    },
    {
      underscored: true,
    }
  );
  if (model !== sequelize.models.gameplay) {
    throw new Error("model reference mismatch");
  }

  return model;
};
