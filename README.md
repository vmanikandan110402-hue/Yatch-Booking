# Yacht Booking Platform

Premium yacht booking platform built with Next.js, React, and TypeScript.

## Features

- **User Module**: Browse yachts, view details, make bookings
- **Yacht Admin Module**: Manage yachts, view bookings
- **Super Admin Module**: Approve yachts, manage all bookings and users

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

1. Create PostgreSQL database
2. Run the SQL schema from `database/schema.sql`
3. Set up environment variables (see `database/README.md`)
4. All users must register through the signup flow
5. Authentication is handled via database API

