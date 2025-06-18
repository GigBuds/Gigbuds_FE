import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import notificationReducer from "./features/notificationSlice";

const localReducer = combineReducers({
  user: userReducer,
  notification: notificationReducer,
});

export default localReducer;
