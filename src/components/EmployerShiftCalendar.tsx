"use client"
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventClickArg, DateSelectArg, EventAddArg, EventChangeArg } from '@fullcalendar/core/index.js'
import toast from 'react-hot-toast'
import ConvertEventApiToShift from '@/utils/ConvertEventApiToShift'
import { JobSchedule, JobShift } from '@/types/jobPostService'
import { InputNumber } from 'antd'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { addJobShift, removeJobShift, selectEmployerShiftCalendar, setMinimumShift, updateJobShift } from '@/lib/redux/features/employerShiftCalendarSlice'

export default function EmployerShiftCalendar({
    height = 600,
    onChange,
}: Readonly<{
    height?: number,
    onChange: (schedule: JobSchedule) => void
}>) {
    const dispatch = useAppDispatch();
    const selector = useAppSelector(selectEmployerShiftCalendar);

    const handleEventClick = (clickInfo: EventClickArg) => {
        if (confirm(`Bạn có chắc chắn muốn xóa ca làm này?`)) {
            dispatch(removeJobShift(clickInfo.event.id));
            onChange({
                shiftCount: selector.shiftCount - 1,
                minimumShift: selector.minimumShift,
                jobShifts: selector.jobShifts.filter(
                    (jobShift: JobShift) => jobShift.jobShiftId !== clickInfo.event.id
                )
            });
            clickInfo.event.remove()
        }
    }

    const handleEventAdd = (event: EventAddArg) => {
        const addedShift = ConvertEventApiToShift(event.event);

        if (addedShift) {
            dispatch(addJobShift(addedShift));
            onChange({
                shiftCount: selector.shiftCount + 1,
                minimumShift: selector.minimumShift,
                jobShifts: [...selector.jobShifts, addedShift]
            });
        }
    }

    const handleEventUpdate = (event: EventChangeArg) => {
        const updatedShift = ConvertEventApiToShift(event.event);

        if (updatedShift) {
            dispatch(updateJobShift(updatedShift));
            onChange({
                shiftCount: selector.shiftCount,
                minimumShift: selector.minimumShift,
                jobShifts: selector.jobShifts.map(
                    (jobShift: JobShift) => {
                        if (jobShift.jobShiftId === updatedShift.jobShiftId) {
                            return updatedShift;
                        }
                        return jobShift;
                    }
                )
            });
        }
    }

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        if (selectInfo.startStr.split('T')[0] !== selectInfo.endStr.split('T')[0]) {
            toast.error('Chỉ có thể tạo ra sự kiện trong cùng một ngày');
            return;
        }
        const calendarApi = selectInfo.view.calendar
        calendarApi.unselect() // clear date selection

        calendarApi.addEvent({
            id: crypto.randomUUID(),
            title: "",
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
        })
    }
    return (
        <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
                <label htmlFor='MinimumShift' className='text-sm font-medium' title="Số ca tối thiểu mà ứng viên phải đăng ký">Số ca tối thiểu</label>
                <InputNumber 
                    id='MinimumShift'
                    defaultValue={0}
                    value={selector.minimumShift} 
                    onChange={(value) => { 
                        dispatch(setMinimumShift(value ?? 0)); 
                        onChange({
                            shiftCount: selector.shiftCount,
                            minimumShift: value ?? 0,
                            jobShifts: selector.jobShifts
                        }) 
                    }} 
                    min={0}
                    max={selector.shiftCount}
                    step={1}
                />
            </div>
            <FullCalendar
                plugins={[ timeGridPlugin, interactionPlugin ]}
                initialView="timeGridWeek"
                headerToolbar={false}
                height={height}
                firstDay={1} // monday
                dayHeaders={true}
                dayHeaderFormat={
                    { weekday: 'short' } // mon, tue, wed, thu, fri, sat, sun
                }
                themeSystem='standard'
                editable={true}
                selectable={true}
                snapDuration={'00:15:00'}
                eventResizableFromStart={true}
                allDaySlot = {false}
                eventClick={handleEventClick} // Handle when user click on the event
                eventAdd={handleEventAdd}
                eventChange={handleEventUpdate}
                select={handleDateSelect} // Handle when user click on the time-range
                eventConstraint={
                    {
                        startTime: '0:00',
                        endTime: '23:59'
                    }
                }
            />
        </div>
    )


}
