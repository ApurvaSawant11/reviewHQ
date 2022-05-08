import "./App.css";
import { Route, Routes } from "react-router-dom";
import {
  Bookmarks,
  Home,
  Leaderboard,
  Login,
  Profile,
  Search,
  Signup,
  SinglePost,
} from "pages";
import { Header, Navbar, RequiresAuth } from "components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <Header />
      <ToastContainer position="bottom-right" autoClose="2100" />
      <div className="flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<RequiresAuth />}>
            <Route path="/" element={<Home />} />
            <Route path="/post/:postId" element={<SinglePost />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
