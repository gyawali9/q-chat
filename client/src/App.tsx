import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { ProtectedRoutes } from "./routes/ProtectedRoute";
import LoginSkeleton from "./components/skeletons/LoginSkeleton";
import { lazyWithDelay } from "./utility";

const Home = lazy(() => import("./pages/HomePage"));
const Profile = lazy(() => import("./pages/ProfilePage"));
const Login = lazyWithDelay(() => import("./pages/LoginPage"), 500);

const App = () => {
  return (
    <div className="bg-[url('/bgImage.svg')] bg-contain">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<LoginSkeleton />}>
              <Login />
            </Suspense>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
