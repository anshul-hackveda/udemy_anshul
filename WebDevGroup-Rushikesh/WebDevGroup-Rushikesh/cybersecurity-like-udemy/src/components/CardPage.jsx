// src/components/CardPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserCourses } from "../redux/courseSlice";
import Card from "./card";
import "./CardPage.css";


const CardPage = () => {
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchUserCourses());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="card-page">
      <h2 className="page-title">All Courses</h2>
      <div className="card-grid">
        {courses.length > 0 ? (
          courses.map((course) => <Card key={course._id} course={course} />)
        ) : (
          <p>No courses available</p>
        )}
      </div>
      
    </div>
  );
};

export default CardPage;
