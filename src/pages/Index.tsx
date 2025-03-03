
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, Brain } from "lucide-react";
import { IdeaCard } from "@/components/idea/IdeaCard";

const featuredIdeas = [
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
  }
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="relative py-12 sm:py-16 lg:py-20 animate-fade-in">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-4 md:space-y-6">
            <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm">
              <span className="mr-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                新功能
              </span>
              <span className="text-muted-foreground">
                AI驱动的创意扩展功能现已推出
              </span>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl animate-slide-down">
              捕捉并扩展您的创意
              <span className="text-primary">，AI助您一臂之力</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-muted-foreground sm:text-lg animate-slide-up">
              记录您的想法，让我们的AI帮助您发展、完善并将它们扩展成可实施的完整概念。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-scale-in">
              <Button size="lg" onClick={() => navigate("/new")}>
                开始记录创意
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/dashboard")}>
                查看仪表盘
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 animate-fade-in">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">精选创意</h2>
            <Button variant="ghost" onClick={() => navigate("/ideas")}>
              查看全部
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                id={idea.id}
                title={idea.title}
                excerpt={idea.excerpt}
                category={idea.category}
                aiExpanded={idea.aiExpanded}
                date={idea.date}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-secondary/50 rounded-2xl mb-8 animate-fade-in">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">
                AI驱动的创意扩展
              </h2>
              <p className="text-muted-foreground mb-6">
                我们的高级AI分析您的创意并建议扩展、改进以及与相关概念的连接。它帮助您探索可能未曾考虑过的可能性。
              </p>
              <ul className="space-y-2 text-sm">
                {[
                  "通过相关细节扩展初始概念",
                  "识别潜在挑战和解决方案",
                  "建议资源和后续步骤",
                  "与您收藏中的相关创意建立联系"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[300px] w-full overflow-hidden rounded-xl shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
                <div className="glass w-full max-w-md p-6 rounded-lg shadow-smooth space-y-4">
                  <div className="space-y-1.5">
                    <div className="h-5 w-24 bg-primary/20 rounded-md animate-pulse" />
                    <div className="h-8 w-full bg-primary/10 rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded-md" />
                    <div className="h-4 w-5/6 bg-muted rounded-md" />
                    <div className="h-4 w-4/6 bg-muted rounded-md" />
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-24 bg-primary/80 rounded-md" />
                    <div className="h-8 w-24 bg-muted rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
