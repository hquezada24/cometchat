import "./App.css";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";

function App() {
  return (
    <div className="app-container">
      <AuthProvider>
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
