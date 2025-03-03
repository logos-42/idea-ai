
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { IdeaCard } from "@/components/idea/IdeaCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const recentIdeas = [
  {
    id: "1",
    title: "AI驱动的学习平台",
    excerpt: "一个根据个人学习风格进行调整并为创意专业人士提供个性化内容的平台。",
    category: "教育",
    aiExpanded: true,
    date: "2天前"
  },
  {
    id: "2",
    title: "可持续智能家居能源管理",
    excerpt: "一个基于习惯、天气和电网需求优化能源使用的集成系统。",
    category: "科技",
    aiExpanded: true,
    date: "5天前"
  }
];

const activityData = [
  { name: '周一', ideas: 2, expansions: 1 },
  { name: '周二', ideas: 5, expansions: 3 },
  { name: '周三', ideas: 3, expansions: 2 },
  { name: '周四', ideas: 4, expansions: 3 },
  { name: '周五', ideas: 7, expansions: 5 },
  { name: '周六', ideas: 2, expansions: 1 },
  { name: '周日', ideas: 1, expansions: 0 },
];

const categoryData = [
  { name: '科技', count: 12 },
  { name: '商业', count: 8 },
  { name: '健康', count: 5 },
  { name: '教育', count: 7 },
  { name: '创意', count: 6 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

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
                <div className="text-3xl font-bold">38</div>
                <p className="text-xs text-muted-foreground mt-1">较上月增长12%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">AI扩展</CardTitle>
                <CardDescription>通过AI扩展的创意</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24</div>
                <p className="text-xs text-muted-foreground mt-1">占所有创意的63%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">分类</CardTitle>
                <CardDescription>创意分类</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">7</div>
                <p className="text-xs text-muted-foreground mt-1">最常见：科技</p>
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
                      <Tooltip />
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
                      <Tooltip />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentIdeas.map((idea) => (
                <IdeaCard key={idea.id} {...idea} />
              ))}
            </div>
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
                        { month: '一月', ideas: 10, expanded: 7 },
                        { month: '二月', ideas: 15, expanded: 9 },
                        { month: '三月', ideas: 12, expanded: 8 },
                        { month: '四月', ideas: 18, expanded: 12 },
                        { month: '五月', ideas: 22, expanded: 15 },
                        { month: '六月', ideas: 28, expanded: 19 },
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
                      <Tooltip />
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
