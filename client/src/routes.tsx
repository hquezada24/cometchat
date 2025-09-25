// routes.tsx
import App from "./App";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./components/Home/Home";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import CreateAccount from "./components/CreateAccount/CreateAccount";
import Login from "./components/Login/Login";

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
