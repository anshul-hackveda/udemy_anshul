import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import { configureGoogleAuth } from "./config/authConfig.js";

// Import routers
import authRouter from "./route/authRoute.js";
import userRouter from "./route/userRoute.js"; // adjust path if needed
import courseRouter from "./route/courseRoute.js"
import uploadRouter from "./route/uploadRoutes.js";


dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));


// Middlewares
app.use(cors({
  origin: ["http://localhost:5173"], // must exactly match frontend
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Session & Passport
app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());
configureGoogleAuth(); // Initialize Google OAuth
// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));
// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);

app.use("/api/upload", uploadRouter)

app.get("/", (req, res) => {
    res.send("Server running");
});

app.listen(port, () => console.log(`Server running on port ${port}`));


