import React from "react";
import { ScheduleDto } from "@/Hooks/useSchedules";

// أيام الأسبوع
const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];

// الفترات الزمنية لكل يوم كـ start/end objects
const timeSlots = [
  { start: "09:00", end: "09:45" },
  { start: "09:45", end: "10:30" },
  { start: "10:40", end: "11:25" },
  { start: "11:25", end: "12:10" },
  { start: "12:30", end: "13:15" },
  { start: "13:15", end: "14:00" },
  { start: "14:10", end: "14:55" },
  { start: "14:55", end: "15:40" },
  { start: "16:00", end: "16:45" },
  { start: "16:45", end: "17:30" },
];

type Props = {
  schedules: ScheduleDto[];
  onEdit?: (schedule: ScheduleDto) => void;
  onDelete?: (id: number) => void;
};

const ScheduleTable: React.FC<Props> = ({ schedules, onEdit, onDelete }) => {
  const getScheduleAtSlot = (dayIdx: number, slot: { start: string; end: string }) => {
    return schedules.find(
      (s) =>
        s.dayOfWeek === dayIdx &&
        s.startTime.slice(0, 5) === slot.start &&
        s.endTime.slice(0, 5) === slot.end
    );
  };

  return (
    <div className="overflow-x-auto p-4">
      <table className="table-auto w-full border-collapse border border-gray-300 text-center">
        <thead className="bg-primary text-white sticky top-0">
          <tr>
            <th className="border border-gray-300">اليوم / الوقت</th>
            {timeSlots.map((slot, idx) => (
              <th key={idx} className="border border-gray-300">
                {slot.start} - {slot.end}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, dayIdx) => (
            <tr key={day}>
              <td className="font-bold border border-gray-300">{day}</td>
              {timeSlots.map((slot, idx) => {
                const sch = getScheduleAtSlot(dayIdx, slot);
                return (
                  <td key={idx} className="border border-gray-300 p-1">
                    {sch ? (
                      <div className="bg-primary/20 rounded-xl p-2 shadow-card hover:shadow-card-hover transition cursor-pointer">
                        <p className="font-semibold">{sch.courseName}</p>
                        <p className="text-sm">{sch.roomCode}</p>
                        <p className="text-sm">{sch.instructorName}</p>
                        <div className="flex gap-1 mt-1 justify-center">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(sch)}
                              className="text-blue-500 text-xs"
                            >
                              تعديل
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(sch.id)}
                              className="text-red-500 text-xs"
                            >
                              حذف
                            </button>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
