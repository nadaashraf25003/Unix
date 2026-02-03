const Urls = {
  /* =========================
     AUTH
  ========================= */
  AUTH: {
    LOGIN: "auth/login",
    REGISTER: "auth/register",
    VERIFY_EMAIL: "auth/verify-email",
    RESEND_VERIFICATION: "auth/resend-verification",
    FORGOT_PASSWORD: "auth/forgot-password",
    RESET_PASSWORD: "auth/reset-password",
    REFRESH_TOKEN: "auth/refresh-token",
    APPROVE_USER: "auth/approve-user",
  },

  /* =========================
     USERS & PROFILES
  ========================= */
  USERS: {
    GET_PROFILE: "users/profile",
    GET_BY_ID: (id: number) => `users/${id}`,
    ACTIVATE: (id: number) => `users/${id}/activate`,
    DEACTIVATE: (id: number) => `users/${id}/deactivate`,
  },

  STUDENTS: {
    GET_ALL: "students",
    GET_BY_ID: (id: number) => `students/${id}`,
  },

  INSTRUCTORS: {
    GET_ALL: "instructors",
    GET_BY_ID: (id: number) => `instructors/${id}`,
  },

  /* =========================
     ACADEMIC
  ========================= */
  DEPARTMENTS: {
    GET_ALL: "departments",
    CREATE: "departments",
    UPDATE: (id: number) => `departments/${id}`,
    DELETE: (id: number) => `departments/${id}`,
  },

  SECTIONS: {
    GET_ALL: "sections",
    GET_BY_DEPARTMENT: (departmentId: number) => `sections/by-department/${departmentId}`,
    CREATE: "sections",
    UPDATE: (id: number) => `sections/${id}`,
    DELETE: (id: number) => `sections/${id}`,
  },

  COURSES: {
    GET_ALL: "courses",
    CREATE: "courses",
    UPDATE: (id: number) => `courses/${id}`,
    DELETE: (id: number) => `courses/${id}`,
  },

  SCHEDULES: {
    STUDENT: "schedules/student",
    SECTION: (sectionId: number) => `schedules/section/${sectionId}`,
    CREATE: "schedules",
    UPDATE: (id: number) => `schedules/${id}`,
    DELETE: (id: number) => `schedules/${id}`,
  },

  EXAMS: {
    STUDENT: "exams/student",
    CREATE: "exams",
    UPDATE: (id: number) => `exams/${id}`,
    DELETE: (id: number) => `exams/${id}`,
  },

  /* =========================
     GRADUATION PROJECTS
  ========================= */
  PROJECTS: {
    GET_ALL: "projects",
    CREATE: "projects",
    JOIN: (projectId: number) => `projects/${projectId}/join`,
    MY_PROJECTS: "projects/my",
    MEMBERS: (projectId: number) => `projects/${projectId}/members`,
  },

  /* =========================
     CAMPUS INFRASTRUCTURE
  ========================= */
  BUILDINGS: {
    GET_ALL: "buildings",
    CREATE: "buildings",
  },

  ROOMS: {
    GET_ALL: "rooms",
    GET_BY_BUILDING: (buildingId: number) => `rooms/by-building/${buildingId}`,
    AVAILABILITY: "rooms/availability",
    CREATE: "rooms",
  },

  TABLES: {
    GET_BY_ROOM: (roomId: number) => `tables/room/${roomId}`,
    OCCUPY: "tables/occupy",
    RELEASE: "tables/release",
  },

  EQUIPMENT: {
    GET_BY_ROOM: (roomId: number) => `equipment/room/${roomId}`,
    CREATE: "equipment",
  },

  MAINTENANCE: {
    CREATE: "maintenance",
    GET_ALL: "maintenance",
    UPDATE_STATUS: (id: number) => `maintenance/${id}/status`,
  },

  /* =========================
     CAMPUS NAVIGATION
  ========================= */
  ROOM_PATHS: {
    GET_ALL: "room-paths",
    GET_PATH: (fromRoomId: number, toRoomId: number) =>
      `room-paths/from/${fromRoomId}/to/${toRoomId}`,
  },

  /* =========================
     LOST & FOUND
  ========================= */
  LOST_FOUND: {
    GET_ALL: "lost-found",
    CREATE: "lost-found",
    RESOLVE: (id: number) => `lost-found/${id}/resolve`,
    DELETE: (id: number) => `lost-found/${id}`,
  },

  /* =========================
     STAGE DRIVERS
  ========================= */
  STAGE_DRIVERS: {
    STUDENT: "stage-drivers/student",
    CREATE: "stage-drivers",
    UPDATE: (id: number) => `stage-drivers/${id}`,
    DELETE: (id: number) => `stage-drivers/${id}`,
  },

  /* =========================
     ANNOUNCEMENTS & NOTIFICATIONS
  ========================= */
  ANNOUNCEMENTS: {
    GET_ALL: "announcements",
    CREATE: "announcements",
  },

  NOTIFICATIONS: {
    GET_ALL: "notifications",
    MARK_READ: (id: number) => `notifications/${id}/read`,
  },

  /* =========================
     DASHBOARD (AGGREGATED)
  ========================= */
  DASHBOARD: {
    STUDENT: "dashboard/student",
    ADMIN: "dashboard/admin",
  },

  /* =========================
     AUDIT & LOGS (ADMIN)
  ========================= */
  AUDIT_LOGS: {
    GET_ALL: "audit-logs",
  },
};

export default Urls;
