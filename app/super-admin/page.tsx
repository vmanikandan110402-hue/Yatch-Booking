'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useYachtStore } from '@/store/yachtStore'
import { useAuthStore } from '@/store/authStore'
import { Yacht } from '@/types'
import {
  Ship,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Settings,
  Eye,
  MapPin,
  Bed,
  Utensils,
  Star,
  X,
  Check,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function SuperAdminPage() {
  const { yachts, bookings, initializeData, approveYacht, rejectYacht, updateBookingStatus } =
    useYachtStore()
  const [activeTab, setActiveTab] =
    useState<'dashboard' | 'yachts' | 'bookings' | 'users' | 'all'>('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [bookingFilter, setBookingFilter] =
    useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all')
  const [selectedYacht, setSelectedYacht] = useState<Yacht | null>(null)

  useEffect(() => {
    initializeData()
  }, [initializeData])

  const pendingYachts = yachts.filter(y => y.status === 'pending')
  const approvedYachts = yachts.filter(y => y.status === 'approved')
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0)

  const filteredBookings = bookings.filter(b => {
    if (bookingFilter !== 'all' && b.status !== bookingFilter) return false
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return (
        b.yachtName.toLowerCase().includes(term) ||
        b.userName.toLowerCase().includes(term) ||
        b.userEmail.toLowerCase().includes(term) ||
        b.id.toLowerCase().includes(term)
      )
    }
    return true
  })

  const handleApproveYacht = (id: string) => {
    approveYacht(id)
    toast.success('Yacht approved successfully!')
  }

  const handleRejectYacht = (id: string) => {
    if (confirm('Are you sure you want to reject this yacht?')) {
      rejectYacht(id)
      toast.success('Yacht rejected')
    }
  }

  const handleUpdateBookingStatus = (id: string, status: 'pending' | 'confirmed' | 'rejected') => {
    updateBookingStatus(id, status)
    toast.success(`Booking ${status}`)
  }

  return (
    <ProtectedRoute allowedRoles={['super_admin']}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Super Admin Panel</h1>
              <p className="text-lg text-gray-600">Manage platform, yachts, bookings, and users</p>
            </motion.div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg mb-8">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: Settings },
                  { id: 'all', label: 'All Data View', icon: Eye },
                  { id: 'yachts', label: 'Yacht Approval', icon: Ship },
                  { id: 'bookings', label: 'Bookings', icon: Calendar },
                  { id: 'users', label: 'Users', icon: Users },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-4 font-semibold transition-all flex items-center space-x-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      {[
                        { label: 'Total Yachts', value: yachts.length, icon: Ship, color: 'primary' },
                        { label: 'Active Yacht Admins', value: new Set(yachts.map(y => y.yachtAdminId)).size, icon: Users, color: 'blue' },
                        { label: 'Pending Approvals', value: pendingYachts.length, icon: Clock, color: 'yellow' },
                        { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'green' },
                        { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'purple' },
                        { label: 'Confirmed Bookings', value: bookings.filter(b => b.status === 'confirmed').length, icon: CheckCircle, color: 'green' },
                      ].map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border-2 border-gray-100"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                            <span className="text-sm text-gray-600">{stat.label}</span>
                          </div>
                          <div className={`text-3xl font-bold text-${stat.color}-600`}>
                            {stat.value}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Pending Yacht Approvals</h3>
                        {pendingYachts.length === 0 ? (
                          <p className="text-gray-600">No pending approvals</p>
                        ) : (
                          <div className="space-y-3">
                            {pendingYachts.slice(0, 5).map((yacht) => (
                              <div key={yacht.id} className="bg-white rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold">{yacht.name}</p>
                                    <p className="text-sm text-gray-600">{yacht.location}</p>
                                  </div>
                                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                    Pending
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                  Go to "Yacht Approval" tab to approve or reject
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h3>
                        {bookings.length === 0 ? (
                          <p className="text-gray-600">No bookings yet</p>
                        ) : (
                          <div className="space-y-3">
                            {bookings.slice(-5).reverse().map((booking) => (
                              <div key={booking.id} className="bg-white rounded-lg p-4">
                                <p className="font-semibold">{booking.yachtName}</p>
                                <p className="text-sm text-gray-600">{booking.userName}</p>
                                <p className="text-sm text-primary-600 font-medium">
                                  {formatCurrency(booking.totalPrice)}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* All Data View Tab */}
                {activeTab === 'all' && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Complete Data Overview</h2>
                    <p className="text-gray-600 mb-8">View all yachts, bookings, and users in the system</p>

                    {/* All Yachts Section */}
                    <div className="mb-12">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                          <Ship className="w-6 h-6 mr-2 text-primary-600" />
                          All Yachts ({yachts.length})
                        </h3>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            Approved: {approvedYachts.length}
                          </span>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                            Pending: {pendingYachts.length}
                          </span>
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                            Rejected: {yachts.filter(y => y.status === 'rejected').length}
                          </span>
                        </div>
                      </div>

                      {yachts.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                          <Ship className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-xl text-gray-600">No yachts created yet</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {yachts.map((yacht, index) => (
                            <motion.div
                              key={yacht.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                            >
                              <div className="relative h-48">
                                <img
                                  src={yacht.images[0]}
                                  alt={yacht.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    yacht.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    yacht.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    yacht.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {yacht.status}
                                  </span>
                                </div>
                              </div>
                              <div className="p-4">
                                <h4 className="text-lg font-bold text-gray-900 mb-2">{yacht.name}</h4>
                                <div className="space-y-1 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1 text-primary-600" />
                                    {yacht.location}
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1 text-primary-600" />
                                    {yacht.capacity} guests
                                  </div>
                                  <div className="flex items-center">
                                    <Bed className="w-4 h-4 mr-1 text-primary-600" />
                                    {yacht.bedrooms} bedrooms
                                  </div>
                                  <div className="flex items-center">
                                    {yacht.hasCatering ? (
                                      <>
                                        <Utensils className="w-4 h-4 mr-1 text-green-600" />
                                        <span className="text-green-600">Catering Available</span>
                                      </>
                                    ) : (
                                      <span className="text-gray-500">No catering</span>
                                    )}
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                                    Rating: {yacht.rating || 'N/A'}
                                  </div>
                                </div>
                                <div className="pt-3 border-t border-gray-200">
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-primary-600">
                                      {formatCurrency(yacht.hourlyPrice)}/hr
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(yacht.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* All Bookings Section */}
                    <div className="mb-12">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                          <Calendar className="w-6 h-6 mr-2 text-primary-600" />
                          All Bookings ({bookings.length})
                        </h3>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            Confirmed: {bookings.filter(b => b.status === 'confirmed').length}
                          </span>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                            Pending: {bookings.filter(b => b.status === 'pending').length}
                          </span>
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                            Rejected: {bookings.filter(b => b.status === 'rejected').length}
                          </span>
                        </div>
                      </div>

                      {bookings.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-xl text-gray-600">No bookings yet</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {bookings.map((booking, index) => (
                            <motion.div
                              key={booking.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                  <h4 className="font-bold text-lg text-gray-900 mb-2">{booking.yachtName}</h4>
                                  <div className="space-y-1 text-sm text-gray-600">
                                    <p><strong>Booking ID:</strong> {booking.id.slice(-8).toUpperCase()}</p>
                                    <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                                    <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
                                    <p><strong>Duration:</strong> {booking.hours} {booking.hours === 1 ? 'hour' : 'hours'}</p>
                                  </div>
                                </div>
                                <div>
                                  <h5 className="font-semibold text-gray-900 mb-2">Guest Information</h5>
                                  <div className="space-y-1 text-sm text-gray-600">
                                    <p><strong>Name:</strong> {booking.userName}</p>
                                    <p><strong>Email:</strong> {booking.userEmail}</p>
                                    <p><strong>Phone:</strong> {booking.userPhone}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col justify-between">
                                  <div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {booking.status}
                                    </span>
                                  </div>
                                  <div className="mt-4">
                                    <p className="text-2xl font-bold text-primary-600">
                                      {formatCurrency(booking.totalPrice)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Created: {new Date(booking.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {booking.specialRequest && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm"><strong>Special Request:</strong> {booking.specialRequest}</p>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* All Users Section */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <Users className="w-6 h-6 mr-2 text-primary-600" />
                        All Users
                      </h3>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> User management will be fully integrated with database. 
                          Currently showing structure for future implementation.
                        </p>
                      </div>
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-xl text-gray-600">User list will be displayed here</p>
                        <p className="text-sm text-gray-500 mt-2">Total registered users will be shown after database integration</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Yachts Tab */}
                {activeTab === 'yachts' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Yacht Approval System</h2>

                    {pendingYachts.length === 0 ? (
                      <div className="text-center py-12">
                        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <p className="text-xl text-gray-600">No pending yacht approvals</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pendingYachts.map((yacht, index) => (
                          <motion.div
                            key={yacht.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                              <div>
                                <img
                                  src={yacht.images[0]}
                                  alt={yacht.name}
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                              </div>
                              <div className="md:col-span-2 flex flex-col justify-between">
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {yacht.name}
                                  </h3>
                                  <div className="space-y-2 text-gray-600 mb-4">
                                    <p>
                                      <strong>Location:</strong> {yacht.location}
                                    </p>
                                    <p>
                                      <strong>Type:</strong> {yacht.yachtType}
                                    </p>
                                    <p>
                                      <strong>Capacity:</strong> {yacht.capacity} guests
                                    </p>
                                    <p>
                                      <strong>Price:</strong>{' '}
                                      {formatCurrency(yacht.hourlyPrice)}/hr
                                    </p>
                                  </div>
                                  <p className="text-gray-700 line-clamp-2 mb-4">
                                    {yacht.description}
                                  </p>
                                </div>
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => setSelectedYacht(yacht)}
                                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-all"
                                  >
                                    <Eye className="w-4 h-4" />
                                    <span>View Details</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                  <div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                      <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
                      <div className="flex gap-4">
                        <input
                          type="text"
                          placeholder="Search bookings..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                        <select
                          value={bookingFilter}
                          onChange={(e) => setBookingFilter(e.target.value as any)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    {filteredBookings.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-xl text-gray-600">No bookings found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredBookings.map((booking, index) => (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{booking.yachtName}</h3>
                                <p className="text-sm text-gray-600">Booking ID: {booking.id.slice(-8).toUpperCase()}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-gray-600">
                              <div>
                                <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                              </div>
                              <div>
                                <strong>Time:</strong> {booking.startTime} - {booking.endTime}
                              </div>
                              <div>
                                <strong>Guest:</strong> {booking.userName}
                              </div>
                              <div>
                                <strong>Contact:</strong> {booking.userPhone} / {booking.userEmail}
                              </div>
                            </div>

                            {booking.specialRequest && (
                              <div className="bg-white p-3 rounded-lg mb-4">
                                <strong>Special Request:</strong> {booking.specialRequest}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                              <div className="text-xl font-bold text-primary-600">
                                {formatCurrency(booking.totalPrice)}
                              </div>
                              <div className="flex space-x-2">
                                {booking.status !== 'confirmed' && (
                                  <button
                                    onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
                                  >
                                    Confirm
                                  </button>
                                )}
                                {booking.status !== 'rejected' && (
                                  <button
                                    onClick={() => handleUpdateBookingStatus(booking.id, 'rejected')}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700"
                                  >
                                    Reject
                                  </button>
                                )}
                                {booking.status !== 'pending' && (
                                  <button
                                    onClick={() => handleUpdateBookingStatus(booking.id, 'pending')}
                                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700"
                                  >
                                    Set Pending
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> User management features would be implemented with a backend API.
                        This is a demo interface showing the structure.
                      </p>
                    </div>
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-xl text-gray-600">User management interface</p>
                      <p className="text-gray-500 mt-2">View, block/unblock users, manage yacht admins</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yacht Details Modal */}
      {selectedYacht && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedYacht.name}</h2>
                <p className="text-sm text-gray-500">
                  Yacht ID: {selectedYacht.id} • Created:{' '}
                  {new Date(selectedYacht.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedYacht(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Top Section: Image + Key Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="relative w-full h-64 rounded-xl overflow-hidden">
                    <img
                      src={selectedYacht.images[0]}
                      alt={selectedYacht.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{selectedYacht.location}</span>
                    </div>
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      Pending Approval
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Type</p>
                    <p className="font-semibold text-gray-900">{selectedYacht.yachtType}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-primary-600" />
                      <span>{selectedYacht.capacity} guests</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bed className="w-4 h-4 text-primary-600" />
                      <span>{selectedYacht.bedrooms} bedrooms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Utensils
                        className={`w-4 h-4 ${
                          selectedYacht.hasCatering ? 'text-green-600' : 'text-gray-400'
                        }`}
                      />
                      <span>
                        {selectedYacht.hasCatering ? 'Catering available' : 'No catering'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>
                        Rating:{' '}
                        {selectedYacht.rating && selectedYacht.rating > 0
                          ? selectedYacht.rating
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pricing</p>
                    <p className="text-lg font-bold text-primary-600">
                      {formatCurrency(selectedYacht.hourlyPrice)}
                      <span className="text-sm font-normal text-gray-600"> / hour</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Full day: {formatCurrency(selectedYacht.dailyPrice)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedYacht.description}</p>
              </div>

              {/* Amenities, Included, Excluded, Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Amenities</h4>
                  {selectedYacht.amenities.length === 0 ? (
                    <p className="text-sm text-gray-500">No amenities specified.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      {selectedYacht.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">What's Included</h4>
                  {selectedYacht.included.length === 0 ? (
                    <p className="text-sm text-gray-500">No items specified.</p>
                  ) : (
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {selectedYacht.included.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">What's Excluded</h4>
                  {selectedYacht.excluded.length === 0 ? (
                    <p className="text-sm text-gray-500">No items specified.</p>
                  ) : (
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {selectedYacht.excluded.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Important Terms</h4>
                  {selectedYacht.terms.length === 0 ? (
                    <p className="text-sm text-gray-500">No terms specified.</p>
                  ) : (
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {selectedYacht.terms.map((term) => (
                        <li key={term}>{term}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <p className="text-xs text-gray-500">
                Review all details carefully before approving or rejecting this yacht.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    if (!selectedYacht) return
                    handleRejectYacht(selectedYacht.id)
                    setSelectedYacht(null)
                  }}
                  className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => {
                    if (!selectedYacht) return
                    handleApproveYacht(selectedYacht.id)
                    setSelectedYacht(null)
                  }}
                  className="px-5 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
}

