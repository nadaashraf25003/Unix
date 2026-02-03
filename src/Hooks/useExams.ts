import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";

export interface ExamDto {
  id: number;
  courseName: string;
  date: string;
  startTime: string;
  endTime: string;
  roomCode: string;
}

export interface CreateExamDto {
  courseId: number;
  sectionId: number;
  date: string;
  startTime: string;
  endTime: string;
  roomId: number;
}

const useExams = () => {
  const queryClient = useQueryClient();

  const studentExamsQuery = useQuery({
    queryKey: ["student-exams"],
    queryFn: async () => (await api.get(Urls.EXAMS.STUDENT)).data as ExamDto[],
  });

  const createExamMutation = useMutation({
    mutationFn: async (data: CreateExamDto) => (await api.post(Urls.EXAMS.CREATE, data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["student-exams"] }),
  });

  const updateExamMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CreateExamDto }) =>
      (await api.put(`${Urls.EXAMS.UPDATE}/${id}`, data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["student-exams"] }),
  });

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
