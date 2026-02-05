import React, { useState, useMemo, useEffect } from "react";
import useAdminUsers, { UserDto } from "@/Hooks/useAdminUsers";
import toast from "react-hot-toast";
import {
  FiTrash2,
  FiUser,
  FiMail,
  FiCheck,
  FiX,
  FiCalendar,
  FiBriefcase,
  FiHash,
  FiFilter,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiEdit,
  FiEye,
  FiMoreVertical,
} from "react-icons/fi";
import { FaCrown, FaUser, FaUserShield, FaUserGraduate, FaUserTie } from "react-icons/fa";

interface FilterState {
  search: string;
  role: string;
  status: string;
  verified: string;
}

const AdminUsersPage: React.FC = () => {
  const { usersQuery, deleteUserMutation } = useAdminUsers();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    role: "all",
    status: "all",
    verified: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: number;
    name: string;
    email: string;
  } | null>(null);
  const [showMobileActions, setShowMobileActions] = useState<number | null>(null);

  // Close mobile actions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowMobileActions(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getRoleIcon = (role: string | null | undefined) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <FaCrown className="text-warning dark:text-dark-warning text-xs sm:text-sm" />;
      case "superadmin":
        return <FaUserShield className="text-primary dark:text-dark-primary text-xs sm:text-sm" />;
      case "instructor":
        return <FaUserGraduate className="text-info dark:text-dark-info text-xs sm:text-sm" />;
      case "student":
        return <FaUserTie className="text-success dark:text-dark-success text-xs sm:text-sm" />;
      default:
        return <FaUser className="text-gray-500 text-xs sm:text-sm" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-warning/20 dark:bg-dark-warning/20 text-warning dark:text-dark-warning";
      case "superadmin":
        return "bg-primary/20 dark:bg-dark-primary/20 text-primary dark:text-dark-primary";
      case "instructor":
        return "bg-info/20 dark:bg-dark-info/20 text-info dark:text-dark-info";
      case "student":
        return "bg-success/20 dark:bg-dark-success/20 text-green-600 dark:text-dark-success";
      default:
        return "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? "bg-success/20 dark:bg-dark-success/20 text-green-700 dark:text-dark-success"
      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
  };

  const getVerificationBadge = (isVerified: boolean) => {
    return isVerified
      ? "bg-success/20 dark:bg-dark-success/20 text-green-700 dark:text-dark-success"
      : "bg-warning/20 dark:bg-dark-warning/20 text-amber-700 dark:text-dark-warning";
  };

  // Filter users based on filter state
  const filteredUsers = useMemo(() => {
    if (!usersQuery.data) return [];

    return usersQuery.data.filter((user) => {
      // Search filter
      const searchMatch =
        filters.search === "" ||
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.role?.toLowerCase().includes(filters.search.toLowerCase());

      // Role filter
      const roleMatch =
        filters.role === "all" ||
        (filters.role === "other" && !["admin", "student", "instructor"].includes((user.role ?? "other").toLowerCase())) ||
        user.role?.toLowerCase() === filters.role;

      // Verification filter
      const verifiedMatch =
        filters.verified === "all" ||
        (filters.verified === "verified" && user.isEmailVerified) ||
        (filters.verified === "unverified" && !user.isEmailVerified);

      return searchMatch && roleMatch && verifiedMatch;
    });
  }, [usersQuery.data, filters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDeleteClick = (user: UserDto) => {
    setUserToDelete({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  };

  const confirmDelete = () => {
    if (!userToDelete) return;

    deleteUserMutation.mutate(userToDelete.id, {
      onSuccess: () => {
        toast.success(`User "${userToDelete.name}" deleted successfully`);
        setUserToDelete(null);
      },
      onError: () => {
        toast.error(`Failed to delete user "${userToDelete.name}"`);
        setUserToDelete(null);
      },
    });
  };

  const cancelDelete = () => {
    setUserToDelete(null);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      role: "all",
      status: "all",
      verified: "all",
    });
  };

  if (usersQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-dark-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  if (usersQuery.isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Error loading users
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-3 sm:mb-6">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-light mb-1 truncate">
              User Management
            </h1>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate">
              Manage all registered users and their permissions
            </p>
          </div>
          <div className="flex items-center gap-1 xs:gap-2 min-w-fit">
            <div className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              Showing:{" "}
              <span className="font-bold text-primary dark:text-dark-primary">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-bold">{usersQuery.data?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="card mb-3 sm:mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <FiFilter className="text-gray-600 dark:text-gray-400 text-xs sm:text-base" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-xs xs:text-sm sm:text-base">
              Filters
            </h3>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 text-xs xs:text-sm text-primary dark:text-dark-primary hover:opacity-80"
          >
            {showFilters ? <FiChevronUp /> : <FiChevronDown />}
            <span className="hidden xs:inline">
              {showFilters ? "Hide Filters" : "Show Filters"}
            </span>
            <span className="xs:hidden">Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            {/* Search Input */}
            <div className="relative">
              <FiSearch className="absolute left-2 xs:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs xs:text-sm" />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="input pl-7 xs:pl-9 sm:pl-10 text-xs xs:text-sm sm:text-base h-9 xs:h-10"
              />
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3">
              {/* Role Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                  className="input text-xs xs:text-sm h-8 xs:h-9"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>

              {/* Verification Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Verification
                </label>
                <select
                  value={filters.verified}
                  onChange={(e) => handleFilterChange("verified", e.target.value)}
                  className="input text-xs xs:text-sm h-8 xs:h-9"
                >
                  <option value="all">All</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="input text-xs xs:text-sm h-8 xs:h-9"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full h-8 xs:h-9 text-xs xs:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-1 xs:gap-0 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} match your filters
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Extra Small Mobile View (xs) - Very Compact Cards */}
      <div className="block sm:hidden">
        <div className="grid grid-cols-1 gap-2 mb-4">
          {filteredUsers.map((user: UserDto) => (
            <div key={user.id} className="card animate-slideDown relative p-2">
              {/* Main Content */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-primary/10 dark:bg-dark-primary/20 flex items-center justify-center flex-shrink-0">
                    <FiUser className="text-primary dark:text-dark-primary text-xs" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-light text-xs truncate">
                      {user.name}
                    </h3>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                
                {/* Action Menu Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMobileActions(showMobileActions === user.id ? null : user.id);
                  }}
                  className="ml-1 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiMoreVertical className="text-gray-500 text-xs" />
                </button>
              </div>

              {/* Role Badge */}
              <div className="mb-2">
                <div
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getRoleColor(
                    user.role ?? "user"
                  )}`}
                >
                  {getRoleIcon(user.role)}
                  <span>{user.role || "User"}</span>
                </div>
              </div>

              {/* User Details - Compact Grid */}
              <div className="grid grid-cols-2 gap-1 mb-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-0.5 text-[10px]">
                    <FiBriefcase className="text-gray-400 text-[8px] flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">Dept:</span>
                    <span className="font-medium truncate">{user.departmentId || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[10px]">
                    <FiHash className="text-gray-400 text-[8px]" />
                    <span className="text-gray-600 dark:text-gray-400">Stage:</span>
                    <span className="font-medium">{user.stage || "N/A"}</span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px]">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span
                      className={`ml-0.5 px-1 py-0.5 rounded-full text-[9px] font-medium ${getStatusBadge(
                        user.isActive
                      )}`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="text-[10px]">
                    <span className="text-gray-600 dark:text-gray-400">Verified:</span>
                    <span
                      className={`ml-0.5 px-1 py-0.5 rounded-full text-[9px] font-medium ${getVerificationBadge(
                        user.isEmailVerified
                      )}`}
                    >
                      {user.isEmailVerified ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                  <FiCalendar className="text-[8px]" />
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
                <button
                  onClick={() => handleDeleteClick(user)}
                  disabled={deleteUserMutation.isPending}
                  className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 transition-colors"
                >
                  <FiTrash2 className="text-[8px]" />
                  Delete
                </button>
              </div>

              {/* Mobile Action Menu Dropdown */}
              {showMobileActions === user.id && (
                <div 
                  className="absolute right-1 top-7 z-10 mt-1 w-36 rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 animate-slideDown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-0.5">
                    <button
                      className="flex items-center gap-1 w-full px-2 py-1.5 text-[10px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => {/* View action */}}
                    >
                      <FiEye className="text-[10px]" />
                      View Details
                    </button>
                    <button
                      className="flex items-center gap-1 w-full px-2 py-1.5 text-[10px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => {/* Edit action */}}
                    >
                      <FiEdit className="text-[10px]" />
                      Edit User
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-0.5"></div>
                    <button
                      className="flex items-center gap-1 w-full px-2 py-1.5 text-[10px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <FiTrash2 className="text-[10px]" />
                      Delete User
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {filteredUsers.length === 0 && (
            <div className="card text-center py-6">
              <div className="text-gray-400 dark:text-gray-500 text-3xl mb-2">
                🔍
              </div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                No users found
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Try adjusting your filters
              </p>
              <button
                onClick={clearFilters}
                className="text-xs text-primary dark:text-dark-primary hover:opacity-80"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Small Mobile View (sm) - Standard Mobile Cards */}
      <div className="hidden sm:block md:hidden">
        <div className="grid grid-cols-1 gap-3 mb-4">
          {filteredUsers.map((user: UserDto) => (
            <div key={user.id} className="card animate-slideDown relative p-3">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-dark-primary/20 flex items-center justify-center">
                    <FiUser className="text-primary dark:text-dark-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-light truncate">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMobileActions(showMobileActions === user.id ? null : user.id);
                  }}
                  className="ml-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiMoreVertical className="text-gray-500" />
                </button>
              </div>

              <div className="mb-3">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role ?? "user")}`}>
                  {getRoleIcon(user.role)}
                  <span>{user.role || "User"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-sm">
                    <FiBriefcase className="text-gray-400 text-sm" />
                    <span className="text-gray-600 dark:text-gray-400">Dept:</span>
                    <span className="font-medium">{user.departmentId || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <FiHash className="text-gray-400 text-sm" />
                    <span className="text-gray-600 dark:text-gray-400">Stage:</span>
                    <span className="font-medium">{user.stage || "N/A"}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`ml-1.5 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.isActive)}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Verified:</span>
                    <span className={`ml-1.5 px-2 py-1 rounded-full text-xs font-medium ${getVerificationBadge(user.isEmailVerified)}`}>
                      {user.isEmailVerified ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <FiCalendar />
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteClick(user)}
                    disabled={deleteUserMutation.isPending}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 disabled:opacity-50"
                  >
                    <FiTrash2 />
                    Delete
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100">
                    <FiEye />
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medium Tablet View (md) */}
      <div className="hidden md:block lg:hidden">
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-2 xs:p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs xs:text-sm">
                    User
                  </th>
                  <th className="text-left p-2 xs:p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs xs:text-sm">
                    Role
                  </th>
                  <th className="text-left p-2 xs:p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs xs:text-sm">
                    Status
                  </th>
                  <th className="text-left p-2 xs:p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs xs:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: UserDto) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-2 xs:p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 xs:w-8 xs:h-8 rounded-full bg-primary/10 dark:bg-dark-primary/20 flex items-center justify-center">
                          <FiUser className="text-primary dark:text-dark-primary text-xs xs:text-sm" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 dark:text-light text-xs xs:text-sm truncate max-w-[120px]">
                            {user.name}
                          </div>
                          <div className="text-[10px] xs:text-xs text-gray-600 dark:text-gray-400 truncate max-w-[120px]">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 xs:p-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          {getRoleIcon(user.role)}
                          <span className={`px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-full text-[10px] xs:text-xs font-medium ${getRoleColor(user.role || "User")}`}>
                            {user.role || "User"}
                          </span>
                        </div>
                        <div className="text-[10px] xs:text-xs text-gray-600 dark:text-gray-400">
                          Dept: {user.departmentId || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 xs:p-3">
                      <div className="space-y-1">
                        <span className={`px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-full text-[10px] xs:text-xs font-medium ${getStatusBadge(user.isActive)}`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                        <div className="text-[10px] xs:text-xs text-gray-600 dark:text-gray-400">
                          Verified: {user.isEmailVerified ? "Yes" : "No"}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 xs:p-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => handleDeleteClick(user)}
                          disabled={deleteUserMutation.isPending}
                          className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 text-[10px] xs:text-xs"
                        >
                          <FiTrash2 className="text-[10px]" />
                          Delete
                        </button>
                        <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 text-[10px] xs:text-xs">
                          <FiEye className="text-[10px]" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Large Desktop View (lg+) */}
      <div className="hidden lg:block xl:hidden">
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">User</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Role</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Department</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: UserDto) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-dark-primary/20 flex items-center justify-center">
                          <FiUser className="text-primary dark:text-dark-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-light">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role || "User")}`}>
                          {user.role || "User"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-gray-700 dark:text-gray-300">
                        {user.departmentId || "N/A"}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Stage: {user.stage || "N/A"}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.isActive)}`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Verified: {user.isEmailVerified ? "Yes" : "No"}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200">
                          <FiEye className="text-sm" />
                        </button>
                        <button className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100">
                          <FiEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          disabled={deleteUserMutation.isPending}
                          className="p-1.5 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 disabled:opacity-50"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Extra Large Desktop View (xl+) */}
      <div className="hidden xl:block card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">User</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Role</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Department</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Stage/Section</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Verified</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Joined</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: UserDto) => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-dark-primary/20 flex items-center justify-center">
                        <FiUser className="text-primary dark:text-dark-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-light">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role || "User")}`}>
                        {user.role || "User"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-700 dark:text-gray-300">
                      {user.departmentId || "N/A"}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="text-gray-700 dark:text-gray-300">
                        Stage: {user.stage || "N/A"}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Section: {user.sectionId || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.isActive)}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getVerificationBadge(user.isEmailVerified)}`}>
                      <div className="flex items-center gap-1">
                        {user.isEmailVerified ? <FiCheck /> : <FiX />}
                        {user.isEmailVerified ? "Verified" : "Pending"}
                      </div>
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(user.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200">
                        <FiEye className="text-sm" />
                      </button>
                      <button className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100">
                        <FiEdit className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        disabled={deleteUserMutation.isPending}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 disabled:opacity-50"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State - Common for all views */}
      {(filteredUsers.length === 0 && usersQuery.data?.length) ? (
        <div className="card text-center py-8 sm:py-12">
          <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-5xl mb-4">
            🔍
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No users found
          </h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">
            Try adjusting your filters to see more results.
          </p>
          <button
            onClick={clearFilters}
            className="text-sm sm:text-base text-primary dark:text-dark-primary hover:opacity-80"
          >
            Clear all filters
          </button>
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="card max-w-md w-full animate-slideDown m-2">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FiTrash2 className="text-red-600 dark:text-red-400 text-lg sm:text-2xl" />
              </div>
              <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-light mb-1.5 sm:mb-2">
                Confirm Delete
              </h3>
              <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400">
                Are you sure you want to delete this user?
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-primary/10 dark:bg-dark-primary/20 flex items-center justify-center">
                  <FiUser className="text-primary dark:text-dark-primary text-xs sm:text-base" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-light text-sm sm:text-base">
                    {userToDelete.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {userToDelete.email}
                  </div>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic">
                This action cannot be undone. All user data will be permanently
                deleted.
              </div>
            </div>

            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
              <button
                onClick={cancelDelete}
                disabled={deleteUserMutation.isPending}
                className="flex-1 btn-secondary text-sm sm:text-base h-10 sm:h-12"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteUserMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl disabled:opacity-50 h-10 sm:h-12 text-sm sm:text-base"
              >
                {deleteUserMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 />
                    Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;