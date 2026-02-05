import React, { useState } from "react";
import useProjects from "@/Hooks/useAdminProjects";
import { Edit, Trash2, Plus } from "lucide-react";

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

  /* ================= HANDLERS ================= */

  const handleSubmit = () => {
    const payload = {
      ...form,
      students: [], // ممكن نضيفهم بعدين
    };

    if (editingId) {
      updateProjectMutation.mutate({ id: editingId, dto: payload });
    } else {
      createProjectMutation.mutate(payload);
    }

    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      supervisor: project.supervisor,
      startDate: project.startDate.split("T")[0],
      repositoryLink: project.repositoryLink,
    });
  };

  /* ================= RENDER ================= */

  if (projectsQuery.isLoading) {
    return <p className="p-4">Loading projects...</p>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Graduation Projects – Admin</h1>

      {/* ========= FORM ========= */}
      <div className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="font-semibold">
          {editingId ? "Edit Project" : "Create New Project"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-2 rounded"
          />

          <input
            placeholder="Supervisor"
            value={form.supervisor}
            onChange={(e) => setForm({ ...form, supervisor: e.target.value })}
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="border p-2 rounded"
          />

          <input
            placeholder="Repository Link"
            value={form.repositoryLink}
            onChange={(e) =>
              setForm({ ...form, repositoryLink: e.target.value })
            }
            className="border p-2 rounded"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="border p-2 rounded col-span-2"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} />
          {editingId ? "Update Project" : "Create Project"}
        </button>
      </div>

      {/* ========= TABLE ========= */}
      <table className="w-full border rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Title</th>
            <th className="p-2">Supervisor</th>
            <th className="p-2">Members</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projectsQuery.data?.map((project: any) => (
            <tr key={project.id} className="border-t">
              <td className="p-2">{project.title}</td>
              <td className="p-2">{project.supervisor}</td>
              <td className="p-2 text-center">{project.memberCount}</td>
              <td className="p-2 flex gap-3 justify-center">
                <button
                  onClick={() => handleEdit(project)}
                  className="text-blue-600"
                >
                  <Edit size={18} />
                </button>

                <button
                  onClick={() => deleteProjectMutation.mutate(project.id)}
                  className="text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProjectsPage;
