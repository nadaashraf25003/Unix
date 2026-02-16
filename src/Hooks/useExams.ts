import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";

/* =======================
   Types
======================= */
export interface ExamDto {
  id: number;
  sectionId: number;
  courseName: string;
  sectionName: string;
  instructorName: string;
  roomCode: string;
  stage: number;
  examType: string;
  examDate: string; // ISO string
  startTime: string;
  endTime: string;
}

export interface CreateExamDto {
  courseId: number;
  sectionId: number;
  roomId: number;
  instructorId: number;
  stage: number;
  examType: string;
  examDate: string; // ISO string
  startTime: string;
  endTime: string;
}

/* =======================
   Hook
======================= */
const useExams = () => {
  const queryClient = useQueryClient();
const adminExamsQuery = useQuery({
  queryKey: ["admin-exams"],
  queryFn: async () => {
    const { data } = await api.get(Urls.EXAMS.CREATE); 

    return data.map((exam: any) => ({
      id: exam.id,
      courseName: exam.courseName,   // ✅ مباشر
      sectionName: exam.sectionId?.toString() || "", // لو معندكش اسم القسم
      instructorName: exam.instructorName,
      roomCode: exam.roomCode,
      stage: exam.stage,
      examType: exam.examType,
      examDate: exam.examDate,
      startTime: exam.startTime,
      endTime: exam.endTime,
    })) as ExamDto[];
  },
});

  // جلب امتحانات الطالب
 const studentExamsQuery = useQuery({
  queryKey: ["student-exams"],
  queryFn: async () => {
    const { data } = await api.get(Urls.EXAMS.STUDENT);

    // map البيانات لتطابق ExamDto
    return data.map((exam: any) => ({
      id: exam.id,
      courseName: exam.course?.name || "",
      sectionName: exam.section?.name || "",
      instructorName: exam.instructor?.fullName || "",
      roomCode: exam.room?.code || "",
      stage: exam.stage,
      examType: exam.examType,
      examDate: exam.examDate,
      startTime: exam.startTime,
      endTime: exam.endTime,
    })) as ExamDto[];
  },
});

  // إنشاء امتحان جديد
  const createExamMutation = useMutation({
    mutationFn: async (data: CreateExamDto) => (await api.post(Urls.EXAMS.CREATE, data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["student-exams"] }),
  });

  // تحديث امتحان موجود
  const updateExamMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CreateExamDto }) =>
      (await api.put(`${Urls.EXAMS.UPDATE}/${id}`, data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["student-exams"] }),
  });

  // حذف امتحان
  const deleteExamMutation = useMutation({
    mutationFn: async (id: number) => (await api.delete(`${Urls.EXAMS.DELETE}/${id}`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["student-exams"] }),
  });

  return {
    studentExamsQuery,
    createExamMutation,
    updateExamMutation,
    deleteExamMutation,
    adminExamsQuery,
  };
};

export default useExams;
