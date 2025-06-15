import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { blogAPI } from '../../../services/api';
import dayjs from 'dayjs';
import { FileEdit, Plus, Trash2, RefreshCcw } from "lucide-react";
import { Button } from '../../../components/ForumComponents/ui/button';

const categories = ["All categories", "Psychology", "Mental Health", "Gender", "STI Testing"];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [searchText, setSearchText] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    blogAPI.getAll().then(res => setBlogPosts(res.data)).catch(console.error);
  }, []);

  const filteredPosts = blogPosts.filter(post => {
    const matchCategory = selectedCategory === "All categories" || post.category === selectedCategory;
    const matchSearch = post.title.toLowerCase().includes(searchText.toLowerCase()) ||
      post.content.toLowerCase().includes(searchText.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await blogAPI.update(id, { status: newStatus });
      setBlogPosts(prev =>
        prev.map(post => post._id === id ? { ...post, status: newStatus } : post)
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-4xl font-medium mb-2">Blog Management</h1>
          <p className="text-gray-400">Create and manage your blog posts.</p>
        </div>
        <Link to="/counselor/newblog">
          <Button className="bg-gray-800 text-white flex gap-2">
            <Plus size={16} /> New Post
          </Button>
        </Link>
      </div>

      {/* Filter */}
      <div className="flex justify-between pb-8 flex-wrap gap-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-sm rounded-full border ${
                selectedCategory === cat
                  ? "bg-[#ebeef5] font-semibold border-gray-300"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-[250px]">
          <input
            type="text"
            placeholder="Search post..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="w-full px-4 pr-10 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {filteredPosts.slice(0, visibleCount).map(post => (
          <div
            key={post._id}
            onClick={() => navigate(`/counselor/blog/${post._id}`)}
            className={`rounded-lg border border-gray-300 cursor-pointer transition-opacity ${
              post.status === "deleted" ? "opacity-50" : ""
            }`}
          >
            <img src={post.image} alt={post.title} className="w-full h-52 object-cover rounded-t-lg" />
            <div className="p-5">
              <p className="text-sm text-gray-800">{post.category}</p>
              <h3 className="text-lg font-semibold line-clamp-2 min-h-15 mt-1 mb-2">{post.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 min-h-10 mb-4">{post.content}</p>
              <div className="flex justify-between text-sm text-gray-700">
                <span>{post.author}</span>
                <span>{dayjs(post.postedDate).format('MMM D, YYYY')}</span>
              </div>
            </div>
            <div className="px-4 flex justify-between gap-2 mb-4 space-y-2">
              <Link to={`/counselor/editblog/${post._id}`} onClick={e => e.stopPropagation()}>
                <Button variant="outline" size="sm" className="w-[100px]">
                  <FileEdit size={16} className="" /> Edit
                </Button>
              </Link>
              {post.status === "deleted" ? (
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-[100px]"
                  onClick={e => {
                    e.stopPropagation();
                    handleStatusChange(post._id, "active");
                  }}
                >
                  <RefreshCcw size={16} className="" /> Activate
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-[100px]"
                  onClick={e => {
                    e.stopPropagation();
                    if (window.confirm("Are you sure you want to delete this post?")) {
                      handleStatusChange(post._id, "deleted");
                    }
                  }}
                >
                  <Trash2 size={16} className="" /> Delete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {visibleCount < filteredPosts.length && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisibleCount(prev => prev + 4)}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-600"
          >
            More
          </button>
        </div>
      )}
    </div>
  );
}
