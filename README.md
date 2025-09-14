# 💪🏼 Fitness Tracker Web Application

## 📄 Overview
**Fitness Tracker** is a full-stack fitness tracking web application designed to help users manage their health and wellness goals. With its intuitive interface and robust features, this application provides a comprehensive platform for tracking your fitness journey.

- **Frontend:** React.js (with Context API for state management)
- **Backend:** Python Flask
- **Database:** MySQL (Hosted on AWS RDS)
- **Containerization:** Docker
- **Authentication:** JSON Web Tokens (JWT)
- **Deployment:** Docker and AWS

---

## 🚀 Key Features

### 🔐 Secure User Management
Users can create secure accounts with their first name, last name, and birthdate. Account creation is straightforward, and users can even add a profile picture. The application uses **JSON Web Tokens (JWT)** for a secure authentication system, protecting user data and ensuring all backend requests are authenticated.

### 🥗 Calorie Counter
This feature allows users to meticulously track their daily food intake. Users can enter food items and their calorie counts into four categories: **breakfast**, **lunch**, **dinner**, and **snacks**. All entries can be **edited**, **deleted**, and **stored**, with the ability to view any day's log.

### 🏋🏼‍♂️ Workout Log
Users can log their workouts, including details like **calories burned** and **total time**. This feature provides a detailed history of physical activity, and just like the calorie counter, entries can be **edited** or **deleted** as needed, allowing for accurate and flexible tracking.

### 🎯 Goal Tracking
The application includes a dedicated system for managing personal fitness goals. Users can add, modify, or delete goals and categorize them as **Active**, **Completed**, or **Abandoned**. This feature displays all goals with their start and end dates, providing a clear overview of progress.

### 💻 Responsive UI & Navigation
The application features a clean, responsive, and collapsible navigation bar that provides easy access to key pages:
- **Stats**: Displays and allows users to edit personal metrics like height and weight.
- **Profile**: A dedicated page to view and update personal information and the profile picture.
- **Settings**: Includes a secure account deletion feature.
- **Notifications**: (Coming Soon) A future page for app-related notifications.

<!-- ---

## 🛠️ Local Setup Instructions

### ✅ Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (installed and running)
- [Git](https://git-scm.com/)
- [Make](https://www.gnu.org/software/make/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/wildcat-credit-union.git
cd wildcat-credit-union
```
### 2. Configure Environment Variables
Create a .env file in both the client/ and server/ directories:
- client/.env

For the Google Maps API, you will need to obtain a free API key from the Google Cloud Console.
Follow their instructions to enable the Maps JavaScript API and generate your key.
```bash
REACT_APP_Maps_API_KEY=your_api_key_here
REACT_APP_Maps_MAP_ID=fd06dc25e21bc77e58abb98f
```
- server/.env

For the database, you'll need to configure the connection details for your MySQL instance. 
If you are running MySQL locally or via Docker, MYSQL_HOST will likely be localhost or the name of your database service within Docker Compose (e.g., db).
```bash
MYSQL_HOST=localhost # Or your database service name if using Docker Compose (e.g., 'db')
MYSQL_USER=root # Or your preferred MySQL username
MYSQL_PASSWORD=your_mysql_root_password
MYSQL_DATABASE=wildcat_credit_union_db # Or your preferred database name
```
### 3. Run the Application
Ensure Docker Desktop is running, then from the root project directory:
```bash
make run
```
Once the containers are up, open your browser and navigate to:
http://localhost:3000

### 4. Stop and Clean Up
To stop the application:
- Press Ctrl + C

To clean up the Docker containers:
```bash
make clean
```

---

## 📱 Usage Guide
### 1. Register
Create a secure user account with your personal details

### 2. Login
Log in with your new credentials

### 3. Explore:
- **Log your meals** to track your daily calories
- **Record your workouts** to monitor your physical activity
- **Set personal goals** to stay motivated and track your progress
- **Update your profile** with your latest stats and a new profile picture

---

<!-- ## Pre-reqs

Install Docker Desktop and Make

- run `make run` to start the services
- run `make clean` to stop/delete the service instances
