// src/Components/ProjectMembersModal.tsx
import React from "react";
import useProjects, { ProjectMemberDto } from "@/Hooks/useAdminProjects";

interface Props {
  projectId: number;
  onClose: () => void;
}

const ProjectMembersModal: React.FC<Props> = ({ projectId, onClose }) => {
  const { projectMembersQuery } = useProjects();
  const membersQuery = projectMembersQuery(projectId);

  if (membersQuery.isLoading) return <div>Loading members...</div>;
  if (membersQuery.isError) return <div>Error loading members</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-96">
        <h2 className="text-lg font-bold mb-4">Project Members</h2>
        <ul>
          {membersQuery.data?.map((member: ProjectMemberDto) => (
            <li key={member.studentId}>{member.studentName}</li>
          ))}
        </ul>
        <button onClick={onClose} className="mt-4 bg-gray-500 text-white p-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default ProjectMembersModal;
