import React, { useState, useEffect } from "react";
import axios from "axios";
import PostForm from "./PostForm";
import PostList from "./PostList";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"; // Adjust as needed

function SchedulerDashboard(props) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    

    const fetchPosts = async () => {
        if (!props.user) {
            console.error('fetchPosts called but not logged in');
            return;
        }
        try {
            const token = await props.user.getIdToken();
            const response = await axios.get(`${API_URL}/api/posts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPosts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (props.user){
            fetchPosts();
        }
    }, [props.user]);

    const handlePostCreated = async (newPost) => {
        try {
            const token = await props.user.getIdToken();
            await axios.post(`${API_URL}/api/posts`, newPost, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchPosts();
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Check console for details.");
        }
    };

    const handleDeletePost = async (deletedPostId) => {
        try {
            const token = await props.user.getIdToken();
            await axios.delete(`${API_URL}/api/posts/${deletedPostId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchPosts();
        } catch (error) {
            console.error("Error deleting post:", error)
            alert("Failed to delete post. Check console for details.")
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-8 justify-center min-w-[350px]">
            <h1 className="text-4xl font-bold mb-8 roboto-slab-header flex items-center justify-center h-screen">Schedulr</h1>
            {!props.user ? (
                <p>Please log in to view your posts</p>
            ) : loading ? (
                <p>Loading posts ...</p>
            ) : (
                <>
                    <PostForm onPostCreated={handlePostCreated} />
                </>
            )}
            {!loading && posts && <PostList posts={posts} handleDeletePost={handleDeletePost} />}
            {/* {!loading && (!posts || posts.length === 0) && <p>No posts found. Schedule one!</p>} */}
        </div>
    );
}

export default SchedulerDashboard;