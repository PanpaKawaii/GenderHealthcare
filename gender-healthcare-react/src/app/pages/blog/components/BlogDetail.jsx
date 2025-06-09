import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { blogAPI } from '../../../services/api';
import dayjs from 'dayjs';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await blogAPI.getById(id);
        setBlog(res.data);
        console.log(res.data);
      } catch (err) {
        setError('Failed to load blog.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!blog) return <div className="p-6">No blog found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
    <hr className="border-t border-gray-200 my-4" />
    <div className="text-sm text-gray-700 mb-4">
        By {blog.author} | {dayjs(blog.postedDate).format('MMM D, YYYY')}
      </div>
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-80 object-cover rounded-lg mb-6"
      />
      
      <div className="text-base text-gray-800 whitespace-pre-line leading-relaxed">
        {blog.content}
      </div>
    </div>
  );
}
