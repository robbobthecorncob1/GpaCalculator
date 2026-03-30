# GPA Calculator Frontend

<https://gpacalculator.adamhilty.com>

This is a modern, responsive web application built with React, Vite, and TypeScript. It currently features a fully functional GPA Calculator that leverages a custom C# backend for precise calculations.

## About

### Tech Stack

* **Framework:** React
* **Language:** TypeScript
* **Styling:** HTML5 & SCSS
* **Hosting/Deployment:** AWS Amplify
* **Backend Integration:** Communicates with a C# / .NET API hosted on AWS Elastic Beanstalk.

### Key Features

* **Dynamic Course Management:** Easily add, edit, and remove classes, credits, and grades.
* **Standard GPA Calculation:** Calculates your current standing instantly via the backend API.
* **Target GPA Planner:** Input your desired GPA and future credit hours to find out exactly what average you need in upcoming semesters to hit your goal.
* **Responsive Design:** Built with CSS Flexbox to ensure a seamless experience across desktop and mobile devices.

## Local Setup

### Prerequisites

* [Node.js](https://nodejs.org/en/download) installed
* *Optional but recommended:* The companion [C# backend repository](https://github.com/robbobthecorncob1/ProfileCore) cloned and running locally.

## Installation & Setup

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/robbobthecorncob1/GpaCalculator
cd GpaCalculator
npm install
```

### 2. Configure Environment Variables

This project uses React environments to switch between local development and production API URLs. Ensure your .env.development and .env.production files are configured to point to your local C# backend (default is 5126):

```bash
VITE_API_URL=YOUR_API_URL_HERE
```

### 3. Start the Development Server

```bash
npm run dev
```

Navigate to <http://localhost:5173/> in your browser. The application will automatically reload if you change any of the source files.

## Deployment

This frontend is continuously deployed using AWS Amplify.

When code is pushed to the main branch, Amplify automatically triggers a build using the .env.production file, which points to the live production C# API: <https://api.adamhilty.com/api/gpa>

## Author

Adam Hilty

B.S. Computer Science and Engineering  
The Ohio State University (May 2026)
