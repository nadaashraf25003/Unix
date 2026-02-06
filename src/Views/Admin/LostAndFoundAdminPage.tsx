import React, { useState } from "react";
import useLostAndFound from "@/Hooks/useLostAndFound";
import { Trash2, CheckCircle, PlusCircle, Search, Filter, Eye, Calendar, MapPin, Phone } from "lucide-react";

const LostAndFoundAdminPage: React.FC = () => {
  const {
    lostAndFoundQuery,
    createLostItemMutation,
    resolveItemMutation,
    deleteItemMutation,
  } = useLostAndFound();

  const { data, isLoading, isError } = lostAndFoundQuery;

  const [openForm, setOpenForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const [formData, setFormData] = useState({
    itemName: "",
    itemType: "Lost",
    location: "",
    date: new Date().toISOString().split('T')[0],
    contactInfo: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLostItemMutation.mutate(formData, {
      onSuccess: () => {
        setOpenForm(false);
        setFormData({
          itemName: "",
          itemType: "Lost",
          location: "",
          date: new Date().toISOString().split('T')[0],
          contactInfo: "",
        });
      },
    });
  };

  // Safe ID display function
  const displayId = (id: any) => {
    if (!id) return "N/A";
    const idStr = String(id);
    return idStr.length > 8 ? `${idStr.slice(0, 8)}...` : idStr;
  };

  // Filter and search logic
  const filteredItems = data?.filter((item) => {
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contactInfo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "resolved" && item.isResolved) ||
      (filterStatus === "pending" && !item.isResolved);
    
    const matchesType = filterType === "all" || item.itemType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading)
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="card p-6 text-center">
          <div className="text-red-500 dark:text-red-400 text-lg mb-2">
            Failed to load data
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Please try again later
          </p>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Lost & Found Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage lost and found items across campus
            </p>
          </div>
          <button
            onClick={() => setOpenForm(!openForm)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Add New Item
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mr-4">
              <Eye className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Items</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {data?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mr-4">
              <span className="text-red-600 dark:text-red-400 font-bold text-lg">L</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Lost Items</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {data?.filter(item => item.itemType === "Lost").length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mr-4">
              <span className="text-green-600 dark:text-green-400 font-bold text-lg">F</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Found Items</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {data?.filter(item => item.itemType === "Found").length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center mr-4">
              <CheckCircle className="text-yellow-600 dark:text-yellow-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Resolved</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {data?.filter(item => item.isResolved).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search items, locations, or contact info..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input py-2"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input py-2"
            >
              <option value="all">All Types</option>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select> */}
          </div>
        </div>
      </div>

      {/* Add Form */}
      {openForm && (
        <div className="card mb-8 animate-slideDown">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Add New Item
            </h2>
            <button
              onClick={() => setOpenForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Item Name *
                </label>
                <input
                  className="input"
                  placeholder="e.g., iPhone 13, Wallet, Keys"
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
                <select
                  className="input"
                  required
                  value={formData.itemType}
                  onChange={(e) =>
                    setFormData({ ...formData, itemType: e.target.value })
                  }
                >
                  <option value="Lost">Lost Item</option>
                  <option value="Found">Found Item</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location *
                </label>
                <div className="relative">
                  <input
                    className="input pl-10"
                    placeholder="Main Building, Room 101"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="input pl-10"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Information *
                </label>
                <div className="relative">
                  <input
                    className="input pl-10"
                    placeholder="Email or phone number"
                    required
                    value={formData.contactInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, contactInfo: e.target.value })
                    }
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={createLostItemMutation.isPending}
              >
                {createLostItemMutation.isPending ? "Saving..." : "Save Item"}
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

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems?.map((item) => (
          <div
            key={item.id || item.id || Math.random()}
            className={`card hover:shadow-card-hover transition-all duration-300 ${
              item.isResolved ? "opacity-80" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                  {item.itemName}
                </h3>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    item.itemType === "Lost"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  }`}
                >
                  {item.itemType}
                </span>
              </div>
              <div className="flex gap-2">
                {!item.isResolved && (
                  <button
                    onClick={() => resolveItemMutation.mutate(item.id)}
                    className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    title="Mark as resolved"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this item?')) {
                      deleteItemMutation.mutate(item.id);
                    }
                  }}
                  className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin size={14} className="mr-2 text-gray-400" />
                <span>{item.location}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar size={14} className="mr-2 text-gray-400" />
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Phone size={14} className="mr-2 text-gray-400" />
                <span className="truncate">{item.contactInfo}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.isResolved
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                }`}
              >
                {item.isResolved ? "✓ Resolved" : "⏳ Pending"}
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                ID: {displayId(item.id)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {(!filteredItems || filteredItems.length === 0) && (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <Eye className="text-gray-400" size={32} />
          </div>
          <div className="text-gray-400 dark:text-gray-500 text-xl font-semibold mb-3">
            No Items Found
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {searchTerm || filterStatus !== "all" || filterType !== "all"
              ? "Try adjusting your search or filters"
              : "Add your first lost or found item"}
          </p>
          <button
            onClick={() => setOpenForm(true)}
            className="btn-primary px-8"
          >
            <PlusCircle size={18} className="mr-2" />
            Add New Item
          </button>
        </div>
      )}
    </div>
  );
};

export default LostAndFoundAdminPage;