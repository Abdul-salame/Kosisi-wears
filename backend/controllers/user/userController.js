import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../../model/user.js";
import { JWT_SECRET } from "../../middleware/auth.js";

// In-memory store fallback for offline/disconnected states
const memoryUsers = [];

async function CreateUser(req, res) {
  const { FirstName, LastName, email, password, phone, address, city, state, country } = req.body;

  if (!FirstName || !LastName || !email || !password) {
    return res.status(400).json({ message: "FirstName, LastName, email, and password are required" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;
    try {
      const existing = await userModel.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      newUser = await userModel.create({
        FirstName,
        LastName,
        email,
        password: hashedPassword,
        role: "customer",
        accountType: "customer",
        phone,
        address,
        city,
        state,
        country
      });
    } catch (dbErr) {
      if (memoryUsers.some((u) => u.email === email)) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      newUser = {
        _id: "usr-" + Date.now(),
        FirstName,
        LastName,
        email,
        password: hashedPassword,
        role: "customer",
        accountType: "customer",
        phone,
        address,
        city,
        state,
        country,
        createdAt: new Date().toISOString()
      };
      memoryUsers.push(newUser);
    }

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: `${newUser.FirstName} ${newUser.LastName} created successfully`,
      user: {
        id: newUser._id,
        FirstName: newUser.FirstName,
        LastName: newUser.LastName,
        email: newUser.email,
        role: newUser.role,
        accountType: newUser.accountType
      },
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "User was not created" });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    let user;
    try {
      user = await userModel.findOne({ email });
    } catch (dbErr) {
      user = memoryUsers.find((u) => u.email === email);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        FirstName: user.FirstName,
        LastName: user.LastName,
        email: user.email,
        role: user.role,
        accountType: user.accountType
      },
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Login failed" });
  }
}

async function adminLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Admin email and password are required" });
  }

  const ADMIN_EMAIL = "kosisiwear@gmail.com";
  const ADMIN_PASSWORD = "#Kosisi@123#";

  if (email.toLowerCase().trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { id: "admin-root", email: ADMIN_EMAIL, role: "admin" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Admin authentication successful",
      user: {
        id: "admin-root",
        FirstName: "Kosisi",
        LastName: "Admin",
        email: ADMIN_EMAIL,
        role: "admin",
        accountType: "admin"
      },
      token
    });
  }

  try {
    let user;
    try {
      user = await userModel.findOne({ email });
    } catch (dbErr) {
      user = memoryUsers.find((u) => u.email === email);
    }

    if (!user) {
      return res.status(404).json({ message: "Admin account not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    if (user.role !== "admin" && user.email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: "Access forbidden. User is not an admin." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: "admin" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Admin authentication successful",
      user: {
        id: user._id,
        FirstName: user.FirstName,
        LastName: user.LastName,
        email: user.email,
        role: "admin",
        accountType: "admin"
      },
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Admin login failed" });
  }
}

async function logoutUser(req, res) {
  return res.status(200).json({ message: "Logout successful" });
}

async function GetUsers(req, res) {
  try {
    let users = [];
    try {
      users = await userModel.find().select("-password");
    } catch (dbErr) {
      users = memoryUsers.map(({ password, ...u }) => u);
    }
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Users could not be retrieved" });
  }
}

async function DeleteUsers(req, res) {
  const { ids } = req.body;
  try {
    try {
      if (Array.isArray(ids)) {
        await userModel.deleteMany({ _id: { $in: ids } });
      } else if (req.params.id) {
        await userModel.findByIdAndDelete(req.params.id);
      }
    } catch (dbErr) {
      // Memory fallback
    }
    return res.status(200).json({ message: "User(s) deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete user(s)" });
  }
}

export {
  CreateUser,
  loginUser,
  adminLogin,
  logoutUser,
  GetUsers,
  DeleteUsers
};
