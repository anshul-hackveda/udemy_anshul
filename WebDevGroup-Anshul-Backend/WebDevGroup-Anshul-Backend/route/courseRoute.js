import express from "express";
import isAuth from "../middleware/isAuth.js";
import Course from "../models/courseModel.js";  
import upload from "../middleware/upload.js";

import {
  createCourse,
  getPublishedCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollStudent,
  togglePublishCourse,
} from "../controller/courseController.js";

import {
  createLecture,
  getCourselecture,
  editLecture,
  removeLecture,
} from "../controller/courseController.js";

const router = express.Router();


// ================== COURSE ROUTES ================== //

// Get courses created by the logged-in educator
router.get("/user", isAuth, async (req, res) => {
  try {
    if (req.user.role !== "educator") {
      return res.status(403).json({ message: "Only educators can access this route" });
    }

    const courses = await Course.find({ instructor: req.user._id }).populate(
      "instructor",
      "name email photoURL"
    );

    res.json({ courses });
  } catch (err) {
    console.error("Error in GET /api/course/user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//  Public Routes
router.get("/", getPublishedCourses);               // GET /api/course
router.get("/:courseId", getCourseById);            // GET /api/course/:courseId

//  Protected Routes
router.post("/create", isAuth, createCourse);
router.put("/editcourse/:courseId", isAuth, updateCourse);
router.delete("/remove/:courseId", isAuth, deleteCourse);
router.post("/enroll/:courseId", isAuth, enrollStudent);
router.post("/publish/:courseId", isAuth, togglePublishCourse);


// ================== LECTURE ROUTES ================== //

router.post("/createlecture/:courseId", isAuth, createLecture);
router.get("/courselecture/:courseId", isAuth, getCourselecture);
router.post("/editlecture/:lectureId", isAuth, upload.single("videoUrl"), editLecture);
router.delete("/removelecture/:lectureId", isAuth, removeLecture);


export default router;

