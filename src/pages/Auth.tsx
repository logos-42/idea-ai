
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/ui/Logo";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // 如果用户已登录，重定向到首页或之前尝试访问的页面
  if (user) {
    const from = (location.state as any)?.from?.pathname || "/dashboard";
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let error;
      if (isSignUp) {
        const result = await signUp(email, password);
        error = result.error;
        if (!error) {
          toast({
            title: "注册成功",
            description: "请登录您的账户。注意：在实际应用中可能需要验证邮箱。",
          });
          setIsSignUp(false);
        }
      } else {
        const result = await signIn(email, password);
        error = result.error;
        if (!error) {
          toast({
            title: "登录成功",
            description: "欢迎回来！",
          });
        }
      }

      if (error) {
        let errorMessage = "出现错误，请重试";
        if (error.message) {
          if (error.message.includes("Invalid login credentials")) {
            errorMessage = "邮箱或密码不正确";
          } else if (error.message.includes("already registered")) {
            errorMessage = "此邮箱已注册，请直接登录";
          } else if (error.message.includes("Email not confirmed")) {
            errorMessage = "请先验证您的邮箱";
          }
        }
        toast({
          title: isSignUp ? "注册失败" : "登录失败",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("认证错误:", err);
      toast({
        title: "出现错误",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{isSignUp ? "创建账户" : "登录账户"}</CardTitle>
          <CardDescription>
            {isSignUp ? "输入您的邮箱和密码创建新账户" : "输入您的邮箱和密码登录您的账户"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="example@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2" />
                  {isSignUp ? "注册中..." : "登录中..."}
                </>
              ) : (
                isSignUp ? "注册" : "登录"
              )}
            </Button>
            <div className="text-center text-sm">
              {isSignUp ? "已有账户?" : "还没有账户?"}{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setIsSignUp(!isSignUp)}
                type="button"
              >
                {isSignUp ? "登录" : "注册"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
