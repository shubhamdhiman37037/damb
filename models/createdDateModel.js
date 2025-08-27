module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "createdDates",
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
      dateTitle: {
        type: DataTypes.STRING(155),
        defaultValue: null,
      },
      dateDescription: {
        type: DataTypes.STRING(200),
        defaultValue: null,
      },
    },
    { tableName: "createdDates" }
  );
};
