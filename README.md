# Go Business — Referral Dashboard

A referral management dashboard built with React, Vite, React Router, and the Go Business Referrals API. Partners can securely sign in, track earnings and referral performance, share referral links and codes, and manage referrals through search, sorting, pagination, and detailed referral insights.

## Live Demo

🔗 https://referral-dashboard-beta.vercel.app

## Features

* JWT Authentication
* Protected Routes
* Dashboard Overview Metrics
* Referral Service Summary
* Referral Link & Code Sharing
* Search Referrals
* Sort Referrals by Date
* Client-side Pagination (10 rows per page)
* Referral Detail View
* Responsive Design
* Accessible UI Components

## Tech Stack

* **React 19** – Frontend Library
* **Vite** – Build Tool and Development Server
* **React Router DOM** – Client-Side Routing
* **JavaScript (ES6+)**
* **Axios / Fetch API** – API Integration
* **js-cookie** – Authentication Token Management
* **CSS3** – Styling and Responsive Design

## Getting Started

```bash
npm install
npm run dev
```

The application runs locally at:

```text
http://localhost:5173
```

Build and preview production version:

```bash
npm run build
npm run preview
```

## Test Credentials

```text
Email:    admin@example.com
Password: admin123
```

## Project Structure

```text
src/
  api/
    client.js               API calls and request handling

  components/
    Navbar.jsx              Navigation bar and logout
    Footer.jsx              Footer component
    ProtectedRoute.jsx      Route protection using JWT cookie

  pages/
    Login.jsx               Login page
    Dashboard.jsx           Dashboard page
    ReferralDetail.jsx      Referral details page
    NotFound.jsx            404 page

  utils/
    format.js               Date and currency formatting

  App.jsx                   Route definitions
  main.jsx                  Application entry point
```

## Authentication Flow

1. User signs in using email and password.
2. API returns a JWT token at `data.token`.
3. Token is stored using:

```javascript
Cookies.set('jwt_token', token)
```

4. Protected routes verify authentication using:

```javascript
Cookies.get('jwt_token')
```

5. Authenticated users can access:

   * Dashboard (`/`)
   * Referral Details (`/referral/:id`)

6. Unauthenticated users are redirected to:

```text
/login
```

7. Logout clears the cookie and redirects users to the login page.

## Referrals API Usage

Base URL:

```text
https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals
```

### API Endpoints

| Purpose         | Request                             |
| --------------- | ----------------------------------- |
| Full List       | GET /api/referrals                  |
| Search          | GET /api/referrals?search=<term>    |
| Sort            | GET /api/referrals?sort=asc or desc |
| Single Referral | GET /api/referrals?id=<id>          |

### Key Functionalities

* Search referrals by partner name or service.
* Sort referrals by newest or oldest date.
* View detailed referral information.
* Client-side pagination with 10 records per page.
* Display referral earnings and metrics.

## Accessibility Features

* Proper label and input associations using `htmlFor` and `id`.
* Keyboard-accessible table rows.
* ARIA labels for important sections.
* Error messages announced through `role="alert"` regions.
* Responsive layout for desktop and mobile devices.

## Screenshots

### Login Page

![Login](screenshots/login.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Referral Details

![Referral Details](screenshots/referral-detail.png)

## Deployment

The application is deployed on Vercel as a static Vite build.

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This rewrite ensures React Router handles deep links such as:

```text
/referral/48
```

without returning a 404 error.

## Resume Project Description

**Referral Dashboard | React.js, Vite, React Router, JavaScript, REST APIs**

* Developed a secure referral management dashboard with JWT-based authentication and protected routing.
* Implemented referral analytics, search, sorting, and client-side pagination for efficient data management.
* Integrated REST APIs for referral tracking, earnings overview, and detailed referral insights.
* Built a responsive and accessible user interface following modern React development practices.

## Repository Description

Referral Dashboard built with React, Vite, React Router, JWT Authentication, API Integration, Search, Sorting and Pagination.
