import { useState } from "react"
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


export function PostCard({ post }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
   const [userVote, setUserVote] = useState(post.voteType || null)
  const [voteCount, setVoteCount] = useState(post.votes)
  const [isLiked, setIsLiked] = useState(false)

  const handleVote = (type) => {
    if (userVote === type) {
      setUserVote(null)
      setVoteCount((prev) => (type === "up" ? prev - 1 : prev + 1))
    } else {
      const prevVote = userVote
      setUserVote(type)
      if (prevVote === null) {
        setVoteCount((prev) => (type === "up" ? prev + 1 : prev - 1))
      } else {
        setVoteCount((prev) => (type === "up" ? prev + 2 : prev - 2))
      }
    }
  }

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
                <AvatarImage src={post.authorAvatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {post.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{post.author}</h4>
                  {post.isExpertVerified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified Expert
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{post.authorRole}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3" />
                  <span>{post.timeAgo}</span>
                  <span>•</span>
                  <Eye className="h-3 w-3" />
                  <span>{post.views} views</span>
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
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs" >
                #{tag}
              </Badge>
            ))}
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{post.title}</h2>

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {isExpanded ? post.content : `${post.content.substring(0, 300)}...`}
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
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => setShowComments(!showComments)}>
                <MessageCircle className="h-4 w-4" />
                {post.replies} replies
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

            {post.isExpertVerified && (
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
                  />
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-gray-500">Be respectful and constructive in your response</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                      <Button size="sm" disabled={!newComment.trim()}>
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="divide-y">
              {post.comments.map((comment) => (
                <div key={comment.id} className="p-6">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-100 text-gray-700 text-sm">
                        {comment.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium text-gray-900">{comment.author}</h5>
                        <span className="text-sm text-gray-500">{comment.authorRole}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">{comment.timeAgo}</span>
                      </div>
                      <p className="text-gray-700 mb-3">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <ChevronUp className="h-3 w-3 mr-1" />
                            {comment.votes}
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          Reply
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <Heart className="h-3 w-3 mr-1" />
                          Like
                        </Button>
                      </div>

                      {/* Nested Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                                  {reply.author
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h6 className="text-sm font-medium text-gray-900">{reply.author}</h6>
                                  <span className="text-xs text-gray-400">{reply.timeAgo}</span>
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
          </div>
        )}
      </CardContent>
    </Card>
  )
}
