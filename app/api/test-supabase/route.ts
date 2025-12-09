import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test Supabase connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: {
          code: error.code,
          hint: error.hint,
          details: error.details,
        },
        env: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
          keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
        },
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      env: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      env: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    }, { status: 500 })
  }
}

