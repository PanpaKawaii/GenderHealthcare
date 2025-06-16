import { useEffect, useState } from "react"
import { Search, Plus, TrendingUp, MessageCircle, Filter, SortDesc, Users, Award, Bell } from "lucide-react"
import { Button } from "../../components/ForumComponents/ui/button"
import { Input } from "../../components/ForumComponents/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ForumComponents/ui/card"
import { Badge } from "../../components/ForumComponents/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ForumComponents/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ForumComponents/ui/select"
import { PostCard } from "../../components/ForumComponents/post-card"
import { CreatePostModal } from "../../components/ForumComponents/create-post-modal"

import { forumAPI } from "../../services/api"
// const samplePosts = [
//   {
//     id: 1,
//     title: "First-time gynecological exam - what should I expect?",
//     content:
//       "I'm 22 and scheduled for my first gynecological exam next week. I'm feeling quite anxious about it and would love to hear from others about their experiences. What questions should I prepare? What happens during the exam? Any tips to help me feel more comfortable? I've been putting this off for too long due to anxiety, but I know it's important for my health. Thank you for any advice you can share!",
//     author: "Sarah_M",
//     authorRole: "Community Member",
//     authorAvatar: "/placeholder.svg?height=40&width=40",
//     category: "General Health",
//     votes: 24,
//     replies: 18,
//     views: 342,
//     timeAgo: "2 hours ago",
//     isExpertVerified: false,
//     tags: ["first-visit", "anxiety", "gynecology", "advice"],
//     hasUserVoted: false,
//     comments: [
//       {
//         id: 1,
//         author: "Dr. Jennifer Liu",
//         authorRole: "Gynecologist",
//         content:
//           "It's completely normal to feel anxious about your first exam! The most important thing to remember is that this is a routine medical procedure designed to keep you healthy. During the exam, we'll discuss your medical history, perform a physical examination, and possibly do a Pap smear depending on your age and risk factors. Feel free to ask questions and communicate any discomfort.",
//         timeAgo: "1 hour ago",
//         votes: 15,
//         replies: [
//           {
//             id: 1,
//             author: "Sarah_M",
//             content:
//               "Thank you so much Dr. Liu! This really helps ease my anxiety. Should I prepare any specific questions beforehand?",
//             timeAgo: "45 minutes ago",
//           },
//         ],
//       },
//       {
//         id: 2,
//         author: "HealthAdvocate_2024",
//         authorRole: "Community Member",
//         content:
//           "I was terrified for my first exam too! What helped me was writing down all my questions beforehand and letting the doctor know I was nervous. Most healthcare providers are very understanding and will take extra time to explain everything. You've got this! 💪",
//         timeAgo: "30 minutes ago",
//         votes: 8,
//       },
//     ],
//   },
//   {
//     id: 2,
//     title: "Understanding Birth Control Options - Need Expert Advice",
//     content:
//       "I'm 25 and looking to start birth control but feeling overwhelmed by all the options available. I've heard about pills, IUDs, implants, and patches, but I'm not sure which would be best for my lifestyle and health needs. I have a history of migraines and I'm concerned about hormonal side effects. I'd love to hear from both healthcare professionals and people who have experience with different methods. What questions should I ask my doctor during my consultation?",
//     author: "Anonymous",
//     authorRole: "Community Member",
//     category: "Pregnancy & Family Planning",
//     votes: 31,
//     replies: 25,
//     views: 567,
//     timeAgo: "4 hours ago",
//     isExpertVerified: true,
//     tags: ["birth-control", "contraception", "hormones", "consultation"],
//     hasUserVoted: true,
//     voteType: "up",
//     comments: [
//       {
//         id: 1,
//         author: "Dr. Maria Rodriguez",
//         authorRole: "Family Planning Specialist",
//         content:
//           "Great question! Given your history of migraines, we'll want to be careful about estrogen-containing methods as they can potentially worsen migraines in some people. Non-hormonal options like the copper IUD or barrier methods might be worth considering. I'd recommend scheduling a consultation to discuss your complete medical history, lifestyle preferences, and concerns. We can then create a personalized plan that works best for you.",
//         timeAgo: "3 hours ago",
//         votes: 22,
//       },
//     ],
//   },
//   {
//     id: 3,
//     title: "STI Testing - How Often and What Tests Should I Get?",
//     content:
//       "I'm sexually active and want to be responsible about my sexual health, but I'm confused about STI testing recommendations. How often should I get tested? What tests are included in a standard STI panel? Should my partner and I get tested together? I'm also wondering about the cost and whether insurance typically covers these tests. Any guidance would be really helpful!",
//     author: "HealthConscious_23",
//     authorRole: "Community Member",
//     category: "STI Prevention",
//     votes: 18,
//     replies: 12,
//     views: 289,
//     timeAgo: "6 hours ago",
//     isExpertVerified: true,
//     tags: ["sti-testing", "sexual-health", "prevention", "insurance"],
//     hasUserVoted: false,
//     comments: [
//       {
//         id: 1,
//         author: "TestingSupportTeam",
//         authorRole: "Healthcare Provider",
//         content:
//           "Excellent question about staying on top of your sexual health! The CDC recommends annual testing for sexually active individuals, but frequency can vary based on your risk factors and number of partners. A standard panel typically includes tests for chlamydia, gonorrhea, syphilis, HIV, and sometimes herpes and hepatitis B. Most insurance plans do cover preventive STI screening. I'd recommend discussing your specific situation with a healthcare provider who can give you personalized recommendations.",
//         timeAgo: "5 hours ago",
//         votes: 14,
//       },
//     ],
//   },
// ]

const trendingTopics = [
  { name: "Birth Control Options", posts: 45, trend: "+12%" },
  { name: "First Gynecologist Visit", posts: 32, trend: "+8%" },
  { name: "STI Testing Guide", posts: 28, trend: "+15%" },
  { name: "Menstrual Health", posts: 24, trend: "+5%" },
  { name: "Pregnancy Planning", posts: 19, trend: "+22%" },
]

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filterBy, setFilterBy] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [Posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

 
    const fetchPosts =async () => {
      try{
    const response = await forumAPI.getAllPosts();
      setPosts(response.data);
      console.log("Fetched posts:", response.data)
      setLoading(false)
  
       } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };
  
     useEffect(() => {
        fetchPosts();
      }, []);


 const handlePostCreated = () => {
    setLoading(true);
    fetchPosts();
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Health Community Forum</h1>
              <p className="text-gray-600 mt-1">Ask questions, share experiences, and get support from our community</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4" />
                Ask Question
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Active Members</span>
                  </div>
                  <span className="font-semibold">12,456</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Discussions</span>
                  </div>
                  <span className="font-semibold">3,789</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Expert Answers</span>
                  </div>
                  <span className="font-semibold">1,234</span>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={topic.name}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-sm">{topic.name}</p>
                      <p className="text-xs text-gray-500">{topic.posts} discussions</p>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      {topic.trend}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• Be respectful and supportive</p>
                <p>• Protect privacy and confidentiality</p>
                <p>• No personal medical advice</p>
                <p>• Verify information with professionals</p>
                <p>• Report inappropriate content</p>
                <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
                  Read full guidelines →
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search discussions, topics, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2 w-1/3">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-32">
                        <SortDesc className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent >
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="votes">Most Voted</SelectItem>
                        <SelectItem value="replies">Most Replies</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterBy} onValueChange={setFilterBy}>
                      <SelectTrigger className="w-32">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Posts</SelectItem>
                        <SelectItem value="questions">Questions</SelectItem>
                        <SelectItem value="expert">Expert Answers</SelectItem>
                        <SelectItem value="unanswered">Unanswered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Discussions</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="expert">Expert Answers</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6 mt-6">
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Loading discussions...</p>
                  </div>
                ) : (
                  Posts.map((post) => <PostCard key={post.id} post={post} />)
                )}
              </TabsContent>

              {/* <TabsContent value="questions" className="space-y-6 mt-6">
                {samplePosts
                  .filter((post) => !post.isExpertVerified)
                  .map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
              </TabsContent>

              <TabsContent value="expert" className="space-y-6 mt-6">
                {samplePosts
                  .filter((post) => post.isExpertVerified)
                  .map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
              </TabsContent> */}

              <TabsContent value="following" className="space-y-6 mt-6">
                <div className="text-center py-12">
                  <p className="text-gray-500">You're not following any discussions yet.</p>
                  <Button variant="link" className="mt-2">
                    Explore popular discussions →
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline" size="lg">
                Load More Discussions
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onPostCreated={handlePostCreated} />
    </div>
  )
}
