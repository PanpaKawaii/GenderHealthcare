import React from 'react'
import { useState } from 'react';


export const blogPosts = [
    {
        id: 1,
        title: "Introducing Our New Product Line Introducing Our New Product Line",
        content: "We're excited to announce the launch of our brand new product line...",
        image: "https://picsum.photos/800/450?random=1",
        author: "Alice Nguyen",
        category: "Product",
        postedDate: "2025-06-01",
        lastEdited: "2025-06-03"
    },
    {
        id: 2,
        title: "Designing for Accessibility",
        content: "Accessibility is more than a feature, it's a fundamental right...",
        image: "https://picsum.photos/800/450?random=2",
        author: "David Tran",
        category: "Design",
        postedDate: "2025-05-15",
        lastEdited: "2025-05-16"
    },
    {
        id: 3,
        title: "Engineering Challenges We Overcame",
        content: "Here's how our engineering team tackled some tough issues. Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta aliquam quibusdam omnis illo sit labore quasi odio minus iusto, libero commodi, repudiandae dolore, mollitia numquam voluptates perferendis natus sapiente architecto.arem",
        image: "https://picsum.photos/800/450?random=3",
        author: "Linh Pham",
        category: "Engineering",
        postedDate: "2025-05-28",
        lastEdited: "2025-05-30"
    },
    {
        id: 4,
        title: "How We Built a Strong Company Culture",
        content: "Creating a thriving workplace takes intentional effort...",
        image: "https://picsum.photos/800/450?random=4",
        author: "Minh Le",
        category: "Company",
        postedDate: "2025-06-05",
        lastEdited: "2025-06-06"
    }
];

const categories = ["All categories", "Company", "Product", "Design", "Engineering"];

export default function MainContent() {
    const [selectedCategory, setSelectedCategory] = useState("All categories");
    const [searchText, setSearchText] = useState("");
    const [filteredPosts, setFilteredPosts] = useState(blogPosts);
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
                        <div key={post.id} className="rounded-lg border border-gray-300 cursor-pointer">
                            <img src={post.image} alt={post.title} className="w-full h-52 object-cover bg-gray-300 rounded-t-lg" />
                            <div className="p-5 ">
                                <p className="text-sm text-gray-800">{post.category}</p>
                                <h3 className="text-lg font-semibold min-h-14  line-clamp-2 text-ellipsis mt-1 mb-2">{post.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 min-h-10  line-clamp-2 text-ellipsis">{post.content}</p>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-800">{post.author}</span>
                                    <span className="text-gray-800">{post.postedDate}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}
