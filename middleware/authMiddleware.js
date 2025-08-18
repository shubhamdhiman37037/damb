const jwt = require("jsonwebtoken");
const Model = require("../models/index");

module.exports = {
  authentication: async (req, res, next) => {
    try {
      const token = req.headers && req.headers.authorization;

      if (!token) {
        res.send("Token required");
      } else {
        let newToken =
          token && token.startsWith("Bearer") ? token.split(" ")[1] : token;

        const verified = jwt.verify(newToken, process.env.SECRET);

        if (verified) {
          let response = await Model.userModel.findOne({
            where: {
              id: verified.id,
            },
            raw: true,
          });

          req.user = response;

          next();
        } else {
          // Access Denied
          // return failure(res, "error token not verified", error);
          console.log(error);
          res.status(401).json({ message: "Unauthorized access" });
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ message: "Unauthorized access" });
    }
  },
};
