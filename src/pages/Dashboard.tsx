
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
    title: "AI-Powered Learning Platform",
    excerpt: "A platform that adapts to individual learning styles and provides personalized content for creative professionals.",
    category: "Education",
    aiExpanded: true,
    date: "2 days ago"
  },
  {
    id: "2",
    title: "Sustainable Smart Home Energy Management",
    excerpt: "An integrated system that optimizes energy usage based on habits, weather, and grid demand.",
    category: "Technology",
    aiExpanded: true,
    date: "5 days ago"
  }
];

const activityData = [
  { name: 'Mon', ideas: 2, expansions: 1 },
  { name: 'Tue', ideas: 5, expansions: 3 },
  { name: 'Wed', ideas: 3, expansions: 2 },
  { name: 'Thu', ideas: 4, expansions: 3 },
  { name: 'Fri', ideas: 7, expansions: 5 },
  { name: 'Sat', ideas: 2, expansions: 1 },
  { name: 'Sun', ideas: 1, expansions: 0 },
];

const categoryData = [
  { name: 'Technology', count: 12 },
  { name: 'Business', count: 8 },
  { name: 'Health', count: 5 },
  { name: 'Education', count: 7 },
  { name: 'Creative', count: 6 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={() => navigate("/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Idea
        </Button>
      </div>

      <Tabs defaultValue="overview" className="animate-fade-in" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
                <CardDescription>All captured ideas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">38</div>
                <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">AI Expansions</CardTitle>
                <CardDescription>Ideas expanded with AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24</div>
                <p className="text-xs text-muted-foreground mt-1">63% of all ideas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <CardDescription>Idea classifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">7</div>
                <p className="text-xs text-muted-foreground mt-1">Most common: Technology</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
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
                      <Line type="monotone" dataKey="ideas" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="expansions" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
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
                      <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Ideas</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/ideas")}>
                View all
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
                <CardTitle>Idea Insights</CardTitle>
                <CardDescription>Your idea activity and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { month: 'Jan', ideas: 10, expanded: 7 },
                        { month: 'Feb', ideas: 15, expanded: 9 },
                        { month: 'Mar', ideas: 12, expanded: 8 },
                        { month: 'Apr', ideas: 18, expanded: 12 },
                        { month: 'May', ideas: 22, expanded: 15 },
                        { month: 'Jun', ideas: 28, expanded: 19 },
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
                      <Bar dataKey="ideas" fill="#3b82f6" name="Ideas" />
                      <Bar dataKey="expanded" fill="#10b981" name="AI Expanded" />
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
