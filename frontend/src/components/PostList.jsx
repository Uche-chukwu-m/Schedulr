import React from "react";

const PostList = ({ posts }) => {
    const scheduledPosts = posts.filter(posts => posts.status === 'scheduled');
    const publishedPosts = posts.filter(posts => posts.status === 'published');

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString();
    }
    return(
        <div className="mt-8">
            <section className="mb-8">
                <h2 className="text-3xl font-semibold mb-4">Scheduled Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scheduledPosts.length === 0 ? (
                        <p className="text-gray-400"> No scheduled posts yet</p>
                    ) : (
                        scheduledPosts.map(post => (
                            <div key={post.id} className="bg-gray-800 p-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
                                <p className="text-lg text-gray-200 mb-2">{post.content}</p>
                                <p className="text-sm text-gray-200 mb-2">Platform: {post.platform}</p>
                                <p className="text-sm text-gray-200 mb-2">Time: {formatDate(post.scheduled_time)}</p>
                                <span className="bg-yellow-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    Scheduled
                                </span>
                            </div>
                        ))
                    )}

                </div>
            </section>
                
            <section className="mb-8">
                <h2 className="text-3xl font-semibold mb-4">Published Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {publishedPosts.length === 0 ? (
                        <p className="text-gray-400"> No scheduled posts yet</p>
                    ) : (
                        publishedPosts.map(post => (
                            <div key={post.id} className="bg-gray-800 p-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
                                <p className="text-lg text-gray-200 mb-2">{post.content}</p>
                                <p className="text-sm text-gray-200 mb-2">Platform: {post.platform}</p>
                                <p className="text-sm text-gray-200 mb-2">Time: {formatDate(post.scheduled_time)}</p>
                                <span className="bg-yellow-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    Published
                                </span>
                            </div>
                        ))
                    )}

                </div>
            </section>

        </div>
    );
};

export default PostList;
