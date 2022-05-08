import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Bookmarks, Home, Leaderboard, Login, Signup, SinglePost } from "pages";
import { Header, Navbar } from "components";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/post/:postId" element={<SinglePost />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
