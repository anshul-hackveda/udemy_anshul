import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice"
import coursesReducer from './courseSlice';
import lectureReducer from './lectureSlice'
export const store = configureStore({
    reducer : {
        user:userSlice,
        courses: coursesReducer,
        lecture:lectureReducer
        

    }
})
export default store;