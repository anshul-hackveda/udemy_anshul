import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authFetch from '../utils/authFetch';

// Fetch all courses created by the educator
export const fetchUserCourses = createAsyncThunk(
  'courses/fetchUserCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch.get('/api/course/user');
      // Assuming API returns { courses: [...] }
      return response.courses;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch courses');
    }
  }
);

// Create a new course
export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await authFetch.post('/api/course/create', courseData);
      // Assuming API returns { course: {...} }
      return response.course;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to create course');
    }
  }
);

// Update an existing course
export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ courseId, updates }, { rejectWithValue }) => {
    try {
      const response = await authFetch.put(`/api/course/editcourse/${courseId}`, updates);
      // Assuming API returns { course: {...} }
      return response.course;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to update course');
    }
  }
);

// Publish or unpublish a course
export const publishCourse = createAsyncThunk(
  'courses/publishCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await authFetch.post(`/api/course/publish/${courseId}`);
      // Assuming API returns { course: {...} }
      return response.course;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to publish course');
    }
  }
);
// Delete a course
export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (courseId, { rejectWithValue }) => {
   try {
      await authFetch.delete(`/api/course/remove/${courseId}`);  // <-- change here
      return courseId;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to delete course');
    }
  }
);


const initialState = {
  courses: [],
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  extraReducers: builder => {
    builder
      // Fetch User Courses
      .addCase(fetchUserCourses.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchUserCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Course
      .addCase(createCourse.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Course
      .addCase(updateCourse.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCourse = action.payload;
        const index = state.courses.findIndex(c => c._id === updatedCourse._id);
        if (index !== -1) {
          state.courses[index] = updatedCourse;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Publish/Unpublish Course
      .addCase(publishCourse.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishCourse.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCourse = action.payload;
        const index = state.courses.findIndex(c => c._id === updatedCourse._id);
        if (index !== -1) {
          state.courses[index] = updatedCourse;
        }
      })
      .addCase(publishCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Course
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter(course => course._id !== action.payload);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default courseSlice.reducer;


