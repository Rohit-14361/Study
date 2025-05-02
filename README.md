# 🎓 E-Learning Management System REST API

## 🚀 Introduction
This is a REST API for an **E-Learning Management System** designed to manage users, courses, and related entities to facilitate online learning. The system supports multiple user roles including Admin, Instructor, and Student, each with specific permissions to manage catalog items, courses, profiles, and more.

## 📚 Schemas
The API is structured around the following core schemas:

- 👤 **User**: Represents users of the system including students, instructors, and admins.
- 📝 **Profile**: Contains profile details associated with each user.
- 🔐 **OTP (One Time Password)**: Used for operations such as user verification and password resets.
- 💳 **Razorpay**: Handles payment processing and transaction records via Razorpay.
- 🗂️ **Category**: Represents course categories for catalog organization.
- 🎓 **Courses**: Contains course details including content, pricing, and ownership.
- ⭐ **Rating and Reviews**: User-generated feedback on courses.
- 📈 **Course Progress**: Tracks student progress within courses.
- 📑 **Section and Sub-section**: Structure the course content into sections and subsections.

## 👥 Role-Based API Capabilities

### 🛠️ Admin
- ➕ Create new catalogs by adding categories and organizing courses.
- ✏️ Update existing catalogs to maintain course categories and listings.
- 🗑️ Delete catalogs as necessary.

### 🎤 Instructor
- ➕ Create new courses along with detailed content.
- ✏️ Update course details including content, pricing, and schedule.
- 🗑️ Delete courses.
- 👤 Update and manage their own profile.

### 🎓 Student
- ✏️ Update and 🗑️ delete their own profiles.
- 💰 Purchase/buy courses to enroll and start learning.

### 🌐 Any User
- 🆕 Signup (create new user accounts).
- 🔑 Login (authenticate and receive access tokens).
- 🔄 Reset password (initiate and complete password reset using OTP).
- 🔒 Update password (change existing password).

## 🔐 Authentication
The API supports standard authentication mechanisms to secure user access. Users must authenticate to perform actions based on their roles. OTP verification is employed for secure password resets and account activation.

## 🏁 Getting Started
To start using the API, users need to sign up and authenticate to receive access credentials. Depending on their role (admin, instructor, student), users can access and manage resources as permitted.

---

For more details on endpoints, request methods, request and response formats, please refer to the API documentation (to be provided).

## 📞 Support
For questions or support, please contact the development team.

