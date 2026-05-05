# TechNova Ticket Booking Platform

A comprehensive, fully-featured ticket booking web application built for TechNova 2025. Developed using React JS and Vite, this platform delivers a highly professional, modern, and engaging user experience. It features dynamic live wallpaper animations, a sleek dark-mode glassmorphism aesthetic, robust Razorpay payment gateway integration, and smart QR code E-Tickets.

## 🌟 Key Features

### 1. Advanced Professional UI/UX
- **Dynamic Aesthetics:** Utilizes a highly polished dark theme with glassmorphism, smooth gradients, and micro-animations.
- **Responsive Design:** Fully responsive interface that adapts seamlessly to desktop, tablet, and mobile displays.
- **Live Backgrounds:** Implements an advanced, non-intrusive animated grid and glowing orb background for a premium feel.

### 2. Comprehensive Booking Flow
- **Multi-Step Registration:** Users can select departments, ticket quantities, and opt into up to 3 specific competitions.
- **Razorpay Integration:** Full integration with Razorpay Checkout for secure, real-time simulated payment processing.
- **Smart E-Tickets:** Upon successful payment, the system generates a downloadable digital ticket with a standard scannable QR code and registration summary.

### 3. Student Dashboard
- **User Insights:** Students can log in to view their active registrations, purchased tickets, and total spending.
- **Quick Actions:** Easy access to book more tickets or view event details directly from the dashboard.
- **Live Stats:** Real-time metrics on the student's involvement in the event.

### 4. Admin Management Panel
- **Real-time Analytics:** Visual tracking of revenue, total tickets sold, active competitions, and system traffic.
- **Event Management:** Admins can create new events, toggle event statuses, and delete events.
- **Automated Refunds:** Deleting an event automatically parses the database and cancels (refunds) all associated student bookings.
- **Booking Oversight:** Complete tabular view of all registered attendees with the ability to manage or revoke bookings.

---

## 🛠 Technology Stack

- **Frontend Framework:** React JS
- **Build Tool:** Vite
- **Styling:** Vanilla CSS3 (Custom Design System, CSS Variables)
- **Payment Gateway:** Razorpay API (Test Mode)
- **Routing & State:** React Hooks, Context API

---

## 🚀 Installation & Setup

Follow these steps to run the project locally.

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Environment Variables
The application uses environment variables for secure API key management.
1. Copy the template file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and add your Razorpay Test Key.
*(Note: A fallback test key is hardcoded in `src/config.js` to ensure the app works out-of-the-box in demo environments).*

### 3. Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 💳 Razorpay Configuration (Test Mode)

To process test payments without actual deductions:
1. Create a free account at [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Toggle the dashboard to **Test Mode** (top-right corner).
3. Navigate to **Settings → API Keys → Generate Test Key**.
4. Use the generated `rzp_test_...` key in your `.env` file.

**Test Payment Credentials:**
- **Card Number:** `4111 1111 1111 1111`
- **Expiry:** Any future date
- **CVV:** Any 3 digits
- **OTP:** `1234`
- **UPI:** `success@razorpay`

---

## 🔐 Default Test Accounts

Use these credentials to test the role-based dashboards:

| Role | Email Address | Password |
|------|---------------|----------|
| **Administrator** | `admin@technova.com` | `admin123` |
| **Student (User)** | `arjun@svce.ac.in` | `arjun123` |
| **Student (User)** | `priya@svce.ac.in` | `priya123` |

---

## 📂 Project Architecture

```text
src/
├── components/          # Reusable UI components
│   ├── ETicket.jsx      # Generates standard QR Code tickets
│   ├── Navbar.jsx       # Global navigation bar
│   └── PaymentModal.jsx # Razorpay checkout interface
├── context/             # Global state management
│   └── AuthContext.jsx  # Authentication state & login logic
├── data/                # Mock databases and configurations
│   └── eventData.js     # Events, competitions, and initial bookings
├── pages/               # Main application views
│   ├── AdminPage.jsx    # Admin dashboard & event management
│   ├── BookingPage.jsx  # Multi-step checkout & payment
│   ├── EventPage.jsx    # Event details and schedule
│   ├── HomePage.jsx     # Landing page with live stats
│   ├── LoginPage.jsx    # User/Admin authentication
│   ├── RegisterPage.jsx # New user registration
│   └── UserDashboard.jsx# Student profile & booking history
├── services/            # External API integrations
│   └── razorpayService.js # Razorpay initialization logic
├── App.jsx              # Root component & routing logic
├── config.js            # Environment variable loader
├── index.css            # Global stylesheet & design system
└── main.jsx             # React DOM entry point
```

---

## 📦 Production Build

To compile the application for production deployment:

```bash
npm run build
```
The optimized static assets will be generated in the `/dist` directory. You can preview the production build locally using:
```bash
npm run preview
```
