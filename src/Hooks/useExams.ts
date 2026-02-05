import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";

/* =======================
   Types
======================= */
export interface ExamDto {
  id: number;
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

  // جلب امتحانات الطالب
  const studentExamsQuery = useQuery({
    queryKey: ["student-exams"],
    queryFn: async () => (await api.get(Urls.EXAMS.STUDENT)).data as ExamDto[],
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
  };
};

export default useExams;
