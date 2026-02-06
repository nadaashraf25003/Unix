import React from "react";
import { Outlet } from "react-router-dom";

export default function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-light dark:bg-dark">
      
      {/* Header */}
      <header className="h-16 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="h-full px-6 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">U</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Unix<span className="text-primary dark:text-dark-primary"></span>
            </h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">U</span>
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