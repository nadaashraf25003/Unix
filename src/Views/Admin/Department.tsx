import React from "react";
import useDepartments, { CreateDepartmentDto } from "@/Hooks/useDepartments";
import { useForm } from "react-hook-form";
import { Trash2, PlusCircle, Building2, Edit2, XCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Urls from "@/API/URLs";

const DepartmentManager: React.FC = () => {
  const {
    departmentsQuery,
    createDepartmentMutation,
    deleteDepartmentMutation,
    updateDepartmentMutation,
  } = useDepartments();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateDepartmentDto>({
    defaultValues: { name: "", code: "" },
  });

  const [editingDept, setEditingDept] = React.useState<
    (CreateDepartmentDto & { id: number }) | null
  >(null);

  const onSubmit = async (data: CreateDepartmentDto) => {
    if (editingDept) {
      try {
        console.log("Editing department id:", editingDept.id);
        console.log("URL:", Urls.DEPARTMENTS.UPDATE(editingDept.id));
        console.log("Data:", { name: data.name, code: data.code });

        await updateDepartmentMutation.mutateAsync({
          id: editingDept.id,
          data: { name: data.name, code: data.code },
        });

        toast.success("تم تعديل القسم بنجاح");
        setEditingDept(null);
        reset();
      } catch {
        toast.error("فشل تعديل القسم");
      }
    } else {
      try {
        await createDepartmentMutation.mutateAsync(data);
        toast.success("تم إضافة القسم بنجاح");
        reset();
      } catch {
        toast.error("فشل إضافة القسم");
      }
    }
  };

  const handleDelete = (id: number, name: string) => {
    console.log("Deleting department id:", id);
    console.log("URL:", Urls.DEPARTMENTS.DELETE(id));

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
                  await deleteDepartmentMutation.mutateAsync(id);
                  toast.success("تم حذف القسم");
                  toast.dismiss(t.id);
                } catch {
                  toast.error("فشل حذف القسم");
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

  if (departmentsQuery.isLoading) {
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
      {/* الهيدر */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 md:mb-8">
        <div className="bg-primary dark:bg-dark-primary p-3 rounded-xl md:rounded-2xl shadow-card dark:shadow-card-dark">
          <Building2 className="text-white w-6 h-6 md:w-8 md:h-8" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-light">
            إدارة الأقسام
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-300">
            أضف وتحكم في أقسام الكلية/المدرسة
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* فورم الإضافة/التعديل */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-4 card"
        >
          <h2 className="text-base md:text-lg font-bold mb-4 md:mb-6 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 md:w-5 md:h-5 text-primary dark:text-dark-primary" />
            {editingDept ? "تعديل القسم" : "إضافة قسم جديد"}
          </h2>

          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                اسم القسم *
              </label>
              <input
                {...register("name", { 
                  required: "اسم القسم مطلوب",
                  minLength: { value: 2, message: "يجب أن يكون الاسم على الأقل حرفين" }
                })}
                placeholder="مثلاً: هندسة الحاسبات"
                className="input text-sm md:text-base"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                كود القسم *
              </label>
              <input
                {...register("code", { 
                  required: "كود القسم مطلوب",
                  pattern: { 
                    value: /^[A-Za-z0-9-]+$/, 
                    message: "كود غير صحيح (أرقام وحروف إنجليزية فقط)" 
                  }
                })}
                placeholder="مثلاً: CS-101"
                className="input text-sm md:text-base"
              />
              {errors.code && (
                <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={createDepartmentMutation.isPending || updateDepartmentMutation.isPending}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5"
              >
                {(createDepartmentMutation.isPending || updateDepartmentMutation.isPending) ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span className="text-sm">
                      {editingDept ? "جاري التحديث..." : "جاري الإضافة..."}
                    </span>
                  </>
                ) : (
                  <span>
                    {editingDept ? "تحديث القسم" : "حفظ القسم"}
                  </span>
                )}
              </button>

              {editingDept && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingDept(null);
                    reset();
                  }}
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
                >
                  إلغاء التعديل
                </button>
              )}
            </div>
          </div>
        </form>

        {/* عرض الأقسام */}
        <div className="lg:col-span-8">
          <div className="card">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-bold text-gray-800 dark:text-light">
                الأقسام ({departments.length})
              </h2>
              {departments.length > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {departments.length} قسم
                </span>
              )}
            </div>

            {departments.length === 0 ? (
              <div className="text-center py-8 md:py-10">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="text-gray-400 w-6 h-6" />
                </div>
                <div className="text-gray-400 dark:text-gray-500 text-lg font-semibold mb-2">
                  لا توجد أقسام
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  ابدأ بإضافة قسم جديد
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="group border border-gray-200 dark:border-gray-700 rounded-xl p-3 md:p-4 hover:border-primary dark:hover:border-dark-primary transition-all duration-300 hover:shadow-card-hover"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 dark:text-light truncate text-sm md:text-base">
                          {dept.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-mono bg-info/10 dark:bg-dark-info/20 text-info dark:text-dark-info px-2 py-1 rounded-md">
                            {dept.code}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {dept.id}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 md:gap-2">
                        <button
                          onClick={() => {
                            setEditingDept(dept);
                            reset({ name: dept.name, code: dept.code });
                          }}
                          className="p-1.5 md:p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all"
                          title="تعديل"
                        >
                          <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(dept.id, dept.name)}
                          disabled={deleteDepartmentMutation.isPending}
                          className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                          title="حذف"
                        >
                          {deleteDepartmentMutation.isPending ? (
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
        </div>
      </div>

      {/* Info Panel */}
      {departments.length > 0 && (
        <div className="mt-6 md:mt-8 card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary dark:text-dark-primary">
                {departments.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                إجمالي الأقسام
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-info dark:text-dark-info">
                {new Set(departments.map(d => d.code.substring(0, 2))).size}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                تخصصات رئيسية
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-success dark:text-dark-success">
                {departments.filter(d => d.code.includes('-')).length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                أقسام مفهرسة
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManager;