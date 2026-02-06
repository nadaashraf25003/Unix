import React from "react";
import { useForm } from "react-hook-form";
import useInstructors, { InstructorDto, CreateInstructorDto } from "@/Hooks/useInstructor";
import useDepartments, { DepartmentDto } from "@/Hooks/useDepartments";
import { PlusCircle, User, Mail, Building, Edit2, Trash2, Loader2, Users, Award, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";

const InstructorManager: React.FC = () => {
  const { instructorsQuery } = useInstructors();
  const { departmentsQuery } = useDepartments();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateInstructorDto>({
    defaultValues: {
      fullName: "",
      email: "",
      departmentId: 0,
    },
  });

  const [editingInstructor, setEditingInstructor] = React.useState<
    (CreateInstructorDto & { id: number }) | null
  >(null);

  // Mutation لإضافة محاضر جديد
  const createInstructorMutation = useMutation({
    mutationFn: async (data: CreateInstructorDto) => {
      const res = await api.post(Urls.INSTRUCTORS.GET_ALL, data);
      return res.data as InstructorDto;
    },
    onSuccess: (newInstructor) => {
      toast.success("تم إضافة المحاضر بنجاح");
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
      reset();
    },
    onError: (err: any) => {
      toast.error("فشل إضافة المحاضر: " + (err.response?.data?.message || err.message));
    },
  });

  // Mutation لتعديل محاضر
  const updateInstructorMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CreateInstructorDto }) => {
      const res = await api.put(`${Urls.INSTRUCTORS.GET_ALL}/${id}`, data);
      return res.data as InstructorDto;
    },
    onSuccess: () => {
      toast.success("تم تعديل المحاضر بنجاح");
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
      reset();
      setEditingInstructor(null);
    },
    onError: (err: any) => {
      toast.error("فشل تعديل المحاضر: " + (err.response?.data?.message || err.message));
    },
  });

  // Mutation لحذف محاضر
  const deleteInstructorMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`${Urls.INSTRUCTORS.GET_ALL}/${id}`);
    },
    onSuccess: () => {
      toast.success("تم حذف المحاضر بنجاح");
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
    },
    onError: (err: any) => {
      toast.error("فشل حذف المحاضر: " + (err.response?.data?.message || err.message));
    },
  });

  const onSubmit = (data: CreateInstructorDto) => {
    if (editingInstructor) {
      updateInstructorMutation.mutate({ id: editingInstructor.id, data });
    } else {
      createInstructorMutation.mutate(data);
    }
  };

  const handleEdit = (instructor: InstructorDto) => {
    setEditingInstructor(instructor);
    setValue("fullName", instructor.fullName);
    setValue("email", instructor.email);
    setValue("departmentId", instructor.departmentId);
  };

  const handleCancelEdit = () => {
    reset();
    setEditingInstructor(null);
  };

  const handleDelete = (id: number, name: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-4 p-4">
          <span>
            هل أنت متأكد من حذف المحاضر <strong>{name}</strong>؟
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
              onClick={() => {
                deleteInstructorMutation.mutate(id);
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

  const instructors = instructorsQuery.data || [];

  if (instructorsQuery.isLoading || departmentsQuery.isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
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
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 md:mb-8">
        <div className="bg-primary dark:bg-dark-primary p-3 rounded-xl md:rounded-2xl shadow-card dark:shadow-card-dark">
          <Users className="text-white w-6 h-6 md:w-8 md:h-8" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-light">
            إدارة المحاضرين
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-300">
            إضافة وتعديل وحذف المحاضرين والأساتذة
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
              {editingInstructor ? "تعديل المحاضر" : "إضافة محاضر جديد"}
            </h2>
            {editingInstructor && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-2 text-sm"
              >
                إلغاء التعديل
              </button>
            )}
          </div>

          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                الاسم الكامل *
              </label>
              <div className="relative">
                <input
                  {...register("fullName", { 
                    required: "الاسم الكامل مطلوب",
                    minLength: { value: 3, message: "يجب أن يكون الاسم على الأقل 3 أحرف" }
                  })}
                  className="input text-sm md:text-base pl-10"
                  placeholder="أحمد محمد علي"
                />
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                البريد الإلكتروني *
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register("email", { 
                    required: "البريد الإلكتروني مطلوب",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "بريد إلكتروني غير صالح"
                    }
                  })}
                  className="input text-sm md:text-base pl-10"
                  placeholder="example@university.edu"
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                القسم *
              </label>
              <div className="relative">
                <select
                  {...register("departmentId", { 
                    required: "القسم مطلوب",
                    validate: value => value !== 0 || "يرجى اختيار قسم"
                  })}
                  className="input text-sm md:text-base pl-10"
                >
                  <option value={0}>اختر القسم...</option>
                  {departmentsQuery.data?.map((dep: DepartmentDto) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.name} ({dep.code})
                    </option>
                  ))}
                </select>
                <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              {errors.departmentId && (
                <p className="text-red-500 text-xs mt-1">{errors.departmentId.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={createInstructorMutation.isPending || updateInstructorMutation.isPending}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5"
              >
                {createInstructorMutation.isPending || updateInstructorMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span className="text-sm">
                      {editingInstructor ? "جاري التحديث..." : "جاري الإضافة..."}
                    </span>
                  </>
                ) : (
                  <span>
                    {editingInstructor ? "تحديث المحاضر" : "إضافة محاضر"}
                  </span>
                )}
              </button>

              {editingInstructor && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
                >
                  إلغاء
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Instructors List */}
        <div className="lg:col-span-8">
          <div className="card">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-bold text-gray-800 dark:text-light">
                المحاضرون ({instructors.length})
              </h2>
              {instructors.length > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {instructors.length} محاضر
                </span>
              )}
            </div>

            {instructors.length === 0 ? (
              <div className="text-center py-8 md:py-10">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Users className="text-gray-400 w-6 h-6" />
                </div>
                <div className="text-gray-400 dark:text-gray-500 text-lg font-semibold mb-2">
                  لا توجد محاضرين
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  ابدأ بإضافة أول محاضر
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {instructors.map((instructor) => (
                  <div
                    key={instructor.id}
                    className="group border border-gray-200 dark:border-gray-700 rounded-xl p-3 md:p-4 hover:border-primary dark:hover:border-dark-primary transition-all duration-300 hover:shadow-card-hover"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primary/10 dark:bg-dark-primary/20 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-primary dark:text-dark-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 dark:text-light text-sm md:text-base">
                              {instructor.fullName}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {instructor.email}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                            <Building className="w-3 h-3 mr-1" />
                            <span>
                              {departmentsQuery.data?.find(dep => dep.id === instructor.departmentId)?.name || "غير معروف"}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {instructor.id}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 md:gap-2">
                        <button
                          onClick={() => handleEdit(instructor)}
                          className="p-1.5 md:p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all"
                          title="تعديل"
                        >
                          <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(instructor.id, instructor.fullName)}
                          disabled={deleteInstructorMutation.isPending}
                          className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                          title="حذف"
                        >
                          {deleteInstructorMutation.isPending ? (
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
          {instructors.length > 0 && (
            <div className="mt-6 card">
              <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-light mb-4">
                إحصائيات المحاضرين
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary dark:text-dark-primary">
                    {instructors.length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    إجمالي المحاضرين
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-info dark:text-dark-info">
                    {new Set(instructors.map(i => i.departmentId)).size}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    أقسام مختلفة
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-success dark:text-dark-success">
                    {departmentsQuery.data?.filter(dept => 
                      instructors.some(inst => inst.departmentId === dept.id)
                    ).length || 0}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    أقسام نشطة
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Departments Distribution */}
      {instructors.length > 0 && (
        <div className="mt-6 md:mt-8 card">
          <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-light mb-4">
            توزيع المحاضرين على الأقسام
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departmentsQuery.data?.map((dept) => {
              const deptInstructors = instructors.filter(inst => inst.departmentId === dept.id);
              if (deptInstructors.length === 0) return null;
              
              return (
                <div key={dept.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                      {dept.name}
                    </span>
                    <span className="text-xs bg-primary/10 dark:bg-dark-primary/20 text-primary dark:text-dark-primary px-2 py-1 rounded">
                      {deptInstructors.length} محاضر
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {deptInstructors.slice(0, 2).map(inst => inst.fullName).join('، ')}
                    {deptInstructors.length > 2 && `، +${deptInstructors.length - 2} آخرين`}
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

export default InstructorManager;