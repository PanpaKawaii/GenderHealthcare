import { useState, useEffect } from "react"
import {
  MessageCircle,
  Heart,
  Share2,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  Award,
  Shield,
  Clock,
  Eye,
} from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Textarea } from "./ui/textarea"
import { forumAPI } from "../../services/api"
import { formatDistance } from "date-fns"

export function PostCard({ post }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [userVote, setUserVote] = useState(post.voteType || null)
  const [voteCount, setVoteCount] = useState(post.voteUp?.length - post.voteDown?.length || 0)
  const [isLiked, setIsLiked] = useState(false)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [commentLoading, setCommentLoading] = useState(false)
  // States for reply functionality
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyContent, setReplyContent] = useState("")
  const [replyLoading, setReplyLoading] = useState(false)

  // Get current user ID from localStorage
  const currentUserId = localStorage.getItem('UserId') || null;
  console.log("Current User ID:", currentUserId);
  
  // Format creation date
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

  // Effect to track view count
  useEffect(() => {
    const incrementView = async () => {
      try {
        await forumAPI.incrementPostView(post._id);
      } catch (error) {
        console.error("Error incrementing view count:", error);
      }
    };
    
    // Only increment view when component mounts
    incrementView();
  }, [post._id]);

  // Effect to load comments when comment section is opened
  useEffect(() => {
    if (showComments && !comments.length) {
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showComments]);

  const fetchComments = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await forumAPI.getRepliesByCommentId(post._id);
      
      // Organize comments in a hierarchical structure
      const parentComments = response.data.filter(comment => !comment.parentCommentId);
      
      // For each parent comment, find its replies
      const commentsWithReplies = parentComments.map(parentComment => {
        const replies = response.data.filter(
          reply => reply.parentCommentId === parentComment._id
        );
        return {
          ...parentComment,
          replies: replies
        };
      });
      
      setComments(commentsWithReplies);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (type) => {
    try {
      // Check if user is logged in
      if (!currentUserId) {
        alert("Bạn cần đăng nhập để vote bài viết.");
        return;
      }
      
      // First update UI optimistically
      let newVote;
      if (userVote === type) {
        newVote = null;
      } else {
        newVote = type;
      }
      
      // Calculate what the new vote count will be
      let newCount = voteCount;
      if (userVote === "up" && newVote === null) newCount--;
      if (userVote === "down" && newVote === null) newCount++;
      if (userVote === null && newVote === "up") newCount++;
      if (userVote === null && newVote === "down") newCount--;
      if (userVote === "up" && newVote === "down") newCount -= 2;
      if (userVote === "down" && newVote === "up") newCount += 2;
      
      // Update state immediately for responsive UI
      setUserVote(newVote);
      setVoteCount(newCount);
      
      // Then send to server
      const response = await forumAPI.votePost(post._id, { voteType: newVote, accountId: currentUserId });
      
      // Update with actual server response if needed
      if (response.data.voteStats) {
        setVoteCount(response.data.voteStats.total);
      }
    } catch (error) {
      console.error("Error voting on post:", error);
      // Revert on error
      setUserVote(userVote);
      setVoteCount(voteCount);
      alert("Error submitting your vote. Please try again.");
    }
  };

  const handleCommentVote = async (commentId, type) => {
    try {
      // Check if user is logged in
      if (!currentUserId) {
        alert("Bạn cần đăng nhập để vote bình luận.");
        return;
      }
      
      const response = await forumAPI.voteComment(commentId, { 
        voteType: type, 
        accountId: currentUserId 
      });
      
      // Update comments array with new vote counts
      setComments(prevComments => 
        prevComments.map(comment => 
          comment._id === commentId 
            ? { ...comment, voteUp: response.data.comment.voteUp, voteDown: response.data.comment.voteDown } 
            : comment
        )
      );
    } catch (error) {
      console.error("Error voting on comment:", error);
      alert("Error submitting your vote. Please try again.");
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    // Check if user is logged in
    if (!currentUserId) {
      alert("Bạn cần đăng nhập để bình luận.");
      return;
    }
    
    setCommentLoading(true);
    try {
      const response = await forumAPI.createComment(post._id, {
        content: newComment,
        accountId: currentUserId,
      });
      
      // Add the new comment to comments
      setComments(prevComments => [...prevComments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Error submitting your comment. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleSubmitReply = async (commentId) => {
    if (!replyContent.trim()) return;
    
    // Check if user is logged in
    if (!currentUserId) {
      alert("Bạn cần đăng nhập để trả lời bình luận.");
      return;
    }
    
    setReplyLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await forumAPI.createComment(post._id, {
        content: replyContent,
        accountId: currentUserId,
        parentCommentId: commentId
      });
      
      // Reset reply state
      setReplyingTo(null);
      setReplyContent("");
      
      // Refetch all comments to ensure we get the proper nested structure
      fetchComments(); 
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("Error submitting your reply. Please try again.");
    } finally {
      setReplyLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      "General Health": "bg-blue-100 text-blue-700 border-blue-200",
      "Reproductive Health": "bg-pink-100 text-pink-700 border-pink-200",
      "STI Prevention": "bg-green-100 text-green-700 border-green-200",
      "Pregnancy & Family Planning": "bg-purple-100 text-purple-700 border-purple-200",
      "Menstrual Health": "bg-red-100 text-red-700 border-red-200",
      "Mental Health": "bg-indigo-100 text-indigo-700 border-indigo-200",
    }
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-100">
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.accountId?.image || "/placeholder.svg"} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {post.accountId?.name
                    ? post.accountId.name.split(" ").map((n) => n[0]).join("")
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{post.accountId?.name || "Anonymous"}</h4>
                  {post.accountId?.isVerified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified Expert
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(post.createdAt)}</span>
                  <span>•</span>
                  <Eye className="h-3 w-3" />
                  <span>{post.viewCount || 0} views</span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report Post</DropdownMenuItem>
                <DropdownMenuItem>Save Post</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <Badge className={getCategoryColor(post.category)}>{post.category}</Badge>
            {post.tags && post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs" >
                #{tag}
              </Badge>
            ))}
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{post.title}</h2>

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {isExpanded ? post.content : post.content.length > 300 ? `${post.content.substring(0, 300)}...` : post.content}
            </p>
            {post.content.length > 300 && (
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600 hover:text-blue-700"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show less" : "Read more"}
              </Button>
            )}
          </div>
        </div>

        {/* Voting and Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Voting */}
              <div className="flex items-center gap-1 bg-white rounded-full p-1 border">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 rounded-full ${
                    userVote === "up" ? "bg-green-100 text-green-600 " : "hover:bg-gray-100"
                  }`}
                  style={{ borderRadius: '9999px' }}
                  onClick={() => handleVote("up")}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <span
                  className={`px-2 font-medium ${
                    voteCount > 0 ? "text-green-600" : voteCount < 0 ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  {voteCount}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 rounded-full ${
                    userVote === "down" ? "bg-red-100 text-red-600" : "hover:bg-gray-100"
                  }`}
                  style={{ borderRadius: '9999px' }}
                  onClick={() => handleVote("down")}
                >
                  <ChevronDown className="h-4 w-4 " />
                </Button>
              </div>

              {/* Actions */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2" 
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 w-4" />
                {post.answerCount || 0} replies
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "Liked" : "Like"}
              </Button>

              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            {post.accountId?.role === "Counselor" && post.accountId?.isVerified === true && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                <Award className="h-3 w-3 mr-1" />
                Expert Answer
              </Badge>
            )}
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t bg-white">
            {/* Add Comment */}
            <div className="p-6 border-b bg-gray-50">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">You</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Share your thoughts or ask a follow-up question..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px] resize-none"
                    disabled={commentLoading}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-gray-500">Be respectful and constructive in your response</p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setNewComment("")}
                        disabled={commentLoading || !newComment.trim()}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        disabled={commentLoading || !newComment.trim()}
                        onClick={handleSubmitComment}
                      >
                        {commentLoading ? "Submitting..." : "Reply"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No comments yet. Be the first to comment!</div>
            ) : (
              <div className="divide-y">
                {comments.map((comment) => (
                  <div key={comment._id} className="p-6">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.accountId?.image || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gray-100 text-gray-700 text-sm">
                          {comment.accountId?.name 
                            ? comment.accountId.name.split(" ").map((n) => n[0]).join("") 
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-medium text-gray-900">
                            {comment.accountId?.name || "Anonymous"}
                          </h5>
                          <span className="text-sm text-gray-500">
                            {comment.accountId?.role || "Community Member"}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-400">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{comment.content}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`h-6 px-2 text-xs ${
                                comment.userVote === "up" ? "text-green-600" : ""
                              }`}
                              onClick={() => handleCommentVote(comment._id, "up")}
                            >
                              <ChevronUp className="h-3 w-3 mr-1" />
                              {(comment.voteUp?.length || 0) - (comment.voteDown?.length || 0)}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`h-6 px-2 text-xs ${
                                comment.userVote === "down" ? "text-red-600" : ""
                              }`}
                              onClick={() => handleCommentVote(comment._id, "down")}
                            >
                              <ChevronDown className="h-3 w-3 mr-1" />
                              {comment.voteDown?.length || 0}
                            </Button>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={() => setReplyingTo(comment._id)}
                          >
                            Reply
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <Heart className="h-3 w-3 mr-1" />
                            Like
                          </Button>
                        </div>

                        {/* Reply input area */}
                        {replyingTo === comment._id && (
                          <div className="mt-4 flex gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">You</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <Textarea
                                placeholder="Write your reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="min-h-[60px] resize-none text-sm"
                                disabled={replyLoading}
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7 text-xs"
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyContent("");
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="h-7 text-xs"
                                  disabled={replyLoading || !replyContent.trim()}
                                  onClick={() => handleSubmitReply(comment._id)}
                                >
                                  {replyLoading ? "Submitting..." : "Reply"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Nested Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply._id} className="flex gap-3">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={reply.accountId?.image || "/placeholder.svg"} />
                                  <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                                    {reply.accountId?.name
                                      ? reply.accountId.name.split(" ").map((n) => n[0]).join("")
                                      : "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h6 className="text-sm font-medium text-gray-900">
                                      {reply.accountId?.name || "Anonymous"}
                                    </h6>
                                    <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
                                  </div>
                                  <p className="text-sm text-gray-700">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
