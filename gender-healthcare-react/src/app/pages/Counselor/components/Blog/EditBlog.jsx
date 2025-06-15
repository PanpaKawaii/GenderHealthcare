import { useState, useEffect } from 'react';
import { blogAPI } from '../../../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditBlog() {
  const { id } = useParams(); // <-- lấy id từ URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Psychology");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageUrlModal, setShowImageUrlModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");

  // Load dữ liệu blog cũ
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await blogAPI.getById(id);
        const blog = res.data;

        setTitle(blog.title);
        setContent(blog.content);
        setAuthor(blog.author);
        setCategory(blog.category);
        setImage(blog.image);
      } catch (error) {
        console.error("Failed to load blog", error);
        alert("Failed to load blog");
        navigate("/"); // fallback nếu không load được
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const blogData = {
        title,
        content,
        author,
        category,
        image: typeof image === "string" ? image : null,
      };

      await blogAPI.update(id, blogData);
      alert("Blog updated successfully!");
      navigate("/counselor/blog"); // cập nhật đúng đường dẫn
    } catch (err) {
      alert("Failed to update blog!");
      console.error(err);
    }
  };

  const handleOpenImageUrlModal = () => {
    setImageUrlInput("");
    setShowImageUrlModal(true);
  };

  const handleConfirmImageUrl = () => {
    setImage(imageUrlInput);
    setShowImageUrlModal(false);
  };

  const handleCancelImageUrl = () => {
    setShowImageUrlModal(false);
  };

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Blog Post</h1>
          <p className="text-gray-600">Update your existing blog content.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Post Content</h2>

              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                <input
                  type="text"
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  style={{ minHeight: 100 }}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400"
                >
                  <option value="Psychology">Psychology</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Gender">Gender</option>
                  <option value="STI Testing">STI Testing</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="space-y-6 sticky top-6 z-10">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Publish Settings</h2>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  Update Post
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Thumbnail</h2>

                {!image && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 cursor-pointer">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={handleOpenImageUrlModal}
                    >
                      Upload Image
                    </button>
                  </div>
                )}

                {typeof image === "string" && (
                  <div className="mt-4">
                    <img src={image} alt="Thumbnail" className="w-full max-h-48 object-contain rounded" />
                    <p className="text-sm text-gray-500 break-all">{image}</p>
                    <button
                      type="button"
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      onClick={() => setImage(null)}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>

              {/* Image Modal */}
              {showImageUrlModal && (
                <div className="bg-opacity-40 flex items-center justify-center">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                    <h3 className="text-lg font-semibold mb-4">Enter Image URL</h3>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                        onClick={handleCancelImageUrl}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800"
                        onClick={handleConfirmImageUrl}
                        disabled={!imageUrlInput}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
