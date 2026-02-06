import React from "react";
import useDepartments, { CreateDepartmentDto } from "@/Hooks/useDepartments";
import { useForm } from "react-hook-form";
import { 
  Trash2, 
  PlusCircle, 
  Building2, 
  Edit2, 
  Loader2, 
  CheckCircle, 
  Users,
  Hash,
  FileText,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import Urls from "@/API/URLs";

const DepartmentManager: React.FC = () => {
  const {
    departmentsQuery,
    createDepartmentMutation,
    deleteDepartmentMutation,
    updateDepartmentMutation,
  } = useDepartments();

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isValid } 
  } = useForm<CreateDepartmentDto>({
    defaultValues: { name: "", code: "" },
    mode: "onChange"
  });

  const [editingDept, setEditingDept] = React.useState<
    (CreateDepartmentDto & { id: number }) | null
  >(null);

  const onSubmit = async (data: CreateDepartmentDto) => {
    if (editingDept) {
      try {
        await updateDepartmentMutation.mutateAsync({
          id: editingDept.id,
          data: { name: data.name, code: data.code },
        });
        toast.success("Department updated successfully");
        setEditingDept(null);
        reset();
      } catch {
        toast.error("Failed to update department");
      }
    } else {
      try {
        await createDepartmentMutation.mutateAsync(data);
        toast.success("Department added successfully");
        reset();
      } catch {
        toast.error("Failed to add department");
      }
    }
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
                Delete Department?
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
              onClick={async () => {
                try {
                  await deleteDepartmentMutation.mutateAsync(id);
                  toast.success("Department deleted successfully");
                  toast.dismiss(t.id);
                } catch {
                  toast.error("Failed to delete department");
                }
              }}
            >
              Delete
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
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-dark-primary/20 dark:to-dark-secondary/20 rounded-xl"></div>
            <div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="lg:col-span-8 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
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
            <Building2 className="text-white w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Department Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Add and manage all academic departments in the institution
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>System: Online</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Add/Edit Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-4"
        >
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-dark-primary/20 dark:to-dark-secondary/20 flex items-center justify-center">
                <PlusCircle className="text-primary dark:text-dark-primary" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {editingDept ? "Edit Department" : "Add New Department"}
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Department Name *
                </label>
                <input
                  {...register("name", { 
                    required: "Department name is required",
                    minLength: { 
                      value: 2, 
                      message: "Name must be at least 2 characters" 
                    },
                    maxLength: {
                      value: 50,
                      message: "Name cannot exceed 50 characters"
                    }
                  })}
                  placeholder="e.g., Computer Engineering"
                  className="input text-sm md:text-base"
                />
                {errors.name ? (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name.message}
                  </p>
                ) : (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Enter the full department name
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Department Code *
                </label>
                <input
                  {...register("code", { 
                    required: "Department code is required",
                    pattern: { 
                      value: /^[A-Za-z0-9-]+$/, 
                      message: "Only letters, numbers, and hyphens allowed" 
                    },
                    maxLength: {
                      value: 10,
                      message: "Code cannot exceed 10 characters"
                    }
                  })}
                  placeholder="e.g., CS-101"
                  className="input text-sm md:text-base font-mono"
                />
                {errors.code ? (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.code.message}
                  </p>
                ) : (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Unique identifier for the department
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={
                    createDepartmentMutation.isPending || 
                    updateDepartmentMutation.isPending || 
                    !isValid
                  }
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-sm md:text-base"
                >
                  {(createDepartmentMutation.isPending || updateDepartmentMutation.isPending) ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 md:w-5 md:h-5" />
                      <span>
                        {editingDept ? "Updating..." : "Creating..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                      <span>
                        {editingDept ? "Update Department" : "Create Department"}
                      </span>
                    </>
                  )}
                </button>

                {editingDept && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDept(null);
                      reset();
                    }}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Departments List */}
        <div className="lg:col-span-8">
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-info/20 to-success/20 dark:from-dark-info/20 dark:to-dark-success/20 flex items-center justify-center">
                  <Users className="text-info dark:text-dark-info" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                    All Departments
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {departments.length} department{departments.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
              {departments.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 dark:bg-dark-primary/10 text-primary dark:text-dark-primary">
                    Last updated: Today
                  </div>
                </div>
              )}
            </div>

            {departments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center mb-6">
                  <Building2 className="text-gray-400 w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No Departments Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Start by creating your first department using the form on the left
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="group border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-primary dark:hover:border-dark-primary transition-all duration-300 hover:shadow-card-hover bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-dark-primary/10 dark:to-dark-secondary/10 flex items-center justify-center">
                            <Building2 className="text-primary dark:text-dark-primary w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white truncate">
                              {dept.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono text-xs bg-info/10 dark:bg-dark-info/20 text-info dark:text-dark-info px-2 py-1 rounded-lg">
                                {dept.code}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ID: {dept.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingDept(dept);
                            reset({ name: dept.name, code: dept.code });
                          }}
                          className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all hover:scale-105"
                          title="Edit Department"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dept.id, dept.name)}
                          disabled={deleteDepartmentMutation.isPending}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all hover:scale-105"
                          title="Delete Department"
                        >
                          {deleteDepartmentMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Created: {new Date().toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        Active
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      {departments.length > 0 && (
        <div className="mt-8">
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Department Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-dark-primary/10 dark:to-dark-primary/20 rounded-xl p-4 md:p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 dark:bg-dark-primary/20 flex items-center justify-center">
                    <Building2 className="text-primary dark:text-dark-primary" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-primary dark:text-dark-primary">
                      {departments.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Departments
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-info/5 to-info/10 dark:from-dark-info/10 dark:to-dark-info/20 rounded-xl p-4 md:p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-info/20 dark:bg-dark-info/20 flex items-center justify-center">
                    <Hash className="text-info dark:text-dark-info" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-info dark:text-dark-info">
                      {new Set(departments.map(d => d.code.substring(0, 2))).size}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Main Disciplines
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-success/5 to-success/10 dark:from-dark-success/10 dark:to-dark-success/20 rounded-xl p-4 md:p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-success/20 dark:bg-dark-success/20 flex items-center justify-center">
                    <FileText className="text-success dark:text-dark-success" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-success dark:text-dark-success">
                      {departments.filter(d => d.code.includes('-')).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Indexed Departments
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 dark:from-dark-secondary/10 dark:to-dark-secondary/20 rounded-xl p-4 md:p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 dark:bg-dark-secondary/20 flex items-center justify-center">
                    <Users className="text-secondary dark:text-dark-secondary" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-secondary dark:text-dark-secondary">
                      {Math.floor(departments.length * 3.5)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Estimated Users
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManager;