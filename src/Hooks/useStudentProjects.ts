import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";
import toast from "react-hot-toast";

export interface GraduationProjectDto {
  id: number;
  title: string;
  memberCount: number;
}

const useStudentProjects = () => {
  const queryClient = useQueryClient();

  /* ===== ALL PROJECTS ===== */
  const projectsQuery = useQuery<GraduationProjectDto[]>({
    queryKey: ["projects"],
    queryFn: async () =>
      (await api.get(Urls.PROJECTS.GET_ALL)).data,
  });

  /* ===== MY PROJECTS (Student only) ===== */
  const myProjectsQuery = useQuery<GraduationProjectDto[]>({
    queryKey: ["my-projects"],
    queryFn: async () =>
      (await api.get(Urls.PROJECTS.MY_PROJECTS)).data,
  });

  /* ===== JOIN PROJECT ===== */
  const joinProjectMutation = useMutation<
    any,
    Error,
    number
  >({
    mutationFn: async (projectId) =>
      (await api.post(Urls.PROJECTS.JOIN(projectId))).data,
    onSuccess: () => {
      toast.success("Joined project successfully");
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
    },
  });

  return {
    projectsQuery,
    myProjectsQuery,
    joinProjectMutation,
  };
};

export default useStudentProjects;
