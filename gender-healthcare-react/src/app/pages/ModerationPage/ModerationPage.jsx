import { useEffect, useState } from "react";
import forumAPI from "../../services/forumAPI";
import accountAPI from "../../services/accountAPI";
import { Button } from "../../components/ForumComponents/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../components/ForumComponents/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ForumComponents/ui/tabs";
import { Badge } from "../../components/ForumComponents/ui/badge";
import { formatDistance } from "date-fns";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  User,
  MessageSquare,
  FileText,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ForumComponents/ui/table";

export default function ModerationPage() {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [pendingComments, setPendingComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Pagination state
  const [postsPage, setPostsPage] = useState(1);
  const [commentsPage, setCommentsPage] = useState(1);
  const [postsPageCount, setPostsPageCount] = useState(1);
  const [commentsPageCount, setCommentsPageCount] = useState(1);
  const [postsTotal, setPostsTotal] = useState(0);
  const [commentsTotal, setCommentsTotal] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchModerationStats();
    } else if (activeTab === "posts") {
      fetchPendingPosts();
    } else if (activeTab === "comments") {
      fetchPendingComments();
    }
    //  else if (activeTab === "users") {
    //   fetchUsers();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, postsPage, commentsPage]);

  const fetchModerationStats = async () => {
    setLoading(true);
    try {
      const response = await forumAPI.getModerationStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching moderation stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingPosts = async () => {
    setLoading(true);
    try {
      const response = await forumAPI.getPendingPosts(postsPage, pageSize);
      // Ensure we're accessing the data array from the response
      setPendingPosts(response.data?.data || []);

      // Update pagination info
      if (response.data?.pagination) {
        setPostsPageCount(response.data.pagination.pages || 1);
        setPostsTotal(response.data.pagination.total || 0);
      }
    } catch (error) {
      console.error("Error fetching pending posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingComments = async () => {
    setLoading(true);
    try {
      const response = await forumAPI.getPendingComments(commentsPage, pageSize);
      // Ensure we're accessing the data array from the response
      setPendingComments(response.data?.data || []);
      
      // Update pagination info
      if (response.data?.pagination) {
        setCommentsPageCount(response.data.pagination.pages || 1);
        setCommentsTotal(response.data.pagination.total || 0);
      }
    } catch (error) {
      console.error("Error fetching pending comments:", error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchUsers = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await accountAPI.getAllUsers();
  //     setUsers(response.data || []);
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const approvePost = async (postId) => {
    try {
      await forumAPI.approvePost(postId);
      
      // Remove from list after approval
      setPendingPosts((prev) => {
        const newPosts = prev.filter((post) => post._id !== postId);
        
        // If we've removed the last item on the current page and there are previous pages,
        // go back to the previous page
        if (newPosts.length === 0 && postsPage > 1) {
          // Use setTimeout to avoid state updates during rendering
          setTimeout(() => {
            setPostsPage((currentPage) => currentPage - 1);
          }, 0);
        } else if (newPosts.length === 0) {
          // If on first page and no items left, refresh the current page
          setTimeout(() => {
            fetchPendingPosts();
          }, 0);
        }
        
        return newPosts;
      });
    } catch (error) {
      console.error("Error approving post:", error);
    }
  };

  const rejectPost = async (postId) => {
    try {
      const reason = window.prompt(
        "Enter reason for rejection:",
        "Content not suitable for the community"
      );
      if (reason === null) return; // User canceled the prompt

      await forumAPI.rejectPost(postId, reason);
      
      // Remove from list after rejection
      setPendingPosts((prev) => {
        const newPosts = prev.filter((post) => post._id !== postId);
        
        // If we've removed the last item on the current page and there are previous pages,
        // go back to the previous page
        if (newPosts.length === 0 && postsPage > 1) {
          // Use setTimeout to avoid state updates during rendering
          setTimeout(() => {
            setPostsPage((currentPage) => currentPage - 1);
          }, 0);
        } else if (newPosts.length === 0) {
          // If on first page and no items left, refresh the current page
          setTimeout(() => {
            fetchPendingPosts();
          }, 0);
        }
        
        return newPosts;
      });
    } catch (error) {
      console.error("Error rejecting post:", error);
    }
  };

  const approveComment = async (commentId) => {
    try {
      await forumAPI.approveComment(commentId);

      setPendingComments((prev) => {
        const newComments = prev.filter((comment) => comment._id !== commentId);
        
        // If we've removed the last item on the current page and there are previous pages,
        // go back to the previous page
        if (newComments.length === 0 && commentsPage > 1) {
          // Use setTimeout to avoid state updates during rendering
          setTimeout(() => {
            setCommentsPage((currentPage) => currentPage - 1);
          }, 0);
        } else if (newComments.length === 0) {
          // If on first page and no items left, refresh the current page
          setTimeout(() => {
            fetchPendingComments();
          }, 0);
        }
        
        return newComments;
      });
    } catch (error) {
      console.error("Error approving comment:", error);
    }
  };
  const rejectComment = async (commentId) => {
    try {
      const reason = window.prompt(
        "Enter reason for rejection:",
        "Content not suitable for the community"
      );
      if (reason === null) return; // User canceled the prompt

      await forumAPI.rejectComment(commentId, reason);
      
      setPendingComments((prev) => {
        const newComments = prev.filter((comment) => comment._id !== commentId);
        
        // If we've removed the last item on the current page and there are previous pages,
        // go back to the previous page
        if (newComments.length === 0 && commentsPage > 1) {
          // Use setTimeout to avoid state updates during rendering
          setTimeout(() => {
            setCommentsPage((currentPage) => currentPage - 1);
          }, 0);
        } else if (newComments.length === 0) {
          // If on first page and no items left, refresh the current page
          setTimeout(() => {
            fetchPendingComments();
          }, 0);
        }
        
        return newComments;
      });
    } catch (error) {
      console.error("Error rejecting comment:", error);
    }
  };

  // const activateUser = async (userId) => {
  //   try {
  //     await accountAPI.activateUser(userId);
  //     // Refresh user list
  //     fetchUsers();
  //   } catch (error) {
  //     console.error("Error activating user:", error);
  //   }
  // };

  // const deactivateUser = async (userId) => {
  //   try {
  //     await accountAPI.deactivateUser(userId);
  //     // Refresh user list
  //     fetchUsers();
  //   } catch (error) {
  //     console.error("Error deactivating user:", error);
  //   }
  // };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch (error) {
      console.error("Invalid date format", error);
      return "";
    }
  };
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin Control Panel</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText size={16} />
            <span>Posts</span>
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span>Comments</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 size={16} />
            <span>Dashboard</span>
          </TabsTrigger>
          {/* <TabsTrigger value="users" className="flex items-center gap-2">
            <User size={16} />
            <span>Users</span>
          </TabsTrigger> */}
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : stats ? (
              <>
                {/* Content Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Posts Overview
                    </CardTitle>
                    <CardDescription>Content moderation statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pending</span>
                        <Badge variant="outline" className="bg-yellow-50">
                          {stats.posts?.pending || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Approved</span>
                        <Badge variant="outline" className="bg-green-50">
                          {stats.posts?.approved || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rejected</span>
                        <Badge variant="outline" className="bg-red-50">
                          {stats.posts?.rejected || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between font-medium pt-2">
                        <span>Total Posts</span>
                        <span>{stats.posts?.total || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comment Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Comments Overview
                    </CardTitle>
                    <CardDescription>Comment moderation statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pending</span>
                        <Badge variant="outline" className="bg-yellow-50">
                          {stats.comments?.pending || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Approved</span>
                        <Badge variant="outline" className="bg-green-50">
                          {stats.comments?.approved || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rejected</span>
                        <Badge variant="outline" className="bg-red-50">
                          {stats.comments?.rejected || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between font-medium pt-2">
                        <span>Total Comments</span>
                        <span>{stats.comments?.total || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* User Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Users Overview
                    </CardTitle>
                    <CardDescription>User statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active Users</span>
                        <Badge variant="outline" className="bg-green-50">
                          {stats.users?.active || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Inactive Users</span>
                        <Badge variant="outline" className="bg-gray-100">
                          {stats.users?.inactive || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between font-medium pt-2">
                        <span>Total Users</span>
                        <span>{stats.users?.total || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity Card */}
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Today's Activity</CardTitle>
                    <CardDescription>New content and users from today</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">New Posts</p>
                        <p className="text-2xl font-bold">
                          {stats.activity?.postsToday || 0}
                        </p>
                      </div>
                      <FileText className="h-10 w-10 text-blue-500 opacity-80" />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">New Comments</p>
                        <p className="text-2xl font-bold">
                          {stats.activity?.commentsToday || 0}
                        </p>
                      </div>
                      <MessageSquare className="h-10 w-10 text-green-500 opacity-80" />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">New Users</p>
                        <p className="text-2xl font-bold">
                          {stats.activity?.usersToday || 0}
                        </p>
                      </div>
                      <User className="h-10 w-10 text-purple-500 opacity-80" />
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="col-span-3">
                <CardContent className="py-10">
                  <p className="text-center text-gray-500">Failed to load statistics</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts">
          <h2 className="text-xl font-semibold mb-4">Posts Awaiting Approval</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : pendingPosts.length === 0 ? (
            <Card>
              <CardContent className="py-10">
                <p className="text-center text-gray-500">
                  No pending posts to review!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingPosts.map((post) => (
                <Card key={post._id} className="overflow-hidden">
                  <CardHeader className="pb-2 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <p className="text-sm text-gray-500">
                          Posted {formatDate(post.createdAt)} by{" "}
                          {post.isAnonymous
                            ? "Anonymous"
                            : post.accountId?.name || "Unknown User"}
                        </p>
                      </div>
                      <Badge>{post.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="py-4">
                    <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
                    <div className="flex gap-2 flex-wrap">
                      {post.tags &&
                        post.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            #{tag}
                          </Badge>
                        ))}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 flex justify-end gap-2 py-3">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => rejectPost(post._id)}
                      className="flex items-center gap-1"
                    >
                      <XCircle size={16} />
                      Reject
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => approvePost(post._id)}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {/* Pagination Controls */}
          {pendingPosts.length > 0 && (
            <div className="mt-4 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPostsPage((prev) => Math.max(prev - 1, 1))}
                disabled={postsPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {postsPage} of {postsPageCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPostsPage((prev) => Math.min(prev + 1, postsPageCount))}
                disabled={postsPage === postsPageCount}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments">
          <h2 className="text-xl font-semibold mb-4">
            Comments Awaiting Approval
          </h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : pendingComments.length === 0 ? (
            <Card>
              <CardContent className="py-10">
                <p className="text-center text-gray-500">
                  No pending comments to review!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingComments.map((comment) => (
                <Card key={comment._id}>
                  <CardHeader className="pb-2 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          Comment by {comment.accountId?.name || "Anonymous"}{" "}
                          {formatDate(comment.createdAt)}
                        </p>
                        {comment.postId && (
                          <p className="text-xs text-gray-400">
                            On post: {comment.postId.title || "Unknown Post"}
                          </p>
                        )}
                      </div>
                      {comment.parentCommentId && (
                        <Badge variant="outline">
                          Reply to another comment
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="py-4">
                    <p className="whitespace-pre-wrap">{comment.content}</p>
                  </CardContent>
                  <CardFooter className="bg-gray-50 flex justify-end gap-2 py-3">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => rejectComment(comment._id)}
                      className="flex items-center gap-1"
                    >
                      <XCircle size={16} />
                      Reject
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => approveComment(comment._id)}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {/* Pagination Controls */}
          {pendingComments.length > 0 && (
            <div className="mt-4 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCommentsPage((prev) => Math.max(prev - 1, 1))}
                disabled={commentsPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {commentsPage} of {commentsPageCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCommentsPage((prev) => Math.min(prev + 1, commentsPageCount))}
                disabled={commentsPage === commentsPageCount}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Users Tab */}
        {/* <TabsContent value="users">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <Card>
              <CardContent className="py-10">
                <p className="text-center text-gray-500">
                  No users found
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role || "User"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.isActive ? (
                            <Badge variant="outline" className="bg-green-50">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          {user.isActive ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deactivateUser(user._id)}
                              className="text-red-500"
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => activateUser(user._id)}
                              className="text-green-500"
                            >
                              Activate
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
