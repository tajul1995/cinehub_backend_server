# CineHub – Movie and Series Rating & Streaming Portal

## Project Overview

CineHub is a full-stack web application that allows users to explore, rate, review, and stream movies and TV series. The platform also includes an admin panel for managing content, moderating reviews, and analyzing user activity.

The system is designed with a focus on performance, security, scalability, and a clean user experience.

---

## Live Links

Frontend: https://your-frontend.vercel.app
Backend: https://your-backend-api.com

---

## Features

### User Features

* User registration and login (email/password or social login)
* Browse movies and series by genre, year, rating, and platform
* Rate content on a 1–10 scale
* Write reviews with tags and spoiler warnings
* Like and comment on reviews
* Add content to a personal watchlist
* Purchase or rent movies/series
* View purchase history
* Edit or delete unpublished reviews

---

### Admin Features

* Add, update, and delete movies/series
* Manage metadata (title, genre, year, cast, director, platform)
* Approve or unpublish reviews
* Remove inappropriate content
* View analytics (ratings, engagement, activity)
* Manage user-generated content

---

## Core Modules

### Authentication

* JWT-based authentication
* Password hashing
* Password reset functionality

---

### Media Library

* Admin-controlled content management
* Includes:

  * Title
  * Description
  * Genre
  * Release year
  * Director and cast
  * Streaming platform
  * Pricing (free or premium)
  * Trailer link

---

### Review System

* Rating system (1–10)
* Review submission with tags and spoiler option
* Admin approval workflow
* Like and comment functionality

---

### Payment System

* Subscription model (monthly/yearly)
* Integration with Stripe or SSLCommerz
* Booking and access management

---

### Search and Filtering

* Search by title, genre, cast, or director
* Filter by rating, year, and platform
* Sort by popularity, rating, or latest

---

### Admin Dashboard

* Review moderation
* User activity tracking
* Aggregated analytics and reports

---

## Pages

* Home Page (featured, trending, top rated)
* All Movies/Series Page
* Movie/Series Details Page
* User Profile Page
* Admin Dashboard
* Subscription Page
* Additional pages (About, Contact, FAQ)

---

## Technology Stack

### Frontend

* Next.js
* Tailwind CSS
* Framer Motion

### Backend

* Node.js
* Express.js
* Prisma ORM

### Database

* PostgreSQL

### Authentication

* JWT-based custom authentication

### Payment Integration

* Stripe or SSLCommerz

### Deployment

* Frontend: Vercel
* Backend: Render or Railway

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/cinehub.git
cd cinehub
```

---

### Environment Variables

Create a `.env` file and add:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
NEXT_PUBLIC_API_URL=your_backend_url
STRIPE_SECRET_KEY=your_key
```

---

### Install Dependencies

```bash
npm install
```

---

### Run Development Server

```bash
npm run dev
```

---

## Deployment

### Frontend

```bash
vercel --prod
```

### Backend

Deploy using Render, Railway, or a VPS.

---

## Security Notes

* Do not commit `.env` files
* Store all secrets in environment variables
* Rotate keys if exposed
* Use HTTPS in production

---

## Future Improvements

* Recommendation system
* Notification system
* Advanced analytics dashboard
* Mobile application

---

## Author

Tajul Islam

---

## License

This project is licensed under the MIT License.
