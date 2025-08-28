// src/controller/courseController.js
import mongoose from "mongoose";
import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";
import User from "../models/userModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Review from "../models/reviewModel.js";


/**
 * =========================
 * COURSE CONTROLLER
 * =========================
 */

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { title, subTitle, description, category, level, price, thumbnail } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title and category are required." });
    }

    const course = await Course.create({
      title,
      subTitle,
      description,
      category,
      level,
      price,
      thumbnail,
      instructor: req.user._id,
    });

    return res.status(201).json({ message: "Course created successfully", course });
  } catch (err) {
    console.error("createCourse error:", err);
    return res.status(500).json({ message: "Server error while creating course" });
  }
};

// Get all published courses
export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
     Course.findById(courseId)
  .populate("instructor", "name email")
  .populate("lectures")
  .populate({
    path: "reviews",
    populate: { path: "user", select: "name" },
  });


    return res.json(courses);
  } catch (err) {
    console.error("getPublishedCourses error:", err);
    return res.status(500).json({ message: "Server error while fetching courses" });
  }
};

// Get single course by ID
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId)
      .populate("instructor", "name email")
      .populate("lectures")
      .populate({
        path: "reviews",
        populate: { path: "user", select: "name" },
      });

    if (!course) return res.status(404).json({ message: "Course not found" });

    return res.json(course);
  } catch (err) {
    console.error("getCourseById error:", err);
    return res.status(500).json({ message: "Server error while fetching course" });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(course, req.body);
    await course.save();

    return res.json({ message: "Course updated successfully", course });
  } catch (err) {
    console.error("updateCourse error:", err);
    return res.status(500).json({ message: "Server error while updating course" });
  }
};

// Delete course (cascade delete lectures)
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete all lectures of the course
    await Lecture.deleteMany({ _id: { $in: course.lectures } });

    await Course.deleteOne({ _id: course._id });

    return res.json({ message: "Course and all lectures deleted successfully" });
  } catch (err) {
    console.error("deleteCourse error:", err);
    return res.status(500).json({ message: "Server error while deleting course" });
  }
};

// Enroll a student
export const enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    course.enrolledStudents.push(req.user._id);
    await course.save();

    return res.json({ message: "Enrolled successfully", course });
  } catch (err) {
    console.error("enrollStudent error:", err);
    return res.status(500).json({ message: "Server error while enrolling" });
  }
};

// Toggle publish/unpublish
export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    return res.json({ message: `Course ${course.isPublished ? "published" : "unpublished"}`, course });
  } catch (err) {
    console.error("togglePublishCourse error:", err);
    return res.status(500).json({ message: "Server error while publishing/unpublishing" });
  }
};

/**
 * =========================
 * LECTURE CONTROLLER
 * =========================
 */

// Create lecture
export const createLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lectureTitle } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    if (!lectureTitle) return res.status(400).json({ message: "lectureTitle is required" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lecture = await Lecture.create({ lectureTitle });
    course.lectures.push(lecture._id);
    await course.save();

    await course.populate("lectures");

    return res.status(201).json({ message: "Lecture created", lecture, course });
  } catch (err) {
    console.error("createLecture error:", err);
    return res.status(500).json({ message: "Server error while creating lecture" });
  }
};

// Get course lectures
export const getCourselecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId).populate("lectures");
    if (!course) return res.status(404).json({ message: "Course not found" });

    return res.json(course);
  } catch (err) {
    console.error("getCourselecture error:", err);
    return res.status(500).json({ message: "Server error while fetching lectures" });
  }
};

// Edit lecture
export const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { lectureTitle, isPreviewFree } = req.body;

    if (!mongoose.Types.ObjectId.isValid(lectureId)) {
      return res.status(400).json({ message: "Invalid lecture ID" });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    lecture.isPreviewFree = Boolean(isPreviewFree && isPreviewFree !== "false");

    if (req.file) {
      try {
        const videoUrl = await uploadOnCloudinary(req.file.path);
        lecture.videoUrl = videoUrl;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({ message: "Failed to upload video" });
      }
    }

    await lecture.save();
    return res.json({ message: "Lecture updated", lecture });
  } catch (err) {
    console.error("editLecture error:", err);
    return res.status(500).json({ message: "Server error while editing lecture" });
  }
};

// Remove lecture
export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(lectureId)) {
      return res.status(400).json({ message: "Invalid lecture ID" });
    }

    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    await Course.updateMany({ lectures: lectureId }, { $pull: { lectures: lectureId } });

    return res.json({ message: "Lecture removed successfully" });
  } catch (err) {
    console.error("removeLecture error:", err);
    return res.status(500).json({ message: "Server error while removing lecture" });
  }
};
