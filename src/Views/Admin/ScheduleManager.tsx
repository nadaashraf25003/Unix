import React from "react";
import { useForm } from "react-hook-form";
import useSchedules, { CreateScheduleDto } from "@/Hooks/useSchedules";
import useCourses from "@/Hooks/useCourses";
import useSections from "@/Hooks/useSections";
import useRooms from "@/Hooks/useRooms";
import useInstructors from "@/Hooks/useInstructor";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const daysMap: Record<string, string> = {
  Sunday: "الأحد",
  Monday: "الإثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
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

  const [selectedSectionId, setSelectedSectionId] = React.useState<number>(0);
  const scheduleQuery = sectionScheduleQuery(selectedSectionId);

  const { register, handleSubmit, reset } = useForm<CreateScheduleDto>({
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
      toast.error("فشل حفظ الجدول");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number) => {
  if (!selectedSectionId) return;

  Swal.fire({
    title: "هل أنت متأكد؟",
    text: "لن تتمكن من استرجاع هذا الجدول بعد الحذف!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم، احذفه!",
    cancelButtonText: "إلغاء",
    reverseButtons: true, // عشان زر الإلغاء يكون على اليمين
    customClass: {
      popup: 'rtl', // تضيف هذا لو عايزة تدعم الـ RTL
    }
  }).then((result) => {
    if (result.isConfirmed) {
      deleteScheduleMutation.mutate(id, {
        onSuccess: () => {
          toast.success("تم حذف الجدول بنجاح");
          scheduleQuery.refetch();
        },
        onError: () => toast.error("فشل حذف الجدول"),
      });
    }
  });
};


  return (
    <div className="p-6 bg-light dark:bg-dark min-h-screen" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-light">
        إدارة الجدول
      </h1>

      {/* اختيار الشعبة */}
      <div className="mb-6 max-w-xl">
        <label className="block mb-1 text-gray-700 dark:text-gray-300">
          اختر الشعبة
        </label>
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
        <div className="overflow-x-auto mb-6">
          <table className="table-auto w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="border p-2">اليوم</th>
                <th className="border p-2">النوع</th>
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
                <tr key={sch.id}>
                  <td className="border p-2">
                    {daysMap[sch.dayOfWeek] ?? sch.dayOfWeek}
                  </td>
                  <td className="border p-2">{sch.scheduleType}</td>
                  <td className="border p-2">{sch.courseName}</td>
                  <td className="border p-2">{sch.instructorName}</td>
                  <td className="border p-2">{sch.roomCode}</td>
                  <td className="border p-2">{sch.startTime}</td>
                  <td className="border p-2">{sch.endTime}</td>
                  <td className="border p-2 flex gap-2 justify-center">
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
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
                    >
                      تعديل
                    </button>
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
                  <td colSpan={8} className="border p-4 text-center">
                    لا توجد حصص لهذه الشعبة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form */}
      {selectedSectionId > 0 && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card space-y-4 max-w-xl"
        >
          <h2 className="text-lg font-bold flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            {editingId ? "تعديل جدول" : "إضافة جدول جديد"}
          </h2>

          {/* Course */}
          <div>
            <label className="block mb-1">الكورس</label>
<select
  {...register("courseId", {
    required: true,
    valueAsNumber: true,
  })}
  className="input"
>
              <option value="">اختر الكورس</option>
              {coursesQuery.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.courseName}
                </option>
              ))}
            </select>
          </div>

          {/* Room */}
          <div>
            <label className="block mb-1">الغرفة</label>
<select
  {...register("roomId", {
    required: true,
    valueAsNumber: true,
  })}
  className="input"
>
              <option value="">اختر الغرفة</option>
              {roomsQuery.data?.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.roomCode}
                </option>
              ))}
            </select>
          </div>

          {/* Instructor */}
          <div>
            <label className="block mb-1">المحاضر</label>
           <select
  {...register("instructorId", {
    required: true,
    valueAsNumber: true,
  })}
  className="input"
>

              <option value="">اختر المحاضر</option>
              {instructorsQuery.data?.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Schedule Type */}
          <div>
            <label className="block mb-1">نوع الحصة</label>
            <select
              {...register("scheduleType", { required: true })}
              className="input"
            >
              <option value="Lecture">محاضرة</option>
              <option value="Lab">معمل</option>
              <option value="Section">سكشن</option>
            </select>
          </div>

          {/* Day */}
          <div>
            <label className="block mb-1">اليوم</label>
            <select {...register("dayOfWeek", { required: true })} className="input">
              <option value="">اختر اليوم</option>
              <option value="Sunday">الأحد</option>
              <option value="Monday">الإثنين</option>
              <option value="Tuesday">الثلاثاء</option>
              <option value="Wednesday">الأربعاء</option>
              <option value="Thursday">الخميس</option>
            </select>
          </div>

          {/* Time */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1">من</label>
              <input
                type="time"
                {...register("startTime", { required: true })}
                className="input"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">إلى</label>
              <input
                type="time"
                {...register("endTime", { required: true })}
                className="input"
              />
            </div>
          </div>

          <button type="submit" disabled={isSaving} className="btn-primary w-full">
            {isSaving
              ? "جاري الحفظ..."
              : editingId
              ? "تحديث الجدول"
              : "حفظ الجدول"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn-secondary w-full"
              onClick={() => {
                reset();
                setEditingId(null);
              }}
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
