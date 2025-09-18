import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./App.css";

// Register chart.js components once
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  // Fetch posts and keywords
  const fetchData = () => {
    fetch("https://social-content-dashboard.onrender.com/api/posts/")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));

    fetch("https://social-content-dashboard.onrender.com/api/keywords/")
      .then((res) => res.json())
      .then((data) =>
        setKeywords(data.map((k) => ({ value: k.name, label: k.name })))
      )
      .catch((err) => console.error("Error fetching keywords:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      title,
      platform,
      url,
      keyword: selectedKeyword ? selectedKeyword.value : null,
    };

    if (editingPost) {
      // Update post
      fetch(`https://social-content-dashboard.onrender.com/api/posts/${editingPost.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })
        .then((res) => res.json())
        .then((data) => {
          setPosts(posts.map((p) => (p.id === editingPost.id ? data : p)));
          resetForm();
        })
        .catch((err) => console.error("Error updating post:", err));
    } else {
      // Create post
      fetch("https://social-content-dashboard.onrender.com/api/posts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })
        .then((res) => res.json())
        .then((data) => {
          setPosts([...posts, data]);
          resetForm();
        })
        .catch((err) => console.error("Error creating post:", err));
    }
  };

  // Delete a post
  const handleDelete = (id) => {
    fetch(`https://social-content-dashboard.onrender.com/api/posts/${id}/`, { method: "DELETE" })
      .then(() => setPosts(posts.filter((p) => p.id !== id)))
      .catch((err) => console.error("Error deleting post:", err));
  };

  // Edit a post
  const handleEdit = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setPlatform(post.platform);
    setUrl(post.url);
    setSelectedKeyword(
      post.keyword ? { value: post.keyword, label: post.keyword } : null
    );
  };

  // Reset form
  const resetForm = () => {
    setTitle("");
    setPlatform("");
    setUrl("");
    setSelectedKeyword(null);
    setEditingPost(null);
  };

  // Import external posts
  const handleImport = () => {
    fetch("https://social-content-dashboard.onrender.com/api/fetch-external-posts/", {
      method: "POST",
    })
      .then((res) => res.json())
      .then(() => fetchData())
      .catch((err) => console.error("Error importing posts:", err));
  };

  // Chart Data (Posts per Platform)
  const chartData = {
    labels: [...new Set(posts.map((p) => p.platform))],
    datasets: [
      {
        label: "Posts per Platform",
        data: [...new Set(posts.map((p) => p.platform))].map(
          (platform) => posts.filter((p) => p.platform === platform).length
        ),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Chart Data (Posts per Keyword)
  const keywordChartData = {
    labels: [...new Set(posts.map((p) => p.keyword).filter(Boolean))],
    datasets: [
      {
        label: "Posts per Keyword",
        data: [...new Set(posts.map((p) => p.keyword).filter(Boolean))].map(
          (keyword) => posts.filter((p) => p.keyword === keyword).length
        ),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  return (
    <div className="App">
      <header className="header">
        <h1>📊 Social Content Dashboard</h1>
      </header>

      <section className="form-section">
        <h2>{editingPost ? "Edit Post" : "Add a New Post"}</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Platform (e.g., Twitter)"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            required
          />
          <input
            type="url"
            placeholder="Post URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <CreatableSelect
            isClearable
            placeholder="Select or type a keyword"
            options={keywords}
            value={selectedKeyword}
            onChange={setSelectedKeyword}
          />

          <button type="submit" className="btn">
            {editingPost ? "Update Post" : "Add Post"}
          </button>
          {editingPost && (
            <button type="button" className="btn cancel" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>

        <button onClick={handleImport} className="btn import-btn">
          Import External Posts
        </button>
      </section>

      <section className="chart-section">
  <div className="chart-container">
    <h2>Posts per Platform</h2>
    <Bar
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            bottom: 30, // add space for labels
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 0,   // keep labels horizontal
              minRotation: 0,
              font: { size: 12 },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: { size: 12 },
            },
          },
        },
      }}
    />
  </div>

  <div className="chart-container">
    <h2>Posts per Keyword</h2>
    <Bar
      data={keywordChartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            bottom: 30,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 0, // keep straight
              minRotation: 0,
              font: { size: 12 },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: { size: 12 },
            },
          },
        },
      }}
    />
  </div>
</section>


      <main className="content">
        {posts.length > 0 ? (
          <div className="grid">
            {posts.map((post) => (
              <div className="card" key={post.id}>
                <h3>{post.title}</h3>
                <p>
                  <strong>Platform:</strong> {post.platform}
                </p>
                {post.keyword && (
                  <p>
                    <strong>Keyword:</strong> {post.keyword}
                  </p>
                )}
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  View Post
                </a>
                <div className="actions">
                  <button
                    onClick={() => handleEdit(post)}
                    className="btn edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="btn delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty">No posts available.</p>
        )}
      </main>
    </div>
  );
}

export default App;
