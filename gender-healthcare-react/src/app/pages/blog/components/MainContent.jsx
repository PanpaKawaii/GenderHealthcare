import React from 'react'
import { useState, useEffect } from 'react';
import { blogAPI } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';


const categories = ["All categories", "Psychology", "Mental Health", "Gender", "STI Testing"];

export default function MainContent() {
    const [selectedCategory, setSelectedCategory] = useState("All categories");
    const [searchText, setSearchText] = useState("");
    const [blogPosts, setBlogPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState(blogPosts);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const fetchBlog = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await blogAPI.getAll();
            setBlogPosts(response.data);
            setFilteredPosts(response.data);
        } catch (err) {
            setError("Failed to load blogs.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlog();
    }, []);

    const filterPosts = (category, search) => {
        const filtered = blogPosts.filter(post => {
            const inCategory = category === "All categories" || post.category === category;
            const inSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
                post.content.toLowerCase().includes(search.toLowerCase());
            return inCategory && inSearch;
        });
        setFilteredPosts(filtered);
    };

    const handleSearch = () => {
        const filtered = blogPosts.filter(post => {
            const inCategory = selectedCategory === "All categories" || post.category === selectedCategory;
            const inSearch = post.title.toLowerCase().includes(searchText.toLowerCase()) ||
                post.content.toLowerCase().includes(searchText.toLowerCase());
            return inCategory && inSearch;
        });
        setFilteredPosts(filtered);
    };

    // Lấy 6 blog có postedDate gần nhất
    const latestPosts = [...blogPosts]
        .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
        .slice(0, 6);

    return (
        <div>
            <div className='text-5xl font-semibold py-4'>
                Blog
            </div>
            <p className='pb-8'>Stay in the loop with the latest about our products</p>
            {/* Category + Search */}
            <div className='pb-8 flex justify-between'>
                {/* Category */}
                <div>
                    {categories.map(ca => (
                        <button
                            key={ca}
                            onClick={() => {
                                setSelectedCategory(ca);
                                filterPosts(ca, searchText);
                            }}
                            className={`px-4 py-1.5 mr-4 text-sm cursor-pointer ${selectedCategory === ca ?
                                "bg-[#ebeef5] font-semibold border border-gray-300 rounded-full" : "text-gray-600 font-semibold rounded-full border border-transparent hover:bg-gray-100 "
                                }`}>
                            {ca}
                        </button>
                    ))} </div>
                {/* Search Bar */}
                <div className="relative w-[250px]">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full px-4 pr-10 py-2 border border-gray-300 rounded-md text-sm hover:border-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 
                                1.415-1.414l-3.85-3.85zm-5.242 1.106a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div className='card'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPosts.map(post => (
                        <div key={post._id}
                            onClick={() => navigate(`/blog/${post._id}`)}
                            className="rounded-lg border border-gray-300 cursor-pointer">
                            <img src={post.image} alt={post.title} className="w-full h-52 object-cover bg-gray-300 rounded-t-lg" />
                            <div className="p-5 ">
                                <p className="text-sm text-gray-800">{post.category}</p>
                                <h3 className="text-lg font-semibold min-h-14  line-clamp-2 text-ellipsis mt-1 mb-2">{post.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 min-h-10  line-clamp-2 text-ellipsis">{post.content}</p>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-800">{post.author}</span>
                                    <span className="text-gray-800">
                                        {dayjs(post.postedDate).format('MMM D, YYYY')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='latest'>
                <h2 className="text-5xl font-semibold py-4">Latest</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {latestPosts.map(post => (
                        <div key={post._id}
                            // onClick={() => navigate(`/blog/${post._id}`)}
                            className="rounded-lg  bg-gray-100 hover:bg-white">
                            <div className="p-4">
                                <p className="text-xs text-gray-600">{post.category}</p>
                                <h3 onClick={() => navigate(`/blog/${post._id}`)} className="text-base cursor-pointer font-semibold line-clamp-2 text-ellipsis mt-1 mb-2 flex items-center justify-between group">
                                    <span>{post.title}</span>
                                    <span className="text-lg text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">&rsaquo;</span>
                                </h3>
                                <div className='text-gray-600 text-sm mb-4 min-h-10  line-clamp-2 text-ellipsis'>{post.content}</div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-700">{post.author}</span>
                                    <span className="text-gray-700">
                                        {dayjs(post.postedDate).format('MMM D, YYYY')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
