const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs-extra");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const USERS_FILE = process.env.USERS_FILE;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// app.options("*", cors());

app.use(express.json());

// Helper function to load users from the file
const loadUsers = async () => {
  try {
    const data = await fs.readJson(USERS_FILE);
    return data;
  } catch (err) {
    return [];
  }
};

// Helper function to save users to the file
const saveUsers = async (users) => {
  await fs.writeJson(USERS_FILE, users);
};

// Function to generate access and refresh tokens
const generateTokens = (email) => {
  // Access Token (JWT)
  const accessToken = jwt.sign({ userId: email }, process.env.JWT_SECRET, {
    expiresIn: "15m", // short expiration for access token
  });

  // Refresh Token (JWT)
  const refreshToken = jwt.sign({ userId: email }, process.env.JWT_SECRET, {
    expiresIn: "7d", // longer expiration for refresh token
  });

  return { accessToken, refreshToken };
};

// Signup Route
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Load existing users
  const users = await loadUsers();

  // Check if the user already exists
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ msg: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  // Create new user
  const newUser = { username, email, password: hashedPassword };
  users.push(newUser);

  // Save new user list
  await saveUsers(users);

  // Generate JWT tokens (access and refresh)
  const { accessToken, refreshToken } = generateTokens(newUser.email);

  // Save refresh token in memory or some secure place
  // In real-world apps, you'd store this securely, e.g., in an HttpOnly cookie or a database
  newUser.accessToken = accessToken;
  newUser.refreshToken = refreshToken;

  // Save updated user data with refresh token (this is just for demo purposes)
  await saveUsers(users);

  res.status(201).json({ accessToken, refreshToken });
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Load users
  const users = await loadUsers();

  // Check if user exists
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ msg: "User does not exist" });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  // Generate JWT tokens (access and refresh)
  const { accessToken, refreshToken } = generateTokens(user.email);

  // Save refresh token in user data (in a real app, you'd store it securely)
  user.refreshToken = refreshToken;

  // Save updated user data
  await saveUsers(users);

  res.json({ accessToken, refreshToken });
});

// Refresh Token Route
app.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ msg: "Refresh token required" });
  }

  // Load users
  const users = await loadUsers();

  // Check if the refresh token matches any user
  const user = users.find((user) => user.refreshToken === refreshToken);
  if (!user) {
    return res.status(403).json({ msg: "Invalid refresh token" });
  }

  try {
    // Verify the refresh token
    jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Generate new access and refresh tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user.email
    );

    // Update the user's refresh token
    user.refreshToken = newRefreshToken;

    // Save updated user data
    await saveUsers(users);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(403).json({ msg: "Invalid or expired refresh token" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
