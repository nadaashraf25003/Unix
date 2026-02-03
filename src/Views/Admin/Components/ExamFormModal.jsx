import { useState } from "react";
import useExams from "@/Hooks/useExams";

const ExamFormModal = ({ sectionId, initialData, onClose }) => {
  const isEdit = !!initialData.id;

  const [form, setForm] = useState({
    courseId: initialData.courseId || "",
    roomId: initialData.roomId || "",
    date: initialData.date || "",
    startTime: initialData.startTime || "",
    endTime: initialData.endTime || "",
  });

  const { createExamMutation, updateExamMutation } = useExams();

  const handleSubmit = () => {
    const payload = { ...form, sectionId };

    const mutation = isEdit ? updateExamMutation : createExamMutation;
    const variables = isEdit ? { id: initialData.id, data: payload } : payload;

    mutation.mutate(variables, {
      onSuccess: () => onClose(),
      onError: () => alert("Failed to save exam"),
    });
  };

  return (
    <div className="modal">
      <h3>{isEdit ? "Edit" : "Add"} Exam</h3>

      <input
        type="number"
        placeholder="Course ID"
        value={form.courseId}
        onChange={(e) => setForm({ ...form, courseId: Number(e.target.value) })}
      />

      <input
        type="number"
        placeholder="Room ID"
        value={form.roomId}
        onChange={(e) => setForm({ ...form, roomId: Number(e.target.value) })}
      />

      <input
        type="date"
        placeholder="Date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      <input
        type="time"
        placeholder="Start Time"
        value={form.startTime}
        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
      />

      <input
        type="time"
        placeholder="End Time"
        value={form.endTime}
        onChange={(e) => setForm({ ...form, endTime: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        disabled={createExamMutation.isLoading || updateExamMutation.isLoading}
      >
        Save
      </button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default ExamFormModal;
