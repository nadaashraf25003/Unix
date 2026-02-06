// src/Pages/StudentStageDrivers.tsx
import React from "react";
import useStageDrivers from "@/Hooks/useStageDrivers";

const StudentStageDriversPage: React.FC = () => {
  const { studentMaterialsQuery } = useStageDrivers();
  const { data, isLoading, isError, error } = studentMaterialsQuery;

  if (isLoading)
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );

  if (isError) {
    console.error("Stage Drivers fetch error:", error);
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="card p-6 text-center">
          <div className="text-red-500 dark:text-red-400 text-lg mb-2">
            Error loading materials
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Try refreshing the page or contact support
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Your Study Materials
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Educational materials available for your academic stage
        </p>
      </div>

      {/* Materials Grid */}
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <div
              key={item.id}
              className="card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                  {item.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.type.toLowerCase() === "pdf"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : item.type.toLowerCase() === "video"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {item.type}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium w-16">Type:</span>
                  <span>{item.type}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium w-16">Stage:</span>
                  <span className="font-semibold text-primary dark:text-dark-primary">
                    {item.stage}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  View Material
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
            No materials available at the moment
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Materials for your stage will be added soon
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentStageDriversPage;