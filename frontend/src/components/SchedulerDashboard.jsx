import React, { useState, useEffect } from "react";
import axios from "axios";
import PostForm from "./PostForm";
import PostList from "./PostList";

const API_URL = "/api"; // Adjust as needed

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
            const response = await axios.get(`${API_URL}/posts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPosts(response.data);
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
            const response = await axios.post(`${API_URL}/posts`, newPost, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPosts(prevPosts => [response.data, ...prevPosts]);
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Check console for details.");
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-8 justify-center">
            <h1 className="text-4xl font-bold mb-8">Schedulr</h1>
            {loading ? (
                <p>Loading posts ...</p>
            ) : (
                <>
                    <PostForm onPostCreated={handlePostCreated} />
                    <PostList posts={posts} />
                </>
            )}
        </div>
    );
}

export default SchedulerDashboard;