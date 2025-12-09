'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Search, Calendar, Users, MapPin, ArrowRight, Star, Shield, Clock, Award, TrendingUp, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useYachtStore } from '@/store/yachtStore'

export default function HomePage() {
  const router = useRouter()
  const { yachts, initializeData } = useYachtStore()
  const [searchParams, setSearchParams] = useState({
    location: '',
    yachtType: '',
    capacity: '',
    priceRange: '',
  })

  useEffect(() => {
    initializeData()
  }, [initializeData])

  const approvedYachts = yachts.filter(y => y.status === 'approved')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchParams.location) params.set('location', searchParams.location)
    if (searchParams.yachtType) params.set('type', searchParams.yachtType)
    if (searchParams.capacity) params.set('capacity', searchParams.capacity)
    if (searchParams.priceRange) params.set('price', searchParams.priceRange)
    router.push(`/yachts?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24 pb-16 md:pb-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-blue-900/70 to-purple-900/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.2),transparent_50%)]" />
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-white"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20"
              >
                <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
                <span className="text-sm font-medium">Premium Yacht Experiences</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Luxury Yacht
                <br />
                <span className="bg-gradient-to-r from-luxury-gold via-yellow-300 to-luxury-gold bg-clip-text text-transparent">
                  Experiences
                </span>
                <br />
                in Dubai
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
                Discover the ultimate in maritime luxury. Book your perfect yacht experience in Dubai Marina, JBR, or Creek.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                {[
                  { value: '50+', label: 'Yachts' },
                  { value: '10K+', label: 'Guests' },
                  { value: '4.9', label: 'Rating' },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-luxury-gold mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/yachts"
                  className="bg-gradient-to-r from-primary-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-primary-500/50 transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>Explore Yachts</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
                >
                  Book Now
                </Link>
              </motion.div>
            </motion.div>

            {/* Right - Search Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >

              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <select
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Locations</option>
                  <option value="Dubai Marina">Dubai Marina</option>
                  <option value="JBR">JBR</option>
                  <option value="Creek">Creek</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yacht Type
                </label>
                <select
                  value={searchParams.yachtType}
                  onChange={(e) => setSearchParams({ ...searchParams, yachtType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="Motor Yacht">Motor Yacht</option>
                  <option value="Catamaran">Catamaran</option>
                  <option value="Sailing Yacht">Sailing Yacht</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Capacity
                </label>
                <select
                  value={searchParams.capacity}
                  onChange={(e) => setSearchParams({ ...searchParams, capacity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  <option value="10">Up to 10</option>
                  <option value="20">Up to 20</option>
                  <option value="30">Up to 30</option>
                  <option value="30+">30+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={searchParams.priceRange}
                  onChange={(e) => setSearchParams({ ...searchParams, priceRange: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Any Price</option>
                  <option value="1000-2000">AED 1,000 - 2,000/hr</option>
                  <option value="2000-3000">AED 2,000 - 3,000/hr</option>
                  <option value="3000+">AED 3,000+/hr</option>
                </select>
              </div>
            </div>

                <button
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-primary-500/50 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Search Yachts</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-12 bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Award, value: 'Premium', label: 'Quality Fleet' },
              { icon: Shield, value: '100%', label: 'Safe & Secure' },
              { icon: Clock, value: '24/7', label: 'Support' },
              { icon: TrendingUp, value: '10K+', label: 'Happy Guests' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Yachts */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-primary-100 text-primary-600 px-4 py-2 rounded-full mb-4"
            >
              <Star className="w-4 h-4 fill-primary-600" />
              <span className="text-sm font-semibold">Premium Collection</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Yachts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our premium collection of luxury yachts available for your next adventure
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {approvedYachts.slice(0, 3).map((yacht, index) => (
              <motion.div
                key={yacht.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/yachts/${yacht.id}`}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100"
                  >
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={yacht.images[0]}
                        alt={yacht.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <span className="text-sm font-semibold text-primary-600 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {yacht.location}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-sm font-semibold text-gray-900 flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                          {yacht.rating}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">{yacht.name}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg">
                          <Users className="w-4 h-4 mr-1.5 text-primary-600" />
                          {yacht.capacity} guests
                        </span>
                        <span className="text-primary-600 font-semibold">{yacht.yachtType}</span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <span className="text-3xl font-bold text-primary-600">
                            AED {yacht.hourlyPrice.toLocaleString()}
                          </span>
                          <span className="text-sm font-normal text-gray-600 ml-1">/hr</span>
                        </div>
                        <span className="text-primary-600 font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                          View Details <ArrowRight className="w-5 h-5 ml-1" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              href="/yachts"
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <span>View All Yachts</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-blue-50/50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our premium yacht booking service
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Easy Booking',
                description: 'Simple and quick booking process with instant confirmation',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: Users,
                title: 'Expert Crew',
                description: 'Professional captains and crew for a safe and memorable experience',
                color: 'from-primary-500 to-primary-600',
              },
              {
                icon: MapPin,
                title: 'Prime Locations',
                description: 'Access to the best locations in Dubai Marina, JBR, and Creek',
                color: 'from-purple-500 to-purple-600',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Set Sail?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Book your luxury yacht experience today and create unforgettable memories on the pristine waters of Dubai.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/yachts"
                className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Browse Yachts</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
              >
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


