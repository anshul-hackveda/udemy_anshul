import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCourse } from '../redux/courseSlice';
import { useNavigate } from 'react-router-dom';
import './CreateCourse.css';

const CreateCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // send required fields
      await dispatch(createCourse({
        title,
        category,
        description, // required by backend
      })).unwrap();

      navigate('/courses'); // go to courses list
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  return (
    <div className="create-course-container">
      <h2>Create Course</h2>
      <form onSubmit={handleSubmit}>
        <label>Course Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter course title"
          required
        />
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Course description"
          required
        />
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Web Development">Web Development</option>
          <option value="Cyber Security">Cyber Security</option>
          <option value="MERN Stack">MERN Stack</option>
          <option value="Full Stack">Full Stack</option>
        </select>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateCourse;


