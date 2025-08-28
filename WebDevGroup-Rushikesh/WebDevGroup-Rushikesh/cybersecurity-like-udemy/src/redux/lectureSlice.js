import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { serverUrl } from "../App";

export const fetchLectures = createAsyncThunk(
  "lecture/fetchLectures",
  async (courseId) => {
    const response = await axios.get(
      `${serverUrl}/api/course/courselecture/${courseId}`,
      { withCredentials: true }
    );
    return response.data.lectures;
  }
);

export const removeLectureById = createAsyncThunk(
  "lecture/removeLectureById",
  async (lectureId) => {
    await axios.delete(`${serverUrl}/api/course/removelecture/${lectureId}`, {
      withCredentials: true,
    });
    return lectureId; // ✅ only return ID
  }
);

const lectureSlice = createSlice({
  name: "lecture",
  initialState: {
    lectureData: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLectureData: (state, action) => {
      state.lectureData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLectures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLectures.fulfilled, (state, action) => {
        state.loading = false;
        state.lectureData = action.payload;
        state.error = null;
      })
      .addCase(fetchLectures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(removeLectureById.fulfilled, (state, action) => {
        state.lectureData = state.lectureData.filter(
          (lecture) => lecture._id !== action.payload
        );
      });
  },
});

export const { setLectureData } = lectureSlice.actions;
export default lectureSlice.reducer;
