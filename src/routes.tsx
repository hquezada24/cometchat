import App from "./App";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import CreateAccount from "./components/CreateAccount/CreateAccount";
import Login from "./components/Login/Login";

const routes = [
  {
    path: "/",
    element: <App />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/create-account", element: <CreateAccount /> },
    ],
  },
];

export default routes;
