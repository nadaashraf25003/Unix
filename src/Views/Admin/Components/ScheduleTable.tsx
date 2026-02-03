import { useState } from "react";
import useSchedules from "@/Hooks/useSchedules";
import { DAYS } from "@/utils/Helpers";
import ScheduleFormModal from "./ScheduleFormModal";

interface ScheduleTableProps {
  sectionId: number;
}

const ScheduleTable = ({ sectionId }: ScheduleTableProps) => {
  const { sectionScheduleQuery, deleteScheduleMutation } = useSchedules();
  const { data, isLoading, isError, refetch } = sectionScheduleQuery(sectionId);

  const [selected, setSelected] = useState<any>(null);

  return (
    <div style={{ position: "relative" }}>
      {/* زرار Add يظهر دائمًا */}
      <button
        onClick={() =>
          setSelected({
            courseId: "",
            instructorId: "",
            roomId: "",
            dayOfWeek: 0,
            startTime: "",
            endTime: "",
          })
        }
        style={{ marginBottom: 10, zIndex: 10, position: "relative" }}
      >
        + Add Schedule
      </button>

      {isLoading && <p>Loading schedules...</p>}
      {isError && <p>Failed to load schedules</p>}
      {!isLoading && data?.length === 0 && <p>No schedules available</p>}

      {!isLoading && !isError && data && data.length > 0 && (
        <table border={1} cellPadding={5} cellSpacing={0} width="100%">
          <thead>
            <tr>
              <th>Course</th>
              <th>Instructor</th>
              <th>Room</th>
              <th>Day</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.courseName}</td>
                <td>{row.instructorName}</td>
                <td>{row.roomCode}</td>
                <td>{DAYS[row.dayOfWeek]}</td>
                <td>
                  {row.startTime} - {row.endTime}
                </td>
                <td>
                  <button onClick={() => setSelected(row)}>Edit</button>
                  <button
                    onClick={() => {
                      if (confirm("Delete schedule?")) {
                        deleteScheduleMutation.mutate(row.id, {
                          onSuccess: () => refetch(),
                        });
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {selected && (
        <ScheduleFormModal
          sectionId={sectionId}
          initialData={selected}
          onClose={() => {
            setSelected(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default ScheduleTable;
