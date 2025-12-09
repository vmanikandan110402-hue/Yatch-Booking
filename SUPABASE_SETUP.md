# Supabase Setup Guide - Yacht Booking Platform

## 📋 Complete Setup Instructions

### Step 1: Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up / Login
3. Click "New Project"
4. Fill in:
   - Project Name: `yacht-booking-platform`
   - Database Password: (choose a strong password)
   - Region: (choose closest to you)
5. Wait for project to be created (2-3 minutes)

### Step 2: Run SQL Schema
1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open `database/supabase_schema.sql` from this project
4. **Copy the entire contents** of the file
5. **Paste into Supabase SQL Editor**
6. Click **Run** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

### Step 3: Get Supabase Credentials
1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (under Project URL section)
   - **anon/public key** (under API Keys section)

### Step 4: Configure Environment Variables
1. Create `.env.local` file in project root:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Default Admin Credentials (Demo)
YACHT_ADMIN_EMAIL=yachtadmin@gmail.com
YACHT_ADMIN_PASSWORD=Yachtadmin@123

SUPER_ADMIN_EMAIL=superadmin@gmail.com
SUPER_ADMIN_PASSWORD=Superadmin@123
```

2. Replace with your actual Supabase values from Step 3
3. Admin credentials are for reference - they will work after first login

### Step 5: Install Dependencies
```bash
npm install
```

### Step 6: Start Development Server
```bash
npm run dev
```

## ✅ Verification

### Check Tables in Supabase
1. Go to **Table Editor** in Supabase Dashboard
2. You should see 3 tables:
   - `users`
   - `yachts`
   - `bookings`

### Test Registration
1. Go to `http://localhost:3000/login`
2. Click "Sign Up"
3. Fill form and submit
4. Check Supabase **Table Editor** → `users` table
5. You should see your new user record

### Test Yacht Creation
1. Login as Yacht Admin:
   - Email: `yachtadmin@gmail.com`
   - Password: `Yachtadmin@123`
2. Go to Yacht Admin Dashboard
3. Create a new yacht
4. Check Supabase **Table Editor** → `yachts` table
5. You should see the new yacht with status `pending`

### Test Booking
1. Login as regular user
2. Browse yachts
3. Book a yacht
4. Check Supabase **Table Editor** → `bookings` table
5. You should see the new booking

## 🔑 Default Admin Credentials

These will be auto-created on first login:

**Yacht Admin:**
- Email: `yachtadmin@gmail.com`
- Password: `Yachtadmin@123`

**Super Admin:**
- Email: `superadmin@gmail.com`
- Password: `Superadmin@123`

## 📊 Database Structure

### `users` Table
- Stores all user accounts (users, yacht admins, super admins)
- Fields: id, email, password_hash, name, phone, role, created_at

### `yachts` Table
- Stores all yacht listings
- Fields: id, name, description, location, yacht_type, capacity, bedrooms, has_catering, hourly_price, daily_price, images (JSONB), amenities (JSONB), included (JSONB), excluded (JSONB), terms (JSONB), status, yacht_admin_id, rating, created_at

### `bookings` Table
- Stores all bookings
- Fields: id, yacht_id, yacht_name, user_id, user_name, user_email, user_phone, booking_date, start_time, end_time, hours, total_price, special_request, status, created_at

## 🔄 All Actions Stored in Supabase

✅ **User Registration** → `users` table
✅ **User Login** → Verified from `users` table
✅ **Yacht Creation** → `yachts` table
✅ **Yacht Update** → `yachts` table
✅ **Yacht Approval/Rejection** → `yachts` table (status update)
✅ **Booking Creation** → `bookings` table
✅ **Booking Status Update** → `bookings` table (status update)

## 🚨 Important Notes

1. **No RLS Policies** - Direct table access (as requested)
2. **Password Hashing** - Done automatically with bcryptjs
3. **Auto-timestamps** - `created_at` and `updated_at` handled automatically
4. **JSONB Fields** - Arrays stored as JSONB (images, amenities, etc.)
5. **Foreign Keys** - Data integrity maintained

## 🐛 Troubleshooting

### "Failed to fetch yachts"
- Check `.env.local` has correct Supabase URL and Key
- Verify tables exist in Supabase Table Editor
- Check browser console for errors

### "Registration failed"
- Check Supabase SQL Editor for any errors
- Verify `users` table exists
- Check network tab in browser DevTools

### "Cannot connect to Supabase"
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Restart dev server after changing `.env.local`

## 📝 Next Steps

After setup:
1. ✅ Test registration - data should appear in `users` table
2. ✅ Test yacht creation - data should appear in `yachts` table
3. ✅ Test booking - data should appear in `bookings` table
4. ✅ Test approval/rejection - status should update in `yachts` table
5. ✅ Test booking status update - status should update in `bookings` table

All actions are now stored in Supabase! 🎉

