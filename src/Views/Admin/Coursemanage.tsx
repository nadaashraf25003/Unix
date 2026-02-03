import React from "react";
import useCourses, { CreateCourseDto } from "@/Hooks/useCourses";
import { useForm } from "react-hook-form";
import { PlusCircle, Trash2, BookOpen } from "lucide-react";

const CourseManage: React.FC = () => {
  const {
    coursesQuery,
    createCourseMutation,
    deleteCourseMutation,
  } = useCourses();

  const { register, handleSubmit, reset } = useForm<CreateCourseDto>({
    defaultValues: {
      courseName: "",
      courseCode: "",
    },
  });

  // state للتحكم في زر الإضافة
  const [isSaving, setIsSaving] = React.useState(false);

  // إضافة كورس
  const onAdd = async (data: CreateCourseDto) => {
    try {
      setIsSaving(true);
      await createCourseMutation.mutateAsync(data);
      reset();
    } finally {
      setIsSaving(false);
    }
  };

  // حذف كورس
  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الكورس؟")) return;
    await deleteCourseMutation.mutateAsync(id);
  };

  const courses = coursesQuery.data || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-200">
          <BookOpen className="text-white w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الكورسات</h1>
          <p className="text-gray-500">إضافة وتعديل وحذف الكورسات</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Form */}
        <form
          onSubmit={handleSubmit(onAdd)}
          className="col-span-12 lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit"
        >
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            إضافة كورس جديد
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم الكورس
              </label>
              <input
                {...register("courseName", { required: true })}
                placeholder="مثلاً: Data Structures"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                كود الكورس
              </label>
              <input
                {...register("courseCode", { required: true })}
                placeholder="مثلاً: CS201"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all disabled:bg-gray-400"
            >
              {isSaving ? "جاري الحفظ..." : "حفظ الكورس"}
            </button>
          </div>
        </form>

        {/* Courses List */}
        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coursesQuery.isLoading ? (
              <div className="col-span-2 text-center py-10">
                جاري التحميل...
              </div>
            ) : courses.length === 0 ? (
              <div className="col-span-2 text-center py-10">
                لا توجد كورسات
              </div>
            ) : (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center hover:border-emerald-200 transition-all"
                >
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {course.courseName}
                    </h3>
                    <span className="text-xs font-mono bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md">
                      {course.courseCode}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(course.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManage;
