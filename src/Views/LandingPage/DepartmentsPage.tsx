import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";
import {
  FiCode,
  FiHash,
  FiUsers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiFilter,
  FiX,
  FiFolder,
  FiGrid,
  FiList,
  FiBriefcase,
} from "react-icons/fi";
import { FaBuilding, FaLayerGroup, FaUniversity } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface SectionDto {
  id: number;
  departmentId: number;
  stage: number;
  name: string;
}

interface DepartmentDto {
  id: number;
  name: string;
  code: string;
  sections: SectionDto[];
}

type ViewMode = "card" | "compact" | "grid";

const DepartmentsPage: React.FC = () => {
  const [expandedDept, setExpandedDept] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmptyOnly, setShowEmptyOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setViewMode("compact");
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navigate = useNavigate();
  const backHome = () => navigate("/");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await api.get(Urls.DEPARTMENTS.GET_ALL);
      return res.data as DepartmentDto[];
    },
  });

  // Filter departments based on search term and empty sections filter
  const filteredDepartments = data?.filter((dept) => {
    const matchesSearch =
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmptyFilter = showEmptyOnly
      ? dept.sections.length === 0
      : true;
    return matchesSearch && matchesEmptyFilter;
  });

  const toggleExpand = (id: number) => {
    setExpandedDept(expandedDept === id ? null : id);
  };

  const handleAddSection = (deptId: number) => {
    console.log("Add section to department:", deptId);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setShowEmptyOnly(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-dark-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading departments...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center p-4">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Error loading departments
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
            Unable to load department data. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary dark:bg-dark-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalSections =
    data?.reduce((acc, dept) => acc + dept.sections.length, 0) || 0;
  const departmentsWithSections =
    data?.filter((dept) => dept.sections.length > 0).length || 0;

  return (
    <div className="p-3  xs:p-4 sm:p-5 md:p-4 max-w-[2000px] mx-auto">
      {/* <button
        onClick={() => backHome()}
        className="px-4 py-2 bg-primary dark:bg-dark-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base mb-4"
      >
        Back to home
      </button> */}
      {/* Header */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 dark:text-light mb-1 sm:mb-2 truncate">
              Departments
            </h1>
            
          </div>

          {/* View Mode Toggle - Desktop */}
          <div className="hidden xs:flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("compact")}
              className={`p-1.5 rounded ${
                viewMode === "compact"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              title="Compact View"
            >
              <FiList className="text-sm" />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-1.5 rounded ${
                viewMode === "card"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              title="Card View"
            >
              <FiGrid className="text-sm" />
            </button>
          </div>
        </div>

        {/* Stats Cards - Responsive */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="card p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Total Departments
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-light">
                  {data?.length || 0}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 dark:bg-dark-primary/20 flex items-center justify-center">
                <FaBuilding className="text-primary dark:text-dark-primary text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          <div className="card p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Total Sections
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-light">
                  {totalSections}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-info/10 dark:bg-dark-info/20 flex items-center justify-center">
                <FiFolder className="text-info dark:text-dark-info text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          <div className="card p-3 sm:p-4 xs:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Depts with Sections
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-light">
                  {departmentsWithSections}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-success/10 dark:bg-dark-success/20 flex items-center justify-center">
                <FiUsers className="text-success dark:text-dark-success text-lg sm:text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Main Search - Always Visible */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 text-sm sm:text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX />
                </button>
              )}
            </div>

            {/* Filter Toggle for Mobile */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-xs sm:text-sm text-primary dark:text-dark-primary hover:opacity-80"
              >
                <FiFilter />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              {(searchTerm || showEmptyOnly) && (
                <button
                  onClick={clearFilters}
                  className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Additional Filters - Collapsible */}
            {showFilters && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowEmptyOnly(!showEmptyOnly)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                      showEmptyOnly
                        ? "bg-warning/20 dark:bg-dark-warning/20 text-warning dark:text-dark-warning"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FiFilter />
                    Empty Only
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile View - Compact */}
      {isMobile && (
        <div className="space-y-3">
          {filteredDepartments?.map((dept) => (
            <div key={dept.id} className="card animate-slideDown">
              {/* Compact Header */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-dark-primary/20 flex items-center justify-center flex-shrink-0">
                      <FaBuilding className="text-primary dark:text-dark-primary text-sm" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-light text-sm truncate">
                        {dept.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <FiCode />
                        <span className="truncate">{dept.code}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpand(dept.id)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {expandedDept === dept.id ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <FiFolder className="text-gray-400" />
                    <span>
                      {dept.sections.length} section
                      {dept.sections.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div
                    className={`px-2 py-0.5 rounded-full text-[10px] ${
                      dept.sections.length > 0
                        ? "bg-success/20 text-green-700 dark:text-dark-success"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {dept.sections.length > 0 ? "Has Sections" : "No Sections"}
                  </div>
                </div>
              </div>

              {/* Expandable Sections - Mobile */}
              {expandedDept === dept.id && dept.sections.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-3">
                    Sections ({dept.sections.length})
                  </h4>
                  <div className="space-y-2">
                    {dept.sections.map((section) => (
                      <div
                        key={section.id}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 dark:text-light text-sm">
                            {section.name}
                          </span>
                          <span className="px-2 py-0.5 bg-info/10 dark:bg-dark-info/20 text-info dark:text-dark-info text-[10px] rounded-full">
                            Stage {section.stage}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <FiHash className="text-xs" />
                          ID: {section.id}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tablet/Desktop View */}
      {!isMobile && viewMode === "compact" && (
        <div className="space-y-3">
          {filteredDepartments?.map((dept) => (
            <div
              key={dept.id}
              className="card animate-slideDown hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-center justify-between p-3 sm:p-4">
                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 dark:bg-dark-primary/20 flex items-center justify-center flex-shrink-0">
                    <FaBuilding className="text-primary dark:text-dark-primary text-lg sm:text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-light text-base sm:text-lg truncate">
                        {dept.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs sm:text-sm">
                          <FiCode className="text-xs" />
                          {dept.code}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-info/10 dark:bg-dark-info/20 text-info dark:text-dark-info rounded text-xs sm:text-sm">
                          <FiFolder className="text-xs" />
                          {dept.sections.length}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {dept.sections.length > 0
                        ? `${dept.sections.length} section${dept.sections.length !== 1 ? "s" : ""} across ${new Set(dept.sections.map((s) => s.stage)).size} stage${new Set(dept.sections.map((s) => s.stage)).size !== 1 ? "s" : ""}`
                        : "No sections assigned"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleExpand(dept.id)}
                  className="ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {expandedDept === dept.id ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  )}
                </button>
              </div>

              {/* Expandable Sections */}
              {expandedDept === dept.id && dept.sections.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {dept.sections.map((section) => (
                      <div
                        key={section.id}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900 dark:text-light text-sm sm:text-base">
                            {section.name}
                          </h5>
                          <span className="px-2 py-1 bg-info/10 dark:bg-dark-info/20 text-info dark:text-dark-info text-xs rounded-full">
                            Stage {section.stage}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <FiHash />
                          ID: {section.id}
                        </div>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                          Department: {dept.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Card View for Desktop */}
      {!isMobile && viewMode === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filteredDepartments?.map((dept) => (
            <div
              key={dept.id}
              className="card animate-slideDown hover:shadow-card-hover transition-shadow"
            >
              <div className="p-4 sm:p-5">
                {/* Department Header */}
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 dark:bg-dark-primary/20 flex items-center justify-center flex-shrink-0">
                    <FaBuilding className="text-primary dark:text-dark-primary text-xl sm:text-2xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-light mb-1 truncate">
                      {dept.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs sm:text-sm">
                        <FiCode className="text-xs" />
                        {dept.code}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          dept.sections.length > 0
                            ? "bg-success/20 text-green-700 dark:text-dark-success"
                            : "bg-warning/20 dark:bg-dark-warning/20 text-amber-700 dark:text-dark-warning"
                        }`}
                      >
                        {dept.sections.length} section
                        {dept.sections.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-3 mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {dept.sections.length > 0
                      ? `Contains sections across ${new Set(dept.sections.map((s) => s.stage)).size} stage${new Set(dept.sections.map((s) => s.stage)).size !== 1 ? "s" : ""}`
                      : "No sections assigned yet"}
                  </div>

                  {dept.sections.length > 0 && (
                    <div className="text-sm">
                      <div className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Sections:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {dept.sections.slice(0, 3).map((section) => (
                          <span
                            key={section.id}
                            className="px-2 py-1 bg-info/10 dark:bg-dark-info/20 text-info dark:text-dark-info rounded text-xs"
                          >
                            {section.name}
                          </span>
                        ))}
                        {dept.sections.length > 3 && (
                          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                            +{dept.sections.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => toggleExpand(dept.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
                >
                  {expandedDept === dept.id ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  )}
                  {expandedDept === dept.id ? "Hide Details" : "View Details"}
                </button>

                {/* Expandable Details */}
                {expandedDept === dept.id && dept.sections.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-3">
                      {dept.sections.map((section) => (
                        <div
                          key={section.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-gray-900 dark:text-light text-sm">
                              {section.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                              <span>ID: {section.id}</span>
                              <span>•</span>
                              <span>Stage: {section.stage}</span>
                            </div>
                          </div>
                          <FiChevronRight className="text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredDepartments?.length === 0 && (
        <div className="card text-center py-8 sm:py-12">
          <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-5xl mb-3 sm:mb-4">
            🏛️
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
            {searchTerm || showEmptyOnly
              ? "No matching departments found"
              : "No departments yet"}
          </h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto">
            {searchTerm
              ? "Try adjusting your search term to find what you're looking for."
              : showEmptyOnly
                ? "All departments currently have sections assigned."
                : "Start by adding your first department to organize sections and students."}
          </p>
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 justify-center">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
            >
              Clear Filters
            </button>
            <button className="btn-primary text-sm sm:text-base">
              <FiPlus />
              Add Department
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for chevron icon
const FiChevronRight = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default DepartmentsPage;
