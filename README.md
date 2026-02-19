# Unix Website 🏫

A modern web-based system designed to improve campus life by integrating **navigation, schedules, room availability, lost & found services, and administrative management** into one unified platform.

**Author:** Nada Ashraf

---

## 📌 Project Overview

The **Unix Website** helps students, instructors, and administrators interact efficiently with campus facilities and services.  
It provides real-time data about rooms, tables, schedules, and campus navigation while ensuring secure access through authentication and role-based authorization.

---

## 🎯 Project Objectives

- Improve campus navigation and accessibility
- Provide real-time room and table availability
- Centralize student schedules and academic data
- Simplify lost & found reporting
- Enable admins to manage campus data efficiently

---

## 🔄 Website Flow

### 1️⃣ Home / Landing Page
**Purpose:** Overview of campus services.

**Features:**
- Navigation bar:
  - Home
  - Campus Map
  - Room Tables
  - Student Schedule
  - Lost & Found
  - Drivers
  - Graduation Projects
  - Login / Register
- Dashboard widgets:
  - Number of free tables
  - Recent lost & found items
  - Quick navigation links

---

### 2️⃣ Authentication (Login / Register)
**Purpose:** Secure access to system features.

**Features:**
- Login using Email & Password
- JWT-based authentication
- Register as Student or Admin
- Protected routes for authenticated users

---

### 3️⃣ Campus Map / Navigation
**Purpose:** Help users navigate the campus.

**Features:**
- Select current location and destination
- Display navigation path (text-based or map)
- Optional building and floor highlighting

---

### 4️⃣ Room Tables
**Purpose:** Show table availability in rooms.

**Features:**
- Filter rooms (Lecture / Lab / Section)
- Color-coded table status:
  - 🟢 Free
  - 🔴 Occupied
- Real-time updates (future enhancement)

---

### 5️⃣ Student Schedule
**Purpose:** Display academic schedules.

**Features:**
- Filter by:
  - Stage
  - Section
  - Student
  - Room
- Schedule table:
  - Columns → Days
  - Rows → Time slots

---

### 6️⃣ Lost & Found
**Purpose:** Report and search lost or found items.

**Features:**
- Report lost or found items
- Search by item type, date, or location
- Mark items as resolved

---

### 7️⃣ Admin Panel (Optional)
**Purpose:** Data management and control.

**Features:**
- Manage:
  - Buildings, floors, rooms, tables
  - Students and sections
  - Schedules
  - Lost & found items
- View real-time availability
- Audit logs for actions

---

## 🛠 Tech Stack

### Frontend
- React.js
- TypeScript
- Tailwind CSS
- React Router
- Axios

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication

---

## 🗄 Database Design

### Main Entities
- Users & Students
- Departments & Sections
- Buildings, Floors & Rooms
- Tables & Table Usage History
- Courses, Instructors & Schedules
- Attendance
- Lost & Found Items
- Notifications & Announcements
- Maintenance & Equipment
- Audit Logs

---

## 🚀 Explore the Project

- 🎤 Presentation & Idea: [View Presentation](https://rby2nsfor34u4.ok.kimi.link/)
- 🌐 Live Demo: [Open Project](https://unix-banha.vercel.app/)
