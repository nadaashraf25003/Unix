import React from "react";
import useCourses, { CreateCourseDto } from "@/Hooks/useCourses";
import { useForm } from "react-hook-form";
import { PlusCircle, Trash2, BookOpen, Loader2, Hash, Edit2, X } from "lucide-react";
import toast from "react-hot-toast";

const CourseManage: React.FC = () => {
  const {
    coursesQuery,
    createCourseMutation,
    deleteCourseMutation,
    updateCourseMutation,
  } = useCourses();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateCourseDto>({
    defaultValues: {
      courseName: "",
      courseCode: "",
    },
  });

  const [editingCourse, setEditingCourse] = React.useState<
    (CreateCourseDto & { id: number }) | null
  >(null);

  // إضافة أو تعديل كورس
  const onSubmit = async (data: CreateCourseDto) => {
    if (editingCourse) {
      try {
        await updateCourseMutation.mutateAsync({
          id: editingCourse.id,
          data,
        });
        toast.success("تم تعديل الكورس بنجاح");
        setEditingCourse(null);
        reset();
      } catch {
        toast.error("فشل تعديل الكورس");
      }
    } else {
      try {
        await createCourseMutation.mutateAsync(data);
        toast.success("تم إضافة الكورس بنجاح");
        reset();
      } catch {
        toast.error("فشل إضافة الكورس");
      }
    }
  };

  // حذف كورس
  const handleDelete = async (id: number, name: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-4 p-4">
          <span>
            هل أنت متأكد من حذف الكورس <strong>{name}</strong>؟
          </span>
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              onClick={() => toast.dismiss(t.id)}
            >
              إلغاء
            </button>
            <button
              className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
              onClick={async () => {
                try {
                  await deleteCourseMutation.mutateAsync(id);
                  toast.success("تم حذف الكورس");
                  toast.dismiss(t.id);
                } catch {
                  toast.error("فشل حذف الكورس");
                }
              }}
            >
              حذف
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const handleEdit = (course: CreateCourseDto & { id: number }) => {
    setEditingCourse(course);
    setValue("courseName", course.courseName);
    setValue("courseCode", course.courseCode);
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    reset();
  };

  const courses = coursesQuery.data || [];

  if (coursesQuery.isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 md:mb-8">
        <div className="bg-primary dark:bg-dark-primary p-3 rounded-xl md:rounded-2xl shadow-card dark:shadow-card-dark">
          <BookOpen className="text-white w-6 h-6 md:w-8 md:h-8" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-light">
            إدارة الكورسات
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-300">
            إضافة وتعديل وحذف الكورسات الدراسية
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-4 card"
        >
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-bold flex items-center gap-2 text-primary dark:text-dark-primary">
              <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
              {editingCourse ? "تعديل الكورس" : "إضافة كورس جديد"}
            </h2>
            {editingCourse && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-2 text-sm"
              >
                <X size={16} />
                إلغاء
              </button>
            )}
          </div>

          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                اسم الكورس *
              </label>
              <input
                {...register("courseName", { 
                  required: "اسم الكورس مطلوب",
                  minLength: { value: 3, message: "يجب أن يكون الاسم على الأقل 3 أحرف" }
                })}
                placeholder="مثلاً: هياكل البيانات"
                className="input text-sm md:text-base"
              />
              {errors.courseName && (
                <p className="text-red-500 text-xs mt-1">{errors.courseName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                كود الكورس *
              </label>
              <div className="relative">
                <input
                  {...register("courseCode", { 
                    required: "كود الكورس مطلوب",
                    pattern: { 
                      value: /^[A-Za-z0-9-]+$/, 
                      message: "كود غير صحيح (أرقام وحروف إنجليزية فقط)" 
                    }
                  })}
                  placeholder="مثلاً: CS201، MATH101"
                  className="input text-sm md:text-base pl-10"
                />
                <Hash className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              {errors.courseCode && (
                <p className="text-red-500 text-xs mt-1">{errors.courseCode.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={createCourseMutation.isPending || updateCourseMutation.isPending}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5"
              >
                {createCourseMutation.isPending || updateCourseMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span className="text-sm">
                      {editingCourse ? "جاري التحديث..." : "جاري الإضافة..."}
                    </span>
                  </>
                ) : (
                  <span>
                    {editingCourse ? "تحديث الكورس" : "حفظ الكورس"}
                  </span>
                )}
              </button>

              {editingCourse && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
                >
                  إلغاء التعديل
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Courses List */}
        <div className="lg:col-span-8">
          <div className="card">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-bold text-gray-800 dark:text-light">
                الكورسات ({courses.length})
              </h2>
              {courses.length > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {courses.length} كورس
                </span>
              )}
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-8 md:py-10">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="text-gray-400 w-6 h-6" />
                </div>
                <div className="text-gray-400 dark:text-gray-500 text-lg font-semibold mb-2">
                  لا توجد كورسات
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  ابدأ بإضافة كورس جديد
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="group border border-gray-200 dark:border-gray-700 rounded-xl p-3 md:p-4 hover:border-primary dark:hover:border-dark-primary transition-all duration-300 hover:shadow-card-hover"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 dark:text-light truncate text-sm md:text-base">
                          {course.courseName}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-mono bg-info/10 dark:bg-dark-info/20 text-info dark:text-dark-info px-2 py-1 rounded-md">
                            {course.courseCode}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {course.id}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 md:gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="p-1.5 md:p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all"
                          title="تعديل"
                        >
                          <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id, course.courseName)}
                          disabled={deleteCourseMutation.isPending}
                          className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                          title="حذف"
                        >
                          {deleteCourseMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          {courses.length > 0 && (
            <div className="mt-6 card">
              <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-light mb-4">
                إحصائيات الكورسات
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary dark:text-dark-primary">
                    {courses.length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    إجمالي الكورسات
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-info dark:text-dark-info">
                    {new Set(courses.map(c => c.courseCode.substring(0, 2))).size}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    تخصصات رئيسية
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-success dark:text-dark-success">
                    {courses.filter(c => /^\d+$/.test(c.courseCode.slice(-3))).length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    كورسات مرقمة
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Codes Summary */}
      {courses.length > 0 && (
        <div className="mt-6 md:mt-8 card">
          <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-light mb-4">
            كودات الكورسات
          </h3>
          <div className="flex flex-wrap gap-2">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {course.courseCode}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {course.courseName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManage;