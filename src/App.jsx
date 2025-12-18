import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Exchanges from "./pages/Exchanges";
import Watchlist from "./pages/Watchlist";
import CoinDetails from "./pages/CoinDetails";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import ExchangeDetails from "./pages/ExchangeDetails";


function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const signupUser = localStorage.getItem("signupUser");


  if (token || signupUser) {
    return children;
  }

  return <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/exchanges"
          element={
            <ProtectedRoute>
              <Layout>
                <Exchanges />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Layout>
                <Watchlist />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/coin/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <CoinDetails />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ✅ PROFILE ROUTE (FIXED) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
<Route
  path="/exchange/:id"
  element={
    <ProtectedRoute>
      <Layout>
        <ExchangeDetails />
      </Layout>
    </ProtectedRoute>
  }
/>


        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
