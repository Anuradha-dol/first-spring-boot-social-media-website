import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx";
import Signup from "./components/SignUp.jsx";
import VerifyOtp from "./components/VerifyOtp.jsx";
import Login from "./components/Login.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Home from "./components/Home.jsx";
import Profile from "./components/Profile.jsx";
import Settings from "./components/Settings.jsx";
import Review from "./components/Review.jsx";
import SupportAdmin from "./components/SupportAdmin.jsx";
import SupportUser from "./components/SupportUser.jsx";
import SearchUsers from "./components/SearchUsers.jsx";
import Notifications from "./components/Notifications.jsx";
import Friends from "./components/Friends.jsx";
import Posts from "./components/Posts .jsx";

const routes = [
  ["/", <LandingPage />],
  ["/signup", <Signup />],
  ["/verify", <VerifyOtp />],
  ["/login", <Login />],
  ["/forgot-password", <ForgotPassword />],
  ["/dashboard", <Dashboard />],
  ["/home", <Home />],
  ["/profile", <Profile />],
  ["/settings", <Settings />],
  ["/review", <Review />],
  ["/supportAdmin", <SupportAdmin />],
  ["/supportUser", <SupportUser />],
  ["/searchUsers", <SearchUsers />],
  ["/notifications", <Notifications />],
  ["/friend", <Friends />],
  ["/post", <Posts />],
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map(([path, element]) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
