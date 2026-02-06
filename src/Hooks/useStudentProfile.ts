import { useQuery } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";

interface StudentProfileDto {
  fullName: string;
  departmentName: string;
  stage: string;
  sections: string[];      // ✅ sections are strings
  schedule: {
    courseName: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    roomName: string;
    instructorName: string;
  }[];
}

const useStudentProfile = (studentId: number) => {
  return useQuery<StudentProfileDto>({
    queryKey: ["studentProfile", studentId],
    queryFn: async () => {
      const res = await api.get<StudentProfileDto>(
        Urls.STUDENTS.PROFILE(studentId)
      );
      return res.data;
    },
    enabled: !!studentId,
  });
};

export default useStudentProfile;
