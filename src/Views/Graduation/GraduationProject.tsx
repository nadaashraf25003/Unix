import React, { useState } from "react";
import useProjects from "@/Hooks/useAdminProjects";
import {
  Edit,
  Trash2,
  Users,
  Calendar,
  GitBranch,
  BookOpen,
} from "lucide-react";

const emptyForm = {
  title: "",
  description: "",
  supervisor: "",
  startDate: "",
  repositoryLink: "",
};

const GraduationProject: React.FC = () => {
  const { projectsQuery } = useProjects();

  const [form, setForm] = useState(emptyForm);

  if (projectsQuery.isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Safe ID display function
  const displayId = (id: any) => {
    if (!id) return "N/A";
    const idStr = String(id);
    return idStr.length > 6 ? `${idStr.slice(0, 6)}...` : idStr;
  };

  // Get supervisor initial for avatar
  const getInitial = (name: string) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  // Get random color for supervisor avatar
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-primary/20 text-primary",
      "bg-secondary/20 text-secondary",
      "bg-info/20 text-info",
      "bg-success/20 text-success",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Graduation Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track student graduation projects
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary/10 dark:bg-dark-primary/20 rounded-xl flex items-center justify-center mr-4">
              <BookOpen
                className="text-primary dark:text-dark-primary"
                size={24}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Projects
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {projectsQuery.data?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-info/10 dark:bg-dark-info/20 rounded-xl flex items-center justify-center mr-4">
              <Users className="text-info dark:text-dark-info" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Members
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {projectsQuery.data?.reduce(
                  (acc, project) => acc + (project.memberCount || 0),
                  0,
                ) || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-success/10 dark:bg-dark-success/20 rounded-xl flex items-center justify-center mr-4">
              <Users
                className="text-success dark:text-dark-success"
                size={24}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supervisors
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {new Set(projectsQuery.data?.map((p) => p.supervisor)).size ||
                  0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-warning/10 dark:bg-dark-warning/20 rounded-xl flex items-center justify-center mr-4">
              <Calendar
                className="text-warning dark:text-dark-warning"
                size={24}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {projectsQuery.data?.filter((p) => p.startDate).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projectsQuery.data?.map((project: any) => (
          <div
            key={project.id || project._id || Math.random()}
            className="card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border-l-4 border-primary dark:border-dark-primary"
          >
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${getAvatarColor(project.supervisor)}`}
                >
                  <span className="font-bold">
                    {getInitial(project.supervisor)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 line-clamp-2">
                    {project.title || "Untitled Project"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Supervisor: {project.supervisor || "Not assigned"}
                  </p>
                </div>
              </div>
              {/* <div className="flex gap-1">
                <button className="p-1.5 text-gray-400 hover:text-primary dark:hover:text-dark-primary transition-colors">
                  <Edit size={16} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div> */}
            </div>

            {/* Project Details */}
            <div className="space-y-3 mb-6">
              {project.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Users size={14} className="mr-2 text-gray-400" />
                <span className="font-medium">Members:</span>
                <span className="ml-2 font-semibold">
                  {project.memberCount || 0}
                </span>
              </div>

              {project.startDate && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar size={14} className="mr-2 text-gray-400" />
                  <span className="font-medium">Started:</span>
                  <span className="ml-2">{project.startDate}</span>
                </div>
              )}

              {project.repositoryLink && (
                <div className="flex items-center text-sm">
                  <GitBranch size={14} className="mr-2 text-gray-400" />
                  <a
                    href={project.repositoryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary dark:text-dark-primary hover:underline truncate"
                  >
                    Repository Link
                  </a>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {displayId(project.id || project._id)}
                  </span>
                </div>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  ID: {displayId(project.id || project._id)}
                </span>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.memberCount > 0
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {project.memberCount > 0 ? "Active" : "Empty"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {(!projectsQuery.data || projectsQuery.data.length === 0) && (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="text-gray-400" size={32} />
          </div>
          <div className="text-gray-400 dark:text-gray-500 text-xl font-semibold mb-3">
            No Projects Yet
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Start by adding graduation projects to track student progress and
            assignments
          </p>
          <button className="btn-primary px-8">Create First Project</button>
        </div>
      )}
    </div>
  );
};

export default GraduationProject;
