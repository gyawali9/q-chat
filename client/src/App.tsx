import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { ProtectedRoutes } from "./routes/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";

const App = () => {
  return (
    <div className="bg-[url('/bgImage.svg')] bg-contain">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <HomePage />
            </ProtectedRoutes>
          }
        />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <ProfilePage />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
