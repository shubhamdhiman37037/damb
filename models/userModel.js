module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "users",
    {
      ...require("./core")(Sequelize, DataTypes),
      name: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },

      phoneNumber: {
        type: DataTypes.STRING(25),
        defaultValue: null,
      },
      countryCode: {
        type: DataTypes.INTEGER(5),
        defaultValue: null,
      },
      password: {
        type: DataTypes.STRING(150),
        defaultValue: null,
      },

      otp: {
        type: DataTypes.INTEGER(6),
        defaultValue: null,
      },
      identity: {
        type: DataTypes.STRING(55),
        defaultValue: null,
      },
      bio: {
        type: DataTypes.STRING(200),
        defaultValue: null,
      },
      upperRange: {
        type: DataTypes.INTEGER(100),
        defaultValue: null,
      },
      lowerRange: {
        type: DataTypes.INTEGER(100),
        defaultValue: null,
      },
      age: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      lookingFor: {
        type: DataTypes.STRING(100),
        defaultValue: null,
      },
      token: {
        type: DataTypes.STRING(200),
        defaultValue: null,
      },
      myBirthday: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
    },
    { tableName: "users" }
  );
};
