import DefaultProfilePic from "@/assets/default-avatar.png";
import { ROUTES } from "@/Routing/routePaths";

/* =======================
   Types
======================= */
export type Role = "Admin" | "Student" | "Instructor";

interface User {
  name: string;
  email: string;
  role: Role;
}

interface NavItem {
  title: string;
  icon: string;
  url: string;
  roles?: Role[]; // 👈 allowed roles
}

interface NavSection {
  section: string;
  icon: string;
  items: NavItem[];
}

/* =======================
   Get user from localStorage
======================= */
let user: User | null = null;

try {
  const userString = localStorage.getItem("user");
  user = userString ? JSON.parse(userString) : null;
} catch (error) {
  console.error("Error parsing user from localStorage:", error);
}

const userName = user?.name || "shadcn";
const userEmail = user?.email || "m@example.com";
const userRole: Role = user?.role || "Admin";

/* =======================
   Role-based filter
======================= */
function filterSideNavByRole(sideNav: NavSection[], role: Role): NavSection[] {
  return sideNav
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.roles || item.roles.includes(role)
      ),
    }))
    .filter((section) => section.items.length > 0);
}

/* =======================
   Base navigation config
   for all roles
======================= */
const sideNav: NavSection[] = [
  {
    section: "Main",
    icon: "Dashboard",
    items: [
      { title: "Profile", icon: "", url: ROUTES.HOME_STUDENT },
      { title: "Dashboard", icon: "", url: ROUTES.ADMIN_DASHBOARD, roles: ["Admin"] },
      { title: "Schedule", icon: "CalendarMonth", url: ROUTES.STUDENT_SCHEDULE }, 
      { title: "Campus Map", icon: "Map", url: ROUTES.CAMPUS_NAVIGATION },
      { title: "Lost & Found", icon: "ReportProblem", url: ROUTES.LOST_FOUND },
      { title: "Drivers", icon: "DriveEta", url: ROUTES.DRIVERS ,roles: ["Student", "Instructor"]},
    ],
  },
  {
    section: "Graduation Projects",
    icon: "School",
    items: [
      { title: "Projects", icon: "Folder", url: ROUTES.GRADUATION_PROJECTS, roles: ["Student", "Instructor","Admin"] },
      { title: "Manage Projects", icon: "ManageAccounts", url: ROUTES.PROJECTS, roles: ["Admin"] },
    ],
  },
  {
    section: "Drivers",
    icon: "School",
    items: [
      { title: "Drivers", icon: "DriveEta", url: ROUTES.DRIVERS ,roles: ["Admin"]},
      { title: "Drivers Management", icon: "DriveEta", url: ROUTES.DRIVERS_MANAGEMENT, roles: ["Admin"] },
    ],
  },
  {
    section: "Rooms",
    icon: "",
    items: [
      { title: "Rooms", icon: "MeetingRoom", url: ROUTES.ROOMS },
    ],
  },
  {
    section: "Admin Dashboard",
    icon: "DashboardCustomize",
    items: [
      
      { title: "Users", icon: "", url: ROUTES.USERS, roles: ["Admin"] },
      { title: "Departments", icon: "", url: ROUTES.DEPARTMENTS, roles: ["Admin"] },
      { title: "Sections", icon: "", url: ROUTES.SECTIONS, roles: ["Admin"] },
      { title: "Courses", icon: "MenuBook", url: ROUTES.COURSES, roles: ["Admin"] },
      { title: "Instructors", icon: "Person", url: ROUTES.INSTRUCTORS, roles: ["Admin"] },
      { title: "Projects", icon: "Folder", url: ROUTES.PROJECTS, roles: ["Admin"] },
      { title: "Schedule Management", icon: "CalendarMonth", url: ROUTES.SCHEDULE_MANAGEMENT, roles: ["Admin"] },
    ],
  },
];

/* =======================
   Exported user data
======================= */
export const userData = (role: Role) => ({
  userTopNav: {
    name: userName,
    email: userEmail,
    avatar: DefaultProfilePic,
    role,
    items: [
      { title: "Profile", url: ROUTES.HOME_STUDENT },
      { title: "Logout", url: ROUTES.LOGIN },
    ],
  },
  sideNav: filterSideNavByRole(sideNav, role),
});

