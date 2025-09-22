import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="app-container">
      <h1>Headline</h1>
      <Outlet />
    </div>
  );
}

export default App;
