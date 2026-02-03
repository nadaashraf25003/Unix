import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";

/* =======================
   Types
======================= */

export interface SectionDto {
  id: number;
  departmentId: number;
  stage: number;
  name: string;
}

export interface CreateSectionDto {
  departmentId: number;
  stage: number;
  name: string;
}

/* =======================
   Hook
======================= */

const useSections = () => {
  const queryClient = useQueryClient();

  const sectionsQuery = useQuery({
    queryKey: ["sections"],
    queryFn: async () =>
      (await api.get(Urls.SECTIONS.GET_ALL)).data as SectionDto[],
  });

  const sectionsByDepartment = (departmentId: number) =>
    useQuery({
      queryKey: ["sections", departmentId],
      queryFn: async () =>
        (await api.get(`${Urls.SECTIONS.GET_BY_DEPARTMENT}/${departmentId}`))
          .data as SectionDto[],
      enabled: !!departmentId,
    });

  const createSectionMutation = useMutation({
    mutationFn: async (data: CreateSectionDto) =>
      (await api.post(Urls.SECTIONS.CREATE, data)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["sections"] }),
  });

  const updateSectionMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: CreateSectionDto;
    }) => (await api.put(`${Urls.SECTIONS.UPDATE}/${id}`, data)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["sections"] }),
  });

  const deleteSectionMutation = useMutation({
    mutationFn: async (id: number) =>
      (await api.delete(`${Urls.SECTIONS.DELETE}/${id}`)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["sections"] }),
  });

  return {
    sectionsQuery,
    sectionsByDepartment,
    createSectionMutation,
    updateSectionMutation,
    deleteSectionMutation,
  };
};

export default useSections;
