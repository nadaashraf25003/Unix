export const ROUTES = {
  // Landing / public
  HOME: "/",
  DEPARTMENTS: "/unix/departments",

  // Profiles
  ADMIN_PROFILE :"/unix/adminprofile",
  STUDENT_PROFILE : "/unix/profile",

  // Home non protected  (All Users)
  CAMPUS_NAVIGATION_HOME :"unix/home/campus-navigation",
  DEPARTMENTS_HOME: "unix/home/departments",

  // Home protected (All Users)
  ROOMS_HOME: "/unix/rooms",
  STUDENT_SCHEDULE_HOME: "/unix/schedule",
  LOST_FOUND_HOME: "/unix/lost-found",
  DRIVERS_HOME: "/unix/drivers",
  GRADUATION_PROJECTS_HOME : "/unix/graduation",


  // Auth
  LOGIN: "/unix/auth/login",
  REGISTER: "/unix/auth/register",
  FORGOT_PASSWORD: "/unix/auth/forgot-password",
  RESET_PASSWORD: "/unix/auth/reset-password",
  RESEND_VERIFICATION: "/unix/auth/resend-verification",
  VERIFY_EMAIL: "/unix/auth/verify-email",
  LOST_FOUND_ADMIN: "/unix/lost-found-admin",

  // Student Protected
  HOME_STUDENT: "/unix/home",
  ROOMS: "/unix/rooms",
  LOST_FOUND: "/unix/lost-found",
  DRIVERS: "/unix/drivers",
  GRADUATION_PROJECTS: "/unix/graduation",

  // Admin Protected
  ADMIN_DASHBOARD: "/unix/dashboard",
  SCHEDULE_MANAGEMENT: "/unix/schedulemang",
  DRIVERS_MANAGEMENT: "/unix/driversmang",
  USERS: "/unix/users",
  DEPARTMENTS: "/unix/departments",
  SECTIONS: "/unix/sections",
  COURSES: "/unix/courses",
  INSTRUCTORS: "/unix/instructors",
  PROJECTS: "/unix/projects",

  // Shared / Campus
  CAMPUS_MAP: "/unix/campus-map",
  STUDENT_SCHEDULE: "/unix/schedule",
  CAMPUS_NAVIGATION: "/unix/campus-navigation",
};
