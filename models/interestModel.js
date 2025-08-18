module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "interests",
    {
      ...require("./core")(Sequelize, DataTypes),
      title: {
        type: DataTypes.STRING(250),
        defaultValue: null,
      },
    },
    { tableName: "interests" }
  );
};
