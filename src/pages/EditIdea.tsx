
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Save, ArrowLeft, Brain } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchIdeaById, updateIdea } from "@/services/ideaService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SpeechInput } from "@/components/SpeechInput";

const categories = [
  { value: "technology", label: "科技" },
  { value: "business", label: "商业" },
  { value: "education", label: "教育" },
  { value: "health", label: "健康" },
  { value: "creative", label: "创意" },
  { value: "social", label: "社交" },
  { value: "other", label: "其他" }
];

const EditIdea = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: ""
  });
  
  const { data: idea, isLoading } = useQuery({
    queryKey: ['idea', id],
    queryFn: () => fetchIdeaById(id!),
    enabled: !!id
  });
  
  // Use useEffect to update form data when idea is loaded
  useEffect(() => {
    if (idea) {
      setFormData({
        title: idea.title,
        description: idea.description,
        category: idea.category,
        tags: idea.tags || ""
      });
    }
  }, [idea]);

  const updateIdeaMutation = useMutation({
    mutationFn: (data: any) => updateIdea(id!, data),
    onSuccess: () => {
      toast({
        title: "创意已更新",
        description: "您的创意已成功更新。",
      });
      navigate(`/idea/${id}`);
    },
    onError: (error) => {
      console.error("更新创意失败:", error);
      toast({
        title: "更新失败",
        description: "更新创意时出现错误，请重试。",
        variant: "destructive",
      });
    }
  });

  const expandIdeaMutation = useMutation({
    mutationFn: async (data: any) => {
      // 标记为AI扩展并更新
      return await updateIdea(id!, { ...data, ai_expanded: true });
    },
    onSuccess: () => {
      toast({
        title: "创意已更新并扩展",
        description: "您的创意已更新并通过AI进行扩展。",
      });
      navigate(`/idea/${id}`);
    },
    onError: (error) => {
      console.error("更新并扩展创意失败:", error);
      toast({
        title: "操作失败",
        description: "更新并扩展创意时出现错误，请重试。",
        variant: "destructive",
      });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSpeechInput = (field: string, text: string) => {
    setFormData(prev => ({ ...prev, [field]: text }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能更新创意。",
        variant: "destructive",
      });
      return;
    }
    
    const ideaData = {
      ...formData,
      user_id: user.id
    };
    
    updateIdeaMutation.mutate(ideaData);
  };

  const handleSaveAndExpand = () => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能更新创意。",
        variant: "destructive",
      });
      return;
    }
    
    const ideaData = {
      ...formData,
      user_id: user.id
    };
    
    expandIdeaMutation.mutate(ideaData);
  };

  const isSubmitting = updateIdeaMutation.isPending || expandIdeaMutation.isPending;

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
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/idea/${id}`)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回详情
          </Button>
          
          <h1 className="text-3xl font-bold tracking-tight">编辑创意</h1>
          <p className="text-muted-foreground mt-2">修改您的创意详情。</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>创意详情</CardTitle>
              <CardDescription>
                修改您的创意的基本信息。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">标题</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="title"
                    name="title"
                    placeholder="您的创意标题"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="flex-1"
                  />
                  <SpeechInput 
                    onSpeechInput={(text) => handleSpeechInput("title", text)}
                    currentText={formData.title}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <div className="flex items-start gap-2">
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="详细描述您的创意..."
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="flex-1"
                  />
                  <SpeechInput 
                    onSpeechInput={(text) => handleSpeechInput("description", text)} 
                    currentText={formData.description}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">分类</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={handleCategoryChange}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="选择一个分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>分类</SelectLabel>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">标签</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="用逗号分隔标签，例如：移动应用,健康,创新"
                    value={formData.tags}
                    onChange={handleChange}
                    className="flex-1"
                  />
                  <SpeechInput 
                    onSpeechInput={(text) => handleSpeechInput("tags", text)}
                    currentText={formData.tags}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/idea/${id}`)}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {updateIdeaMutation.isPending ? (
                <>
                  <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  保存
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="default"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              onClick={handleSaveAndExpand}
              disabled={isSubmitting}
            >
              {expandIdeaMutation.isPending ? (
                <>
                  <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2" />
                  处理中...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  保存并扩展
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditIdea;
