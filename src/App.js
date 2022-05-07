import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Home, Login, Signup } from "pages";
import { Header } from "components";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
