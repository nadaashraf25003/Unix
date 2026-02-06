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
  FiMoreVertical,
} from "react-icons/fi";
import { FaCrown, FaUser, FaUserShield, FaUserGraduate, FaUserTie } from "react-icons/fa";

interface FilterState {
  search: string;
  role: string;
  verified: string;
}

const AdminUsersPage: React.FC = () => {
  const { usersQuery, deleteUserMutation } = useAdminUsers();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    role: "all",
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
    <div className="p-3 sm:p-4 md:p-6 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-light mb-1 truncate">
              User Management
            </h1>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate">
              Manage all registered users in the system
            </p>
          </div>
          <div className="flex items-center gap-1 xs:gap-2 min-w-fit">
            <div className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              Total Users:{" "}
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
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-600 dark:text-gray-400 text-sm" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
              Filters
            </h3>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 text-sm text-primary dark:text-dark-primary hover:opacity-80"
          >
            {showFilters ? <FiChevronUp /> : <FiChevronDown />}
            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
          </button>
        </div>

        {showFilters && (
          <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            {/* Search Input */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="input pl-10 text-sm h-10 w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                  className="input text-sm h-10 w-full"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              {/* Verification Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Verification
                </label>
                <select
                  value={filters.verified}
                  onChange={(e) => handleFilterChange("verified", e.target.value)}
                  className="input text-sm h-10 w-full"
                >
                  <option value="all">All</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full h-10 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} match{filteredUsers.length !== 1 ? '' : 'es'} filters
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile View (xs-sm) - Compact Cards */}
      <div className="block lg:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {filteredUsers.map((user: UserDto) => (
            <div key={user.id} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 flex items-center justify-center flex-shrink-0">
                    <FiUser className="text-primary dark:text-dark-primary text-sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-light text-sm truncate">
                      {user.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
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
                  className="ml-1 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiMoreVertical className="text-gray-500 text-sm" />
                </button>
              </div>

              {/* Role Badge */}
              <div className="mb-2">
                <div
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                    user.role ?? "user"
                  )}`}
                >
                  {getRoleIcon(user.role)}
                  <span>{user.role || "User"}</span>
                </div>
              </div>

              {/* User Details - Compact Grid */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs">
                    <FiBriefcase className="text-gray-400 text-xs flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">Department:</span>
                    <span className="font-medium truncate">{user.departmentId || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <FiHash className="text-gray-400 text-xs" />
                    <span className="text-gray-600 dark:text-gray-400">Stage:</span>
                    <span className="font-medium">{user.stage || "Not specified"}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span
                      className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${user.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Verified:</span>
                    <span
                      className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getVerificationBadge(
                        user.isEmailVerified
                      )}`}
                    >
                      {user.isEmailVerified ? "Verified" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <FiCalendar className="text-xs" />
                  {new Date(user.createdAt).toLocaleDateString('en-US')}
                </div>
                <button
                  onClick={() => handleDeleteClick(user)}
                  disabled={deleteUserMutation.isPending}
                  className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 transition-colors"
                >
                  <FiTrash2 className="text-xs" />
                  Delete
                </button>
              </div>

              {/* Mobile Action Menu Dropdown */}
              {showMobileActions === user.id && (
                <div 
                  className="absolute right-3 top-10 z-10 mt-1 w-32 rounded-lg bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 animate-slideDown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    <button
                      className="flex items-center gap-1 w-full px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <FiTrash2 className="text-xs" />
                      Delete User
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {filteredUsers.length === 0 && (
            <div className="col-span-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center py-8">
              <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3">
                🔍
              </div>
              <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No users found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Try adjusting your filters to find results
              </p>
              <button
                onClick={clearFilters}
                className="text-sm text-primary dark:text-dark-primary hover:opacity-80"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tablet View (md-lg) */}
      <div className="hidden lg:block xl:hidden">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">User</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Role</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Department</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Verification</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Join Date</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: UserDto) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary-30 flex items-center justify-center">
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
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role || "User")}`}>
                          {user.role || "User"}
                        </span>
                        {getRoleIcon(user.role)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700 dark:text-gray-300">
                        {user.departmentId || "Not specified"}
                      </div>
                      {user.stage && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Stage: {user.stage}
                        </div>
                      )}
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
                        {new Date(user.createdAt).toLocaleDateString('en-US')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(user.createdAt).toLocaleTimeString('en-US', {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteClick(user)}
                          disabled={deleteUserMutation.isPending}
                          className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 transition-colors"
                          title="Delete User"
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

      {/* Desktop View (xl+) */}
      <div className="hidden xl:block">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">User</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Role</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Department</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Stage</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Verification</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Join Date</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: UserDto) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 flex items-center justify-center">
                          <FiUser className="text-primary dark:text-dark-primary text-lg" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-light text-base">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {user.email}
                          </div>
                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs mt-1 ${user.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                            {user.isActive ? "Active" : "Inactive"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getRoleColor(user.role || "User")}`}>
                          {user.role || "User"}
                        </span>
                        {getRoleIcon(user.role)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700 dark:text-gray-300 text-base">
                        {user.departmentId || "Not specified"}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700 dark:text-gray-300">
                        {user.stage || "Not specified"}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getVerificationBadge(user.isEmailVerified)}`}>
                        <div className="flex items-center gap-2">
                          {user.isEmailVerified ? <FiCheck /> : <FiX />}
                          {user.isEmailVerified ? "Verified" : "Pending"}
                        </div>
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('en-US')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(user.createdAt).toLocaleTimeString('en-US', {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteClick(user)}
                          disabled={deleteUserMutation.isPending}
                          className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 transition-colors hover:shadow-lg"
                          title="Delete User"
                        >
                          <FiTrash2 className="text-base" />
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

      {/* Empty State - Common for all views */}
      {(filteredUsers.length === 0 && usersQuery.data?.length) ? (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 text-5xl mb-4">
            🔍
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
            No users found
          </h3>
          <p className="text-base text-gray-500 dark:text-gray-400 mb-4">
            Try adjusting your filters to find results.
          </p>
          <button
            onClick={clearFilters}
            className="text-base text-primary dark:text-dark-primary hover:opacity-80"
          >
            Clear all filters
          </button>
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-10 z-50">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full animate-slideDown m-4 p-5">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="text-red-600 dark:text-red-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-light mb-2">
                Confirm Delete
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Are you sure you want to delete this user?
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 flex items-center justify-center">
                  <FiUser className="text-primary dark:text-dark-primary" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-light">
                    {userToDelete.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {userToDelete.email}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                This action cannot be undone. All user data will be permanently deleted.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={cancelDelete}
                disabled={deleteUserMutation.isPending}
                className="flex-1 btn-secondary text-base h-12"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteUserMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 dark:bg-red-700 dark:hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl disabled:opacity-50 h-12 text-base"
              >
                {deleteUserMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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