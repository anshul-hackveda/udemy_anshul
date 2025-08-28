import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserCourses, publishCourse, deleteCourse } from '../redux/courseSlice';
import { useNavigate } from 'react-router-dom';
import './Course.css';

const Courses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { courses, loading, error } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchUserCourses());
  }, [dispatch]);

  const handlePublishToggle = (courseId) => {
    dispatch(publishCourse(courseId));
  };

  const handleDelete = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      dispatch(deleteCourse(courseId));
    }
  };

  const renderTableRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="6">Loading...</td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="6" style={{ color: 'red' }}>{error}</td>
        </tr>
      );
    }

    if (courses.length === 0) {
      return (
        <tr>
          <td colSpan="6">No courses created yet.</td>
        </tr>
      );
    }

    return courses.map((course) => (
      <tr key={course._id}>
        <td>
          <div className="course-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={course.thumbnail ? `http://localhost:8000${course.thumbnail}` : '/placeholder.png'}
              alt="thumbnail"
              className="course-thumb"
              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
              onError={(e) => { e.target.src = '/placeholder.png'; }}
            />
            <span>{course.title || 'Untitled Course'}</span>
          </div>
        </td>
        <td>₹{course.price || 'NA'}</td>
        <td>
          <span className={`status-badge ${course.isPublished ? 'published' : 'draft'}`}>
            {course.isPublished ? 'Published' : 'Draft'}
          </span>
        </td>
        <td>
          <button
            className="edit-btn"
            onClick={() => navigate(`/edit-course/${course._id}`)}
            title="Edit"
          >
            ✏️
          </button>
        </td>
        <td>
          <button
            onClick={() => handlePublishToggle(course._id)}
            className={`publish-btn ${course.isPublished ? 'unpublish' : 'publish'}`}
          >
            {course.isPublished ? 'Unpublish' : 'Publish'}
          </button>
        </td>
        <td>
          <button
            onClick={() => handleDelete(course._id)}
            style={{ marginLeft: '10px', color: 'red' }}
            title="Delete"
          >
            🗑️
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="course-page">
      <div className="course-header">
        <h2>← All Created Courses</h2>
        <button onClick={() => navigate('/create-course')} className="create-btn">
          Create Course
        </button>
      </div>

      <div className="course-table-container">
        <table className="course-table">
          <thead>
            <tr>
              <th>Courses</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
              <th>Publish</th>
              <th>Delete</th> {/* Added header for Delete column */}
            </tr>
          </thead>
          <tbody>{renderTableRows()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Courses;


