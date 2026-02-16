import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Bell, BellRing } from "lucide-react";
import useNotifications from "@/Hooks/useNotifications";
import { clearToken } from "@/API/token";

export default function StudentLayout() {
  const { notificationsQuery } = useNotifications();

  // Calculate unread notifications count
  const notifications = notificationsQuery.data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  let user = null;
  const navigate = useNavigate();
  try {
    const userString = localStorage.getItem("user");
    user = userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }
  const userName = user?.name || "shadcn";

    const handleLogout = () => {
      clearToken(); // Remove accessToken from localStorage
      localStorage.removeItem("user"); // Remove user data
      window.dispatchEvent(new Event("storage")); // Notify other components
      navigate("/"); // Redirect to login
    };
  

  return (
    <div className="min-h-screen flex flex-col bg-light dark:bg-dark">
      {/* Header */}
      <header className="h-16 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">U</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Unix<span className="text-primary dark:text-dark-primary"></span>
            </h1>
          </Link>

          {/* Right Section - Notifications & User */}
          <div className="flex items-center space-x-4">
            {/* Notifications Bell with Count */}
            <Link
              to="/unix/notifications"
              className="relative group"
              aria-label="Notifications"
            >
              <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                {unreadCount > 0 ? (
                  <BellRing className="w-5 h-5 text-primary dark:text-dark-primary" />
                ) : (
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}

                {/* Unread Count Badge */}
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[20px] h-5 
                                 bg-secondary dark:bg-dark-secondary 
                                 text-white text-xs font-bold 
                                 flex items-center justify-center
                                 rounded-full px-1.5
                                 shadow-lg shadow-secondary/30 dark:shadow-dark-secondary/30
                                 animate-pulse"
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>

              {/* Tooltip on Hover */}
              <div
                className="absolute right-0 top-full mt-2 
                            opacity-0 group-hover:opacity-100 
                            transition-opacity duration-200
                            pointer-events-none z-50"
              >
                <div
                  className="bg-gray-900 dark:bg-gray-800 text-white text-xs 
                              rounded-lg px-3 py-2 whitespace-nowrap shadow-lg"
                >
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                    : "No new notifications"}
                  <div
                    className="absolute -top-1 right-4 w-2 h-2 
                                bg-gray-900 dark:bg-gray-800 
                                transform rotate-45"
                  ></div>
                </div>
              </div>
            </Link>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div
                  className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 
                              dark:from-primary/10 dark:to-secondary/10 
                              rounded-lg flex items-center justify-center
                              border border-gray-200 dark:border-gray-700"
                >
                  <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                    U
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                { userName}
                </span>
              </button>

              {/* Dropdown Menu (optional) */}
              <div
                className="absolute right-0 top-full mt-2 
                            opacity-0 invisible group-hover:opacity-100 group-hover:visible
                            transition-all duration-200
                            min-w-[200px] bg-white dark:bg-dark-card 
                            rounded-lg shadow-card dark:shadow-card-dark
                            border border-gray-200 dark:border-gray-700
                            z-50"
              >
                <div className="py-2">
                  <Link
                    to="/unix/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 
                                 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 
                                 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Home
                  </Link>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 
                                   hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="card min-h-[calc(100vh-12rem)]">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-700">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Unix System
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Banha University
          </div>
        </div>
      </footer>
    </div>
  );
}
