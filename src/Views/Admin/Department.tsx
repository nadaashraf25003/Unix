import React from "react";
import useDepartments, { CreateDepartmentDto } from "@/Hooks/useDepartments";
import { useForm } from "react-hook-form";
import { Trash2, PlusCircle, Building2, Edit2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import Urls from "@/API/URLs";

const DepartmentManager: React.FC = () => {
  const {
    departmentsQuery,
    createDepartmentMutation,
    deleteDepartmentMutation,
    updateDepartmentMutation, // لازم تضيفه في hook
  } = useDepartments();

  const { register, handleSubmit, reset } = useForm<CreateDepartmentDto>({
    defaultValues: { name: "", code: "" },
  });

  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeletingId, setIsDeletingId] = React.useState<number | null>(null);
  const [editingDept, setEditingDept] = React.useState<
    (CreateDepartmentDto & { id: number }) | null
  >(null);

  const onSubmit = async (data: CreateDepartmentDto) => {
    if (editingDept) {
      try {
        setIsSaving(true);

        // 🔹 حط هنا الـ console.logs
        console.log("Editing department id:", editingDept.id);
        console.log(
          "URL being called:",
          Urls.DEPARTMENTS.UPDATE(editingDept.id),
        );
        console.log("Data being sent:", { name: data.name, code: data.code });

        await updateDepartmentMutation.mutateAsync({
          id: editingDept.id,
          data: { name: data.name, code: data.code },
        });

        toast.success("تم تعديل القسم بنجاح");
        setEditingDept(null);
        reset();
      } catch {
        toast.error("فشل تعديل القسم");
      } finally {
        setIsSaving(false);
      }
    } else {
      try {
        setIsSaving(true);
        await createDepartmentMutation.mutateAsync(data);
        toast.success("تم إضافة القسم بنجاح");
        reset();
      } catch {
        toast.error("فشل إضافة القسم");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDelete = (id: number, name: string) => {
    console.log("Deleting department id:", id);
    console.log("URL:", `${Urls.DEPARTMENTS.DELETE(id)}`);

    toast(
      (t) => (
        <div className="flex flex-col gap-4 p-4">
          <span>
            هل أنت متأكد من حذف القسم <strong>{name}</strong>؟
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
                  setIsDeletingId(id);
                  await deleteDepartmentMutation.mutateAsync(id);
                  toast.success("تم حذف القسم");
                } catch {
                  toast.error("فشل حذف القسم");
                } finally {
                  setIsDeletingId(null);
                  toast.dismiss(t.id);
                }
              }}
            >
              حذف
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  const departments = departmentsQuery.data || [];

  return (
    <div className="p-6 bg-light dark:bg-dark min-h-screen" dir="rtl">
      {/* الهيدر */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary dark:bg-dark-primary p-3 rounded-2xl shadow-card dark:shadow-card-dark">
          <Building2 className="text-white w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-light">
            إدارة الأقسام
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            أضف وتحكم في أقسام الكلية/المدرسة
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* فورم الإضافة/التعديل */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="col-span-12 lg:col-span-4 card"
        >
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-primary dark:text-dark-primary" />
            {editingDept ? "تعديل القسم" : "إضافة قسم جديد"}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                اسم القسم
              </label>
              <input
                {...register("name", { required: true })}
                placeholder="مثلاً: هندسة الحاسبات"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                كود القسم
              </label>
              <input
                {...register("code", { required: true })}
                placeholder="مثلاً: CS-101"
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary w-full"
            >
              {isSaving
                ? "جاري الحفظ..."
                : editingDept
                  ? "تحديث القسم"
                  : "حفظ القسم"}
            </button>

            {editingDept && (
              <button
                type="button"
                onClick={() => {
                  setEditingDept(null);
                  reset();
                }}
                className="btn-secondary w-full"
              >
                إلغاء التعديل
              </button>
            )}
          </div>
        </form>

        {/* عرض الأقسام */}
        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departmentsQuery.isLoading ? (
              <div className="col-span-2 text-center py-10 dark:text-light">
                جاري التحميل...
              </div>
            ) : departments.length === 0 ? (
              <div className="col-span-2 text-center py-10 dark:text-light">
                لا توجد أقسام
              </div>
            ) : (
              departments.map((dept) => (
                <div
                  key={dept.id}
                  className="card flex justify-between items-center group hover:border-primary dark:hover:border-dark-primary transition-all"
                >
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-light">
                      {dept.name}
                    </h3>
                    <span className="text-xs font-mono bg-info/10 dark:bg-dark-info/20 text-info dark:text-dark-info px-2 py-1 rounded-md">
                      {dept.code}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingDept(dept);
                        reset({ name: dept.name, code: dept.code });
                      }}
                      className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(dept.id, dept.name)}
                      disabled={isDeletingId === dept.id}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManager;
