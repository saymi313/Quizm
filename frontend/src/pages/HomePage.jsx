"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Award, BookOpen, Users, Clock, ChevronRight, Brain, Sparkles, Target } from "lucide-react"
import quizService from "../services/quizService"

const HomePage = () => {
  const [recentQuizzes, setRecentQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentQuizzes = async () => {
      try {
        const quizzes = await quizService.getQuizzes()
        setRecentQuizzes(quizzes.slice(0, 3)) // Get only the first 3 quizzes
        setLoading(false)
      } catch (error) {
        console.error("Error fetching quizzes:", error)
        setLoading(false)
      }
    }

    fetchRecentQuizzes()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Expand Your Knowledge with Quizm
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-xl">
                Challenge yourself with our diverse collection of quizzes. Learn, compete, and track your progress on
                your educational journey.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link
                  to="/quizzes"
                  className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium text-lg transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 flex items-center"
                >
                  Browse Quizzes
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-full font-medium text-lg transition-all hover:bg-blue-50"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/images/student-learning.jpeg"
                alt="Students learning"
                className="w-full max-w-md rounded-lg shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
            {[
              { number: "500+", label: "Quizzes" },
              { number: "10K+", label: "Students" },
              { number: "25+", label: "Categories" },
              { number: "4.8/5", label: "Rating" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 text-center transform hover:scale-105 transition-transform"
              >
                <div className="text-3xl font-bold text-blue-600 mb-1">{stat.number}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Choose Quizm?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to make learning engaging, effective, and enjoyable.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="h-8 w-8 text-blue-600" />,
                title: "Diverse Quiz Topics",
                description:
                  "From science to pop culture, we have quizzes on every subject imaginable to expand your knowledge.",
              },
              {
                icon: <Users className="h-8 w-8 text-blue-600" />,
                title: "Compete with Friends",
                description: "Check the leaderboards and see how you stack up against other quiz takers in real-time.",
              },
              {
                icon: <Target className="h-8 w-8 text-blue-600" />,
                title: "Track Your Progress",
                description: "See detailed reports of your quiz attempts and monitor your improvement over time.",
              },
              {
                icon: <Sparkles className="h-8 w-8 text-blue-600" />,
                title: "Personalized Learning",
                description:
                  "Our system adapts to your strengths and weaknesses to provide a tailored learning experience.",
              },
              {
                icon: <Clock className="h-8 w-8 text-blue-600" />,
                title: "Timed Challenges",
                description: "Test your knowledge under pressure with our timed quiz challenges to improve recall.",
              },
              {
                icon: <Award className="h-8 w-8 text-blue-600" />,
                title: "Earn Certificates",
                description: "Complete quiz series to earn certificates that showcase your knowledge and expertise.",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow group">
                <div className="inline-block p-3 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Quizzes Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Recent Quizzes</h2>
            <Link to="/quizzes" className="text-blue-600 hover:text-blue-800 font-medium flex items-center group">
              View All
              <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="text-gray-600 mt-4">Loading quizzes...</p>
            </div>
          ) : recentQuizzes.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {recentQuizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{quiz.title}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        New
                      </span>
                    </div>
                    <p className="text-gray-600 mb-6 line-clamp-2">{quiz.description}</p>
                    <div className="flex items-center text-gray-500 mb-6">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{quiz.timeLimit} minutes</span>
                      <span className="mx-2">•</span>
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{quiz.questions?.length || 0} questions</span>
                    </div>
                    <Link
                      to={`/quiz/${quiz._id}`}
                      className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg font-medium transition-all hover:bg-blue-700 hover:shadow-md"
                    >
                      Take Quiz
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-blue-50 rounded-xl border border-blue-100">
              <BookOpen className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No quizzes available yet. Check back soon!</p>
              <Link to="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
                Request a quiz topic →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied learners who have improved their knowledge with Quizm.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "Student",
                image: "/images/alex.jpeg",
                quote:
                  "Quizm has been an invaluable tool for my exam preparation. The variety of quizzes and detailed feedback have helped me identify my weak areas.",
              },
              {
                name: "Sarah Williams",
                role: "Teacher",
                image: "/images/sarah.jpeg",
                quote:
                  "As an educator, I love using Quizm to create engaging assessments for my students. The platform is intuitive and the analytics are incredibly helpful.",
              },
              {
                name: "Michael Chen",
                role: "Professional",
                image: "/images/micheal.jpeg",
                quote:
                  "I use Quizm to stay sharp in my field. The specialized quizzes keep me updated on industry knowledge and best practices.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-3/5 p-10 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Test Your Knowledge?</h2>
              <p className="text-blue-100 mb-8 text-lg">
                Join thousands of users who are already challenging themselves and expanding their horizons with Quizm.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="px-8 py-3 bg-white text-blue-600 rounded-full font-medium text-lg transition-all hover:bg-blue-50 hover:shadow-lg"
                >
                  Get Started Now
                </Link>
                <Link
                  to="/quizzes"
                  className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-full font-medium text-lg transition-all hover:bg-blue-700"
                >
                  Explore Quizzes
                </Link>
              </div>
            </div>
            <div className="md:w-2/5 p-10 hidden md:block">
              <img
                src="/images/learning-illustration.jpeg"
                alt="Learning illustration"
                className="w-full max-w-sm mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quizm</h3>
              <p className="text-gray-600 mb-4">Expanding knowledge through interactive learning experiences.</p>
              <div className="flex space-x-4">{/* Social media icons would go here */}</div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/quizzes" className="text-gray-600 hover:text-blue-600">
                    Browse Quizzes
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="text-gray-600 hover:text-blue-600">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="/leaderboard" className="text-gray-600 hover:text-blue-600">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-blue-600">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/faq" className="text-gray-600 hover:text-blue-600">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-blue-600">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-600 hover:text-blue-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-600 hover:text-blue-600">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Newsletter</h4>
              <p className="text-gray-600 mb-4">Stay updated with our latest quizzes and features.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Quizm. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
