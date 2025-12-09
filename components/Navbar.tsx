'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Menu, X, User, LogOut, Ship, Home } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout, hasRole } = useAuthStore()
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Determine text color based on page and scroll state
  const textColorClass = isHomePage && !scrolled 
    ? 'text-white' 
    : 'text-gray-900'
  const linkColorClass = isHomePage && !scrolled
    ? 'text-white/90 hover:text-white'
    : 'text-gray-700 hover:text-primary-600'
  const iconColorClass = isHomePage && !scrolled
    ? 'text-white'
    : 'text-primary-600'
  const logoIconColorClass = isHomePage && !scrolled
    ? 'text-white group-hover:text-luxury-gold'
    : 'text-primary-600 group-hover:text-primary-700'
  const mobileMenuButtonClass = isHomePage && !scrolled
    ? 'text-white hover:bg-white/20'
    : 'text-gray-700 hover:bg-gray-100'

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : isHomePage
          ? 'bg-black/20 backdrop-blur-sm'
          : 'bg-white/95 backdrop-blur-md shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <Ship className={`w-8 h-8 ${logoIconColorClass} transition-colors`} />
            <span className={`text-xl md:text-2xl font-bold ${textColorClass}`}>
              Yacht<span className={isHomePage && !scrolled ? 'text-luxury-gold' : 'text-primary-600'}>Booking</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`${linkColorClass} font-medium transition-colors flex items-center space-x-1`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            {!isAuthenticated ? (
              <>
                <Link
                  href="/yachts"
                  className={`${linkColorClass} font-medium transition-colors`}
                >
                  Browse Yachts
                </Link>
                <Link
                  href="/login"
                  className={`${linkColorClass} font-medium transition-colors`}
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                {user?.role === 'user' && (
                  <>
                    <Link
                      href="/yachts"
                      className={`${linkColorClass} font-medium transition-colors`}
                    >
                      Browse Yachts
                    </Link>
                    <Link
                      href="/dashboard"
                      className={`${linkColorClass} font-medium transition-colors`}
                    >
                      My Bookings
                    </Link>
                  </>
                )}
                {hasRole('yacht_admin') && (
                  <Link
                    href="/yacht-admin"
                    className={`${linkColorClass} font-medium transition-colors`}
                  >
                    Admin Panel
                  </Link>
                )}
                {hasRole('super_admin') && (
                  <Link
                    href="/super-admin"
                    className={`${linkColorClass} font-medium transition-colors`}
                  >
                    Super Admin
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 ${linkColorClass}`}>
                    <User className="w-5 h-5" />
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-2 ${linkColorClass} hover:text-red-600 transition-colors`}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg ${mobileMenuButtonClass} transition-colors`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 hover:text-primary-600 font-medium py-2 flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/yachts"
                    onClick={() => setIsOpen(false)}
                    className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                  >
                    Browse Yachts
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <>
                  {user?.role === 'user' && (
                    <>
                      <Link
                        href="/yachts"
                        onClick={() => setIsOpen(false)}
                        className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                      >
                        Browse Yachts
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                      >
                        My Bookings
                      </Link>
                    </>
                  )}
                  {hasRole('yacht_admin') && (
                    <Link
                      href="/yacht-admin"
                      onClick={() => setIsOpen(false)}
                      className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                    >
                      Admin Panel
                    </Link>
                  )}
                  {hasRole('super_admin') && (
                    <Link
                      href="/super-admin"
                      onClick={() => setIsOpen(false)}
                      className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                    >
                      Super Admin
                    </Link>
                  )}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-gray-700 mb-3">
                      <User className="w-5 h-5" />
                      <span className="font-medium">{user?.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

