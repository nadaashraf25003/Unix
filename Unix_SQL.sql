-- ==========================
-- User Table
SET IDENTITY_INSERT Users ON;

INSERT INTO Users (Id, Name, Email, PasswordHash, Role, IsActive, CreatedAt) VALUES
(1, 'Alice Ahmed', 'alice@example.com', 'hashedpassword1', 0, 1, GETDATE()),
(2, 'Bob Samir', 'bob@example.com', 'hashedpassword2', 0, 1, GETDATE()),
(3, 'Carol Nabil', 'carol@example.com', 'hashedpassword3', 1, 1, GETDATE()),
(4, 'David Hany', 'david@example.com', 'hashedpassword4', 2, 1, GETDATE()),
(5, 'Eman Fawzy', 'eman@example.com', 'hashedpassword5', 2, 1, GETDATE());

SET IDENTITY_INSERT Users OFF;
-- Department Table
-- ==========================
SET IDENTITY_INSERT Departments ON;
INSERT INTO Departments (Id, Name, Code) VALUES
(1, 'Computer Engineering', 'CENG'),
(2, 'Electronics Engineering', 'EENG'),
(3, 'Mechanical Engineering', 'MENG'),
(4, 'Civil Engineering', 'CIVL'),
(5, 'Architecture', 'ARCH');
SET IDENTITY_INSERT Departments OFF;
-- ==========================
-- Section Table
-- ==========================
SET IDENTITY_INSERT Sections ON;
INSERT INTO Sections (Id, DepartmentId, Stage, Name) VALUES
(1, 1, 3, 'CENG-3A'),
(2, 1, 3, 'CENG-3B'),
(3, 2, 2, 'EENG-2A'),
(4, 3, 1, 'MENG-1A'),
(5, 4, 4, 'CIVL-4A');
SET IDENTITY_INSERT Sections OFF;
-- ==========================
-- Student Table
-- ==========================
SET IDENTITY_INSERT Students ON;
INSERT INTO Students (Id, UserId, DepartmentId, Stage) VALUES
(1, 1, 1, 3),
(2, 2, 1, 3),
(3, 6, 2, 2),
(4, 7, 3, 1),
(5, 8, 4, 4);
SET IDENTITY_INSERT Students OFF;
-- ==========================
-- AdminProfile Table
-- ==========================
SET IDENTITY_INSERT AdminProfiles ON;
INSERT INTO AdminProfiles (Id, UserId, DepartmentId, CreatedAt) VALUES
(1, 3, NULL, GETDATE()),
(2, 9, 1, GETDATE()),
(3, 10, 2, GETDATE()),
(4, 11, 3, GETDATE()),
(5, 12, NULL, GETDATE());
SET IDENTITY_INSERT AdminProfiles OFF;
-- ==========================
-- Course Table
-- ==========================
SET IDENTITY_INSERT Courses ON;
INSERT INTO Courses (Id, CourseName, CourseCode) VALUES
(1, 'Digital Logic Design', 'CENG301'),
(2, 'Microcontrollers', 'CENG302'),
(3, 'Signals & Systems', 'EENG201'),
(4, 'Thermodynamics', 'MENG101'),
(5, 'Structural Analysis', 'CIVL401');
SET IDENTITY_INSERT Courses OFF;
-- ==========================
-- Instructor Table
-- ==========================
SET IDENTITY_INSERT Instructors ON;
INSERT INTO Instructors (Id, FullName, Email, DepartmentId) VALUES
(1, 'Dr. Karim Saad', 'karim@example.com', 1),
(2, 'Dr. Mona Hossam', 'mona@example.com', 2),
(3, 'Dr. Ahmed Khaled', 'ahmed@example.com', 3),
(4, 'Dr. Sara Tamer', 'sara@example.com', 4),
(5, 'Dr. Nabil Farouk', 'nabil@example.com', 1);
SET IDENTITY_INSERT Instructors OFF;
-- ==========================
-- Room Table
-- ==========================
SET IDENTITY_INSERT Rooms ON;
INSERT INTO Rooms (Id, BuildingId, FloorId, RoomCode, RoomType, Capacity) VALUES
(1, 1, 1, 'B1-F1-R101', 'Lecture', 50),
(2, 1, 1, 'B1-F1-R102', 'Lab', 30),
(3, 2, 2, 'B2-F2-R201', 'Lecture', 60),
(4, 2, 2, 'B2-F2-R202', 'Lab', 25),
(5, 3, 1, 'B3-F1-R101', 'Lecture', 40);
SET IDENTITY_INSERT Rooms OFF;
-- ==========================
-- Building Table
-- ==========================
SET IDENTITY_INSERT Buildings ON;
INSERT INTO Buildings (Id, Name, Description) VALUES
(1, 'Engineering Block A', 'Main block for computer engineering classes'),
(2, 'Engineering Block B', 'Electronics and Mechanical labs'),
(3, 'Civil Block', 'Civil engineering classrooms'),
(4, 'Architecture Block', 'Architecture studios'),
(5, 'Admin Block', 'Administration and faculty offices');
SET IDENTITY_INSERT Buildings OFF;
-- ==========================
-- StageDriver Table
-- ==========================
SET IDENTITY_INSERT StageDrivers ON;
INSERT INTO StageDrivers (Id, Stage, DepartmentId, Title, Type, Link, CreatedAt) VALUES
(1, 3, 1, 'Logic Design Notes', 'PDF', 'http://example.com/logic.pdf', GETDATE()),
(2, 3, 1, 'Microcontroller Lab Manual', 'PDF', 'http://example.com/micro.pdf', GETDATE()),
(3, 2, 2, 'Signals Notes', 'PDF', 'http://example.com/signals.pdf', GETDATE()),
(4, 1, 3, 'Thermodynamics Slides', 'PDF', 'http://example.com/thermo.pdf', GETDATE()),
(5, 4, 4, 'Structural Analysis Handbook', 'PDF', 'http://example.com/struct.pdf', GETDATE());
SET IDENTITY_INSERT StageDrivers OFF;
-- ==========================
-- GraduationProject Table
-- ==========================
SET IDENTITY_INSERT GraduationProjects ON;
INSERT INTO GraduationProjects (Id, ProjectName, CreatedAt) VALUES
(1, 'Smart Campus App', GETDATE()),
(2, 'Automated Irrigation System', GETDATE()),
(3, 'Solar-Powered Car', GETDATE()),
(4, 'AI-based Tutor', GETDATE()),
(5, 'Robotics Arm', GETDATE());
SET IDENTITY_INSERT GraduationProjects OFF;
-- ==========================
-- ProjectMember Table
-- ==========================
SET IDENTITY_INSERT ProjectMembers ON;
INSERT INTO ProjectMembers (Id, ProjectId, StudentId, CreatedAt) VALUES
(1, 1, 1, GETDATE()),
(2, 1, 2, GETDATE()),
(3, 2, 2, GETDATE()),
(4, 3, 1, GETDATE()),
(5, 4, 1, GETDATE());

SET IDENTITY_INSERT ProjectMembers OFF;

-- ==========================
-- StudentProfile Table
-- ==========================
SET IDENTITY_INSERT StudentProfiles ON;
INSERT INTO StudentProfiles (Id, StudentId, SectionId, Semester, CreatedAt, UpdatedAt) VALUES
(1, 1, 1, '2025-2026-Spring', GETDATE(), GETDATE()),
(2, 2, 2, '2025-2026-Spring', GETDATE(), GETDATE()),
(3, 3, 3, '2025-2026-Fall', GETDATE(), GETDATE()),
(4, 4, 4, '2025-2026-Fall', GETDATE(), GETDATE()),
(5, 5, 5, '2025-2026-Spring', GETDATE(), GETDATE());
SET IDENTITY_INSERT StudentProfiles OFF;
-- ==========================
-- CourseAssignment Table
-- ==========================
SET IDENTITY_INSERT CourseAssignments ON;
INSERT INTO CourseAssignments (Id, CourseId, SectionId) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 2),
(4, 4, 4),
(5, 5, 5);
SET IDENTITY_INSERT CourseAssignments OFF;
-- ==========================
-- InstructorCourse Table
-- ==========================
SET IDENTITY_INSERT InstructorCourses ON;
INSERT INTO InstructorCourses (Id, InstructorId, CourseId) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 3),
(4, 3, 4),
(5, 5, 5);
SET IDENTITY_INSERT InstructorCourses OFF;
-- ==========================
-- Schedule Table
-- ==========================
SET IDENTITY_INSERT Schedules ON;
INSERT INTO Schedules (Id, CourseId, RoomId, SectionId, InstructorId, DayOfWeek, StartTime, EndTime) VALUES
(1, 1, 1, 1, 1, 'Monday', '09:00', '10:30'),
(2, 2, 2, 1, 1, 'Tuesday', '11:00', '12:30'),
(3, 3, 3, 2, 2, 'Wednesday', '10:00', '11:30'),
(4, 4, 4, 4, 3, 'Thursday', '13:00', '14:30'),
(5, 5, 5, 5, 5, 'Friday', '08:30', '10:00');
SET IDENTITY_INSERT Schedules OFF;
-- ==========================
-- Exam Table
-- ==========================
SET IDENTITY_INSERT Exams ON;
INSERT INTO Exams (Id, CourseId, SectionId, RoomId, InstructorId, Stage, ExamDate, StartTime, EndTime, ExamType, CreatedAt) VALUES
(1, 1, 1, 1, 1, 3, '2026-05-10', '09:00', '11:00', 'Midterm', GETDATE()),
(2, 2, 1, 2, 1, 3, '2026-05-15', '12:00', '14:00', 'Final', GETDATE()),
(3, 3, 2, 3, 2, 2, '2026-06-01', '10:00', '12:00', 'Quiz', GETDATE()),
(4, 4, 4, 4, 3, 1, '2026-06-05', '08:00', '10:00', 'Lab', GETDATE()),
(5, 5, 5, 5, 5, 4, '2026-06-10', '09:30', '11:30', 'Final', GETDATE());
SET IDENTITY_INSERT Exams OFF;
-- ==========================
-- RoomAvailability Table
-- ==========================
SET IDENTITY_INSERT RoomAvailabilities ON;
INSERT INTO RoomAvailabilities (Id, RoomId, DayOfWeek, StartTime, EndTime, IsAvailable) VALUES
(1, 1, 'Monday', '08:00', '12:00', 1),
(2, 2, 'Tuesday', '09:00', '13:00', 1),
(3, 3, 'Wednesday', '10:00', '14:00', 1),
(4, 4, 'Thursday', '08:00', '12:00', 1),
(5, 5, 'Friday', '09:00', '11:00', 1);
SET IDENTITY_INSERT RoomAvailabilities OFF;
-- ==========================
-- Equipment Table
-- ==========================
SET IDENTITY_INSERT Equipment ON;
INSERT INTO Equipment (Id, Name, RoomId, Quantity) VALUES
(1, 'Projector', 1, 2),
(2, 'Lab PC', 2, 20),
(3, '3D Printer', 3, 1),
(4, 'Microscope', 4, 5),
(5, 'Whiteboard', 5, 3);
SET IDENTITY_INSERT Equipment OFF;
-- ==========================
-- Notifications Table
-- ==========================
SET IDENTITY_INSERT Notifications ON;
INSERT INTO Notifications (Id, UserId, Message, IsRead, CreatedAt) VALUES
(1, 1, 'Welcome to SmartCampus!', 0, GETDATE()),
(2, 2, 'New exam schedule available.', 0, GETDATE()),
(3, 3, 'Admin meeting at 3 PM.', 0, GETDATE()),
(4, 4, 'Your course assignment is updated.', 0, GETDATE()),
(5, 5, 'Lab schedule has changed.', 0, GETDATE());
SET IDENTITY_INSERT Notifications OFF;
-- ==========================
-- Announcements Table
-- ==========================
SET IDENTITY_INSERT Announcements ON;
INSERT INTO Announcements (Id, Title, Content, CreatedById, CreatedAt) VALUES
(1, 'Semester Break', 'Semester break starts from May 20.', 3, GETDATE()),
(2, 'New Library Rules', 'Library timings updated.', 3, GETDATE()),
(3, 'Maintenance Alert', 'Water supply maintenance on May 15.', 3, GETDATE()),
(4, 'Guest Lecture', 'AI guest lecture on May 18.', 3, GETDATE()),
(5, 'Project Submission', 'Final project submission deadline May 25.', 3, GETDATE());
SET IDENTITY_INSERT Announcements OFF;
-- ==========================
-- LostAndFoundItem Table
-- ==========================
SET IDENTITY_INSERT LostAndFoundItem ON;
INSERT INTO LostAndFoundItem (Id, ItemName, ItemType, Location, Date, ContactInfo, ReportedById, IsResolved) VALUES
(1, 'Black Backpack', 'Bag', 'CENG-3A', '2026-02-01', 'alice@example.com', 1, 0),
(2, 'Calculator', 'Electronics', 'Lab-102', '2026-02-02', 'bob@example.com', 2, 0),
(3, 'ID Card', 'Card', 'Library', '2026-02-03', 'carol@example.com', 1, 0),
(4, 'Water Bottle', 'Accessory', 'Cafeteria', '2026-02-04', 'david@example.com', 4, 0),
(5, 'Notebook', 'Stationery', 'EENG-2A', '2026-02-05', 'eman@example.com', 5, 0);
SET IDENTITY_INSERT LostAndFoundItem OFF;
-- ==========================
-- TableEntity Table
-- ==========================
SET IDENTITY_INSERT TableEntity ON;
INSERT INTO TableEntity (Id, RoomId, TableNumber, IsOccupied, LastUpdated) VALUES
(1, 1, 1, 0, GETDATE()),
(2, 1, 2, 0, GETDATE()),
(3, 2, 1, 1, GETDATE()),
(4, 2, 2, 0, GETDATE()),
(5, 3, 1, 0, GETDATE());
SET IDENTITY_INSERT TableEntity OFF;
-- ==========================
-- TableUsageHistory Table
-- ==========================
SET IDENTITY_INSERT TableUsageHistory ON;
INSERT INTO TableUsageHistory (Id, TableId, UserId, StartTime, EndTime) VALUES
(1, 3, 1, '2026-02-01 09:00', '2026-02-01 10:00'),
(2, 1, 2, '2026-02-02 10:00', '2026-02-02 11:00'),
(3, 4, 3, '2026-02-03 11:00', '2026-02-03 12:00'),
(4, 2, 4, '2026-02-04 12:00', '2026-02-04 13:00'),
(5, 5, 5, '2026-02-05 13:00', '2026-02-05 14:00');
SET IDENTITY_INSERT TableUsageHistory OFF;
-- ==========================
-- AuditLog Table
-- ==========================
SET IDENTITY_INSERT AuditLog ON;
INSERT INTO AuditLog (Id, UserId, Action, CreatedAt) VALUES
(1, 1, 'User logged in', GETDATE()),
(2, 2, 'Updated profile', GETDATE()),
(3, 3, 'Created course', GETDATE()),
(4, 4, 'Assigned instructor', GETDATE()),
(5, 5, 'Deleted exam', GETDATE());

SET IDENTITY_INSERT AuditLog OFF;