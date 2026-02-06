import React from "react";

const AdminProfile = () => {
  // get admin info from localStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-info/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-2xl p-4 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  مرحباً، {user?.name || "المسؤول"}!
                </h1>
                <p className="text-white/90 text-lg mb-4">
                  {user?.email || "admin@example.com"}
                </p>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium">
                    {user?.role || "مدير النظام"}
                  </span>
                  <span className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm">
                    لوحة التحكم
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full blur-lg"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center border-4 border-white/30">
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {user?.name?.charAt(0) || "A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Overview Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Card Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-lg">
                <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-md"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-light">
                نظرة عامة على لوحة التحكم
              </h2>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 leading-relaxed">
              هنا يمكنك إدارة المستخدمين، الأقسام، الشعب، المقررات، ومراقبة مشاريع التخرج
              بكل سهولة وكفاءة.
            </p>

            {/* Features Grid*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="group p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-md"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-light">
                    الملف الشخصي
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  عرض وتحديث معلومات ملفك الشخصي والإعدادات
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-info/10 to-cyan-400/10 dark:from-info/20 dark:to-cyan-400/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <div className="w-6 h-6 bg-gradient-to-r from-info to-cyan-400 rounded-md"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-light">
                    إدارة المستخدمين
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  إدارة المستخدمين، المحاضرين، والطلاب في النظام
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-success/10 to-green-400/10 dark:from-success/20 dark:to-green-400/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <div className="w-6 h-6 bg-gradient-to-r from-success to-green-400 rounded-md"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-light">
                    مشاريع التخرج
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  الإشراف والمراقبة على مشاريع التخرج
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-warning/10 to-yellow-400/10 dark:from-warning/20 dark:to-yellow-400/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <div className="w-6 h-6 bg-gradient-to-r from-warning to-yellow-400 rounded-md"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-light">
                    الجدول الدراسي
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  مراجعة الجداول الدراسية وتخصيص القاعات
                </p>
              </div>
            </div>

            {/* Additional Features List */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full mt-2"></div>
                    <p className="text-gray-700 dark:text-gray-300">
                      مراقبة سائقي الحرم الجامعي والموارد
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-info to-cyan-400 rounded-full mt-2"></div>
                    <p className="text-gray-700 dark:text-gray-300">
                      إدارة المقررات والمواد الدراسية
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-success to-green-400 rounded-full mt-2"></div>
                    <p className="text-gray-700 dark:text-gray-300">
                      تنظيم الأقسام والشعب الأكاديمية
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-warning to-yellow-400 rounded-full mt-2"></div>
                    <p className="text-gray-700 dark:text-gray-300">
                      متابعة التقارير والإحصائيات
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Welcome Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  نحن هنا لمساعدتك في إدارة نظام الجامعة بكفاءة 👋
                </p>
              </div>
            </div>
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default AdminProfile;