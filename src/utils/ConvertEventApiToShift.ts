import { EventApi } from "@fullcalendar/core/index.js";
import { JobShift } from "@/types/jobPost/jobShift";

export default function ConvertEventApiToShift(event: EventApi): JobShift {
    return {
        jobShiftId: event.id,
        dayOfWeek: mapDayOfWeek(event.start?.getDay() ?? 0),
        startTime: event.start?.toISOString() ?? "",
        endTime: event.end?.toISOString() ?? ""
    };
}
const mapping = [
    8, // Sunday
    2, // Monday
    3, // Tuesday
    4, // Wednesday
    5, // Thursday
    6, // Friday
    7 // Saturday
]

function mapDayOfWeek(day: number): number {
    return mapping[day] ?? day;
}