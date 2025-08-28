// src/pages/CourseView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import "./CourseView.css";

const CourseView = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/course/${courseId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch course");
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  if (loading) return <p>Loading course...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!course) return <p>No course found</p>;

  return (
    <div className="course-view">
      {/* Left - Course Content */}
      <div className="course-content">
        <h1>{course.title}</h1>
        {course.subTitle && <p className="subtitle">{course.subTitle}</p>}
        <p className="instructor">
          Created by {course.instructor?.name || "Unknown"}
        </p>

        <div className="description">
          <h3>About this course</h3>
          <p>{course.description}</p>
        </div>

        <div className="curriculum">
          <h3>Course Content</h3>
          {course.lectures?.length > 0 ? (
            <ul>
              {course.lectures.map((lec) => (
                <li key={lec._id}>
                  <h4>
                    {lec.lectureTitle}{" "}
                    {lec.isPreviewFree && <span>(Free Preview)</span>}
                  </h4>

                  {/* Video rendering conditionally */}
                  {(lec.isPreviewFree || course.isUserEnrolled) &&
                  lec.videoUrl ? (
                    <video width="100%" height="auto" controls>
                      <source
                        src={lec.videoUrl}

                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <p style={{ color: "gray" }}>
                      Enroll to view this lecture
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No lectures available</p>
          )}
        </div>
      </div>

      {/* Right - Sticky Sidebar */}
      <div className="course-sidebar">
        <img
          src={
            course.thumbnail
              ? `${serverUrl}${course.thumbnail}`
              : "/placeholder.png"
          }
          alt={course.title}
          className="course-thumb"
        />

        <div className="price">
          ₹{course.price}{" "}
          <span className="old-price">₹{course.oldPrice || 3299}</span>
        </div>

        <button className="enroll-btn">Enroll Now</button>
        <p className="guarantee">30-Day Money-Back Guarantee</p>

        <div className="includes">
          <h4>This course includes:</h4>
          <ul>
            <li>Video lectures ({course.lectures?.length || 0})</li>
            <li>Full lifetime access</li>
            <li>Certificate of completion</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseView;

