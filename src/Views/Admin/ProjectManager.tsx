import React, { useState } from "react";
import useProjects from "@/Hooks/useAdminProjects";
import { Edit, Trash2, Plus, Users, Calendar, GitBranch, BookOpen, Loader2, X, Save, Menu, Grid, List } from "lucide-react";

const emptyForm = {
  title: "",
  description: "",
  supervisor: "",
  startDate: "",
  repositoryLink: "",
};

const AdminProjectsPage: React.FC = () => {
  const {
    projectsQuery,
    createProjectMutation,
    updateProjectMutation,
    deleteProjectMutation,
  } = useProjects();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);

  /* ================= HANDLERS ================= */
  const handleSubmit = () => {
    const payload = {
      ...form,
      students: [],
    };

    if (editingId) {
      updateProjectMutation.mutate({ id: editingId, dto: payload });
    } else {
      createProjectMutation.mutate(payload);
    }

    setForm(emptyForm);
    setEditingId(null);
    setIsFormCollapsed(true);
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setForm({
      title: project.title || "",
      description: project.description || "",
      supervisor: project.supervisor || "",
      startDate: project.startDate ? project.startDate.split("T")[0] : "",
      repositoryLink: project.repositoryLink || "",
    });
    setIsFormCollapsed(false);
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(id);
    }
  };

  /* ================= RENDER ================= */
  if (projectsQuery.isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 md:w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 md:h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* Header - Mobile optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Graduation Projects
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Create, edit, and manage student graduation projects
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
            >
              <List size={18} />
            </button>
          </div>
          
          {/* Toggle Form Button */}
          <button
            onClick={() => setIsFormCollapsed(!isFormCollapsed)}
            className="md:hidden btn-primary flex items-center gap-2 px-3 py-2"
          >
            <Menu size={18} />
            {isFormCollapsed ? "Show Form" : "Hide Form"}
          </button>
        </div>
      </div>

      {/* Form Section - Collapsible on mobile */}
      {(!isFormCollapsed || window.innerWidth >= 768) && (
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">
              {editingId ? "Edit Project" : "Create New Project"}
            </h2>
            {editingId && (
              <button
                onClick={handleCancel}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-2"
              >
                <X size={16} />
                Cancel Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Title *
                </label>
                <input
                  placeholder="Enter project title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Supervisor *
                </label>
                <input
                  placeholder="Enter supervisor name"
                  value={form.supervisor}
                  onChange={(e) => setForm({ ...form, supervisor: e.target.value })}
                  className="input text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="input text-sm md:text-base pl-9 md:pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Repository Link
                </label>
                <div className="relative">
                  <input
                    placeholder="https://github.com/..."
                    value={form.repositoryLink}
                    onChange={(e) =>
                      setForm({ ...form, repositoryLink: e.target.value })
                    }
                    className="input text-sm md:text-base pl-9 md:pl-10"
                  />
                  <GitBranch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Enter project description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="input text-sm md:text-base min-h-[80px] md:min-h-[100px]"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleSubmit}
                disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
                className="btn-primary flex items-center justify-center gap-2 py-2.5 md:py-3"
              >
                {createProjectMutation.isPending || updateProjectMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span className="text-sm md:text-base">
                      {editingId ? "Updating..." : "Creating..."}
                    </span>
                  </>
                ) : (
                  <>
                    {editingId ? (
                      <>
                        <Save size={16} />
                        <span className="text-sm md:text-base">Update Project</span>
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        <span className="text-sm md:text-base">Create Project</span>
                      </>
                    )}
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm md:text-base"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards - Responsive grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="card p-3 md:p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 dark:bg-dark-primary/20 rounded-lg md:rounded-xl flex items-center justify-center mr-3">
              <BookOpen className="text-primary dark:text-dark-primary" size={20} />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Projects</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                {projectsQuery.data?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-3 md:p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-info/10 dark:bg-dark-info/20 rounded-lg md:rounded-xl flex items-center justify-center mr-3">
              <Users className="text-info dark:text-dark-info" size={20} />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Members</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                {projectsQuery.data?.reduce((acc, project) => acc + (project.memberCount || 0), 0) || 0}
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
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Supervisors</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                {new Set(projectsQuery.data?.map(p => p.supervisor)).size || 0}
              </p>
            </div>
          </div>
</div>

        <div className="card p-3 md:p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-warning/10 dark:bg-dark-warning/20 rounded-lg md:rounded-xl flex items-center justify-center mr-3">
              <Calendar className="text-warning dark:text-dark-warning" size={20} />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                {projectsQuery.data?.filter(p => p.startDate).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section - Grid/List View Toggle */}
      <div className="card overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">
            All Projects ({projectsQuery.data?.length || 0})
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              View:
            </span>
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* GRID VIEW */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {projectsQuery.data?.map((project: any) => (
              <div
                key={project.id}
                className="card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 truncate">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {project.supervisor}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-primary dark:text-dark-primary hover:text-primary/80"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {project.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Users size={14} className="mr-1" />
                    <span>{project.students?.length || 0} members</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.startDate
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800"
                  }`}>
                    {project.startDate ? "Active" : "Not Started"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="p-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Project Title
                  </th>
                  <th className="p-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Supervisor
                  </th>
                  <th className="p-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Members
                  </th>
                  <th className="p-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="p-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {projectsQuery.data?.map((project: any) => (
                  <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100">
                          {project.title}
                        </p>
                        {project.description && (
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px] md:max-w-xs">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                      {project.supervisor}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <Users size={14} className="mr-2 text-gray-400" />
                        <span className="font-medium text-sm md:text-base">
                          {project.students?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        project.startDate
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800"
                      }`}>
                        {project.startDate ? "Active" : "Not Started"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-primary dark:text-dark-primary hover:text-primary/80 p-1.5"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="text-red-600 hover:text-red-800 p-1.5"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {(!projectsQuery.data || projectsQuery.data.length === 0) && (
          <div className="p-6 md:p-8 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="text-gray-400" size={28} />
            </div>
            <div className="text-gray-400 dark:text-gray-500 text-lg font-semibold mb-2">
              No Projects Found
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Create your first graduation project
            </p>
            <button
              onClick={() => setIsFormCollapsed(false)}
              className="btn-primary px-6 py-2.5"
            >
              <Plus size={16} className="mr-2" />
              Create Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjectsPage;