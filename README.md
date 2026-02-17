# 🏆 Sports Carnival Management System (Mobile App)

## 📌 Project Overview
The **Sports Carnival Management System** is a cross-platform mobile application built using **React Native** for managing sports events, teams, match schedules, and results with **role-based access control**.

The application is developed as part of a structured training program and follows **MVVM architecture**, clean code principles, and industry-standard development practices.

## 🛠 Technology Stack
- **React Native** (Android & iOS)
- **TypeScript**
- **React Navigation**
- **MVVM Architecture**
- **ESLint & Prettier**
- **REST API Integration** (Mock & Real APIs)

## 👥 User Roles & Permissions

### 🔑 Admin
- Manage users and roles
- Create, edit, and delete all events
- Monitor teams, schedules, and results
- View system-wide reports

### 🧑‍🏫 Organizer
- Manage assigned sports events
- Define event rules and team limits
- Approve team registrations
- Generate match schedules
- Update match results and status

### 🏃 Participant
- View available sports events
- Create or join teams
- Register for events
- View match schedules, results, and standings

## ✨ Core Features
- Authentication and role-based access
- Event creation and management
- Team creation, joining, and management
- Match scheduling and fixtures
- Result tracking and standings
- Live match status updates
- Notifications for event updates
- Clean, modern, mobile-first UI

## 📁 Project Structure
```text
src/
 ├── components/     # Reusable UI components
 ├── views/          # Application screens
 ├── viewModels/     # Business logic (MVVM)
 ├── models/         # TypeScript interfaces
 ├── services/       # API and data services
 ├── navigation/     # App navigation
 ├── utils/          # Helper utilities
 └── constants/      # App constants
```

## ▶️ Getting Started

### Install dependencies
```bash
npm install
```

### Run on Android
```bash
npm run android
```

### Run on iOS
```bash
npm run ios
```

### 🧪 Useful Scripts
```bash
npm run lint        # Run ESLint checks
npm run lint:fix    # Fix ESLint issues
npm run format      # Format code using Prettier
```