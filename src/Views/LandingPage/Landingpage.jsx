import { ROUTES } from "@/Routing/routePaths";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  // const exploreLink = ROUTES.FEATURES;
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

  // Navigation menu data
  const menuItems = [
    {
      key: "schedules",
      label: "Schedules",
      items: [
        "Weekly Schedule",
        "Daily Schedule",
        "Exam Schedule",
        "Calendar View",
      ],
      url: ROUTES.STUDENT_SCHEDULE,
    },
    {
      key: "exams",
      label: "Exams",
      items: ["Upcoming Exams", "Past Exams", "Results", "Exam Rules"],
    },
    {
      key: "freeRooms",
      label: "Rooms",
      items: ["Find Rooms"],
    },
    {
      key: "projects",
      label: "Projects",
      items: [
        "Graduation Projects",
        // "Individual Projects",
        // "Submission",
        // "Templates",
      ],
    },
  ];

  // Component: Dropdown Menu
  const DropdownMenu = ({ menu }) => (
    <div className="relative group">
      <button
        onClick={() => toggleDropdown(menu.key)}
        onMouseEnter={() => toggleDropdown(menu.key)}
        className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-dark-primary"
      >
        <span>{menu.icon}</span>
        <span className="font-medium">{menu.label}</span>
        <span
          className={`transform transition-transform ${dropdownOpen[menu.key] ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {dropdownOpen[menu.key] && (
        <div
          className="absolute z-50 mt-2 w-56 bg-white dark:bg-dark-card rounded-xl shadow-card dark:shadow-card-dark border border-gray-200 dark:border-gray-700 animate-slideDown overflow-hidden"
          onMouseLeave={() => toggleDropdown(menu.key)}
        >
          <div className="py-2 max-h-80 overflow-y-auto scrollbar-thin">
            {menu.items.map((item, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-dark-primary transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
              >
                <span className="w-2 h-2 rounded-full bg-primary dark:bg-dark-primary"></span>
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );

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
        onClick={()=> navigate(url)}
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
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary dark:from-dark-primary dark:to-dark-secondary flex items-center justify-center text-white font-bold text-xl">
                U
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary dark:from-dark-primary dark:to-dark-secondary bg-clip-text text-transparent">
                  UNIX
                </span>
              </div>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {menuItems.map((menu) => (
                <DropdownMenu key={menu.key} menu={menu} />
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                {/* <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Egypt.svg/20px-Flag_of_Egypt.svg.png"
                  alt="Egypt Flag"
                  className="w-5 h-5"
                /> */}
                <span className="text-sm font-medium">Banha University</span>
              </div>

              {token ? (
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <a href={login}>
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </a>
              )}
              {token ? (
                <a href={profile}>
                  <Button variant="primary" size="sm">
                    My Account
                  </Button>
                </a>
              ) : (
                <a href={register}>
                  <Button variant="primary" size="sm">
                    Explore
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-8">
        {/* Hero Content */}
        <section className="text-center py-16 md:py-24">
          <section className="relative text-center py-16 md:py-32 px-4 bg-light dark:bg-dark">
            {/* Hero Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight tracking-tight text-gray-900 dark:text-light">
              Your
              <br className="sm:hidden" />
              <span className="underline decoration-primary dark:decoration-dark-primary decoration-4 md:decoration-8 underline-offset-8">
                📕 Schedules
              </span>{" "}
              <span className="underline decoration-secondary dark:decoration-dark-secondary decoration-4 md:decoration-8 underline-offset-8">
                📋 docs
              </span>
              , & <br className="hidden sm:block" />
              <span className="underline decoration-info dark:decoration-dark-info decoration-4 md:decoration-8 underline-offset-8">
                🎯 projects
              </span>
              . Together.
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
              {/* <a
                href={getStartedLink}
                className="bg-primary dark:bg-dark-primary text-white font-semibold py-3 px-8 rounded-lg text-base hover:bg-primary/90 dark:hover:bg-dark-primary/90 transition-colors duration-200 text-center"
              > */}
              {token ? (
                <a href={profile}>
                  <Button variant="primary" size="lg">
                    My Account
                  </Button>
                </a>
              ) : (
                <a href={register}>
                  <Button variant="primary" size="lg">
                    Get Started Free
                  </Button>
                </a>
              )}

              {/* {token ? "My Account" : "Get Started Free"} */}
              {/* </a> */}
            </div>

            {/* Illustration Section */}
          </section>

          {/* Hero Illustration */}

          {/* Features Section */}
          <section className="pt-20">
            <UnixFeatures />
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
                  <a href={profile}>
                    <Button variant="primary" size="lg">
                      My Account
                    </Button>
                  </a>
                ) : (
                  <a href={register}>
                    <Button variant="primary" size="lg">
                      Get Started Free
                    </Button>
                  </a>
                )}
                {/* <Button variant="secondary" size="lg">
                  <a href={exploreLink}>Unix Features</a>
                </Button> */}
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
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary dark:from-dark-primary dark:to-dark-secondary flex items-center justify-center text-white font-bold text-xl">
                  U
                </div>{" "}
                <span className="text-xl font-bold">UNIX</span>
              </div>
            </div>
            {/* <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                © {new Date().getFullYear()} Campus Management System
              </p> */}
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Benha University - © {new Date().getFullYear()} UNIX System
            </p>
            {/* <div className="flex items-center space-x-6">
              {["Privacy", "Terms", "Contact", "Help"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-dark-primary transition-colors"
                >
                  {item}
                </a>
              ))}
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
