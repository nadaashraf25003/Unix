import React, { useState } from "react";
import useDepartments from "@/Hooks/useDepartments";
import useSections from "@/Hooks/useSections";
import useSchedules from "@/Hooks/useSchedules";
import { 
  Calendar, 
  Clock, 
  Building2, 
  Users,
  BookOpen,
  User,
  MapPin,
  ChevronDown,
  Filter,
  Loader2,
  AlertCircle,
  CalendarDays,
  Hash,
  Bell
} from "lucide-react";

const Schedule = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table" or "calendar"

  const { departmentsQuery } = useDepartments();
  const { sectionsQuery } = useSections();
  const { sectionScheduleQuery } = useSchedules();

  // Filter sections by selected department
  const sections = sectionsQuery.data?.filter(
    (s) => s.departmentId === selectedDepartment
  ) || [];

  // Fetch schedules for selected section
  const schedulesQuery = sectionScheduleQuery(selectedSection || 0);

  // Group schedules by day
  const groupedSchedules = schedulesQuery.data?.reduce((acc, schedule) => {
    const day = schedule.dayOfWeek;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(schedule);
    return acc;
  }, {}) || {};

  // Days of week for consistent ordering
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Get active schedules count
  const activeSchedules = schedulesQuery.data?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-dark-bg dark:to-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* <div className="bg-gradient-to-r from-primary to-secondary dark:from-dark-primary dark:to-dark-secondary p-3 rounded-2xl shadow-lg">
                <Calendar className="text-white w-6 h-6 md:w-8 md:h-8" />
              </div> */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Academic Schedule
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  View and manage course schedules for different sections
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-gray-700">
                <Clock className="w-4 h-4 text-primary dark:text-dark-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <button className="p-2 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Departments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {departmentsQuery.data?.length || 0}
                  </p>
                </div>
                <Building2 className="w-8 h-8 text-primary/20 dark:text-dark-primary/20" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sections</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {sectionsQuery.data?.length || 0}
                  </p>
                </div>
                <Users className="w-8 h-8 text-info/20 dark:text-dark-info/20" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Schedules</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeSchedules}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-success/20 dark:text-dark-success/20" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Selected Section</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {selectedSection ? sections.find(s => s.id === selectedSection)?.name : "None"}
                  </p>
                </div>
                <Hash className="w-8 h-8 text-warning/20 dark:text-dark-warning/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Filters Panel */}
          <div className="lg:col-span-3">
            <div className="card sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-primary dark:text-dark-primary" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Schedule Filters
                </h2>
              </div>

              <div className="space-y-6">
                {/* Department Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Select Department
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDepartment || ""}
                      onChange={(e) => {
                        setSelectedDepartment(Number(e.target.value));
                        setSelectedSection(null);
                      }}
                      className="input appearance-none pr-10 cursor-pointer"
                    >
                      <option value="">Choose a department</option>
                      {departmentsQuery.data?.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {departmentsQuery.isLoading && (
                    <div className="flex items-center gap-2 mt-2">
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                      <span className="text-xs text-gray-500">Loading departments...</span>
                    </div>
                  )}
                </div>

                {/* Section Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Select Section
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSection || ""}
                      onChange={(e) => setSelectedSection(Number(e.target.value))}
                      disabled={!selectedDepartment}
                      className="input appearance-none pr-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Choose a section</option>
                      {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                          {section.code && ` (${section.code})`}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {!selectedDepartment && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Please select a department first
                    </p>
                  )}
                  {selectedDepartment && sectionsQuery.isLoading && (
                    <div className="flex items-center gap-2 mt-2">
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                      <span className="text-xs text-gray-500">Loading sections...</span>
                    </div>
                  )}
                </div>

                {/* View Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    View Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                        viewMode === "table"
                          ? "bg-primary dark:bg-dark-primary text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      Table View
                    </button>
                    <button
                      onClick={() => setViewMode("calendar")}
                      className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                        viewMode === "calendar"
                          ? "bg-primary dark:bg-dark-primary text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      Calendar View
                    </button>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    setSelectedDepartment(null);
                    setSelectedSection(null);
                  }}
                  className="w-full py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  Clear Filters
                </button>
              </div>

              {/* Info Panel */}
              {selectedSection && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Schedule Info
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        {activeSchedules} scheduled class{activeSchedules !== 1 ? 'es' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        {Object.keys(groupedSchedules).length} day{Object.keys(groupedSchedules).length !== 1 ? 's' : ''} per week
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Last updated: Today
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Schedule Display */}
          <div className="lg:col-span-9">
            {!selectedSection ? (
              <div className="card text-center py-12">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center mb-6">
                  <Calendar className="text-gray-400 w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No Section Selected
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Select a department and section from the filters to view the schedule
                </p>
              </div>
            ) : schedulesQuery.isLoading ? (
              <div className="card text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 animate-spin text-primary dark:text-dark-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Loading Schedule
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Fetching schedule data...
                    </p>
                  </div>
                </div>
              </div>
            ) : schedulesQuery.isError ? (
              <div className="card text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Error Loading Schedule
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Please try again later
                    </p>
                  </div>
                </div>
              </div>
            ) : activeSchedules === 0 ? (
              <div className="card text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <Calendar className="w-12 h-12 text-gray-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      No Schedules Found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      No schedules have been assigned to this section yet
                    </p>
                  </div>
                </div>
              </div>
            ) : viewMode === "table" ? (
              <div className="space-y-6">
                {/* Schedule Table */}
                <div className="card overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Section Schedule
                      </h2>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {activeSchedules} class{activeSchedules !== 1 ? 'es' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              Course
                            </div>
                          </th>
                          <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              Instructor
                            </div>
                          </th>
                          <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              Room
                            </div>
                          </th>
                          <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              Day
                            </div>
                          </th>
                          <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Time
                            </div>
                          </th>
                          <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Type
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {schedulesQuery.data?.map((schedule) => (
                          <tr 
                            key={schedule.id} 
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-dark-primary/10 flex items-center justify-center">
                                  <BookOpen className="w-4 h-4 text-primary dark:text-dark-primary" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {schedule.courseName}
                                  </div>
                                  {schedule.courseCode && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {schedule.courseCode}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-info/10 dark:bg-dark-info/10 flex items-center justify-center">
                                  <User className="w-3 h-3 text-info dark:text-dark-info" />
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">
                                  {schedule.instructorName}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-success/10 dark:bg-dark-success/10 flex items-center justify-center">
                                  <MapPin className="w-3 h-3 text-success dark:text-dark-success" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {schedule.roomCode}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                schedule.dayOfWeek === "Monday" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300" :
                                schedule.dayOfWeek === "Tuesday" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" :
                                schedule.dayOfWeek === "Wednesday" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300" :
                                schedule.dayOfWeek === "Thursday" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300" :
                                schedule.dayOfWeek === "Friday" ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300" :
                                "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                              }`}>
                                {schedule.dayOfWeek}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="font-mono text-sm text-gray-900 dark:text-white">
                                  {schedule.startTime} - {schedule.endTime}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                schedule.scheduleType === "Lecture" 
                                  ? "bg-primary/10 dark:bg-dark-primary/10 text-primary dark:text-dark-primary"
                                  : schedule.scheduleType === "Lab"
                                  ? "bg-success/10 dark:bg-dark-success/10 text-success dark:text-dark-success"
                                  : "bg-warning/10 dark:bg-dark-warning/10 text-warning dark:text-dark-warning"
                              }`}>
                                {schedule.scheduleType}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Weekly View */}
                <div className="card">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                    Weekly Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="border border-gray-200 dark:border-gray-700 rounded-xl p-3">
                        <div className={`text-center mb-3 py-1 rounded-lg ${
                          day === "Monday" ? "bg-blue-50 dark:bg-blue-900/20" :
                          day === "Tuesday" ? "bg-green-50 dark:bg-green-900/20" :
                          day === "Wednesday" ? "bg-amber-50 dark:bg-amber-900/20" :
                          day === "Thursday" ? "bg-purple-50 dark:bg-purple-900/20" :
                          day === "Friday" ? "bg-red-50 dark:bg-red-900/20" :
                          "bg-gray-100 dark:bg-gray-800"
                        }`}>
                          <span className="text-sm font-medium">{day}</span>
                        </div>
                        <div className="space-y-2">
                          {groupedSchedules[day]?.map((schedule) => (
                            <div 
                              key={schedule.id} 
                              className="text-xs p-2 rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700"
                            >
                              <div className="font-medium truncate">{schedule.courseName}</div>
                              <div className="text-gray-500 dark:text-gray-400">
                                {schedule.startTime}-{schedule.endTime.split(':')[0]}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                <span>{schedule.roomCode}</span>
                              </div>
                            </div>
                          ))}
                          {(!groupedSchedules[day] || groupedSchedules[day].length === 0) && (
                            <div className="text-center py-3 text-gray-400 dark:text-gray-500 text-sm">
                              No classes
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Calendar View */
              <div className="card">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Calendar View
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Visual overview of the weekly schedule
                  </p>
                </div>
                <div className="p-6">
                  <div className="text-center text-gray-400 dark:text-gray-500 py-12">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Calendar View Coming Soon</h3>
                    <p>Interactive calendar view is under development</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;