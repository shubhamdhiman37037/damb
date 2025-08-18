const express = require("express");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const { connectDB } = require("./config/DBconnect");
const userRouter = require("./routes/userRoutes.js");
const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use("/api", userRouter);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
