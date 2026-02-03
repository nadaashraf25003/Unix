import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";

/* =======================
   Hook
======================= */

const useExams = () => {
  const studentExamsQuery = useQuery({
    queryKey: ["student-exams"],
    queryFn: async () =>
      (await api.get(Urls.EXAMS.STUDENT)).data,
  });

  const createExamMutation = useMutation({
    mutationFn: async (data: any) =>
      (await api.post(Urls.EXAMS.CREATE, data)).data,
  });

  const updateExamMutation = useMutation({
    mutationFn: async ({ id, data }: any) =>
      (await api.put(`${Urls.EXAMS.UPDATE}/${id}`, data)).data,
  });

  const deleteExamMutation = useMutation({
    mutationFn: async (id: number) =>
      (await api.delete(`${Urls.EXAMS.DELETE}/${id}`)).data,
  });

  return {
    studentExamsQuery,
    createExamMutation,
    updateExamMutation,
    deleteExamMutation,
  };
};

export default useExams;
