import React from "react";
import useSections, { CreateSectionDto } from "@/Hooks/useSections";
import useDepartments from "@/Hooks/useDepartments";
import { useForm } from "react-hook-form";
import { Layers, Plus, Trash2, Tag, Edit2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

/* =======================
   Form Types
======================= */
type SectionFormValues = {
  departmentId: string;
  stage: string;
  name: string;
};

const SectionManager: React.FC = () => {
  const { departmentsQuery } = useDepartments();
  const {
    sectionsQuery,
    createSectionMutation,
    updateSectionMutation,
    deleteSectionMutation,
  } = useSections();

  const { register, handleSubmit, reset, setValue } =
    useForm<SectionFormValues>();

  const [editingSection, setEditingSection] =
    React.useState<CreateSectionDto & { id: number } | null>(null);

  /* =======================
     Add or Update Section
  ======================= */
  const onSubmit = (data: SectionFormValues) => {
    const payload = {
      name: data.name,
      departmentId: Number(data.departmentId),
      stage: Number(data.stage),
    };

    if (editingSection) {
      updateSectionMutation.mutate(
        { id: editingSection.id, data: payload },
        {
          onSuccess: () => {
            toast.success("تم تعديل السكشن بنجاح");
            reset();
            setEditingSection(null);
          },
        }
      );
    } else {
      createSectionMutation.mutate(payload, {
        onSuccess: () => reset(),
      });
    }
  };

  const handleEdit = (section: CreateSectionDto & { id: number }) => {
    setEditingSection(section);
    setValue("name", section.name);
    setValue("stage", section.stage.toString());
    setValue("departmentId", section.departmentId.toString());
  };

  const handleCancelEdit = () => {
    reset();
    setEditingSection(null);
  };
  const handleDelete = (id: number, name: string) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-4 p-4">
        <span>هل أنت متأكد من حذف السكشن <strong>{name}</strong>؟</span>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={() => toast.dismiss(t.id)}
          >
            إلغاء
          </button>
          <button
            className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
            onClick={() => {
              deleteSectionMutation.mutate(id, {
                onSuccess: () => toast.success("تم حذف السكشن"),
                onError: () => toast.error("فشل الحذف"),
              });
              toast.dismiss(t.id);
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


  return (
    <div className="p-6 bg-light dark:bg-dark min-h-screen" dir="rtl">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-primary dark:bg-dark-primary p-3 rounded-2xl shadow-card dark:shadow-card-dark">
          <Layers className="text-white w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-light">
            إدارة السكاشن / الصفوف
          </h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            اربط المجموعات الدراسية بالأقسام والمراحل
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Form */}
        <div className="col-span-12 lg:col-span-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card"
          >
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary dark:text-dark-primary">
              <Plus className="w-5 h-5" />
              {editingSection ? "تعديل السكشن" : "إضافة سكشن جديد"}
            </h2>

            <div className="space-y-4">
              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  القسم التابع له
                </label>
                <select
                  {...register("departmentId", { required: true })}
                  className="input"
                >
                  <option value="">اختر القسم...</option>
                  {departmentsQuery.data?.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  اسم السكشن
                </label>
                <input
                  {...register("name", { required: true })}
                  placeholder="مثلاً: سكشن A"
                  className="input"
                />
              </div>

              {/* Stage */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  المرحلة (Stage)
                </label>
                <input
                  type="number"
                  {...register("stage", { required: true })}
                  placeholder="1 / 2 / 3"
                  className="input"
                />
              </div>

              <button
                type="submit"
                disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                className="btn-primary w-full"
              >
                {editingSection
                  ? updateSectionMutation.isPending
                    ? "جاري التعديل..."
                    : "تحديث السكشن"
                  : createSectionMutation.isPending
                  ? "جاري الإضافة..."
                  : "تأكيد الإضافة"}
              </button>

              {editingSection && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn-secondary w-full"
                >
                  إلغاء التعديل
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="col-span-12 lg:col-span-8">
          <div className="card overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-light dark:bg-dark border-b">
                <tr>
                  <th className="p-4">السكشن</th>
                  <th className="p-4">القسم</th>
                  <th className="p-4 text-center">المرحلة</th>
                  <th className="p-4">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {sectionsQuery.data?.map((section) => (
                  <tr key={section.id} className="border-b hover:bg-light/50 dark:hover:bg-dark/20">
                    <td className="p-4 font-medium flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary dark:text-dark-primary" />
                      {section.name}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">
                      {departmentsQuery.data?.find(
                        (d) => d.id === section.departmentId
                      )?.name}
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-primary/10 dark:bg-dark-primary/20 text-primary dark:text-dark-primary px-3 py-1 rounded-full text-xs font-bold">
                        Stage {section.stage}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(section)}
                        className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                     <button
  onClick={() => handleDelete(section.id, section.name)}
  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-all"
>
  <Trash2 className="w-5 h-5" />
</button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sectionsQuery.data?.length === 0 && (
              <div className="p-10 text-center text-gray-400 dark:text-gray-500">
                لا يوجد سكاشن مضافة حالياً
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionManager;
