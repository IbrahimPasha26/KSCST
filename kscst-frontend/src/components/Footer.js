"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  Facebook,
  X,
  Instagram,
  Linkedin,
  Youtube,
  Heart,
  Users,
  BookOpen,
  Award,
  Send,
} from "lucide-react"

// Constants for contact details
const CONTACT_DETAILS = {
  email: "support@kscst.training",
  phone: "+919876543210",
  address: "Bengaluru, Karnataka",
}

// Social links with valid URLs (placeholders)
const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/kscst.iisc.ernet.in/", color: "hover:text-blue-500" },
  { name: "X", icon: X, href: "https://x.com/kscst_training", color: "hover:text-sky-400" },
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/", color: "hover:text-pink-500" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/karnataka-state-council-for-science-&-technology", color: "hover:text-blue-600" },
  { name: "YouTube", icon: Youtube, href: "https://www.youtube.com/channel/UCwb352-blzSbXqXM7VWp7uQ", color: "hover:text-red-500" },
]

function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState("")
  const location = useLocation()

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setError("Please enter an email address")
      setTimeout(() => setError(""), 3000)
      return
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      setTimeout(() => setError(""), 3000)
      return
    }
    setIsSubscribed(true)
    setEmail("")
    setError("")
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  // Handle smooth scrolling for quick links
  const handleLinkClick = (e, path) => {
    // Map routes to section IDs
    const sectionMap = {
      "/about": "about",
      "/courses": null, // No corresponding section
      "/testimonials": "testimonials",
      "/contact": "contact",
    }
    const sectionId = sectionMap[path] || null
    // If on home page and link maps to a section, scroll to section
    if (location.pathname === "/" && sectionId) {
      e.preventDefault()
      const target = document.getElementById(sectionId)
      if (target) {
        target.scrollIntoView({ behavior: "smooth" })
      }
    }
    // For other routes or non-section links, let react-router-dom handle navigation
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Courses", path: "/courses" },
    { name: "Success Stories", path: "/testimonials" },
    { name: "Contact", path: "/contact" },
  ]

  const trainingLinks = [
    { name: "Join as Trainee", path: "/trainee/register" },
    { name: "Become a Trainer", path: "/trainer/register" },
    { name: "Sign In", path: "/login" },
    { name: "Help Center", path: "/help" },
    { name: "FAQs", path: "/faq" },
  ]

  const stats = [
    { icon: Users, number: "15,000+", label: "Women Trained" },
    { icon: BookOpen, number: "200+", label: "Courses" },
    { icon: Award, number: "85%", label: "Success Rate" },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 z-[-1]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-20 h-20 bg-teal-500/10 rounded-full blur-xl z-[-1] motion-reduce:animate-none"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl z-[-1] motion-reduce:animate-none"
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, threshold: 0.1 }}
        >
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center"
                >
                  <Sparkles className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    KSCST Training
                  </h3>
                  <p className="text-sm text-gray-400">Empowering Women Since 2010</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-8 max-w-md">
                Transforming lives through comprehensive vocational training programs designed specifically for rural
                women. Join thousands who have built successful careers with our expert guidance.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                  >
                    <stat.icon className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{stat.number}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-teal-400" />
                  Stay Updated
                </h4>
                <p className="text-gray-300 text-sm mb-4">Get the latest updates on new courses and success stories.</p>
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"
                  aria-label="Newsletter subscription form"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="min-w-0 flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent focus-visible:ring-2 focus-visible:ring-teal-500 transition-all"
                    required
                    aria-describedby={error ? "email-error" : undefined}
                  />
                  <motion.button
                    type="submit"
                    disabled={isSubscribed}
                    className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 transition-all duration-300 flex items-center space-x-2 focus-visible:ring-2 focus-visible:ring-teal-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={isSubscribed ? "Subscribed" : "Subscribe to newsletter"}
                  >
                    {isSubscribed ? (
                      <>
                        <Heart className="w-4 h-4" />
                        <span>Subscribed!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Subscribe</span>
                      </>
                    )}
                  </motion.button>
                </form>
                {error && (
                  <p id="email-error" className="text-red-400 text-sm mt-2">
                    {error}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <ArrowRight className="w-5 h-5 mr-2 text-teal-400" />
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      onClick={(e) => handleLinkClick(e, link.path)}
                      className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 flex items-center group focus-visible:text-white focus-visible:underline"
                    >
                      <span className="w-1 h-1 bg-teal-400 rounded-full mr-3 group-hover:w-2 transition-all duration-200" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Training Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                Training
              </h4>
              <ul className="space-y-3">
                {trainingLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 flex items-center group focus-visible:text-white focus-visible:underline"
                    >
                      <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:w-2 transition-all duration-200" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Section */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-white/10"
          >
            <h4 className="text-xl font-semibold mb-6 text-center">Get in Touch</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.a
                href={`mailto:${CONTACT_DETAILS.email}`}
                className="flex items-center justify-center space-x-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-red-500"
                whileHover={{ scale: 1.02 }}
                aria-label={`Send email to ${CONTACT_DETAILS.email}`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email Us</p>
                  <p className="text-white font-medium">{CONTACT_DETAILS.email}</p>
                </div>
              </motion.a>

              <motion.a
                href={`tel:${CONTACT_DETAILS.phone}`}
                className="flex items-center justify-center space-x-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-green-500"
                whileHover={{ scale: 1.02 }}
                aria-label={`Call ${CONTACT_DETAILS.phone}`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Call Us</p>
                  <p className="text-white font-medium">{CONTACT_DETAILS.phone}</p>
                </div>
              </motion.a>

              <motion.div
                className="flex items-center justify-center space-x-3 p-4 bg-white/5 rounded-2xl group"
                whileHover={{ scale: 1.02 }}
                aria-label={`Visit us at ${CONTACT_DETAILS.address}`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Visit Us</p>
                  <p className="text-white font-medium">{CONTACT_DETAILS.address}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10"
          >
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <p className="text-gray-400">© {new Date().getFullYear()} KSCST Vocational Training. Made with</p>
              <Heart className="w-4 h-4 text-red-500" />
              <p className="text-gray-400">for empowering women.</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm mr-2">Follow us:</span>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-${social.color.split('-')[2]}-500`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer