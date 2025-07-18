"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import {
  getTraineeProfile,
  updateTraineeProfile,
  getTrainingMaterials,
  markMaterialProgress,
  getTraineeProgress,
  getTraineePlaylists,
  markVideoProgress,
  getTraineeCertificate,
} from "../services/authService"
import {
  User,
  Video,
  Play,
  FileText,
  CheckCircle,
  XCircle,
  Award,
  TrendingUp,
  Clock,
  Target,
  Download,
  Eye,
  PlayCircle,
  BookOpen,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Trophy,
  ChevronRight,
  ChevronDown,
  RefreshCw,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import DashboardHeader from "./DashboardHeader"

function TraineeDashboard() {
  const { user, credentials } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState("progress")
  const [profile, setProfile] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    skill: "",
    location: "",
  })
  const [materials, setMaterials] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [progress, setProgress] = useState([])
  const [certificate, setCertificate] = useState(null)
  const [expandedPlaylists, setExpandedPlaylists] = useState({})
  const [message, setMessage] = useState("")
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false)
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false)
  const [isLoadingProgress, setIsLoadingProgress] = useState(false)
  const [isLoadingCertificate, setIsLoadingCertificate] = useState(false)

  useEffect(() => {
    if (credentials) {
      fetchProfile()
      fetchMaterials()
      fetchPlaylists()
      fetchProgress()
      fetchCertificate()
    }
  }, [credentials])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const fetchProfile = async () => {
    setIsLoadingProfile(true)
    try {
      const data = await getTraineeProfile(credentials)
      setProfile({
        username: data?.username ?? "",
        name: data?.name ?? "",
        email: data?.email ?? "",
        phone: data?.phone ?? "",
        skill: data?.skill ?? "",
        location: data?.location ?? "",
      })
    } catch (error) {
      setMessage(error.message || "Failed to fetch profile")
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const fetchMaterials = async () => {
    setIsLoadingMaterials(true)
    try {
      const data = await getTrainingMaterials(credentials)
      setMaterials(Array.isArray(data) ? data : [])
    } catch (error) {
      setMessage(error.message || "Failed to fetch materials")
    } finally {
      setIsLoadingMaterials(false)
    }
  }

  const fetchPlaylists = async () => {
    setIsLoadingPlaylists(true)
    try {
      const data = await getTraineePlaylists(credentials)
      setPlaylists(Array.isArray(data) ? data : [])
    } catch (error) {
      setMessage(error.message || "Failed to fetch playlists")
    } finally {
      setIsLoadingPlaylists(false)
    }
  }

  const fetchProgress = async () => {
    setIsLoadingProgress(true)
    try {
      const data = await getTraineeProgress(credentials)
      setProgress(Array.isArray(data) ? data : [])
    } catch (error) {
      setMessage(error.message || "Failed to fetch progress")
    } finally {
      setIsLoadingProgress(false)
    }
  }

  const fetchCertificate = async () => {
    setIsLoadingCertificate(true)
    try {
      const data = await getTraineeCertificate(credentials)
      setCertificate(data)
    } catch (error) {
      setCertificate(null)
      if (error.status >= 500) {
        setMessage(error.message || "Failed to fetch certificate")
      }
    } finally {
      setIsLoadingCertificate(false)
    }
  }

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateTraineeProfile(profile, credentials)
      setMessage("Profile updated successfully")
    } catch (error) {
      setMessage(error.message || "Failed to update profile")
    }
  }

  const handleMarkComplete = async (materialId) => {
    try {
      await markMaterialProgress(materialId, credentials)
      setMessage("Material marked as completed")
      fetchProgress()
    } catch (error) {
      setMessage(error.message || "Failed to mark material as completed")
    }
  }

  const handleVideoComplete = async (playlistId, videoUrl) => {
    try {
      await markVideoProgress({ playlistId, videoUrl }, credentials)
      setMessage("Video marked as completed")
      await fetchProgress()
    } catch (error) {
      setMessage(error.message || "Failed to mark video as completed")
    }
  }

  const handleVideoError = (videoName, error, isYouTube = false) => {
    console.error(
      `Video "${videoName}" failed to load:`,
      error,
      isYouTube ? "YouTube URL requires iframe rendering" : "Check URL or file availability",
    )
    setMessage(`Failed to load video: ${videoName}${isYouTube ? " (YouTube video rendered below)" : ""}`)
  }

  const togglePlaylist = (playlistId) => {
    setExpandedPlaylists((prev) => ({
      ...prev,
      [playlistId]: !prev[playlistId],
    }))
  }

  const isMaterialCompleted = (materialId) => {
    return progress.some((p) => p.materialId === materialId)
  }

  const isVideoCompleted = (playlistId, videoUrl) => {
    return progress.some((p) => p.playlistId === playlistId && p.videoUrl === videoUrl)
  }

  const isSuccessMessage = (msg) => msg.includes("successfully") || msg.includes("completed")

  const totalItems = materials.length + playlists.reduce((acc, playlist) => acc + (playlist.videos?.length || 0), 0)
  const completedItems = progress.length
  const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  // Normalize and classify video URL
  const normalizeVideoUrl = (url) => {
    if (!url) return { type: "invalid", src: "" }

    // Check for YouTube URLs
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
    const match = url.match(youtubeRegex)
    if (match) {
      const videoId = match[1]
      return { type: "youtube", src: `https://www.youtube.com/embed/${videoId}?enablejsapi=1` }
    }

    // Handle local filenames
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return { type: "local", src: `http://localhost:8080/uploads/${url}` }
    }

    // Assume other HTTP URLs are direct video files
    return { type: "local", src: url }
  }

  const navItems = [
    { id: "progress", label: "Progress", icon: TrendingUp, color: "from-blue-500 to-cyan-500" },
    { id: "materials", label: "Materials", icon: BookOpen, color: "from-purple-500 to-pink-500" },
    { id: "playlists", label: "Playlists", icon: PlayCircle, color: "from-green-500 to-emerald-500" },
    { id: "profile", label: "Profile", icon: User, color: "from-orange-500 to-red-500" },
    { id: "certificate", label: "Certificate", icon: Award, color: "from-yellow-500 to-amber-500" },
  ]

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)" },
    tap: { scale: 0.95 },
  }

  const tabVariants = {
    inactive: { scale: 1, opacity: 0.7 },
    active: { scale: 1.05, opacity: 1 },
  }

  // Get user initials
  const getUserInitials = () => {
    if (!user?.username) return "U"
    const names = user.username.split(" ")
    if (names.length === 1) return names[0].charAt(0).toUpperCase()
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }

  // Get skill color
  const getSkillColor = (skill) => {
    const colors = {
      tailoring: "from-pink-500 to-rose-500",
      food_processing: "from-orange-500 to-amber-500",
      handicrafts: "from-purple-500 to-indigo-500",
      digital_literacy: "from-blue-500 to-cyan-500",
    }
    return colors[skill] || "from-gray-500 to-gray-600"
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <DashboardHeader />

      <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-8">
          {/* Welcome Section */}
          <motion.div
            className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 mb-8 overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
              <div className="text-white mb-6 lg:mb-0">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                    {getUserInitials()}
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome back, {user.username}!</h1>
                    <div className="flex items-center space-x-4">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        {user.role}
                      </span>
                      <span className="text-blue-100 text-sm">
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-blue-100 text-lg max-w-2xl">
                  Continue your learning journey and track your progress towards certification.
                </p>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{Math.round(completionPercentage)}%</div>
                  <div className="text-blue-100 text-sm">Progress</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{completedItems}</div>
                  <div className="text-blue-100 text-sm">Completed</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            className="flex flex-wrap gap-2 mb-8 p-2 bg-white rounded-2xl shadow-lg"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === item.id
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab(item.id)}
                variants={tabVariants}
                animate={activeTab === item.id ? "active" : "inactive"}
                whileHover="hover"
                whileTap="tap"
                transition={{ duration: 0.2 }}
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                className={`mb-8 p-4 rounded-2xl flex items-center justify-between shadow-lg ${
                  isSuccessMessage(message)
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-3">
                  {isSuccessMessage(message) ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">{message}</span>
                </div>
                <button onClick={() => setMessage("")} aria-label="Dismiss message">
                  <XCircle className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {/* Progress Tab */}
            {activeTab === "progress" && (
              <motion.div
                key="progress"
                className="bg-white rounded-3xl shadow-xl p-8"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Your Learning Progress</h2>
                    <p className="text-gray-600">Track your journey towards certification</p>
                  </div>
                </div>

                {isLoadingProgress ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Loading progress...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Progress Circle */}
                    <div className="lg:col-span-1">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 text-center">
                        <div className="w-48 h-48 mx-auto mb-6">
                          <CircularProgressbar
                            value={completionPercentage}
                            text={`${Math.round(completionPercentage)}%`}
                            styles={buildStyles({
                              pathColor: completionPercentage >= 100 ? "#10b981" : "#3b82f6",
                              textColor: "#1f2937",
                              trailColor: "#e5e7eb",
                              textSize: "16px",
                            })}
                          />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Overall Progress</h3>
                        <p className="text-gray-600">
                          {completedItems} of {totalItems} items completed
                        </p>
                      </div>
                    </div>

                    {/* Progress Details */}
                    <div className="lg:col-span-2">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center">
                            <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-900">{completedItems}</div>
                            <div className="text-green-600 font-medium">Completed</div>
                          </div>
                          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 text-center">
                            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-900">{totalItems - completedItems}</div>
                            <div className="text-orange-600 font-medium">Remaining</div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center">
                            <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-900">{certificate ? "1" : "0"}</div>
                            <div className="text-purple-600 font-medium">Certificates</div>
                          </div>
                        </div>

                        {/* Completed Items List */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            Recently Completed
                          </h4>
                          {progress.length === 0 ? (
                            <p className="text-gray-500 italic">
                              No items completed yet. Start learning to see your progress!
                            </p>
                          ) : (
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {progress
                                .slice(-5)
                                .reverse()
                                .map((item) => {
                                  const material = materials.find((m) => m.id === item.materialId)
                                  const playlist = playlists.find((p) => p.id === item.playlistId)
                                  const video = playlist?.videos?.find((v) => v.url === item.videoUrl)
                                  return (
                                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-white rounded-xl">
                                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                          {material ? material.title : video ? video.name : "Unknown item"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {material
                                            ? "Material"
                                            : video
                                              ? `Video in ${playlist.title}`
                                              : "Unknown type"}{" "}
                                          • Completed {new Date(item.completedAt).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Materials Tab */}
            {activeTab === "materials" && (
              <motion.div
                key="materials"
                className="bg-white rounded-3xl shadow-xl p-8"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">Training Materials</h2>
                      <p className="text-gray-600">Access your learning resources</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={fetchMaterials}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>

                {isLoadingMaterials ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    <span className="ml-3 text-gray-600">Loading materials...</span>
                  </div>
                ) : materials.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No materials available yet.</p>
                    <p className="text-gray-400">Check back later for new content.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {materials.map((material) => {
                      const isVideo = material.fileType === "Video"
                      const fileName = material.filePath?.split(/[\\/]/).pop()
                      const isCompleted = isMaterialCompleted(material.id)

                      return (
                        <motion.div
                          key={material.id}
                          className={`relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border-2 transition-all duration-300 overflow-hidden ${
                            isCompleted ? "border-green-200 bg-green-50" : "border-gray-200 hover:border-purple-300"
                          }`}
                          whileHover={{ y: -5, scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isCompleted && (
                            <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          )}

                          <div className="p-6">
                            <div className="flex items-center mb-4">
                              <div
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${
                                  isVideo
                                    ? "bg-gradient-to-br from-red-500 to-pink-500"
                                    : "bg-gradient-to-br from-blue-500 to-cyan-500"
                                }`}
                              >
                                {isVideo ? (
                                  <Video className="w-6 h-6 text-white" />
                                ) : (
                                  <FileText className="w-6 h-6 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-gray-900 truncate">
                                  {material.title || "Untitled"}
                                </h4>
                                <p className="text-sm text-gray-500">{material.fileType || "Unknown"}</p>
                              </div>
                            </div>

                            {isVideo ? (
                              <div className="mb-4">
                                <video
                                  controls
                                  className="w-full rounded-xl"
                                  src={`http://localhost:8080/uploads/${fileName}`}
                                  onError={(e) => handleVideoError(material.title || "Untitled", e)}
                                  poster="/placeholder.svg?height=200&width=300"
                                >
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            ) : (
                              <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <div className="flex items-center justify-center">
                                  <FileText className="w-8 h-8 text-blue-600 mr-3" />
                                  <div>
                                    <p className="font-medium text-blue-900">PDF Document</p>
                                    <p className="text-sm text-blue-600">Click to view</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex space-x-2">
                              {!isVideo && (
                                <motion.a
                                  href={`http://localhost:8080/uploads/${fileName}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                                  whileHover="hover"
                                  whileTap="tap"
                                  variants={buttonVariants}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View PDF
                                </motion.a>
                              )}

                              {!isCompleted && (
                                <motion.button
                                  onClick={() => handleMarkComplete(material.id)}
                                  className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                                  whileHover="hover"
                                  whileTap="tap"
                                  variants={buttonVariants}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Complete
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Playlists Tab */}
            {activeTab === "playlists" && (
              <motion.div
                key="playlists"
                className="bg-white rounded-3xl shadow-xl p-8"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4">
                      <PlayCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">Video Playlists</h2>
                      <p className="text-gray-600">Watch curated video content</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={fetchPlaylists}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>

                {isLoadingPlaylists ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    <span className="ml-3 text-gray-600">Loading playlists...</span>
                  </div>
                ) : playlists.length === 0 ? (
                  <div className="text-center py-12">
                    <PlayCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No playlists available yet.</p>
                    <p className="text-gray-400">Check back later for new video content.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {playlists.map((playlist) => {
                      const isExpanded = expandedPlaylists[playlist.id]
                      const completedVideos =
                        playlist.videos?.filter((video) => isVideoCompleted(playlist.id, video.url)).length || 0
                      const totalVideos = playlist.videos?.length || 0
                      const progressPercent = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0

                      return (
                        <motion.div
                          key={playlist.id}
                          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                          variants={cardVariants}
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center flex-1">
                                <div
                                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 bg-gradient-to-br ${getSkillColor(playlist.skill)}`}
                                >
                                  <PlayCircle className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-xl font-bold text-gray-900">{playlist.title}</h4>
                                  <div className="flex items-center space-x-4 mt-1">
                                    <span className="text-sm text-gray-500">Skill: {playlist.skill}</span>
                                    <span className="text-sm text-gray-500">
                                      {completedVideos}/{totalVideos} videos completed
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-4">
                                <div className="w-16 h-16">
                                  <CircularProgressbar
                                    value={progressPercent}
                                    text={`${Math.round(progressPercent)}%`}
                                    styles={buildStyles({
                                      pathColor: progressPercent >= 100 ? "#10b981" : "#3b82f6",
                                      textColor: "#1f2937",
                                      trailColor: "#e5e7eb",
                                      textSize: "20px",
                                    })}
                                  />
                                </div>

                                <motion.button
                                  onClick={() => togglePlaylist(playlist.id)}
                                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                                  whileHover="hover"
                                  whileTap="tap"
                                  variants={buttonVariants}
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronDown className="w-4 h-4 mr-2" />
                                      Collapse
                                    </>
                                  ) : (
                                    <>
                                      <ChevronRight className="w-4 h-4 mr-2" />
                                      Expand
                                    </>
                                  )}
                                </motion.button>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-t border-gray-200 bg-gray-50"
                              >
                                <div className="p-6 space-y-6">
                                  {playlist.videos?.length > 0 ? (
                                    playlist.videos.map((video, index) => {
                                      const { type, src } = normalizeVideoUrl(video.url)
                                      const isCompleted = isVideoCompleted(playlist.id, video.url)

                                      return (
                                        <div
                                          key={index}
                                          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                                        >
                                          <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                              <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${
                                                  isCompleted ? "bg-green-100" : "bg-blue-100"
                                                }`}
                                              >
                                                {isCompleted ? (
                                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                                ) : (
                                                  <Play className="w-5 h-5 text-blue-600" />
                                                )}
                                              </div>
                                              <div>
                                                <h5 className="font-semibold text-gray-900">{video.name}</h5>
                                                <p className="text-sm text-gray-500">
                                                  Video {index + 1} of {playlist.videos.length}
                                                </p>
                                              </div>
                                            </div>

                                            {isCompleted && (
                                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                Completed
                                              </span>
                                            )}
                                          </div>

                                          {src ? (
                                            <div className="mb-4">
                                              {type === "youtube" ? (
                                                <iframe
                                                  className="w-full h-64 rounded-xl"
                                                  src={src}
                                                  title={video.name}
                                                  frameBorder="0"
                                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                  allowFullScreen
                                                  onError={(e) => handleVideoError(video.name, e, true)}
                                                />
                                              ) : (
                                                <video
                                                  controls
                                                  className="w-full rounded-xl"
                                                  src={src}
                                                  onEnded={() => handleVideoComplete(playlist.id, video.url)}
                                                  onError={(e) => handleVideoError(video.name, e)}
                                                  poster="/placeholder.svg?height=300&width=500"
                                                >
                                                  Your browser does not support the video tag.
                                                </video>
                                              )}
                                            </div>
                                          ) : (
                                            <div className="mb-4 p-4 bg-red-50 rounded-xl border border-red-200">
                                              <p className="text-red-600 text-sm">Invalid video URL for {video.name}</p>
                                            </div>
                                          )}

                                          {!isCompleted && (
                                            <motion.button
                                              onClick={() => handleVideoComplete(playlist.id, video.url)}
                                              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                                              whileHover="hover"
                                              whileTap="tap"
                                              variants={buttonVariants}
                                            >
                                              <CheckCircle className="w-5 h-5 mr-2" />
                                              Mark as Completed
                                            </motion.button>
                                          )}
                                        </div>
                                      )
                                    })
                                  ) : (
                                    <div className="text-center py-8">
                                      <PlayCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                      <p className="text-gray-500">No videos in this playlist yet.</p>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                className="bg-white rounded-3xl shadow-xl p-8"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Profile Settings</h2>
                    <p className="text-gray-600">Manage your personal information</p>
                  </div>
                </div>

                {isLoadingProfile ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <span className="ml-3 text-gray-600">Loading profile...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Avatar Section */}
                    <div className="lg:col-span-1">
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 text-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                          {getUserInitials()}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{profile.name || user.username}</h3>
                        <p className="text-gray-600 mb-4">{user.role}</p>
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getSkillColor(profile.skill)} text-white`}
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          {profile.skill || "No skill selected"}
                        </div>
                      </div>
                    </div>

                    {/* Profile Form */}
                    <div className="lg:col-span-2">
                      <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              <User className="w-4 h-4 inline mr-2" />
                              Username
                            </label>
                            <input
                              type="text"
                              name="username"
                              value={profile.username}
                              disabled
                              className="w-full p-4 bg-gray-100 text-gray-500 rounded-xl border border-gray-200"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              <User className="w-4 h-4 inline mr-2" />
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={profile.name ?? ""}
                              onChange={handleProfileChange}
                              className="w-full p-4 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              <Mail className="w-4 h-4 inline mr-2" />
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={profile.email ?? ""}
                              onChange={handleProfileChange}
                              className="w-full p-4 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              <Phone className="w-4 h-4 inline mr-2" />
                              Phone
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={profile.phone ?? ""}
                              onChange={handleProfileChange}
                              className="w-full p-4 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              <Star className="w-4 h-4 inline mr-2" />
                              Skill
                            </label>
                            <input
                              type="text"
                              name="skill"
                              value={profile.skill ?? ""}
                              onChange={handleProfileChange}
                              className="w-full p-4 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              <MapPin className="w-4 h-4 inline mr-2" />
                              Location
                            </label>
                            <input
                              type="text"
                              name="location"
                              value={profile.location ?? ""}
                              onChange={handleProfileChange}
                              className="w-full p-4 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>
                        </div>

                        <motion.button
                          type="submit"
                          className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300"
                          whileHover="hover"
                          whileTap="tap"
                          variants={buttonVariants}
                        >
                          <User className="w-5 h-5 mr-2" />
                          Update Profile
                        </motion.button>
                      </form>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Certificate Tab */}
            {activeTab === "certificate" && (
              <motion.div
                key="certificate"
                className="bg-white rounded-3xl shadow-xl p-8"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Your Certificate</h2>
                    <p className="text-gray-600">Download your completion certificate</p>
                  </div>
                </div>

                {isLoadingCertificate ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                    <span className="ml-3 text-gray-600">Loading certificate...</span>
                  </div>
                ) : certificate ? (
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-8 mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Congratulations!</h3>
                      <p className="text-gray-600 mb-6">
                        You have successfully completed your training program and earned your certificate.
                      </p>
                      <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mb-6">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Issued: {new Date(certificate.issuedAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-2" />
                          Skill: {profile.skill}
                        </div>
                      </div>
                      <motion.a
                        href={`http://localhost:8080/api/certificates/${certificate.filePath}`}
                        download
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300"
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download Certificate
                      </motion.a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8">
                      <Award className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Certificate Not Available</h3>
                      <p className="text-gray-600 mb-6">
                        Complete all training materials and maintain good progress to receive your certificate.
                      </p>
                      <div className="bg-white rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-gray-700 font-medium">Overall Progress</span>
                          <span className="text-gray-900 font-bold">{Math.round(completionPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          {completedItems} of {totalItems} items completed
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">Keep learning to unlock your certificate!</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default TraineeDashboard
