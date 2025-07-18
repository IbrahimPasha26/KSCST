"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { registerTrainee } from "../services/authService"
import Header from "../components/Header"
import {
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  Scissors,
  Utensils,
  Paintbrush,
  Monitor,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  Target,
  Eye,
  EyeOff,
  UserPlus,
  Heart,
} from "lucide-react"

function TraineeRegister() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    skill: "",
    location: "",
  })
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Clear message when user starts typing
    if (message) setMessage("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await registerTrainee(formData)
      setMessage("Registration successful! Please log in.")
      setFormData({
        username: "",
        password: "",
        name: "",
        email: "",
        phone: "",
        skill: "",
        location: "",
      })
    } catch (error) {
      setMessage(error.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, rotateY: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  }

  const skills = [
    { value: "tailoring", label: "Tailoring", icon: Scissors, color: "from-pink-500 to-rose-500" },
    { value: "food_processing", label: "Food Processing", icon: Utensils, color: "from-orange-500 to-amber-500" },
    { value: "handicrafts", label: "Handicrafts", icon: Paintbrush, color: "from-purple-500 to-indigo-500" },
    { value: "digital_literacy", label: "Digital Literacy", icon: Monitor, color: "from-blue-500 to-cyan-500" },
  ]

  const benefits = [
    { icon: Award, text: "Certified training programs" },
    { icon: Users, text: "Expert mentorship" },
    { icon: Target, text: "Job placement assistance" },
    { icon: Heart, text: "Supportive community" },
  ]

  const formFields = [
    { name: "name", label: "Full Name", type: "text", icon: User, placeholder: "Enter your full name" },
    { name: "username", label: "Username", type: "text", icon: User, placeholder: "Choose a username" },
    { name: "email", label: "Email", type: "email", icon: Mail, placeholder: "Enter your email address" },
    { name: "phone", label: "Phone", type: "tel", icon: Phone, placeholder: "Enter your phone number" },
    { name: "location", label: "Location", type: "text", icon: MapPin, placeholder: "Enter your location" },
    { name: "password", label: "Password", type: "password", icon: Lock, placeholder: "Create a strong password" },
  ]

  const stats = [
    { number: "15,000+", label: "Women Trained" },
    { number: "85%", label: "Success Rate" },
    { number: "200+", label: "Courses Available" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow relative flex items-center justify-center py-12 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-blue-600 to-purple-700 opacity-90" />
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-pink-400/20 rounded-full blur-xl"
        />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Welcome Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-white space-y-8"
            >
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                  <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
                  <span className="text-sm font-medium">Start Your Journey!</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                  Transform Your
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Future Today
                  </span>
                </h1>
                <p className="text-xl text-gray-100 leading-relaxed mb-8">
                  Join thousands of women who have built successful careers through our comprehensive vocational
                  training programs. Your journey to financial independence starts here.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full p-2">
                      <benefit.icon className="w-5 h-5 text-yellow-300" />
                    </div>
                    <span className="text-gray-100">{benefit.text}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Side - Registration Form */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/20 max-w-2xl mx-auto w-full"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <UserPlus className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Join as a Trainee</h2>
                <p className="text-gray-600">Create your account and start learning</p>
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
                    message.includes("successful")
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {message.includes("successful") ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">{message}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formFields.map((field) => (
                    <motion.div
                      key={field.name}
                      variants={itemVariants}
                      className={field.name === "password" ? "md:col-span-2" : ""}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
                      <div className="relative">
                        <motion.input
                          type={field.type === "password" && showPassword ? "text" : field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                          placeholder={field.placeholder}
                          required
                          aria-label={field.label}
                          autoComplete="off"
                          variants={inputVariants}
                          whileFocus="focus"
                        />
                        <field.icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        {field.type === "password" && (
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Skill Selection */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Select Your Skill</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {skills.map((skill) => (
                      <motion.label
                        key={skill.value}
                        className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          formData.skill === skill.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="radio"
                          name="skill"
                          value={skill.value}
                          checked={formData.skill === skill.value}
                          onChange={handleChange}
                          className="sr-only"
                          required
                          aria-label={`Select ${skill.label}`}
                        />
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 bg-gradient-to-br ${skill.color}`}
                        >
                          <skill.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-sm">{skill.label}</div>
                        </div>
                        {formData.skill === skill.value && <CheckCircle className="w-5 h-5 text-blue-600" />}
                      </motion.label>
                    ))}
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                  variants={buttonVariants}
                  whileHover={!isLoading ? "hover" : {}}
                  whileTap={!isLoading ? "tap" : {}}
                  aria-label="Register as trainee"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Register</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Login Link */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TraineeRegister
