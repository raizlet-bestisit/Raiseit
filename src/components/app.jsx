import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, Users, Plus, X, Send, Filter } from 'lucide-react';

const categories = [
  'Government Services',
  'Brands & Products',
  'Social Issues',
  'Infrastructure',
  'Environment',
  'Healthcare',
  'Education',
  'Other'
];

export default function IssuesPlatform() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Poor Road Conditions in Downtown Area',
      description: 'The main street has multiple potholes causing accidents. Needs immediate attention.',
      category: 'Infrastructure',
      author: 'John Doe',
      upvotes: 45,
      comments: [],
      collaborators: ['John Doe'],
      createdAt: new Date('2025-09-28'),
      hasUpvoted: false
    },
    {
      id: 2,
      title: 'Long Wait Times at Government Office',
      description: 'Citizens waiting 3+ hours for basic document verification. Need better queue management.',
      category: 'Government Services',
      author: 'Sarah Smith',
      upvotes: 78,
      comments: [],
      collaborators: ['Sarah Smith'],
      createdAt: new Date('2025-09-27'),
      hasUpvoted: false
    }
  ]);

  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    category: 'Government Services',
    author: ''
  });

  const [commentText, setCommentText] = useState('');
  const [collabName, setCollabName] = useState('');

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.description || !newPost.author) return;

    const post = {
      id: Date.now(),
      ...newPost,
      upvotes: 0,
      comments: [],
      collaborators: [newPost.author],
      createdAt: new Date(),
      hasUpvoted: false
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', description: '', category: 'Government Services', author: '' });
    setShowNewPost(false);
  };

  const handleUpvote = (postId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          upvotes: p.hasUpvoted ? p.upvotes - 1 : p.upvotes + 1,
          hasUpvoted: !p.hasUpvoted
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId) => {
    if (!commentText.trim()) return;

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, {
            id: Date.now(),
            text: commentText,
            author: 'Anonymous User',
            createdAt: new Date()
          }]
        };
      }
      return p;
    }));
    setCommentText('');
  };

  const handleAddCollaborator = (postId) => {
    if (!collabName.trim()) return;

    setPosts(posts.map(p => {
      if (p.id === postId && !p.collaborators.includes(collabName)) {
        return {
          ...p,
          collaborators: [...p.collaborators, collabName]
        };
      }
      return p;
    }));
    setCollabName('');
  };

  const filteredPosts = filterCategory === 'All' 
    ? posts 
    : posts.filter(p => p.category === filterCategory);
  
  
const textGradient = 'text-gradient';
const buttonGradient = 'button-gradient';
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-gradient">
            <div>
              <h1 className="text-3xl font-bold text-gradient">RaizeIt</h1>
              <p className="text-gray-600 mt-1">Voice your concerns, drive change together</p>
            </div>
            <button
              onClick={() => setShowNewPost(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
            >
              <Plus size={20} />
              Post Issue
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={20} className="text-gray-600" />
            <span className="font-semibold text-gray-700">Filter:</span>
            <button
              onClick={() => setFilterCategory('All')}
              className={`px-4 py-2 rounded-full text-sm transition ${
                filterCategory === 'All'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  filterCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-3xl text-sm font-medium">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Posted {Math.floor((new Date() - post.createdAt) / (1000 * 60 * 60 * 24))} days ago
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>By <strong>{post.author}</strong></span>
                    {post.collaborators.length > 1 && (
                      <span>• {post.collaborators.length} collaborators</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <button
                  onClick={() => handleUpvote(post.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    post.hasUpvoted
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ThumbsUp size={18} />
                  <span className="font-semibold">{post.upvotes}</span>
                </button>
                <button
                  onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  <MessageCircle size={18} />
                  <span>{post.comments.length}</span>
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  <Users size={18} />
                  <span>{post.collaborators.length}</span>
                </button>
              </div>

              {/* Comments & Collaboration Section */}
              {selectedPost === post.id && (
                <div className="mt-6 space-y-6 border-t pt-6">
                  {/* Comments */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Comments</h3>
                    <div className="space-y-3 mb-4">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-gray-500">
                              {Math.floor((new Date() - comment.createdAt) / (1000 * 60))}m ago
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Collaborators */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Collaborators</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.collaborators.map((collab, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {collab}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={collabName}
                        onChange={(e) => setCollabName(e.target.value)}
                        placeholder="Your name to collaborate..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCollaborator(post.id)}
                      />
                      <button
                        onClick={() => handleAddCollaborator(post.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                      >
                        <Users size={18} />
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Post New Issue</h2>
              <button
                onClick={() => setShowNewPost(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={newPost.author}
                  onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                  className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Category
                </label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Title
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  placeholder="Brief title describing the issue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newPost.description}
                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 text-black"
                  placeholder="Provide detailed information about the issue..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNewPost(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Post Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}