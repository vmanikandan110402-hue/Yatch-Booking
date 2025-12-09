import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date: string, time: string): string {
  return `${formatDate(date)} at ${time}`
}

export function sendBookingEmail(booking: {
  yachtName: string
  date: string
  startTime: string
  endTime: string
  userName: string
  userEmail: string
  userPhone: string
  specialRequest?: string
  bookingId: string
  totalPrice: number
}) {
  // Simulate email sending
  console.log('📧 Booking Email Sent:')
  console.log('To: Super Admin & Yacht Admin')
  console.log('Subject: New Yacht Booking Request')
  console.log(`
    Yacht Name: ${booking.yachtName}
    Date & Time: ${booking.date} from ${booking.startTime} to ${booking.endTime}
    User Name: ${booking.userName}
    User Email: ${booking.userEmail}
    User Phone: ${booking.userPhone}
    Special Request: ${booking.specialRequest || 'None'}
    Booking ID: ${booking.bookingId}
    Total Price: ${formatCurrency(booking.totalPrice)}
  `)
  
  // In production, integrate with email service like SendGrid, Resend, etc.
  return Promise.resolve()
}

