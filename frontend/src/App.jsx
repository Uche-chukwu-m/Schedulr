import { useState, useEffect } from "react";
import axios from 'axios';
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";

const API_URL = '/api';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/posts`)
    .then(response => {
      setPosts(response.data);
      setLoading(false);
      console.log("Fetched Posts:", response.data);
    })
    .catch(error => {
      console.error("Error fetching posts:", error);
      setLoading(false);
    });
  }, []); // This empty array means the effect runs once on mount

  const handlePostCreated = async (newPost) => {
    try {
      const response = await axios.post(`${API_URL}/posts`, newPost);
      setPosts(prevPosts => [response.data, ...prevPosts]);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Check console for details.");
    }
  }

  return (
    <div className="bg-gray-900 text-white min-h-screeen p-8 justify-center">
      <h1 className="text-4xl font-bold mb-8">Schedulr</h1>
      {/* {
        loading ? (
          <p>Loading posts ...</p>
        ) : (
          <pre>{JSON.stringify(posts, null, )}</pre>
        )} */}
        <PostForm onPostCreated={handlePostCreated} />
        <PostList posts={posts}/>
    </div>
  )
};

export default App;