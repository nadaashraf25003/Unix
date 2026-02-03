import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";
import toast from "react-hot-toast";

/* ================= TYPES ================= */
export interface GraduationProjectDto {
  id: number;
  projectName: string;
  memberCount: number;
}

export interface CreateProjectDto {
  projectName: string;
}

export interface ProjectMemberDto {
  studentId: number;
  studentName: string;
}

/* ================= HOOK ================= */
const useProjects = () => {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await api.get(Urls.PROJECTS.GET_ALL)).data as GraduationProjectDto[],
  });

  const myProjectsQuery = useQuery({
    queryKey: ["my-projects"],
    queryFn: async () => (await api.get(Urls.PROJECTS.MY_PROJECTS)).data as GraduationProjectDto[],
  });

  const projectMembersQuery = (projectId: number) =>
    useQuery({
      queryKey: ["project-members", projectId],
      queryFn: async () =>
        (await api.get(Urls.PROJECTS.MEMBERS(projectId))).data as ProjectMemberDto[],
      enabled: !!projectId,
    });

  const createProjectMutation = useMutation({
    mutationFn: async (dto: CreateProjectDto) =>
      (await api.post(Urls.PROJECTS.CREATE, dto)).data,
    onSuccess: () => {
      toast.success("Project created");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const joinProjectMutation = useMutation({
    mutationFn: async (projectId: number) =>
      (await api.post(Urls.PROJECTS.JOIN(projectId))).data,
    onSuccess: () => {
      toast.success("Joined project successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
    },
  });

  return {
    projectsQuery,
    myProjectsQuery,
    projectMembersQuery,
    createProjectMutation,
    joinProjectMutation,
  };
};

export default useProjects;
