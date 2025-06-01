import { combineReducers } from "@reduxjs/toolkit";
import employerShiftCalendarReducer from "./features/employerShiftCalendarSlice";

const tempReducer = combineReducers({
    employerShiftCalendar: employerShiftCalendarReducer, // Luu tam thoi
});

export default tempReducer;