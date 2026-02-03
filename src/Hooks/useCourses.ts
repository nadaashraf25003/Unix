/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";
import toast from "react-hot-toast";

/* =======================
   Types
======================= */

export interface CourseDto {
  id: number;
  courseName: string;
  courseCode: string;
}

export interface CreateCourseDto {
  courseName: string;
  courseCode: string;
}

/* =======================
   Hook
======================= */

const useCourses = () => {
  const queryClient = useQueryClient();

  // Get all courses
  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await api.get(Urls.COURSES.GET_ALL);
      return res.data as CourseDto[];
    },
  });

  // Create course
  const createCourseMutation = useMutation({
    mutationFn: async (data: CreateCourseDto) => {
      const res = await api.post(Urls.COURSES.CREATE, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Course created successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  // Update course
  const updateCourseMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: CreateCourseDto;
    }) => {
      const res = await api.put(`${Urls.COURSES.UPDATE}/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Course updated successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  // Delete course
  const deleteCourseMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`${Urls.COURSES.DELETE}/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Course deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  return {
    coursesQuery,
    createCourseMutation,
    updateCourseMutation,
    deleteCourseMutation,
  };
};

export default useCourses;
