import "./App.css";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <div className="app-container">
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </div>
  );
}

export default App;
