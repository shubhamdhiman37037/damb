module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "images",
    {
      ...require("./core")(Sequelize, DataTypes),
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: "images" }
  );
};
