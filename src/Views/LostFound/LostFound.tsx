import React, { useState } from "react";
import useLostAndFound from "@/Hooks/useLostAndFound";
import { PlusCircle } from "lucide-react";

const LostAndFoundUserPage: React.FC = () => {
  const { lostAndFoundQuery, createLostItemMutation } = useLostAndFound();
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
    return <p className="p-4 text-gray-500">Loading lost & found...</p>;

  if (isError)
    return <p className="p-4 text-red-500">Something went wrong</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lost & Found</h1>

        <button
          onClick={() => setOpenForm(!openForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle size={18} />
          Report Item
        </button>
      </div>

      {/* Report Form */}
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
            Submit
          </button>
        </form>
      )}

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <h2 className="font-semibold text-lg">{item.itemName}</h2>
            <p className="text-sm text-gray-600">Type: {item.itemType}</p>
            <p className="text-sm text-gray-600">Location: {item.location}</p>
            <p className="text-sm text-gray-600">Date: {item.date}</p>
            <p className="text-sm text-gray-600">
              Contact: {item.contactInfo}
            </p>

            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold
              ${
                item.isResolved
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {item.isResolved ? "Resolved" : "Pending"}
            </span>
          </div>
        ))}

        {data?.length === 0 && (
          <p className="text-gray-500">No lost & found items</p>
        )}
      </div>
    </div>
  );
};

export default LostAndFoundUserPage;
