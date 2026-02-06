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
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="card p-6 text-center">
          <div className="text-red-500 dark:text-red-400 text-lg mb-2">
            Something went wrong
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load lost & found items
          </p>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Lost & Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Report lost items or claim found items
          </p>
        </div>

        <button
          onClick={() => setOpenForm(!openForm)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusCircle size={18} />
          Report Item
        </button>
      </div>

      {/* Report Form */}
      {openForm && (
        <div className="card mb-8 animate-slideDown">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Report New Item
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Item Name *
              </label>
              <input
                className="input"
                placeholder="Item Name"
                required
                value={formData.itemName}
                onChange={(e) =>
                  setFormData({ ...formData, itemName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Item Type *
              </label>
              <input
                className="input"
                placeholder="Lost / Found"
                required
                value={formData.itemType}
                onChange={(e) =>
                  setFormData({ ...formData, itemType: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location *
              </label>
              <input
                className="input"
                placeholder="Location"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date *
              </label>
              <input
                type="date"
                className="input"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Information *
              </label>
              <input
                className="input"
                placeholder="Contact Info"
                required
                value={formData.contactInfo}
                onChange={(e) =>
                  setFormData({ ...formData, contactInfo: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2 flex gap-3 pt-2">
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={createLostItemMutation.isPending}
              >
                {createLostItemMutation.isPending ? "Submitting..." : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => setOpenForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items List */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          All Items
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            ({data?.length || 0})
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((item) => (
          <div
            key={item.id}
            className="card hover:shadow-card-hover transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                {item.itemName}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.itemType === "Lost"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                }`}
              >
                {item.itemType}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Location:</span> {item.location}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Date:</span> {item.date}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Contact:</span> {item.contactInfo}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  item.isResolved
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                }`}
              >
                {item.isResolved ? "Resolved" : "Pending"}
              </span>
            </div>
          </div>
        ))}

        {data?.length === 0 && (
          <div className="md:col-span-3">
            <div className="card p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
                No lost & found items
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Be the first to report an item
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LostAndFoundUserPage;