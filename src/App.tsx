import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Onboarding from "./pages/onBoarding";
import Login from "./pages/login";
import Home from "./pages/home";
import MyPage from "./pages/MyPage";
import MyPostsPage from "./pages/MyPostsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/posts" element={<MyPostsPage />} />
      </Routes>
    </Router>
  );
}

export default App;