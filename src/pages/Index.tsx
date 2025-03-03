
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, Brain } from "lucide-react";
import { IdeaCard } from "@/components/idea/IdeaCard";

const featuredIdeas = [
  {
    id: "1",
    title: "AI-Powered Learning Platform for Creative Skills",
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
  },
  {
    id: "3",
    title: "Community-Based Mental Health Support Network",
    excerpt: "A peer support platform connecting people with similar experiences and trained moderators.",
    category: "Health",
    aiExpanded: false,
    date: "1 week ago"
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
                New
              </span>
              <span className="text-muted-foreground">
                AI-powered idea expansion now available
              </span>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl animate-slide-down">
              Capture and Expand Your Ideas
              <span className="text-primary"> with AI</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-muted-foreground sm:text-lg animate-slide-up">
              Record your ideas and let our AI help you develop, refine, and expand them into fully-formed concepts ready for implementation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-scale-in">
              <Button size="lg" onClick={() => navigate("/new")}>
                Start Capturing Ideas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/dashboard")}>
                View Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 animate-fade-in">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Featured Ideas</h2>
            <Button variant="ghost" onClick={() => navigate("/ideas")}>
              View all
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
                AI-Powered Idea Expansion
              </h2>
              <p className="text-muted-foreground mb-6">
                Our advanced AI analyzes your ideas and suggests expansions, improvements, and connections to related concepts. It helps you explore possibilities you might not have considered.
              </p>
              <ul className="space-y-2 text-sm">
                {[
                  "Expand initial concepts with relevant details",
                  "Identify potential challenges and solutions",
                  "Suggest resources and next steps",
                  "Connect with related ideas in your collection"
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
