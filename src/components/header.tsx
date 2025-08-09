import { Link } from "react-router-dom";
import { useTheme } from "@/context/theme-provider";
import { Moon, Sun } from "lucide-react";
import CitySearch from "./city-search";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex flex-wrap items-center justify-between h-16 px-4 gap-2">
        {/* Logo on left */}
        <Link to={"/"}>
          <img
            src={isDark ? "/logo.png" : "/logo.png"}
            alt="Logo"
            className="h-14"
          />
        </Link>

        {/* Search + Theme toggle on right */}
        <div className="flex items-center gap-4 flex-1 justify-end min-w-0">
          <div className="flex-shrink-0 min-w-0 max-w-xs">
            <CitySearch />
          </div>

          <div
            role="button"
            aria-label="Toggle theme"
            tabIndex={0}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setTheme(isDark ? "light" : "dark");
              }
            }}
            className={`flex-shrink-0 flex items-center cursor-pointer transition-transform duration-500 ${
              isDark ? "rotate-180" : "rotate-0"
            }`}
          >
            {isDark ? (
              <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all" />
            ) : (
              <Moon className="h-6 w-6 text-blue-500 rotate-0 transition-all" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
