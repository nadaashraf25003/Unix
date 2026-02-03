import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";

/* =======================
   Types
======================= */

export interface ScheduleDto {
  id: number;
  courseName: string;
  courseCode: string;
  instructorName: string;
  roomCode: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface CreateScheduleDto {
  courseId: number;
  sectionId: number;
  roomId: number;
  instructorId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

/* =======================
   Hook
======================= */

const useSchedules = () => {
  const queryClient = useQueryClient();

  // Student schedule
  const studentScheduleQuery = useQuery({
    queryKey: ["student-schedule"],
    queryFn: async () =>
      (await api.get(Urls.SCHEDULES.STUDENT)).data as ScheduleDto[],
  });

  // Section schedule (Admin)
  const sectionScheduleQuery = (sectionId: number) =>
    useQuery({
      queryKey: ["section-schedule", sectionId],
      queryFn: async () =>
        (await api.get(`${Urls.SCHEDULES.SECTION}/${sectionId}`))
          .data as ScheduleDto[],
      enabled: !!sectionId,
    });

  const createScheduleMutation = useMutation({
    mutationFn: async (data: CreateScheduleDto) =>
      (await api.post(Urls.SCHEDULES.CREATE, data)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["section-schedule"] }),
  });

  const updateScheduleMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: CreateScheduleDto;
    }) => (await api.put(`${Urls.SCHEDULES.UPDATE}/${id}`, data)).data,
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: number) =>
      (await api.delete(`${Urls.SCHEDULES.DELETE}/${id}`)).data,
  });

  return {
    studentScheduleQuery,
    sectionScheduleQuery,
    createScheduleMutation,
    updateScheduleMutation,
    deleteScheduleMutation,
  };
};

export default useSchedules;
