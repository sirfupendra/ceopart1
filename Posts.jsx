import React, { useState, useEffect } from 'react';
import './Posts.css';

const Posts = () => {
  const [text, setText] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);

    if (file) {
      const fileType = file.type.split('/')[0];
      setMediaType(fileType);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('text', text);
    if (media) {
      formData.append('media', media);
      formData.append('mediaType', mediaType);
    }

    const response = await fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const newPost = await response.json();
      setPosts([newPost, ...posts]); // Add new post to the beginning of the list
      setText('');
      setMedia(null);
      setMediaType('');
      setShowForm(false);
    } else {
      alert('Error creating post');
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts/get');
      const data = await response.json();
      setPosts(data.reverse()); // Reverse to show the newest posts on top
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleDelete = async (postId) => {
    const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setPosts(posts.filter((post) => post._id !== postId));
      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost(null);
      }
    } else {
      alert('Error deleting post');
    }
  };

  useEffect(() => {
    fetchPosts(); // Fetch posts when the component mounts
  }, []);

  return (
    <div className="posts-container">
      <h1>EXPLORE THE POSTS</h1>
      <button onClick={toggleForm}>
        {showForm ? 'Cancel' : 'Create Post'}
      </button>

      {showForm && (
        <div className="create-post">
          <textarea
            placeholder="What's happening?"
            value={text}
            onChange={handleTextChange}
          />
          <input type="file" onChange={handleMediaChange} />
          <button onClick={handleSubmit}>Post</button>
        </div>
      )}

      {selectedPost ? (
        <div className="selected-post">
          <h2>Selected Post</h2>
          <p>{selectedPost.text}</p>
          {selectedPost.mediaType === 'image' && (
            <img
              src={`data:image/jpeg;base64,${selectedPost.media_file_base64}`}
              alt="Post media"
            />
          )}
          {selectedPost.mediaType === 'video' && (
            <video controls>
              <source
                src={`data:video/mp4;base64,${selectedPost.media_file_base64}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          )}
          <button onClick={() => setSelectedPost(null)}>Back to Posts</button>
        </div>
      ) : (
        <div className="posts-list">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={index} className="post" onClick={() => handlePostClick(post)}>
                <p>{post.text}</p>
                {post.mediaType === 'image' && (
                  <img
                    src={`data:image/jpeg;base64,${post.media_file_base64}`}
                    alt="Post media"
                  />
                )}
                {post.mediaType === 'video' && (
                  <video controls>
                    <source
                      src={`data:video/mp4;base64,${post.media_file_base64}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                )}
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(post._id);
                }}>
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Posts;
