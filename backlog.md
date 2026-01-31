# 📘 StudyBalance – Product Backlog

## 1. Overview

**StudyBalance** is a MERN-stack web application designed to help students manage intensive study periods such as exams, deadlines, and revision phases.  
The application helps users structure their study time, stay focused, and maintain a healthy balance between study sessions and breaks, reducing stress and burnout while improving consistency and productivity.

**Main user types:**
- Guest user
- Registered student

**Epics:**
- User Authentication
- Study Session Planning
- Focus & Break Management
- Progress Tracking
- User Interface & Experience
- Gamification (Nice-to-Have)
- Personalization & Analytics (Nice-to-Have)

---

## 2. Epics

---

## Epic: User Authentication

**Description:**  
Provides functionality for users to register, log in, and log out of the application.

**Value:**  
Ensures secure, personalized access to study data and enables long-term usage.

---

### User Story: Register a new account

- **Title:** Register a new account  
- **User Story:**  
  As a student, I want to create an account so that my study data is saved and accessible across sessions.  
- **User Type:** Guest  
- **Main Goal:** Allow new users to start using StudyBalance with personal data storage.

**Frontend responsibilities (React):**
- Registration view with input fields
- User feedback for successful or failed registration
- Navigation to login after registration

**Backend responsibilities (Node.js / Express):**
- Accept and process registration requests
- Validate user input
- Create new user accounts

**Database responsibilities (MongoDB):**
- Store user profile and authentication information

**Dependencies / Assumptions:** None

---

### User Story: Log in and log out

- **Title:** Log in and log out  
- **User Story:**  
  As a registered student, I want to log in and log out so that my study data remains private.  
- **User Type:** Registered user  
- **Main Goal:** Enable secure access and session control.

**Frontend responsibilities (React):**
- Login view with input fields
- Logout option in the interface
- Display current authentication state

**Backend responsibilities (Node.js / Express):**
- Authenticate user credentials
- Manage login and logout actions

**Database responsibilities (MongoDB):**
- Retrieve stored authentication data

**Dependencies / Assumptions:** User registration exists

---

## Epic: Study Session Planning

**Description:**  
Allows users to plan and organize study sessions on a daily or weekly basis.

**Value:**  
Helps students structure their time and reduce planning stress.

---

### User Story: Plan study sessions

- **Title:** Plan study sessions  
- **User Story:**  
  As a student, I want to plan my study sessions so that I know what and when to study.  
- **User Type:** Registered user  
- **Main Goal:** Provide a clear structure for upcoming study time.

**Frontend responsibilities (React):**
- Daily and weekly planning views
- Forms for creating and editing study sessions
- Display of planned sessions

**Backend responsibilities (Node.js / Express):**
- Create, update, and retrieve study sessions
- Ensure sessions belong to the correct user

**Database responsibilities (MongoDB):**
- Store study session data linked to users

**Dependencies / Assumptions:** Authentication is implemented

---

## Epic: Focus & Break Management

**Description:**  
Supports focused study sessions and reminds users to take breaks.

**Value:**  
Improves concentration while preventing overworking and burnout.

---

### User Story: Use a focus timer

- **Title:** Use a focus timer  
- **User Story:**  
  As a student, I want a focus timer so that I can study in concentrated intervals.  
- **User Type:** Registered user  
- **Main Goal:** Support focused and structured study sessions.

**Frontend responsibilities (React):**
- Focus timer view
- Controls to start, pause, and reset the timer
- Visual feedback during focus sessions

**Backend responsibilities (Node.js / Express):**
- Store completed focus sessions
- Associate sessions with users

**Database responsibilities (MongoDB):**
- Persist focus session records

**Dependencies / Assumptions:** Study sessions exist

---

### User Story: Receive break reminders

- **Title:** Receive break reminders  
- **User Story:**  
  As a student, I want to be reminded to take breaks so that I don’t overwork myself.  
- **User Type:** Registered user  
- **Main Goal:** Encourage healthy study habits.

**Frontend responsibilities (React):**
- Display break notifications or alerts
- Show when breaks start and end

**Backend responsibilities (Node.js / Express):**
- Trigger break reminders based on study sessions

**Database responsibilities (MongoDB):**
- Store break-related preferences if required

**Dependencies / Assumptions:** Focus timer exists

---

## Epic: Progress Tracking

**Description:**  
Tracks completed study sessions and total study time.

**Value:**  
Helps users understand their progress and stay motivated.

---

### User Story: View study progress

- **Title:** View study progress  
- **User Story:**  
  As a student, I want to see my completed study time so that I can measure my productivity.  
- **User Type:** Registered user  
- **Main Goal:** Provide an overview of study performance.

**Frontend responsibilities (React):**
- Progress overview screen
- Display total study time and session count

**Backend responsibilities (Node.js / Express):**
- Aggregate study session data
- Provide progress summaries

**Database responsibilities (MongoDB):**
- Retrieve stored study history

**Dependencies / Assumptions:** Focus sessions are stored

---

## Epic: User Interface & Experience

**Description:**  
Ensures a simple and distraction-free interface.

**Value:**  
Keeps users focused on studying instead of navigating complex UI.

---

### User Story: Use a distraction-free interface

- **Title:** Distraction-free interface  
- **User Story:**  
  As a student, I want a clean interface so that I can focus on studying without distractions.  
- **User Type:** Registered user  
- **Main Goal:** Improve clarity and ease of use.

**Frontend responsibilities (React):**
- Minimal layout and navigation
- Clear access to core features

**Backend responsibilities (Node.js / Express):**
- Provide data needed for UI rendering

**Database responsibilities (MongoDB):**
- No special data requirements

**Dependencies / Assumptions:** Core features exist

---

## Epic: Gamification (Nice-to-Have)

**Description:**  
Adds points, streaks, or achievements to motivate users.

**Value:**  
Increases long-term engagement and motivation.

---

## Epic: Personalization & Analytics (Nice-to-Have)

**Description:**  
Provides advanced statistics and personalization options.

**Value:**  
Allows users to customize their experience and gain deeper insights.
