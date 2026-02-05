// SmartCampusFeatures.jsx
import { ROUTES } from "@/Routing/routePaths";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Campus Map",
    description:
      "Navigate through the campus easily. Select your current location and destination to get directions to any room or building.",
    icon: "🗺️",
    category: "Navigation",
    badge: "Live",
    badgeColor: "bg-brand-success",
    gradient: "from-info/10 to-info/5",
    darkGradient: "from-dark-info/20 to-transparent",
    link: ROUTES.CAMPUS_NAVIGATION_HOME,
  },
  {
    title: "Room Tables",
    description:
      "Check real-time table availability in lecture halls and labs. See which tables are free or occupied at a glance.",
    icon: "🪑",
    category: "Utilities",
    badge: "Real-time",
    badgeColor: "bg-brand-warning",
    gradient: "from-warning/10 to-warning/5",
    darkGradient: "from-dark-warning/20 to-transparent",
    link: ROUTES.ROOMS_HOME,
  },
  {
    title: "Student Schedule",
    description:
      "View schedules for students, sections, or rooms. Quickly identify free and busy time slots with visual indicators.",
    icon: "📅",
    category: "Academic",
    badge: "Updated",
    badgeColor: "bg-info",
    gradient: "from-primary/10 to-primary/5",
    darkGradient: "from-dark-primary/20 to-transparent",
    link: ROUTES.STUDENT_SCHEDULE_HOME,
  },
  {
    title: "Lost & Found",
    description:
      "Report lost or found items and search through reported items with filters like type, location, or date.",
    icon: "🔍",
    category: "Services",
    badge: "Active",
    badgeColor: "bg-secondary",
    gradient: "from-secondary/10 to-secondary/5",
    darkGradient: "from-dark-secondary/20 to-transparent",
    link: ROUTES.LOST_FOUND_HOME,
  },
  {
    title: "Drivers Management",
    description:
      "Manage and track drivers for campus transportation. Ensure students get from one building to another safely.",
    icon: "🚗",
    category: "Transport",
    badge: "Tracking",
    badgeColor: "bg-primary",
    gradient: "from-success/10 to-success/5",
    darkGradient: "from-dark-success/20 to-transparent",
    link: ROUTES.DRIVERS_HOME,
  },
  {
    title: "Graduation Projects",
    description:
      "View, manage, and showcase graduation projects of students, including project details and progress tracking.",
    icon: "🎓",
    category: "Academic",
    badge: "Showcase",
    badgeColor: "bg-brand-info",
    gradient: "from-warning/10 to-primary/5",
    darkGradient: "from-dark-info/20 to-transparent",
    link: ROUTES.GRADUATION_PROJECTS_HOME,
  },
  {
  title: "Departments",
  description:
    "Explore all university departments and their sections. View stages, sections, and department details in multiple layouts.",
  icon: "🏛️",
  category: "Academic",
  badge: "Core",
  badgeColor: "bg-primary",
  gradient: "from-primary/10 to-primary/5",
  darkGradient: "from-dark-primary/20 to-transparent",
  link: ROUTES.DEPARTMENTS_HOME,
},

];

const UnixFeatures = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", ...new Set(features.map((f) => f.category))];

  const filteredFeatures = features.filter((feature) => {
    const matchesCategory =
      selectedCategory === "All" || feature.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBackToHome = () => {
    navigate(ROUTES.HOME);
  };

  return (
    // <section className="bg-gray-100 dark:bg-dark-bg min-h-screen py-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Main Features of{" "}
            <span className="text-primary dark:text-dark-primary">Unix</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore the comprehensive suite of smart campus features designed to
            enhance student life and campus management.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature, index) => (
            <div
            onClick={() => navigate(feature.link)}
              key={index}
              className={`card group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]`}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} dark:${feature.darkGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl p-2 bg-white dark:bg-dark-card rounded-xl shadow-sm">
                      {feature.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-primary dark:group-hover:text-dark-primary transition-colors">
                        {feature.title}
                      </h2>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {feature.category}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`${feature.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}
                  >
                    {feature.badge}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                  {feature.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button className="text-primary dark:text-dark-primary font-medium hover:underline flex items-center gap-1">
                    Learn more
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </button>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Click to explore
                  </span>
                </div>
              </div>

              {/* Hover Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary dark:from-dark-primary dark:to-dark-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          ))}
        </div>

       
      </div>
    // </section>
  );
};

export default UnixFeatures;
