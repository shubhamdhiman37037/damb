module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "cms",
    {
      ...require("./core")(Sequelize, DataTypes),
      type: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      title: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      description: {
        type: DataTypes.STRING(500),
        defaultValue: null,
      },
    },
    { tableName: "cms" }
  );
};
