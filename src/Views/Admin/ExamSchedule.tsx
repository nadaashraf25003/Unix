import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useExams, { CreateExamDto, ExamDto } from "@/Hooks/useExams";
import useCourses from "@/Hooks/useCourses";
import useSections from "@/Hooks/useSections";
import useRooms from "@/Hooks/useRooms";
import useInstructors from "@/Hooks/useInstructor";
import toast from "react-hot-toast";
import ExamsPage from "../ExamTable";
 

const AdminExamsPage = () => {
  const { adminExamsQuery, createExamMutation, updateExamMutation } = useExams();
  const { coursesQuery } = useCourses();
  const { sectionsQuery } = useSections();
  const { roomsQuery } = useRooms();
  const { instructorsQuery } = useInstructors();
console.log("Admin Exams:", adminExamsQuery.data);
  const [editingExam, setEditingExam] = useState<ExamDto | null>(null);

  const { register, handleSubmit, reset, watch } = useForm<CreateExamDto>();
  const selectedSectionId = watch("sectionId");
  const selectedSection = sectionsQuery.data?.find(
    (s) => s.id === Number(selectedSectionId)
  );

  const onSubmit = (data: CreateExamDto) => {
    const payload = { ...data, stage: selectedSection?.stage || 0 };

    if (editingExam) {
      updateExamMutation.mutate(
        { id: editingExam.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Exam updated");
            reset();
            setEditingExam(null);
          },
        }
      );
    } else {
      createExamMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Exam created successfully");
           

          reset();
        },
      });
    }
  };

  if (
  adminExamsQuery.isLoading ||
    coursesQuery.isLoading ||
    sectionsQuery.isLoading ||
    roomsQuery.isLoading ||
    instructorsQuery.isLoading
  ) {
    return <p>Loading data...</p>;
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-primary dark:text-dark-primary">
        Exams Management
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-dark-card shadow-card dark:shadow-card-dark rounded-2xl p-6 grid md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block mb-1 font-medium">Course</label>
          <select {...register("courseId", { required: true })} className="w-full p-2 rounded-xl border">
            <option value="">Select Course</option>
            {coursesQuery.data?.map((c) => (
              <option key={c.id} value={c.id}>{c.courseName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Section</label>
          <select {...register("sectionId", { required: true })} className="w-full p-2 rounded-xl border">
            <option value="">Select Section</option>
            {sectionsQuery.data?.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Room</label>
          <select {...register("roomId", { required: true })} className="w-full p-2 rounded-xl border">
            <option value="">Select Room</option>
            {roomsQuery.data?.map((r) => (
              <option key={r.id} value={r.id}>{r.roomCode}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Instructor</label>
          <select {...register("instructorId", { required: true })} className="w-full p-2 rounded-xl border">
            <option value="">Select Instructor</option>
            {instructorsQuery.data?.map((i) => (
              <option key={i.id} value={i.id}>{i.fullName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Exam Date</label>
          <input type="date" {...register("examDate", { required: true })} className="w-full p-2 rounded-xl border" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Start Time</label>
          <input type="time" {...register("startTime", { required: true })} className="w-full p-2 rounded-xl border" />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Time</label>
          <input type="time" {...register("endTime", { required: true })} className="w-full p-2 rounded-xl border" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Exam Type</label>
          <select {...register("examType", { required: true })} className="w-full p-2 rounded-xl border">
            <option value="">Select Type</option>
            <option value="Exam">Exam</option>
            <option value="Quiz">Quiz</option>
            <option value="Practical">Practical</option>
          </select>
        </div>

        <button className="md:col-span-2 bg-primary hover:bg-secondary text-white py-3 rounded-2xl font-semibold transition">
          {editingExam ? "Update Exam" : "Add Exam"}
        </button>
      </form>

      {/* TABLE */}
      <ExamsPage
        exams={adminExamsQuery.data || [] }
        sections={sectionsQuery.data || []}
      />
    </div>
  );
};

export default AdminExamsPage;
 