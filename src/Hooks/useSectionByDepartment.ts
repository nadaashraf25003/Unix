// Hook جديد لجلب الـ sections حسب departmentId
import { useQuery } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";

export interface SectionDto {
  id: number;
  departmentId: number;
  stage: number;
  name: string;
}

const useSectionsByDepartment = (departmentId: number) => {
  return useQuery({
    queryKey: ["sections", departmentId],
    queryFn: async () =>
      (await api.get(Urls.SECTIONS.GET_BY_DEPARTMENT(departmentId))).data as SectionDto[],
    enabled: !!departmentId, // فقط لو departmentId موجود
  });
};

export default useSectionsByDepartment;
