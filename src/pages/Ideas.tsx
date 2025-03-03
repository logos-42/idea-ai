
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { IdeaCard } from "@/components/idea/IdeaCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

// 模拟数据
const allIdeas = [
  {
    id: "1",
    title: "AI驱动的创意技能学习平台",
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
  },
  {
    id: "3",
    title: "社区心理健康支持网络",
    excerpt: "一个连接具有相似经历的人和经过培训的主持人的同伴支持平台。",
    category: "健康",
    aiExpanded: false,
    date: "1周前"
  },
  {
    id: "4",
    title: "个人财务优化应用",
    excerpt: "一个帮助用户根据收入、支出和财务目标优化预算的应用程序。",
    category: "商业",
    aiExpanded: true,
    date: "2周前"
  },
  {
    id: "5",
    title: "远程团队协作工具",
    excerpt: "一个为远程工作者提供虚拟环境以促进协作和创意的平台。",
    category: "商业",
    aiExpanded: false,
    date: "2周前"
  },
  {
    id: "6",
    title: "个性化健身指导应用",
    excerpt: "根据用户的能力、目标和可用设备提供个性化锻炼计划的应用程序。",
    category: "健康",
    aiExpanded: true,
    date: "3周前"
  }
];

const Ideas = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("grid");

  // 过滤和排序逻辑
  const filteredIdeas = allIdeas.filter(idea => {
    // 搜索过滤
    if (searchTerm && !idea.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !idea.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // 分类过滤
    if (filter !== "all" && idea.category.toLowerCase() !== filter.toLowerCase()) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // 排序逻辑
    if (sort === "newest") {
      return a.date > b.date ? -1 : 1;
    } else if (sort === "oldest") {
      return a.date < b.date ? -1 : 1;
    } else if (sort === "alphabetical") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">所有创意</h1>
            <p className="text-muted-foreground mt-1">浏览、搜索和管理您的所有创意</p>
          </div>
          
          <Button onClick={() => navigate("/new")}>
            <Plus className="mr-2 h-4 w-4" />
            新创意
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="搜索创意..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px]">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <span>{filter === "all" ? "所有分类" : filter}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有分类</SelectItem>
                <SelectItem value="教育">教育</SelectItem>
                <SelectItem value="科技">科技</SelectItem>
                <SelectItem value="健康">健康</SelectItem>
                <SelectItem value="商业">商业</SelectItem>
                <SelectItem value="创意">创意</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[160px]">
                <span>排序: {
                  sort === "newest" ? "最新" : 
                  sort === "oldest" ? "最早" : 
                  "字母顺序"
                }</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">最新</SelectItem>
                <SelectItem value="oldest">最早</SelectItem>
                <SelectItem value="alphabetical">字母顺序</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs value={view} onValueChange={setView} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="grid">网格视图</TabsTrigger>
            <TabsTrigger value="list">列表视图</TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid" className="animate-slide-up">
            {filteredIdeas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIdeas.map((idea) => (
                  <IdeaCard key={idea.id} {...idea} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">未找到匹配的创意</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                  className="mt-4"
                >
                  清除过滤器
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="list" className="animate-slide-up">
            {filteredIdeas.length > 0 ? (
              <div className="space-y-4">
                {filteredIdeas.map((idea) => (
                  <div key={idea.id} className="flex items-center border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                    <div className="flex-grow">
                      <div className="flex gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">{idea.category}</span>
                        {idea.aiExpanded && (
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">AI增强</span>
                        )}
                      </div>
                      <h3 className="font-medium">{idea.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{idea.date}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate(`/idea/${idea.id}`)}
                    >
                      查看
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">未找到匹配的创意</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                  className="mt-4"
                >
                  清除过滤器
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Ideas;
