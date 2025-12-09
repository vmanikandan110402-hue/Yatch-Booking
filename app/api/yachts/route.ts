import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET all yachts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const adminId = searchParams.get('adminId')

    let query = supabase.from('yachts').select('*').order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (adminId) {
      query = query.eq('yacht_admin_id', adminId)
    }

    const { data: yachts, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch yachts' },
        { status: 500 }
      )
    }

    // Transform data to match frontend format
    const formattedYachts = yachts?.map((yacht) => ({
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
    })) || []

    return NextResponse.json({ success: true, yachts: formattedYachts })
  } catch (error: any) {
    console.error('Get yachts error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch yachts' },
      { status: 500 }
    )
  }
}

// POST create new yacht
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      location,
      yachtType,
      capacity,
      bedrooms,
      hasCatering,
      hourlyPrice,
      dailyPrice,
      images,
      amenities,
      included,
      excluded,
      terms,
      yachtAdminId,
      status = 'pending',
      rating = 0,
    } = body

    // Validate required fields
    if (!name || !description || !location || !yachtType || !yachtAdminId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: yacht, error } = await supabase
      .from('yachts')
      .insert({
        name,
        description,
        location,
        yacht_type: yachtType,
        capacity: parseInt(capacity),
        bedrooms: parseInt(bedrooms),
        has_catering: hasCatering || false,
        hourly_price: parseFloat(hourlyPrice),
        daily_price: parseFloat(dailyPrice),
        images: images || [],
        amenities: amenities || [],
        included: included || [],
        excluded: excluded || [],
        terms: terms || [],
        status,
        yacht_admin_id: yachtAdminId,
        rating: parseFloat(rating),
      })
      .select('*')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create yacht' },
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
    console.error('Create yacht error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create yacht' },
      { status: 500 }
    )
  }
}

