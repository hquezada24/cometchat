import "./Navigation.css";
import useTheme from "../../hooks/useTheme";
import { Link } from "react-router-dom";

const Navigation = ({
  navigationItems,
  isMenuOpen,
  isActiveLink,
  messageBubble = false,
}) => {
  const { theme } = useTheme();

  return (
    <nav
      className={`mobileNav  ${isMenuOpen ? "mobileNavOpen" : ""} ${
        messageBubble && "messageBubble"
      }`}
      id="mobile-navigation"
      aria-label="Mobile navigation"
      data-theme={theme === "dark" ? "dark" : undefined}
    >
      <ul className="mobileNavList">
        {navigationItems.map((item) =>
          item.path ? (
            <li key={item.path} className="mobileNavItem">
              <Link
                to={item.path}
                className={`mobileNavLink ${
                  isActiveLink(item.path) ? "activeMobileLink" : ""
                }`}
                data-theme={theme === "dark" ? "dark" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ) : (
            <li
              key={item.label}
              className="mobileNavItem"
              onClick={item.onClick ? () => item.onClick() : undefined} // use undefined if no handler
            >
              <p
                className="mobileNavLink not-link"
                data-theme={theme === "dark" ? "dark" : undefined}
              >
                {item.label}
              </p>
            </li>
          )
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
