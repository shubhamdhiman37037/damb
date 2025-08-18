module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "friends",
    {
      ...require("./core")(Sequelize, DataTypes),
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      receiverId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("pending", "accepted", "declined"),
        defaultValue: "accepted",
      },
    },
    { tableName: "friends" }
  );
};
