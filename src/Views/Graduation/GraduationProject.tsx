import React, { useState } from "react";
import useProjects from "@/Hooks/useAdminProjects";
import {
  Edit,
  Trash2,
  Users,
  Calendar,
  GitBranch,
  BookOpen,
  Mail,
  User,
  FileText
} from "lucide-react";

const GraduationProject: React.FC = () => {
  const { projectsQuery } = useProjects();

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

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Get supervisor initial for avatar
  const getInitial = (name: string) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  // Get color for avatar based on supervisor name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-primary/20 text-primary dark:bg-dark-primary/20 dark:text-dark-primary",
      "bg-secondary/20 text-secondary dark:bg-dark-secondary/20 dark:text-dark-secondary",
      "bg-info/20 text-info dark:bg-dark-info/20 dark:text-dark-info",
      "bg-success/20 text-success dark:bg-dark-success/20 dark:text-dark-success",
    ];
    const index = (name?.length || 0) % colors.length;
    return colors[index];
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case 'in progress':
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case 'pending':
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
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
            Track students graduation projects
          </p>
        </div>
       
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary/10 dark:bg-dark-primary/20 rounded-xl flex items-center justify-center mr-4">
              <BookOpen className="text-primary dark:text-dark-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Projects</p>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {projectsQuery.data?.reduce((total, project) => 
                  total + (project.students?.length || 0), 0) || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-success/10 dark:bg-dark-success/20 rounded-xl flex items-center justify-center mr-4">
              <User className="text-success dark:text-dark-success" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Supervisors</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {new Set(projectsQuery.data?.map(p => p.supervisor)).size || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-warning/10 dark:bg-dark-warning/20 rounded-xl flex items-center justify-center mr-4">
              <Calendar className="text-warning dark:text-dark-warning" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {projectsQuery.data?.filter(p => p.status?.toLowerCase() === 'in progress').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projectsQuery.data?.map((project) => (
          <div
            key={project.id}
            className="card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border-l-4 border-primary dark:border-dark-primary"
          >
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getAvatarColor(project.supervisor)}`}>
                  <span className="font-bold">{getInitial(project.supervisor)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 line-clamp-1">
                      {project.title || "Untitled Project"}
                    </h3>
                    {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status || "Unknown"}
                    </span> */}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <User size={12} />
                    Supervisor: {project.supervisor || "Not assigned"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {project.description && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {project.description}
                </p>
              </div>
            )}

            {/* Project Details */}
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar size={14} className="mr-2 text-gray-400" />
                  <div>
                    <div className="font-medium">Start Date</div>
                    <div>{formatDate(project.startDate)}</div>
                  </div>
                </div>
                
                {project.endDate && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar size={14} className="mr-2 text-gray-400" />
                    <div>
                      <div className="font-medium">End Date</div>
                      <div>{formatDate(project.endDate)}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Repository Link */}
              {project.repositoryLink && (
                <div className="flex items-center text-sm">
                  <GitBranch size={14} className="mr-2 text-gray-400" />
                  <a
                    href={project.repositoryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary dark:text-dark-primary hover:underline truncate"
                  >
                    View Repository
                  </a>
                </div>
              )}

              {/* Students Section */}
              <div className="pt-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Users size={14} className="mr-2 text-gray-400" />
                  <span className="font-medium">Students ({project.students?.length || 0})</span>
                </div>
                
                {project.students && project.students.length > 0 ? (
                  <div className="space-y-2 pl-6">
                    {project.students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <User size={12} className="text-gray-400" />
                            <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
                              {student.name}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                            <span>ID: {student.studentId}</span>
                            <span className="flex items-center gap-1">
                              <Mail size={10} />
                              {student.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 italic pl-6">
                    No students assigned to this project
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Project ID: {project.id}
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
            Start by adding graduation projects to track student progress and assignments
          </p>
          <button className="btn-primary px-8">Create First Project</button>
        </div>
      )}
    </div>
  );
};

export default GraduationProject;

// Import PlusCircle icon
import { PlusCircle } from "lucide-react";