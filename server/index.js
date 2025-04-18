const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs-extra");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const USERS_FILE = process.env.USERS_FILE;
const NOTES_FILE = process.env.NOTES_FILE;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Load users from file
const loadUsers = async () => {
  try {
    const data = await fs.readJson(USERS_FILE);
    return data;
  } catch (err) {
    return [];
  }
};

// Save users to file
const saveUsers = async (users) => {
  await fs.writeJson(USERS_FILE, users);
};

const loadNotes = async () => {
  try {
    const data = await fs.readJson(NOTES_FILE);
    return data;
  } catch (err) {
    return [];
  }
};

const saveNotes = async (notes) => {
  await fs.writeJson(NOTES_FILE, notes);
};

// Generate JWT access and refresh tokens
const generateTokens = (email, role) => {
  const payload = {
    userId: email,
    role: role,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    // expiresIn: "15m",
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    // expiresIn: "7d",
    expiresIn: "7d",
  });

  // console.log("From generate token:", accessToken);
  return { accessToken, refreshToken };
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
};

// Middleware to check admin role
const requireAdmin = async (req, res, next) => {
  const users = await loadUsers();
  const currentUser = users.find((u) => u.email === req.user.userId);

  if (!currentUser || !currentUser.isAdmin) {
    return res.status(403).json({ msg: "Access denied. Admins only." });
  }

  next();
};

// Signup
app.post("/signup", async (req, res) => {
  const { username, email, password, role = "user" } = req.body; // Default role as 'user'

  // Load existing users
  const users = await loadUsers();

  // Check if the user already exists
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ msg: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user with role
  const newUser = {
    username,
    email,
    password: hashedPassword,
    role, // Add the role here
  };

  // Generate JWT tokens (access and refresh)
  const { accessToken, refreshToken } = generateTokens(
    newUser.email,
    newUser.role
  );

  // Add tokens to the new user object
  newUser.accessToken = accessToken;
  newUser.refreshToken = refreshToken;

  // Push the new user to the array
  users.push(newUser);

  // Save users to the file
  await saveUsers(users);

  // Respond with tokens
  // res.status(201).json({ accessToken, refreshToken });
  res.status(201).json({
    accessToken,
    refreshToken,
    role: newUser.role,
    username: newUser.username,
  });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const users = await loadUsers();
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ msg: "User does not exist" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  console.log(user.email, user.role);

  const { accessToken, refreshToken } = generateTokens(user.email, user.role);
  user.refreshToken = refreshToken;

  await saveUsers(users);

  // res.json({ accessToken, refreshToken });
  res.status(201).json({
    accessToken,
    refreshToken,
    role: user.role,
    username: user.username,
  });
});

// Refresh Token
app.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ msg: "Refresh token required" });
  }

  const users = await loadUsers();
  const user = users.find((user) => user.refreshToken === refreshToken);
  if (!user) {
    return res.status(401).json({ msg: "Invalid refresh token" });
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET);

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user.email,
      user.role
    );

    user.refreshToken = newRefreshToken;

    await saveUsers(users);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(403).json({ msg: "Invalid or expired refresh token" });
  }
});

// ✅ Admin-only endpoint
app.get("/admin/data", authenticateToken, requireAdmin, async (req, res) => {
  res.json({ message: "Welcome Admin 👑. This is top-secret data." });
});

// Logged in user
app.get("/me", authenticateToken, async (req, res) => {
  const users = await loadUsers();

  const currentUser = users.find((user) => user.email === req.user.userId);

  if (!currentUser) {
    return res.status(404).json({ msg: "User not found" });
  }

  // You can choose what fields to return
  const { password, refreshToken, ...safeUser } = currentUser;

  res.json(safeUser);
});

// Get all notes (auth required)
app.get("/notes", authenticateToken, async (req, res) => {
  const notes = await loadNotes();
  const userNotes = notes.filter((note) => note.userId === req.user.userId);
  res.json(userNotes);
});

// Create a new note
app.post("/notes", authenticateToken, async (req, res) => {
  const { content, position } = req.body;

  const newNote = {
    id: Date.now().toString(), // Unique ID
    content,
    position: position || { x: 0, y: 0 },
    userId: req.user.userId,
    createdAt: new Date().toISOString(),
  };

  const notes = await loadNotes();
  notes.push(newNote);
  console.log("User adding note:", req.user.userId, req.body);

  await saveNotes(notes);

  res.status(201).json(newNote);
});

// Update a note
app.put("/notes/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content, position } = req.body;

  const notes = await loadNotes();
  const noteIndex = notes.findIndex(
    (note) => note.id === id && note.userId === req.user.userId
  );

  if (noteIndex === -1) {
    return res.status(404).json({ msg: "Note not found" });
  }

  notes[noteIndex] = {
    ...notes[noteIndex],
    content,
    position,
    updatedAt: new Date().toISOString(),
  };

  await saveNotes(notes);

  res.json(notes[noteIndex]);
});

// Delete a note
app.delete("/notes/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  const notes = await loadNotes();
  const filteredNotes = notes.filter(
    (note) => note.id !== id || note.userId !== req.user.userId
  );

  if (notes.length === filteredNotes.length) {
    return res.status(404).json({ msg: "Note not found" });
  }

  await saveNotes(filteredNotes);
  res.json({ msg: "Note deleted" });
});
console.log("USERS_FILE:", USERS_FILE);
console.log("NOTES_FILE:", NOTES_FILE);
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
