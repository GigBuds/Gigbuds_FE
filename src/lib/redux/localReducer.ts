import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";

const localReducer = combineReducers({
  user: userReducer,
});

export default localReducer;
