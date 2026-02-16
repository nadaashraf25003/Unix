import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useExams, { CreateExamDto, ExamDto } from "@/Hooks/useExams";
import useCourses from "@/Hooks/useCourses";
import useSections from "@/Hooks/useSections";
import useRooms from "@/Hooks/useRooms";
import useInstructors from "@/Hooks/useInstructor";
import toast from "react-hot-toast";
import ExamsPage from "../ExamTable";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const AdminExamsPage = () => {
  const { adminExamsQuery, createExamMutation, updateExamMutation } = useExams();
  const { coursesQuery } = useCourses();
  const { sectionsQuery } = useSections();
  const { roomsQuery } = useRooms();
  const { instructorsQuery } = useInstructors();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [editingExam, setEditingExam] = useState<ExamDto | null>(null);

  const { register, handleSubmit, reset, watch } = useForm<CreateExamDto>();
  const selectedSectionId = watch("sectionId");
  const selectedSection = sectionsQuery.data?.find(
    (s) => s.id === Number(selectedSectionId)
  );

  const onSubmit = (data: CreateExamDto) => {
    const payload = { ...data, stage: selectedSection?.stage || 0 };

    if (editingExam) {
      updateExamMutation.mutate(
        { id: editingExam.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Exam updated");
            reset();
            setEditingExam(null);
          },
        }
      );
    } else {
      createExamMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Exam created successfully");
          reset();
        },
      });
    }
  };

  // Pagination logic
  const exams = adminExamsQuery.data || [];
  const totalItems = exams.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExams = exams.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  if (
    adminExamsQuery.isLoading ||
    coursesQuery.isLoading ||
    sectionsQuery.isLoading ||
    roomsQuery.isLoading ||
    instructorsQuery.isLoading
  ) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading exams data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-primary dark:text-dark-primary">
        Exams Management
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-dark-card shadow-card dark:shadow-card-dark rounded-2xl p-6 grid md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block mb-1 font-medium">Course</label>
          <select {...register("courseId", { required: true })} className="w-full p-2 rounded-xl border dark:bg-gray-800 dark:border-gray-700">
            <option value="">Select Course</option>
            {coursesQuery.data?.map((c) => (
              <option key={c.id} value={c.id}>{c.courseName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Section</label>
          <select {...register("sectionId", { required: true })} className="w-full p-2 rounded-xl border dark:bg-gray-800 dark:border-gray-700">
            <option value="">Select Section</option>
            {sectionsQuery.data?.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Room</label>
          <select {...register("roomId", { required: true })} className="w-full p-2 rounded-xl border dark:bg-gray-800 dark:border-gray-700">
            <option value="">Select Room</option>
            {roomsQuery.data?.map((r) => (
              <option key={r.id} value={r.id}>{r.roomCode}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Instructor</label>
          <select {...register("instructorId", { required: true })} className="w-full p-2 rounded-xl border dark:bg-gray-800 dark:border-gray-700">
            <option value="">Select Instructor</option>
            {instructorsQuery.data?.map((i) => (
              <option key={i.id} value={i.id}>{i.fullName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Exam Date</label>
          <input type="date" {...register("examDate", { required: true })} className="w-full p-2 rounded-xl border dark:bg-gray-800 dark:border-gray-700" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Start Time</label>
          <input type="time" {...register("startTime", { required: true })} className="w-full p-2 rounded-xl border dark:bg-gray-800 dark:border-gray-700" />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Time</label>
          <input type="time" {...register("endTime", { required: true })} className="w-full p-2 rounded-xl border dark:bg-gray-800 dark:border-gray-700" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Exam Type</label>
          <select {...register("examType", { required: true })} className="w-full p-2 rounded-xl border dark:bg-gray-800 dark:border-gray-700">
            <option value="">Select Type</option>
            <option value="Exam">Exam</option>
            <option value="Quiz">Quiz</option>
            <option value="Practical">Practical</option>
          </select>
        </div>

        <button className="md:col-span-2 bg-primary hover:bg-secondary text-white py-3 rounded-2xl font-semibold transition">
          {editingExam ? "Update Exam" : "Add Exam"}
        </button>
      </form>

      {/* TABLE SECTION WITH PAGINATION */}
      <div className="space-y-4">
        {/* Table */}
        <ExamsPage
          exams={currentExams}
          sections={sectionsQuery.data || []}
        />

        {/* Pagination Controls */}
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Show</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-2 py-1 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600 dark:text-gray-400">entries</span>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} exams
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                title="First page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Page numbers */}
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition
                        ${currentPage === pageNum 
                          ? 'bg-primary text-white' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="text-gray-400">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-8 h-8 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                title="Last page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* No exams message */}
        {totalItems === 0 && (
          <div className="text-center py-12 bg-white dark:bg-dark-card rounded-xl">
            <p className="text-gray-500 dark:text-gray-400">No exams found. Create your first exam above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminExamsPage;