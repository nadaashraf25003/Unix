import { useState } from "react";
import useSchedules from "@/Hooks/useSchedules";
import { DAYS } from "@/utils/Helpers";

const ScheduleFormModal = ({ sectionId, initialData, onClose }) => {
  const isEdit = !!initialData.id;

  const [form, setForm] = useState({
    courseId: initialData.courseId || "",
    instructorId: initialData.instructorId || "",
    roomId: initialData.roomId || "",
    dayOfWeek: initialData.dayOfWeek || 0,
    startTime: initialData.startTime || "",
    endTime: initialData.endTime || "",
  });

  const {
    createScheduleMutation,
    updateScheduleMutation,
  } = useSchedules();

  const handleSubmit = () => {
    const payload = { ...form, sectionId };

    const mutation = isEdit ? updateScheduleMutation : createScheduleMutation;
    const variables = isEdit ? { id: initialData.id, data: payload } : payload;

    mutation.mutate(variables, {
      onSuccess: () => onClose(),
      onError: () => alert("Failed to save schedule"),
    });
  };

  return (
    <div className="modal">
      <h3>{isEdit ? "Edit" : "Add"} Schedule</h3>

      <input
        placeholder="Course ID"
        type="number"
        value={form.courseId}
        onChange={(e) => setForm({ ...form, courseId: Number(e.target.value) })}
      />

      <input
        placeholder="Instructor ID"
        type="number"
        value={form.instructorId}
        onChange={(e) => setForm({ ...form, instructorId: Number(e.target.value) })}
      />

      <input
        placeholder="Room ID"
        type="number"
        value={form.roomId}
        onChange={(e) => setForm({ ...form, roomId: Number(e.target.value) })}
      />

      <select
        value={form.dayOfWeek}
        onChange={(e) => setForm({ ...form, dayOfWeek: Number(e.target.value) })}
      >
        {DAYS.map((d, idx) => (
          <option key={idx} value={idx}>
            {d}
          </option>
        ))}
      </select>

      <input
        placeholder="Start Time"
        type="time"
        value={form.startTime}
        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
      />

      <input
        placeholder="End Time"
        type="time"
        value={form.endTime}
        onChange={(e) => setForm({ ...form, endTime: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        disabled={createScheduleMutation.isLoading || updateScheduleMutation.isLoading}
      >
        Save
      </button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default ScheduleFormModal;
