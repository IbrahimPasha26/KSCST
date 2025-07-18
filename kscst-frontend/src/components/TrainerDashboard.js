"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { AuthContext } from "../context/AuthContext"
import {
  getTrainerProfile,
  updateTrainerProfile,
  getAssignedTrainees,
  uploadTrainingMaterial,
  getTrainerPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getTrainerMaterials,
  updateTrainingMaterial,
  deleteTrainingMaterial,
} from "../services/authService"
import {
  User,
  Book,
  Users,
  FileText,
  Video,
  Trash2,
  XCircle,
  Plus,
  Edit3,
  Upload,
  Play,
  Award,
  TrendingUp,
  BookOpen,
  UserCheck,
  Calendar,
  Clock,
  Star,
  Target,
  CheckCircle2,
  AlertCircle,
  Settings,
  Search,
  MoreVertical,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import DashboardHeader from "./DashboardHeader"

function TrainerDashboard() {
  const { user, credentials } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState("overview")
  const [profile, setProfile] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    expertise: "",
  })
  const [trainees, setTrainees] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [materials, setMaterials] = useState([])
  const [materialFile, setMaterialFile] = useState(null)
  const [materialTitle, setMaterialTitle] = useState("")
  const [playlistData, setPlaylistData] = useState({ title: "", skill: "", videos: [] })
  const [videoData, setVideoData] = useState({ name: "", url: "" })
  const [editingPlaylistId, setEditingPlaylistId] = useState(null)
  const [editingMaterial, setEditingMaterial] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ id: null, type: null })
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSkill, setFilterSkill] = useState("")
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isLoadingTrainees, setIsLoadingTrainees] = useState(false)
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false)
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (credentials) {
      fetchProfile()
      fetchTrainees()
      fetchPlaylists()
      fetchMaterials()
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
      const data = await getTrainerProfile(credentials)
      setProfile({
        username: data?.username ?? "",
        name: data?.name ?? "",
        email: data?.email ?? "",
        phone: data?.phone ?? "",
        expertise: data?.expertise ?? "",
      })
    } catch (error) {
      setMessage(error.message || "Failed to fetch profile")
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const fetchTrainees = async () => {
    setIsLoadingTrainees(true)
    try {
      const data = await getAssignedTrainees(credentials)
      setTrainees(Array.isArray(data) ? data : [])
    } catch (error) {
      setMessage(error.message || "Failed to fetch trainees")
    } finally {
      setIsLoadingTrainees(false)
    }
  }

  const fetchPlaylists = async () => {
    setIsLoadingPlaylists(true)
    try {
      const data = await getTrainerPlaylists(credentials)
      setPlaylists(Array.isArray(data) ? data : [])
    } catch (error) {
      setMessage(error.message || "Failed to fetch playlists")
    } finally {
      setIsLoadingPlaylists(false)
    }
  }

  const fetchMaterials = async () => {
    setIsLoadingMaterials(true)
    try {
      const data = await getTrainerMaterials(credentials)
      setMaterials(Array.isArray(data) ? data : [])
    } catch (error) {
      setMessage(error.message || "Failed to fetch materials")
    } finally {
      setIsLoadingMaterials(false)
    }
  }

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateTrainerProfile(profile, credentials)
      setMessage("Profile updated successfully")
    } catch (error) {
      setMessage(error.message || "Failed to update profile")
    }
  }

  const handleMaterialSubmit = async (e) => {
    e.preventDefault()
    if (!materialFile) {
      setMessage("Please select a file to upload")
      return
    }
    if (!materialTitle.trim()) {
      setMessage("Please enter a title for the material")
      return
    }
    const allowedTypes = ["application/pdf", "video/mp4"]
    if (!allowedTypes.includes(materialFile.type)) {
      setMessage("Please upload a PDF or MP4 file")
      return
    }
    const formData = new FormData()
    formData.append("file", materialFile)
    formData.append("title", materialTitle)
    try {
      await uploadTrainingMaterial(formData, credentials)
      setMessage("Material uploaded successfully")
      setMaterialFile(null)
      setMaterialTitle("")
      if (fileInputRef.current) fileInputRef.current.value = ""
      fetchMaterials()
    } catch (error) {
      setMessage(error.message || "Failed to upload material")
    }
  }

  const handleEditMaterial = (material) => {
    setEditingMaterial(material)
    setMaterialTitle(material.title)
    setMaterialFile(null)
  }

  const handleUpdateMaterial = async (e) => {
    e.preventDefault()
    if (!materialTitle.trim()) {
      setMessage("Please enter a title for the material")
      return
    }
    const formData = new FormData()
    formData.append("title", materialTitle)
    if (materialFile) {
      const allowedTypes = ["application/pdf", "video/mp4"]
      if (!allowedTypes.includes(materialFile.type)) {
        setMessage("Please upload a PDF or MP4 file")
        return
      }
      formData.append("file", materialFile)
    }
    try {
      await updateTrainingMaterial(editingMaterial.id, formData, credentials)
      setMessage("Material updated successfully")
      setEditingMaterial(null)
      setMaterialTitle("")
      setMaterialFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      fetchMaterials()
    } catch (error) {
      setMessage(error.message || "Failed to update material")
    }
  }

  const handleDeleteMaterial = async (id) => {
    try {
      await deleteTrainingMaterial(id, credentials)
      setMessage("Material deleted successfully")
      setDeleteConfirm({ id: null, type: null })
      fetchMaterials()
    } catch (error) {
      setMessage(error.message || "Failed to delete material")
    }
  }

  const handlePlaylistSubmit = async (e) => {
    e.preventDefault()
    if (!playlistData.title.trim() || !playlistData.skill) {
      setMessage("Please provide a title and skill for the playlist")
      return
    }
    try {
      if (editingPlaylistId) {
        await updatePlaylist(editingPlaylistId, playlistData, credentials)
        setMessage("Playlist updated successfully")
      } else {
        await createPlaylist(playlistData, credentials)
        setMessage("Playlist created successfully")
      }
      setPlaylistData({ title: "", skill: "", videos: [] })
      setEditingPlaylistId(null)
      setVideoData({ name: "", url: "" })
      fetchPlaylists()
    } catch (error) {
      setMessage(error.message || "Failed to manage playlist")
    }
  }

  const isValidUrl = (url) => {
    try {
      new URL(url)
      return url.startsWith("http://") || url.startsWith("https://")
    } catch {
      return false
    }
  }

  const handleAddVideo = () => {
    if (!videoData.name.trim() || !videoData.url.trim()) {
      setMessage("Please provide a video name and URL")
      return
    }
    if (!isValidUrl(videoData.url)) {
      setMessage("Please provide a valid HTTP/HTTPS URL")
      return
    }
    setPlaylistData({
      ...playlistData,
      videos: [...playlistData.videos, videoData],
    })
    setVideoData({ name: "", url: "" })
  }

  const handleDeletePlaylist = async (id) => {
    try {
      await deletePlaylist(id, credentials)
      setMessage("Playlist deleted successfully")
      setDeleteConfirm({ id: null, type: null })
      fetchPlaylists()
    } catch (error) {
      setMessage(error.message || "Failed to delete playlist")
    }
  }

  const handleEditPlaylist = (playlist) => {
    setEditingPlaylistId(playlist.id)
    setPlaylistData({
      title: playlist.title || "",
      skill: playlist.skill || "",
      videos: playlist.videos || [],
    })
  }

  const removeVideoFromPlaylist = (index) => {
    const updatedVideos = playlistData.videos.filter((_, i) => i !== index)
    setPlaylistData({ ...playlistData, videos: updatedVideos })
  }

  const isSuccessMessage = (msg) => msg.includes("successfully")

  // Filter functions
  const filteredTrainees = trainees.filter((trainee) => {
    const matchesSearch =
      trainee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkill = !filterSkill || trainee.skill === filterSkill
    return matchesSearch && matchesSkill
  })

  const filteredMaterials = materials.filter((material) =>
    material.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPlaylists = playlists.filter((playlist) => {
    const matchesSearch = playlist.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkill = !filterSkill || playlist.skill === filterSkill
    return matchesSearch && matchesSkill
  })

  // Statistics
  const stats = {
    totalTrainees: trainees.length,
    totalMaterials: materials.length,
    totalPlaylists: playlists.length,
    totalVideos: playlists.reduce((acc, playlist) => acc + (playlist.videos?.length || 0), 0),
  }

  const navItems = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "materials", label: "Materials", icon: Book },
    { id: "playlists", label: "Playlists", icon: Play },
    { id: "trainees", label: "Trainees", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ]

  const skillOptions = [
    { value: "tailoring", label: "Tailoring" },
    { value: "food_processing", label: "Food Processing" },
    { value: "handicrafts", label: "Handicrafts" },
    { value: "digital_literacy", label: "Digital Literacy" },
  ]

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 } },
  }

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)" },
    tap: { scale: 0.95 },
  }

  const statsCardVariants = {
    hover: { scale: 1.02, y: -5 },
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DashboardHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <main className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 pt-32 sm:pt-36 lg:pt-40 relative z-10" tabIndex="0">
        {/* Welcome Section */}
        <motion.div
          className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 mb-8 rounded-3xl shadow-2xl border border-blue-200/20 overflow-hidden"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-4 mb-4"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white">Welcome back, {user.username}!</h1>
                    <p className="text-blue-100 text-lg mt-1">Trainer Dashboard</p>
                  </div>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-blue-100 text-lg max-w-2xl"
                >
                  Manage your training materials, track trainee progress, and create engaging learning experiences.
                </motion.p>
              </div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
              >
                {[
                  { label: "Trainees", value: stats.totalTrainees, icon: Users, color: "bg-emerald-500" },
                  { label: "Materials", value: stats.totalMaterials, icon: BookOpen, color: "bg-orange-500" },
                  { label: "Playlists", value: stats.totalPlaylists, icon: Play, color: "bg-purple-500" },
                  { label: "Videos", value: stats.totalVideos, icon: Video, color: "bg-pink-500" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20"
                    whileHover={statsCardVariants.hover}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-blue-100 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.nav
          className="mb-8 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-white/20"
          role="tablist"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab(item.id)}
                role="tab"
                aria-selected={activeTab === item.id}
                whileHover={activeTab !== item.id ? { scale: 1.05 } : {}}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.nav>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              className={`mb-8 p-4 rounded-2xl text-sm font-medium shadow-lg border flex items-center justify-between ${
                isSuccessMessage(message)
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2">
                {isSuccessMessage(message) ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span>{message}</span>
              </div>
              <button onClick={() => setMessage("")} aria-label="Dismiss message">
                <XCircle className="w-5 h-5 hover:opacity-70" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-8"
            >
              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Target className="w-6 h-6 text-blue-600" />
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Upload Material",
                      icon: Upload,
                      action: () => setActiveTab("materials"),
                      color: "from-blue-500 to-blue-600",
                    },
                    {
                      label: "Create Playlist",
                      icon: Plus,
                      action: () => setActiveTab("playlists"),
                      color: "from-purple-500 to-purple-600",
                    },
                    {
                      label: "View Trainees",
                      icon: Users,
                      action: () => setActiveTab("trainees"),
                      color: "from-emerald-500 to-emerald-600",
                    },
                    {
                      label: "Edit Profile",
                      icon: Settings,
                      action: () => setActiveTab("profile"),
                      color: "from-orange-500 to-orange-600",
                    },
                  ].map((action, index) => (
                    <motion.button
                      key={action.label}
                      onClick={action.action}
                      className={`bg-gradient-to-r ${action.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-3`}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <action.icon className="w-8 h-8" />
                      <span className="font-semibold">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {materials.slice(0, 3).map((material, index) => (
                    <div key={material.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {material.fileType === "Video" ? (
                          <Video className="w-5 h-5 text-blue-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{material.title}</h4>
                        <p className="text-sm text-gray-600">Material • {material.fileType}</p>
                      </div>
                      <span className="text-xs text-gray-500">Recently added</span>
                    </div>
                  ))}
                  {materials.length === 0 && <p className="text-gray-500 text-center py-8">No recent activity</p>}
                </div>
              </div>
            </motion.div>
          )}

          {/* Materials Tab */}
          {activeTab === "materials" && (
            <motion.div
              key="materials"
              className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <Book className="w-8 h-8 text-blue-600" />
                  Training Materials
                </h2>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search materials..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Material Upload/Edit Form */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl mb-8 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  {editingMaterial ? <Edit3 className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                  {editingMaterial ? "Edit Material" : "Upload New Material"}
                </h3>
                <form onSubmit={editingMaterial ? handleUpdateMaterial : handleMaterialSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Material Title</label>
                    <input
                      type="text"
                      value={materialTitle}
                      onChange={(e) => setMaterialTitle(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter material title..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {editingMaterial ? "Replace File (Optional)" : "Upload File"} (PDF or MP4)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.mp4"
                      ref={fileInputRef}
                      onChange={(e) => setMaterialFile(e.target.files[0])}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={buttonVariants.hover}
                      whileTap={buttonVariants.tap}
                    >
                      {editingMaterial ? "Update Material" : "Upload Material"}
                    </motion.button>
                    {editingMaterial && (
                      <motion.button
                        type="button"
                        onClick={() => {
                          setEditingMaterial(null)
                          setMaterialTitle("")
                          setMaterialFile(null)
                          if (fileInputRef.current) fileInputRef.current.value = ""
                        }}
                        className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                        whileHover={buttonVariants.hover}
                        whileTap={buttonVariants.tap}
                      >
                        Cancel
                      </motion.button>
                    )}
                  </div>
                </form>
              </div>

              {/* Materials Grid */}
              {isLoadingMaterials ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-2xl p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-32 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : filteredMaterials.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No materials found</p>
                  <p className="text-gray-400">Upload your first training material to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMaterials.map((material) => {
                    const isVideo = material.fileType === "Video"
                    const fileName = material.filePath?.split(/[\\/]/).pop()
                    return (
                      <motion.div
                        key={material.id}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                        whileHover={{ y: -5 }}
                        layout
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                isVideo ? "bg-purple-100" : "bg-blue-100"
                              }`}
                            >
                              {isVideo ? (
                                <Video className="w-6 h-6 text-purple-600" />
                              ) : (
                                <FileText className="w-6 h-6 text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 line-clamp-2">
                                {material.title || "Untitled"}
                              </h4>
                              <p className="text-sm text-gray-500">{material.fileType}</p>
                            </div>
                          </div>
                          <div className="relative">
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>

                        {isVideo ? (
                          <div className="mb-4">
                            <video
                              controls
                              className="w-full rounded-xl"
                              src={`http://localhost:8080/uploads/${fileName}`}
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ) : (
                          <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 text-center">PDF Document</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => handleEditMaterial(material)}
                            className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-xl font-medium hover:bg-blue-100 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Edit
                          </motion.button>
                          {!isVideo && (
                            <motion.a
                              href={`http://localhost:8080/uploads/${fileName}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-emerald-50 text-emerald-600 py-2 px-4 rounded-xl font-medium hover:bg-emerald-100 transition-colors text-center"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              View
                            </motion.a>
                          )}
                          <motion.button
                            onClick={() => setDeleteConfirm({ id: material.id, type: "material" })}
                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
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
              className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <Play className="w-8 h-8 text-blue-600" />
                  Video Playlists
                </h2>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search playlists..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterSkill}
                    onChange={(e) => setFilterSkill(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Skills</option>
                    {skillOptions.map((skill) => (
                      <option key={skill.value} value={skill.value}>
                        {skill.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Playlist Creation Form */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl mb-8 border border-purple-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  {editingPlaylistId ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {editingPlaylistId ? "Edit Playlist" : "Create New Playlist"}
                </h3>
                <form onSubmit={handlePlaylistSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Playlist Title</label>
                      <input
                        type="text"
                        value={playlistData.title}
                        onChange={(e) => setPlaylistData({ ...playlistData, title: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter playlist title..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Skill Category</label>
                      <select
                        value={playlistData.skill}
                        onChange={(e) => setPlaylistData({ ...playlistData, skill: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select skill category</option>
                        {skillOptions.map((skill) => (
                          <option key={skill.value} value={skill.value}>
                            {skill.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Add Video Section */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Add Video
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Video name..."
                        value={videoData.name}
                        onChange={(e) => setVideoData({ ...videoData, name: e.target.value })}
                        className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="Video URL (http:// or https://)"
                        value={videoData.url}
                        onChange={(e) => setVideoData({ ...videoData, url: e.target.value })}
                        className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <motion.button
                      type="button"
                      onClick={handleAddVideo}
                      className="w-full bg-purple-100 text-purple-700 py-2 px-4 rounded-xl font-medium hover:bg-purple-200 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add Video to Playlist
                    </motion.button>
                  </div>

                  {/* Video List */}
                  {playlistData.videos.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Videos in Playlist ({playlistData.videos.length})
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {playlistData.videos.map((video, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 truncate">{video.name}</p>
                              <p className="text-sm text-gray-500 truncate">{video.url}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeVideoFromPlaylist(index)}
                              className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <motion.button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={buttonVariants.hover}
                      whileTap={buttonVariants.tap}
                    >
                      {editingPlaylistId ? "Update Playlist" : "Create Playlist"}
                    </motion.button>
                    {editingPlaylistId && (
                      <motion.button
                        type="button"
                        onClick={() => {
                          setEditingPlaylistId(null)
                          setPlaylistData({ title: "", skill: "", videos: [] })
                          setVideoData({ name: "", url: "" })
                        }}
                        className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                        whileHover={buttonVariants.hover}
                        whileTap={buttonVariants.tap}
                      >
                        Cancel
                      </motion.button>
                    )}
                  </div>
                </form>
              </div>

              {/* Playlists Grid */}
              {isLoadingPlaylists ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-2xl p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-32 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : filteredPlaylists.length === 0 ? (
                <div className="text-center py-12">
                  <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No playlists found</p>
                  <p className="text-gray-400">Create your first playlist to organize video content</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlaylists.map((playlist) => (
                    <motion.div
                      key={playlist.id}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                      whileHover={{ y: -5 }}
                      layout
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Play className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 line-clamp-2">{playlist.title}</h4>
                            <p className="text-sm text-gray-500 capitalize">{playlist.skill?.replace("_", " ")}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{playlist.videos?.length || 0} videos</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                            {playlist.skill?.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleEditPlaylist(playlist)}
                          className="flex-1 bg-purple-50 text-purple-600 py-2 px-4 rounded-xl font-medium hover:bg-purple-100 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => setDeleteConfirm({ id: playlist.id, type: "playlist" })}
                          className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Trainees Tab */}
          {activeTab === "trainees" && (
            <motion.div
              key="trainees"
              className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  Assigned Trainees
                </h2>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search trainees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterSkill}
                    onChange={(e) => setFilterSkill(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Skills</option>
                    {skillOptions.map((skill) => (
                      <option key={skill.value} value={skill.value}>
                        {skill.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {isLoadingTrainees ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-2xl p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : filteredTrainees.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No trainees found</p>
                  <p className="text-gray-400">
                    {searchTerm || filterSkill
                      ? "Try adjusting your search filters"
                      : "No trainees have been assigned to you yet"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTrainees.map((trainee) => (
                    <motion.div
                      key={trainee.id}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                      whileHover={{ y: -5 }}
                      layout
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {trainee.name?.charAt(0)?.toUpperCase() || "T"}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{trainee.name}</h4>
                          <p className="text-sm text-gray-500">{trainee.email}</p>
                        </div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Target className="w-4 h-4" />
                          <span className="font-medium">Skill:</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium capitalize">
                            {trainee.skill?.replace("_", " ") || "Not specified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">Location:</span>
                          <span>{trainee.location || "Not specified"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <UserCheck className="w-4 h-4" />
                          <span className="font-medium">Phone:</span>
                          <span>{trainee.phone || "Not provided"}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium text-gray-700">Active</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <User className="w-8 h-8 text-blue-600" />
                Trainer Profile
              </h2>

              {isLoadingProfile ? (
                <div className="space-y-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-w-2xl">
                  {/* Profile Header */}
                  <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                      {profile.name?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || "T"}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{profile.name || user.username}</h3>
                      <p className="text-blue-600 font-medium">Trainer</p>
                      <p className="text-gray-600">{profile.expertise || "No expertise specified"}</p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={profile.username}
                        disabled
                        className="w-full p-4 bg-gray-50 text-gray-500 rounded-xl border border-gray-200 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                    </div>

                    {[
                      { field: "name", label: "Full Name", type: "text", icon: User },
                      { field: "email", label: "Email Address", type: "email", icon: User },
                      { field: "phone", label: "Phone Number", type: "tel", icon: User },
                      { field: "expertise", label: "Area of Expertise", type: "text", icon: Star },
                    ].map(({ field, label, type, icon: Icon }) => (
                      <div key={field}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {label}
                        </label>
                        <input
                          type={type}
                          name={field}
                          value={profile[field] ?? ""}
                          onChange={handleProfileChange}
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder={`Enter your ${label.toLowerCase()}...`}
                          required
                        />
                      </div>
                    ))}

                    <motion.button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={buttonVariants.hover}
                      whileTap={buttonVariants.tap}
                    >
                      Update Profile
                    </motion.button>
                  </form>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm.id && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Deletion</h3>
                  <p className="text-gray-600">
                    Are you sure you want to delete this {deleteConfirm.type}? This action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setDeleteConfirm({ id: null, type: null })}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() =>
                      deleteConfirm.type === "material"
                        ? handleDeleteMaterial(deleteConfirm.id)
                        : handleDeletePlaylist(deleteConfirm.id)
                    }
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default TrainerDashboard
