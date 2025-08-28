import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateLecture.css";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import axios from "axios";
import { FaClipboardList, FaEdit } from "react-icons/fa";
import { fetchLectures } from "../redux/lectureSlice";
import { toast } from "react-toastify";

const CreateLecture = () => {
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { lectureData, loading } = useSelector((state) => state.lecture);

  // ✅ Fetch lectures using Redux slice
  useEffect(() => {
    dispatch(fetchLectures(courseId));
  }, [courseId, dispatch]);

  const handleCreateLecture = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a lecture title!");
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/course/createlecture/${courseId}`,
        { lectureTitle: title },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Lecture Added");
      setTitle("");

      // 🔄 Re-fetch updated list
      dispatch(fetchLectures(courseId));
    } catch (error) {
      console.error("Error creating lecture:", error);
      toast.error(
        error.response?.data?.message ||
        "Something went wrong while creating lecture!"
      );
    }
  };

  const handleEdit = (lectureId) => {
    navigate(`/editlecture/${courseId}/${lectureId}`);
  };

  return (
    <div className="lecture-container">
      <div className="lecture-card">
        <h2>Let’s Add a Lecture</h2>
        <p>
          Enter the title and add your video lectures to enhance your course content.
        </p>

        <form onSubmit={handleCreateLecture}>
          <input
            type="text"
            placeholder="e.g. Introduction to MERN Stack"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="lecture-input"
          />

          <div className="lecture-buttons">
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate(`/editcourse/${courseId}`)}
              disabled={loading}
            >
              ← Back to Course
            </button>

            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? (
                <FaClipboardList size={20} color="white" />
              ) : (
                "+ Create Lecture"
              )}
            </button>
          </div>
        </form>

        {/* Lecture List */}
        <div className="lecture-list">
          {lectureData?.map((lecture, index) => (
            <div className="lecture-item" key={lecture._id}>
              <span>
                Lecture - {index + 1}: {lecture.lectureTitle}
              </span>
              <FaEdit
                className="edit-icon"
                onClick={() => handleEdit(lecture._id)}
                style={{ cursor: "pointer", marginLeft: "auto" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;



