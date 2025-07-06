import { useEffect, useState } from "react";
import forumAPI from "../../services/forumAPI";
import {
  Search,
  Plus,
  TrendingUp,
  MessageCircle,
  Filter,
  SortDesc,
  Users,
  Award,
  Bell,
} from "lucide-react";
import { Button } from "../../components/ForumComponents/ui/button";
import { Input } from "../../components/ForumComponents/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ForumComponents/ui/card";
import { Badge } from "../../components/ForumComponents/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ForumComponents/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ForumComponents/ui/select";
import { PostCard } from "../../components/ForumComponents/post-card";
import { CreatePostModal } from "../../components/ForumComponents/create-post-modal";

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [communityStats, setCommunityStats] = useState({
    activeMembers: 0,
    discussions: 0,
    expertAnswers: 0,
  });
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [Posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [accountId] = useState(localStorage.getItem("UserId") || null);
  const postsPerPage = 10;
  const fetchPosts = async (page = 1, reset = false) => {
    setLoading(true);
    try {
      let apiCall;

      const params = {
        page: page,
        limit: postsPerPage,
        search: searchQuery,
        sort: sortBy,
      };

      if (filterBy !== "all") {
        params.category = filterBy;
      }

      switch (activeTab) {
        case "questions":
          // Questions: hiển thị câu hỏi chưa được chuyên gia(counselor) trả lời
          params.type = "questions";
          apiCall = forumAPI.getPosts(params);
          break;
        case "expert":
          // Expert Answers: hiển thị câu hỏi được chuyên gia(counselor) trả lời
          params.type = "expert";
          apiCall = forumAPI.getPosts(params);
          break;
        case "following":
          // Following: những câu hỏi mà accountId khi login đó voted up
          // console.log("Fetching followed posts for accountId:", accountId);
          if (accountId) {
            params.type = "following";
            params.accountId = accountId;
            apiCall = forumAPI.getPosts(params);
            // console.log("Fetching followed posts for accountId:", accountId);
          } else {
            setPosts([]);
            setLoading(false);
            return;
          }
          break;
        case "myPosts":
          // My Posts: hiển thị những bài đăng của người dùng hiện tại
          if (accountId) {
            params.type = "myPosts";
            params.accountId = accountId;
            apiCall = forumAPI.getPosts(params);
          } else {
            setPosts([]);
            setLoading(false);
            return;
          }
          break;
        default:
          params.type = "all";
          apiCall = forumAPI.getPosts(params);
          break;
      }

      const response = await apiCall;

      if (response?.data) {
        // Nếu reset = true hoặc page = 1, thay thế Posts, ngược lại thêm vào cuối
        if (reset || page === 1) {
          setPosts(response.data.posts || []);
        } else {
          setPosts((prev) => [...prev, ...(response.data.posts || [])]);
        }

        // Cập nhật trạng thái phân trang
        if (response.data.pagination) {
          setCurrentPage(response.data.pagination.page);
          setHasMore(
            response.data.pagination.page < response.data.pagination.pages
          );
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityStats = async () => {
    try {
      const response = await forumAPI.getCommunityStats();
      if (response?.data) {
        setCommunityStats({
          activeMembers: response.data.activeMembers,
          discussions: response.data.discussions,
          expertAnswers: response.data.expertAnswers,
        });
        setTrendingTopics(response.data.trendingTopics || []);
      }
    } catch (error) {
      console.error("Error fetching community stats:", error);
    }
  };

  useEffect(() => {
    fetchPosts(1, true);
    fetchCommunityStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPosts(1, true);
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBy, sortBy, activeTab]);

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
    <div className="min-h-screen">
      <div className="  ">
        <div className="max-w-3/4 mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Health Community Forum
              </h1>
              <p className="text-gray-600 mt-1">
                Ask questions, share experiences, and get support from our
                community
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* <Button variant="outline" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </Button> */}
              <Button
                className="bg-blue-600 hover:bg-blue-700 gap-2"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4" />
                Ask Question
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3/4 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
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
                  <span className="font-semibold">
                    {communityStats.activeMembers.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Discussions</span>
                  </div>
                  <span className="font-semibold">
                    {communityStats.discussions.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Expert Answers</span>
                  </div>
                  <span className="font-semibold">
                    {communityStats.expertAnswers.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {" "}
                {trendingTopics.map((topic) => (
                  <div
                    key={topic.name}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-sm">{topic.name}</p>
                      <p className="text-xs text-gray-500">
                        {topic.posts} discussions
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-700"
                    >
                      {topic.trend}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

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
                <p>• Avoid spreading misinformation</p>
                <p>• Use clear and kind language</p>
                <p>• Do not diagnose or prescribe treatments</p>
                <p>• Respect differing views and experiences</p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
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
                  <div className="flex gap-2 w-1/5">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-32">
                        <SortDesc className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>{" "}
                      <SelectContent>
                        <SelectItem value="newest">Most Recent</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="votes">Most Voted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All Discussions</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="expert">Expert Answers</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="myPosts">My Posts</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-6 mt-6">
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Loading discussions...</p>
                  </div>
                ) : Posts.length > 0 ? (
                  Posts.map((post) => (
                    <PostCard key={post._id} post={post} currentTab="all" />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No discussions found</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="questions" className="space-y-6 mt-6">
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Loading questions...</p>
                  </div>
                ) : Posts.length > 0 ? (
                  Posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      currentTab="questions"
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No questions found</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="expert" className="space-y-6 mt-6">
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Loading expert answers...</p>
                  </div>
                ) : Posts.length > 0 ? (
                  Posts.map((post) => <PostCard key={post._id} post={post} />)
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No expert answers found</p>
                  </div>
                )}
              </TabsContent>{" "}
              <TabsContent value="following" className="space-y-6 mt-6">
                {!accountId ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      Please log in to see discussions you've upvoted.
                    </p>
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={() => setActiveTab("all")}
                    >
                      Explore all discussions →
                    </Button>
                  </div>
                ) : loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      Loading followed discussions...
                    </p>
                  </div>
                ) : Posts.length > 0 ? (
                  Posts.map((post) => <PostCard key={post._id} post={post} />)
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      You haven't upvoted any discussions yet.
                    </p>
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={() => setActiveTab("all")}
                    >
                      Explore popular discussions →
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="myPosts" className="space-y-6 mt-6">
                {!accountId ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      Please log in to see your posts.
                    </p>
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={() => setActiveTab("all")}
                    >
                      Explore all discussions →
                    </Button>
                  </div>
                ) : loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Loading your posts...</p>
                  </div>
                ) : Posts.length > 0 ? (
                  Posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      currentTab={activeTab}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      You haven't created any posts yet.
                    </p>
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={() => setShowCreateModal(true)}
                    >
                      Ask a question now →
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                disabled={loading || !hasMore}
              >
                {loading ? "Loading..." : "Load More Discussions"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
