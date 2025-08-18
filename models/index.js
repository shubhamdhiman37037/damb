const Sequelize = require("sequelize");
const sequelize = require("../config/DBconnect").sequelize;

module.exports = {
  userModel: require("../models/userModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  userInterestModel: require("../models/userInterestModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  subscriptionModel: require("../models/subscriptionModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  cmsModel: require("../models/cmsModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  interestModel: require("../models/interestModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  likeModel: require("../models/likeModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  friendsModel: require("../models/friendsModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  createdDateModel: require("../models/createdDateModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  imagesModel: require("../models/imagesModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
};
