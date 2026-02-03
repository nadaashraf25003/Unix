import { useState } from "react";
import useExams from "@/Hooks/useExams";
import ExamFormModal from "./ExamFormModal";

interface ExamsTableProps {
  sectionId: number;
}

const ExamsTable = ({ sectionId }: ExamsTableProps) => {
  const { studentExamsQuery, deleteExamMutation } = useExams();
  const { data, isLoading, isError, refetch } = studentExamsQuery;

  const [selected, setSelected] = useState<any>(null);

  return (
    <div style={{ position: "relative" }}>
      {/* زرار Add يظهر دائمًا */}
      <button
        onClick={() =>
          setSelected({
            courseId: "",
            roomId: "",
            date: "",
            startTime: "",
            endTime: "",
          })
        }
        style={{ marginBottom: 10, zIndex: 10, position: "relative" }}
      >
        + Add Exam
      </button>

      {isLoading && <p>Loading exams...</p>}
      {isError && <p>Failed to load exams</p>}
      {!isLoading && data?.length === 0 && <p>No exams available</p>}

      {!isLoading && !isError && data?.length > 0 && (
        <table border={1} cellPadding={5} cellSpacing={0} width="100%">
          <thead>
            <tr>
              <th>Course</th>
              <th>Date</th>
              <th>Time</th>
              <th>Room</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.courseName}</td>
                <td>{exam.date}</td>
                <td>{exam.startTime} - {exam.endTime}</td>
                <td>{exam.roomCode}</td>
                <td>
                  <button onClick={() => setSelected(exam)}>Edit</button>
                  <button
                    onClick={() => {
                      if (confirm("Delete exam?")) {
                        deleteExamMutation.mutate(exam.id, {
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
        <ExamFormModal
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

export default ExamsTable;
