import sequelize from "../index.js";

const { lastKnownSessionUser: LastKnownSessionUser } = sequelize.models;

const updateSession = (socketId, userId) => {
  console.log(`updateSession io ${socketId} u ${userId}`);
  return LastKnownSessionUser.findOne({ where: { id: socketId } }).then(
    (obj) => {
      // update
      if (obj) return obj.update({ userId });
      // insert
      return LastKnownSessionUser.create({ id: socketId, userId });
    }
  );
};
const removeSession = (socketId) =>
  LastKnownSessionUser.destroy({ where: { id: socketId } });

const getSocketsOfUsers = async (userIds) => {
  return await LastKnownSessionUser.findAll({
    where: {
      userId: userIds,
    },
  }).then(async (sockets) => {
    const result = Promise.all(
      sockets.map(async ({ dataValues }) => {
        const { id, userId } = dataValues;
        return { id, userId };
      })
    );

    return result;
  });
};
const getSocketsOfUser = async (userId) => {
  return await LastKnownSessionUser.findAll({ where: { userId } }).then(
    async (sockets) => {
      const result = Promise.all(
        sockets.map(async ({ dataValues }) => {
          const { id, userId } = dataValues;
          return { id, userId };
        })
      );

      return result;
    }
  );
};
export { updateSession, getSocketsOfUser, getSocketsOfUsers, removeSession };
