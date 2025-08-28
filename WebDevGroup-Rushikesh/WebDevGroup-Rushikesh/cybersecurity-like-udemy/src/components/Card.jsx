// src/components/Card.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Card.css";

const Card = ({ course }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/viewcourse/${course._id}`);
 // ✅ navigate to CourseView
  };

  return (
    <div className="course-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      {/* Thumbnail */}
      <img
        className="course-thumbnail"
        src={
          course.thumbnail
            ? `http://localhost:8000${course.thumbnail}`
            : "/placeholder.png"
        }
        alt={course.title}
      />

      {/* Content */}
      <div className="course-info">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-instructor">
          {course.instructor?.name || "Unknown Instructor"}
        </p>

        {/* Rating */}
        <div className="course-rating">
          <span className="stars">⭐ {course.rating || "4.5"}</span>
          <span className="reviews">({course.numReviews || "0"})</span>
        </div>

        {/* Price */}
        <div className="course-price">
          <span className="current">₹{course.price}</span>
          <span className="old">₹{course.oldPrice || course.price * 2}</span>
        </div>

        {/* Tags */}
        <div className="course-tags">
          <span className="tag premium">Premium</span>
          <span className="tag bestseller">Bestseller</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
