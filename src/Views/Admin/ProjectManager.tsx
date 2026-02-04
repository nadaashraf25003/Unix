// src/Pages/AdminProjects.tsx
import React, { useState } from "react";
import useProjects, { GraduationProjectDto, CreateProjectDto } from "@/Hooks/useProjects";
import { useMutation } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";
import toast from "react-hot-toast";
 import ProjectMembersModal from "./Components/ProjectMembersModal";

const AdminProjectsPage: React.FC = () => {
  const { projectsQuery, projectMembersQuery, createProjectMutation } = useProjects();
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  if (projectsQuery.isLoading) return <p>Loading projects...</p>;
  if (projectsQuery.isError) return <p>Error loading projects</p>;

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return toast.error("Project name required");
    createProjectMutation.mutate({ projectName: newProjectName } as CreateProjectDto);
    setNewProjectName("");
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      await api.delete(Urls.PROJECTS.GET_ALL + `/${projectId}`);
      toast.success("Project deleted");
      projectsQuery.refetch();
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin: Graduation Projects</h1>

      {/* Create Project */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="New Project Name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={handleCreateProject} className="bg-blue-500 text-white p-2 rounded">
          Create
        </button>
      </div>

      {/* Projects Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Project Name</th>
            <th className="border p-2">Members Count</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projectsQuery.data?.map((project) => (
            <tr key={project.id}>
              <td className="border p-2">{project.id}</td>
              <td className="border p-2">{project.projectName}</td>
              <td className="border p-2">{project.memberCount}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => setSelectedProjectId(project.id)}
                  className="bg-green-500 text-white p-1 rounded"
                >
                  Members
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Members Modal */}
      {selectedProjectId && (
        <ProjectMembersModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
};

export default AdminProjectsPage;
