import { useState, useEffect } from 'react';
import { blogAPI } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";

// import dayjs from 'dayjs';

export default function EditBlog() {
const { id } = useParams();
const [blogPost, setBlogPost] = useState(null);
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState(null)
  const navigate = useNavigate();
  const counselorId = localStorage.getItem("UserId");


  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const blogData = {
  title,
  content,
  author,
  category,
  image: typeof image === "string" ? image : null,
  counselorId,
};
console.log(blogData);
    const res = await blogAPI.create(blogData);
    alert("Blog created successfully!");
    navigate("/your-blog-list-page"); // change to your actual blog list route
  } catch (err) {
    alert("Failed to create blog!");
    console.error(err);
  }
};

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  // State to control the image URL modal
  const [showImageUrlModal, setShowImageUrlModal] = useState(false)
  const [imageUrlInput, setImageUrlInput] = useState("")

  // Handle open modal
  const handleOpenImageUrlModal = () => {
    setImageUrlInput("")
    setShowImageUrlModal(true)
  }

  // Handle confirm URL
  const handleConfirmImageUrl = () => {
    setImage(imageUrlInput)
    setShowImageUrlModal(false)
  }

  // Handle cancel modal
  const handleCancelImageUrl = () => {
    setShowImageUrlModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Blog Post</h1>
          <p className="text-gray-600">Write and publish your blog post</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Post Content</h2>

              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your blog post title..."
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter the author's name..."
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog post content here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  style={{ minHeight: 80, overflow: "hidden" }}
                  required
                  rows={1}
                  onInput={e => {
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                />
              </div>
             
                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-transparent outline-none"
                  >
                    <option value="Psychology">Psychology</option>
                    <option value="Mental Health">Mental Health</option>
                    <option value="Gender">Gender</option>
                    <option value="STI Testing">STI Testing</option>
                  </select>
                </div>
              </div>
          </div>
          <div>
            <div className="space-y-6 sticky top-6 z-10 ">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Publish Settings</h2>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors"
                    >
                      Save Draft
                    </button>
                    <button
                      type="button"
                      className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors"
                    >
                      Preview
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                  >
                    Publish Now
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Thumbnail</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium
                       text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                      onClick={handleOpenImageUrlModal}
                    >
                      Upload Image
                    </button>
                  </div>
                </div>
                {typeof image === "string" && image && (
                  <div className="mt-4">
                    <img src={image} alt="Selected" className="w-full max-h-48 object-contain rounded" />
                    <p className="text-sm text-gray-500 break-all">Selected Image URL: {image}</p>
                    <button
                      type="button"
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      onClick={() => setImage(null)}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                {typeof image === "object" && image && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Selected Image: {image.name}</p>
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
              {/* Modal for entering image URL */}
              {showImageUrlModal && (
                <div className=" flex items-center justify-center bg-opacity-40">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                    <h3 className="text-lg font-semibold mb-4">Enter Image URL</h3>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrlInput}
                      onChange={e => setImageUrlInput(e.target.value)}
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
                        className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-700"
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
  )
}
