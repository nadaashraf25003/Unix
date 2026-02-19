import { ROUTES } from "@/Routing/routePaths";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UnixFeatures from "./UnixFeatures";

export default function LandingPage() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState({
    schedules: false,
    exams: false,
    freeRooms: false,
    projects: false,
  });

  const token = localStorage.getItem("accessToken");
  const login = token ? "unix/" : ROUTES.LOGIN;
  const register = token ? "unix/" : ROUTES.REGISTER;
  const getStartedLink = ROUTES.REGISTER;
  const campusNavigation = ROUTES.CAMPUS_NAVIGATION;
  const user = localStorage.getItem("user");
  const role = user ? JSON.parse(user).role : null; // "Admin" | "Student"
  const profile =
    role === "Admin" ? ROUTES.ADMIN_PROFILE : ROUTES.STUDENT_PROFILE;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate(ROUTES.HOME);
  };

  const toggleDropdown = (menu) => {
    setDropdownOpen((prev) => ({
      schedules: menu === "schedules" ? !prev.schedules : false,
      exams: menu === "exams" ? !prev.exams : false,
      freeRooms: menu === "freeRooms" ? !prev.freeRooms : false,
      projects: menu === "projects" ? !prev.projects : false,
    }));
  };

  const closeDropdowns = () => {
    setDropdownOpen({
      schedules: false,
      exams: false,
      freeRooms: false,
      projects: false,
    });
  };

  // Navigation menu data with proper routes
  const menuItems = [
    {
      key: "schedules",
      label: "Schedules",
      icon: "",
      items: [
        {
          label: "Student Schedule",
          url: ROUTES.STUDENT_SCHEDULE,
          roles: ["Student", "Instructor", "Admin"],
        },
        {
          label: "Schedule Management",
          url: ROUTES.SCHEDULE_MANAGEMENT,
          roles: ["Admin"],
        },
        // {
        //   label: "Exams Schedule",
        //   url: ROUTES.EXAMS_MANAGEMENT,
        //   roles: ["Student", "Instructor", "Admin"]
        // },
      ],
      mainUrl: ROUTES.STUDENT_SCHEDULE,
    },
    {
      key: "exams",
      label: "Exams",
      icon: "",
      items: [
        {
          label: "Upcoming Exams",
          url: ROUTES.EXAMS_HOME,
          roles: ["Student", "Instructor", "Admin"],
        },
        {
          label: "Exam Management",
          url: ROUTES.EXAMS_MANAGEMENT,
          roles: ["Admin"],
        },
        // {
        //   label: "Exam Rules",
        //   url: ROUTES.EXAMS_RULES,
        //   roles: ["Student", "Instructor"]
        // },
      ],
      mainUrl: ROUTES.EXAMS_HOME,
    },
    {
      key: "freeRooms",
      label: "Rooms",
      icon: "",
      items: [
        {
          label: "Find Rooms",
          url: ROUTES.CAMPUS_NAVIGATION,
          roles: ["Student", "Instructor", "Admin"],
        },
        {
          label: "Room Availability",
          url: ROUTES.ROOMS,
          roles: ["Student", "Instructor", "Admin"],
        },
        // {
        //   label: "Room Management",
        //   url: ROUTES.ROOMS_MANAGEMENT,
        //   roles: ["Admin"]
        // },
      ],
      mainUrl: ROUTES.ROOMS_HOME,
    },
    {
      key: "projects",
      label: "Projects",
      icon: " ",
      items: [
        {
          label: "Graduation Projects",
          url: ROUTES.GRADUATION_PROJECTS_HOME,
          roles: ["Student", "Instructor", "Admin"],
        },
        {
          label: "Project Management",
          url: ROUTES.DRIVERS_MANAGEMENT,
          roles: ["Admin"],
        },
        // {
        //   label: "Project Submissions",
        //   url: ROUTES.PROJECTS_SUBMISSIONS,
        //   roles: ["Student"]
        // },
      ],
      mainUrl: ROUTES.GRADUATION_PROJECTS_HOME,
    },
  ];

  // Filter items based on user role
  const getFilteredItems = (items) => {
    if (!token || !role) return items;
    return items.filter((item) => !item.roles || item.roles.includes(role));
  };

  // Component: Dropdown Menu
  const DropdownMenu = ({ menu }) => {
    const filteredItems = getFilteredItems(menu.items);

    if (filteredItems.length === 0) return null;

    return (
      <div className="relative group">
        <Link
          to={menu.mainUrl}
          className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-dark-primary"
          onMouseEnter={() => toggleDropdown(menu.key)}
        >
          <span>{menu.icon}</span>
          <span className="font-medium">{menu.label}</span>
          {filteredItems.length > 1 && (
            <span
              className={`transform transition-transform ml-1 ${dropdownOpen[menu.key] ? "rotate-180" : ""}`}
            >
              ▾
            </span>
          )}
        </Link>

        {dropdownOpen[menu.key] && filteredItems.length > 1 && (
          <div
            className="absolute z-50 mt-2 w-64 bg-white dark:bg-dark-card rounded-xl shadow-card dark:shadow-card-dark border border-gray-200 dark:border-gray-700 animate-slideDown overflow-hidden"
            onMouseLeave={() => toggleDropdown(menu.key)}
          >
            <div className="py-2 max-h-96 overflow-y-auto scrollbar-thin">
              {filteredItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.url}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-dark-primary transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                  onClick={closeDropdowns}
                >
                  <span className="w-2 h-2 rounded-full bg-primary dark:bg-dark-primary"></span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Component: Button
  const Button = ({
    children,
    variant = "primary",
    size = "md",
    className = "",
    ...props
  }) => {
    const baseStyles =
      "font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 active:scale-95";

    const variants = {
      primary:
        "bg-primary text-white hover:bg-primary/90 focus:ring-primary dark:bg-dark-primary dark:hover:bg-dark-primary/80 dark:focus:ring-dark-primary shadow-lg hover:shadow-xl",
      secondary:
        "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary dark:bg-dark-secondary dark:hover:bg-dark-secondary/80 dark:focus:ring-dark-secondary",
      ghost:
        "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };

  // Component: Card
  const Card = ({ children, className = "", hover = true }) => (
    <div
      className={`bg-white dark:bg-dark-card rounded-2xl shadow-card dark:shadow-card-dark p-6 transition-all duration-300 ${hover ? "hover:shadow-card-hover hover:-translate-y-1" : ""} ${className}`}
    >
      {children}
    </div>
  );

  // Component: Feature Card
  const FeatureCard = ({ icon, title, description, color }) => (
    <Card
      hover
      className="text-center border border-gray-200 dark:border-gray-700"
    >
      <div
        className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl bg-${color}/10 dark:bg-dark-${color}/20`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-gray-50 dark:from-dark dark:via-dark-bg dark:to-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-dark-card/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Link to Home */}
            <Link to={ROUTES.HOME} className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary dark:from-dark-primary dark:to-dark-secondary flex items-center justify-center text-white font-bold text-xl">
                U
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary dark:from-dark-primary dark:to-dark-secondary bg-clip-text text-transparent">
                  UNIX
                </span>
              </div>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {menuItems.map((menu) => (
                <DropdownMenu key={menu.key} menu={menu} />
              ))}

              {/* Additional Links */}
              {/* {token && (
                <>
                  <Link
                    to={ROUTES.CAMPUS_NAVIGATION}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-dark-primary"
                  >
                    <span>🗺️</span>
                    <span className="font-medium">Campus Map</span>
                  </Link>
                  <Link
                    to={ROUTES.LOST_FOUND_ADMIN}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-dark-primary"
                  >
                    <span>🔍</span>
                    <span className="font-medium">Lost & Found</span>
                  </Link>
                </>
              )} */}
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <span className="text-sm font-medium">Banha University</span>
              </div>

              {token ? (
                <>
                  <Link to={profile}>
                    <Button variant="ghost" size="sm">
                      Profile
                    </Button>
                  </Link>
                  <Button variant="primary" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to={login}>
                    <Button variant="ghost" size="sm">
                      Log in
                    </Button>
                  </Link>
                  <Link to={register}>
                    <Button variant="primary" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Rest of your component remains the same... */}
      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-8">
        {/* Hero Content */}
        <section className="text-center py-16 md:py-10">
          <section className="relative text-center py-16 md:py-32 px-4 bg-light dark:bg-dark">
            {/* Hero Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.15]">
              <span className="text-gray-900 dark:text-light">
                <span className="block">
                  Your{" "}
                  <span className="relative">
                    <span className="text-primary dark:text-dark-primary font-black">
                      Schedules
                    </span>
                    <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-transparent dark:from-dark-primary"></span>
                  </span>
                </span>
                <span className="block">
                  <span className="relative">
                    <span className="text-secondary dark:text-dark-secondary font-black">
                      Exams
                    </span>
                    <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-secondary to-transparent dark:from-dark-secondary"></span>
                  </span>
                  , &{" "}
                  <span className="relative">
                    <span className="text-info dark:text-dark-info font-black">
                      Projects
                    </span>
                    <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-info to-transparent dark:from-dark-info"></span>
                  </span>
                </span>
                <span className="block mt-6">
                  <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black">
                    <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-light dark:via-gray-300 dark:to-light bg-clip-text text-transparent">
                      Together.
                    </span>
                  </span>
                </span>
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              UNIX is a smart campus management system that brings schedules,
              exams, rooms
              <br className="hidden md:block" />
              and academic resources together in one place.
            </p>

            {/* Call-to-Action Button */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {token ? (
                <Link to={profile}>
                  <Button variant="primary" size="lg">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to={register}>
                  <Button variant="primary" size="lg">
                    Get Started Free
                  </Button>
                </Link>
              )}
            </div>
          </section>

          {/* Features Section */}
          <section className="pt-20">
            <UnixFeatures />
          </section>

          {/* Pricing Section */}
          <section className="py-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Pick a plan that fits</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Choose the perfect plan for your academic journey. Upgrade or
                downgrade anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
              {/* Most Popular Badge - Positioned absolutely to float above the middle card */}
              {/* <div className="md:col-start-2 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-primary dark:bg-dark-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              </div> */}

              {/* Free Plan */}
              <Card className="relative flex flex-col h-full border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-dark-primary">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Perfect for getting started
                  </p>

                  <div className="mb-6">
                    <span className="text-5xl font-bold">EGP 0</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      /forever
                    </span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="text-primary dark:text-dark-primary mt-1">
                        ✓
                      </span>
                      <span>View schedules & timetables</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary dark:text-dark-primary mt-1">
                        ✓
                      </span>
                      <span>Campus map search</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary dark:text-dark-primary mt-1">
                        ✓
                      </span>
                      <span>Browse public projects</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary dark:text-dark-primary mt-1">
                        ✓
                      </span>
                      <span>Basic lost & found</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary dark:text-dark-primary mt-1">
                        ✓
                      </span>
                      <span>Community support</span>
                    </li>
                  </ul>
                </div>

                <Link to={getStartedLink} className="block mt-auto">
                  <Button variant="ghost" size="lg" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </Card>

              {/* Student Plus Plan */}
              <Card className="relative flex flex-col h-full border-2 border-primary dark:border-dark-primary shadow-xl scale-105 md:scale-110 z-20">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Student Plus</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    For serious students
                  </p>

                  <div className="mb-6">
                    <span className="text-5xl font-bold">EGP 49</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      /semester
                    </span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="text-primary dark:text-dark-primary mt-1">
                        ✓
                      </span>
                      <span>Everything in Free</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary dark:text-dark-primary mt-1">
                        ✓
                      </span>
                      <span>Smart reminders & alerts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary dark:text-dark-primary mt-1">
                        ✓
                      </span>
                      <span>Early room availability</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary dark:text-dark-primary mt-1">
                        ✓
                      </span>
                      <span>Study material downloads</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary dark:text-dark-primary mt-1">
                        ✓
                      </span>
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary dark:text-dark-primary mt-1">
                        ✓
                      </span>
                      <span>Ad-free experience</span>
                    </li>
                  </ul>
                </div>

                <Link to={register} className="block mt-auto">
                  <Button variant="primary" size="lg" className="w-full">
                    Upgrade Now
                  </Button>
                </Link>
              </Card>

              {/* TA / Admin Plan */}
              <Card className="relative flex flex-col h-full border-2 border-gray-200 dark:border-gray-700 hover:border-secondary dark:hover:border-dark-secondary">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">TA / Admin</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    For teaching staff
                  </p>

                  <div className="mb-6">
                    <span className="text-5xl font-bold">EGP 99</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      /semester
                    </span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="text-primary dark:text-dark-primary mt-1">
                        ✓
                      </span>
                      <span>Everything in Student Plus</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary dark:text-dark-primary mt-1">
                        ✓
                      </span>
                      <span>Moderation tools</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary dark:text-dark-primary mt-1">
                        ✓
                      </span>
                      <span>Department analytics</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary dark:text-dark-primary mt-1">
                        ✓
                      </span>
                      <span>Bulk schedule updates</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary dark:text-dark-primary mt-1">
                        ✓
                      </span>
                      <span>Admin dashboard</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary dark:text-dark-primary mt-1">
                        ✓
                      </span>
                      <span>Dedicated support</span>
                    </li>
                  </ul>
                </div>

                <Link
                  to={ROUTES.CONTACT_SALES || "#"}
                  className="block mt-auto"
                >
                  <Button variant="ghost" size="lg" className="w-full">
                    Contact Sales
                  </Button>
                </Link>
              </Card>
            </div>
          </section>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-info/10 dark:from-dark-primary/10 dark:via-dark-secondary/10 dark:to-dark-info/10 rounded-3xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Campus Experience?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of students already using UNIX to manage their
                academic life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {token ? (
                  <Link to={profile}>
                    <Button variant="primary" size="lg">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to={register}>
                    <Button variant="primary" size="lg">
                      Get Started Free
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link to={ROUTES.HOME} className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary dark:from-dark-primary dark:to-dark-secondary flex items-center justify-center text-white font-bold text-xl">
                  U
                </div>
                <span className="text-xl font-bold">UNIX</span>
              </Link>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Benha University - © {new Date().getFullYear()} UNIX System
            </p>
            {/* <div className="flex items-center space-x-6">
              {[
                { label: "Privacy", url: ROUTES.PRIVACY },
                { label: "Terms", url: ROUTES.TERMS },
                { label: "Contact", url: ROUTES.CONTACT },
                { label: "Help", url: ROUTES.HELP }
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.url}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-dark-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
