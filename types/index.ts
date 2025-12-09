export type UserRole = 'user' | 'yacht_admin' | 'super_admin'

export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  createdAt: string
}

export interface Yacht {
  id: string
  name: string
  description: string
  location: 'Dubai Marina' | 'JBR' | 'Creek'
  yachtType: string
  capacity: number
  bedrooms: number
  hasCatering: boolean
  hourlyPrice: number
  dailyPrice: number
  images: string[]
  amenities: string[]
  included: string[]
  excluded: string[]
  terms: string[]
  status: 'pending' | 'approved' | 'rejected' | 'disabled'
  yachtAdminId: string
  rating: number
  createdAt: string
}

export interface Booking {
  id: string
  yachtId: string
  yachtName: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  date: string
  startTime: string
  endTime: string
  hours: number
  totalPrice: number
  specialRequest?: string
  status: 'pending' | 'confirmed' | 'rejected'
  createdAt: string
}

export interface YachtAdmin {
  id: string
  email: string
  companyName: string
  contactNumber: string
  licenseInfo?: string
  kycDocuments?: string[]
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

