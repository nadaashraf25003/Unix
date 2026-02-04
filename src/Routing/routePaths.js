export const ROUTES = {
  // Landing / public
  HOME: "/",

  // Auth
  LOGIN: "/unix/auth/login",
  REGISTER: "/unix/auth/register",
  FORGOT_PASSWORD: "/unix/auth/forgot-password",
  RESET_PASSWORD: "/unix/auth/reset-password",
  RESEND_VERIFICATION: "/unix/auth/resend-verification",
  VERIFY_EMAIL: "/unix/auth/verify-email",

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
