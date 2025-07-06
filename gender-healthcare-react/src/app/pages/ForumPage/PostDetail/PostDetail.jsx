import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PostCard } from "../../../components/ForumComponents/post-card";
import forumAPI from "../../../services/forumAPI";
import { Button } from "../../../components/ForumComponents/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        const response = await forumAPI.getPostById(postId);
        
        if (response.data && response.data.post) {
          setPost(response.data.post);
        } else {
          setError("Không tìm thấy bài viết");
        }
      } catch (err) {
        console.error("Error fetching post details:", err);
        setError(err.response?.data?.message || "Đã xảy ra lỗi khi tải bài viết");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostDetails();
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600"> Loading post details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4"> Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button asChild>
            <Link to="/forum" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return to Forum
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/forum" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return to Forum
            </Link>
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">Post Detail</h1>
        
        {post && <PostCard post={post} />}
      </div>
    </div>
  );
}
