'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useYachtStore } from '@/store/yachtStore'
import { Search, Filter, MapPin, Users, Star, ArrowRight, Bed, Utensils, Sparkles, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

export default function YachtsPage() {
  const searchParams = useSearchParams()
  const { yachts, initializeData } = useYachtStore()
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    capacity: searchParams.get('capacity') || '',
    price: searchParams.get('price') || '',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    initializeData()
  }, [initializeData])

  const approvedYachts = yachts.filter(y => y.status === 'approved')

  const filteredYachts = approvedYachts.filter((yacht) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      if (!yacht.name.toLowerCase().includes(term) && 
          !yacht.description.toLowerCase().includes(term) &&
          !yacht.location.toLowerCase().includes(term)) {
        return false
      }
    }
    if (filters.location && yacht.location !== filters.location) return false
    if (filters.type && yacht.yachtType !== filters.type) return false
    if (filters.capacity) {
      const cap = parseInt(filters.capacity)
      if (filters.capacity === '30+') {
        if (yacht.capacity < 30) return false
      } else if (yacht.capacity > cap) return false
    }
    if (filters.price) {
      const [min, max] = filters.price.split('-').map(Number)
      if (max) {
        if (yacht.hourlyPrice < min || yacht.hourlyPrice > max) return false
      } else {
        if (yacht.hourlyPrice < min) return false
      }
    }
    return true
  })

  const activeFiltersCount = Object.values(filters).filter(v => v).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <Navbar />
      
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1920&q=80)',
              filter: 'brightness(0.3)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 via-blue-900/70 to-purple-900/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6"
            >
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Premium Yacht Collection
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Discover {filteredYachts.length} luxury yachts ready for your next extraordinary adventure
            </p>
          </motion.div>

          {/* Premium Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-2xl"
          >
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search yachts by name, location, or description..."
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden text-white/80 hover:text-white transition-colors"
              >
                {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
              </button>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="">All Locations</option>
                  <option value="Dubai Marina">Dubai Marina</option>
                  <option value="JBR">JBR</option>
                  <option value="Creek">Creek</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Yacht Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="">All Types</option>
                  <option value="Motor Yacht">Motor Yacht</option>
                  <option value="Catamaran">Catamaran</option>
                  <option value="Super Yacht">Super Yacht</option>
                  <option value="Sailing Yacht">Sailing Yacht</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Capacity
                </label>
                <select
                  value={filters.capacity}
                  onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="">Any</option>
                  <option value="10">Up to 10</option>
                  <option value="20">Up to 20</option>
                  <option value="30">Up to 30</option>
                  <option value="30+">30+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Price Range
                </label>
                <select
                  value={filters.price}
                  onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="">Any Price</option>
                  <option value="1000-2000">AED 1,000 - 2,000/hr</option>
                  <option value="2000-3000">AED 2,000 - 3,000/hr</option>
                  <option value="3000-5000">AED 3,000 - 5,000/hr</option>
                  <option value="5000">AED 5,000+/hr</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Yacht Grid Section */}
      <section className="py-12 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredYachts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200"
            >
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-2xl font-semibold text-gray-700 mb-2">No yachts found</p>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredYachts.map((yacht, index) => (
                <motion.div
                  key={yacht.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Link href={`/yachts/${yacht.id}`}>
                    <div className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer h-full flex flex-col border border-gray-100">
                      {/* Premium Image with Overlay */}
                      <div className="relative h-72 overflow-hidden">
                        <img
                          src={yacht.images[0]}
                          alt={yacht.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Location Badge */}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                          <span className="text-sm font-bold text-primary-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {yacht.location}
                          </span>
                        </div>

                        {/* Rating Badge */}
                        <div className="absolute top-4 right-4 bg-gradient-to-br from-yellow-400 to-orange-500 px-4 py-2 rounded-full shadow-lg">
                          <span className="text-sm font-bold text-white flex items-center">
                            <Star className="w-4 h-4 mr-1 fill-white" />
                            {yacht.rating}
                          </span>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/20 transition-all duration-500 flex items-center justify-center">
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full font-semibold text-primary-600 flex items-center space-x-2"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-5 h-5" />
                          </motion.div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                          {yacht.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-5 line-clamp-2 flex-1">
                          {yacht.description}
                        </p>
                        
                        {/* Features */}
                        <div className="grid grid-cols-3 gap-3 mb-5">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Users className="w-4 h-4 text-primary-600" />
                            <span className="font-medium">{yacht.capacity}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Bed className="w-4 h-4 text-primary-600" />
                            <span className="font-medium">{yacht.bedrooms}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            {yacht.hasCatering ? (
                              <>
                                <Utensils className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-green-600">Catering</span>
                              </>
                            ) : (
                              <span className="text-gray-400">No catering</span>
                            )}
                          </div>
                        </div>

                        {/* Price & CTA */}
                        <div className="pt-5 border-t border-gray-200 flex items-center justify-between">
                          <div>
                            <span className="text-3xl font-bold text-primary-600">
                              {formatCurrency(yacht.hourlyPrice)}
                            </span>
                            <span className="text-sm text-gray-600 ml-1">/hr</span>
                          </div>
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="text-primary-600 font-semibold flex items-center"
                          >
                            <span>Explore</span>
                            <ArrowRight className="w-5 h-5 ml-1" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
