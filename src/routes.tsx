import App from "./App";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import Login from "./components/Login/Login";

const routes = [
  {
    path: "/",
    element: <App />,
  },
  {
    element: <AuthLayout />,
    children: [{ path: "/login", element: <Login /> }],
  },
];

export default routes;
