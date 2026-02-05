import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";

/* =======================
   Types
======================= */

export interface ScheduleDto {
  id: number;

  courseId: number;
  roomId: number;
  sectionId: number;
  instructorId: number;

  scheduleType: "Lecture" | "Lab" | "Section"; // أو string لو حابة
  dayOfWeek: string; 

  startTime: string;
  endTime: string;

  // دول لو الباك بيرجعهم للعرض
  courseName?: string;
  instructorName?: string;
  roomCode?: string;
}


export interface CreateScheduleDto {
  courseId: number;
  sectionId: number;
  roomId: number;
  instructorId: number;

  scheduleType: "Lecture" | "Lab" | "Section"; // <-- جديد
  dayOfWeek: string; // <-- string

  startTime: string;
  endTime: string;
}


/* =======================
   Hook
 
/* =======================
   Types
======================= */

export interface ScheduleDto {
  id: number;
  courseId: number;
  roomId: number;
  sectionId: number;
  instructorId: number;

  scheduleType: "Lecture" | "Lab" | "Section";
  dayOfWeek: string;

  startTime: string;
  endTime: string;

  courseName?: string;
  instructorName?: string;
  roomCode?: string;
}

export interface CreateScheduleDto {
  courseId: number;
  sectionId: number;
  roomId: number;
  instructorId: number;

  scheduleType: "Lecture" | "Lab" | "Section";
  dayOfWeek: string;

  startTime: string;
  endTime: string;
}

/* =======================
   Hook
======================= */

const useSchedules = () => {
  const queryClient = useQueryClient();

  const sectionScheduleQuery = (sectionId: number) =>
    useQuery({
      queryKey: ["section-schedule", sectionId],
      queryFn: async () =>
        (await api.get(Urls.SCHEDULES.SECTION(sectionId)))
          .data as ScheduleDto[],
      enabled: !!sectionId,
    });

  const createScheduleMutation = useMutation({
    mutationFn: async (data: CreateScheduleDto) =>
      (await api.post(Urls.SCHEDULES.CREATE, data)).data,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["section-schedule", variables.sectionId],
      });
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: CreateScheduleDto;
    }) =>
      (await api.put(Urls.SCHEDULES.UPDATE(id), data)).data,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["section-schedule", variables.data.sectionId],
      });
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: number) =>
      (await api.delete(Urls.SCHEDULES.DELETE(id))).data,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["section-schedule"],
      });
    },
  });

  return {
    sectionScheduleQuery,
    createScheduleMutation,
    updateScheduleMutation,
    deleteScheduleMutation,
  };
};

export default useSchedules;
