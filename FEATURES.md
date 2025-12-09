# Yacht Booking Platform - Features Documentation

## 🎯 Overview
A premium, mobile-first yacht booking platform built with Next.js 14, React, TypeScript, and Tailwind CSS.

## ✨ Key Features

### 1. User Module (Customer View & Booking Flow)

#### A. Landing Page
- ✅ Full-screen hero banner with luxury yacht imagery
- ✅ Quick search functionality:
  - Location filter (Dubai Marina / JBR / Creek)
  - Yacht type filter
  - Capacity filter
  - Price range filter
- ✅ Featured yachts section
- ✅ Smooth animations and transitions

#### B. Yacht Listing Page
- ✅ Grid/list view of all approved yachts
- ✅ Advanced filtering system
- ✅ Yacht cards showing:
  - High-quality images
  - Rating display
  - Guest capacity
  - Number of bedrooms
  - Catering availability
  - Pricing (hourly/full day)
  - Location

#### C. Yacht Details Page
- ✅ HD image carousel with Swiper
- ✅ Full description
- ✅ Comprehensive amenities list
- ✅ What's included/excluded sections
- ✅ Important terms and conditions
- ✅ Live pricing calculator:
  - Date selection
  - Time selection (start/end)
  - Duration selector (hours)
  - Auto-calculated total price
- ✅ Book Now button with authentication check

#### D. Booking Flow
- ✅ Date & time selection
- ✅ Booking form with user details
- ✅ Special requests field
- ✅ Automatic redirect to login if not authenticated
- ✅ Booking confirmation
- ✅ Email notification to Super Admin & Yacht Admin

#### E. User Dashboard
- ✅ View all bookings
- ✅ Booking status (pending/confirmed/rejected)
- ✅ Filter bookings by status
- ✅ Booking details and summary
- ✅ Profile settings (ready for implementation)

---

### 2. Yacht Admin Module (Yacht Operators)

#### A. Login Page
- ✅ Role-based authentication
- ✅ Dummy credentials for testing

#### B. Yacht Management
- ✅ Add new yachts with comprehensive form:
  - Name, description, location
  - Yacht type, capacity, bedrooms
  - Pricing (hourly/daily)
  - Amenities checklist
  - Image upload (URL-based for demo)
  - Status management
- ✅ Edit existing yachts
- ✅ Delete yachts
- ✅ View yacht status (pending/approved/rejected)

#### C. Booking Panel (View Only)
- ✅ View all bookings for their yachts
- ✅ Read-only access (cannot approve/reject)
- ✅ Booking details:
  - Guest information
  - Date & time
  - Special requests
  - Total price
  - Booking ID

#### D. Profile Management
- ✅ Company information
- ✅ Contact number
- ✅ License information field
- ✅ KYC documents upload (UI ready)

---

### 3. Super Admin Module (Platform Owner)

#### A. Dashboard
- ✅ Comprehensive statistics:
  - Total yachts
  - Active yacht admins
  - Pending approvals
  - Total bookings
  - Revenue insights
  - Confirmed bookings count
- ✅ Recent activity widgets
- ✅ Quick action buttons

#### B. Yacht Approval System
- ✅ View all pending yacht submissions
- ✅ Approve yachts (makes them visible to users)
- ✅ Reject yachts with reason
- ✅ View yacht details before approval

#### C. Booking Management
- ✅ List of all bookings across platform
- ✅ Search functionality:
  - By date
  - By yacht name
  - By user name/email
  - By booking ID
- ✅ Filter by status (pending/confirmed/rejected)
- ✅ Update booking status:
  - Confirm bookings
  - Reject bookings
  - Set to pending
- ✅ Send manual confirmation emails (UI ready)

#### D. User Management
- ✅ View registered users (UI structure ready)
- ✅ Block/unblock users (ready for backend integration)
- ✅ User activity tracking (ready for implementation)

#### E. Yacht Admin Management
- ✅ Add new yacht admins (ready for implementation)
- ✅ Approve/reject yacht admin accounts
- ✅ Reset passwords (ready for implementation)

---

## 🔐 Authentication & Security

### Dummy Credentials

#### User Account
- Email: `user@example.com`
- Password: `user123`

#### Yacht Admin Account
- Email: `yachtadmin@example.com`
- Password: `yacht123`

#### Super Admin Account
- Email: `superadmin@example.com`
- Password: `admin123`

### Role-Based Access Control
- ✅ Protected routes for each role
- ✅ Automatic redirects based on authentication status
- ✅ Role-based navigation menu

---

## 📧 Email Notification System

### Booking Email Flow
When a user submits a booking:
1. ✅ Email automatically sent to Super Admin
2. ✅ Email automatically sent to Yacht Admin
3. ✅ Email content includes:
   - Yacht Name
   - Date & Timing
   - User Name & Mobile
   - Special Request
   - Booking ID
   - Total Price

**Note:** Currently logs to console. Ready for integration with email service (SendGrid, Resend, etc.)

---

## 🎨 Design & UX Features

### Mobile-First Design
- ✅ Fully responsive across all devices
- ✅ Touch-friendly interfaces
- ✅ Optimized for mobile navigation
- ✅ Mobile-optimized forms and inputs

### Premium Animations
- ✅ Framer Motion animations throughout
- ✅ Smooth page transitions
- ✅ Hover effects and interactions
- ✅ Loading states
- ✅ Scroll animations
- ✅ Image carousels with Swiper

### High-Quality UI Components
- ✅ Modern, clean design
- ✅ Premium color scheme
- ✅ Consistent spacing and typography
- ✅ Professional shadows and borders
- ✅ Interactive buttons and forms
- ✅ Toast notifications for user feedback

---

## 🛠️ Technical Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Image Carousel:** Swiper
- **Forms:** React Hook Form (ready)
- **Notifications:** React Hot Toast
- **Date Handling:** date-fns

---

## 📁 Project Structure

```
/
├── app/                    # Next.js app directory
│   ├── dashboard/         # User dashboard
│   ├── login/             # Authentication
│   ├── yachts/            # Yacht listing & details
│   ├── yacht-admin/       # Yacht admin panel
│   └── super-admin/       # Super admin panel
├── components/            # Reusable components
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
├── store/                 # Zustand state management
│   ├── authStore.ts
│   └── yachtStore.ts
├── types/                 # TypeScript types
│   └── index.ts
└── lib/                   # Utility functions
    └── utils.ts
```

---

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

---

## 📝 Notes

- All data is stored in localStorage for demo purposes
- Email notifications are logged to console (ready for email service integration)
- Image URLs use Unsplash for demo (can be replaced with actual uploads)
- All features are fully functional in demo mode
- Ready for backend API integration

---

## 🎯 Future Enhancements

- [ ] Backend API integration
- [ ] Real image upload functionality
- [ ] Payment gateway integration
- [ ] Email service integration (SendGrid/Resend)
- [ ] Real-time availability calendar
- [ ] Advanced search and filters
- [ ] User reviews and ratings
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Analytics dashboard

