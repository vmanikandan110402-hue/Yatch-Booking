# Login Troubleshooting Guide

## 🔍 Step-by-Step Debugging

### Step 1: Test Supabase Connection
Open in browser: `http://localhost:3000/api/test-supabase`

**Expected:** `{"success": true, "message": "Supabase connection successful"}`

**If error:**
- Check `.env.local` file exists
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Restart dev server: `npm run dev`

### Step 2: Verify Tables Exist
1. Go to Supabase Dashboard → Table Editor
2. Check if these tables exist:
   - `users`
   - `yachts`
   - `bookings`

**If tables don't exist:**
- Go to SQL Editor in Supabase
- Run `database/supabase_schema.sql` file

### Step 3: Check Environment Variables
Open browser console and check:
```javascript
// In browser console
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

**Or check server logs:**
- Look for warnings about missing Supabase URL/Key
- Check terminal where `npm run dev` is running

### Step 4: Test Login API Directly
Open browser DevTools → Network tab
1. Try to login
2. Check the `/api/auth/login` request
3. Look at the Response tab for error details

### Step 5: Check Admin Credentials
Verify in `.env.local`:
```env
YACHT_ADMIN_EMAIL=yachtadmin@gmail.com
YACHT_ADMIN_PASSWORD=Yachtadmin@123
SUPER_ADMIN_EMAIL=superadmin@gmail.com
SUPER_ADMIN_PASSWORD=Superadmin@123
```

**Important:** 
- No spaces around `=`
- No quotes needed
- Case-sensitive passwords

## 🐛 Common Issues & Solutions

### Issue 1: "Invalid email or password"
**Solution:**
- Check credentials match exactly (case-sensitive)
- Verify `.env.local` has correct values
- Restart dev server after changing `.env.local`

### Issue 2: "Database connection error"
**Solution:**
- Check Supabase project is active
- Verify URL and Key in `.env.local`
- Test connection: `http://localhost:3000/api/test-supabase`

### Issue 3: "Failed to create admin account"
**Solution:**
- Check `users` table exists in Supabase
- Verify SQL schema was run successfully
- Check Supabase logs for errors

### Issue 4: Login works but redirects to wrong page
**Solution:**
- Check user role in Supabase `users` table
- Verify role is: `yacht_admin` or `super_admin` (not `user`)

## ✅ Quick Fix Checklist

1. ✅ `.env.local` file exists in project root
2. ✅ Supabase URL and Key are correct
3. ✅ SQL schema run in Supabase SQL Editor
4. ✅ Tables exist in Supabase Table Editor
5. ✅ Dev server restarted after `.env.local` changes
6. ✅ Credentials match exactly (no typos)
7. ✅ Browser console shows no errors

## 🧪 Test Credentials

**Yacht Admin:**
- Email: `yachtadmin@gmail.com`
- Password: `Yachtadmin@123`

**Super Admin:**
- Email: `superadmin@gmail.com`
- Password: `Superadmin@123`

## 📞 Still Not Working?

1. Check browser console for errors
2. Check terminal/server logs
3. Test Supabase connection: `/api/test-supabase`
4. Verify tables in Supabase Dashboard
5. Check Network tab in DevTools for API response

