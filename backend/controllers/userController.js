const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @route GET /api/user/profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, data: user });
});

// @route PUT /api/user/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;
  const user = await User.findById(req.user._id);
  if (name)    user.name    = name;
  if (phone)   user.phone   = phone;
  if (address) user.address = { ...user.address, ...address };
  const updated = await user.save();
  res.json({ success: true, data: updated });
});

// @route PUT /api/user/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.matchPassword(currentPassword))) {
    res.status(400); throw new Error("Current password is incorrect");
  }
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: "Password updated successfully" });
});

// @route GET /api/user  (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort("-createdAt");
  res.json({ success: true, data: users });
});

module.exports = { getProfile, updateProfile, changePassword, getAllUsers };
