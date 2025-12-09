# Environment Variables Setup

## Create `.env.local` file in project root

Copy the following content and create `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# ============================================
# Default Admin Credentials (Demo)
# ============================================
# These credentials will be auto-created in Supabase on first login
# You can use these to login after running the SQL schema

# Yacht Admin (Server-side - used in API)
YACHT_ADMIN_EMAIL=yachtadmin@gmail.com
YACHT_ADMIN_PASSWORD=Yachtadmin@123

# Super Admin (Server-side - used in API)
SUPER_ADMIN_EMAIL=superadmin@gmail.com
SUPER_ADMIN_PASSWORD=Superadmin@123

# Admin Credentials for Frontend Display (Optional - for login page display)
NEXT_PUBLIC_YACHT_ADMIN_EMAIL=yachtadmin@gmail.com
NEXT_PUBLIC_YACHT_ADMIN_PASSWORD=Yachtadmin@123
NEXT_PUBLIC_SUPER_ADMIN_EMAIL=superadmin@gmail.com
NEXT_PUBLIC_SUPER_ADMIN_PASSWORD=Superadmin@123
```

## Instructions

1. **Get Supabase Credentials:**
   - Go to Supabase Dashboard → Settings → API
   - Copy **Project URL** → Replace `your_supabase_project_url`
   - Copy **anon/public key** → Replace `your_supabase_anon_key`

2. **Admin Credentials:**
   - These are demo credentials for testing
   - They will be auto-created in Supabase `users` table on first login
   - You can use these to login:
     - **Yacht Admin:** `yachtadmin@gmail.com` / `Yachtadmin@123`
     - **Super Admin:** `superadmin@gmail.com` / `Superadmin@123`

3. **After Setup:**
   - Run `npm run dev`
   - Login with admin credentials
   - Check Supabase Table Editor → `users` table to see created accounts

## Example `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

YACHT_ADMIN_EMAIL=yachtadmin@gmail.com
YACHT_ADMIN_PASSWORD=Yachtadmin@123

SUPER_ADMIN_EMAIL=superadmin@gmail.com
SUPER_ADMIN_PASSWORD=Superadmin@123
```

