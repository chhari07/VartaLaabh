/* eslint-disable no-undef */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { supabase } from '/home/aman-kumar-chhari/Desktop/MERN/projects/Varta_laab-/forum/src/lib/supabaseClient';
import { Link } from "react-router-dom";
import { Share2 } from 'lucide-react'; // Lucide icon

const BlogBazzer = () => {
  // General states
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [popReactionId, setPopReactionId] = useState(null);
  const [popReactionEmoji, setPopReactionEmoji] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [newHashtag, setNewHashtag] = useState('');
  const [newCategories, setNewCategories] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [user, setUser ] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isBehindStory, setIsBehindStory] = useState(false);
  const [behindTitle, setBehindTitle] = useState('');
  const [behindContent, setBehindContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentBehindStory, setCurrentBehindStory] = useState({ title: '', content: '' });
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryContent, setNewStoryContent] = useState('');
  const [showFallback, setShowFallback] = useState(false);
  const shareUrl = window.location.href;

  // Fetch user info on mount and auth change
  useEffect(() => {
    const fetchUser  = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser ();
        if (error) throw error;
        if (user) {
          setUser (user);
          setEmail(user.email || '');
          setDisplayName(user.user_metadata?.full_name || '');
          setPhone(user.user_metadata?.phone || '');
          setDob(user.user_metadata?.dob || '');
          setGender(user.user_metadata?.gender || '');
          setBio(user.user_metadata?.bio || '');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser ();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser  = session?.user ?? null;
      setUser (currentUser );
      if (currentUser ) {
        setEmail(currentUser .email || '');
        setDisplayName(currentUser .user_metadata?.full_name || '');
        setPhone(currentUser .user_metadata?.phone || '');
        setDob(currentUser .user_metadata?.dob || '');
        setGender(currentUser .user_metadata?.gender || '');
        setBio(currentUser .user_metadata?.bio || '');
      } else {
        setEmail('');
        setDisplayName('');
        setPhone('');
        setDob('');
        setGender('');
        setBio('');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleCreatePost = () => {
    if (!newPost.trim() || !newTitle.trim()) return;

    let mediaUrl = null;
    let mediaType = null;

    if (newImage) {
      mediaUrl = URL.createObjectURL(newImage);
      const extension = newImage.name.split('.').pop().toLowerCase();
      mediaType = ['mp4', 'webm', 'ogg'].includes(extension) ? 'video' : 'image';
    }

    const newEntry = {
      id: Date.now(),
      title: newTitle,
      content: newPost,
      time: new Date().toISOString(),
      author: isAnonymous ? 'Anonymous' : (displayName || email || 'User '),
      mediaUrl,
      mediaType,
      likes: 0,
      reactions: {},
      comments: [],
      hashtags: newHashtag.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      categories: newCategories.split(',').map(cat => cat.trim()).filter(cat => cat.length > 0),
      behindStory: {
        title: newStoryTitle,
        content: newStoryContent,
      },
    };

    setPosts([newEntry, ...posts]);

    // Clear form inputs
    setNewPost('');
    setNewTitle('');
    setNewImage(null);
    setNewHashtag('');
    setNewCategories('');
    setNewStoryTitle('');
    setNewStoryContent('');
    setIsAnonymous(true);
    setActiveTab('feed');
  };

  // Function to handle viewing the behind story
  const handleViewBehindStory = (behindStory) => {
    setCurrentBehindStory(behindStory);
    setShowModal(true);
  };

  // Search functionality
  useEffect(() => {
    const results = posts.filter(post => {
      const tagsMatch = post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const categoriesMatch = post.categories.some(category => category.toLowerCase().includes(searchQuery.toLowerCase()));
      return tagsMatch || categoriesMatch;
    });
    setFilteredPosts(results);
  }, [searchQuery, posts]);

  // Toggle like count
  const toggleLike = (id) => {
    setPosts(posts.map(post =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  // Add a reaction emoji
  const addReaction = (id, emoji) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        const newReactions = { ...post.reactions };
        newReactions[emoji] = (newReactions[emoji] || 0) + 1;
        return { ...post, reactions: newReactions };
      }
      return post;
    }));

    setPopReactionId(id);
    setPopReactionEmoji(emoji);
    setTimeout(() => {
      setPopReactionId(null);
      setPopReactionEmoji(null);
    }, 600);
  };

  // Add comment to post
  const addComment = (id, comment) => {
    if (!comment.trim()) return;
    setPosts(posts.map(post => {
      if (post.id === id) {
        return { ...post, comments: [...post.comments, comment] };
      }
      return post;
    }));
  };

  const handleSubmit = async () => {
    const postData = {
      type: 'behind-story',
      title: behindTitle,
      content: behindContent,
    };

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert('Behind story submitted!');
        setBehindTitle('');
        setBehindContent('');
        setIsBehindStory(false);
        setShowModal(false);
      } else {
        alert('Submission failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Fetch AI comment
  const fetchAIComment = async (content) => {
    const response = await fetch('YOUR_AI_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_API_KEY`,
      },
      body: JSON.stringify({ prompt: content }),
    });

    const data = await response.json();
    return data.comment; // Adjust based on the API response structure
  };

  // Add AI comment to post
  const addAIComment = async (postId) => {
    const post = posts.find(p => p.id === postId);
    const aiComment = await fetchAIComment(post.content);
    addComment(postId, `AI: ${aiComment}`);
  };

  // Toggle bookmark
  const toggleBookmark = (id) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        const updatedPost = { ...post, isBookmarked: !post.isBookmarked };
        if (updatedPost.isBookmarked) {
          setBookmarkedPosts([...bookmarkedPosts, updatedPost]);
        } else {
          setBookmarkedPosts(bookmarkedPosts.filter(p => p.id !== id));
        }
        return updatedPost;
      }
      return post;
    }));
  };

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser (null);
  };

  // Update profile handler
  const handleUpdate = async () => {
    setLoading(true);
    setSuccess('');

    try {
      const updates = {
        data: {
          full_name: displayName,
          phone,
          dob,
          gender,
          bio,
        },
      };
      const { error } = await supabase.auth.updateUser (updates);
      if (error) throw error;

      setSuccess('Profile updated!');
      setShowSettings(false);
      setShowDetails(false);
    } catch (error) {
      console.error('Profile update error:', error);
    }
    setLoading(false);
  };

  // Function to toggle comment visibility
  const toggleComments = (id) => {
    setVisibleComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Updated handleShare function
  const handleShare = async (post) => {
    const shareData = {
      title: post.title,
      text: post.content,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Post shared successfully!');
      } catch (error) {
        console.error('Error sharing the post:', error);
      }
    } else {
      setShowFallback(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Blog Bazzar</h2>
          <p className="mb-4">Please log in to continue.</p>
          <a
            href="/login"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Log In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-[1700px] mx-auto">
        {/* Header Section */}
        <section
          className="relative w-full bg-cover bg-center h-64 md:h-96 rounded-3xl overflow-hidden mb-8 md:mb-10"
          style={{ backgroundImage: `url("https://i.pinimg.com/736x/81/0a/ec/810aecc8ad131aff091778d02e475271.jpg")` }}
        >
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-6 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide">Blog Bazzar</h1>
            <p className="text-md md:text-xl mt-3 max-w-lg">Write anonymously. Read freely. React openly.</p>
          </div>
        </section>

        {/* User Info and Logout */}
        <div className="flex justify-end items-center mb-4">
          <p className="text-gray-700 mr-4">
            Logged in as: <strong>{displayName || email}</strong>
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Layout */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Sidebar */}
          <aside className="flex bg-white border-black border-2 rounded-2xl md:flex-col lg:w-[400px] md:w-1/6 md:space-x-0 md:space-y-4 sticky top-20 md:self-start overflow-x-auto md:overflow">
            {[
              { icon: 'fas fa-home', label: 'Home', tab: 'feed' },
              { icon: 'fas fa-pen', label: 'Create Blog', tab: 'create' },
              { icon: 'fas fa-bell', label: 'Notifications', tab: 'notifications' },
              { icon: 'fas fa-bullhorn', label: 'Wall of the protest', tab: 'protest', route: '/protestwall' },
              { icon: 'fas fa-user', label: 'Profile', tab: 'profile' },
            ].map(({ icon, label, tab, route }) => (
              <Link
                key={label}
                to={route}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 md:gap-3 px-4 py-3 rounded-lg text-base md:text-lg font-medium transition whitespace-nowrap relative
                  ${activeTab === tab ? 'bg-black text-white shadow-lg' : 'text-gray-700 hover:bg-white'}
                  ${label === 'Wall of the protest' ? 'text-white bg-cover bg-center' : ''}
                `}
                style={
                  label === 'Wall of the protest'
                    ? {
                        backgroundImage:
                          'url("https://i.pinimg.com/736x/2f/c5/8d/2fc58dbad4543a1383ad34d35eb2bf91.jpg")',
                        backgroundBlendMode: 'overlay',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                      }
                    : {}
                }
              >
                <i className={icon} />
                <span className="z-10">{label}</span>
              </Link>
            ))}
          </aside>
          {/* Main Content */}
          
          <main className="flex-1 bg-white rounded-2xl p-6 shadow-lg max-w-4xl ">
            {activeTab === 'feed' && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Latest Blogs</h2>
                {posts.length === 0 ? (
                  <p className="text-gray-500">No posts yet. Create one!</p>
                ) : (
                  posts.map(post => (
                    <article
                      key={post.id}
                      className="mb-8 p-5 rounded-2xl border border-gray-300 shadow-md hover:shadow-lg transition"
                    >
                      <header className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold bg-black text-white pl-2 pr-2 rounded-3xl text-sm">{post.author}</h3>
                        <time className="text-xs bg-black pl-2 pr-2 rounded-3xl text-white">{new Date(post.time).toLocaleString()}</time>
                      </header>
                      <h4 className="font-bold text-xl mb-2">{post.title}</h4> {/* Display title */}
                      <p className="mb-3 whitespace-pre-wrap">{post.content}</p>
                      
                      {/* Flex container for image and reactions */}
                      <div className="flex flex-col md:flex-row items-start mb-3">
                        {post.mediaUrl && (
                          post.mediaType === 'video' ? (
                            <video
                              src={post.mediaUrl}
                              controls
                              className="w-full rounded-xl mb-3 max-h-96 object-contain"
                            />
                          ) : (
                            <img
                              src={post.mediaUrl}
                              alt="Post visual content"
                              className="w-full rounded-xl mb-3 max-h-96 object-contain"
                            />
                          )
                        )}

                        {/* Reactions section */}
                        <div className="flex lg:mr-12 flex-col gap-1">
                          {Object.entries(post.reactions).map(([emoji, count]) => (
                            <span key={emoji} className="text-sm bg-indigo-100 rounded-full px-2 py-3 ">
                              {emoji} {count}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Like & Reaction Section */}
                      <div className="flex flex-col md:flex-row items-center justify-between mb-2">
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                          <button
                            onClick={() => toggleLike(post.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 hover:bg-indigo-300 transition w-full md:w-auto"
                            aria-label="Like post"
                          >
                            <i className="fas fa-thumbs-up text-black" />
                            <span>{post.likes}</span>
                          </button>

                          <button
                            onClick={() => toggleComments(post.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 hover:bg-indigo-300 transition w-full md:w-auto"
                            aria-label="Comment on post"
                          >
                            <i className="fas fa-comment text-black" />
                            <span>{post.comments.length}</span>
                          </button>

                          <div className="relative inline-block">
                            {/* Share Button */}
                            <button
                              onClick={() => handleShare(post)}
                              className="flex items-center gap-2 p-3 bg-black                                    rounded-2xl text-white hover:bg-blue-700 transition"
                            >
                              <span className="text-lg">🔗</span>
                              Share
                            </button>

                            {/* Fallback UI */}
                            {showFallback && (
                              <div className="absolute mt-2 w-96 p-4 bg-white shadow-lg border rounded-2xl z-50">
                                {/* Close Button */}
                                <button
                                  onClick={() => setShowFallback(false)}
                                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-sm"
                                  aria-label="Close"
                                >
                                  ❌ Close
                                </button>

                                {/* Copy Section */}
                                <p className="text-sm text-gray-700 mb-2">Copy and share this link:</p>
                                <div className="flex items-center space-x-2">
                                  <input
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 px-2 py-1 border rounded text-sm"
                                  />
                                  <button
                                    onClick={handleCopy}
                                    className="bg-gray-200 hover:bg-gray-300 text-sm px-2 py-1 rounded"
                                  >
                                    Copy
                                  </button>
                                </div>

                                {/* Social Share Links in a Row */}
                                <div className="mt-4 flex space-x-4 text-sm">
                                  <a
                                    href={`https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-pink-600 hover:underline"
                                  >
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKPElEQVR4nO2YC1RVZRbHD6iQiq8alHvJB4iJGmCKTjq1fCuSAooPkGcSWE1WppMz2QypZS/NFDW1fDVOOipWSkvzURo+Uis1RPGBIPkEfAAXuDzu/c0633fuueJjxovOmjVrsdfaa13ud87e/9+397fP4SpKndVZndXZ/40F+eAa1LF41OAupq8H+ZWWB3U2WYf6mrhXH+RfRp8nzfTqV0n3YAtdQ60EhFjKuoZYcgJCLWv8QxnbeTQu/xXxQzuVhgX5lmTfKmqYTwmhbYoZ4VlEuOEGo1rdINzjuvisfhfatkhccyeggU+U8Yc+FXQbJmE0oNyAUMIemPBkBeehviUfqAmDO0qxYx65TkzDQuKd8xmv3Js/65xPdKNCca8aI7jjTTCdTPTrYSZwSLUO0jXUMkdRcLpvgGBf0+yw1kWMa3KV8U4FtwlLcL5MQqM8EpqfIeGRkyS0PMFz7lnyc7NsEhrmMd75yu1A9fKJbHaNsDbFNarSL7CcHkESJCDEMvu+xI9ucX1mfP2aolVBz7XKZPrwDL5b+xuXckowl1XjqJlNVi5kVrN9XhnTul8n3OMGQ7WqBHUy0efJCp4YbuGJEEJqJ16hXrxzwTUhusFFEo0ZJHXdxUt9vyX96zysFisPyqwW2LW4nAS3q4w03NCrMdivlJ4DKi/X6mA/q+QPS3joN5J8DjKh11Ym9N4ixJ8+ck0krTJXc2Dlaf4xcgcpfhv5yGfdXX12h/W83SmVNwO+4rXAzTzfewsv99/Gu8/tY8eaXCrNFhHz5O5KklwLiG5YyHAve2s93bvC8VZK9D50zCZcTTi5exo/r88RiYrOl7Jq6FZd4Mc+a1nkvYylXkv4rN1C4Uu8l7LQe4VYuxXow8fW8dbjG3m1R5qIPz06nauXy0XsXUtK5RlxKmBUS1mNgQFlPzsMkPTk1nOq8CndNvOu7wb+PmybaBt159cO2cjqtu+x6dEpbDck8oNH1L/xaLYZk/iq9VRWt32fBe1X1YB513cDU7pvZkZ0OpUVFpEj+alz+pmLcrtKcAdTpsMArwamlc3qlKonOrIqS+xQ7tKddxS6xyOKvR5R7POIFr7XI5r0u0Bt8XyJ/J/Oc+FQvh5/lm8qu9ecFTl2/jOXxA4HGO98WUDEuhZYHQaYowVO8f6cda3/RumpCyL4L0PeFMIOGGI4bIglwxjHCc94su7i6lqGZyy/GGP40WCHKjqQxfUfT7KmzUzmtf9C5Ppi1A6R4+LZEtFaSQG7SXA9LyAcBpjbfi2r27zH94Y4kbDaJHv0V5/EOwo+aYznlCGe3C4TuTb3a8zHzmEpNQtXPxd+vInT/hM57hkvYPYaovWK7DSM5/N2c0jxTxU5KkqreOn33wiICYE7xHPGYYCtxhf1BPsNMfrIswnObhnLxaZRFDaMpKheBKXKWMyjPsJaXHbXcWkpLuNC4gI9xlFjXA2QTY9O1q+d/dh6JgXKQz6h53bHAWx9fdQYK5LZ7EKzaIrqS8E3u3n0XLDKZ0P1pkOY+06ntHGscHO/GVRv+kkb+lYKYueLimWpIMZ4fjHE6q1lMzl+1zEpcLOAcBhA7fHjnnGyPTzj9MC6aKexmF1HUNVkGJbHIqBE2/l3lkGrgcKt7oOxtAii0m04ZpcRVE5bIxmKyijxSCKvRYxejUxjnDj8NlvmlSIhfNYzqUea4wC2wGfdY7nRIFIPXF5/FFVNh2F1H6QL5aPVcnHrPvAYAAbt+1tcBbJuOSgurZyRKjbiukskZ1rJjVLPls12ecTwmdcCvRK1ArjYNFrfcd1uFtX+aegRCNkn5VpyFIz1lh7uA8M7Ql9/6NYT2vaV94RPkVU4mk2Z0xgRu8QpgryHZTVsprbTLkMsS7wWCwiHAfIbRdn7+6ERdgCPgdC1JzzTyS62vFSuxT1u/+5WH9MeBneBngPltaYyURGzy0g9z6Um9jNw0BAjIL4zPMtC7+WOA9iCqu0ids5m6q7qwrwgrpX6ainXpjSDl52kT6wHLzwEic0g1gARXvKeeH95bYlJr2Rl45DbKq22035tQqkTsVYA1c2DZRK1r22miohsC4lN4WVneEWB80fkWkpf+fedXAVKaAFvj5PXns2U7adBqMPgZgC1ndRnxh6DnE4OA1Q108R79oegznYAVYS6wzZhryvww0xN1CZYoECKAh8r8KECyQpMuQnk2Dfy2tQUuRl9A+QGqZVwC9HT5LjL8f2rMbZ2AEK8cQAEa71uM5uQvygwR4FPFFjVEiqL5fqBN2CxUtM/0WC+naaNsiKY7GVvq/7+OoTNbtSP5JRRTqcDHtG1BBjwuL1lbDZJgfc1Uaq4pQp84QyH1PJr/+QUfAMHB0Nac1jbFDb3h3NpWgArrAiXm/BCQztEr241ANR2uuw2Tn9GOA7QvacMHNEO/uhiB5ivCV+iwIZ68J0r7NY8MwKqi7irVRTBtnCYq8BrWiUnNLYPhc69awCYnMaS3Uq2kuMAo9vLoEluMpG5REZe5gYrnGC7i134nkfgUBc40gsyw+DyKijNAkspVJug5DCcewd2GOFTJ7kBKsQkDSLhYZlrXDeZo7iU8gbhAiK/cVQtAdSAsR4ywasKXD0ug2/uCd/bhDeHw6ro0Lv7sRD4ORDS3eQ921zsEB9oAOpQiGoN00ZqIyhHTEBbFU4aatNCY7zLReuoCWYokDFPBs+bL4XsM8CxYE1oGGRFwenn4cwr0k89Dyci7CAZQ2Dv7+S937rIFlyswLSbWmnLSplj6QZxHsrqjRIQv7WIKnccINbjkgis9uoiBdb7y58PLOVw+Gk49owUporMngq5M+7sZybD8dFaNYbKqqkQqfUlQIpW4ff8oLICLNUwIkoAVDSSD7hC10iT4wATGp0RAG9rO/W5M1z8VO5Q5RU4MxGyoiE3WQpVe/zCQri4HC4th/MpkDtTruX8FU6MlRBH+0iAXa7wmdZK8/3g2jkZe9tq6O8nAGxtVOgScc5xgES3DwTAPA0grQGkN4XiQ9o0rISi/XBpGVxYBAVfQeHmml6wAfI+lBBn34DjYRJifxt58Hf2lq1ZbZYxT+2GaF8I76C9vQ6SB7nRuPmOAyQr9Zmi5Oqz3nZwM4Lh2lb7zH8QZrXAnkUw2RUi28mJpL29mhqMLrniPtrNYQABMV15XQCsdNKmTlP7ob24CIoPQNUNsDr+0yLVJWDKhIy5sM7P/roR5SkBOvUWAOZGIX+qlXgdYo6yXTxpbZPHdnBF38+6vW3u5Gp7iUM93d5G6U1kzOXaOfizBhBjkAB+vcB9wNz7Ei8AUJxY5/ylSKb2rpo8K0YKypt9bwCq2w708XAZY8/DEmClBvCGBqC+nqsA3Xuk3rf4GiAb6yeTbqisWYF37rECX9orkGmrgPZgW3FLBcYZy3iqa/IDFa9DfN/ZjUMBszjyVA7ZUy3kJMOVNf8Z4NIK+yQSD7Vg+2vIUqWK+UoVU5U0khpO50X32h3YOquzOqsz5X9h/wKr0arvUEq8rwAAAABJRU5ErkJggg==" alt="instagram-new--v1"></img>
                                  </a>

                                  <a
                                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title)}%20${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-green-500 hover:underline"
                                  >
                                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC+klEQVR4nO2ZSWhUQRCGP424K24J7oiCOyoeBAUVPAQEEQlxuehBD4ogBD3pyZjcNOjJmwt6EEXwIgriRUGiYkxEQVDcUC+iMZt7kpaCP9CMSd6bl2ReT5wfipmp6aqpf17339XvQQEFFNAXlADVQD3QBrgcWxvwGKhSLYmwFWhJoXjXg1kt5UlIdAZQvMuwzmzIlAR2JVyGNQPFcYhUB1Csi7BjcYg0BFCoizATgEi0BlCoizCb+pFweWKR+K+IVETkOJdFQV+A+Yo7kGsiP4FlveQYC7yIkec3sEExG4E/aUytZ8BIYAhww/NvV541QHvE5rZLY5cATWmukeOKmQ58lu8rMFv+qhh7wTTgXVprxMk6vKmxxfPfAYYCw4D73cRd0ZUcBTxIQML1NxGzD8AkxZ71/Aflm5exNz0ERovotYQk3EAQMbuq2DHeIjdBWC7/PvneeO14TR9IuIEiYrZT8as99XkqQTBcABbp/d4+knADScRUZ45yHPX8JzPyl2Ypsy7XRMzuAkVa5LWezFrxhvEJZNalQcTssPLM9c41H4HJ8p/OFyJ/gFXKtcfzm0IhxXqeD0ScCrWCDZc9/275VgK/8oHIW09mp2hqOe0ntq8YjoROpBlYqlwT9Vrq3cyolRgUSRyCJNIObFKedcB7YKo+n/LGmTwbZgGNIRLZrxwLvQJvqq8aATzxBME2TtQBB0WkRvEmsy8zvrOdvKtd/yHfK2Cc/JdCIXJdc97akXvdfP8NWKD8hzz/GfkmJGjlI5EtiTo1izZ9LvYy7hEwXF3vbc+/zVtTHWkRMVmdGeMQ1WU2xjDDO4g1atEbTqRBxPaEFYrZEfNesf3j6xVT5vlveYLQkEsiJrObNX6tzh5x/4DXah57wmLge66I2G2brsbwU4J1dT6ihopcr5E0LRKDhkhLAEW6GP1cJOoDKNT1x2OFOPtB2lY5GB69NemMEwvlAT8MLYtLwifTHNiVKCMhinWzuS6lR3Kt+u3KbKZTAQUUwD/4C68XAvRNax0sAAAAAElFTkSuQmCC" alt="twitterx--v1"></img>
                                  </a>

                                  <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-blue-700 hover:underline"
                                  >
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAByElEQVR4nO2ZP0/CQBjG22scXI2Tiauy+glc3MC4+iX8DA6G9IiDJsYBBhdNHJwcNRGIHY3xjoBCgkTEAUP8A63yt7ymBVQEIq2mvSb3JM/UN5fnd+97N1wFgYuLi4tpSTJdQTKJI5lqCFNwxDLVRExjkkyW/xRexAQ7FhoPt4hJ0P7OuxwedS2FSMAygDk2DIRHRhdkGrUOgInqdnDUs0wqNgAYCI6//G8AvkgazgsaaA0dlIIG8+G0twCUggbfFb/XvAWgNfQ+ALWuewtA8XoHfJG0CWF0IpZXYS584y0A5JIFDoA7OzFM43yf3b2G7YsSpEpVqDbb8FprmaO4dvoAk5sJtgEW9jLw+NaEUbosvsPMTopdgOxLHX5TLK+CxCrAuPIf5dgE0Ntgzv/S4S2sHucheqcOrdtPPrMJsK4U+2omQgk4yVUG6jJPNTYBpreTA+ssHmQH6sq1FnsA7R/fe57aSo5d63oH7K6FOADmHTDFRwjzQ0z5LYT4NWpRo24Otyx4+mkR07JlAON9noHgYFjE9MwygPFzwe3gqGsJX/ktA3S6QIJuhxcx2bAV/rMTIRIw3uedPRNENcbG9s5zcXFxCU7pA5Jwntel+S2tAAAAAElFTkSuQmCC" alt="linkedin"></img>
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={async () => {
                              const aiComment = await fetchAIComment(post.content);
                              addComment(post.id, `AI: ${aiComment}`);
                            }}
                            className="bg-white text-black px-4 py-2 rounded-3xl transition flex items-center w-full md:w-auto"
                          >
                            <span className="mr-2">
                              <img src='https://img.icons8.com/?size=50&id=POBc2SrrhhnF&format=png&color=000000' alt="AI emoji" className="w-6 h-6" />
                            </span>
                            AI Comment
                          </button>

                          <div className="flex gap-2 mt-2 md:mt-0">
                            {['👍', '❤️', '😂', '😮', '😢', '😡'].map(emoji => (
                              <button
                                key={emoji}
                                onClick={() => addReaction(post.id, emoji)}
                                className="text-2xl hover:scale-110 transition-transform duration-200"
                                aria-label={`React with ${emoji}`}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {showDetails && isBehindStory && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
                            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-fadeIn relative">
                              <button
                                onClick={() => setShowDetails(false)}
                                className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
                                aria-label="Close"
                              >
                                &times;
                              </button>
                              <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-3">
                                {behindTitle}
                              </h2>

                              <p className="text-gray-700 text-sm sm:text-base whitespace-pre-line">
                                {behindContent}
                              </p>

                              <button
                                onClick={() => setShowDetails(false)}
                                className="mt-6 w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-md hover:from-red-600 hover:to-red-700 transition-colors duration-200"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => toggleBookmark(post.id)}
                          className={`flex items-center justify-center px-4 py-2 rounded-full ${post.isBookmarked ? 'bg-white' : 'bg-white'} transition mt-2 md:mt-0`}
                          aria-label="Bookmark post"
                        >
                          {post.isBookmarked ? (
                            <img src='https://img.icons8.com/?size=50&id=26083&format=png&color=000000' alt='Saved Icon' className="w-11 h-9" />
                          ) : (
                            <img src='https://img.icons8.com/?size=50&id=25157&format=png&color=000000' alt='Unsaved Icon' className="w-11 h-9" />
                          )}
                        </button>
                      </div>

                      {/* Reactions */}
                      <div className="flex gap-4 items-baseline-last">
                        {/* Pop reaction animation */}
                        {popReactionId === post.id && popReactionEmoji && (
                          <span
                            className="absolute bg-indigo-500 rounded-full top-0 -right-8 animate-pop text-3xl"
                            aria-hidden="true"
                          >
                            {popReactionEmoji}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.hashtags.map((tag, index) => (
                          <span
                            key={`hashtag-${post.id}-${index}`}
                            className="bg-black text-white p-1 mr-2 rounded-2xl text-sm justify-center"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      
                      {/* Display categories of blog */}
                      <div className="flex flex-wrap gap-2">
                        {post.categories.map((category, index) => (
                          <span
                            key={`category-${post.id}-${index}`}
                            className="bg-black text-white p-1 rounded-2xl text-sm justify-center"
                          >
                            {category}
                          </span>
                        ))}
                      </div>

                      {/* Show comments if visible */}
                      {visibleComments[post.id] && (
                        <div>
                          <div className="mb-2">
                            {post.comments.length === 0 ? (
                              <p className="text-sm text-gray-400 italic">No comments yet.</p>
                            ) : (
                              post.comments.map((comment, i) => (
                                <p key={i} className="text-sm border-b border-gray-100 py-1">
                                  {comment}
                                </p>
                              ))
                            )}
                          </div>

                          <form
                            onSubmit={e => {
                              e.preventDefault();
                              addComment(post.id, commentInputs[post.id] || '');
                              setCommentInputs({ ...commentInputs, [post.id]: '' });
                            }}
                            className="flex gap-2"
                          >
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              className="flex-grow border border-gray-300 rounded-full px-4 py-1"
                              value={commentInputs[post.id] || ''}
                              onChange={e =>
                                setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                              }
                            />
                            <button
                              type="submit"
                              className="bg-indigo-600 text-white px-4 rounded-full hover:bg-indigo-700 transition"
                            >
                              Post
                            </button>
                          </form>
                        </div>
                      )}
                    </article>
                  ))
                )}
              </section>
            )}
            {activeTab === 'create' && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Create a New Blog</h2>

                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Blog Title"
                  className="w-full p-4 mb-4 rounded-lg border border-gray-300"
                />

                <textarea
                  value={newPost}
                  onChange={e => setNewPost(e.target.value)}
                  placeholder="Write your thoughts here..."
                  rows={6}
                  className="w-full p-4 mb-4 rounded-lg border border-gray-300 resize-none"
                />

                <div className="flex items-center mb-4 gap-4">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={e => setNewImage(e.target.files?.[0] || null)}
                    className="block"
                  />
                  {newImage && (
                    <img
                      src={URL.createObjectURL(newImage)}
                      alt="Preview"
                      className="h-20 w-auto rounded-md border border-gray-300"
                    />
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-2">Categories</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={newCategories}
                    onChange={e => setNewCategories(e.target.value)}
                  >
                    <option value="Our Nation">Our Nation</option>
                    <option value="myth">Myth and mythology</option>
                    <option value="Finance & Investment">Finance & Investment</option>
                    <option value="Tech & Gadgets">Tech & Gadgets</option>
                    <option value="Health & Fitness">Health & Fitness</option>
                    <option value="Education & Career">Education & Career</option>
                    <option value="Travel & Lifestyle">Travel & Lifestyle</option>
                    <option value="Food & Recipe">Food & Recipe</option>
                    <option value="Fashion & Beauty">Fashion & Beauty</option>
                    <option value="Digital Marketing & Blogging">Digital Marketing & Blogging</option>
                    <option value="Personal Development">Personal Development</option>
                    <option value="Entertainment & Pop Culture">Entertainment & Pop Culture</option>
                  </select>
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    value={newHashtag}
                    onChange={e => setNewHashtag(e.target.value)} // ✅ Correct function
                    placeholder="Add hashtags (optional)"
                    className="w-full p-4 rounded-lg border border-gray-300"
                  />
                </div>

                <label className="inline-flex items-center gap-2 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={() => setIsAnonymous(!isAnonymous)}
                    className="form-checkbox"
                  />
                  Post anonymously
                </label>

                <br />
                <input
                  type="text"
                  placeholder="Behind Story Title"
                  value={newStoryTitle}
                  onChange={(e) => setNewStoryTitle(e.target.value)}
                  className="w-full p-4 mb-4 rounded-lg border border-gray-300"
                />

                <textarea
                  placeholder="Behind Story Content"
                  value={newStoryContent}
                  onChange={(e) => setNewStoryContent(e.target.value)}
                  className="w-full p-4 mb-4 rounded-lg border border-gray-300 resize-none"
                  rows={6}
                />

                <button
                  onClick={handleCreatePost}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                  disabled={!newPost.trim() || !newTitle.trim()}
                >
                  Publish
                </button>
              </section>
            )}

            {activeTab === 'notifications' && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                <p className="text-gray-500 italic">No notifications available yet.</p>
              </section>
            )}

            {activeTab === 'profile' && (
              <section>
                <h2 className="text-2xl m-11shadow-2xl font-bold mb-6">Your Profile</h2>

                <div className="mb-6 text-white rounded-2xl p-5 bg-black border-4">
                  <p>
                    <strong>Name:</strong> {displayName || '(not set)'}
                  </p>
                 
                  <p>
                    <strong>Bio:</strong> {bio || '(not set)'}
                  </p>
                
                  {showDetails && (
                    <>
                      <p>
                        <strong>Phone:</strong> {phone || '(not set)'}
                      </p>
                      <p>
                        <strong>DOB:</strong> {dob || '(not set)'}
                      </p>
                      <p>
                        <strong>Gender:</strong> {gender || '(not set)'}
                      </p>
                      <p>
                        <strong>Bio:</strong> {bio || '(not set)'}
                      </p>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-indigo-600 mr-20 hover:underline mb-6"
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </button>

                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  {showSettings ? 'Cancel Edit' : 'Edit Profile'}
                </button>

                {showSettings && (
                  <form
                    onSubmit={async e => {
                      e.preventDefault();
                      await handleUpdate();
                    }}
                    className="mt-6 max-w-md"
                  >
                    <label className="block mb-2">
                      Full Name
                      <input
                        type="text"
                        className="w-full p-2 border rounded mt-1"
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                      />
                    </label>

                    <label className="block mb-2">
                      Phone
                      <input
                        type="tel"
                        className="w-full p-2 border rounded mt-1"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                      />
                    </label>

                    <label className="block mb-2">
                      Date of Birth
                      <input
                        type="date"
                        className="w-full p-2 border rounded mt-1"
                        value={dob}
                         onChange={e => setDob(e.target.value)}
                      />
                    </label>

                    <label className="block mb-2">
                      Gender
                      <select
                        className="w-full p-2 border rounded mt-1"
                        value={gender}
                        onChange={e => setGender(e.target.value)}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </label>

                    <label className="block mb-4">
                      Bio
                      <textarea
                        className="w-full p-2 border rounded mt-1 resize-none"
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        rows={4}
                        placeholder="Write a short bio about yourself"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition"
                    >
                      {loading ? 'Updating...' : 'Save Changes'}
                    </button>

                    {success && (
                      <p className="mt-4 text-green-600 font-semibold">{success}</p>
                    )}
                  </form>
                )}
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BlogBazzer;
