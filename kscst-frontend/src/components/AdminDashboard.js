"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import {
  getAllTrainees,
  getAllTrainers,
  deleteTrainee,
  deleteTrainer,
  approveTrainee,
  rejectTrainee,
  approveTrainer,
  rejectTrainer,
  getApprovedTrainers,
  getAllTraineeProgress,
  deployCertificate,
} from "../services/authService"
import {
  Users,
  UserCheck,
  Menu,
  X,
  XCircle,
  ChevronDown,
  Pin,
  PinOff,
  CheckCircle,
  Award,
  TrendingUp,
  Clock,
  Shield,
  BarChart3,
  Activity,
  UserPlus,
  GraduationCap,
  Target,
  Calendar,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  Trash2,
  Check,
  AlertTriangle,
  Bell,
  Settings,
  Download,
  Filter,
  Zap,
  Star,
  BookOpen,
  Users2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import DashboardHeader from "./DashboardHeader"

function AdminDashboard() {
  const { user, credentials } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMiniSidebar, setIsMiniSidebar] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({})
  const [trainees, setTrainees] = useState([])
  const [trainers, setTrainers] = useState([])
  const [approvedTrainers, setApprovedTrainers] = useState([])
  const [traineeProgress, setTraineeProgress] = useState([])
  const [message, setMessage] = useState("")
  const [selectedTrainerId, setSelectedTrainerId] = useState({})
  const [isLoadingTrainees, setIsLoadingTrainees] = useState(false)
  const [isLoadingTrainers, setIsLoadingTrainers] = useState(false)
  const [isLoadingApprovedTrainers, setIsLoadingApprovedTrainers] = useState(false)
  const [isLoadingProgress, setIsLoadingProgress] = useState(false)
  const [expandedProgress, setExpandedProgress] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [viewMode, setViewMode] = useState("grid") // grid or table

  useEffect(() => {
    if (credentials) {
      fetchTrainees()
      fetchTrainers()
      fetchApprovedTrainers()
      fetchTraineeProgress()
    }
  }, [credentials])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const fetchTrainees = async () => {
    setIsLoadingTrainees(true)
    try {
      const data = await getAllTrainees(credentials)
      setTrainees(Array.isArray(data) ? data : [])
    } catch (error) {
      setMessage(error.message || "Failed to fetch trainees")
    } finally {
      setIsLoadingTrainees(false)
    }
  }

  const fetchTrainers = async () => {
    setIsLoadingTrainers(true)
    try {
      const data = await getAllTrainers(credentials)
      setTrainers(Array.isArray(data) ? data : [])
    } catch (error) {
      setMessage(error.message || "Failed to fetch trainers")
    } finally {
      setIsLoadingTrainers(false)
    }
  }

  const fetchApprovedTrainers = async () => {
    setIsLoadingApprovedTrainers(true)
    try {
      const data = await getApprovedTrainers(credentials)
      setApprovedTrainers(Array.isArray(data) ? data : [])
    } catch (error) {
      setMessage(error.message || "Failed to fetch approved trainers")
    } finally {
      setIsLoadingApprovedTrainers(false)
    }
  }

  const fetchTraineeProgress = async () => {
    setIsLoadingProgress(true)
    try {
      const data = await getAllTraineeProgress(credentials)
      setTraineeProgress(Array.isArray(data) ? data : [])
    } catch (error) {
      setMessage(error.message || "Failed to fetch trainee progress")
    } finally {
      setIsLoadingProgress(false)
    }
  }

  const handleDeleteTrainee = async (id) => {
    try {
      await deleteTrainee(id, credentials)
      setMessage("Trainee deleted successfully")
      fetchTrainees()
    } catch (error) {
      setMessage(error.message || "Failed to delete trainee")
    }
  }

  const handleDeleteTrainer = async (id) => {
    try {
      await deleteTrainer(id, credentials)
      setMessage("Trainer deleted successfully")
      fetchTrainers()
    } catch (error) {
      setMessage(error.message || "Failed to delete trainer")
    }
  }

  const handleApproveTrainee = async (id) => {
    const trainerId = selectedTrainerId[id]
    if (!trainerId) {
      setMessage("Please select a trainer before approving")
      return
    }
    try {
      await approveTrainee(id, trainerId, credentials)
      setMessage("Trainee approved and assigned to trainer")
      setSelectedTrainerId((prev) => {
        const newState = { ...prev }
        delete newState[id]
        return newState
      })
      fetchTrainees()
      fetchTraineeProgress()
    } catch (error) {
      setMessage(error.message || "Failed to approve trainee")
    }
  }

  const handleRejectTrainee = async (id) => {
    try {
      await rejectTrainee(id, credentials)
      setMessage("Trainee rejected successfully")
      fetchTrainees()
      fetchTraineeProgress()
    } catch (error) {
      setMessage(error.message || "Failed to reject trainee")
    }
  }

  const handleApproveTrainer = async (id) => {
    try {
      await approveTrainer(id, credentials)
      setMessage("Trainer approved successfully")
      fetchTrainers()
      fetchApprovedTrainers()
    } catch (error) {
      setMessage(error.message || "Failed to approve trainer")
    }
  }

  const handleRejectTrainer = async (id) => {
    try {
      await rejectTrainer(id, credentials)
      setMessage("Trainer rejected successfully")
      fetchTrainers()
    } catch (error) {
      setMessage(error.message || "Failed to reject trainer")
    }
  }

  const handleDeployCertificate = async (traineeId) => {
    try {
      await deployCertificate(traineeId, credentials)
      setMessage("Certificate deployed successfully")
      fetchTraineeProgress()
    } catch (error) {
      setMessage(error.message || "Failed to deploy certificate")
    }
  }

  const toggleProgressDetails = (traineeId) => {
    setExpandedProgress((prev) => ({
      ...prev,
      [traineeId]: !prev[traineeId],
    }))
  }

  const isSuccessMessage = (msg) => msg.includes("successfully") || msg.includes("approved") || msg.includes("rejected")

  const toggleMenu = (id) => {
    setExpandedMenus((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Calculate statistics with trends
  const stats = {
    totalTrainees: trainees.length,
    pendingTrainees: trainees.filter((t) => t.status === "PENDING").length,
    approvedTrainees: trainees.filter((t) => t.status === "APPROVED").length,
    totalTrainers: trainers.length,
    pendingTrainers: trainers.filter((t) => t.status === "PENDING").length,
    approvedTrainersCount: trainers.filter((t) => t.status === "APPROVED").length,
    averageProgress:
      traineeProgress.length > 0
        ? Math.round(traineeProgress.reduce((acc, p) => acc + p.completionPercentage, 0) / traineeProgress.length)
        : 0,
    certificatesIssued: traineeProgress.filter((p) => p.hasCertificate).length,
    activeTrainees: traineeProgress.filter((p) => p.completionPercentage > 0 && p.completionPercentage < 100).length,
    completedTrainees: traineeProgress.filter((p) => p.completionPercentage >= 100).length,
  }

  const navItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: BarChart3,
      subItems: [],
    },
    {
      id: "trainees",
      label: "Trainees",
      icon: Users,
      badge: stats.pendingTrainees,
      subItems: [
        { id: "trainees-pending", label: "Pending Approval", tab: "trainees", filter: "PENDING" },
        { id: "trainees-approved", label: "Approved", tab: "trainees", filter: "APPROVED" },
        { id: "trainees-all", label: "All Trainees", tab: "trainees", filter: "all" },
      ],
    },
    {
      id: "trainers",
      label: "Trainers",
      icon: UserCheck,
      badge: stats.pendingTrainers,
      subItems: [
        { id: "trainers-pending", label: "Pending Approval", tab: "trainers", filter: "PENDING" },
        { id: "trainers-approved", label: "Approved", tab: "trainers", filter: "APPROVED" },
        { id: "trainers-all", label: "All Trainers", tab: "trainers", filter: "all" },
      ],
    },
    {
      id: "progress",
      label: "Progress Tracking",
      icon: TrendingUp,
      subItems: [],
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: Activity,
      subItems: [],
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 },
  }

  const sidebarVariants = {
    open: { width: "280px", transition: { duration: 0.3, ease: "easeInOut" } },
    mini: { width: "80px", transition: { duration: 0.3, ease: "easeInOut" } },
  }

  // Filter data based on search and status
  const filteredTrainees = trainees.filter((trainee) => {
    const matchesSearch =
      trainee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || trainee.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch =
      trainer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || trainer.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Enhanced Status Badge Component
  const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
      switch (status) {
        case "APPROVED":
          return {
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            border: "border-emerald-200",
            dot: "bg-emerald-500",
          }
        case "PENDING":
          return {
            bg: "bg-amber-50",
            text: "text-amber-700",
            border: "border-amber-200",
            dot: "bg-amber-500",
          }
        case "REJECTED":
          return {
            bg: "bg-red-50",
            text: "text-red-700",
            border: "border-red-200",
            dot: "bg-red-500",
          }
        default:
          return {
            bg: "bg-gray-50",
            text: "text-gray-700",
            border: "border-gray-200",
            dot: "bg-gray-500",
          }
      }
    }

    const config = getStatusConfig(status)

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
        {status}
      </span>
    )
  }

  // Enhanced Stats Card Component
  const StatsCard = ({ title, value, icon: Icon, gradient, trend, trendValue, subtitle }) => (
    <motion.div
      className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
      variants={cardVariants}
      whileHover={{ y: -2 }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
      />
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                trend === "up" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              }`}
            >
              {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trendValue}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )

  // Quick Action Card Component
  const QuickActionCard = ({ title, description, icon: Icon, onClick, gradient, badge }) => (
    <motion.button
      onClick={onClick}
      className="relative p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 text-left group w-full"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity rounded-2xl`}
      />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {badge && <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">{badge}</span>}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </motion.button>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader />

      <div className="flex flex-1 pt-16 md:pt-20">
        {/* Enhanced Sidebar */}
        <motion.aside
          className="fixed top-16 md:top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 ease-in-out md:sticky shadow-lg"
          variants={sidebarVariants}
          animate={isMiniSidebar && !sidebarOpen ? "mini" : "open"}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            {!isMiniSidebar || sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">KSCST Admin</h3>
                  <p className="text-xs text-gray-500">Dashboard</p>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
                <Shield className="w-4 h-4 text-white" />
              </div>
            )}

            {(!isMiniSidebar || sidebarOpen) && (
              <div className="flex items-center gap-2">
                <motion.button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMiniSidebar(!isMiniSidebar)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isMiniSidebar ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
                </motion.button>
                <motion.button
                  className="md:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setSidebarOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.id}>
                <motion.button
                  className={`flex items-center w-full p-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => {
                    if (item.subItems.length === 0) {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    } else {
                      toggleMenu(item.id)
                    }
                  }}
                  whileHover={{ x: isMiniSidebar ? 0 : 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {(!isMiniSidebar || sidebarOpen) && (
                    <>
                      <span className="ml-3 flex-1 text-left">{item.label}</span>
                      {item.badge > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.subItems.length > 0 && (
                        <motion.div
                          animate={{ rotate: expandedMenus[item.id] ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </motion.div>
                      )}
                    </>
                  )}
                </motion.button>

                {/* Submenu */}
                <AnimatePresence>
                  {expandedMenus[item.id] && (!isMiniSidebar || sidebarOpen) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden ml-4 mt-2 space-y-1"
                    >
                      {item.subItems.map((subItem) => (
                        <motion.button
                          key={subItem.id}
                          className={`flex items-center w-full p-2 pl-8 text-sm rounded-lg transition-colors ${
                            activeTab === subItem.tab && filterStatus === subItem.filter
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                          onClick={() => {
                            setActiveTab(subItem.tab)
                            setFilterStatus(subItem.filter || "all")
                            setSidebarOpen(false)
                          }}
                          whileHover={{ x: 2 }}
                        >
                          {subItem.label}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          {(!isMiniSidebar || sidebarOpen) && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{user.username?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isMiniSidebar ? "ml-20" : "ml-70"} md:ml-0 relative`}>
          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden fixed top-20 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200"
            onClick={() => setSidebarOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </motion.button>

          <div className="p-6 lg:p-8 space-y-8">
            {/* Welcome Section */}
            <motion.div
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-3xl p-8 text-white"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="mb-6 lg:mb-0">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">Welcome back, {user.username}! 👋</h1>
                    <p className="text-blue-100 text-lg mb-4">
                      Here's what's happening with your KSCST platform today.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>Admin Access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date().toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium hover:bg-white/30 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download className="w-4 h-4 mr-2 inline" />
                      Export Data
                    </motion.button>
                    <motion.button
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Bell className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Background decorations */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32" />
              <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/10 rounded-full" />
            </motion.div>

            {/* Message Notification */}
            <AnimatePresence>
              {message && (
                <motion.div
                  className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between ${
                    isSuccessMessage(message)
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-red-50 text-red-800 border-red-200"
                  }`}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    {isSuccessMessage(message) ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium">{message}</span>
                  </div>
                  <motion.button
                    onClick={() => setMessage("")}
                    className="p-1 hover:bg-black/5 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <XCircle className="w-5 h-5 opacity-60" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-8"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                      title="Total Trainees"
                      value={stats.totalTrainees}
                      subtitle={`${stats.activeTrainees} active`}
                      icon={Users}
                      gradient="from-blue-500 to-blue-600"
                      trend="up"
                      trendValue="+12%"
                    />
                    <StatsCard
                      title="Total Trainers"
                      value={stats.totalTrainers}
                      subtitle={`${stats.approvedTrainersCount} approved`}
                      icon={UserCheck}
                      gradient="from-purple-500 to-purple-600"
                      trend="up"
                      trendValue="+8%"
                    />
                    <StatsCard
                      title="Average Progress"
                      value={`${stats.averageProgress}%`}
                      subtitle={`${stats.completedTrainees} completed`}
                      icon={TrendingUp}
                      gradient="from-emerald-500 to-emerald-600"
                      trend="up"
                      trendValue="+5%"
                    />
                    <StatsCard
                      title="Certificates"
                      value={stats.certificatesIssued}
                      subtitle="Issued this month"
                      icon={Award}
                      gradient="from-orange-500 to-orange-600"
                      trend="up"
                      trendValue="+15%"
                    />
                  </div>

                  {/* Quick Actions */}
                  <motion.div variants={cardVariants} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Zap className="w-6 h-6 text-blue-600" />
                        Quick Actions
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <QuickActionCard
                        title="Manage Trainees"
                        description={`${stats.pendingTrainees} pending approvals`}
                        icon={UserPlus}
                        gradient="from-blue-500 to-blue-600"
                        badge={stats.pendingTrainees > 0 ? stats.pendingTrainees : null}
                        onClick={() => setActiveTab("trainees")}
                      />
                      <QuickActionCard
                        title="Manage Trainers"
                        description={`${stats.pendingTrainers} pending approvals`}
                        icon={GraduationCap}
                        gradient="from-purple-500 to-purple-600"
                        badge={stats.pendingTrainers > 0 ? stats.pendingTrainers : null}
                        onClick={() => setActiveTab("trainers")}
                      />
                      <QuickActionCard
                        title="Track Progress"
                        description="Monitor learning outcomes"
                        icon={Target}
                        gradient="from-emerald-500 to-emerald-600"
                        onClick={() => setActiveTab("progress")}
                      />
                    </div>
                  </motion.div>

                  {/* Recent Activity & Analytics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Activity */}
                    <motion.div
                      variants={cardVariants}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                          <Clock className="w-5 h-5 text-blue-600" />
                          Recent Activity
                        </h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserPlus className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">New trainee registered</p>
                            <p className="text-sm text-gray-600">John Doe joined the React Development course</p>
                            <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">Certificate deployed</p>
                            <p className="text-sm text-gray-600">Sarah completed Python Fundamentals</p>
                            <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">Trainer approved</p>
                            <p className="text-sm text-gray-600">Dr. Smith approved for Data Science</p>
                            <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                      variants={cardVariants}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                          Platform Overview
                        </h3>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Users2 className="w-8 h-8 text-blue-600" />
                            <div>
                              <p className="font-semibold text-gray-900">Active Users</p>
                              <p className="text-sm text-gray-600">Currently online</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">{stats.activeTrainees}</p>
                            <p className="text-sm text-emerald-600 flex items-center gap-1">
                              <ArrowUpRight className="w-3 h-3" />
                              +23%
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-emerald-600" />
                            <div>
                              <p className="font-semibold text-gray-900">Course Completion</p>
                              <p className="text-sm text-gray-600">This month</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">{stats.completedTrainees}</p>
                            <p className="text-sm text-emerald-600 flex items-center gap-1">
                              <ArrowUpRight className="w-3 h-3" />
                              +18%
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Star className="w-8 h-8 text-orange-600" />
                            <div>
                              <p className="font-semibold text-gray-900">Satisfaction Rate</p>
                              <p className="text-sm text-gray-600">Average rating</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">4.8</p>
                            <p className="text-sm text-emerald-600 flex items-center gap-1">
                              <ArrowUpRight className="w-3 h-3" />
                              +0.3
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {activeTab === "trainees" && (
                <motion.div
                  key="trainees"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                          <Users className="w-6 h-6 text-blue-600" />
                          Manage Trainees
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {filteredTrainees.length} of {trainees.length} trainees
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search trainees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </div>

                        <div className="relative">
                          <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
                          >
                            <option value="all">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                          </select>
                        </div>

                        <motion.button
                          onClick={fetchTrainees}
                          className="p-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isLoadingTrainees}
                        >
                          <RefreshCw className={`w-5 h-5 ${isLoadingTrainees ? "animate-spin" : ""}`} />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoadingTrainees ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading trainees...</p>
                        </div>
                      </div>
                    ) : filteredTrainees.length === 0 ? (
                      <div className="text-center py-16">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No trainees found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trainee</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Skill</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trainer</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {filteredTrainees.map((trainee) => {
                              const availableTrainers = approvedTrainers.filter((t) => t.expertise === trainee.skill)
                              return (
                                <motion.tr
                                  key={trainee.id}
                                  className="hover:bg-gray-50 transition-colors"
                                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                                >
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                          {trainee.name?.charAt(0).toUpperCase() ||
                                            trainee.username?.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-900">{trainee.name}</p>
                                        <p className="text-sm text-gray-500">@{trainee.username}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <p className="text-sm text-gray-900">{trainee.email}</p>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {trainee.skill}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <StatusBadge status={trainee.status} />
                                  </td>
                                  <td className="px-6 py-4">
                                    {trainee.status === "APPROVED" && trainee.assignedTrainerId ? (
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                          {approvedTrainers.find((t) => t.id === trainee.assignedTrainerId)?.username ||
                                            "N/A"}
                                        </span>
                                      </div>
                                    ) : trainee.status === "PENDING" ? (
                                      availableTrainers.length > 0 ? (
                                        <select
                                          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                          value={selectedTrainerId[trainee.id] || ""}
                                          onChange={(e) =>
                                            setSelectedTrainerId({
                                              ...selectedTrainerId,
                                              [trainee.id]: e.target.value,
                                            })
                                          }
                                        >
                                          <option value="">Select Trainer</option>
                                          {availableTrainers.map((t) => (
                                            <option key={t.id} value={t.id}>
                                              {t.username}
                                            </option>
                                          ))}
                                        </select>
                                      ) : (
                                        <span className="text-sm text-red-600 font-medium">No trainers available</span>
                                      )
                                    ) : (
                                      <span className="text-sm text-gray-400">—</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                      {trainee.status === "PENDING" && (
                                        <>
                                          <motion.button
                                            onClick={() => handleApproveTrainee(trainee.id)}
                                            className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-1"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                          >
                                            <Check className="w-3 h-3" />
                                            Approve
                                          </motion.button>
                                          <motion.button
                                            onClick={() => handleRejectTrainee(trainee.id)}
                                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-1"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                          >
                                            <X className="w-3 h-3" />
                                            Reject
                                          </motion.button>
                                        </>
                                      )}
                                      <motion.button
                                        onClick={() => handleDeleteTrainee(trainee.id)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </motion.button>
                                    </div>
                                  </td>
                                </motion.tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "trainers" && (
                <motion.div
                  key="trainers"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                          <UserCheck className="w-6 h-6 text-purple-600" />
                          Manage Trainers
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {filteredTrainers.length} of {trainers.length} trainers
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search trainers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                          />
                        </div>

                        <div className="relative">
                          <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white appearance-none"
                          >
                            <option value="all">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                          </select>
                        </div>

                        <motion.button
                          onClick={fetchTrainers}
                          className="p-2.5 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isLoadingTrainers}
                        >
                          <RefreshCw className={`w-5 h-5 ${isLoadingTrainers ? "animate-spin" : ""}`} />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoadingTrainers ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading trainers...</p>
                        </div>
                      </div>
                    ) : filteredTrainers.length === 0 ? (
                      <div className="text-center py-16">
                        <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No trainers found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trainer</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Expertise</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {filteredTrainers.map((trainer) => (
                              <motion.tr
                                key={trainer.id}
                                className="hover:bg-gray-50 transition-colors"
                                whileHover={{ backgroundColor: "rgba(147, 51, 234, 0.05)" }}
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                                      <span className="text-white text-sm font-medium">
                                        {trainer.name?.charAt(0).toUpperCase() ||
                                          trainer.username?.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">{trainer.name}</p>
                                      <p className="text-sm text-gray-500">@{trainer.username}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-sm text-gray-900">{trainer.email}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {trainer.expertise}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <StatusBadge status={trainer.status} />
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    {trainer.status === "PENDING" && (
                                      <>
                                        <motion.button
                                          onClick={() => handleApproveTrainer(trainer.id)}
                                          className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-1"
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          <Check className="w-3 h-3" />
                                          Approve
                                        </motion.button>
                                        <motion.button
                                          onClick={() => handleRejectTrainer(trainer.id)}
                                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-1"
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          <X className="w-3 h-3" />
                                          Reject
                                        </motion.button>
                                      </>
                                    )}
                                    <motion.button
                                      onClick={() => handleDeleteTrainer(trainer.id)}
                                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "progress" && (
                <motion.div
                  key="progress"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                          <TrendingUp className="w-6 h-6 text-emerald-600" />
                          Progress Tracking
                        </h2>
                        <p className="text-gray-600 mt-1">
                          Monitor trainee learning progress and certificate deployment
                        </p>
                      </div>

                      <motion.button
                        onClick={fetchTraineeProgress}
                        className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoadingProgress}
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoadingProgress ? "animate-spin" : ""}`} />
                        Refresh Data
                      </motion.button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoadingProgress ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading progress data...</p>
                        </div>
                      </div>
                    ) : traineeProgress.length === 0 ? (
                      <div className="text-center py-16">
                        <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No progress data available</h3>
                        <p className="text-gray-500">
                          Progress data will appear here once trainees start their courses.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trainee</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Skill</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Progress</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Certificate</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Details</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {traineeProgress.map((progress) => (
                              <motion.tr
                                key={progress.traineeId}
                                className="hover:bg-gray-50 transition-colors"
                                whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                                      <span className="text-white text-sm font-medium">
                                        {progress.name?.charAt(0).toUpperCase() ||
                                          progress.username?.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">{progress.name}</p>
                                      <p className="text-sm text-gray-500">@{progress.username}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                    {progress.skill}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-16 h-16">
                                      <CircularProgressbar
                                        value={progress.completionPercentage}
                                        text={`${Math.round(progress.completionPercentage)}%`}
                                        styles={buildStyles({
                                          pathColor: progress.completionPercentage >= 100 ? "#10b981" : "#3b82f6",
                                          textColor: "#374151",
                                          trailColor: "#e5e7eb",
                                          textSize: "16px",
                                        })}
                                      />
                                    </div>
                                    <div className="text-sm">
                                      <p className="font-medium text-gray-900">
                                        {progress.completedItems}/{progress.totalItems} items
                                      </p>
                                      <p className="text-gray-500">
                                        {progress.completionPercentage >= 100 ? "Completed" : "In Progress"}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  {progress.hasCertificate ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <Award className="w-4 h-4 text-emerald-600" />
                                      </div>
                                      <span className="text-sm font-medium text-emerald-700">Issued</span>
                                    </div>
                                  ) : (
                                    <motion.button
                                      onClick={() => handleDeployCertificate(progress.traineeId)}
                                      className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                      disabled={progress.completionPercentage < 99.99}
                                      whileHover={progress.completionPercentage >= 99.99 ? { scale: 1.05 } : {}}
                                      whileTap={progress.completionPercentage >= 99.99 ? { scale: 0.95 } : {}}
                                    >
                                      <Award className="w-3 h-3" />
                                      Deploy
                                    </motion.button>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <motion.button
                                    onClick={() => toggleProgressDetails(progress.traineeId)}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    {expandedProgress[progress.traineeId] ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                    {expandedProgress[progress.traineeId] ? "Hide" : "Show"}
                                  </motion.button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Expanded Progress Details */}
                        <AnimatePresence>
                          {traineeProgress.map(
                            (progress) =>
                              expandedProgress[progress.traineeId] && (
                                <motion.div
                                  key={`details-${progress.traineeId}`}
                                  className="bg-emerald-50 border-t border-emerald-200"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="p-6">
                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                                      Completed Items ({progress.completedItems}/{progress.totalItems})
                                    </h4>

                                    {progress.progressItems.length === 0 ? (
                                      <div className="text-center py-8">
                                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No items completed yet.</p>
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {progress.progressItems.map((item, index) => (
                                          <div
                                            key={index}
                                            className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm"
                                          >
                                            <div className="flex items-start gap-3">
                                              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 mb-1">
                                                  {item.type}: {item.title}
                                                </p>
                                                {item.type === "Video" && item.playlistTitle && (
                                                  <p className="text-sm text-gray-600 mb-2">in {item.playlistTitle}</p>
                                                )}
                                                {item.completedAt && (
                                                  <p className="text-xs text-gray-500">
                                                    Completed on {new Date(item.completedAt).toLocaleDateString()}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              ),
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "analytics" && (
                <motion.div
                  key="analytics"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-8"
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-6">
                      <Activity className="w-6 h-6 text-blue-600" />
                      Analytics Dashboard
                    </h2>

                    <div className="text-center py-16">
                      <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                      <p className="text-gray-500">
                        Detailed analytics and reporting features will be available in the next update.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminDashboard
