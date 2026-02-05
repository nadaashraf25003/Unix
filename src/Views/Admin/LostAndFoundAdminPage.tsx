import React from "react";
import useLostAndFound from "@/Hooks/useLostAndFound";
import { Trash2, CheckCircle } from "lucide-react";

const LostAndFoundAdminPage: React.FC = () => {
  const {
    lostAndFoundQuery,
    resolveItemMutation,
    deleteItemMutation,
  } = useLostAndFound();

  const { data, isLoading, isError } = lostAndFoundQuery;

  if (isLoading)
    return <p className="p-4 text-gray-500">Loading lost & found items...</p>;

  if (isError)
    return <p className="p-4 text-red-500">Failed to load data</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lost & Found Management</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.itemName}</td>
                <td className="p-3">{item.itemType}</td>
                <td className="p-3">{item.location}</td>
                <td className="p-3">{item.date}</td>
                <td className="p-3">{item.contactInfo}</td>

                <td className="p-3 text-center">
                  {item.isResolved ? (
                    <span className="text-green-600 font-semibold">
                      Resolved
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">
                      Pending
                    </span>
                  )}
                </td>

                <td className="p-3 flex gap-3 justify-center">
                  {!item.isResolved && (
                    <button
                      onClick={() => resolveItemMutation.mutate(item.id)}
                      className="text-green-600 hover:text-green-800"
                      title="Resolve"
                    >
                      <CheckCircle />
                    </button>
                  )}

                  <button
                    onClick={() => deleteItemMutation.mutate(item.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}

            {data?.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No lost & found items
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LostAndFoundAdminPage;
