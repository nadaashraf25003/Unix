import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useSchedules, { CreateScheduleDto } from "@/Hooks/useSchedules";
import useCourses from "@/Hooks/useCourses";
import useSections from "@/Hooks/useSections";
import useRooms from "@/Hooks/useRooms";
import useInstructors from "@/Hooks/useInstructor";
import { 
  PlusCircle, 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  User, 
  Building,
  Edit2, 
  Trash2, 
  Save, 
  X,
  Loader2,
  Search,
  Filter,
  Grid3X3,
  ChevronRight,
  CalendarDays,
  Bell,
  CheckCircle,
  Sparkles,
  GraduationCap,
  School
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const daysMap: Record<string, string> = {
  Sunday: "Sunday",
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday"
};

const scheduleTypeMap: Record<string, string> = {
  Lecture: "Lecture",
  Lab: "Lab",
  Section: "Section"
};

const ScheduleManager: React.FC = () => {
  const { coursesQuery } = useCourses();
  const { sectionsQuery } = useSections();
  const { roomsQuery } = useRooms();
  const { instructorsQuery } = useInstructors();
  const {
    createScheduleMutation,
    updateScheduleMutation,
    deleteScheduleMutation,
    sectionScheduleQuery,
  } = useSchedules();

  const [selectedSectionId, setSelectedSectionId] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDay, setFilterDay] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const scheduleQuery = sectionScheduleQuery(selectedSectionId);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<CreateScheduleDto>({
    defaultValues: {
      courseId: 0,
      sectionId: 0,
      roomId: 0,
      instructorId: 0,
      scheduleType: "Lecture",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
    },
  });

  // Filter schedules
  const filteredSchedules = scheduleQuery.data?.filter(schedule => {
    const matchesSearch = searchTerm === "" || 
      schedule.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.instructorName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDay = filterDay === "all" || schedule.dayOfWeek === filterDay;
    const matchesType = filterType === "all" || schedule.scheduleType === filterType;
    
    return matchesSearch && matchesDay && matchesType;
  });

  const onSubmit = async (data: CreateScheduleDto) => {
    if (!selectedSectionId) {
      toast.error("📝 Select a section first");
      return;
    }

    try {
      setIsSaving(true);
      data.sectionId = selectedSectionId;

      if (editingId) {
        await updateScheduleMutation.mutateAsync({ id: editingId, data });
        toast.success("✅ Schedule updated successfully");
        setEditingId(null);
      } else {
        await createScheduleMutation.mutateAsync(data);
        toast.success("✨ Schedule added successfully");
      }

      scheduleQuery.refetch();
      reset({
        courseId: 0,
        sectionId: 0,
        roomId: 0,
        instructorId: 0,
        scheduleType: "Lecture",
        dayOfWeek: "",
        startTime: "",
        endTime: "",
      });
    } catch {
      toast.error("❌ Failed to save schedule");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    if (!selectedSectionId) return;

    Swal.fire({
      title: '<div class="text-2xl font-bold text-gray-800 dark:text-white">⚠️ Confirm Deletion</div>',
      html: `
        <div>
          <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl mb-4">
            <p class="text-gray-600 dark:text-gray-300 mb-2">The following schedule will be permanently deleted:</p>
            <p class="font-bold text-lg text-gray-800 dark:text-white">
              ${scheduleQuery.data?.find(s => s.id === id)?.courseName || 'This schedule'}
            </p>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: '<span class="flex items-center gap-2"><Trash2 class="w-4 h-4" /> Confirm Delete</span>',
      cancelButtonText: '<span class="flex items-center gap-2">Cancel</span>',
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'px-6 py-3 rounded-xl font-bold',
        cancelButton: 'px-6 py-3 rounded-xl font-bold'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteScheduleMutation.mutate(id, {
          onSuccess: () => {
            toast.success("🗑️ Schedule deleted successfully");
            scheduleQuery.refetch();
          },
          onError: () => toast.error("❌ Failed to delete schedule"),
        });
      }
    });
  };

  const getScheduleTypeColor = (type: string) => {
    switch (type) {
      case "Lecture":
        return "bg-gradient-to-r from-blue-500 to-cyan-400 text-white";
      case "Lab":
        return "bg-gradient-to-r from-green-500 to-emerald-400 text-white";
      case "Section":
        return "bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-800";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-400 text-white";
    }
  };

  const getDayColor = (day: string) => {
    const colors = {
      Sunday: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
      Monday: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
      Tuesday: "bg-gradient-to-r from-green-500 to-teal-500 text-white",
      Wednesday: "bg-gradient-to-r from-purple-500 to-violet-500 text-white",
      Thursday: "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
      Friday: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white",
      Saturday: "bg-gradient-to-r from-teal-500 to-emerald-500 text-white",
    };
    return colors[day as keyof typeof colors] || "bg-gradient-to-r from-gray-500 to-gray-400 text-white";
  };

  const getSelectedSectionName = () => {
    return sectionsQuery.data?.find(s => s.id === selectedSectionId)?.name || "";
  };

  const getDayStats = () => {
    const stats: Record<string, number> = {};
    scheduleQuery.data?.forEach(schedule => {
      stats[schedule.dayOfWeek] = (stats[schedule.dayOfWeek] || 0) + 1;
    });
    return stats;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-info/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-r from-primary to-secondary p-4 rounded-2xl shadow-2xl">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Schedule Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Organize and schedule classes for different sections
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-primary dark:text-dark-primary">
                {scheduleQuery.data?.length || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Classes</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-info dark:text-dark-info">
                {coursesQuery.data?.length || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Courses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Selection Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Select Section
          </h2>
        </div>
        
        <div className="max-w-lg">
          <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Choose section to manage schedule
          </label>
          <select
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(Number(e.target.value))}
          >
            <option value={0}>Select Section...</option>
            {sectionsQuery.data?.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.name} - Stage {sec.stage}
              </option>
            ))}
          </select>
          
          {selectedSectionId > 0 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-xl border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    {getSelectedSectionName()}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Stage {sectionsQuery.data?.find(s => s.id === selectedSectionId)?.stage}
                  </p>
                </div>
                <div className="text-2xl font-bold text-primary dark:text-dark-primary">
                  {scheduleQuery.data?.length || 0}
                  <span className="text-sm font-normal text-gray-500"> classes</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Table */}
      {selectedSectionId > 0 && (
        <>
          {/* Table Header with Filters */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-info to-cyan-500 rounded-lg">
                    <CalendarDays className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Section Schedule</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getSelectedSectionName()} - {scheduleQuery.data?.length || 0} classes
                    </p>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search in schedule..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-4 pl-10 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterDay}
                      onChange={(e) => setFilterDay(e.target.value)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="all">All Days</option>
                      {Object.entries(daysMap).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="all">All Types</option>
                      <option value="Lecture">Lectures</option>
                      <option value="Lab">Labs</option>
                      <option value="Section">Sections</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule List */}
            <div className="p-6">
              {scheduleQuery.isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading schedule...</p>
                </div>
              ) : filteredSchedules?.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center mb-6">
                    <Calendar className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                    No classes found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {searchTerm || filterDay !== "all" || filterType !== "all" 
                      ? "No results found" 
                      : "Start by adding new classes"}
                  </p>
                  {searchTerm || filterDay !== "all" || filterType !== "all" && (
                    <button
                      onClick={() => { setSearchTerm(""); setFilterDay("all"); setFilterType("all"); }}
                      className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                    >
                      Show All
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSchedules?.map((sch, index) => (
                    <div
                      key={sch.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 hover:border-primary/30 animate-slideDown"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Left Side - Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl ${getScheduleTypeColor(sch.scheduleType)}`}>
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                  {sch.courseName}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDayColor(sch.dayOfWeek)}`}>
                                  {daysMap[sch.dayOfWeek] ?? sch.dayOfWeek}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-3">
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                                  <User className="w-3 h-3" />
                                  {sch.instructorName}
                                </span>
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                                  <Building className="w-3 h-3" />
                                  {sch.roomCode}
                                </span>
                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm text-white ${getScheduleTypeColor(sch.scheduleType)}`}>
                                  <Grid3X3 className="w-3 h-3" />
                                  {scheduleTypeMap[sch.scheduleType] ?? sch.scheduleType}
                                </span>
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm">
                                  <Clock className="w-3 h-3" />
                                  {sch.startTime} - {sch.endTime}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Side - Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingId(sch.id);
                              reset({
                                courseId: sch.courseId,
                                roomId: sch.roomId,
                                instructorId: sch.instructorId,
                                scheduleType: sch.scheduleType,
                                dayOfWeek: sch.dayOfWeek,
                                startTime: sch.startTime,
                                endTime: sch.endTime,
                              });
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 group"
                          >
                            <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(sch.id)}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 group"
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Total classes: {filteredSchedules?.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span>Last updated: Now</span>
                  </div>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    ✕ Clear Search
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${editingId ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' : 'bg-gradient-to-r from-primary to-secondary text-white'}`}>
                    {editingId ? <Edit2 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {editingId ? "Edit Class" : "Add New Class"}
                  </h2>
                </div>
                {editingId && (
                  <button
                    onClick={() => { reset(); setEditingId(null); }}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    ✕ Cancel Edit
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Course */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Course
                  </label>
                  <select
                    {...register("courseId", {
                      required: "Select a course",
                      valueAsNumber: true,
                    })}
                    className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border ${errors.courseId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all`}
                  >
                    <option value="">Select Course...</option>
                    {coursesQuery.data?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.courseName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Room
                  </label>
                  <select
                    {...register("roomId", {
                      required: "Select a room",
                      valueAsNumber: true,
                    })}
                    className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border ${errors.roomId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all`}
                  >
                    <option value="">Select Room...</option>
                    {roomsQuery.data?.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.roomCode}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Instructor */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Instructor
                  </label>
                  <select
                    {...register("instructorId", {
                      required: "Select an instructor",
                      valueAsNumber: true,
                    })}
                    className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border ${errors.instructorId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all`}
                  >
                    <option value="">Select Instructor...</option>
                    {instructorsQuery.data?.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Schedule Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Class Type
                  </label>
                  <select
                    {...register("scheduleType", { required: true })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab</option>
                    <option value="Section">Section</option>
                  </select>
                </div>

                {/* Day */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Day
                  </label>
                  <select 
                    {...register("dayOfWeek", { required: "Select a day" })} 
                    className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border ${errors.dayOfWeek ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all`}
                  >
                    <option value="">Select Day...</option>
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="time"
                        {...register("startTime", { required: "Select start time" })}
                        className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border ${errors.startTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all`}
                      />
                    </div>
                    <div>
                      <input
                        type="time"
                        {...register("endTime", { required: "Select end time" })}
                        className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border ${errors.endTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-secondary hover:shadow-lg'}`}
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </span>
                  ) : editingId ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Update Class
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <PlusCircle className="w-5 h-5" />
                      Add Class
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Weekly Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-7 gap-4">
            {Object.entries(daysMap).map(([day, displayDay]) => (
              <div key={day} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{displayDay}</div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {getDayStats()[day] || 0}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <Calendar className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State - No Section Selected */}
      {selectedSectionId === 0 && (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto text-center p-12">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl flex items-center justify-center mb-6">
            <GraduationCap className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            🎓 Start Managing Schedule
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Select a section from the list above to view its schedule and add new classes
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-primary">
            <School className="w-4 h-4" />
            <span>Select a section to start managing the schedule</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManager;