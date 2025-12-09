import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET all bookings
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')
    const yachtId = searchParams.get('yachtId')

    let query = supabase.from('bookings').select('*').order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (yachtId) {
      query = query.eq('yacht_id', yachtId)
    }

    const { data: bookings, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }

    // Transform to frontend format
    const formattedBookings = bookings?.map((booking) => ({
      id: booking.id,
      yachtId: booking.yacht_id,
      yachtName: booking.yacht_name,
      userId: booking.user_id,
      userName: booking.user_name,
      userEmail: booking.user_email,
      userPhone: booking.user_phone,
      date: booking.booking_date,
      startTime: booking.start_time,
      endTime: booking.end_time,
      hours: booking.hours,
      totalPrice: parseFloat(booking.total_price),
      specialRequest: booking.special_request,
      status: booking.status,
      createdAt: booking.created_at,
    })) || []

    return NextResponse.json({ success: true, bookings: formattedBookings })
  } catch (error: any) {
    console.error('Get bookings error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST create new booking
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      yachtId,
      yachtName,
      userId,
      userName,
      userEmail,
      userPhone,
      date,
      startTime,
      endTime,
      hours,
      totalPrice,
      specialRequest,
      status = 'pending',
    } = body

    // Validate required fields
    if (!yachtId || !yachtName || !userId || !userName || !userEmail || !userPhone || !date || !startTime || !endTime || !hours || !totalPrice) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        yacht_id: yachtId,
        yacht_name: yachtName,
        user_id: userId,
        user_name: userName,
        user_email: userEmail,
        user_phone: userPhone,
        booking_date: date,
        start_time: startTime,
        end_time: endTime,
        hours: parseInt(hours),
        total_price: parseFloat(totalPrice),
        special_request: specialRequest,
        status,
      })
      .select('*')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    // Transform to frontend format
    const formattedBooking = {
      id: booking.id,
      yachtId: booking.yacht_id,
      yachtName: booking.yacht_name,
      userId: booking.user_id,
      userName: booking.user_name,
      userEmail: booking.user_email,
      userPhone: booking.user_phone,
      date: booking.booking_date,
      startTime: booking.start_time,
      endTime: booking.end_time,
      hours: booking.hours,
      totalPrice: parseFloat(booking.total_price),
      specialRequest: booking.special_request,
      status: booking.status,
      createdAt: booking.created_at,
    }

    return NextResponse.json({ success: true, booking: formattedBooking })
  } catch (error: any) {
    console.error('Create booking error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

