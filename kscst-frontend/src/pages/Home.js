"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Header from "../components/Header"
import Footer from "../components/Footer"
import {
  Book,
  Users,
  Star,
  Mail,
  Scissors,
  Utensils,
  Paintbrush,
  Monitor,
  ArrowRight,
  CheckCircle,
  Award,
  Target,
  Heart,
} from "lucide-react"

function Home() {
  const [isVisible, setIsVisible] = useState(false)

  // Smooth scroll for anchor links
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute("href"))
        target?.scrollIntoView({ behavior: "smooth" })
      })
    })

    setIsVisible(true)
  }, [])

  // Animation controls for sections
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const skills = [
    {
      name: "Tailoring & Fashion Design",
      icon: Scissors,
      description: "Master garment creation, pattern making, and fashion design techniques.",
      color: "from-pink-500 to-rose-500",
    },
    {
      name: "Food Processing & Safety",
      icon: Utensils,
      description: "Learn food preservation, packaging, and quality control methods.",
      color: "from-orange-500 to-amber-500",
    },
    {
      name: "Handicrafts & Artistry",
      icon: Paintbrush,
      description: "Create beautiful handmade products using traditional and modern techniques.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      name: "Digital Literacy & Tech",
      icon: Monitor,
      description: "Gain essential computer skills and online business knowledge.",
      color: "from-blue-500 to-cyan-500",
    },
  ]

  const features = [
    {
      title: "Expert Mentorship",
      icon: Users,
      description: "Learn from industry professionals with years of experience.",
      stat: "500+ Trainers",
    },
    {
      title: "Flexible Learning",
      icon: Book,
      description: "Access courses anytime, anywhere with our mobile-friendly platform.",
      stat: "24/7 Access",
    },
    {
      title: "Community Network",
      icon: Heart,
      description: "Join a supportive community of learners and successful entrepreneurs.",
      stat: "10,000+ Members",
    },
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Successful Entrepreneur",
      quote: "KSCST transformed my life! I now run a successful tailoring business employing 5 women.",
      initials: "PS",
      gradient: "from-pink-500 to-rose-500",
      rating: 5,
    },
    {
      name: "Anita Reddy",
      role: "Food Processing Expert",
      quote: "The food processing course gave me the confidence to start my own pickle business.",
      initials: "AR",
      gradient: "from-orange-500 to-amber-500",
      rating: 5,
    },
    {
      name: "Suresh Kumar",
      role: "Digital Literacy Trainer",
      quote: "Teaching digital skills to rural women is incredibly rewarding. KSCST makes it possible.",
      initials: "SK",
      gradient: "from-blue-500 to-cyan-500",
      rating: 5,
    },
  ]

  const stats = [
    { number: "15,000+", label: "Women Trained" },
    { number: "85%", label: "Success Rate" },
    { number: "200+", label: "Courses Available" },
    { number: "50+", label: "Districts Covered" },
  ]

  // Profile Avatar Component
  const ProfileAvatar = ({ initials, gradient, name }) => {
    return (
      <div className="relative">
        <motion.div
          className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          {initials}
        </motion.div>
        {/* Decorative ring */}
        <div className={`absolute -inset-1 bg-gradient-to-br ${gradient} rounded-2xl opacity-20 blur-sm -z-10`} />
        {/* Status indicator */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
          <CheckCircle className="w-3 h-3 text-white" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-600 via-blue-600 to-purple-700">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="container mx-auto px-4 text-center z-10 text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-white/20"
              >
                <Award className="w-4 h-4 mr-2 text-yellow-300" />
                <span className="text-sm font-medium">Empowering Rural Women Since 2025</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              >
                Transform Your
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Future Today
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-100 leading-relaxed"
              >
                Join thousands of women who have built successful careers through our comprehensive vocational training
                programs.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
              >
                <Link
                  to="/trainee/register"
                  className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                  Start Learning Today
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/trainer/register"
                  className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                  Become a Trainer
                  <Users className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">{stat.number}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"
          />
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              className="text-center mb-16"
            >
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose KSCST?
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
                We provide comprehensive support to ensure your success in building a sustainable career.
              </motion.p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-teal-200"
                >
                  <div className="bg-gradient-to-br from-teal-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                  <div className="text-teal-600 font-bold text-lg">{feature.stat}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="container mx-auto px-4">
            <motion.div variants={containerVariants} initial="hidden" animate={controls} className="text-center mb-16">
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6">
                Master In-Demand Skills
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xl text-gray-300 max-w-3xl mx-auto">
                Choose from our comprehensive range of vocational training programs designed for the modern economy.
              </motion.p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-700 p-8 rounded-3xl hover:scale-105 transition-all duration-300 border border-gray-600 hover:border-gray-500"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                  <div
                    className={`bg-gradient-to-br ${skill.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <skill.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-white transition-colors">{skill.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                    {skill.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section - Updated with Modern Profile Avatars */}
        <section id="testimonials" className="py-24 bg-gradient-to-br from-teal-50 to-blue-50">
          <div className="container mx-auto px-4">
            <motion.div variants={containerVariants} initial="hidden" animate={controls} className="text-center mb-16">
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Success Stories
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from women who have transformed their lives through our training programs.
              </motion.p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden group"
                >
                  {/* Background gradient on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  <div className="flex items-center mb-6 relative z-10">
                    <ProfileAvatar
                      initials={testimonial.initials}
                      gradient={testimonial.gradient}
                      name={testimonial.name}
                    />
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="flex mb-4 relative z-10">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + i * 0.1, duration: 0.3 }}
                      >
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-gray-700 italic leading-relaxed relative z-10">"{testimonial.quote}"</p>

                  {/* Decorative quote mark */}
                  <div className="absolute top-4 right-4 text-6xl text-gray-100 font-serif leading-none">"</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="py-24 bg-gradient-to-br from-purple-600 to-indigo-700 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='0.3'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div variants={containerVariants} initial="hidden" animate={controls} className="max-w-4xl mx-auto">
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-8">
                About KSCST
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xl md:text-2xl mb-8 leading-relaxed text-gray-100">
                The Karnataka State Council for Science and Technology (KSCST) has been at the forefront of empowering
                rural women through innovative vocational training programs for over a decade.
              </motion.p>
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <Target className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                  <p className="text-gray-200">Empowering women with skills for economic independence</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Our Impact</h3>
                  <p className="text-gray-200">15,000+ women trained across 50+ districts</p>
                </div>
                <div className="text-center">
                  <Heart className="w-12 h-12 text-pink-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Our Values</h3>
                  <p className="text-gray-200">Community, growth, and sustainable development</p>
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  to="/about"
                  className="inline-flex items-center bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                >
                  Learn More About Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div variants={containerVariants} initial="hidden" animate={controls} className="max-w-3xl mx-auto">
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Ready to Get Started?
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-12">
                Join our community today and take the first step towards building your dream career.
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="mailto:support@kscst.training"
                  className="group inline-flex items-center bg-gradient-to-r from-teal-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Support
                </a>
                <Link
                  to="/trainee/register"
                  className="group inline-flex items-center bg-gray-100 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300 border-2 border-gray-200"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Home