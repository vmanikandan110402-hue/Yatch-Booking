'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useYachtStore } from '@/store/yachtStore'
import { useAuthStore } from '@/store/authStore'
import { MapPin, Users, Bed, Utensils, Star, Check, X, Calendar, Clock, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function YachtDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { yachts, initializeData } = useYachtStore()
  const { isAuthenticated } = useAuthStore()
  const [selectedDate, setSelectedDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [hours, setHours] = useState(2)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    initializeData()
  }, [initializeData])

  const yacht = yachts.find(y => y.id === params.id)

  if (!yacht) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-xl text-gray-600">Yacht not found</p>
          <Link href="/yachts" className="text-primary-600 mt-4 inline-block">
            Back to Yachts
          </Link>
        </div>
      </div>
    )
  }

  const calculatePrice = () => {
    if (hours >= 8) {
      return yacht.dailyPrice
    }
    return yacht.hourlyPrice * hours
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book')
      router.push('/login')
      return
    }

    if (!selectedDate || !startTime || !endTime) {
      toast.error('Please select date and time')
      return
    }

    router.push(`/yachts/${yacht.id}/book?date=${selectedDate}&start=${startTime}&end=${endTime}&hours=${hours}`)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-20">
        {/* Image Carousel */}
        <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="h-full"
            onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
          >
            {yacht.images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img
                    src={image}
                    alt={`${yacht.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute top-4 left-4 z-10">
            <Link
              href="/yachts"
              className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {yacht.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <span className="flex items-center">
                    <MapPin className="w-5 h-5 mr-1 text-primary-600" />
                    {yacht.location}
                  </span>
                  <span className="flex items-center">
                    <Star className="w-5 h-5 mr-1 text-yellow-400 fill-yellow-400" />
                    {yacht.rating}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-5 h-5 mr-1 text-primary-600" />
                    {yacht.capacity} guests
                  </span>
                  <span className="flex items-center">
                    <Bed className="w-5 h-5 mr-1 text-primary-600" />
                    {yacht.bedrooms} bedrooms
                  </span>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{yacht.description}</p>
              </motion.div>

              {/* Amenities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {yacht.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* What's Included/Excluded */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Included</h2>
                  <ul className="space-y-2">
                    {yacht.included.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Excluded</h2>
                  <ul className="space-y-2">
                    {yacht.excluded.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <X className="w-5 h-5 text-red-500" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Terms */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Terms</h2>
                <ul className="space-y-2">
                  {yacht.terms.map((term, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span className="text-gray-700">{term}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 sticky top-24"
              >
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {formatCurrency(yacht.hourlyPrice)}
                    <span className="text-lg font-normal text-gray-600">/hour</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Full day: {formatCurrency(yacht.dailyPrice)}
                  </div>
                </div>

                {/* Date Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Time Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value)
                      if (e.target.value) {
                        const [hrs, mins] = e.target.value.split(':').map(Number)
                        const end = new Date()
                        end.setHours(hrs + hours, mins)
                        setEndTime(`${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`)
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Hours Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (hours)
                  </label>
                  <select
                    value={hours}
                    onChange={(e) => {
                      const newHours = parseInt(e.target.value)
                      setHours(newHours)
                      if (startTime) {
                        const [hours, mins] = startTime.split(':').map(Number)
                        const end = new Date()
                        end.setHours(hours + newHours, mins)
                        setEndTime(`${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`)
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {[2, 3, 4, 5, 6, 7, 8].map(h => (
                      <option key={h} value={h}>{h} {h === 1 ? 'hour' : 'hours'}</option>
                    ))}
                    <option value={8}>Full Day (8+ hours)</option>
                  </select>
                </div>

                {/* Price Calculator */}
                <div className="bg-primary-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Total Price:</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatCurrency(calculatePrice())}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {hours >= 8 ? 'Full day rate' : `${hours} hours × ${formatCurrency(yacht.hourlyPrice)}`}
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Book Now
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


