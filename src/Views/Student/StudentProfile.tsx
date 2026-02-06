import useStudentProfile from "@/Hooks/useStudentProfile";
import { Building, GraduationCap, Users, Calendar, Clock, User } from "lucide-react";

const StudentProfile = () => {
  // ✅ get USER from localStorage
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  const { data, isLoading, isError } = useStudentProfile(userId);

  if (!userId) return <p className="p-6 text-gray-600">No student logged in</p>;
  if (isLoading) return <p className="p-6 text-gray-600">Loading student profile...</p>;
  if (isError || !data) return <p className="p-6 text-red-500">Failed to load profile</p>;

  // Safely extract sections and schedule with defaults
  const sections = data.sections || [];
  const schedule = data.schedule || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-2xl text-white shadow-2xl w-full md:w-1/3">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl font-bold">
                {data.fullName?.split(' ').map(n => n?.[0]).join('') || 'US'}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{data.fullName || 'Student Name'}</h1>
            <div className="text-sm opacity-90">Student ID: {userId}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg w-full md:w-2/3">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Academic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{data.departmentName || 'Not assigned'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Academic Stage</p>
                  <p className="font-semibold text-gray-800 dark:text-white">Stage {data.stage || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enrolled Sections</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sections.length > 0 ? (
                      sections.map((section, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                        >
                          {section || `Section ${index + 1}`}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">No sections enrolled</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Weekly Schedule
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {schedule.length} classes
          </span>
        </div>

        {schedule.length > 0 ? (
          <div className="space-y-4">
            {schedule.map((item, index) => {
              // Ensure each schedule item has the required properties
              const scheduleItem = {
                courseName: item.courseName || 'Unnamed Course',
                dayOfWeek: item.dayOfWeek || 'Unknown Day',
                startTime: item.startTime || '--:--',
                endTime: item.endTime || '--:--',
                roomName: item.roomName || 'Room N/A',
                instructorName: item.instructorName || 'Instructor N/A'
              };

              return (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow hover:border-primary/30"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-800 dark:text-white text-lg">
                          {scheduleItem.courseName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          scheduleItem.dayOfWeek === 'Monday' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                          scheduleItem.dayOfWeek === 'Tuesday' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                          scheduleItem.dayOfWeek === 'Wednesday' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          scheduleItem.dayOfWeek === 'Thursday' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                          scheduleItem.dayOfWeek === 'Friday' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {scheduleItem.dayOfWeek}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                          <Clock className="w-3 h-3" />
                          {scheduleItem.startTime} - {scheduleItem.endTime}
                        </span>
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                          <Building className="w-3 h-3" />
                          {scheduleItem.roomName}
                        </span>
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                          <User className="w-3 h-3" />
                          {scheduleItem.instructorName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-gray-400 dark:text-gray-500 text-lg font-semibold mb-2">
              No schedule available
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Your schedule will be updated soon
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="text-2xl font-bold text-primary dark:text-dark-primary mb-2">
            {sections.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Enrolled Sections</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="text-2xl font-bold text-info dark:text-dark-info mb-2">
            {schedule.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Weekly Classes</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="text-2xl font-bold text-success dark:text-dark-success mb-2">
            Stage {data.stage || 'N/A'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Academic Level</div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;