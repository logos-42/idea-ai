
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { IdeaCard } from "@/components/idea/IdeaCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { fetchIdeas } from "@/services/ideaService";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Idea } from "@/types/idea";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // 使用React Query获取数据
  const { data: ideas = [], isLoading, refetch } = useQuery({
    queryKey: ['ideas'],
    queryFn: fetchIdeas,
  });
  
  // 获取最近创意
  const recentIdeas = ideas
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 2);
  
  // 监听实时数据更新
  useEffect(() => {
    const channel = supabase
      .channel('public:ideas')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ideas' }, 
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // 根据天数计算相对日期
  const getRelativeDate = (date: string) => {
    const days = Math.round((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    
    if (days < 1) return "今天";
    if (days === 1) return "昨天";
    if (days < 7) return `${days}天前`;
    if (days < 30) return `${Math.floor(days / 7)}周前`;
    return `${Math.floor(days / 30)}月前`;
  };

  // 计算统计数据
  const totalIdeas = ideas.length;
  const aiExpandedIdeas = ideas.filter(idea => idea.ai_expanded).length;
  const categories = [...new Set(ideas.map(idea => idea.category))];
  const mostCommonCategory = categories.length > 0 
    ? Object.entries(
        ideas.reduce((acc, idea) => {
          acc[idea.category] = (acc[idea.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).sort((a, b) => b[1] - a[1])[0]?.[0]
    : "无数据";

  // 生成周活动数据
  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const activityData = weekDays.map(day => {
    const count = Math.floor(Math.random() * 10); // 模拟数据
    return {
      name: day,
      ideas: count,
      expansions: Math.floor(count * 0.7),
    };
  });

  // 生成分类数据
  const categoryData = categories.map(category => ({
    name: category,
    count: ideas.filter(idea => idea.category === category).length,
  }));

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="ml-2">加载中...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
        <Button onClick={() => navigate("/new")}>
          <Plus className="mr-2 h-4 w-4" />
          新创意
        </Button>
      </div>

      <Tabs defaultValue="overview" className="animate-fade-in" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="analytics">分析</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">创意总数</CardTitle>
                <CardDescription>所有已记录的创意</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalIdeas}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalIdeas > 0 ? "继续记录您的灵感!" : "开始记录您的第一个创意!"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">AI扩展</CardTitle>
                <CardDescription>通过AI扩展的创意</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{aiExpandedIdeas}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalIdeas > 0 && `占所有创意的${Math.round((aiExpandedIdeas / totalIdeas) * 100)}%`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">分类</CardTitle>
                <CardDescription>创意分类</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{categories.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {categories.length > 0 && `最常见：${mostCommonCategory}`}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>每周活动</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={activityData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="ideas" name="创意" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="expansions" name="扩展" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>热门分类</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryData}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <RechartsTooltip />
                      <Bar dataKey="count" name="数量" fill="#8884d8" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">最近创意</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/ideas")}>
                查看全部
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            {recentIdeas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentIdeas.map((idea: Idea) => (
                  <IdeaCard 
                    key={idea.id} 
                    id={idea.id} 
                    title={idea.title} 
                    excerpt={idea.excerpt || idea.description} 
                    category={idea.category} 
                    aiExpanded={idea.ai_expanded} 
                    date={getRelativeDate(idea.created_at)} 
                  />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="mb-4 text-muted-foreground">还没有创意记录</p>
                <Button onClick={() => navigate("/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  创建第一个创意
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="animate-slide-up">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>创意洞察</CardTitle>
                <CardDescription>您的创意活动和统计数据</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { month: '一月', ideas: totalIdeas > 0 ? Math.floor(totalIdeas * 0.1) : 0, expanded: aiExpandedIdeas > 0 ? Math.floor(aiExpandedIdeas * 0.1) : 0 },
                        { month: '二月', ideas: totalIdeas > 0 ? Math.floor(totalIdeas * 0.15) : 0, expanded: aiExpandedIdeas > 0 ? Math.floor(aiExpandedIdeas * 0.15) : 0 },
                        { month: '三月', ideas: totalIdeas > 0 ? Math.floor(totalIdeas * 0.12) : 0, expanded: aiExpandedIdeas > 0 ? Math.floor(aiExpandedIdeas * 0.12) : 0 },
                        { month: '四月', ideas: totalIdeas > 0 ? Math.floor(totalIdeas * 0.18) : 0, expanded: aiExpandedIdeas > 0 ? Math.floor(aiExpandedIdeas * 0.18) : 0 },
                        { month: '五月', ideas: totalIdeas > 0 ? Math.floor(totalIdeas * 0.22) : 0, expanded: aiExpandedIdeas > 0 ? Math.floor(aiExpandedIdeas * 0.22) : 0 },
                        { month: '六月', ideas: totalIdeas > 0 ? Math.floor(totalIdeas * 0.28) : 0, expanded: aiExpandedIdeas > 0 ? Math.floor(aiExpandedIdeas * 0.28) : 0 },
                      ]}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="ideas" name="创意" fill="#3b82f6" />
                      <Bar dataKey="expanded" name="AI扩展" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Dashboard;
