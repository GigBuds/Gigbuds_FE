import { combineReducers } from "@reduxjs/toolkit";
import employerShiftCalendarReducer from "./features/employerShiftCalendarSlice";
import draftReducer from "./features/draftSlice";

const tempReducer = combineReducers({
    employerShiftCalendar: employerShiftCalendarReducer, // Luu tam thoi
    draft: draftReducer,
});

export default tempReducer;