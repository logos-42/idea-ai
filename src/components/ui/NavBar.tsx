
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function NavBar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled ? "border-b border-border bg-background/80 backdrop-blur-md" : "bg-background"
      }`}
    >
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <Logo />
        <nav className="mx-6 hidden items-center space-x-2 md:flex">
          <Link 
            to="/" 
            className={`nav-item ${isActive("/") ? "active" : ""}`}
          >
            首页
          </Link>
          <Link 
            to="/dashboard" 
            className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
          >
            仪表盘
          </Link>
          <Link 
            to="/ideas" 
            className={`nav-item ${isActive("/ideas") ? "active" : ""}`}
          >
            我的创意
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Button asChild className="hidden sm:flex">
            <Link to="/new">
              <Plus className="mr-2 h-4 w-4" />
              新创意
            </Link>
          </Button>
          <div className="rounded-full bg-secondary p-0.5 flex items-center justify-center">
            <div 
              className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
              aria-label="用户资料" 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
