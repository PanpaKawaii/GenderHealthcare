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
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const postsPerPage = 10

  const fetchPosts = async (page = 1, reset = false) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: postsPerPage,
      }

      if (filterBy !== "all" && filterBy !== "following") {
        params.category = filterBy;
      }

      if (sortBy === "recent") {
        params.sort = "-createdAt"; // Newest first
      } else if (sortBy === "popular") {
        params.sort = "-viewCount"; // Most viewed
      } else if (sortBy === "votes") {
        params.sort = "-votes"; // Most voted
      } else if (sortBy === "replies") {
        params.sort = "answerCount"; // Most comments
      }

      // Add search query if applicable
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await forumAPI.getAllPosts(params);
      console.log("Fetched posts:", response.data);
      
      
      if (reset || page === 1) {
        setPosts(response.data);
      } else {
        setPosts(prev => [...prev, ...response.data]);
      }

      
      setHasMore(response.data.length === postsPerPage);
      // console.log("Fetched posts:", response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };  
  
  useEffect(() => {
    fetchPosts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to refetch posts when filters or sort change
  useEffect(() => {
    fetchPosts(1, true);
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBy, sortBy]);


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchPosts(1, true);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  const handlePostCreated = () => {
    setLoading(true);
    fetchPosts(1, true);
    setCurrentPage(1);
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
              <CardContent className="space-y-3">                {trendingTopics.map((topic) => (
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
              <Button variant="outline" size="lg" onClick={handleLoadMore} disabled={loading || !hasMore}>
                {loading ? "Loading..." : "Load More Discussions"}
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
