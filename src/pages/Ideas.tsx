
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { IdeaCard } from "@/components/idea/IdeaCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { fetchIdeas, deleteIdea } from "@/services/ideaService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Idea } from "@/types/idea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Ideas = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("grid");
  const [ideaToDelete, setIdeaToDelete] = useState<string | null>(null);

  // 使用React Query加载数据
  const { data: ideas = [], isLoading, refetch } = useQuery({
    queryKey: ['ideas'],
    queryFn: fetchIdeas,
  });
  
  // 创建删除操作的mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteIdea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      toast({
        title: "创意已删除",
        description: "您的创意已成功删除。",
      });
    },
    onError: (error) => {
      console.error("删除创意失败:", error);
      toast({
        title: "删除失败",
        description: "删除创意时出现错误，请重试。",
        variant: "destructive",
      });
    }
  });

  // 监听实时数据更新
  useEffect(() => {
    const channel = supabase
      .channel('public:ideas')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ideas' }, 
        (payload) => {
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

  // 处理删除创意
  const handleDeleteIdea = (id: string) => {
    setIdeaToDelete(id);
  };

  const confirmDelete = () => {
    if (ideaToDelete) {
      deleteMutation.mutate(ideaToDelete);
      setIdeaToDelete(null);
    }
  };

  // 过滤和排序逻辑
  const filteredIdeas = ideas.filter((idea: Idea) => {
    // 搜索过滤
    if (searchTerm && !idea.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !idea.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // 分类过滤
    if (filter !== "all" && idea.category.toLowerCase() !== filter.toLowerCase()) {
      return false;
    }
    
    return true;
  }).sort((a: Idea, b: Idea) => {
    // 排序逻辑
    if (sort === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sort === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sort === "alphabetical") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // 所有可用的分类
  const categories = [...new Set(ideas.map((idea: Idea) => idea.category))];

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
                {categories.map((category: string) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
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
                {filteredIdeas.map((idea: Idea) => (
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
                {filteredIdeas.map((idea: Idea) => (
                  <div key={idea.id} className="flex items-center border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                    <div className="flex-grow">
                      <div className="flex gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">{idea.category}</span>
                        {idea.ai_expanded && (
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">AI增强</span>
                        )}
                      </div>
                      <h3 className="font-medium">{idea.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{getRelativeDate(idea.created_at)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/idea/${idea.id}`)}
                      >
                        查看
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                            onClick={() => handleDeleteIdea(idea.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>确认删除</AlertDialogTitle>
                            <AlertDialogDescription>
                              您确定要删除这个创意吗？此操作无法撤销。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={confirmDelete}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              删除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
