import { createContext, useEffect, useState } from "react";
import { fetchTheme, updateTheme } from "../services/themeServices";
import useAuth from "../hooks/useAuth";
export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false); // ← Ensure loading is false when not authenticated
      return;
    }

    console.log("This is logged if authenticated");
    const getTheme = async () => {
      try {
        const res = await fetchTheme();
        if (!res) throw new Error("Failed to fetch theme");
        const data = await res.json();
        console.log("getTheme got: ", data);
        setTheme(data.theme || "light");
      } catch (error) {
        console.error("Error fetching theme:", error);
      } finally {
        setLoading(false);
      }
    };

    getTheme();
  }, [isAuthenticated]);

  const switchTheme = async (newTheme) => {
    setTheme(newTheme);

    try {
      await updateTheme(newTheme);
    } catch (error) {
      console.error("Error updating theme:", error);
    }
  };

  const toggleTheme = () => {
    switchTheme(theme === "light" ? "dark" : "light");
  };

  if (loading) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
