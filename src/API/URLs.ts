const Urls = {
  /* =========================
     AUTH
  ========================= */
  // Roles :  Student, Admin, Instructor
  AUTH: {
    LOGIN: "auth/login",
    REGISTER: "auth/register",
    VERIFY_EMAIL: "auth/verify-email",
    RESEND_VERIFICATION: "auth/resend-verification",
    FORGOT_PASSWORD: "auth/forgot-password",
    RESET_PASSWORD: "auth/reset-password",
    REFRESH_TOKEN: "auth/refresh-token",
    APPROVE_USER: "auth/approve-user", // [Authorize(Roles = "Admin")]
  },

  /* =========================
     USERS & PROFILES
  ========================= */
  USERS: {
    GET_ALL: "users", // fetch all users (admin only)
    GET_BY_ID: (id: number) => `users/${id}`,
    DELETE: (id: number) => `users/${id}`, // add this
    ACTIVATE: (id: number) => `users/${id}/activate`,
    DEACTIVATE: (id: number) => `users/${id}/deactivate`,
    GET_PROFILE: "users/profile", // fetch own profile
  },

  STUDENTS: {
    GET_ALL: "students",
    GET_BY_ID: (id: number) => `students/${id}`,
    PROFILE: (studentId: number) => `studentprofile/${studentId}/profile`, 
  },

  INSTRUCTORS: {
    GET_ALL: "instructors", // [Authorize(Roles = "Admin")]
    GET_BY_ID: (id: number) => `instructors/${id}`, // [Authorize(Roles = "Admin")]
  },

  /* =========================
     ACADEMIC
  ========================= */
  DEPARTMENTS: {
    GET_ALL: "departments", //  [Authorize(Roles = "Admin")]
    CREATE: "departments", //  [Authorize(Roles = "Admin")]
    UPDATE: (id: number) => `departments/${id}`, //  [Authorize(Roles = "Admin")]
    DELETE: (id: number) => `departments/${id}`, //  [Authorize(Roles = "Admin")]
  },

  SECTIONS: {
    GET_ALL: "sections", // [Authorize(Roles = "Admin")]
    GET_BY_DEPARTMENT: (departmentId: number) =>
      `sections/by-department/${departmentId}`,
    CREATE: "sections",
    UPDATE: (id: number) => `sections/${id}`,
    DELETE: (id: number) => `sections/${id}`,
  },

  COURSES: {
    GET_ALL: "courses", // [Authorize(Roles = "Admin")]
    CREATE: "courses", // [Authorize(Roles = "Admin")]
    UPDATE: (id: number) => `courses/${id}`, // [Authorize(Roles = "Admin")]
    DELETE: (id: number) => `courses/${id}`, // [Authorize(Roles = "Admin")]
  },

  SCHEDULES: {
    STUDENT: "schedules/student", //  [Authorize(Roles = "Student")]
    SECTION: (sectionId: number) => `schedules/section/${sectionId}`,
    CREATE: "schedules", // [Authorize(Roles = "Admin")]
    UPDATE: (id: number) => `schedules/${id}`, //  [Authorize(Roles = "Admin")]
    DELETE: (id: number) => `schedules/${id}`, //  [Authorize(Roles = "Admin")]
  },

  EXAMS: {
    STUDENT: "exams/student", //  [Authorize(Roles = "Student")]
    CREATE: "exams", //  [Authorize(Roles = "Admin")]
    UPDATE: (id: number) => `exams/${id}`, //  [Authorize(Roles = "Admin")]
    DELETE: (id: number) => `exams/${id}`, //  [Authorize(Roles = "Admin")]
  },

  /* =========================
     GRADUATION PROJECTS
  ========================= */
  PROJECTS: {
    GET_ALL: "projects", // [Authorize]
    CREATE: "projects", //  [Authorize(Roles = "Admin")]
    JOIN: (projectId: number) => `projects/${projectId}/join`, // [Authorize]
    MY_PROJECTS: "projects/my", // [Authorize]
    MEMBERS: (projectId: number) => `projects/${projectId}/members`, // [Authorize]
  },

  /* =========================
     CAMPUS INFRASTRUCTURE
  ========================= */
  BUILDINGS: {
    GET_ALL: "buildings",
    CREATE: "buildings", // [Authorize(Roles = "Admin")]
  },

  ROOMS: {
    GET_ALL: "rooms",
    GET_BY_BUILDING: (buildingId: number) => `rooms/by-building/${buildingId}`,
    AVAILABILITY: "rooms/availability/all",
    CREATE: "rooms", // [Authorize(Roles = "Admin")]
  },

  TABLES: {
    GET_BY_ROOM: (roomId: number) => `tables/room/${roomId}`,
    OCCUPY: "tables/occupy", // [Authorize(Roles = "Student")]
    RELEASE: "tables/release", // [Authorize(Roles = "Student")]
  },

  EQUIPMENT: {
    GET_BY_ROOM: (roomId: number) => `equipment/room/${roomId}`,
    CREATE: "equipment", // [Authorize(Roles = "Admin")]
  },

  MAINTENANCE: {
    CREATE: "maintenance", // [Authorize(Roles = "Student")]
    GET_ALL: "maintenance", // [Authorize(Roles = "Admin")]
    UPDATE_STATUS: (id: number) => `maintenance/${id}/status`, // [Authorize(Roles = "Admin")]
  },

  /* =========================
     CAMPUS NAVIGATION
  ========================= */
  ROOM_PATHS: {
    GET_ALL: "room-paths",
    GET_PATH: (fromRoomId: number, toRoomId: number) =>
      `room-paths/from/${fromRoomId}/to/${toRoomId}`,
    GENERATE: (fromRoomId: number, toRoomId: number) =>
      `room-paths/generate-path?fromRoomId=${fromRoomId}&toRoomId=${toRoomId}`, // new
  },

  /* =========================
     LOST & FOUND
  ========================= */
  LOST_FOUND: {
    GET_ALL: "lost-found",
    CREATE: "lost-found", // [Authorize]
    RESOLVE: (id: number) => `lost-found/${id}/resolve`, // [Authorize(Roles = "Admin")]
    DELETE: (id: number) => `lost-found/${id}`, // [Authorize(Roles = "Admin")]
  },

  /* =========================
     STAGE DRIVERS
  ========================= */
  STAGE_DRIVERS: {
    STUDENT: "stage-drivers/student", //  [Authorize]
    CREATE: "stage-drivers",
    UPDATE: (id: number) => `stage-drivers/${id}`,
    DELETE: (id: number) => `stage-drivers/${id}`, // [Authorize(Roles = "Admin")]
  },

  /* =========================
     ANNOUNCEMENTS & NOTIFICATIONS
  ========================= */
  ANNOUNCEMENTS: {
    GET_ALL: "announcements",
    CREATE: "announcements",
  },

  NOTIFICATIONS: {
    GET_ALL: "notifications", // [Authorize]
    MARK_READ: (id: number) => `notifications/${id}/read`, // [Authorize]
  },

  /* =========================
     DASHBOARD (AGGREGATED)
  ========================= */
  DASHBOARD: {
    STUDENT: "dashboard/student", // [Authorize(Roles = "Student")]
    ADMIN: "dashboard/admin", // [Authorize(Roles = "Admin")]
  },

  /* =========================
     AUDIT & LOGS (ADMIN)
  ========================= */
  AUDIT_LOGS: {
    GET_ALL: "audit-logs", //     [Authorize(Roles = "Admin")]
  },
};

export default Urls;
