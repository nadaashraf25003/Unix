import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

export interface ProjectStudentDto {
  id: number;
  projectId: number;
  name: string;
  email: string;
  studentId: string;
}

export interface CreateProjectDto {
  title: string;
  description: string;
  supervisor: string;
  startDate: string;
  repositoryLink: string;
  students: ProjectStudentDto[];
}

export interface GraduationProjectDto {
  id: number;
  title: string;
  description: string;
  supervisor: string;
  startDate: string;
  endDate: string | null;
  status: string;
  repositoryLink: string;
  students: ProjectStudentDto[];
  memberCount: number;
}

/* ================= HOOK ================= */

const useAdminProjects = () => {
  const queryClient = useQueryClient();

  /* ===== GET ALL PROJECTS (ADMIN) ===== */
    const projectsQuery = useQuery<GraduationProjectDto[]>({
    queryKey: ["admin-projects"],
    queryFn: async () => (await api.get(Urls.PROJECTS.GET_ALL)).data,
  });


  /* ===== CREATE ===== */
  const createProjectMutation = useMutation<
    any,
    Error,
    CreateProjectDto
  >({
    mutationFn: async (dto) =>
      (await api.post(Urls.PROJECTS.CREATE, dto)).data,
    onSuccess: () => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
  });

  /* ===== UPDATE ===== */
  const updateProjectMutation = useMutation<
    any,
    Error,
    { id: number; dto: CreateProjectDto }
  >({
    mutationFn: async ({ id, dto }) =>
      (await api.put(`projects/${id}`, dto)).data,
    onSuccess: () => {
      toast.success("Project updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
  });

  /* ===== DELETE ===== */
  const deleteProjectMutation = useMutation<
    any,
    Error,
    number
  >({
    mutationFn: async (id) =>
      (await api.delete(`projects/${id}`)).data,
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
  });

  return {
    projectsQuery,
    createProjectMutation,
    updateProjectMutation,
    deleteProjectMutation,
  };
};

export default useAdminProjects;
