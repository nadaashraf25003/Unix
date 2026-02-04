import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useStageDrivers, { CreateStageDriverData, StageDriver } from "@/Hooks/useStageDrivers";
import useDepartments from "@/Hooks/useDepartments";
import useSectionsByDepartment from "@/Hooks/useSectionByDepartment";
import { Trash2, Edit2, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

type StageDriverFormValues = {
  departmentId: string;
  sectionId: string;
  term: string;
  year: string;
  link: string;
};

const StageDriverManager: React.FC = () => {
  const { studentMaterialsQuery, createStageDriverMutation, updateStageDriverMutation, deleteStageDriverMutation } = useStageDrivers();
  const { departmentsQuery } = useDepartments();

  const { register, handleSubmit, reset, setValue, watch } = useForm<StageDriverFormValues>();
  const [editingDriver, setEditingDriver] = useState<StageDriver | null>(null);

  // مراقبة القسم المختار
  const selectedDepartmentId = watch("departmentId");
  const sectionsQuery = useSectionsByDepartment(Number(selectedDepartmentId));

  const onSubmit = (data: StageDriverFormValues) => {
    if (!data.departmentId || !data.sectionId || !data.term || !data.year || !data.link) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    const departmentName = departmentsQuery.data?.find(d => d.id === Number(data.departmentId))?.name;
    const selectedSection = sectionsQuery.data?.find(s => s.id === Number(data.sectionId));

    if (!departmentName || !selectedSection) {
      toast.error("القسم أو الفرقة غير صالح");
      return;
    }

    const payload: CreateStageDriverData = {
      departmentId: Number(data.departmentId),
      stage: selectedSection.stage, // stage الحقيقي من القسم
      link: data.link,
      type: "Drive",
      title: `${departmentName} - ${selectedSection.name} - Term ${data.term} - Year ${data.year}`,
    };

    if (editingDriver) {
      updateStageDriverMutation.mutate({ id: editingDriver.id, data: payload }, {
        onSuccess: () => {
          toast.success("تم تعديل الرابط بنجاح");
          setEditingDriver(null);
          reset();
        },
        onError: () => toast.error("فشل تعديل الرابط"),
      });
    } else {
      createStageDriverMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("تم إضافة الرابط بنجاح");
          reset();
        },
        onError: () => toast.error("فشل إضافة الرابط"),
      });
    }
  };

  const handleEdit = (driver: StageDriver) => {
    setEditingDriver(driver);

    const regex = /(.+) - (.+) - Term (\w+) - Year (\d{4}\/\d{4})/;
    const match = driver.title.match(regex);

    const dept = departmentsQuery.data?.find(d => d.name === driver.departmentName);
    const deptId = dept ? dept.id.toString() : "";
    const sectionId = sectionsQuery.data?.find(s => s.name === (match ? match[2] : ""))?.id.toString() || "";

    setValue("departmentId", deptId);
    setValue("sectionId", sectionId);
    setValue("term", match ? match[3] : "");
    setValue("year", match ? match[4] : "");
    setValue("link", driver.link);
  };

  const handleDelete = (driver: StageDriver) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-4">
        <span>هل أنت متأكد من حذف الرابط <strong>{driver.title}</strong>؟</span>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300" onClick={() => toast.dismiss(t.id)}>إلغاء</button>
          <button className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600" onClick={() => {
            deleteStageDriverMutation.mutate(driver.id, {
              onSuccess: () => toast.success("تم حذف الرابط"),
              onError: () => toast.error("فشل الحذف"),
            });
            toast.dismiss(t.id);
          }}>حذف</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  return (
    <div className="p-6 bg-light dark:bg-dark min-h-screen" dir="rtl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">إدارة Stage Drives</h1>
        <p className="text-gray-500 text-sm">أضف، عدّل أو احذف روابط الترم لكل دفعه وقسم</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Form */}
        <div className="col-span-12 lg:col-span-4">
          <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-primary">
              <PlusCircle className="w-5 h-5" />
              {editingDriver ? "تعديل الرابط" : "إضافة رابط جديد"}
            </h2>

            {/* القسم */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">القسم</label>
              <select {...register("departmentId", { required: true })} className="input">
                <option value="">اختر القسم...</option>
                {departmentsQuery.data?.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* الفرقة */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">الفرقة / السكشن</label>
              <select {...register("sectionId", { required: true })} className="input">
                <option value="">اختر الفرقة...</option>
                {sectionsQuery.data?.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* الترم */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">الترم</label>
              <select {...register("term", { required: true })} className="input">
                <option value="">اختر الترم...</option>
                <option value="First">أول</option>
                <option value="Second">ثاني</option>
              </select>
            </div>

            {/* السنة */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">السنة الدراسية</label>
              <input {...register("year", { required: true })} placeholder="مثلاً: 2025/2026" className="input"/>
            </div>

            {/* الرابط */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">الرابط</label>
              <input {...register("link", { required: true })} placeholder="ضع الرابط هنا" className="input"/>
            </div>

            <button type="submit" className="btn-primary w-full">{editingDriver ? "تحديث الرابط" : "إضافة الرابط"}</button>
            {editingDriver && (
              <button type="button" className="btn-secondary w-full" onClick={() => { reset(); setEditingDriver(null); }}>
                إلغاء التعديل
              </button>
            )}
          </form>
        </div>

        {/* Table */}
        <div className="col-span-12 lg:col-span-8">
          <div className="card overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-light border-b">
                <tr>
                  <th className="p-4">العنوان</th>
                  <th className="p-4">القسم</th>
                  <th className="p-4 text-center">الفرقة</th>
                  <th className="p-4">الترم</th>
                  <th className="p-4">السنة الدراسية</th>
                  <th className="p-4">الرابط</th>
                  <th className="p-4">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {studentMaterialsQuery.data?.map(driver => {
                  const regex = /(.+) - (.+) - Term (\w+) - Year (\d{4}\/\d{4})/;
                  const match = driver.title.match(regex);

                  return (
                    <tr key={driver.id} className="border-b hover:bg-light/50 dark:hover:bg-dark/20">
                      <td className="p-4 font-medium">{driver.title}</td>
                      <td className="p-4">{driver.departmentName || "-"}</td>
                      <td className="p-4 text-center">{match ? match[2] : "-"}</td>
                      <td className="p-4">{match ? match[3] : "-"}</td>
                      <td className="p-4">{match ? match[4] : "-"}</td>
                      <td className="p-4">
                        <a href={driver.link} target="_blank" className="text-blue-500 underline">Link</a>
                      </td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => handleEdit(driver)} className="p-2 text-gray-400 hover:text-green-500 rounded-lg">
                          <Edit2 className="w-5 h-5"/>
                        </button>
                        <button onClick={() => handleDelete(driver)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg">
                          <Trash2 className="w-5 h-5"/>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {studentMaterialsQuery.data?.length === 0 && (
              <div className="p-10 text-center text-gray-400">لا توجد روابط مضافة حالياً</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StageDriverManager;
