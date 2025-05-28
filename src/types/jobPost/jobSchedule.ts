import { JobShift } from "./jobShift";

export interface JobSchedule {
    shiftCount: number;
    minimumShift: number;
    jobShifts: JobShift[];
}