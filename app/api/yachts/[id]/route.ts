import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// PATCH update yacht
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { id } = params

    // Build update object (only include provided fields)
    const updates: any = {}

    if (body.name !== undefined) updates.name = body.name
    if (body.description !== undefined) updates.description = body.description
    if (body.location !== undefined) updates.location = body.location
    if (body.yachtType !== undefined) updates.yacht_type = body.yachtType
    if (body.capacity !== undefined) updates.capacity = parseInt(body.capacity)
    if (body.bedrooms !== undefined) updates.bedrooms = parseInt(body.bedrooms)
    if (body.hasCatering !== undefined) updates.has_catering = body.hasCatering
    if (body.hourlyPrice !== undefined) updates.hourly_price = parseFloat(body.hourlyPrice)
    if (body.dailyPrice !== undefined) updates.daily_price = parseFloat(body.dailyPrice)
    if (body.images !== undefined) updates.images = body.images
    if (body.amenities !== undefined) updates.amenities = body.amenities
    if (body.included !== undefined) updates.included = body.included
    if (body.excluded !== undefined) updates.excluded = body.excluded
    if (body.terms !== undefined) updates.terms = body.terms
    if (body.status !== undefined) updates.status = body.status
    if (body.rating !== undefined) updates.rating = parseFloat(body.rating)

    const { data: yacht, error } = await supabase
      .from('yachts')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update yacht' },
        { status: 500 }
      )
    }

    // Transform to frontend format
    const formattedYacht = {
      id: yacht.id,
      name: yacht.name,
      description: yacht.description,
      location: yacht.location,
      yachtType: yacht.yacht_type,
      capacity: yacht.capacity,
      bedrooms: yacht.bedrooms,
      hasCatering: yacht.has_catering,
      hourlyPrice: parseFloat(yacht.hourly_price),
      dailyPrice: parseFloat(yacht.daily_price),
      images: yacht.images || [],
      amenities: yacht.amenities || [],
      included: yacht.included || [],
      excluded: yacht.excluded || [],
      terms: yacht.terms || [],
      status: yacht.status,
      yachtAdminId: yacht.yacht_admin_id,
      rating: parseFloat(yacht.rating || 0),
      createdAt: yacht.created_at,
    }

    return NextResponse.json({ success: true, yacht: formattedYacht })
  } catch (error: any) {
    console.error('Update yacht error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update yacht' },
      { status: 500 }
    )
  }
}

