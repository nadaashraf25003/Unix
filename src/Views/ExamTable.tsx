import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useExams, { CreateExamDto, ExamDto } from "@/Hooks/useExams";
import useCourses from "@/Hooks/useCourses";
import useSections from "@/Hooks/useSections";
import useRooms from "@/Hooks/useRooms";
import useInstructors from "@/Hooks/useInstructor";
import toast from "react-hot-toast";

const ExamsPage = () => {
  const { studentExamsQuery, createExamMutation, updateExamMutation, deleteExamMutation } = useExams();
  const { coursesQuery } = useCourses();
  const { sectionsQuery } = useSections();
  const { roomsQuery } = useRooms();
  const { instructorsQuery } = useInstructors();

  const [editingExam, setEditingExam] = useState<ExamDto | null>(null);
  const [sectionFilter, setSectionFilter] = useState<number | "">("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const { register, handleSubmit, reset, watch } = useForm<CreateExamDto>();
  const selectedSectionId = watch("sectionId");
  const selectedSection = sectionsQuery.data?.find(
    (s) => s.id === Number(selectedSectionId)
  );

  const onSubmit = (data: CreateExamDto) => {
    const payload = {
      ...data,
      stage: selectedSection?.stage || 0, // مهم للـ backend
    };

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

  // الفلترة حسب القسم والـ exam type
  const filteredExams = studentExamsQuery.data?.filter((exam) => {
const sectionOk =
  sectionFilter === "" ||
  sectionsQuery.data?.find(s => s.id === Number(sectionFilter))?.name === exam.sectionName;
    const typeOk = !typeFilter || exam.examType === typeFilter;
    return sectionOk && typeOk;
  });

  const safeRender = (value: any) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return value;
  };

  return (
    <>
      {/* FILTERS حسب القسم بدل Stage */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <select
          value={sectionFilter}
          onChange={(e) =>
            setSectionFilter(e.target.value ? Number(e.target.value) : "")
          }
          className="p-2 border rounded-xl"
        >
          <option value="">All Sections</option>
          {sectionsQuery.data?.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 border rounded-xl"
        >
          <option value="">All Types</option>
          <option value="Exam">Exam</option>
          <option value="Quiz">Quiz</option>
          <option value="Practical">Practical</option>
        </select>
      </div>

      {/* TABLE */}
      <table className="w-full border rounded-xl overflow-hidden">
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-2">Course</th>
            <th>Section</th>
            <th>Instructor</th>
            <th>Room</th>
            <th>Type</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredExams?.map((exam) => (
            <tr key={exam.id} className="border-t text-center">
              <td className="p-2">{safeRender(exam.courseName)}</td>
              <td>{safeRender(exam.sectionName)}</td>
              <td>{safeRender(exam.instructorName)}</td>
              <td>{safeRender(exam.roomCode)}</td>
              <td>{safeRender(exam.examType)}</td>
              <td>{safeRender(exam.examDate)}</td>
              <td>{safeRender(exam.startTime)} - {safeRender(exam.endTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ExamsPage;
