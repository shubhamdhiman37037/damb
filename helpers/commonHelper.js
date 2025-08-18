const Joi = require("joi");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const path = require("path");

require("dotenv").config();
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new twilio(accountSid, authToken);
module.exports = {
  validateJoi: async (schema, data) => {
    try {
      const validSchema = await schema.validateAsync(data);
      return validSchema;
    } catch (error) {
      throw new Error(error.details[0].message);
    }
  },

  bcryptpass: async (password) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 5);
      return hashedPassword;
    } catch (error) {
      console.log("error while encrypting", error);
      return res.status(500).json({ message: "error while encrypting", error });
    }
  },

  comparePassword: async (password, hashedPassword) => {
    const bcrypt = require("bcrypt");
    return await bcrypt.compare(password, hashedPassword);
  },
  success: (res, message = "", body = {}) => {
    return res.status(200).json({
      success: true,
      message: message,
      body: body,
    });
  },

  failure: (res, message = "", body = {}) => {
    return res.status(400).json({
      success: false,
      message: message,
      body: body,
    });
  },

  serverError: (res, message = "", body = {}) => {
    return res.status(500).json({
      success: false,
      message: message,
      body: body,
    });
  },

  sendSms: async (otp) => {
    try {
      const message = await client.messages.create({
        body: `Your OTP code is: ${otp}`,
        from: twilioPhoneNumber,
        to: "+917056737037",
      });
      console.log(`Message SID: ${message.sid}`);
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  },
  fileUpload: async (file, folder = "uploads") => {
    try {
      if (!file || file.name === "") return null;

      // Get file extension
      let fileExtension = file.name.split(".").pop();

      // Generate unique file name using uuid
      const name = uuid() + "." + fileExtension;

      // Create the correct path by referencing 'public/images' folder
      const filePath = path.join(__dirname, "..", "public", folder, name);

      // Move the file to the desired folder
      file.mv(filePath, (err) => {
        if (err) throw err;
      });

      // Return the file path relative to the public folder (this will be accessible via URL)
      return `/uploads/${name}`;
    } catch (error) {
      console.error("Error during file upload:", error);
      return null;
    }
  },
};
