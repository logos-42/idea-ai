
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

// Mock data
const mockIdea = {
  id: "1",
  title: "AI-Powered Learning Platform for Creative Skills",
  description: "A platform that adapts to individual learning styles and provides personalized content for creative professionals. The system would use AI to analyze learning patterns and preferences, then curate and recommend appropriate resources.",
  category: "Education",
  createdAt: "May 15, 2023",
  updatedAt: "June 2, 2023",
  tags: ["education", "ai", "personalization", "creative"],
  aiExpanded: true,
  aiExpansion: {
    problemStatement: "Many creative professionals struggle to find relevant, high-quality learning resources that match their specific needs and learning styles.",
    targetAudience: "Creative professionals looking to expand their skills or learn new techniques in fields like design, writing, music, photography, etc.",
    keyFeatures: [
      "Personalized learning paths based on skill level and goals",
      "AI-curated content from diverse sources (videos, articles, courses)",
      "Progress tracking and adaptive recommendations",
      "Community features for peer learning and feedback",
      "Integration with industry tools and portfolios"
    ],
    potentialChallenges: [
      "Ensuring AI recommendations are truly relevant and high-quality",
      "Building a sufficiently large content library to serve diverse needs",
      "Privacy concerns around learning data collection",
      "Technical implementation of the recommendation engine"
    ],
    marketPotential: "The e-learning market is growing rapidly, with particular demand for specialized skill development. This platform could fill a gap for creative professionals who find generic learning platforms inadequate for their specific needs.",
    nextSteps: [
      "Conduct user research with creative professionals",
      "Develop a prototype recommendation algorithm",
      "Identify initial content partners and sources",
      "Create a minimum viable product focused on one creative discipline"
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
      title: "Idea deleted",
      description: "Your idea has been deleted successfully.",
    });
    navigate("/dashboard");
  };

  const handleExpand = () => {
    setIsExpanding(true);
    
    // Simulate AI expansion process
    setTimeout(() => {
      setIsExpanding(false);
      toast({
        title: "Idea expanded",
        description: "Your idea has been expanded with AI suggestions.",
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
                  AI Enhanced
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{idea.title}</h1>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDelete}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Description</CardTitle>
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
              <div>Created: {idea.createdAt}</div>
              <div>Updated: {idea.updatedAt}</div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="expansion" className="animate-fade-in">
          <TabsList className="mb-4">
            <TabsTrigger value="expansion">AI Expansion</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="expansion" className="animate-slide-up">
            {idea.aiExpanded ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Problem Statement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{idea.aiExpansion.problemStatement}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Target Audience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{idea.aiExpansion.targetAudience}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Key Features</CardTitle>
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
                    <CardTitle className="text-lg">Potential Challenges</CardTitle>
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
                    <CardTitle className="text-lg">Market Potential</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{idea.aiExpansion.marketPotential}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Next Steps</CardTitle>
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
                <h3 className="text-xl font-medium mb-2">Expand this idea with AI</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Let our AI help you develop this idea further by suggesting details, potential challenges, and next steps.
                </p>
                <Button 
                  onClick={handleExpand}
                  disabled={isExpanding}
                >
                  {isExpanding ? (
                    <>
                      <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2" />
                      Expanding...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Expand with AI
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
                  Your Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[200px] p-4 border rounded-md bg-background focus-within:ring-1 focus-within:ring-ring">
                  <p className="text-muted-foreground italic">
                    Add your personal notes, thoughts, and additional resources about this idea here.
                  </p>
                </div>
                <Button className="mt-4">Save Notes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default IdeaDetail;
