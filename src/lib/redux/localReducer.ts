import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import notificationReducer from "./features/notificationSlice";
import messagingMetadataReducer from "./features/messagingMetadataSlice";

const localReducer = combineReducers({
  user: userReducer,
  notification: notificationReducer,
  messagingMetadata: messagingMetadataReducer,
});

export default localReducer;
