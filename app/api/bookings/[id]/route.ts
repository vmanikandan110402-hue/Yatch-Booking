import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// PATCH update booking status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { id } = params
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      )
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update booking' },
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
    console.error('Update booking error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

