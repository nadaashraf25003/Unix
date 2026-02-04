// src/Pages/StudentStageDrivers.tsx
import React from "react";
import useStageDrivers from "@/Hooks/useStageDrivers";

const StudentStageDriversPage: React.FC = () => {
  const { studentMaterialsQuery } = useStageDrivers();
  const { data, isLoading, isError, error } = studentMaterialsQuery;

  if (isLoading)
    return <p className="p-4 text-gray-500">جارٍ تحميل المواد...</p>;

  if (isError) {
    console.error("Stage Drivers fetch error:", error);
    return (
      <p className="p-4 text-red-500">
        حدث خطأ أثناء تحميل المواد. حاول تحديث الصفحة أو الاتصال بالدعم.
      </p>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stage Drivers الخاصة بك</h1>

      {data && data.length > 0 ? (
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">العنوان</th>
              <th className="px-4 py-2 text-left">النوع</th>
              <th className="px-4 py-2 text-left">المرحلة</th>
              <th className="px-4 py-2 text-left">الرابط</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.title}</td>
                <td className="px-4 py-2">{item.type}</td>
                <td className="px-4 py-2">{item.stage}</td>
                <td className="px-4 py-2">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    عرض المادة
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">لا توجد مواد متاحة لك حالياً.</p>
      )}
    </div>
  );
};

export default StudentStageDriversPage;
