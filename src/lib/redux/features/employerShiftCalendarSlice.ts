import { JobShift } from "@/types/jobPostService";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface EmployerShiftCalendarState {
    shiftCount: number;
    minimumShift: number;
    jobShifts: JobShift[];
}

const initialState: EmployerShiftCalendarState = {
    shiftCount: 0,
    minimumShift: 0,
    jobShifts: [],
}

const employerShiftCalendarSlice = createSlice({
    name: "employerShiftCalendar",
    initialState,
    reducers: {
        addJobShift: (state, action: PayloadAction<JobShift>) => {
            state.jobShifts = [...state.jobShifts, action.payload];
            state.shiftCount = state.jobShifts.length;
        },
        removeJobShift: (state, action: PayloadAction<string>) => {
            const newJobShifts = state.jobShifts.filter(
                (jobShift: JobShift) => jobShift.jobShiftId !== action.payload
            );
            state.jobShifts = [...newJobShifts];
            state.shiftCount = newJobShifts.length;
        },
        updateJobShift: (state, action: PayloadAction<JobShift>) => {
            const newJobShifts = state.jobShifts.map(
                (jobShift: JobShift) => jobShift.jobShiftId === action.payload.jobShiftId ? action.payload : jobShift
            );
            state.jobShifts = [...newJobShifts];
        },
        setMinimumShift: (state, action: PayloadAction<number>) => {
            state.minimumShift = action.payload;
        }
    },
}
)

export const { addJobShift, removeJobShift, setMinimumShift, updateJobShift } = employerShiftCalendarSlice.actions;
export const selectEmployerShiftCalendar = (store: RootState) => store.tempReducer.employerShiftCalendar;
export default employerShiftCalendarSlice.reducer;
