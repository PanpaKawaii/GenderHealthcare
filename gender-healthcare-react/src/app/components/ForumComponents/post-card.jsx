import { useState, useEffect } from "react";
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
  Copy,
  ExternalLink,
  Mail,
  Check,
  Clock3,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Textarea } from "./ui/textarea";
import forumAPI from "../../services/forumAPI";
import { formatDistance } from "date-fns";
import { api } from "../../services/api";

export function PostCard({ post, currentTab }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const currentUserId = localStorage.getItem("UserId") || null;
  const [userVote, setUserVote] = useState(() => {
    if (currentUserId) {
      if (post.voteUp && post.voteUp.includes(currentUserId)) return "up";
      if (post.voteDown && post.voteDown.includes(currentUserId)) return "down";
    }
    return null;
  });
  const [voteCount, setVoteCount] = useState(
    (post.voteUp?.length || 0) - (post.voteDown?.length || 0)
  );
  const [upVoteCount, setUpVoteCount] = useState(post.voteUp?.length || 0);

  const _displayVoteCount = Math.max(0, voteCount); // Net vote count (for commented code/future use)
  const displayVoteUpCount = upVoteCount;
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);

  const [loading, _setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const commentsPerPage = 10;

  const [expandedComments, setExpandedComments] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    content: "",
   
  });

  // Share functionality
  const handleShare = async (platform) => {
    // Tạo đường dẫn đầy đủ đến trang chi tiết bài viết
    const postUrl = `${window.location.origin}/post/${post._id}`;
    const postTitle = post.title;
    const postContent = post.content.substring(0, 100) + "...";

    switch (platform) {
      case "copy": {
        try {
          await navigator.clipboard.writeText(postUrl);
          alert("Link đã được sao chép vào clipboard!");
        } catch (error) {
          console.error("Failed to copy link:", error);
          alert("Không thể sao chép link. Vui lòng thử lại.");
        }
        break;
      }

      case "facebook": {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          postUrl
        )}`;
        window.open(facebookUrl, "_blank", "width=600,height=400");
        break;
      }

      case "twitter": {
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          postUrl
        )}&text=${encodeURIComponent(postTitle)}`;
        window.open(twitterUrl, "_blank", "width=600,height=400");
        break;
      }

      case "email": {
        const emailUrl = `mailto:?subject=${encodeURIComponent(postTitle)}&body=${encodeURIComponent(`${postContent}\n\nRead more: ${postUrl}`)}`;
        window.location.href = emailUrl;
        break;
      }
      
      default:
        break;
    }
  };

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
    // Sử dụng biến flag để đảm bảo API chỉ được gọi một lần
    let isApiCalled = false;
    
    const cleanupOldViewedPosts = () => {
      try {
        const viewData = JSON.parse(localStorage.getItem('viewedPostsData') || '{}');
        const now = new Date().getTime();
        const ONE_DAY = 24 * 60 * 60 * 1000; // 24 giờ tính bằng milliseconds
        const updatedData = {};
        let hasChanges = false;
        
        // Xóa các bài đăng đã xem quá 24 giờ
        Object.keys(viewData).forEach(key => {
          if (now - viewData[key] < ONE_DAY) {
            updatedData[key] = viewData[key];
          } else {
            hasChanges = true;
          }
        });
        
        if (hasChanges) {
          localStorage.setItem('viewedPostsData', JSON.stringify(updatedData));
        }
        
        return updatedData;
      } catch (error) {
        console.error("Error cleaning up viewed posts:", error);
        return {};
      }
    };
    
    const incrementView = async () => {
      // Đảm bảo hàm này chỉ chạy một lần
      if (isApiCalled) return;
      
      try {
        // Kiểm tra tồn tại sessionStorage để đảm bảo không tăng view khi refresh trang
        const sessionKey = `viewed_${post._id}`;
        if (sessionStorage.getItem(sessionKey)) {
          // Đã xem trong phiên hiện tại, không tăng view
          return;
        }
        
        // Đánh dấu đã xem trong phiên hiện tại
        sessionStorage.setItem(sessionKey, 'true');
        
        // Lấy và làm sạch dữ liệu cũ
        const viewedPostsData = cleanupOldViewedPosts();
        const postKey = `post_${post._id}`;
        
        // Kiểm tra xem bài viết đã được xem trong 24 giờ qua chưa
        if (!viewedPostsData[postKey]) {
          isApiCalled = true; // Đánh dấu đã gọi API
          
          // Gọi API để tăng lượt xem
          await forumAPI.incrementView(post._id);
          
          // Lưu ID bài đăng và thời gian xem vào localStorage
          viewedPostsData[postKey] = new Date().getTime();
          localStorage.setItem('viewedPostsData', JSON.stringify(viewedPostsData));
        }
      } catch (error) {
        console.error("Error incrementing view count:", error);
      }
    };
    
    incrementView();
    
    // Cleanup function để tránh memory leak
    return () => {
      isApiCalled = true; // Đảm bảo không gọi API nữa khi component unmount
    };
  }, [post._id]);

  useEffect(() => {
    if (showComments && !comments.length) {
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showComments]);
  const fetchComments = async (page = 1, append = false) => {
    if (commentLoading) return;

    try {
      setCommentLoading(true);
      console.log("Fetching comments for page:", page, "append:", append);

      const response = await forumAPI.getCommentsByPostId(
        post._id,
        currentUserId,
        page,
        commentsPerPage
      );
      console.log("API response:", response);

      // Log comment statuses for debugging
      if (response.data?.comments) {
        console.log(
          "Comment statuses:",
          response.data.comments.map((c) => ({
            id: c._id,
            status: c.status,
            content: c.content.substring(0, 20) + "...",
            replies: c.replies?.map((r) => ({ id: r._id, status: r.status })),
          }))
        );
      }

      if (response.data) {
        if (response.data.comments) {
          // API returns hierarchical structure with pagination
          if (append) {
            setComments((prevComments) => [
              ...prevComments,
              ...response.data.comments,
            ]);
          } else {
            setComments(response.data.comments);
          }

          // Check if there are more comments to load
          if (response.data.pagination) {
            setHasMoreComments(
              response.data.pagination.page < response.data.pagination.pages
            );
            setCommentPage(response.data.pagination.page);
            console.log(
              "Has more comments:",
              response.data.pagination.page < response.data.pagination.pages
            );
          } else {
            setHasMoreComments(false);
            setCommentPage(page);
          }
        } else {
          // Fallback for old API format
          const flatComments = Array.isArray(response.data)
            ? response.data
            : [];

          // Process into hierarchical structure
          const rootComments = [];
          const commentMap = {};

          // First pass - create map of all comments
          flatComments.forEach((comment) => {
            const commentObj = { ...comment, replies: [] };
            commentMap[comment._id] = commentObj;

            // Root comments have null parentCommentId
            if (!comment.parentCommentId) {
              rootComments.push(commentObj);
            }
          });

          // Second pass - establish hierarchy
          flatComments.forEach((comment) => {
            if (
              comment.parentCommentId &&
              commentMap[comment.parentCommentId]
            ) {
              // Add as a child to parent
              commentMap[comment.parentCommentId].replies.push(
                commentMap[comment._id]
              );
            }
          });

          setComments(rootComments);
        }

        setCommentLoading(false);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setCommentLoading(false);
    }
  };

  const handleVote = async (type) => {
    try {
      if (!currentUserId) {
        alert("Bạn cần đăng nhập để vote bài viết");
        return;
      }

      // Add visual feedback immediately with enhanced animation
      const button = document.querySelector(`[data-vote-type="${type}"]`);
      if (button) {
        // Scale down effect
        button.style.transform = "scale(0.95)";

        // Ripple effect
        const ripple = button.querySelector(".absolute");
        if (ripple) {
          ripple.style.opacity = "0.3";
          ripple.style.transform = "scale(1.5)";
          setTimeout(() => {
            ripple.style.opacity = "0";
            ripple.style.transform = "scale(0)";
          }, 400);
        }

        setTimeout(() => {
          button.style.transform = "";
        }, 150);
      }

      // Determine if this is a toggle (clicking same vote type again)
      const isToggling = userVote === type;

      // If toggling, we'll send null to remove the vote
      // If changing vote direction, we'll send the new vote type
      const voteTypeToSend = isToggling ? null : type;
      // Store previous state for potential reverting
      const previousUserVote = userVote;
      // Store previous vote count if needed for error handling
      // eslint-disable-next-line no-unused-vars
      const previousVoteCount = voteCount;

      if (isToggling) {
        // Remove vote: if upvote is removed, decrease count by 1
        //             if downvote is removed, increase count by 1
        setVoteCount((prev) => (type === "up" ? prev - 1 : prev + 1));
        setUpVoteCount((prev) => (type === "up" ? prev - 1 : prev));
        setUserVote(null);
      } else if (previousUserVote === null) {
        // Adding new vote: increase for upvote, decrease for downvote
        setVoteCount((prev) => (type === "up" ? prev + 1 : prev - 1));
        setUpVoteCount((prev) => (type === "up" ? prev + 1 : prev));
        setUserVote(type);
      } else {
        // Switching vote direction (up → down or down → up)
        // This means a 2-point swing in either direction
        setVoteCount((prev) => (type === "up" ? prev + 2 : prev - 2));
        setUpVoteCount((prev) => (type === "up" ? prev + 1 : prev - 1));
        setUserVote(type);
      }

      const response = await forumAPI.votePost(post._id, {
        voteType: voteTypeToSend,
        accountId: currentUserId,
      });

      if (response.data && response.data.voteStats) {
        // Get the raw vote count for internal state management
        const { rawTotal } = response.data.voteStats;
        setVoteCount(rawTotal);
      }

      // Update upvote count from server response if available
      if (response.data && response.data.post) {
        setUpVoteCount(response.data.post.voteUp?.length || 0);
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to register vote. Please try again.");
      try {
        const postResponse = await forumAPI.getPostById(post._id);
        if (postResponse.data && postResponse.data.post) {
          const updatedPost = postResponse.data.post;
          // Reset user vote status
          if (currentUserId) {
            if (
              updatedPost.voteUp &&
              updatedPost.voteUp.includes(currentUserId)
            ) {
              setUserVote("up");
            } else if (
              updatedPost.voteDown &&
              updatedPost.voteDown.includes(currentUserId)
            ) {
              setUserVote("down");
            } else {
              setUserVote(null);
            }
          }
          setVoteCount(
            (updatedPost.voteUp?.length || 0) -
              (updatedPost.voteDown?.length || 0)
          );
          setUpVoteCount(updatedPost.voteUp?.length || 0);
        }
      } catch (refreshError) {
        console.error("Error refreshing post data:", refreshError);
      }
    }
  };

  const handleCommentVote = async (commentId, type) => {
    try {
      if (!currentUserId) {
        alert("Bạn cần đăng nhập để vote bình luận.");
        return;
      }

      const findComment = (comments, targetId) => {
        for (const comment of comments) {
          if (comment._id === targetId) {
            return comment;
          }
          if (comment.replies && comment.replies.length > 0) {
            const found = findComment(comment.replies, targetId);
            if (found) return found;
          }
        }
        return null;
      };

      const comment = findComment(comments, commentId);
      if (!comment) return;

      const isUpvoteToggle =
        comment.voteUp &&
        comment.voteUp.includes(currentUserId) &&
        type === "up";
      const isDownvoteToggle =
        comment.voteDown &&
        comment.voteDown.includes(currentUserId) &&
        type === "down";
      const isToggling = isUpvoteToggle || isDownvoteToggle;
      const voteTypeToSend = isToggling ? null : type;

      const updatedComments = updateCommentVoteState(
        comments,
        commentId,
        currentUserId,
        voteTypeToSend
      );
      setComments(updatedComments);

      const response = await forumAPI.voteComment(commentId, {
        voteType: voteTypeToSend,
        accountId: currentUserId,
      });

      if (response.data && response.data.comment) {
        setComments((prevComments) =>
          updateCommentTreeWithNewVotes(
            prevComments,
            commentId,
            response.data.comment.voteUp,
            response.data.comment.voteDown
          )
        );
      }
    } catch (error) {
      console.error("Error voting on comment:", error);
      alert("Error submitting your vote. Please try again.");

      fetchComments();
    }
  };

  const updateCommentTreeWithNewVotes = (
    comments,
    commentId,
    newVoteUp,
    newVoteDown
  ) => {
    return comments.map((comment) => {
      if (comment._id === commentId) {
        const voteCount = newVoteUp.length - newVoteDown.length;
        const displayVoteCount = Math.max(0, voteCount);
        return {
          ...comment,
          voteUp: newVoteUp,
          voteDown: newVoteDown,
          voteCount,
          displayVoteCount,
        };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentTreeWithNewVotes(
            comment.replies,
            commentId,
            newVoteUp,
            newVoteDown
          ),
        };
      }
      return comment;
    });
  };

  const updateCommentVoteState = (comments, commentId, userId, voteType) => {
    return comments.map((comment) => {
      if (comment._id === commentId) {
        let voteUp = [...(comment.voteUp || [])];
        let voteDown = [...(comment.voteDown || [])];

        voteUp = voteUp.filter((id) => id !== userId);
        voteDown = voteDown.filter((id) => id !== userId);

        if (voteType === "up") {
          voteUp.push(userId);
        } else if (voteType === "down") {
          voteDown.push(userId);
        }

        const voteCount = voteUp.length - voteDown.length;

        const displayVoteCount = Math.max(0, voteCount);

        const userVote = voteType || null;

        return {
          ...comment,
          voteUp,
          voteDown,
          voteCount,
          displayVoteCount,
          userVote,
        };
      }

      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentVoteState(
            comment.replies,
            commentId,
            userId,
            voteType
          ),
        };
      }

      return comment;
    });
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    if (!currentUserId) {
      alert("Bạn cần đăng nhập để bình luận.");
      return;
    }

    setCommentLoading(true);
    try {
      const response = await forumAPI.addComment(post._id, {
        content: newComment,
        accountId: currentUserId,
      });

      if (response.data.message.includes("chờ duyệt")) {
        alert(
          "Your comment is pending approval. It will be visible after review."
        );
      } else {
        if (response.data.comment) {
          setComments((prevComments) => [
            ...prevComments,
            response.data.comment,
          ]);
          post.answerCount = (post.answerCount || 0) + 1;
        }
      }

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

    if (!currentUserId) {
      alert("Bạn cần đăng nhập để trả lời bình luận.");
      return;
    }

    setReplyLoading(true);
    try {
      const response = await forumAPI.replyToComment(commentId, {
        content: replyContent,
        accountId: currentUserId,
        postId: post._id,
      });

      setReplyingTo(null);
      setReplyContent("");
      console.log("Reply response:", response);

      if (
        response.data &&
        response.data.message &&
        response.data.message.includes("chờ duyệt")
      ) {
        alert(
          "Trả lời của bạn đang chờ kiểm duyệt. Nó sẽ hiển thị sau khi được phê duyệt."
        );
      } else if (response.data && response.data.comment) {
        fetchComments(1, false);
        post.answerCount = (post.answerCount || 0) + 1;

        const findCommentAndAddReply = (commentsList, targetId, newReply) => {
          for (let i = 0; i < commentsList.length; i++) {
            const comment = commentsList[i];

            if (comment._id === targetId) {
              if (!comment.replies) comment.replies = [];

              comment.replies.push(newReply);
              return true;
            }

            if (comment.replies && comment.replies.length > 0) {
              const found = findCommentAndAddReply(
                comment.replies,
                targetId,
                newReply
              );
              if (found) return true;
            }
          }

          return false;
        };

        const updatedComments = [...comments];
        const added = findCommentAndAddReply(
          updatedComments,
          commentId,
          response.data
        );

        if (added) {
          setComments(updatedComments);
        } else {
          fetchComments();
        }
      } else {
        fetchComments();
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("Lỗi khi gửi phản hồi của bạn. Vui lòng thử lại.");
    } finally {
      setReplyLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      "General Health": "bg-blue-100 text-blue-700 border-blue-200",
      "Reproductive Health": "bg-pink-100 text-pink-700 border-pink-200",
      "STI Prevention": "bg-green-100 text-green-700 border-green-200",
      "Pregnancy & Family Planning":
        "bg-purple-100 text-purple-700 border-purple-200",
      "Menstrual Health": "bg-red-100 text-red-700 border-red-200",
      "Mental Health": "bg-indigo-100 text-indigo-700 border-indigo-200",
    };
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200";
  };
  const loadMoreComments = () => {
    if (!commentLoading && hasMoreComments) {
      console.log("Loading more comments, current page:", commentPage);
      fetchComments(commentPage + 1, true);
    }
  };

  const toggleExpandedComment = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  useEffect(() => {
    if (comments.length > 0) {
      let totalReplies = comments.length;

      comments.forEach((comment) => {
        if (comment.replies && Array.isArray(comment.replies)) {
          totalReplies += comment.replies.length;
        }
      });

      if (post) {
        post.answerCount = totalReplies;
      }
    }
  }, [comments, post]);

  // Edit post functionality
  const handleEditPost = (postId) => {
    setEditFormData({
      title: post.title,
      content: post.content,
    });
    setIsEditing(true);
  };

  const [errorMessage, setErrorMessage] = useState('');
  
  const handleUpdatePost = async () => {
    try {
      setErrorMessage('');
      
      const response = await api.put(`/posts/${post._id}/edit`, {
        title: editFormData.title,
        content: editFormData.content,
    
        accountId: currentUserId
      });
      
      if (response.data) {
        // Update the post in UI with the edited data
        post.title = editFormData.title;
        post.content = editFormData.content;
       
        post.editedAt = new Date();
        
        // Exit editing mode
        setIsEditing(false);
        
        // Show success notification or toast here if you have one
      }
    } catch (error) {
      console.error('Error updating post:', error);
      
      // Handle banned words error specifically
      if (error.response?.data?.hasBannedWords) {
        setErrorMessage('Your post contains language that violates our guidelines. Please modify the content before submitting.');
      } else {
        setErrorMessage(error.response?.data?.message || 'Không thể cập nhật bài viết. Vui lòng thử lại.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
    
    // Clear error messages when user makes changes
    if (errorMessage) {
      setErrorMessage('');
    }
  };

 

  const cancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-200 border-l-4 ${
        currentTab === "myPosts" && post.statusInfo?.isPending
          ? "border-l-yellow-300"
          : currentTab === "myPosts" && post.statusInfo?.isRejected
          ? "border-l-red-300"
          : "border-l-blue-100"
      }`}
    >
      <CardContent className="p-0">
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={
                    post.isAnonymous
                      ? "/avatar.jpg"
                      : post.accountId?.image || "/placeholder.svg"
                  }
                />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {post.isAnonymous
                    ? "A"
                    : post.accountId?.name
                    ? post.accountId.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">
                    {post.isAnonymous
                      ? "Ẩn danh"
                      : post.accountId?.name || "Anonymous"}
                  </h4>
                  {!post.isAnonymous && post.accountId?.isVerified && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 text-xs"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Verified Expert
                    </Badge>
                  )}

                  {/* Post status badge - only show in myPosts tab */}
                  {post.statusInfo && currentTab === "myPosts" && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        post.statusInfo.isPending
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : post.statusInfo.isApproved
                          ? "bg-green-50 text-green-700 border-green-200"
                          : post.statusInfo.isRejected
                          ? "bg-red-50 text-red-700 border-red-200"
                          : ""
                      }`}
                    >
                      {post.statusInfo.isPending && (
                        <Clock3 className="h-3 w-3 mr-1" />
                      )}
                      {post.statusInfo.isApproved && (
                        <Check className="h-3 w-3 mr-1" />
                      )}
                      {post.statusInfo.isRejected && <X className="h-3 w-3 mr-1" />}
                      {post.statusInfo.statusText}
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
            {currentTab === "myPosts" &&
              post.accountId?._id === currentUserId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                 <DropdownMenuContent align="end">
  {new Date().getTime() - new Date(post.createdAt).getTime() <= 15 * 60 * 1000 ? (
    <DropdownMenuItem onClick={() => handleEditPost(post._id)}>
      Edit Post
    </DropdownMenuItem>
  ) : (
    <div className="px-3 py-1 text-sm text-gray-400 cursor-default">
      Cannot edit
    </div>
  )}
</DropdownMenuContent>
                </DropdownMenu>
              )}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Badge className={getCategoryColor(post.category)}>
              {post.category}
            </Badge>
            {post.tags &&
              post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
          </div>

          {isEditing ? (
            <div className="space-y-4 mb-4">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung
                </label>
                <Textarea
                  name="content"
                  value={editFormData.content}
                  onChange={handleChange}
                  className="min-h-[150px]"
                />
              </div>
              
             
              
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={cancelEdit}>
                  Huỷ
                </Button>
                <Button onClick={handleUpdatePost}>
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                {post.title}
                {post.editedAt && (
                  <span className="text-xs font-normal text-gray-500 ml-2">
                    (edited)
                  </span>
                )}
              </h2>

              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {isExpanded
                    ? post.content
                    : post.content.length > 300
                    ? `${post.content.substring(0, 300)}...`
                    : post.content}
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
            </>
          )}
          </div>
       

        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center  bg-white rounded-full p-0 border shadow-sm hover:shadow-md transition-shadow duration-300">
                <Button
                  variant="ghost"
                  size="sm"
                  data-vote-type="up"
                  className={`h-8 w-25 p-0 transition-all duration-300 ease-in-out transform relative overflow-hidden ${
                    userVote === "up"
                      ? "text-white bg-gradient-to-r from-blue-500 to-blue-200 shadow-lg shadow-blue-200"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600  hover:shadow-md"
                  }`}
                  style={{
                    borderTopLeftRadius: "9999px",
                    borderBottomLeftRadius: "9999px",
                    borderRight: userVote === "up" ? "1px solid #4c4c4c" : "none",

                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onClick={() => handleVote("up")}
                >
                  <ChevronUp
                    className={`h-4 w-4 transition-all duration-300 ${
                      userVote === "up" ? "animate-none drop-shadow-sm" : ""
                    }`}
                    style={{
                      animation:
                        userVote === "up" ? "customPulse 2s infinite" : "none",
                    }}
                  />
                  <span className="ml-1 font-medium transition-all duration-300 drop-shadow-sm">
                    Upvote · {displayVoteUpCount}
                  </span>
                  {/* Ripple effect overlay */}
                  <div className="absolute inset-0 bg-white opacity-0 rounded-full transform scale-0 transition-all duration-400 pointer-events-none"></div>
                </Button>
                {/* <span
                  className={`px-2 font-medium ${
                    _displayVoteCount > 0 ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {_displayVoteCount}
                </span> */}
                <Button
                  variant="ghost"
                  size="sm"
                  data-vote-type="down"
                  className={`h-8 w-10 p-0 rounded-full transition-all duration-300 ease-in-out transform relative overflow-hidden ${
                    userVote === "down"
                      ? "bg-gradient-to-r from-red-200 to-red-500 text-white shadow-lg shadow-red-200"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600  hover:shadow-md"
                  }`}
                  style={{
                    borderTopRightRadius: "9999px",
                    borderBottomRightRadius: "9999px",
                    borderLeft: userVote === "down" ? "1px solid #4c4c4c" : "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onClick={() => handleVote("down")}
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-all duration-300 ${
                      userVote === "down" ? "animate-none drop-shadow-sm" : ""
                    }`}
                    style={{
                      animation:
                        userVote === "up" ? "customPulse 2s infinite" : "none",
                    }}
                  />
                  {/* Ripple effect overlay */}
                  <div className="absolute inset-0 bg-white opacity-0 rounded-full transform scale-0 transition-all duration-400 pointer-events-none"></div>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 w-4" />
                {comments.length > 0
                  ? comments.reduce((total, comment) => {
                      let count = 1;

                      if (comment.replies && Array.isArray(comment.replies)) {
                        count += comment.replies.length;
                      }
                      return total + count;
                    }, 0)
                  : post.answerCount || 0}{" "}
                replies
              </Button>

              {/* <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "Liked" : "Like"}
              </Button> */}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem
                    onClick={() => handleShare("copy")}
                    className="gap-2 cursor-pointer"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleShare("facebook")}
                    className="gap-2 cursor-pointer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Share on Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleShare("twitter")}
                    className="gap-2 cursor-pointer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleShare("email")}
                    className="gap-2 cursor-pointer"
                  >
                    <Mail className="h-4 w-4" />
                    Share via Email
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {(post.accountId?.role === "Counselor" &&
              post.accountId?.isVerified === true) ||
            post.hasExpertAnswer === true ? (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-700 font-medium"
              >
                <Award className="h-3 w-3 mr-1" />
                Expert Answer
              </Badge>
            ) : null}
          </div>
        </div>

        {showComments && (
          <div className="border-t bg-white">
            <div className="p-6 border-b bg-gray-50">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                    You
                  </AvatarFallback>
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
                    <p className="text-xs text-gray-500">
                      Be respectful and constructive in your response
                    </p>
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
            {loading ? (
              <div className="p-6 text-center text-gray-500">
                Loading comments...
              </div>
            ) : comments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              <div className="divide-y">
                {comments
                  .filter((comment) => comment.status === "approved")
                  .map((comment) => (
                    <div
                      key={comment._id}
                      className={`p-6 ${
                        comment.accountId?.role === "Counselor"
                          ? "bg-yellow-50 border-l-4 border-yellow-400 shadow-sm"
                          : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={comment.accountId?.image || "/placeholder.svg"}
                          />
                          <AvatarFallback
                            className={`text-sm ${
                              comment.accountId?.role === "Counselor"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {comment.accountId?.name
                              ? comment.accountId.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5
                              className={`font-medium ${
                                comment.accountId?.role === "Counselor"
                                  ? "text-yellow-800"
                                  : "text-gray-900"
                              }`}
                            >
                              {comment.accountId?.name || "Anonymous"}
                            </h5>
                            <span
                              className={`text-sm ${
                                comment.accountId?.role === "Counselor"
                                  ? "text-yellow-600 font-medium"
                                  : "text-gray-500"
                              }`}
                            >
                              {comment.accountId?.role === "Counselor"
                                ? "Expert"
                                : comment.accountId?.role || "Community Member"}
                            </span>
                            {comment.accountId?.role === "Counselor" && (
                              <Badge className="ml-1 bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200 font-semibold">
                                <Award className="h-3 w-3 mr-1" />
                                EXPERT ANSWER
                              </Badge>
                            )}
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p
                            className={`${
                              comment.accountId?.role === "Counselor"
                                ? "text-gray-800 font-medium"
                                : "text-gray-700"
                            } mb-3`}
                          >
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 px-2 text-xs ${
                                  comment.userVote === "up"
                                    ? "text-green-600"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleCommentVote(comment._id, "up")
                                }
                              >
                                <ChevronUp className="h-3 w-3 mr-1" />
                                {comment.displayVoteCount !== undefined
                                  ? comment.displayVoteCount
                                  : Math.max(
                                      0,
                                      (comment.voteUp?.length || 0) -
                                        (comment.voteDown?.length || 0)
                                    )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 px-2 text-xs ${
                                  comment.userVote === "down"
                                    ? "text-red-600"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleCommentVote(comment._id, "down")
                                }
                              >
                                <ChevronDown className="h-3 w-3 mr-1" />
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
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                            >
                              <Heart className="h-3 w-3 mr-1" />
                              Like
                            </Button>
                          </div>

                          {replyingTo === comment._id && (
                            <div className="mt-4 flex gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                  You
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <Textarea
                                  placeholder="Write your reply..."
                                  value={replyContent}
                                  onChange={(e) =>
                                    setReplyContent(e.target.value)
                                  }
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
                                    disabled={
                                      replyLoading || !replyContent.trim()
                                    }
                                    onClick={() =>
                                      handleSubmitReply(comment._id)
                                    }
                                  >
                                    {replyLoading ? "Submitting..." : "Reply"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                          {comment.replies &&
                            comment.replies.filter(
                              (reply) => reply.status === "approved"
                            ).length > 0 && (
                            <div className="mt-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs font-medium text-blue-600"
                                onClick={() =>
                                  toggleExpandedComment(comment._id)
                                }
                              >
                                {expandedComments[comment._id]
                                  ? "Hide Replies"
                                  : `Show All Replies (${
                                      comment.replies.filter(
                                        (reply) => reply.status === "approved"
                                      ).length
                                    })`}
                              </Button>
                            </div>
                          )}

                          {comment.replies &&
                            comment.replies.length > 0 &&
                            expandedComments[comment._id] && (
                              <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-4">
                                {comment.replies
                                  .filter(
                                    (reply) => reply.status === "approved"
                                  )
                                  .map((reply) => (
                                    <div key={reply._id} className="flex gap-3">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage
                                          src={
                                            reply.accountId?.image ||
                                            "/placeholder.svg"
                                          }
                                        />
                                        <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                                          {reply.accountId?.name
                                            ? reply.accountId.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                            : "U"}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h6 className="text-sm font-medium text-gray-900">
                                            {reply.accountId?.name ||
                                              "Anonymous"}
                                          </h6>
                                          {reply.accountId?.role ===
                                            "Counselor" && (
                                            <Badge
                                              variant="secondary"
                                              className="bg-green-100 text-green-700 text-xs"
                                            >
                                              <Shield className="h-3 w-3 mr-1" />
                                              Expert
                                            </Badge>
                                          )}
                                          <span className="text-xs text-gray-400">
                                            {formatDate(reply.createdAt)}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                          {reply.content}
                                        </p>

                                        <div className="flex items-center gap-4 mt-2">
                                          <div className="flex items-center gap-1">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className={`h-6 px-2 text-xs ${
                                                reply.userVote === "up"
                                                  ? "text-green-600"
                                                  : ""
                                              }`}
                                              onClick={() =>
                                                handleCommentVote(
                                                  reply._id,
                                                  "up"
                                                )
                                              }
                                            >
                                              <ChevronUp className="h-3 w-3 mr-1" />
                                              {reply.displayVoteCount !==
                                              undefined
                                                ? reply.displayVoteCount
                                                : Math.max(
                                                    0,
                                                    (reply.voteUp?.length ||
                                                      0) -
                                                      (reply.voteDown?.length ||
                                                        0)
                                                  )}
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className={`h-6 px-2 text-xs ${
                                                reply.userVote === "down"
                                                  ? "text-red-600"
                                                  : ""
                                              }`}
                                              onClick={() =>
                                                handleCommentVote(
                                                  reply._id,
                                                  "down"
                                                )
                                              }
                                            >
                                              <ChevronDown className="h-3 w-3 mr-1" />
                                            </Button>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2 text-xs"
                                            onClick={() =>
                                              setReplyingTo(reply._id)
                                            }
                                          >
                                            Reply
                                          </Button>
                                        </div>
                                        {reply.replies &&
                                          reply.replies.filter(
                                            (nestedReply) =>
                                              nestedReply.status === "approved"
                                          ).length > 0 && (
                                            <div className="mt-2">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-xs font-medium text-blue-600"
                                                onClick={() =>
                                                  toggleExpandedComment(
                                                    reply._id
                                                  )
                                                }
                                              >
                                                {expandedComments[reply._id]
                                                  ? "Hide Replies"
                                                  : `Show All Replies (${
                                                      reply.replies.filter(
                                                        (nestedReply) =>
                                                          nestedReply.status ===
                                                          "approved"
                                                      ).length
                                                    })`}
                                              </Button>
                                            </div>
                                          )}

                                        {reply.replies &&
                                          reply.replies.length > 0 &&
                                          expandedComments[reply._id] && (
                                            <div className="mt-3 pl-3 border-l-2 border-gray-100 space-y-3">
                                              {reply.replies
                                                .filter(
                                                  (nestedReply) =>
                                                    nestedReply.status ===
                                                    "approved"
                                                )
                                                .map((nestedReply) => (
                                                  <div
                                                    key={nestedReply._id}
                                                    className="flex gap-2"
                                                  >
                                                    <Avatar className="h-5 w-5">
                                                      <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                                                        {nestedReply.accountId
                                                          ?.name
                                                          ? nestedReply.accountId.name
                                                              .split(" ")
                                                              .map((n) => n[0])
                                                              .join("")
                                                          : "U"}
                                                      </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                      <div className="flex items-center gap-1 flex-wrap">
                                                        <span className="text-xs font-medium">
                                                          {
                                                            nestedReply
                                                              .accountId?.name
                                                          }
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                          {formatDate(
                                                            nestedReply.createdAt
                                                          )}
                                                        </span>
                                                      </div>
                                                      <p className="text-xs text-gray-700">
                                                        {nestedReply.content}
                                                      </p>
                                                    </div>
                                                  </div>
                                                ))}
                                            </div>
                                          )}

                                        {replyingTo === reply._id && (
                                          <div className="mt-3 flex gap-2">
                                            <Avatar className="h-6 w-6">
                                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                                You
                                              </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                              <Textarea
                                                placeholder="Write your reply..."
                                                value={replyContent}
                                                onChange={(e) =>
                                                  setReplyContent(
                                                    e.target.value
                                                  )
                                                }
                                                className="min-h-[50px] resize-none text-xs"
                                                disabled={replyLoading}
                                              />
                                              <div className="flex justify-end gap-1 mt-1">
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  className="h-6 text-xs px-2"
                                                  onClick={() => {
                                                    setReplyingTo(null);
                                                    setReplyContent("");
                                                  }}
                                                >
                                                  Cancel
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  className="h-6 text-xs px-2"
                                                  disabled={
                                                    replyLoading ||
                                                    !replyContent.trim()
                                                  }
                                                  onClick={() =>
                                                    handleSubmitReply(reply._id)
                                                  }
                                                >
                                                  Reply
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        )}
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

            {hasMoreComments && (
              <div className="p-6 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadMoreComments}
                  disabled={commentLoading}
                >
                  {commentLoading ? "Loading more..." : "Load more comments"}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
