module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "subscriptions",
    {
      ...require("./core")(Sequelize, DataTypes),
      title: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      description: {
        type: DataTypes.STRING(500),
        defaultValue: null,
      },
      duration: {
        type: DataTypes.STRING(150),
        defaultValue: null,
      },
    },
    { tableName: "subscriptions" }
  );
};
