
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

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

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "已退出",
      description: "您已成功退出账户",
    });
    navigate("/");
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
          {user && (
            <>
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
            </>
          )}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <Button asChild className="hidden sm:flex">
                <Link to="/new">
                  <Plus className="mr-2 h-4 w-4" />
                  新创意
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut} title="退出">
                <LogOut className="h-5 w-5" />
              </Button>
              <div className="rounded-full bg-secondary p-0.5 flex items-center justify-center">
                <div 
                  className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                  aria-label="用户资料" 
                />
              </div>
            </>
          ) : (
            <Button asChild>
              <Link to="/auth">登录 / 注册</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
