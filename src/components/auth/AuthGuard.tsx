
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>;
  }

  if (!user) {
    // 记住用户尝试访问的页面，以便登录后重定向
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
