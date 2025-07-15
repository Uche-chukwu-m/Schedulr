import { useState, useEffect } from "react";
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from './components/Login';
import SchedulerDashboard from './components/SchedulerDashboard';


function App() {
  const [user, setUser] = useState(null)
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

export default App;