import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"]
  },
  price: {
    type: Number,
    default: 0, // Free by default
  },
  thumbnail: {
    type: String,
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  lectures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture"
  }],
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
  }]
}, {
  timestamps: true
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
