import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'

// Default admin credentials from environment variables
const getAdminDefaults = () => [
  {
    email: process.env.YACHT_ADMIN_EMAIL || 'yachtadmin@gmail.com',
    password: process.env.YACHT_ADMIN_PASSWORD || 'Yachtadmin@123',
    name: 'Yacht Admin',
    phone: '+971 50 000 0001',
    role: 'yacht_admin' as const,
  },
  {
    email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@gmail.com',
    password: process.env.SUPER_ADMIN_PASSWORD || 'Superadmin@123',
    name: 'Super Admin',
    phone: '+971 50 000 0002',
    role: 'super_admin' as const,
  },
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user exists in Supabase
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    // Check for Supabase connection errors (excluding "not found" errors)
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Supabase fetch error:', fetchError)
      return NextResponse.json(
        { success: false, error: `Database connection error: ${fetchError.message || 'Please check Supabase configuration and ensure tables exist'}` },
        { status: 500 }
      )
    }

    let finalUser = user

    // If user doesn't exist in database, check if it's a default admin
    if (!user) {
      const ADMIN_DEFAULTS = getAdminDefaults()
      const adminMatch = ADMIN_DEFAULTS.find(
        (admin) => admin.email.toLowerCase() === email.toLowerCase().trim()
      )

      if (adminMatch) {
        // Email matches admin, check password
        if (adminMatch.password === password) {
          // Auto-create admin in Supabase
          const passwordHash = await bcrypt.hash(adminMatch.password, 10)
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              email: adminMatch.email.toLowerCase(),
              password_hash: passwordHash,
              name: adminMatch.name,
              phone: adminMatch.phone,
              role: adminMatch.role,
            })
            .select('*')
            .single()

          if (insertError) {
            console.error('Admin creation error:', insertError)
            return NextResponse.json(
              { success: false, error: `Failed to create admin account: ${insertError.message || 'Please check Supabase connection and ensure users table exists'}` },
              { status: 500 }
            )
          }
          finalUser = newUser
        } else {
          return NextResponse.json(
            { success: false, error: 'Invalid password. Please check your credentials.' },
            { status: 401 }
          )
        }
      } else {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        )
      }
    } else {
      // User exists in database, verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash)
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: 'Invalid password. Please check your credentials.' },
          { status: 401 }
        )
      }
    }

    // Return user data (without password_hash)
    return NextResponse.json({
      success: true,
      user: {
        id: finalUser.id,
        email: finalUser.email,
        name: finalUser.name,
        phone: finalUser.phone,
        role: finalUser.role,
        createdAt: finalUser.created_at,
      },
      role: finalUser.role,
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}

