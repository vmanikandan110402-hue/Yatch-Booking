'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useYachtStore } from '@/store/yachtStore'
import { useAuthStore } from '@/store/authStore'
import { ArrowLeft, Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency, formatDateTime, sendBookingEmail } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function BookingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { yachts, addBooking, initializeData } = useYachtStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    specialRequest: '',
  })

  useEffect(() => {
    initializeData()
  }, [initializeData])

  const yacht = yachts.find(y => y.id === params.id)
  const date = searchParams.get('date') || ''
  const startTime = searchParams.get('start') || ''
  const endTime = searchParams.get('end') || ''
  const hours = parseInt(searchParams.get('hours') || '2')

  if (!yacht || !date || !startTime || !endTime) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-xl text-gray-600">Invalid booking parameters</p>
          <Link href={`/yachts/${params.id}`} className="text-primary-600 mt-4 inline-block">
            Back to Yacht
          </Link>
        </div>
      </div>
    )
  }

  const totalPrice = hours >= 8 ? yacht.dailyPrice : yacht.hourlyPrice * hours

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const booking = addBooking({
        yachtId: yacht.id,
        yachtName: yacht.name,
        userId: user!.id,
        userName: user!.name,
        userEmail: user!.email,
        userPhone: user!.phone,
        date,
        startTime,
        endTime,
        hours,
        totalPrice,
        specialRequest: formData.specialRequest || undefined,
        status: 'pending',
      })

      // Send email notification
      await sendBookingEmail({
        yachtName: yacht.name,
        date,
        startTime,
        endTime,
        userName: user!.name,
        userEmail: user!.email,
        userPhone: user!.phone,
        specialRequest: formData.specialRequest,
        bookingId: booking.id,
        totalPrice,
      })

      toast.success('Booking submitted successfully! You will receive a confirmation email shortly.')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Failed to submit booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={['user']}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-24 pb-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href={`/yachts/${yacht.id}`}
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Yacht</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

              {/* Booking Summary */}
              <div className="bg-primary-50 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Yacht
                    </span>
                    <span className="font-semibold">{yacht.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Date
                    </span>
                    <span className="font-semibold">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Time
                    </span>
                    <span className="font-semibold">{startTime} - {endTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Duration</span>
                    <span className="font-semibold">{hours} {hours === 1 ? 'hour' : 'hours'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-primary-200">
                    <span className="text-lg font-semibold text-gray-900">Total Price</span>
                    <span className="text-2xl font-bold text-primary-600">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={user?.phone || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={formData.specialRequest}
                    onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Any special requests or requirements..."
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Your booking will be sent to the admin for approval. 
                    You will receive a confirmation email once your booking is confirmed.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Confirm Booking'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

