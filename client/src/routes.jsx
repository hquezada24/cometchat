// routes.tsx
import App from "./App";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home/Home";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import CreateAccount from "./components/CreateAccount/CreateAccount";
import Login from "./components/Login/Login";
import Profile from "./pages/Profile/Profile";
//import UserProfile from "./pages/UserProfile/UserProfile";
//import Settings from "./pages/Settings/Settings";

const routes = [
  {
    path: "/",
    element: <App />, // Root element with AuthProvider
    children: [
      {
        path: "",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      // Current user's profile (no username needed)
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      // Settings page for current user
      // {
      //   path: "settings",
      //   element: (
      //     <ProtectedRoute>
      //       <Settings />
      //     </ProtectedRoute>
      //   ),
      // },
      // Other users' profiles (requires username)
      // {
      //   path: "user/:username",
      //   element: (
      //     <ProtectedRoute>
      //       <UserProfile />
      //     </ProtectedRoute>
      //   ),
      // },
      // Auth routes
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "create-account", element: <CreateAccount /> },
        ],
      },
    ],
  },
];

export default routes;
