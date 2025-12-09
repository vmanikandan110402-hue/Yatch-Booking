'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useYachtStore } from '@/store/yachtStore'
import { useAuthStore } from '@/store/authStore'
import { Ship, Plus, Edit, Trash2, Eye, Calendar, Users, DollarSign, X } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function YachtAdminPage() {
  const { yachts, bookings, initializeData, getYachtsByAdmin, getBookingsByAdmin, addYacht } = useYachtStore()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'yachts' | 'bookings' | 'profile'>('yachts')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: 'Dubai Marina' as 'Dubai Marina' | 'JBR' | 'Creek',
    yachtType: '',
    capacity: '',
    bedrooms: '',
    hasCatering: false,
    hourlyPrice: '',
    dailyPrice: '',
    images: [] as string[],
    amenities: [] as string[],
    included: ['Captain', 'Fuel', 'Insurance', 'Safety Equipment'],
    excluded: ['Food & Beverages', 'Gratuities'],
    terms: ['Minimum 2 hours booking', 'Cancellation 48 hours prior'],
  })

  const availableAmenities = [
    'WiFi', 'Air Conditioning', 'Sound System', 'BBQ Grill', 'Diving Equipment',
    'Water Sports', 'Sun Deck', 'Jacuzzi', 'Premium Bar', 'Gourmet Kitchen',
    'Entertainment System', 'Water Toys', 'Fishing Equipment', 'Helipad', 'Snorkeling Gear'
  ]

  const handleCreateYacht = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate images
    if (formData.images.length === 0) {
      toast.error('Please add at least one image for your yacht')
      return
    }

    setLoading(true)

    try {
      addYacht({
        ...formData,
        capacity: parseInt(formData.capacity),
        bedrooms: parseInt(formData.bedrooms),
        hourlyPrice: parseFloat(formData.hourlyPrice),
        dailyPrice: parseFloat(formData.dailyPrice),
        status: 'pending',
        yachtAdminId: user!.id,
        rating: 0,
      })

      toast.success('Yacht created successfully! Waiting for super admin approval.')
      setShowCreateForm(false)
      // Reset form
      setFormData({
        name: '',
        description: '',
        location: 'Dubai Marina',
        yachtType: '',
        capacity: '',
        bedrooms: '',
        hasCatering: false,
        hourlyPrice: '',
        dailyPrice: '',
        images: [],
        amenities: [],
        included: ['Captain', 'Fuel', 'Insurance', 'Safety Equipment'],
        excluded: ['Food & Beverages', 'Gratuities'],
        terms: ['Minimum 2 hours booking', 'Cancellation 48 hours prior'],
      })
      // Refresh data
      initializeData()
    } catch (error) {
      toast.error('Failed to create yacht. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter(a => a !== amenity)
        : [...formData.amenities, amenity]
    })
  }

  useEffect(() => {
    initializeData()
  }, [initializeData])

  const adminYachts = getYachtsByAdmin(user?.id || '')
  const adminBookings = getBookingsByAdmin(user?.id || '')
  
  const stats = {
    total: adminYachts.length,
    approved: adminYachts.filter(y => y.status === 'approved').length,
    pending: adminYachts.filter(y => y.status === 'pending').length,
    rejected: adminYachts.filter(y => y.status === 'rejected').length,
    totalBookings: adminBookings.length,
    confirmedBookings: adminBookings.filter(b => b.status === 'confirmed').length,
    totalRevenue: adminBookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalPrice, 0),
  }

  const handleDeleteYacht = (id: string) => {
    if (confirm('Are you sure you want to delete this yacht?')) {
      // In a real app, this would call an API
      toast.success('Yacht deleted (demo mode)')
    }
  }

  return (
    <ProtectedRoute allowedRoles={['yacht_admin']}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Yacht Admin Panel</h1>
              <p className="text-lg text-gray-600">Manage your yachts and view bookings</p>
            </motion.div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-4 border-2 border-primary-200"
              >
                <div className="text-sm text-gray-600 mb-1">Total Yachts</div>
                <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-4 border-2 border-green-200"
              >
                <div className="text-sm text-gray-600 mb-1">Approved</div>
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-4 border-2 border-yellow-200"
              >
                <div className="text-sm text-gray-600 mb-1">Pending</div>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-lg p-4 border-2 border-red-200"
              >
                <div className="text-sm text-gray-600 mb-1">Rejected</div>
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-lg p-4 border-2 border-blue-200"
              >
                <div className="text-sm text-gray-600 mb-1">Total Bookings</div>
                <div className="text-2xl font-bold text-blue-600">{stats.totalBookings}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-4 border-2 border-green-200"
              >
                <div className="text-sm text-gray-600 mb-1">Confirmed</div>
                <div className="text-2xl font-bold text-green-600">{stats.confirmedBookings}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-xl shadow-lg p-4 border-2 border-purple-200"
              >
                <div className="text-sm text-gray-600 mb-1">Revenue</div>
                <div className="text-xl font-bold text-purple-600">{formatCurrency(stats.totalRevenue)}</div>
              </motion.div>
            </div>

            {/* Flow Info Banner */}
            {stats.pending > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-8"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{stats.pending}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-900 mb-1">
                      {stats.pending} Yacht{stats.pending > 1 ? 's' : ''} Pending Approval
                    </h3>
                    <p className="text-sm text-yellow-800">
                      Your yacht{stats.pending > 1 ? 's are' : ' is'} waiting for super admin approval. 
                      Once approved, {stats.pending > 1 ? 'they will' : 'it will'} be visible to all users for booking.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg mb-8">
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'yachts', label: 'My Yachts', icon: Ship },
                  { id: 'bookings', label: 'Bookings', icon: Calendar },
                  { id: 'profile', label: 'Profile', icon: Users },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center space-x-2 ${
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
                {/* Yachts Tab */}
                {activeTab === 'yachts' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">My Yachts</h2>
                      <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all flex items-center space-x-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>{showCreateForm ? 'Cancel' : 'Create New Yacht'}</span>
                      </button>
                    </div>

                    {/* Create Yacht Form */}
                    {showCreateForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200 rounded-xl p-6 mb-6"
                      >
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Yacht</h3>
                        <form onSubmit={handleCreateYacht} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Yacht Name *
                              </label>
                              <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location *
                              </label>
                              <select
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value as any })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                required
                              >
                                <option value="Dubai Marina">Dubai Marina</option>
                                <option value="JBR">JBR</option>
                                <option value="Creek">Creek</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Yacht Type *
                              </label>
                              <input
                                type="text"
                                value={formData.yachtType}
                                onChange={(e) => setFormData({ ...formData, yachtType: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="e.g., Motor Yacht, Catamaran"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Capacity *
                              </label>
                              <input
                                type="number"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bedrooms *
                              </label>
                              <input
                                type="number"
                                value={formData.bedrooms}
                                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Catering Available
                              </label>
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.hasCatering}
                                  onChange={(e) => setFormData({ ...formData, hasCatering: e.target.checked })}
                                  className="w-5 h-5 text-primary-600 rounded"
                                />
                                <span>Yes, catering is available</span>
                              </label>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hourly Price (AED) *
                              </label>
                              <input
                                type="number"
                                value={formData.hourlyPrice}
                                onChange={(e) => setFormData({ ...formData, hourlyPrice: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Daily Price (AED) *
                              </label>
                              <input
                                type="number"
                                value={formData.dailyPrice}
                                onChange={(e) => setFormData({ ...formData, dailyPrice: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description *
                            </label>
                            <textarea
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              rows={4}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                              required
                            />
                          </div>

                          {/* Image Upload Section */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Yacht Images *
                            </label>
                            <p className="text-xs text-gray-500 mb-3">
                              Upload images from your computer (JPG, PNG). These images will be displayed to users when viewing your yacht.
                            </p>
                            
                            {/* File Upload Input */}
                            <div className="mb-4">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Ship className="w-10 h-10 mb-3 text-gray-400" />
                                  <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500">JPG, PNG (MAX. 5MB per image)</p>
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/jpeg,image/jpg,image/png"
                                  multiple
                                  onChange={(e) => {
                                    const files = Array.from(e.target.files || [])
                                    if (files.length === 0) return

                                    files.forEach((file) => {
                                      // Validate file size (5MB max)
                                      if (file.size > 5 * 1024 * 1024) {
                                        toast.error(`${file.name} is too large. Maximum size is 5MB.`)
                                        return
                                      }

                                      // Validate file type
                                      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
                                        toast.error(`${file.name} is not a valid image format. Only JPG and PNG are allowed.`)
                                        return
                                      }

                                      // Convert to base64
                                      const reader = new FileReader()
                                      reader.onloadend = () => {
                                        const base64String = reader.result as string
                                        setFormData({
                                          ...formData,
                                          images: [...formData.images, base64String]
                                        })
                                      }
                                      reader.onerror = () => {
                                        toast.error(`Failed to read ${file.name}`)
                                      }
                                      reader.readAsDataURL(file)
                                    })

                                    // Reset input
                                    e.target.value = ''
                                  }}
                                />
                              </label>
                              <p className="text-xs text-gray-500 mt-2">
                                You can upload multiple images. At least one image is required.
                              </p>
                            </div>

                            {/* Image Preview Grid */}
                            {formData.images.length > 0 && (
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                {formData.images.map((image, index) => (
                                  <div key={index} className="relative group">
                                    <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                                      <img
                                        src={image}
                                        alt={`Yacht image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+URL'
                                        }}
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormData({
                                          ...formData,
                                          images: formData.images.filter((_, i) => i !== index)
                                        })
                                      }}
                                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                      title="Remove image"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                      Image {index + 1}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {formData.images.length === 0 && (
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                                <Ship className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">No images uploaded yet</p>
                                <p className="text-xs text-gray-400 mt-1">Upload at least one image to continue</p>
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Amenities
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto p-3 bg-gray-50 rounded-lg">
                              {availableAmenities.map((amenity) => (
                                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={formData.amenities.includes(amenity)}
                                    onChange={() => toggleAmenity(amenity)}
                                    className="w-4 h-4 text-primary-600 rounded"
                                  />
                                  <span className="text-sm">{amenity}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                What's Included (one per line)
                              </label>
                              <textarea
                                value={formData.included.join('\n')}
                                onChange={(e) => setFormData({ ...formData, included: e.target.value.split('\n').filter(item => item.trim()) })}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                What's Excluded (one per line)
                              </label>
                              <textarea
                                value={formData.excluded.join('\n')}
                                onChange={(e) => setFormData({ ...formData, excluded: e.target.value.split('\n').filter(item => item.trim()) })}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Important Terms (one per line)
                            </label>
                            <textarea
                              value={formData.terms.join('\n')}
                              onChange={(e) => setFormData({ ...formData, terms: e.target.value.split('\n').filter(item => item.trim()) })}
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800">
                              <strong>Note:</strong> Your yacht will be submitted for super admin approval. 
                              Once approved, it will be visible to all users for booking.
                            </p>
                          </div>

                          <div className="flex space-x-3">
                            <button
                              type="submit"
                              disabled={loading}
                              className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all disabled:opacity-50"
                            >
                              {loading ? 'Creating...' : 'Create Yacht'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowCreateForm(false)}
                              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    {adminYachts.length === 0 ? (
                      <div className="text-center py-12">
                        <Ship className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-xl text-gray-600 mb-4">No yachts added yet</p>
                        <Link
                          href="/yacht-admin/yachts/new"
                          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all"
                        >
                          Add Your First Yacht
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {adminYachts.map((yacht, index) => (
                          <motion.div
                            key={yacht.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
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
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{yacht.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  yacht.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  yacht.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  yacht.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {yacht.status === 'approved' ? '✓ Visible to Users' :
                                   yacht.status === 'pending' ? '⏳ Pending' :
                                   yacht.status === 'rejected' ? '✗ Rejected' : yacht.status}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                <span>{yacht.location}</span>
                                <span>{yacht.capacity} guests</span>
                              </div>
                              <div className="text-lg font-bold text-primary-600 mb-4">
                                {formatCurrency(yacht.hourlyPrice)}/hr
                              </div>
                              {yacht.status === 'approved' && (
                                <div className="mb-3 p-2 bg-green-50 rounded-lg">
                                  <p className="text-xs text-green-700 font-medium">
                                    ✓ This yacht is visible to all users and can receive bookings
                                  </p>
                                </div>
                              )}
                              {yacht.status === 'pending' && (
                                <div className="mb-3 p-2 bg-yellow-50 rounded-lg">
                                  <p className="text-xs text-yellow-700 font-medium">
                                    ⏳ Waiting for super admin approval. Users cannot see this yacht yet.
                                  </p>
                                </div>
                              )}
                              <div className="flex space-x-2">
                                <Link
                                  href={`/yacht-admin/yachts/${yacht.id}`}
                                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg text-center font-medium hover:bg-primary-700 transition-all flex items-center justify-center space-x-1"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span>Edit</span>
                                </Link>
                                <button
                                  onClick={() => handleDeleteYacht(yacht.id)}
                                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all flex items-center justify-center space-x-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Bookings (View Only)</h2>
                    {adminBookings.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-xl text-gray-600">No bookings yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {adminBookings.map((booking, index) => (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xl font-bold text-gray-900">{booking.yachtName}</h3>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 mb-4">
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
                                <strong>Contact:</strong> {booking.userPhone}
                              </div>
                            </div>
                            {booking.specialRequest && (
                              <div className="bg-white p-3 rounded-lg mb-4">
                                <strong>Special Request:</strong> {booking.specialRequest}
                              </div>
                            )}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                              <span className="text-gray-600">Booking ID: {booking.id.slice(-8).toUpperCase()}</span>
                              <span className="text-xl font-bold text-primary-600">
                                {formatCurrency(booking.totalPrice)}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          defaultValue="My Yacht Company"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          defaultValue={user?.phone}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          License Information
                        </label>
                        <input
                          type="text"
                          placeholder="Enter license details"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all">
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

