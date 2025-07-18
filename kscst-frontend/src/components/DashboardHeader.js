"use client"

import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { LogOut, User, Bell, ChevronDown, Menu, Shield, Home } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function DashboardHeader() {
  const { user, logout } = useContext(AuthContext)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    
    return () => clearInterval(timer)
  }, [])

  // Format time as HH:MM AM/PM
  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  // Format date as Day, Month Date
  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.3, 
        ease: 'easeOut',
        staggerChildren: 0.05,
        delayChildren: 0.05
      } 
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  }

  // Get initials from username
  const getInitials = () => {
    if (!user?.username) return ''
    
    const names = user.username.split(' ')
    if (names.length === 1) return names[0].charAt(0).toUpperCase()
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }

  // Get role color
  const getRoleColor = () => {
    if (!user?.role) return 'bg-gray-100'
    
    switch(user.role.toUpperCase()) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'TRAINER':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'TRAINEE':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-lg' 
          : 'bg-gradient-to-r from-blue-600 to-purple-600'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button placeholder - can be connected to sidebar toggle */}
          <button className="md:hidden p-2 rounded-full hover:bg-white/10 text-white">
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Logo and title */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              scrolled ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-white/20 backdrop-blur-sm text-white'
            }`}>
              <Shield className="w-5 h-5" />
            </div>
            <h1 className={`text-xl font-bold ${scrolled ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' : 'text-white'}`}>
              KSCST Training
            </h1>
          </motion.div>
        </div>
        
        {/* Right side items */}
        <div className="flex items-center space-x-2 md:space-x-6">
          {/* Date and time - hidden on mobile */}
          <div className="hidden md:flex flex-col items-end">
            <span className={`text-sm font-medium ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              {formattedTime}
            </span>
            <span className={`text-xs ${scrolled ? 'text-gray-500' : 'text-blue-100'}`}>
              {formattedDate}
            </span>
          </div>
          
          {/* Navigation links - hidden on mobile */}
          <div className="hidden md:flex items-center space-x-1">
            <motion.a 
              href="/admin/dashboard" 
              className={`p-2 rounded-lg flex items-center space-x-1 ${
                scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Home</span>
            </motion.a>
          </div>
          
          {/* Notification bell */}
          <motion.button
            className={`p-2 rounded-full relative ${
              scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>
          
          {/* User profile dropdown */}
          <div className="relative">
            <motion.button
              className="flex items-center space-x-2"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              aria-label="Toggle user menu"
              aria-expanded={dropdownOpen}
              aria-controls="user-dropdown"
            >
              <div className={`flex items-center space-x-2 px-2 py-1 rounded-full ${
                scrolled 
                  ? 'hover:bg-gray-100 text-gray-900' 
                  : 'hover:bg-white/10 text-white'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  scrolled 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
                    : 'bg-white/20 backdrop-blur-sm text-white border border-white/20'
                }`}>
                  {getInitials() || <User className="w-4 h-4" />}
                </div>
                <span className="hidden md:inline text-sm font-medium">
                  {user?.username}
                </span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </motion.button>
            
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  id="user-dropdown"
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {/* User info */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                        {getInitials() || <User className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user?.username}</p>
                        <div className={`text-xs px-2 py-0.5 rounded-full inline-flex ${getRoleColor()}`}>
                          {user?.role}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu items */}
                  <div className="py-2">
                    <motion.button
                      onClick={() => {
                        logout()
                        setDropdownOpen(false)
                      }}
                      className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-300"
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader