import { useState, useEffect } from "react";
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from './components/Login';
import SchedulerDashboard from './components/SchedulerDashboard';
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";


function App() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // listening to signin/signout
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).catch(error => console.error("Logout Error:", error));
  };

  if (loading) {
    return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {
        user ? (
          // if user is logged in show dashboard and logout button
          <div>
            <nav className="p-4 flex justify-between items-center bg-gray-800">
              <p>Welcome, {user.email}</p>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Logout</button>
            </nav>
            <SchedulerDashboard user={user} />
          </div>
        ) : (
          // if user not logged in, show login
          <Login/>
        )};
    </div>
  )};

  // useEffect(() => {
  //   axios.get(`${API_URL}/posts`)
  //   .then(response => {
  //     setPosts(response.data);
  //     setLoading(false);
  //     console.log("Fetched Posts:", response.data);
  //   })
  //   .catch(error => {
  //     console.error("Error fetching posts:", error);
  //     setLoading(false);
  //   });
  // }, []); // This empty array means the effect runs once on mount

  // const handlePostCreated = async (newPost) => {
  //   try {
  //     const response = await axios.post(`${API_URL}/posts`, newPost);
  //     setPosts(prevPosts => [response.data, ...prevPosts]);
  //   } catch (error) {
  //     console.error("Error creating post:", error);
  //     alert("Failed to create post. Check console for details.");
  //   }
  // };

    // return (
    //   <div className="bg-gray-900 text-white min-h-screeen p-8 justify-center">
    //     <h1 className="text-4xl font-bold mb-8">Schedulr</h1>
    //     {/* {
    //       loading ? (
    //         <p>Loading posts ...</p>
    //       ) : (
    //         <pre>{JSON.stringify(posts, null, )}</pre>
    //       )} */}
    //       <PostForm onPostCreated={handlePostCreated} />
    //       <PostList posts={posts}/>
    //   </div>
    // )

export default App;