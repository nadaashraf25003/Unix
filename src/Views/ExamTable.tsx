import React, { useState } from "react";
import { ExamDto } from "@/Hooks/useExams";
interface ExamsPageProps {
  exams: ExamDto[];
  sections: { id: number; name: string }[];
  onEdit?: (exam: ExamDto) => void;
  onDelete?: (id: number) => void;
}

const ExamsPage: React.FC<ExamsPageProps> = ({ exams = [], sections = [] }) => {
  const [sectionFilter, setSectionFilter] = useState<number | "">("");
  const [typeFilter, setTypeFilter] = useState<string>("");

 const filteredExams = exams.filter((exam) => {
  const sectionOk =
    sectionFilter === "" || sections.find(s => s.id === sectionFilter)?.name === exam.sectionName;
  const typeOk = !typeFilter || exam.examType === typeFilter;

  return sectionOk && typeOk;
});


  const safeRender = (value: any) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") return JSON.stringify(value);
    return value;
  };

  // دالة لتنسيق التاريخ
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // دالة لتنسيق الوقت
  const formatTime = (timeString: string) => {
    if (!timeString) return "-";
    return timeString.replace(/:00$/, '');
  };

  // الحصول على لون حسب نوع الامتحان
  const getExamTypeColor = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'exam': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'quiz': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'practical': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  // الحصول على أيقونة حسب نوع الامتحان
  const getExamTypeIcon = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'exam': return '📝';
      case 'quiz': return '✏️';
      case 'practical': return '🔬';
      default: return '📄';
    }
  };

  return (
    <div className="mt-6">
      {/* العنوان والعداد */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Exam Schedule</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Showing <span className="font-semibold text-primary dark:text-dark-primary">{filteredExams.length}</span> out of <span className="font-semibold">{exams.length}</span> exams
        </p>
      </div>

      {/* بطاقات الفلاتر */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card dark:shadow-card-dark p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Filter Exams</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Section
            </label>
            <div className="relative">
              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value ? Number(e.target.value) : "")}
                className="w-full p-3 pl-10 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-dark-primary/20 transition-all appearance-none"
              >
                <option value="">All Sections</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                🏫
              </div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                ▼
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Exam Type
            </label>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full p-3 pl-10 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-dark-primary/20 transition-all appearance-none"
              >
                <option value="">All Exam Types</option>
                <option value="Exam">📝 Exam</option>
                <option value="Quiz">✏️ Quiz</option>
                <option value="Practical">🔬 Practical</option>
              </select>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                📋
              </div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* أزرار إعادة الضبط */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => {
              setSectionFilter("");
              setTypeFilter("");
            }}
            className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* جدول الامتحانات */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card dark:shadow-card-dark overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Upcoming Exams</h2>
        </div>
        
        {/* للشاشات الصغيرة: عرض البطاقات */}
        <div className="md:hidden">
          {filteredExams.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No exams found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredExams.map((exam) => (
                <div key={exam.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white">{safeRender(exam.courseName)}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{safeRender(exam.sectionName)} • {safeRender(exam.instructorName)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getExamTypeColor(exam.examType)}`}>
                      {getExamTypeIcon(exam.examType)} {safeRender(exam.examType)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date & Time</p>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {formatDate(exam.examDate)}<br/>
                        {formatTime(exam.startTime)} - {formatTime(exam.endTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Room</p>
                      <p className="font-medium text-gray-800 dark:text-white text-lg">{safeRender(exam.roomCode)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* للشاشات المتوسطة والكبيرة: عرض الجدول */}
        <div className="hidden md:block overflow-x-auto">
          {filteredExams.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-6">📚</div>
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">No exams match your filters</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Try selecting a different section or exam type to see available exams.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-primary dark:bg-dark-primary">
                <tr>
                  <th className="p-4 text-left text-white font-semibold rounded-tl-2xl">Course</th>
                  <th className="p-4 text-left text-white font-semibold">Section</th>
                  <th className="p-4 text-left text-white font-semibold">Instructor</th>
                  <th className="p-4 text-left text-white font-semibold">Room</th>
                  <th className="p-4 text-left text-white font-semibold">Type</th>
                  <th className="p-4 text-left text-white font-semibold">Date</th>
                  <th className="p-4 text-left text-white font-semibold rounded-tr-2xl">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.map((exam, index) => (
                  <tr 
                    key={exam.id} 
                    className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${
                      index % 2 === 0 ? 'bg-white dark:bg-dark-card' : 'bg-gray-50/50 dark:bg-gray-900/20'
                    }`}
                  >
                    <td className="p-4">
                      <div className="font-semibold text-gray-800 dark:text-white">{safeRender(exam.courseName)}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700 dark:text-gray-300">{safeRender(exam.sectionName)}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700 dark:text-gray-300">{safeRender(exam.instructorName)}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg py-1.5 px-3 inline-block">
                        {safeRender(exam.roomCode)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getExamTypeColor(exam.examType)}`}>
                        {getExamTypeIcon(exam.examType)} {safeRender(exam.examType)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800 dark:text-white">{formatDate(exam.examDate)}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800 dark:text-white">
                        {formatTime(exam.startTime)} - {formatTime(exam.endTime)}
                      </div>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* تذييل الجدول */}
        {/* {filteredExams.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredExams.length} exam{filteredExams.length !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  ← Previous
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  Next →
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ExamsPage;