'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useYachtStore } from '@/store/yachtStore'
import { useAuthStore } from '@/store/authStore'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function EditYachtPage() {
  const params = useParams()
  const router = useRouter()
  const { yachts, updateYacht, initializeData } = useYachtStore()
  const { user } = useAuthStore()
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
    amenities: [] as string[],
  })

  useEffect(() => {
    initializeData()
    const yacht = yachts.find(y => y.id === params.id)
    if (yacht && yacht.yachtAdminId === user?.id) {
      setFormData({
        name: yacht.name,
        description: yacht.description,
        location: yacht.location,
        yachtType: yacht.yachtType,
        capacity: yacht.capacity.toString(),
        bedrooms: yacht.bedrooms.toString(),
        hasCatering: yacht.hasCatering,
        hourlyPrice: yacht.hourlyPrice.toString(),
        dailyPrice: yacht.dailyPrice.toString(),
        amenities: yacht.amenities,
      })
    } else if (yacht && yacht.yachtAdminId !== user?.id) {
      toast.error('You do not have permission to edit this yacht')
      router.push('/yacht-admin')
    }
  }, [params.id, yachts, user, initializeData, router])

  const availableAmenities = [
    'WiFi', 'Air Conditioning', 'Sound System', 'BBQ Grill', 'Diving Equipment',
    'Water Sports', 'Sun Deck', 'Jacuzzi', 'Premium Bar', 'Gourmet Kitchen',
    'Entertainment System', 'Water Toys', 'Fishing Equipment', 'Helipad', 'Snorkeling Gear'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      updateYacht(params.id as string, {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        yachtType: formData.yachtType,
        capacity: parseInt(formData.capacity),
        bedrooms: parseInt(formData.bedrooms),
        hasCatering: formData.hasCatering,
        hourlyPrice: parseFloat(formData.hourlyPrice),
        dailyPrice: parseFloat(formData.dailyPrice),
        amenities: formData.amenities,
      })

      toast.success('Yacht updated successfully!')
      router.push('/yacht-admin')
    } catch (error) {
      toast.error('Failed to update yacht. Please try again.')
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

  return (
    <ProtectedRoute allowedRoles={['yacht_admin']}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/yacht-admin"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin Panel</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Yacht</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Yacht'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

