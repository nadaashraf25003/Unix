import React from "react";
import useSections, { CreateSectionDto } from "@/Hooks/useSections";
import useDepartments from "@/Hooks/useDepartments";
import { useForm } from "react-hook-form";
import { Layers, Plus, Trash2, Tag, Edit2, X, Loader2, Users, Building, GraduationCap } from "lucide-react";
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

  const { register, handleSubmit, reset, setValue, formState: { errors } } =
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
        onSuccess: () => {
          toast.success("تم إضافة السكشن بنجاح");
          reset();
        },
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

  // Calculate average stage safely
  const calculateAverageStage = () => {
    const sections = sectionsQuery.data || [];
    if (sections.length === 0) return "0.0";
    
    const total = sections.reduce((acc, s) => acc + (s.stage || 0), 0);
    const average = total / sections.length;
    return average.toFixed(1); // Format to 1 decimal place
  };

  if (departmentsQuery.isLoading || sectionsQuery.isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="bg-primary dark:bg-dark-primary p-3 rounded-xl md:rounded-2xl shadow-card dark:shadow-card-dark">
          <Layers className="text-white w-6 h-6 md:w-7 md:h-7" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-light">
            إدارة السكاشن / الصفوف
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-300">
            اربط المجموعات الدراسية بالأقسام والمراحل
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Form */}
        <div className="lg:col-span-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-bold flex items-center gap-2 text-primary dark:text-dark-primary">
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                {editingSection ? "تعديل السكشن" : "إضافة سكشن جديد"}
              </h2>
              {editingSection && (
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
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  القسم التابع له *
                </label>
                <select
                  {...register("departmentId", { 
                    required: "القسم مطلوب" 
                  })}
                  className="input text-sm md:text-base"
                >
                  <option value="">اختر القسم...</option>
                  {departmentsQuery.data?.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="text-red-500 text-xs mt-1">{errors.departmentId.message}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  اسم السكشن *
                </label>
                <input
                  {...register("name", { 
                    required: "اسم السكشن مطلوب",
                    minLength: { value: 2, message: "يجب أن يكون الاسم على الأقل حرفين" }
                  })}
                  placeholder="مثلاً: سكشن A، شعبة 1"
                  className="input text-sm md:text-base"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Stage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  المرحلة (Stage) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    {...register("stage", { 
                      required: "المرحلة مطلوبة",
                      min: { value: 1, message: "المرحلة يجب أن تكون 1 أو أكثر" },
                      max: { value: 5, message: "المرحلة يجب أن تكون 5 أو أقل" }
                    })}
                    placeholder="1 - 5"
                    className="input text-sm md:text-base pl-10"
                    min="1"
                    max="5"
                  />
                  <GraduationCap className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                {errors.stage && (
                  <p className="text-red-500 text-xs mt-1">{errors.stage.message}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5"
                >
                  {createSectionMutation.isPending || updateSectionMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      <span className="text-sm">
                        {editingSection ? "جاري التعديل..." : "جاري الإضافة..."}
                      </span>
                    </>
                  ) : (
                    <span>
                      {editingSection ? "تحديث السكشن" : "تأكيد الإضافة"}
                    </span>
                  )}
                </button>

                {editingSection && (
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
        </div>

        {/* Stats and Table */}
        <div className="lg:col-span-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="card p-3 md:p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 dark:bg-dark-primary/20 rounded-lg md:rounded-xl flex items-center justify-center mr-3">
                  <Layers className="text-primary dark:text-dark-primary" size={20} />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">إجمالي السكاشن</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {sectionsQuery.data?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-3 md:p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-info/10 dark:bg-dark-info/20 rounded-lg md:rounded-xl flex items-center justify-center mr-3">
                  <Building className="text-info dark:text-dark-info" size={20} />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">الأقسام</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {new Set(sectionsQuery.data?.map(s => s.departmentId)).size || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-3 md:p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-success/10 dark:bg-dark-success/20 rounded-lg md:rounded-xl flex items-center justify-center mr-3">
                  <Users className="text-success dark:text-dark-success" size={20} />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">المراحل</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {new Set(sectionsQuery.data?.map(s => s.stage)).size || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-3 md:p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-warning/10 dark:bg-dark-warning/20 rounded-lg md:rounded-xl flex items-center justify-center mr-3">
                  <GraduationCap className="text-warning dark:text-dark-warning" size={20} />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">متوسط المرحلة</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {calculateAverageStage()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sections List */}
          <div className="card overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <h2 className="text-base md:text-lg font-bold text-gray-800 dark:text-light mb-2 sm:mb-0">
                السكاشن ({sectionsQuery.data?.length || 0})
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  مرتبة حسب المرحلة
                </span>
              </div>
            </div>

            {sectionsQuery.data?.length === 0 ? (
              <div className="text-center py-8 md:py-10">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Layers className="text-gray-400 w-6 h-6" />
                </div>
                <div className="text-gray-400 dark:text-gray-500 text-lg font-semibold mb-2">
                  لا توجد سكاشن
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  ابدأ بإضافة سكشن جديد
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="p-3 text-right text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        السكشن
                      </th>
                      <th className="p-3 text-right text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        القسم
                      </th>
                      <th className="p-3 text-center text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        المرحلة
                      </th>
                      <th className="p-3 text-right text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {sectionsQuery.data?.map((section) => (
                      <tr key={section.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 dark:bg-dark-primary/20 rounded-lg flex items-center justify-center">
                              <Tag className="w-4 h-4 text-primary dark:text-dark-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-100 text-sm md:text-base">
                                {section.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                ID: {section.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                              <Building className="w-3 h-3 text-gray-500" />
                            </div>
                            <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                              {departmentsQuery.data?.find(
                                (d) => d.id === section.departmentId
                              )?.name || "غير معروف"}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 dark:bg-dark-primary/20 text-primary dark:text-dark-primary">
                            <span className="mr-1">Stage</span>
                            {section.stage}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(section)}
                              className="p-1.5 md:p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all"
                              title="تعديل"
                            >
                              <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(section.id, section.name)}
                              disabled={deleteSectionMutation.isPending}
                              className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                              title="حذف"
                            >
                              {deleteSectionMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Departments Summary */}
      {sectionsQuery.data && sectionsQuery.data.length > 0 && (
        <div className="mt-6 md:mt-8 card">
          <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-light mb-4">
            توزيع السكاشن على الأقسام
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departmentsQuery.data?.map((dept) => {
              const deptSections = sectionsQuery.data?.filter(s => s.departmentId === dept.id);
              if (!deptSections || deptSections.length === 0) return null;
              
              return (
                <div key={dept.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                      {dept.name}
                    </span>
                    <span className="text-xs bg-info/10 dark:bg-dark-info/20 text-info dark:text-dark-info px-2 py-1 rounded">
                      {deptSections.length} سكشن
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    المراحل: {Array.from(new Set(deptSections.map(s => s.stage))).sort().join('، ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionManager;