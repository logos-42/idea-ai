
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Brain, MessageSquare, Save, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// 模拟数据
const mockIdea = {
  id: "1",
  title: "面向创意技能的AI驱动学习平台",
  description: "一个根据个人学习风格进行调整并为创意专业人士提供个性化内容的平台。该系统将使用AI分析学习模式和偏好，然后策划和推荐适当的资源。",
  category: "教育",
  createdAt: "2023年5月15日",
  updatedAt: "2023年6月2日",
  tags: ["教育", "人工智能", "个性化", "创意"],
  aiExpanded: true,
  aiExpansion: {
    problemStatement: "许多创意专业人士难以找到与其特定需求和学习风格相匹配的相关、高质量的学习资源。",
    targetAudience: "寻求在设计、写作、音乐、摄影等领域扩展技能或学习新技术的创意专业人士。",
    keyFeatures: [
      "基于技能水平和目标的个性化学习路径",
      "来自多种来源（视频、文章、课程）的AI策划内容",
      "进度追踪和自适应推荐",
      "用于同伴学习和反馈的社区功能",
      "与行业工具和作品集的集成"
    ],
    potentialChallenges: [
      "确保AI推荐真正相关且高质量",
      "建立足够大的内容库以满足多样化需求",
      "关于学习数据收集的隐私问题",
      "推荐引擎的技术实现"
    ],
    marketPotential: "电子学习市场正在快速增长，对专业技能发展的需求尤为突出。这个平台可以填补那些发现通用学习平台不足以满足其特定需求的创意专业人士的缺口。",
    nextSteps: [
      "对创意专业人士进行用户研究",
      "开发原型推荐算法",
      "确定初始内容合作伙伴和来源",
      "创建专注于一个创意领域的最小可行产品"
    ]
  }
};

const IdeaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [idea] = useState(mockIdea);
  const [isExpanding, setIsExpanding] = useState(false);

  const handleDelete = () => {
    toast({
      title: "创意已删除",
      description: "您的创意已成功删除。",
    });
    navigate("/dashboard");
  };

  const handleExpand = () => {
    setIsExpanding(true);
    
    // 模拟AI扩展过程
    setTimeout(() => {
      setIsExpanding(false);
      toast({
        title: "创意已扩展",
        description: "您的创意已通过AI建议进行了扩展。",
      });
    }, 2000);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{idea.category}</Badge>
              {idea.aiExpanded && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  AI增强
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{idea.title}</h1>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDelete}>
              <Trash className="h-4 w-4 mr-2" />
              删除
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">描述</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{idea.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {idea.tags.map(tag => (
                <Badge variant="outline" key={tag} className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <div>创建于: {idea.createdAt}</div>
              <div>更新于: {idea.updatedAt}</div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="expansion" className="animate-fade-in">
          <TabsList className="mb-4">
            <TabsTrigger value="expansion">AI扩展</TabsTrigger>
            <TabsTrigger value="notes">笔记</TabsTrigger>
          </TabsList>
          
          <TabsContent value="expansion" className="animate-slide-up">
            {idea.aiExpanded ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">问题陈述</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{idea.aiExpansion.problemStatement}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">目标受众</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{idea.aiExpansion.targetAudience}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">关键特性</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      {idea.aiExpansion.keyFeatures.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">潜在挑战</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      {idea.aiExpansion.potentialChallenges.map((challenge, index) => (
                        <li key={index}>{challenge}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">市场潜力</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{idea.aiExpansion.marketPotential}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">下一步</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      {idea.aiExpansion.nextSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">用AI扩展此创意</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  让我们的AI通过建议细节、潜在挑战和后续步骤来帮助您进一步发展这个创意。
                </p>
                <Button 
                  onClick={handleExpand}
                  disabled={isExpanding}
                >
                  {isExpanding ? (
                    <>
                      <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2" />
                      扩展中...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      用AI扩展
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="notes" className="animate-slide-up">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  您的笔记
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[200px] p-4 border rounded-md bg-background focus-within:ring-1 focus-within:ring-ring">
                  <p className="text-muted-foreground italic">
                    在此处添加您关于此创意的个人笔记、想法和其他资源。
                  </p>
                </div>
                <Button className="mt-4">保存笔记</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default IdeaDetail;
