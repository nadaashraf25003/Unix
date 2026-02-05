import React, { useState } from "react";
import useLostAndFound from "@/Hooks/useLostAndFound";
import { Trash2, CheckCircle, PlusCircle } from "lucide-react";

const LostAndFoundAdminPage: React.FC = () => {
  const {
    lostAndFoundQuery,
    createLostItemMutation,
    resolveItemMutation,
    deleteItemMutation,
  } = useLostAndFound();

  const { data, isLoading, isError } = lostAndFoundQuery;

  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    itemType: "",
    location: "",
    date: "",
    contactInfo: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLostItemMutation.mutate(formData, {
      onSuccess: () => {
        setOpenForm(false);
        setFormData({
          itemName: "",
          itemType: "",
          location: "",
          date: "",
          contactInfo: "",
        });
      },
    });
  };

  if (isLoading)
    return <p className="p-4 text-gray-500">Loading lost & found items...</p>;

  if (isError)
    return <p className="p-4 text-red-500">Failed to load data</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lost & Found Management</h1>

        <button
          onClick={() => setOpenForm(!openForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle size={18} />
          Add Item
        </button>
      </div>

      {/* Add Form */}
      {openForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            className="border p-2 rounded"
            placeholder="Item Name"
            required
            value={formData.itemName}
            onChange={(e) =>
              setFormData({ ...formData, itemName: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Item Type (Lost / Found)"
            required
            value={formData.itemType}
            onChange={(e) =>
              setFormData({ ...formData, itemType: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Location"
            required
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />

          <input
            type="date"
            className="border p-2 rounded"
            required
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
          />

          <input
            className="border p-2 rounded md:col-span-2"
            placeholder="Contact Info"
            required
            value={formData.contactInfo}
            onChange={(e) =>
              setFormData({ ...formData, contactInfo: e.target.value })
            }
          />

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 md:col-span-2"
          >
            Save Item
          </button>
        </form>
      )}

      {/* Table */}
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
                    >
                      <CheckCircle />
                    </button>
                  )}

                  <button
                    onClick={() => deleteItemMutation.mutate(item.id)}
                    className="text-red-600 hover:text-red-800"
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
