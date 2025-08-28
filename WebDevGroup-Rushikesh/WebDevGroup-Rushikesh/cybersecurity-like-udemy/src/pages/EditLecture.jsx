import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { serverUrl } from "../App";
import { fetchLectures } from "../redux/lectureSlice";
import "./EditLecture.css";

const EditLecture = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { lectureData } = useSelector((state) => state.lecture);

  const [lectureTitle, setLectureTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Populate form when data is available
  useEffect(() => {
    const lecture = lectureData.find((l) => l._id === lectureId);
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsPreviewFree(lecture.isPreviewFree);
    } else {
      dispatch(fetchLectures(courseId));
    }
  }, [lectureData, lectureId, courseId, dispatch]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!lectureTitle.trim()) {
      return toast.error("Lecture title is required");
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("lectureTitle", lectureTitle);
      formData.append("isPreviewFree", isPreviewFree.toString());
      if (videoFile) {
        formData.append("videoUrl", videoFile);
      }

      await axios.post(
        `${serverUrl}/api/course/editlecture/${lectureId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) =>
            setUploadProgress(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            ),
        }
      );

      toast.success("Lecture updated successfully!");
      dispatch(fetchLectures(courseId));
      navigate("/courses");
    } catch (err) {
      console.error("Update error:", err.response || err);
      toast.error(err.response?.data?.message || "Failed to update lecture");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm("Are you sure you want to remove this lecture?")) return;
    setLoading(true);

    try {
      await axios.delete(`${serverUrl}/api/course/removelecture/${lectureId}`, {
        withCredentials: true,
      });
      toast.success("Lecture removed successfully!");
      dispatch(fetchLectures(courseId));
      navigate("/courses");
    } catch (err) {
      console.error("Remove error:", err.response || err);
      toast.error(err.response?.data?.message || "Failed to remove lecture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-lecture-container">
      <h2>Update Course Lecture</h2>
      <button className="remove-lecture-btn" onClick={handleRemove} disabled={loading}>
        Remove Lecture
      </button>
      <form onSubmit={handleUpdate} className="edit-lecture-form">
        <label>Lecture Title *</label>
        <input
          type="text"
          value={lectureTitle}
          onChange={(e) => setLectureTitle(e.target.value)}
          required
        />

        <label>Video (optional)</label>
        <input
          key={videoFile ? videoFile.name : "file-input"}
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
        />

        {loading && uploadProgress > 0 && (
          <div className="upload-progress">Uploading: {uploadProgress}%</div>
        )}

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="isPreviewFree"
            checked={isPreviewFree}
            onChange={(e) => setIsPreviewFree(e.target.checked)}
          />
          <label htmlFor="isPreviewFree">Is this Video FREE</label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Lecture"}
        </button>
      </form>
    </div>
  );
};

export default EditLecture;


