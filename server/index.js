const express = require("express");
// const bcrypt = require("./node_modules/bcryptjs/umd");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs-extra");
const dotenv = require("dotenv");
const cors = require("cors");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const USERS_FILE = process.env.USERS_FILE;
const NOTES_FILE = process.env.NOTES_FILE;
const ROOMS_FILE = process.env.ROOMS_FILE;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Load rooms from file
const loadRooms = async () => {
  try {
    const data = await fs.readJson(ROOMS_FILE);
    return data;
  } catch (err) {
    return {}; // Return an empty object if the file doesn't exist or is empty
  }
};

let rooms = {};

const initializeRooms = async () => {
  rooms = await loadRooms();
};

initializeRooms();

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
    console.log(data);
    return data;
  } catch (err) {
    return [];
  }
};

const saveNotes = async (notes) => {
  await fs.writeJson(NOTES_FILE, notes);
};

// Save rooms to file
const saveRooms = async (rooms) => {
  await fs.writeJson(ROOMS_FILE, rooms);
};

const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token
    req.user = decoded; // Assuming decoded contains user info like userId
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
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
  // const userNotes = notes.filter((note) => note.userId === req.user.userId);
  res.json(notes);
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
  console.log("User adding note:", req.user?.userId, req.body);

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
    content: content ?? notes[noteIndex].content,
    position: position ?? notes[noteIndex].position,
    updatedAt: new Date().toISOString(),
  };

  if (content !== undefined) {
    notes[noteIndex].content = content;
  }
  if (position !== undefined) {
    notes[noteIndex].position = position;
  }
  notes[noteIndex].updatedAt = new Date().toISOString();

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

// GET all rooms (admin only access for all rooms)
app.get("/rooms", requireAuth, async (req, res) => {
  const rooms = await loadRooms();
  res.status(200).json(rooms);
});

app.get("/my-rooms", requireAuth, async (req, res) => {
  const { userId } = req.user;
  console.log("user id ", userId);

  if (!userId) {
    return res.status(400).json({ message: "User not found" });
  }

  const rooms = await loadRooms();
  console.log("All rooms:", rooms);

  // Filter the rooms where the current user is the host
  const userRooms = rooms.filter((room) => room.host === userId);
  console.log("user rooms", userRooms);

  if (userRooms.length === 0) {
    return res.status(404).json({ message: "No rooms found for this user" });
  }

  res.status(200).json(userRooms);
});

// Create room endpoint
app.post("/rooms", requireAuth, async (req, res) => {
  const { name, host } = req.body;

  // Generate a unique room ID (you can use a library or create your own)
  const roomId = `roomId${Date.now()}`;

  // Create the new room object
  const newRoom = {
    id: roomId,
    name,
    host,
    participants: [host], // Assuming host is part of the room
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add the new room to the in-memory rooms object
  rooms.push(newRoom);

  // Save the updated rooms to the file
  await saveRooms(rooms);

  res.status(201).json(newRoom);
});

app.post("/rooms/:roomId/join", requireAuth, async (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.user;

  // Find the room by its ID
  const room = rooms.find((r) => r.id === roomId);

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  // Check if the user is already in the room
  if (room.participants.includes(userId)) {
    return res.status(400).json({ message: "User is already in the room" });
  }

  // Add the user to the participants list
  room.participants.push(userId);
  room.updatedAt = new Date().toISOString();

  // Save the updated rooms to the file
  await saveRooms(rooms);

  res.status(200).json(room);
});

app.delete("/rooms/:roomId", requireAuth, async (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.user;
  // Find the room by its ID
  const room = rooms.find((r) => r.id === roomId);

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  // Check if the user is the host or an admin
  if (room.host !== userId && !userIsAdmin(userId)) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this room" });
  }

  // Find and remove the room by its ID
  const roomIndex = rooms.findIndex((r) => r.id === roomId);
  // Remove the room from the in-memory array
  rooms.splice(roomIndex, 1);

  // Save the updated rooms to the file
  await saveRooms(rooms);

  res.status(200).json({ message: "Room deleted successfully" });
});

// Start the server
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend origin
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle room join
  socket.on("join-room", (roomId) => {
    const room = rooms[roomId];
    if (room) {
      // Add user to room
      room.participants.push(socket.id);
      socket.join(roomId);

      console.log(`User ${socket.id} joined room ${roomId}`);
      socket.to(roomId).emit("user-joined", socket.id);
      socket.emit("room-data", room);

      // Save rooms to file after the update
      saveRooms(rooms);
    }
  });

  // Handle room messages
  socket.on("send-message", (roomId, message) => {
    socket.to(roomId).emit("receive-message", message);
    console.log(`Message sent to room ${roomId}: ${message}`);
  });

  // Listen for note updates from client
  socket.on("note-updated", (updatedNote) => {
    if (updatedNote) {
      console.log("Note updated:", updatedNote);
      io.emit("note-updated", updatedNote); // Broadcast the update to all clients
    } else {
      console.error("Error: Missing updated note data.");
    }
  });

  // Handle note creation
  socket.on("new-note", async (newNote) => {
    const notes = await loadNotes();
    if (newNote) {
      console.log("new-note:", newNote);
      io.emit("note-created", newNote); // Broadcast the new note to all clients
      await saveNotes(notes);
    } else {
      console.error("Error: Missing new note data.");
    }
  });

  // Handle note deletion
  socket.on("note-deleted", (deletedNoteId) => {
    if (deletedNoteId) {
      console.log("Note deleted:", deletedNoteId);
      io.emit("note-deleted", { id: deletedNoteId });
      // Broadcast the deleted note ID to all clients
    } else {
      console.error("Error: Missing deleted note ID.");
    }
  });

  // Handle note movement
  socket.on("note-moved", (note) => {
    if (note) {
      console.log("Note moved:", note);
      io.emit("note-moved", note); // Broadcast the movement to all clients
    } else {
      console.error("Error: Missing note movement data.");
    }
  });
  // Handle user disconnect
  socket.on("disconnect", () => {
    // Find and remove user from all rooms they are part of
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const index = room.participants.indexOf(socket.id);
      if (index !== -1) {
        room.participants.splice(index, 1);
        socket.to(roomId).emit("user-left", socket.id);
        console.log(`User ${socket.id} left room ${roomId}`);
      }
    }
    saveRooms(rooms);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* WEBSOCKET FUNCTIONS */

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // socket.on("new_note", async (note) => {
  //   const notes = await loadNotes();
  //   notes.push(note);
  //   await saveNotes(notes);
  //   io.emit("note_added", note);
  // });

  /* TO BE IMPLEMENTED */
  // socket.on("updated_note", async (note) => {
  //   const notes = await loadNotes();
  //   notes.push(note);
  //   await saveNotes(notes);
  //   io.emit("note_updated", note);
  // });

  // socket.on("moved_note", async (note) => {
  //   const notes = await loadNotes();
  //   notes.push(note);
  //   await saveNotes(notes);
  //   io.emit("note_moved", note);
  // });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
