import React, {useState } from "react";

function PostForm({ onPostCreated }){
    const [platform, setPlatform] = useState('');
    const [content, setContent] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!content || !platform || !scheduledTime){
            alert('Please fill in all fields');
            return;
        };

        const newPost = {
            content,
            platform,
            scheduled_time: scheduledTime
        };

        onPostCreated(newPost);
        setContent('');
        setPlatform('Twitter');
        setScheduledTime('');
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg justify-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Schedule a New Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="content" className="block text-gray-300 text-sm font-bold mb-2">
                        Post Content:
                    </label>
                    <textarea 
                        id="content" 
                        className="shadow appearance-none border rounded w-full py-2 leading-tight text-gray-150"
                        rows="4"
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e => setContent(e.target.value))}
                        required
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label htmlFor="platform" className="block text-gray-300 text-sm font-bold mb-2">
                        Platform
                    </label>
                    <select 
                        id="platform"
                        className="shadow appearance-none border rounded w-full py-2 leading-tight text-gray-700"
                        value={platform}
                        onChange={(e => setPlatform(e.target.value))}
                        required
                    >
                        <option value="Twitter">Twitter</option>
                        <option value="Mastodon">Mastodon</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Facebook">Facebook</option>
                        <option value="LinkedIn">LinkedIn</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="scheduled_time" className="block text-gray-300 text-sm font-bold mb-2">
                        Scheduled Time:
                    </label>
                    <input 
                        id="scheduled_time" 
                        type="datetime-local" 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button 
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded w-full py-2 px-3 leading-light focus:outline-none my-3.5"
                    >
                        Schedule Post
                    </button>
                </div>
            </form>  
        </div>
    )
}
export default PostForm