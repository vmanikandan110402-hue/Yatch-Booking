'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useYachtStore } from '@/store/yachtStore'
import { useAuthStore } from '@/store/authStore'
import { Calendar, Clock, MapPin, Ship, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import Link from 'next/link'

export default function DashboardPage() {
  const { bookings, initializeData } = useYachtStore()
  const { user } = useAuthStore()
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all')

  useEffect(() => {
    initializeData()
  }, [initializeData])

  const userBookings = bookings.filter(b => b.userId === user?.id)
  const filteredBookings = filter === 'all' 
    ? userBookings 
    : userBookings.filter(b => b.status === filter)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <ProtectedRoute allowedRoles={['user']}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
              <p className="text-lg text-gray-600">Manage and track your yacht bookings</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Bookings', value: userBookings.length, color: 'primary' },
                { label: 'Pending', value: userBookings.filter(b => b.status === 'pending').length, color: 'yellow' },
                { label: 'Confirmed', value: userBookings.filter(b => b.status === 'confirmed').length, color: 'green' },
                { label: 'Rejected', value: userBookings.filter(b => b.status === 'rejected').length, color: 'red' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                  <div className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {(['all', 'pending', 'confirmed', 'rejected'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filter === status
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Ship className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-4">No bookings found</p>
                <Link
                  href="/yachts"
                  className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all"
                >
                  Browse Yachts
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{booking.yachtName}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                            <span>{formatDate(booking.date)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-primary-600" />
                            <span>{booking.startTime} - {booking.endTime}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-900">{booking.hours} {booking.hours === 1 ? 'hour' : 'hours'}</span>
                          </div>
                        </div>

                        {booking.specialRequest && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                              <strong>Special Request:</strong> {booking.specialRequest}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="md:text-right">
                        <div className="text-2xl font-bold text-primary-600 mb-2">
                          {formatCurrency(booking.totalPrice)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Booking ID: {booking.id.slice(-8).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

