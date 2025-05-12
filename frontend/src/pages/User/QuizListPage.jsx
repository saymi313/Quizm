"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Clock, Search, SlidersHorizontal, BookOpen, Trophy, ChevronDown, Calendar, BarChart3 } from "lucide-react"
import quizService from "../../services/quizService"

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Mock categories for demonstration - replace with actual categories if available
  const categories = [
    { id: "all", name: "All Categories", count: 0 },
    { id: "science", name: "Science", count: 0 },
    { id: "history", name: "History", count: 0 },
    { id: "math", name: "Mathematics", count: 0 },
    { id: "language", name: "Languages", count: 0 },
    { id: "tech", name: "Technology", count: 0 },
  ]

  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await quizService.getQuizzes()
        setQuizzes(data)
        setLoading(false)
      } catch (error) {
        setError("Failed to load quizzes. Please try again later.")
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  // Update category counts
  const updatedCategories = categories.map((category) => {
    if (category.id === "all") {
      return { ...category, count: quizzes.length }
    }
    // This is a mock implementation - in a real app, you'd count based on actual category data
    const count = Math.floor(Math.random() * quizzes.length)
    return { ...category, count }
  })

  // Filter quizzes based on search term and category
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase())

    // Mock category filtering - in a real app, you'd filter based on actual category data
    const matchesCategory = selectedCategory === "all" || Math.random() > 0.5

    return matchesSearch && matchesCategory
  })

  // Sort quizzes based on selected option
  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt)
    } else if (sortBy === "timeAsc") {
      return a.timeLimit - b.timeLimit
    } else if (sortBy === "timeDesc") {
      return b.timeLimit - a.timeLimit
    }
    return 0
  })

  // Function to get a random difficulty for demo purposes
  const getRandomDifficulty = () => {
    const difficulties = ["Beginner", "Intermediate", "Advanced"]
    return difficulties[Math.floor(Math.random() * difficulties.length)]
  }

  // Function to get a random question count for demo purposes
  const getRandomQuestionCount = () => {
    return Math.floor(Math.random() * 20) + 5
  }

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pb-16">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Explore Quizzes</h1>
              <p className="text-gray-600">
                Discover and challenge yourself with our collection of {quizzes.length} quizzes
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
              </button>
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                My Results
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Search for quizzes by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Expanded Filter Section */}
            <div
              className={`mt-4 transition-all duration-300 ease-in-out overflow-hidden ${isFilterOpen ? "max-h-96" : "max-h-0"}`}
            >
              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
                  <div className="space-y-2">
                    {updatedCategories.map((category) => (
                      <button
                        key={category.id}
                        className={`px-3 py-2 rounded-lg text-sm flex justify-between w-full transition-colors ${
                          selectedCategory === category.id
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <span>{category.name}</span>
                        <span className="bg-white px-2 py-0.5 rounded-full text-xs text-gray-600">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Sort By</h3>
                  <div className="space-y-2">
                    {[
                      { id: "newest", label: "Newest First", icon: <Calendar className="h-4 w-4" /> },
                      { id: "oldest", label: "Oldest First", icon: <Calendar className="h-4 w-4" /> },
                      { id: "timeAsc", label: "Time: Low to High", icon: <Clock className="h-4 w-4" /> },
                      { id: "timeDesc", label: "Time: High to Low", icon: <Clock className="h-4 w-4" /> },
                    ].map((option) => (
                      <button
                        key={option.id}
                        className={`px-3 py-2 rounded-lg text-sm flex items-center w-full transition-colors ${
                          sortBy === option.id
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        onClick={() => setSortBy(option.id)}
                      >
                        {option.icon}
                        <span className="ml-2">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-medium">{sortedQuizzes.length}</span> of{" "}
            <span className="font-medium">{quizzes.length}</span> quizzes
          </p>
          {searchTerm && (
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" onClick={() => setSearchTerm("")}>
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Quiz List */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 mb-4"></div>
                  <div className="flex items-center mb-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mr-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
            <p className="font-medium">Error</p>
            <p>{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : sortedQuizzes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedQuizzes.map((quiz) => {
              // Mock data for demonstration - replace with actual data in a real app
              const difficulty = getRandomDifficulty()
              const questionCount = getRandomQuestionCount()
              const difficultyColor =
                difficulty === "Beginner"
                  ? "bg-green-100 text-green-800"
                  : difficulty === "Intermediate"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"

              return (
                <div
                  key={quiz._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {quiz.title}
                      </h3>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColor}`}>
                        {difficulty}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">{quiz.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center text-gray-500 bg-gray-100 px-2 py-1 rounded-md text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{quiz.timeLimit} min</span>
                      </div>
                      <div className="flex items-center text-gray-500 bg-gray-100 px-2 py-1 rounded-md text-sm">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{questionCount} questions</span>
                      </div>
                      <div className="flex items-center text-gray-500 bg-gray-100 px-2 py-1 rounded-md text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(quiz.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        to={`/quiz/${quiz._id}`}
                        className="flex-grow py-2.5 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Take Quiz
                      </Link>
                      <Link
                        to={`/leaderboard/${quiz._id}`}
                        className="flex-grow py-2.5 bg-white border border-gray-300 text-gray-700 text-center rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        Leaderboard
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No quizzes found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? `No quizzes match your search for "${searchTerm}".`
                : "No quizzes available in this category."}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizListPage
