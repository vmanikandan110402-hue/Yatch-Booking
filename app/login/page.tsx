'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useAuthStore } from '@/store/authStore'
import { Ship, Mail, Lock, LogIn, Eye, EyeOff, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isSignup = searchParams.get('signup') === 'true'
  const { login, register, isAuthenticated, user } = useAuthStore()
  const [isSignUpMode, setIsSignUpMode] = useState(isSignup)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'yacht_admin') {
        router.push('/yacht-admin')
      } else if (user.role === 'super_admin') {
        router.push('/super-admin')
      } else {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (isSignUpMode) {
      if (!formData.name.trim()) {
        toast.error('Please enter your full name')
        setLoading(false)
        return
      }
      if (!formData.phone.trim()) {
        toast.error('Please enter your phone number')
        setLoading(false)
        return
      }
      if (!formData.email.trim()) {
        toast.error('Please enter your email address')
        setLoading(false)
        return
      }
      if (!formData.password) {
        toast.error('Please enter a password')
        setLoading(false)
        return
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long')
        setLoading(false)
        return
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        setLoading(false)
        return
      }

      const result = await register(
        formData.email,
        formData.password,
        formData.name,
        formData.phone,
        'user'
      )
      setLoading(false)

      if (result.success) {
        toast.success('Registration successful! Please login with your credentials.')
        const registeredEmail = formData.email
        setFormData({
          email: registeredEmail,
          password: '',
          confirmPassword: '',
          name: '',
          phone: '',
        })
        setIsSignUpMode(false)
      } else {
        toast.error(result.error || 'Registration failed')
      }
      return
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email address')
      setLoading(false)
      return
    }
    if (!formData.password) {
      toast.error('Please enter your password')
      setLoading(false)
      return
    }

    const result = await login(formData.email, formData.password)
    setLoading(false)

    if (result.success) {
      toast.success('Login successful!')
      if (result.role === 'yacht_admin') {
        router.push('/yacht-admin')
      } else if (result.role === 'super_admin') {
        router.push('/super-admin')
      } else {
        router.push('/dashboard')
      }
    } else {
      toast.error(result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Background with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80)',
            filter: 'brightness(0.4)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-blue-900/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.2),transparent_50%)]" />
        
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <Navbar />
      
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-center">
            {/* Left Side - Premium Content (3 columns on large screens) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2 space-y-6 md:space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center lg:text-left"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary-500 via-blue-500 to-purple-600 rounded-3xl mb-6 shadow-2xl"
                >
                  <Ship className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  Luxury Yacht
                  <br />
                  <span className="bg-gradient-to-r from-luxury-gold via-yellow-300 to-luxury-gold bg-clip-text text-transparent">
                    Experiences
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Discover the ultimate in maritime luxury. Book your perfect yacht experience in Dubai Marina, JBR, or Creek.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 pt-4"
              >
                {[
                  { icon: '✨', title: 'Premium Fleet', desc: 'World-class luxury yachts' },
                  { icon: '🎯', title: 'Easy Booking', desc: 'Quick & simple process' },
                  { icon: '⭐', title: 'Expert Crew', desc: 'Professional service' },
                ].map((feature, idx) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex items-start space-x-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <span className="text-2xl md:text-3xl flex-shrink-0">{feature.icon}</span>
                    <div>
                      <h3 className="text-white font-semibold text-base md:text-lg mb-1">{feature.title}</h3>
                      <p className="text-white/70 text-sm">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Side - Form (2 columns on large screens) */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-3 w-full max-w-lg mx-auto lg:max-w-none"
            >
              {/* Premium Glass Card */}
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 via-blue-500 to-purple-600 rounded-3xl blur-xl opacity-30 animate-pulse" />
                
                <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8 lg:p-10">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl mb-6 shadow-lg"
                >
                  <Ship className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  {isSignUpMode ? 'Create Account' : 'Welcome Back'}
                </h1>
                <p className="text-blue-100 text-lg">
                  {isSignUpMode
                    ? 'Join us for an extraordinary journey'
                    : 'Sign in to continue your luxury experience'}
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {isSignUpMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-white/90 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                        required={isSignUpMode}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/90 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-5 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                        placeholder="+971 50 123 4567"
                        required={isSignUpMode}
                      />
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2 flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-5 py-3.5 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                      minLength={isSignUpMode ? 6 : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {isSignUpMode && (
                    <p className="text-xs text-white/60 mt-2">Minimum 6 characters</p>
                  )}
                </div>

                {isSignUpMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-semibold text-white/90 mb-2 flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full px-5 py-3.5 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        required={isSignUpMode}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>
                )}


                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-primary-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  {loading ? (
                    <span className="flex items-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                      />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>{isSignUpMode ? 'Create Account' : 'Sign In'}</span>
                    </>
                  )}
                </motion.button>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center"
              >
                <button
                  onClick={() => setIsSignUpMode(!isSignUpMode)}
                  className="text-white/80 hover:text-white font-medium transition-colors text-sm"
                >
                  {isSignUpMode
                    ? 'Already have an account? Sign In'
                    : "Don't have an account? Create One"}
                </button>
              </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
