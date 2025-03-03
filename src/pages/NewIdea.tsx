
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Brain, Save } from "lucide-react";

const categories = [
  { value: "technology", label: "科技" },
  { value: "business", label: "商业" },
  { value: "education", label: "教育" },
  { value: "health", label: "健康" },
  { value: "creative", label: "创意" },
  { value: "social", label: "社交" },
  { value: "other", label: "其他" }
];

const NewIdea = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 模拟提交过程
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "创意已保存",
        description: "您的创意已成功保存。",
      });
      navigate("/dashboard");
    }, 1500);
  };

  const handleSaveAndExpand = () => {
    setIsSubmitting(true);
    
    // 模拟保存和扩展过程
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "创意已保存并扩展",
        description: "您的创意已保存并通过AI进行扩展。",
      });
      navigate("/idea/1"); // 导航到模拟的创意详情页
    }, 2000);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">新创意</h1>
          <p className="text-muted-foreground mt-2">记录您的想法，让它成长为一个完整的概念。</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>创意详情</CardTitle>
              <CardDescription>
                填写您的创意的基本信息。越详细越好，但简单的想法也可以后续扩展。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">标题</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="您的创意标题"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="详细描述您的创意..."
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
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
                <Input
                  id="tags"
                  name="tags"
                  placeholder="用逗号分隔标签，例如：移动应用,健康,创新"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
              {isSubmitting ? (
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

export default NewIdea;
