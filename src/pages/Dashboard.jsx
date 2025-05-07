/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { User } from 'lucide-react';
import { ThumbsUp, MessageCircle } from 'lucide-react'; // Importing better icons

const Section = ({ title, subtitle, children, posterImage }) => (
  <section className="mb-6">
    {posterImage && (
      <div className="w-full h-[500px] mb-12 relative rounded-xl overflow-hidden">
        <img
          src={posterImage}
          alt="Poster"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-opacity-30 flex flex-col justify-end p-6">
          <h1 className="text-4xl font-bold text-white">{title}</h1>
          <p className="text-lg text-gray-200">{subtitle}</p>
        </div>
      </div>
    )}
    {children}
  </section>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('blogbazzar');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [tags, setTags] = useState(['New tag']);
  const [image, setImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [blogs, setBlogs] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageClick = () => fileInputRef.current.click();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handlePublish = () => {
    const newBlog = {
      title,
      content,
      image,
      category,
      isAnonymous,
      tags,
      date: selectedDate,
      id: Date.now(),
      likes: 0,
      comments: [],
    };
    setBlogs((prev) => [newBlog, ...prev]);
    setTitle('');
    setContent('');
    setImage(null);
    setCategory('');
    setTags(['New tag']);
    setIsAnonymous(false);
    setSelectedDate(new Date());
  };

  const handleLike = (id) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog.id === id ? { ...blog, likes: blog.likes + 1 } : blog
      )
    );
  };

  const handleComment = (id) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog.id === id
          ? { ...blog, comments: [...blog.comments, 'New Comment'] }
          : blog
      )
    );
  };

  const tabs = [
    {
      id: 'blogbazzar',
      label: 'Blog Bazzar',
      iconPath: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l2 2h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z',
      posterImage: 'https://wallpapercave.com/uwp/uwp4772511.jpeg',
    },
    {
      id: 'poochhobolo',
      label: 'Pooch Hobolo',
      iconPath: 'M12 20l-8-8 8-8',
      posterImage: 'https://via.placeholder.com/800x500?text=Pooch+Hobolo',
    },
    {
      id: 'samuhikcharcha',
      label: 'Samuhik Charcha',
      iconPath: 'M3 12h18M3 6h18M3 18h18',
      posterImage: 'https://via.placeholder.com/800x500?text=Samuhik+Charcha',
    },
    {
      id: 'kaaryakendra',
      label: 'Kaaryakendra',
      iconPath: 'M12 2L2 7l10 5 10-5-10-5z',
      posterImage: 'https://via.placeholder.com/800x500?text=Kaaryakendra',
    },
  ];

  return (
    <div>
      <div className="min-h-screen mt-20 bg-gray-100 text-gray-900 transition-colors duration-300">
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-40">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </header>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col w-60 min-h-screen border-r border-gray-300 bg-white">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full px-6 py-4 text-left hover:bg-blue-100 transition ${
                  activeTab === tab.id
                    ? 'bg-blue-200 text-blue-900 font-semibold'
                    : 'text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d={tab.iconPath} />
                  </svg>
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 space-y-10 pb-24">
            {tabs.map((tab) =>
              activeTab === tab.id ? (
                <Section
                  key={tab.id}
                  title={tab.label}
                  subtitle={`#Welcome to ${tab.label}`}
                  posterImage={tab.posterImage}
                >
                  {tab.id === 'blogbazzar' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Blog Write Section */}
                      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md space-y-4">
                        <h2 className="text-2xl font-bold">Write a Blog</h2>
                        <input
                          type="text"
                          placeholder="Blog Title"
                          className="w-full px-4 py-2 bg-gray-100 rounded-lg"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                          placeholder="Write your blog content..."
                          className="w-full px-4 py-2 bg-gray-100 rounded-lg h-32"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={handleImageClick}
                          className="text-sm text-blue-600 underline"
                        >
                          ＋ Add Image
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        {image && (
                          <img
                            src={image}
                            alt="Selected"
                            className="w-full h-48 object-cover rounded-lg mt-2"
                          />
                        )}
                        <div className="flex gap-2 flex-wrap text-sm">
                          {tags.map((tag, i) => (
                            <span
                              key={i}
                              className="bg-gray-300 px-3 py-1 rounded-full text-blue-900"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-2 bg-gray-100 rounded-lg"
                        >
                          <option>Select Category</option>
                          <option>Technology</option>
                          <option>Health</option>
                          <option>Lifestyle</option>
                        </select>
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => setSelectedDate(date)}
                          className="w-full px-4 py-2 bg-gray-100 rounded-lg"
                        />
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={() => setIsAnonymous(!isAnonymous)}
                            className="h-4 w-4"
                          />
                          Post anonymously
                        </label>
                        <div className="flex items-center gap-2 mt-4">
                          <User size={20} className="text-gray-600" />
                          <button
                            onClick={handlePublish}
                            className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition"
                          >
                            Publish Blog
                          </button>
                        </div>
                      </div>

                      {/* Blog List */}
                      <div className="flex flex-col gap-6">
                        {blogs.map((blog) => (
                          <div
                            key={blog.id}
                            className="bg-white rounded-lg shadow p-4 space-y-2"
                          >
                            {blog.image && (
                              <img
                                src={blog.image}
                                alt="Blog"
                                className="w-full h-32 object-cover rounded-md"
                              />
                            )}
                            <h3 className="text-lg font-semibold">
                              {blog.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {blog.content.slice(0, 80)}...
                            </p>
                            <div className="flex gap-2 flex-wrap text-xs text-blue-800">
                              {blog.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="bg-gray-200 px-3 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <button
                                onClick={() => handleLike(blog.id)}
                                className="flex items-center text-sm text-gray-600 hover:text-blue-500"
                              >
                                <ThumbsUp size={16} className="mr-1" />
                                {blog.likes} Likes
                              </button>
                              <button
                                onClick={() => handleComment(blog.id)}
                                className="flex items-center text-sm text-gray-600 hover:text-blue-500"
                              >
                                <MessageCircle size={16} className="mr-1" />
                                {blog.comments.length} Comments
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Section>
              ) : null
            )}
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-around items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex flex-col items-center ${
                activeTab === tab.id ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d={tab.iconPath} />
              </svg>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
