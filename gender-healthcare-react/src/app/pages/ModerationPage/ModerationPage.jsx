import { useEffect, useState } from "react";
import forumAPI from "../../services/forumAPI";
import { Button } from "../../components/ForumComponents/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ForumComponents/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ForumComponents/ui/tabs";
import { Badge } from "../../components/ForumComponents/ui/badge";
import { formatDistance } from "date-fns";

export default function ModerationPage() {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [pendingComments, setPendingComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    fetchPendingContent();
  }, [activeTab]);

  const fetchPendingContent = async () => {
    setLoading(true);
    try {
      if (activeTab === "posts") {
        const response = await forumAPI.getPendingPosts();
        setPendingPosts(response.data || []);
      } else {
        const response = await forumAPI.getPendingComments();
        setPendingComments(response.data || []);
      }
    } catch (error) {
      console.error(`Error fetching pending ${activeTab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const approvePost = async (postId) => {
    try {
      await forumAPI.approvePost(postId);
      // Remove from list after approval
      setPendingPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error approving post:", error);
    }
  };

  const rejectPost = async (postId) => {
    try {
      await forumAPI.rejectPost(postId);
      // Remove from list after rejection
      setPendingPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error rejecting post:", error);
    }
  };

  const approveComment = async (commentId) => {
    try {
      await forumAPI.approveComment(commentId);

      setPendingComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error approving comment:", error);
    }
  };

  const rejectComment = async (commentId) => {
    try {
      await forumAPI.rejectComment(commentId);

      setPendingComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error rejecting comment:", error);
    }
  };

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
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Content Moderation Dashboard</h1>

      <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="posts">Pending Posts</TabsTrigger>
          <TabsTrigger value="comments">Pending Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <h2 className="text-xl font-semibold mb-4">
            Posts Awaiting Approval
          </h2>
          {loading ? (
            <p>Loading pending posts...</p>
          ) : pendingPosts.length === 0 ? (
            <Card>
              <CardContent className="py-4">
                <p className="text-center text-gray-500">
                  No pending posts to review!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingPosts.map((post) => (
                <Card key={post._id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{post.title}</CardTitle>
                        <p className="text-sm text-gray-500">
                          Posted {formatDate(post.createdAt)} by{" "}
                          {post.accountId?.name || "Anonymous"}
                        </p>
                      </div>
                      <Badge>{post.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{post.content}</p>
                    <div className="flex gap-2">
                      {post.tags &&
                        post.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            #{tag}
                          </Badge>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="destructive"
                        onClick={() => rejectPost(post._id)}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => approvePost(post._id)}
                      >
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="comments">
          <h2 className="text-xl font-semibold mb-4">
            Comments Awaiting Approval
          </h2>
          {loading ? (
            <p>Loading pending comments...</p>
          ) : pendingComments.length === 0 ? (
            <Card>
              <CardContent className="py-4">
                <p className="text-center text-gray-500">
                  No pending comments to review!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingComments.map((comment) => (
                <Card key={comment._id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        Comment by {comment.accountId?.name || "Anonymous"}{" "}
                        {formatDate(comment.createdAt)}
                      </p>
                      {comment.parentCommentId && (
                        <Badge variant="outline">
                          Reply to another comment
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{comment.content}</p>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="destructive"
                        onClick={() => rejectComment(comment._id)}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => approveComment(comment._id)}
                      >
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
