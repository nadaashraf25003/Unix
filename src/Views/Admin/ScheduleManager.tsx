import React from "react";
import { useForm } from "react-hook-form";
import useSchedules, { CreateScheduleDto } from "@/Hooks/useSchedules";
import useCourses from "@/Hooks/useCourses";
import useSections from "@/Hooks/useSections";
import useRooms from "@/Hooks/useRooms";
import useInstructors from "@/Hooks/useInstructor";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

const ScheduleManager: React.FC = () => {
  const { coursesQuery } = useCourses();
  const { sectionsQuery } = useSections();
  const { roomsQuery } = useRooms();
  const { instructorsQuery } = useInstructors();
  const { createScheduleMutation, updateScheduleMutation, deleteScheduleMutation, sectionScheduleQuery } = useSchedules();

  // اختيار الشعبة
  const [selectedSectionId, setSelectedSectionId] = React.useState<number>(0);

  // جلب جدول الشعبة المختارة
  const scheduleQuery = sectionScheduleQuery(selectedSectionId);

  // Form
  const { register, handleSubmit, reset } = useForm<CreateScheduleDto>({
    defaultValues: {
      courseId: 0,
      sectionId: 0,
      roomId: 0,
      instructorId: 0,
      dayOfWeek: 0,
      startTime: "",
      endTime: "",
    },
  });

  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const onSubmit = async (data: CreateScheduleDto) => {
    if (!selectedSectionId) {
      toast.error("اختر الشعبة أولًا");
      return;
    }

    try {
      setIsSaving(true);
      data.sectionId = selectedSectionId;

      if (editingId) {
        await updateScheduleMutation.mutateAsync({ id: editingId, data });
        toast.success("تم تعديل الجدول بنجاح");
        setEditingId(null);
      } else {
        await createScheduleMutation.mutateAsync(data);
        toast.success("تم إضافة الجدول بنجاح");
      }

      scheduleQuery.refetch();
      reset();
    } catch {
      toast.error("فشل حفظ الجدول");
    } finally {
      setIsSaving(false);
    }
  };

  // حذف جدول
  const handleDelete = (id: number) => {
    if (!selectedSectionId) return;

    if (window.confirm("هل أنت متأكد من حذف هذا الجدول؟ ❌")) {
      deleteScheduleMutation.mutate(id, {
        onSuccess: () => {
          toast.success("تم حذف الجدول بنجاح");
          scheduleQuery.refetch();
        },
        onError: () => toast.error("فشل حذف الجدول"),
      });
    }
  };

  return (
    <div className="p-6 bg-light dark:bg-dark min-h-screen" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-light">إدارة الجدول</h1>

      {/* اختيار الشعبة */}
      <div className="mb-6 max-w-xl">
        <label className="block mb-1 text-gray-700 dark:text-gray-300">اختر الشعبة</label>
        <select
          className="input w-full"
          value={selectedSectionId}
          onChange={(e) => setSelectedSectionId(Number(e.target.value))}
        >
          <option value={0}>اختر الشعبة</option>
          {sectionsQuery.data?.map((sec) => (
            <option key={sec.id} value={sec.id}>
              {sec.name} - Stage {sec.stage}
            </option>
          ))}
        </select>
      </div>

      {/* جدول الشعبة */}
      {selectedSectionId > 0 && (
        <div className="overflow-x-auto mb-6 max-w-full">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="border p-2">اليوم</th>
                <th className="border p-2">الكورس</th>
                <th className="border p-2">المحاضر</th>
                <th className="border p-2">الغرفة</th>
                <th className="border p-2">من</th>
                <th className="border p-2">إلى</th>
                <th className="border p-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {scheduleQuery.data?.map((sch) => (
                <tr key={sch.id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                  <td className="border p-2">
                    {["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"][sch.dayOfWeek]}
                  </td>
                  <td className="border p-2">{sch.courseName}</td>
                  <td className="border p-2">{sch.instructorName}</td>
                  <td className="border p-2">{sch.roomCode}</td>
                  <td className="border p-2">{sch.startTime}</td>
                  <td className="border p-2">{sch.endTime}</td>
                  <td className="border p-2 flex gap-2 justify-center">
                    {/* تعديل */}
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => {
                        setEditingId(sch.id);
                        reset({
                          courseId: sch.courseId,
                          roomId: sch.roomId,
                          instructorId: sch.instructorId,
                          dayOfWeek: sch.dayOfWeek,
                          startTime: sch.startTime,
                          endTime: sch.endTime,
                        });
                      }}
                    >
                      تعديل
                    </button>
                    {/* حذف */}
                    <button
                      type="button"
                      className="btn-danger btn-sm"
                      onClick={() => handleDelete(sch.id)}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
              {!scheduleQuery.data?.length && (
                <tr>
                  <td className="border p-2 text-center" colSpan={7}>
                    لا توجد حصص للشعبة المختارة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form لإضافة/تعديل جدول */}
      {selectedSectionId > 0 && (
        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 max-w-xl">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <PlusCircle className="w-5 h-5 text-primary dark:text-dark-primary" />
            {editingId ? "تعديل جدول" : "إضافة جدول جديد"}
          </h2>

          {/* Course */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">الكورس</label>
            <select {...register("courseId", { required: true })} className="input">
              <option value="">اختر الكورس</option>
              {coursesQuery.data?.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseName} ({course.courseCode})
                </option>
              ))}
            </select>
          </div>

          {/* Room */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">الغرفة</label>
            <select {...register("roomId", { required: true })} className="input">
              <option value="">اختر الغرفة</option>
              {roomsQuery.data?.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.roomCode}
                </option>
              ))}
            </select>
          </div>

          {/* Instructor */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">المحاضر</label>
            <select {...register("instructorId", { required: true })} className="input">
              <option value="">اختر المحاضر</option>
              {instructorsQuery.data?.map((ins) => (
                <option key={ins.id} value={ins.id}>
                  {ins.fullName} ({ins.email})
                </option>
              ))}
            </select>
          </div>

          {/* Day of Week */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">اليوم</label>
            <select {...register("dayOfWeek", { required: true })} className="input">
              <option value="">اختر اليوم</option>
              <option value={0}>الأحد</option>
              <option value={1}>الإثنين</option>
              <option value={2}>الثلاثاء</option>
              <option value={3}>الأربعاء</option>
              <option value={4}>الخميس</option>
            </select>
          </div>

          {/* Start & End Time */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 text-gray-700 dark:text-gray-300">بداية</label>
              <input type="time" {...register("startTime", { required: true })} className="input" />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-gray-700 dark:text-gray-300">نهاية</label>
              <input type="time" {...register("endTime", { required: true })} className="input" />
            </div>
          </div>

          <button type="submit" disabled={isSaving} className="btn-primary w-full">
            {isSaving ? "جاري الحفظ..." : editingId ? "تحديث الجدول" : "حفظ الجدول"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                reset();
                setEditingId(null);
              }}
              className="btn-secondary w-full"
            >
              إلغاء التعديل
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default ScheduleManager;
