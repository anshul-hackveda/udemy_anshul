import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCourses, updateCourse } from '../redux/courseSlice';
import { useParams, useNavigate } from 'react-router-dom';
import './Edit.css';

const categories = ["Development", "Business", "Design", "Marketing"];
const levels = ["Beginner", "Intermediate", "Advanced"];

const EditCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const { courses, loading: coursesLoading } = useSelector(state => state.courses);
  const courseFromStore = courses.find(course => course._id === courseId);

  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('Beginner'); // Default to Beginner
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (!courseFromStore && !coursesLoading) {
      dispatch(fetchUserCourses());
    }
  }, [courseFromStore, coursesLoading, dispatch]);

  useEffect(() => {
    if (courseFromStore) {
      setTitle(courseFromStore.title || '');
      setSubTitle(courseFromStore.subTitle || '');
      setDescription(courseFromStore.description || '');
      setCategory(courseFromStore.category || '');
      setLevel(courseFromStore.level || 'Beginner'); // fallback to Beginner
      setPrice(courseFromStore.price !== undefined ? courseFromStore.price.toString() : '');
      setPreview(courseFromStore.thumbnail || '');
      setIsPublished(courseFromStore.isPublished || false);
    }
  }, [courseFromStore]);

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadThumbnail = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:8000/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Failed to upload');
    }

    const data = await res.json();
    return data.url;
  };

  const handleSave = async () => {
    try {
      if (!level) {
        alert('Please select a course level.');
        return;
      }
      if (!title.trim()) {
        alert('Title is required.');
        return;
      }
      if (!category) {
        alert('Please select a category.');
        return;
      }

      let thumbUrl = preview;
      if (thumbnail) {
        thumbUrl = await uploadThumbnail(thumbnail);
      }

      await dispatch(updateCourse({
        courseId: courseFromStore._id,
        updates: {
          title,
          subTitle,
          description,
          category,
          level,
          price: Number(price),
          thumbnail: thumbUrl,
          isPublished,
        }
      }));

      navigate('/courses');
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update course');
    }
  };

  const handlePublishToggle = async () => {
    try {
      await dispatch(updateCourse({
        courseId: courseFromStore._id,
        updates: {
          isPublished: !isPublished,
        }
      }));
      setIsPublished(!isPublished);
    } catch (error) {
      console.error('Failed to update publish status', error);
      alert('Failed to update publish status');
    }
  };

  const handleCancel = () => {
    navigate('/courses');
  };

  if (coursesLoading) return <div>Loading courses...</div>;
  if (!courseFromStore) return <div>Loading course data or course not found...</div>;

  return (
    <div className="edit-course-container">
      <h2>Edit Course Details</h2>

      <div style={{ marginBottom: 20 }}>
        <button
          className={`publish-btn ${isPublished ? 'unpublish' : 'publish'}`}
          onClick={handlePublishToggle}
          disabled={coursesLoading}
        >
          {isPublished ? 'Unpublish' : 'Publish'}
        </button>

        <button
          style={{ backgroundColor: '#dc3545', color: 'white', marginLeft: 10 }}
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button
          style={{ backgroundColor: 'black', color: 'white', marginLeft: 10 }}
          onClick={() => navigate(`/createlecture/${courseId}`)}
        >
          Go to Lecture Page
        </button>
      </div>

      <label>Title</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

      <label>Subtitle</label>
      <input type="text" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />

      <label>Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

      <label>Category</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="">-- Select Category --</option>
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>

      <label>Level</label>
      <select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        required
      >
        <option value="">-- Select Level --</option>
        {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
      </select>

      <label>Price (₹)</label>
      <input
        type="number"
        min="0"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <label>Thumbnail</label>
      <div className="thumbnail-box">
        {preview ? (
          <img src={preview} alt="preview" />
        ) : (
          <span>Upload image</span>
        )}
        <input type="file" accept="image/*" onChange={handleThumbnailChange} />
      </div>

      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default EditCourse;






