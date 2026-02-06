import React, { useState } from "react";
import useSections, { CreateSectionDto } from "@/Hooks/useSections";
import useDepartments from "@/Hooks/useDepartments";
import { useForm } from "react-hook-form";
import { 
  Layers, 
  Plus, 
  Trash2, 
  Tag, 
  Edit2, 
  X, 
  Loader2, 
  Users, 
  Building, 
  GraduationCap,
  BookOpen,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Filter,
  Calendar
} from "lucide-react";
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

  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    formState: { errors, isValid } 
  } = useForm<SectionFormValues>({
    mode: "onChange"
  });

  const [editingSection, setEditingSection] =
    React.useState<CreateSectionDto & { id: number } | null>(null);
  const [filterStage, setFilterStage] = useState<string>("all");
  const [filterDept, setFilterDept] = useState<string>("all");

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
            toast.success("Section updated successfully");
            reset();
            setEditingSection(null);
          },
          onError: () => {
            toast.error("Failed to update section");
          }
        }
      );
    } else {
      createSectionMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Section added successfully");
          reset();
        },
        onError: () => {
          toast.error("Failed to add section");
        }
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
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                Delete Section?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete <strong>{name}</strong>? 
                This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 text-sm rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all"
              onClick={() => {
                deleteSectionMutation.mutate(id, {
                  onSuccess: () => {
                    toast.success("Section deleted successfully");
                    toast.dismiss(t.id);
                  },
                  onError: () => {
                    toast.error("Failed to delete section");
                  }
                });
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  // Filter sections based on criteria
  const filteredSections = sectionsQuery.data?.filter(section => {
    const stageMatch = filterStage === "all" || section.stage.toString() === filterStage;
    const deptMatch = filterDept === "all" || section.departmentId.toString() === filterDept;
    return stageMatch && deptMatch;
  }) || [];

  // Calculate average stage safely
  const calculateAverageStage = () => {
    const sections = sectionsQuery.data || [];
    if (sections.length === 0) return "0.0";
    
    const total = sections.reduce((acc, s) => acc + (s.stage || 0), 0);
    const average = total / sections.length;
    return average.toFixed(1);
  };

  // Calculate stages distribution
  const stagesDistribution = () => {
    const sections = sectionsQuery.data || [];
    const distribution: Record<number, number> = {};
    
    for (let i = 1; i <= 5; i++) {
      distribution[i] = sections.filter(s => s.stage === i).length;
    }
    
    return distribution;
  };

  if (departmentsQuery.isLoading || sectionsQuery.isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-dark-primary/20 dark:to-dark-secondary/20 rounded-xl"></div>
            <div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 h-72 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="lg:col-span-8 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="bg-gradient-to-r from-primary to-secondary dark:from-dark-primary dark:to-dark-secondary p-3 md:p-4 rounded-2xl shadow-lg">
            <Layers className="text-white w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Section Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Organize and manage academic sections across departments and stages
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>System: Online</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Form */}
        <div className="lg:col-span-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-dark-primary/20 dark:to-dark-secondary/20 flex items-center justify-center">
                  {editingSection ? (
                    <Edit2 className="text-primary dark:text-dark-primary" />
                  ) : (
                    <Plus className="text-primary dark:text-dark-primary" />
                  )}
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingSection ? "Edit Section" : "Create New Section"}
                </h2>
              </div>
              {editingSection && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-2 text-sm"
                >
                  <X size={16} />
                  Cancel
                </button>
              )}
            </div>

            <div className="space-y-5">
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Department *
                </label>
                <div className="relative">
                  <select
                    {...register("departmentId", { 
                      required: "Department is required" 
                    })}
                    className="input appearance-none pr-10 cursor-pointer"
                  >
                    <option value="">Select a department...</option>
                    {departmentsQuery.data?.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.departmentId ? (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.departmentId.message}
                  </p>
                ) : (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Choose which department this section belongs to
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Section Name *
                </label>
                <input
                  {...register("name", { 
                    required: "Section name is required",
                    minLength: { 
                      value: 2, 
                      message: "Name must be at least 2 characters" 
                    },
                    maxLength: {
                      value: 50,
                      message: "Name cannot exceed 50 characters"
                    }
                  })}
                  placeholder="e.g., Section A, Group 1"
                  className="input"
                />
                {errors.name ? (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name.message}
                  </p>
                ) : (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Enter a descriptive name for the section
                  </div>
                )}
              </div>

              {/* Stage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Stage (Year) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    {...register("stage", { 
                      required: "Stage is required",
                      min: { 
                        value: 1, 
                        message: "Stage must be 1 or higher" 
                      },
                      max: { 
                        value: 5, 
                        message: "Stage must be 5 or lower" 
                      }
                    })}
                    placeholder="1 - 5"
                    className="input pl-10"
                    min="1"
                    max="5"
                  />
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                {errors.stage ? (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.stage.message}
                  </p>
                ) : (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Academic year/stage (1-5)
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={
                    createSectionMutation.isPending || 
                    updateSectionMutation.isPending || 
                    !isValid
                  }
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-sm md:text-base"
                >
                  {(createSectionMutation.isPending || updateSectionMutation.isPending) ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 md:w-5 md:h-5" />
                      <span>
                        {editingSection ? "Updating..." : "Creating..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                      <span>
                        {editingSection ? "Update Section" : "Create Section"}
                      </span>
                    </>
                  )}
                </button>

                {editingSection && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Stats and Table */}
        <div className="lg:col-span-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Sections</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {sectionsQuery.data?.length || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary/10 dark:bg-dark-primary/20 rounded-lg flex items-center justify-center">
                  <Layers className="text-primary dark:text-dark-primary" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Departments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {new Set(sectionsQuery.data?.map(s => s.departmentId)).size || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-info/10 dark:bg-dark-info/20 rounded-lg flex items-center justify-center">
                  <Building className="text-info dark:text-dark-info" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Stages</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {new Set(sectionsQuery.data?.map(s => s.stage)).size || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-success/10 dark:bg-dark-success/20 rounded-lg flex items-center justify-center">
                  <Users className="text-success dark:text-dark-success" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Stage</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {calculateAverageStage()}
                  </p>
                </div>
                <div className="w-10 h-10 bg-warning/10 dark:bg-dark-warning/20 rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-warning dark:text-dark-warning" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Sections List */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-info/20 to-success/20 dark:from-dark-info/20 dark:to-dark-success/20 flex items-center justify-center">
                  <BookOpen className="text-info dark:text-dark-info" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    All Sections
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredSections.length} section{filteredSections.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <select
                    value={filterStage}
                    onChange={(e) => setFilterStage(e.target.value)}
                    className="input text-sm pl-10 pr-8 appearance-none"
                  >
                    <option value="all">All Stages</option>
                    {[1, 2, 3, 4, 5].map(stage => (
                      <option key={stage} value={stage}>Stage {stage}</option>
                    ))}
                  </select>
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <div className="relative">
                  <select
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="input text-sm pl-10 pr-8 appearance-none"
                  >
                    <option value="all">All Departments</option>
                    {departmentsQuery.data?.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {filteredSections.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center mb-6">
                  <Layers className="text-gray-400 w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No Sections Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {filterStage !== "all" || filterDept !== "all" 
                    ? "Try adjusting your filters to find results."
                    : "Start by creating your first section using the form on the left."
                  }
                </p>
                {(filterStage !== "all" || filterDept !== "all") && (
                  <button
                    onClick={() => {
                      setFilterStage("all");
                      setFilterDept("all");
                    }}
                    className="text-sm text-primary dark:text-dark-primary hover:opacity-80"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Section
                      </th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Stage
                      </th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredSections.map((section) => (
                      <tr key={section.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-dark-primary/10 dark:to-dark-secondary/10 flex items-center justify-center">
                              <Tag className="w-5 h-5 text-primary dark:text-dark-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {section.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                ID: {section.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-info/10 dark:bg-dark-info/10 flex items-center justify-center">
                              <Building className="w-4 h-4 text-info dark:text-dark-info" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">
                              {departmentsQuery.data?.find(
                                (d) => d.id === section.departmentId
                              )?.name || "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                              section.stage === 1 ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300" :
                              section.stage === 2 ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" :
                              section.stage === 3 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300" :
                              section.stage === 4 ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300" :
                              "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                            }`}>
                              Stage {section.stage}
                            </span>
                            <GraduationCap className="w-4 h-4 text-gray-400" />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(section)}
                              className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all hover:scale-105"
                              title="Edit Section"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(section.id, section.name)}
                              disabled={deleteSectionMutation.isPending}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all hover:scale-105"
                              title="Delete Section"
                            >
                              {deleteSectionMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
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

      {/* Distribution Panels */}
      {sectionsQuery.data && sectionsQuery.data.length > 0 && (
        <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stages Distribution */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                Stages Distribution
              </h3>
              <div className="space-y-4">
                {Object.entries(stagesDistribution()).map(([stage, count]) => (
                  <div key={stage} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-dark-primary/10 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-primary dark:text-dark-primary" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        Stage {stage}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {count}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        section{count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Departments Summary */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                Departments Overview
              </h3>
              <div className="space-y-4">
                {departmentsQuery.data?.map((dept) => {
                  const deptSections = sectionsQuery.data?.filter(s => s.departmentId === dept.id);
                  if (!deptSections || deptSections.length === 0) return null;
                  
                  return (
                    <div key={dept.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-primary dark:hover:border-dark-primary transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-info/10 dark:bg-dark-info/10 flex items-center justify-center">
                            <Building className="w-4 h-4 text-info dark:text-dark-info" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {dept.name}
                          </span>
                        </div>
                        <span className="text-sm bg-info/10 dark:bg-dark-info/20 text-info dark:text-dark-info px-3 py-1 rounded-full">
                          {deptSections.length} section{deptSections.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Stages: {Array.from(new Set(deptSections.map(s => s.stage))).sort().join(', ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionManager;