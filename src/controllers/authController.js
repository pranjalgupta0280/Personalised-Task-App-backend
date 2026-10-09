// Blueprint: Authentication Controllers
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');


const registerUser = async (req, res) => {
  // your code here
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const user = await User.create({ name, email, password });
  res.status(201).json({ message: "User created successfully", user });
};

const loginUser = async (req, res) => {
  // your code here
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const token = generateToken(user._id);
  res.status(200).json({ message: "User logged in successfully", user, token });
};

const getUserProfile = async (req, res) => {
  // your code here
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ user });
};

const generateToken = (userId) => {
  // your code here
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  generateToken,
};
