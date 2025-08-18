const Model = require("../models/index.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const {
  validateJoi,
  bcryptpass,
  success,
  failure,
  serverError,
  comparePassword,
  sendSms,
  fileUpload,
} = require("../helpers/commonHelper.js");
const { failures, successe, err } = require("../helpers/response.js");
const Joi = require("joi");
module.exports = {
  createUser: async (req, res) => {
    try {
      const schema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        phoneNumber: Joi.string().min(10).max(15).required(),
        countryCode: Joi.number().min(1).optional(),
        password: Joi.string().min(6).required(),
      });
      const payload = await validateJoi(schema, req.body);
      const existingUser = await Model.userModel.findOne({
        where: { phoneNumber: payload.phoneNumber },
      });

      if (existingUser) {
        return failure(res, failures.user);
      }
      const hashedPassword = await bcryptpass(payload.password);

      const newUser = await Model.userModel.create({
        name: payload.name,
        phoneNumber: payload.phoneNumber,
        countryCode: payload.countryCode,
        password: hashedPassword,
      });

      const token = jwt.sign({ id: newUser.id }, process.env.SECRET);
      newUser.token = token;
      await newUser.save();

      const otp = Math.floor(100000 + Math.random() * 900000);
      await sendSms(otp);
      newUser.otp = otp;
      await newUser.save();

      success(res, successe.signUp, newUser, token);
    } catch (error) {
      console.error("Error creating user:", error);
      serverError(res, err.server);
    }
  },
  verifyOtp: async (req, res) => {
    try {
      const schema = Joi.object({
        otp: Joi.number().integer().min(100000).max(999999).required(),
      });
      const payload = await validateJoi(schema, req.body);
      const userId = req.user.id;

      const user = await Model.userModel.findByPk(userId);

      if (!user) {
        return failure(res, failures.user);
      }

      if (user.otp !== payload.otp) {
        return failure(res, failures.invalidOtp);
      }

      user.otp = null;
      await user.save();

      success(res, successe.otpVerified, user);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      serverError(res, err.server);
    }
  },

  userInfo: async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await Model.userModel.findByPk(userId);

      if (!user) {
        return failure(res, failures.user);
      }
      const schema = Joi.object({
        identity: Joi.string().valid("user", "admin").required(),
        bio: Joi.string().max(500).optional(),
        myBirthday: Joi.date().iso().optional(),
      });
      const payload = await validateJoi(schema, req.body);
      let file = req.files.file;
      if (!file) {
        console.log("No file uploaded");
        return failure(res, failures.fileNotFound);
      }
      if (!Array.isArray(file)) {
        file = [file];
      }
      file.forEach(async (element) => {
        const path = await fileUpload(element);
        await Model.imagesModel.create({ userId: user.id, image: path });
      });

      user.identity = payload.identity;
      user.bio = payload.bio;
      user.myBirthday = payload.myBirthday;

      await user.save();
      success(res, successe.update, user);
    } catch (error) {
      console.error("Error fetching user info:", error);
      serverError(res, err.server);
    }
  },
  userPref: async (req, res) => {
    try {
      const userId = req.user.id;
      const schema = Joi.object({
        upperRange: Joi.number().min(0).optional(),
        lowerRange: Joi.number().min(0).optional(),
        age: Joi.number().min(0).optional(),
        lookingFor: Joi.string().max(100).optional(),
        interestId: Joi.string().required(),
      });
      const payload = await validateJoi(schema, req.body);

      const user = await Model.userModel.findByPk(userId);
      if (!user) {
        return failure(res, failures.user);
      }

      user.upperRange = payload.upperRange;
      user.lowerRange = payload.lowerRange;
      user.age = payload.age;
      user.lookingFor = payload.lookingFor;

      await user.save();

      await Model.userInterestModel.create({
        userId: user.id,
        interestId: payload.interestId,
      });

      success(res, successe.update, user);
    } catch (error) {
      console.error("Error updating user preferences:", error);
      serverError(res, err.server);
    }
  },
  loginUser: async (req, res) => {
    try {
      const schema = Joi.object({
        phoneNumber: Joi.string().min(10).max(15).required(),
        password: Joi.string().min(6).required(),
      });
      const payload = await validateJoi(schema, req.body);
      const user = await Model.userModel.findOne({
        where: { phoneNumber: payload.phoneNumber },
      });

      if (!user) {
        return failure(res, failures.user);
      }

      const isPasswordValid = await comparePassword(
        payload.password,
        user.password
      );

      if (!isPasswordValid) {
        return failure(res, failures.invalidPassword);
      }

      const token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: "1h",
      });
      user.token = token;
      await user.save();
      success(res, successe.login, { user, token });
    } catch (error) {
      console.error("Error logging in user:", error);
      serverError(res, err.server);
    }
  },
  interest: async (req, res) => {
    try {
      const schema = Joi.object({
        interests: Joi.string().max(100).required(),
      });
      const payload = await validateJoi(schema, req.body);

      const intrest = await Model.interestModel.create({
        title: payload.interests,
      });
      success(res, successe.update, intrest);
    } catch (error) {
      console.error("Error updating user interests:", error);
      serverError(res, err.server);
    }
  },
  // userInterest: async (req, res) => {
  //   try {
  //     const userId = req.user.id;
  //     console.log("User ID:", userId);
  //     return;

  //     if (!user) {
  //       return failure(res, failures.user);
  //     }

  //     const interests = await Model.interestModel.findAll({
  //       where: { userId: user.id },
  //     });

  //     success(res, successe.fetch, interests);
  //   } catch (error) {
  //     console.error("Error fetching user interests:", error);
  //     serverError(res, err.server);
  //   }
  // },
  findFriends: async (req, res) => {
    try {
      const receiverId = req.user.id;
      const senderId = req.body.senderId;
      // console.log("Receiver ID:", receiverId);
      // console.log("Sender ID:", senderId);
      // return;

      const friends = await Model.friendsModel.create({
        senderId: senderId,
        receiverId: receiverId,
      });

      success(res, successe.friend, friends);
    } catch (error) {
      console.error("Error finding friends:", error);
      serverError(res, err.server);
    }
  },
  createDate: async (req, res) => {
    try {
      const schema = Joi.object({
        dateTitle: Joi.string().max(255).required(),
        dateDescription: Joi.string().max(1000).required(),
      });
      const payload = await validateJoi(schema, req.body);
      let file = req.files.file;
      if (!file) {
        console.log("No file uploaded");
        return failure(res, failures.fileNotFound);
      }
      if (!Array.isArray(file)) {
        file = [file];
      }
      file.forEach(async (element) => {
        const path = await fileUpload(element);
        await Model.imagesModel.create({ userId: req.user.id, image: path });
      });

      const newDate = await Model.createdDateModel.create({
        dateTitle: payload.dateTitle,
        dateDescription: payload.dateDescription,
        userId: req.user.id,
      });
      success(res, successe.create, newDate);
    } catch (error) {
      console.error("Error creating date:", error);
      serverError(res, err.server);
    }
  },
  findDate: async (req, res) => {
    try {
      const userId = req.user.id;

      const dates = await Model.createdDateModel.findAll({
        where: { userId: userId },
      });

      if (!dates || dates.length === 0) {
        return failure(res, failures.dateNotFound);
      }

      success(res, successe.dateFound, dates);
    } catch (error) {
      console.error("Error finding dates:", error);
      serverError(res, err.server);
    }
  },
  updateUserDetail: async (req, res) => {
    try {
      const userId = req.user.id;
      const schema = Joi.object({
        name: Joi.string().min(2).max(100).optional(),
        phoneNumber: Joi.string().min(10).max(15).optional(),
        bio: Joi.string().max(500).optional(),
        upperRange: Joi.number().min(0).optional(),
        lowerRange: Joi.number().min(0).optional(),
        age: Joi.number().min(0).optional(),
        lookingFor: Joi.string().max(100).optional(),
        myBirthday: Joi.date().iso().optional(),
        countryCode: Joi.number().min(1).optional(),
      });
      const payload = await validateJoi(schema, req.body);

      const user = await Model.userModel.findByPk(userId);
      if (!user) {
        return failure(res, failures.user);
      }

      await user.update(payload);
      success(res, successe.updateProfile, user);
    } catch (error) {
      console.error("Error updating user details:", error);
      serverError(res, err.server);
    }
  },
  deleteDate: async (req, res) => {
    try {
      const dateId = req.params.id;
      const userId = req.user.id;

      const date = await Model.createdDateModel.findOne({
        where: { id: dateId, userId: userId },
      });

      if (!date) {
        return failure(res, failures.dateNotFound);
      }

      await date.destroy();
      success(res, successe.dateDeleted, date);
    } catch (error) {
      console.error("Error deleting date:", error);
      serverError(res, err.server);
    }
  },
  changePassword: async (req, res) => {
    try {
      const schema = Joi.object({
        oldPassword: Joi.string().min(6).required(),
        newPassword: Joi.string().min(6).required(),
      });
      const payload = await validateJoi(schema, req.body);

      const user = await Model.userModel.findByPk(req.user.id);
      if (!user) {
        return failure(res, failures.user);
      }

      const isOldPasswordValid = await comparePassword(
        payload.oldPassword,
        user.password
      );
      if (!isOldPasswordValid) {
        return failure(res, failures.invalidPassword);
      }

      const hashedNewPassword = await bcryptpass(payload.newPassword);
      user.password = hashedNewPassword;
      await user.save();

      success(res, successe.passwordChange, user);
    } catch (error) {
      console.error("Error changing password:", error);
      serverError(res, err.server);
    }
  },
  addSubscription: async (req, res) => {
    try {
      const schema = Joi.object({
        title: Joi.string().max(255).required(),
        description: Joi.string().max(1000).required(),
        duration: Joi.string().max(255).required(),
      });
      const payload = await validateJoi(schema, req.body);

      const newSubscription = await Model.subscriptionModel.create({
        title: payload.title,
        description: payload.description,
        duration: payload.duration,
        userId: req.user.id,
      });
      success(res, successe.subscriptionAdd, newSubscription);
    } catch (error) {
      console.error("Error adding subscription:", error);
      serverError(res, err.server);
    }
  },
  cms: async (req, res) => {
    try {
      const schema = Joi.object({
        type: Joi.string().required(),
        title: Joi.string().max(255).required(),
        description: Joi.string().max(1000).required(),
      });
      const payload = await validateJoi(schema, req.body);

      const newCms = await Model.cmsModel.create({
        type: payload.type,
        title: payload.title,
        description: payload.description,
      });
      success(res, successe.cmsAdd, newCms);
    } catch (error) {
      console.error("Error adding CMS:", error);
      serverError(res, err.server);
    }
  },
  likePost: async (req, res) => {
    try {
      const userId = req.user.id;
      const postUserId = req.params.id;

      const like = await Model.likeModel.create({
        userId: userId,
        postUserId: postUserId,
      });
      success(res, successe.postLiked, like);
    } catch (error) {
      console.error("Error liking post:", error);
      serverError(res, err.server);
    }
  },
};
