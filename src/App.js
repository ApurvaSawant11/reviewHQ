import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Home, Login, Signup, SinglePost } from "pages";
import { Header } from "components";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/post/:postId" element={<SinglePost />} />
      </Routes>
    </div>
  );
}

export default App;
