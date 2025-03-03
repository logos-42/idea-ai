import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ArrowLeft, Calendar, Edit, Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { fetchIdeaById, deleteIdea } from "@/services/ideaService";
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

const IdeaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: idea, isLoading, isError } = useQuery({
    queryKey: ['idea', id],
    queryFn: () => fetchIdeaById(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteIdea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      toast({
        title: "创意已删除",
        description: "您的创意已成功删除。",
      });
      navigate("/ideas");
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

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  if (isError || !idea) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">未找到创意</h2>
          <p className="text-muted-foreground mb-6">找不到该创意或已被删除</p>
          <Button onClick={() => navigate("/ideas")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回创意列表
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/ideas")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline">{idea.category}</Badge>
                {idea.ai_expanded && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    AI增强
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{idea.title}</h1>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                <span>创建于 {formatDate(idea.created_at)}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => navigate(`/edit/${idea.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                编辑
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    删除
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
                      onClick={handleDelete}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      删除
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
        
        <Card className="p-6 mb-6">
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">描述</h3>
            <p className="whitespace-pre-line">{idea.description}</p>
          </div>
        </Card>
        
        {idea.tags && (
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Tag className="mr-2 h-4 w-4" />
              <h3 className="text-lg font-semibold">标签</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {idea.tags.split(',').map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-secondary/50">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {idea.ai_expanded && (
          <Card className="p-6 border-dashed border-2 border-primary/30 bg-primary/5 mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="bg-primary/20 text-primary h-6 w-6 rounded-full flex items-center justify-center mr-2">
                AI
              </span>
              AI增强内容
            </h3>
            <p className="text-muted-foreground italic mb-4">
              AI已经分析并扩展了您的创意，提供更深入的见解和潜在应用场景。
            </p>
            <Separator className="my-4" />
            <div className="prose max-w-none">
              <h4 className="text-lg font-medium mb-2">潜在市场</h4>
              <p>基于您的创意描述，可能适合的目标市场包括[目标市场示例]。</p>
              
              <h4 className="text-lg font-medium mt-4 mb-2">发展方向</h4>
              <p>您的创意可以进一步发展为[创意扩展示例]。</p>
              
              <h4 className="text-lg font-medium mt-4 mb-2">实施考虑</h4>
              <p>实现这个创意时需要考虑[实施考虑示例]。</p>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default IdeaDetail;
