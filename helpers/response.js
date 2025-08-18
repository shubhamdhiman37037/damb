const { post } = require("../routes/userRoutes");

const successe = {
  signUp: "User signUp successfully",
  logged: "User loggedIn successfully",
  deleted: "User Deleted",
  update: "User detailed Update",
  email: "email send succesfully",
  contactUs: "Contact message received successfully",
  subscriptionAdd: "Subscription added successfully",
  subscriptionList: "Subscription list fetched successfully",
  subscriptionBuy: "Subscription purchased successfully",
  subscriptionDetail: "Subscription details fetched successfully",
  TodaysubscriptionList: "Today's expired subscriptions fetched successfully",
  subscriptionExpireAfter15Days:
    "Subscriptions expiring in the next 15 days fetched successfully",
  dashboardApi: "Dashboard data fetched successfully",
  tourCreate: "Tour created successfully",
  tourList: "Tour list fetched successfully",
  tourDetail: "Tour details fetched successfully",
  tourUpdate: "Tour updated successfully",
  tourDelete: "Tour deleted successfully",
  tourBook: "Tour booked successfully",
  otp: "OTP sent successfully",
  passwordReset: "Password reset email sent successfully",
  passwordChange: "Password changed successfully",
  loggedOut: "User logged out successfully",
  updateProfile: "Profile updated successfully",
  interest: "Interest added successfully",
  friend: "Friend request sent successfully",
  dateCreated: "Date created successfully",
  dateFound: "Date found successfully",
  dateDeleted: "Date deleted successfully",
  cmsAdded: "CMS content added successfully",
  cmsUpdated: "CMS content updated successfully",
  cmsDeleted: "CMS content deleted successfully",
  cmsList: "CMS content list fetched successfully",
  postCreated: "Post created successfully",
  postUpdated: "Post updated successfully",
  postDeleted: "Post deleted successfully",
  postList: "Post list fetched successfully",
};

const failures = {
  signUp: "User not signUp Error",
  logged: "User not loggedIn Error",
  notFound: "Subscription not found",
  password: "Invalid Password",
  email: "Email already exists",
  otp: "Invalid OTP",
  token: "Invalid Token",
  user: "User  found",
  subscription: "Subscription not found",
  tour: "Tour not found",
  file: "File not found",
  loggedIn: "User already logged in",
  invalidPassword: "Invalid password",
  dateNotFound: "Date not found",
  friendNotFound: "Friend not found",
};

const err = {
  server: "Server Error",
};

module.exports = {
  successe: successe,
  failures: failures,
  err: err,
};
