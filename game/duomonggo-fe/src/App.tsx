import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, BookOpen, Award, Users, Star, Play } from "lucide-react"
import { useNavigate } from "react-router-dom"

import PlayingSlides from "./assets/playingslides.png";
import ReadingBooks from "./assets/readingbooks.png";
import HoldingBadge from "./assets/holdingbadge.png";
import Happy from "./assets/happy.png";
import Motivate from "./assets/motivate.png";

import Navbar from "./components/navbar";

export default function DuomonggoLanding() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="py-12 md:py-24 bg-white lg:ml-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left w-full mx-auto">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Master Javanese with <span className="text-purple-600">Duomonggo</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                  Learn the beautiful Javanese language through interactive courses, earn certificates, and compete with
                  learners worldwide. Start your cultural journey today!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto" onClick={() => navigate("/courses")}>
                  <Play className="w-5 h-5 mr-2" />
                  Start Learning Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500 text-purple-600 hover:bg-purple-50 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start sm:space-x-8 space-y-4 sm:space-y-0 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>1000+ Learners</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>4.95/5 Rating</span>
                </div>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0 flex justify-center">
              <div className="relative bg-white rounded-3xl shadow-2xl p-4 sm:p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300 max-w-sm sm:max-w-md w-full">
                <img
                  src={PlayingSlides}
                  alt="Duomonggo Learning Interface"
                  width={500}
                  height={400}
                  className="rounded-2xl w-full h-auto"
                  draggable="false"
                />
                <div className="absolute -top-4 -right-4 bg-purple-500 text-white rounded-full p-3">
                  <Trophy className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Duomonggo?</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Experience the most effective way to learn Javanese with our comprehensive features designed to make your
              learning journey engaging and rewarding.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
            <Card className="border-2 border-gray-100 hover:border-purple-200 transition-colors duration-300 group max-w-sm w-full">
              <CardContent className="p-4 sm:p-8 text-center">
                <div className="mb-6">
                  <img
                    src={ReadingBooks}
                    alt="Interactive Courses"
                    width={300}
                    height={200}
                    className="rounded-lg mx-auto w-full h-auto"
                    draggable="false"
                  />
                </div>
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Interactive Courses</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Enroll in multiple Javanese courses with engaging questions and interactive exercises. Each course is
                  carefully crafted to build your language skills progressively.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-purple-200 transition-colors duration-300 group max-w-sm w-full">
              <CardContent className="p-4 sm:p-8 text-center">
                <div className="mb-6">
                  <img
                    src={HoldingBadge}
                    alt="Certificates and EXP"
                    width={300}
                    height={200}
                    className="rounded-lg mx-auto w-full h-auto"
                    draggable="false"
                  />
                </div>
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Earn Certificates & EXP</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Complete courses perfectly to earn experience points and official certificates. Show off your Javanese
                  language achievements to the world!
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-purple-200 transition-colors duration-300 group sm:col-span-2 md:col-span-1 max-w-sm w-full">
              <CardContent className="p-4 sm:p-8 text-center">
                <div className="mb-6">
                  <img
                    src={Happy}
                    alt="Leaderboard Competition"
                    width={300}
                    height={200}
                    className="rounded-lg mx-auto w-full h-auto"
                    draggable="false"
                  />
                </div>
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Trophy className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Global Leaderboard</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Compete with learners worldwide on our leaderboard. Stay motivated by climbing the ranks and earning
                  more EXP through course completions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-24 bg-white lg:ml-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-4">How Duomonggo Works</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Start your Javanese learning journey in just three simple steps. Our proven method makes language learning
              fun and effective.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div className="space-y-8 mx-auto w-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Choose Your Course</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    Browse our comprehensive collection of Javanese courses. From basic greetings to advanced
                    conversations, find the perfect course for your skill level.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Answer Questions</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    Engage with interactive questions and exercises. Practice pronunciation, grammar, and vocabulary
                    through our gamified learning system.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Earn Rewards</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    Complete courses perfectly to earn EXP points and certificates. Climb the leaderboard and showcase
                    your Javanese language mastery!
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0 flex justify-center">
              <img
                  src={Motivate}
                  alt="Learning Process"
                  width={400}
                  height={400}
                  className=""
                  draggable="false"
                />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-r from-purple-600 to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto px-2">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6">Ready to Master Javanese?</h2>
            <p className="text-base sm:text-xl text-purple-100 mb-6 sm:mb-8 leading-relaxed">
              Join thousands of learners who are already discovering the beauty of Javanese culture through language.
              Start your journey today and unlock a world of opportunities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-12">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto" onClick={() => navigate("/courses")}>
                <Play className="w-5 h-5 mr-2" />
                Start Learning Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
