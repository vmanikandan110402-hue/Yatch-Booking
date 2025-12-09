import { create } from 'zustand'
import { Yacht, Booking } from '@/types'

interface YachtState {
  yachts: Yacht[]
  bookings: Booking[]
  initializeData: () => Promise<void>
  addYacht: (yacht: Omit<Yacht, 'id' | 'createdAt'>) => Promise<void>
  updateYacht: (id: string, updates: Partial<Yacht>) => Promise<void>
  approveYacht: (id: string) => Promise<void>
  rejectYacht: (id: string) => Promise<void>
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<Booking>
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>
  getYachtsByAdmin: (adminId: string) => Yacht[]
  getBookingsByYacht: (yachtId: string) => Booking[]
  getBookingsByAdmin: (adminId: string) => Booking[]
}

export const useYachtStore = create<YachtState>((set, get) => ({
  yachts: [],
  bookings: [],

  initializeData: async () => {
    try {
      // Fetch yachts
      const yachtsResponse = await fetch('/api/yachts')
      const yachtsData = await yachtsResponse.json()
      if (yachtsData.success) {
        set({ yachts: yachtsData.yachts })
      }

      // Fetch bookings
      const bookingsResponse = await fetch('/api/bookings')
      const bookingsData = await bookingsResponse.json()
      if (bookingsData.success) {
        set((state) => ({ bookings: bookingsData.bookings }))
      }
    } catch (error) {
      console.error('Failed to initialize data:', error)
    }
  },

  addYacht: async (yacht) => {
    try {
      const response = await fetch('/api/yachts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(yacht),
      })

      const data = await response.json()
      if (data.success) {
        set((state) => ({
          yachts: [...state.yachts, data.yacht],
          bookings: state.bookings,
        }))
      } else {
        throw new Error(data.error || 'Failed to create yacht')
      }
    } catch (error) {
      console.error('Add yacht error:', error)
      throw error
    }
  },

  updateYacht: async (id, updates) => {
    try {
      const response = await fetch(`/api/yachts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      const data = await response.json()
      if (data.success) {
        set((state) => ({
          yachts: state.yachts.map(y => y.id === id ? data.yacht : y),
          bookings: state.bookings,
        }))
      } else {
        throw new Error(data.error || 'Failed to update yacht')
      }
    } catch (error) {
      console.error('Update yacht error:', error)
      throw error
    }
  },

  approveYacht: async (id) => {
    await get().updateYacht(id, { status: 'approved' })
  },

  rejectYacht: async (id) => {
    await get().updateYacht(id, { status: 'rejected' })
  },

  addBooking: async (booking) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      })

      const data = await response.json()
      if (data.success) {
        set((state) => ({
          yachts: state.yachts,
          bookings: [...state.bookings, data.booking],
        }))
        return data.booking
      } else {
        throw new Error(data.error || 'Failed to create booking')
      }
    } catch (error) {
      console.error('Add booking error:', error)
      throw error
    }
  },

  updateBookingStatus: async (id, status) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()
      if (data.success) {
        set((state) => ({
          yachts: state.yachts,
          bookings: state.bookings.map(b => b.id === id ? data.booking : b),
        }))
      } else {
        throw new Error(data.error || 'Failed to update booking')
      }
    } catch (error) {
      console.error('Update booking error:', error)
      throw error
    }
  },

  getYachtsByAdmin: (adminId) => {
    return get().yachts.filter(y => y.yachtAdminId === adminId)
  },

  getBookingsByYacht: (yachtId) => {
    return get().bookings.filter(b => b.yachtId === yachtId)
  },

  getBookingsByAdmin: (adminId) => {
    const adminYachts = get().getYachtsByAdmin(adminId)
    const yachtIds = adminYachts.map(y => y.id)
    return get().bookings.filter(b => yachtIds.includes(b.yachtId))
  },
}))
