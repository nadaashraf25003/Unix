import React, { useMemo } from "react";

interface ExamsPageProps {
  exams: any[];
  sections: any[];
  filters?: {
    courseName: string;
    sectionName: string;
    instructorName: string;
    examType: string;
    stage: string;
  };
}

const ExamsPage: React.FC<ExamsPageProps> = ({ 
  exams, 
  sections, 
  filters = {
    courseName: "",
    sectionName: "",
    instructorName: "",
    examType: "",
    stage: ""
  } 
}) => {
  
  // Create a map of sectionId to sectionName for quick lookup
  const sectionMap = useMemo(() => {
    const map = new Map();
    sections.forEach(section => {
      map.set(section.id, section.name);
    });
    return map;
  }, [sections]);

  // Apply filters to exams
  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      // Get section name from the map
      const sectionName = sectionMap.get(exam.sectionId) || "";
      
      // Course filter
      if (filters.courseName && !exam.courseName?.toLowerCase().includes(filters.courseName.toLowerCase())) {
        return false;
      }
      
      // Section filter - use section name from map
      if (filters.sectionName && !sectionName.toLowerCase().includes(filters.sectionName.toLowerCase())) {
        return false;
      }
      
      // Instructor filter
      if (filters.instructorName && !exam.instructorName?.toLowerCase().includes(filters.instructorName.toLowerCase())) {
        return false;
      }
      
      // Exam type filter
      if (filters.examType && exam.examType !== filters.examType) {
        return false;
      }
      
      // Stage filter
      if (filters.stage && exam.stage !== Number(filters.stage)) {
        return false;
      }
      
      return true;
    });
  }, [exams, filters, sectionMap]);

  // Format time function
  const formatTime = (time: string) => {
    return time.substring(0, 5); // Show only HH:MM
  };

  return (
    <div className="bg-white dark:bg-dark-card shadow-card dark:shadow-card-dark rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Exams List</h2>
        <p className="text-sm text-gray-500">
          Showing {filteredExams.length} of {exams.length} exams
        </p>
      </div>
      
      {filteredExams.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No exams found matching the filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Course</th>
                <th className="text-left py-3 px-4">Section</th>
                <th className="text-left py-3 px-4">Instructor</th>
                <th className="text-left py-3 px-4">Room</th>
                <th className="text-left py-3 px-4">Stage</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map((exam) => {
                const sectionName = sectionMap.get(exam.sectionId) || `Section ${exam.sectionId}`;
                
                return (
                  <tr key={exam.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{exam.courseName}</td>
                    <td className="py-3 px-4">{sectionName}</td>
                    <td className="py-3 px-4">{exam.instructorName}</td>
                    <td className="py-3 px-4">{exam.roomCode}</td>
                    <td className="py-3 px-4">{exam.stage}</td>
                    <td className="py-3 px-4">{exam.examType}</td>
                    <td className="py-3 px-4">{new Date(exam.examDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{formatTime(exam.startTime)} - {formatTime(exam.endTime)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExamsPage;