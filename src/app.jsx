import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, Users, Plus, X, Send, Filter, Download } from "lucide-react";
import { databases, DATABASE_ID, POSTS_COLLECTION_ID } from "./config/appwrite";
import { storage, STORAGE_BUCKET_ID } from "./config/appwrite";
import { ID } from "appwrite";
import client from "./config/appwrite";

const categories = [
  "Government Services",
  "Brands & Products",
  "Social Issues",
  "Infrastructure",
  "Environment",
  "Healthcare",
  "Education",
  "Other",
];

export default function IssuesPlatform() {
  const [posts, setPosts] = useState([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [preview, setPreview] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [collabName, setCollabName] = useState("");

  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    category: "Government Services",
    author: "",
    location: "",
    image: "",
  });

  const [generatedPDF, setGeneratedPDF] = useState(null);

  // Parse string comments into array for UI
  const parseComments = (commentString) => {
    if (typeof commentString !== 'string' || !commentString) return [];
    return commentString.split(";").filter(Boolean).map((c, index) => {
      const [text, author, createdAt] = c.split("|");
      return { id: index + 1, text, author: author || "Anonymous User", createdAt: createdAt || new Date().toISOString() };
    });
  };

  // Parse string collaborators into array for UI
  const parseCollaborators = (collabString) => {
    if (typeof collabString !== 'string' || !collabString) return [];
    return collabString.split(",").filter(Boolean);
  };

  // Load posts from Appwrite
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await databases.listDocuments(DATABASE_ID, POSTS_COLLECTION_ID);
        const safePosts = res.documents.map((p) => ({
          ...p,
          comments: parseComments(p.comments),
          collaborators: parseCollaborators(p.collaborators),
          image: p.image || "",
          upvotes: p.upvotes || 0,
          hasUpvoted: false,
        }));
        setPosts(safePosts);
      } catch (err) {
        console.error("❌ Failed to fetch posts:", err);
        alert("Failed to load posts. Please try again.");
      }
    };
    fetchPosts();
  }, []);

  // Enhanced Groq call to extract rewritten text + authorities
  const callGroqRewrite = async (text) => {
    try {
      const GROQ_KEY = "${GROQ_AI_API_KEY}";
      if (!GROQ_KEY) throw new Error("Missing GROQ API key");

      const payload = {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a legal-drafting assistant. Using the inputs {DATE},{COMPLAINANT_NAME},{COMPLAINANT_ADDRESS},{COMPLAINANT_CONTACT},{RESPONSIBLE_AUTHORITIES_BLOCK},{SUBJECT_LINE},{INCIDENT_DATE},{LOCATION},{ISSUE_SUMMARY},{EVIDENCE_LIST},{APPLICABLE_LAWS},{RELIEF_SOUGHT}, generate one formal legal complaint document in English with headings: To, Subject, COMPLAINANT, BRIEF FACTS, PARTIES, EVIDENCE ATTACHED, LEGAL PROVISIONS, CONSEQUENCES, RELIEF SOUGHT, DECLARATION, signature block, and enclosures. Output only the complaint text.

}. Base the authorities on common ones for categories like Government Services (e.g., @municipality), Brands (e.g., @brandhandle). If unsure, suggest generic like @localgov.`,
          },
          { role: "user", content: text },
        ],
        max_tokens: 400,
        temperature: 0.2,
      };

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Groq error:", res.status, txt);
        throw new Error("Groq API error");
      }

      const data = await res.json();
      let response = data?.choices?.[0]?.message?.content;

      try {
        response = JSON.parse(response.replace(/```json\n?|\n?```/g, ""));
      } catch (e) {
        console.warn("JSON parse failed, falling back to raw:", response);
        return { rewritten: response, location: "", authorities: [] };
      }

      return response || { rewritten: text, location: "", authorities: [] };
    } catch (e) {
      console.error("callGroqRewrite error:", e);
      return { rewritten: text, location: "", authorities: [] };
    }
  };

  // Generalized backend call for tweet, PDF gen, email
  const postToBackend = async (action, payload) => {
    try {
      const res = await fetch("https://arush1234sharma-querio-backend.hf.space/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      if (!res.ok) throw new Error(`Backend error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(`${action} error:`, err);
      return { ok: false, error: err.message };
    }
  };

  // Handle image upload with preview
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return alert("Select an image first!");

    try {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      const uploaded = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), file);
      console.log("✅ Image uploaded:", uploaded);

      const publicUrl = `${client.config.endpoint}/storage/buckets/${STORAGE_BUCKET_ID}/files/${uploaded.$id}/view?project=${client.config.project}`;
      console.log("🖼️ Image URL:", publicUrl);

      setNewPost({ ...newPost, image: publicUrl });
    } catch (err) {
      console.error("❌ Image upload failed:", err);
      alert("Failed to upload image. Please try again.");
    }
  };

  // Handle upvote and persist to Appwrite
  const handleUpvote = async (postId) => {
    try {
      const post = posts.find((p) => p.$id === postId);
      if (!post) return;

      const newUpvotes = post.hasUpvoted ? post.upvotes - 1 : post.upvotes + 1;
      await databases.updateDocument(DATABASE_ID, POSTS_COLLECTION_ID, postId, {
        upvotes: newUpvotes,
      });

      setPosts(
        posts.map((p) =>
          p.$id === postId
            ? {
                ...p,
                upvotes: newUpvotes,
                hasUpvoted: !p.hasUpvoted,
              }
            : p
        )
      );
    } catch (err) {
      console.error("❌ Upvote failed:", err);
      alert("Failed to update upvote. Please try again.");
    }
  };

  // Handle comment addition and persist to Appwrite
  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;

    const newComment = {
      text: commentText.slice(0, 100),
      author: "Anonymous User",
      createdAt: new Date().toISOString(),
    };

    try {
      const post = posts.find((p) => p.$id === postId);
      const currentComments = parseComments(post.comments);
      const updatedComments = [...currentComments, newComment];
      const commentString = updatedComments
        .map((c) => `${c.text}|${c.author}|${c.createdAt}`)
        .join(";")
        .slice(0, 300);

      await databases.updateDocument(DATABASE_ID, POSTS_COLLECTION_ID, postId, {
        comments: commentString,
      });

      setPosts(
        posts.map((p) =>
          p.$id === postId
            ? { ...p, comments: parseComments(commentString) }
            : p
        )
      );
      setCommentText("");
    } catch (err) {
      console.error("❌ Comment failed:", err);
      alert("Failed to add comment. Please try again.");
    }
  };

  // Handle collaborator addition and persist to Appwrite
  const handleAddCollaborator = async (postId) => {
    if (!collabName.trim()) return;

    try {
      const post = posts.find((p) => p.$id === postId);
      if (parseCollaborators(post.collaborators).includes(collabName)) return;

      const updatedCollaborators = [...parseCollaborators(post.collaborators), collabName];
      const collabString = updatedCollaborators.join(",").slice(0, 300);

      await databases.updateDocument(DATABASE_ID, POSTS_COLLECTION_ID, postId, {
        collaborators: collabString,
      });

      setPosts(
        posts.map((p) =>
          p.$id === postId
            ? { ...p, collaborators: parseCollaborators(collabString) }
            : p
        )
      );
      setCollabName("");
    } catch (err) {
      console.error("❌ Collaborator failed:", err);
      alert("Failed to add collaborator. Please try again.");
    }
  };

  // Create post with tweet, PDF, email flow
  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.description || !newPost.author) {
      alert("Please fill title, description, and your name");
      return;
    }

    try {
      // 1) Call Groq to rewrite + extract authorities
      const groqRes = await callGroqRewrite(newPost.description);
      const { rewritten, location, authorities } = groqRes;

      // 3) Auto-tweet with tags
      const tweetText = `${newPost.title}\n\n${rewritten.substring(0, 200)} #IssueAlert ${
        authorities.map((a) => a.twitter.replace("@", "")).join(" ")
      }`;
      const tweetRes = await postToBackend("tweet", { text: tweetText });
      if (!tweetRes.ok) {
        console.warn("Tweet failed:", tweetRes.error);
      } else {
        console.log("Tweet posted:", tweetRes.tweet_id);
      }

      // 4) Generate legal PDF complaint with proper formatting
      const legalPrompt = `Generate a formal legal complaint document with the following EXACT structure and formatting:

[TOP RIGHT CORNER]
Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

[LEFT ALIGNED]
To,
${authorities.map(a => a.name).join('\n')}
${location}

Subject: Formal Complaint Regarding ${newPost.title}

Respected Sir/Madam,

[BODY - Use formal legal language]
I, ${newPost.author}, resident of ${location}, hereby lodge this formal complaint regarding the following matter:

1. BACKGROUND AND FACTS:
${rewritten}

2. NATURE OF GRIEVANCE:
[Elaborate on the specific issues, violations, or problems in formal legal language]

3. IMPACT AND CONSEQUENCES:
[Describe how this issue affects the complainant and/or public at large]

4. EVIDENCE:
[Mention that photographic/documentary evidence is attached if applicable]

5. LEGAL PROVISIONS (if applicable):
[Reference relevant laws, municipal codes, or regulations being violated]

6. RELIEF SOUGHT:
I respectfully request the following actions:
a) Immediate investigation into the matter
b) Prompt remedial action to address the issue
c) Regular updates on the progress of complaint resolution
d) Any other relief deemed fit by the authorities

7. CONCLUSION:
I trust that your esteemed office will take cognizance of this complaint and initiate appropriate action at the earliest. I am available for any further information or clarification that may be required.

Thanking you in anticipation of prompt action.

Yours faithfully,

${newPost.author}
${location}

[FOOTER]
Enclosures:
1. Photographic evidence (if applicable)
2. Supporting documents (if any)

Note: This is a formal legal complaint. Kindly acknowledge receipt and provide a reference number for tracking purposes.`;

      const pdfRes = await postToBackend("generate_pdf", {
        title: `Legal Complaint - ${newPost.title}`,
        content: legalPrompt,
        authorities,
      });

      console.log("PDF generation response:", pdfRes);

      // Check if PDF was generated successfully
      if (!pdfRes.ok || !pdfRes.pdf_base64) {
        console.error("PDF generation failed:", pdfRes);
        alert("Warning: PDF generation failed. Post will be created without PDF.");
      } else {
        // Store PDF for immediate download
        setGeneratedPDF({
          base64: pdfRes.pdf_base64,
          filename: pdfRes.filename || `${newPost.title}-complaint.pdf`,
        });
      }

      // 5) Email PDF to authorities (only if PDF was generated)
      if (pdfRes.ok && pdfRes.pdf_base64) {
        for (const auth of authorities) {
          if (!auth.email) continue;
          const emailRes = await postToBackend("send_email", {
            to: auth.email,
            subject: `Legal Complaint: ${newPost.title}`,
            body: `Dear ${auth.name},\n\nPlease find attached the legal complaint regarding ${newPost.title}.\n\n${rewritten}\n\nLocation: ${location}\n\nRegards,\n${newPost.author}`,
            attachment: pdfRes.pdf_base64,
            filename: pdfRes.filename,
          });
          if (!emailRes.ok) {
            console.warn(`Email to ${auth.email} failed:`, emailRes.error);
          } else {
            console.log(`Email sent to ${auth.email}`);
          }
        }
      }

      // 2) Save to Appwrite with image only (no PDF in DB)
      const docData = {
        title: newPost.title,
        description: rewritten,
        category: newPost.category,
        author: newPost.author,
        location: location || "",
        upvotes: 0,
      };

      // Only add image if it exists
      if (newPost.image) docData.image = newPost.image;

      const appwriteRes = await databases.createDocument(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        ID.unique(),
        docData
      );

      // 6) Update UI
      setPosts([
        {
          ...appwriteRes,
          comments: [],
          collaborators: [],
          hasUpvoted: false,
        },
        ...posts,
      ]);
      setShowNewPost(false);
      setNewPost({
        title: "",
        description: "",
        category: "Government Services",
        author: "",
        location: "",
        image: "",
      });
      setPreview(null);

      // Auto-download PDF if generated
      if (pdfRes.ok && pdfRes.pdf_base64) {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${pdfRes.pdf_base64}`;
        link.download = pdfRes.filename || `${newPost.title}-complaint.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert("✅ Post saved! Tweet sent, PDF downloaded & emailed to authorities.");
      } else {
        alert("✅ Post saved! Tweet sent (PDF generation failed).");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      alert(`Something went wrong: ${err.message}`);
    }
  };

  // Filtered posts
  const filteredPosts = filterCategory === "All" ? posts : posts.filter((p) => p.category === filterCategory);

  return (
    <div className="min-h-screen">
      <div className="relative min-h-screen overflow-hidden">
        <div className="lumin-landing-bg"></div>
        <header className="glass-effect shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowNewPost(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 button-gradient mt-8"
              >
                <Plus size={20} />
                Post Issue
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6 glass-effect p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={20} className="text-gray-600" />
              <span className="font-semibold text-white">Filter:</span>
              <button
                onClick={() => setFilterCategory("All")}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  filterCategory === "All" ? "bg-indigo-600 text-white" : "bg-black text-white hover:bg-gray-300"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm transition ${
                    filterCategory === cat ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            {filteredPosts.map((post) => (
              <div key={post.$id} className="glass-effect rounded-3xl shadow-md hover:shadow-lg transition p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-3xl text-sm font-medium">
                        {post.category}
                      </span>
                      <span className="text-white text-sm">
                        Posted {post.createdAt ? Math.floor((new Date() - new Date(post.createdAt)) / (1000 * 60 * 60 * 24)) : "0"} days ago
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">{post.title}</h2>
                    <p className="text-white mb-4">{post.description}</p>
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Issue"
                        className="mt-4 rounded-lg max-h-64 object-cover w-full"
                        onError={(e) => console.error("Failed to load image:", post.image)}
                      />
                    )}
                    {post.location && <p className="text-indigo-300 mb-2 mt-2">📍 Location: {post.location}</p>}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <span>
                        By <strong>{post.author}</strong>
                      </span>
                      {post.collaborators && post.collaborators.length > 0 && (
                        <span>
                          • {post.collaborators.length} collaborator{post.collaborators.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t">
                  <button
                    onClick={() => handleUpvote(post.$id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      post.hasUpvoted ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <ThumbsUp size={18} />
                    <span className="font-semibold">{post.upvotes || 0}</span>
                  </button>
                  <button
                    onClick={() => setSelectedPost(selectedPost === post.$id ? null : post.$id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  >
                    <MessageCircle size={18} />
                    <span>{(post.comments || []).length}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                    <Users size={18} />
                    <span>{(post.collaborators || []).length}</span>
                  </button>
                </div>

                {selectedPost === post.$id && (
                  <div className="mt-6 space-y-6 border-t pt-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Comments</h3>
                      <div className="space-y-3 mb-4">
                        {(post.comments || []).map((comment) => (
                          <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.author}</span>
                              <span className="text-xs text-gray-500">
                                {comment.createdAt ? Math.floor((new Date() - new Date(comment.createdAt)) / (1000 * 60)) : "0"}m ago
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
                          onKeyPress={(e) => e.key === "Enter" && handleAddComment(post.$id)}
                        />
                        <button
                          onClick={() => handleAddComment(post.$id)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Collaborators</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(post.collaborators || []).map((collab, idx) => (
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
                          onKeyPress={(e) => e.key === "Enter" && handleAddCollaborator(post.$id)}
                        />
                        <button
                          onClick={() => handleAddCollaborator(post.$id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                        >
                          <Users size={18} /> Join
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {showNewPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Post New Issue</h2>
                <button onClick={() => setShowNewPost(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={newPost.author}
                    onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    placeholder="Brief title describing the issue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Basic details</label>
                  <textarea
                    value={newPost.description}
                    onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 text-black"
                    placeholder="Briefly explain the issue, include exact location and responsible authority (AI will extract & tag)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {preview && (
                    <img src={preview} alt="Preview" className="mt-3 rounded-lg max-h-48 object-cover w-full" />
                  )}
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
    </div>
  );
}