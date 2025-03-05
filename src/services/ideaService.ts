
import { supabase } from "@/integrations/supabase/client";
import { Idea, NewIdea } from "@/types/idea";

export async function fetchIdeas(): Promise<Idea[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  
  // 确保只获取当前用户的创意
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("user_id", sessionData.session?.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("获取创意错误:", error);
    throw error;
  }

  return data || [];
}

export async function fetchIdeaById(id: string): Promise<Idea | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("id", id)
    .eq("user_id", sessionData.session?.user.id)
    .maybeSingle();

  if (error) {
    console.error("获取创意详情错误:", error);
    throw error;
  }

  return data;
}

export async function createIdea(idea: NewIdea): Promise<Idea> {
  const { data: sessionData } = await supabase.auth.getSession();
  
  // 确保设置用户ID
  const ideaWithUserId = {
    ...idea,
    user_id: sessionData.session?.user.id
  };
  
  const { data, error } = await supabase
    .from("ideas")
    .insert(ideaWithUserId)
    .select()
    .single();

  if (error) {
    console.error("创建创意错误:", error);
    throw error;
  }

  return data;
}

export async function updateIdea(id: string, idea: Partial<Idea>): Promise<Idea> {
  const { data: sessionData } = await supabase.auth.getSession();
  
  const { data, error } = await supabase
    .from("ideas")
    .update({ 
      ...idea, 
      updated_at: new Date().toISOString(),
      user_id: sessionData.session?.user.id // 确保更新时保留用户ID
    })
    .eq("id", id)
    .eq("user_id", sessionData.session?.user.id) // 确保只更新当前用户的创意
    .select()
    .single();

  if (error) {
    console.error("更新创意错误:", error);
    throw error;
  }

  return data;
}

export async function deleteIdea(id: string): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  
  const { error } = await supabase
    .from("ideas")
    .delete()
    .eq("id", id)
    .eq("user_id", sessionData.session?.user.id); // 确保只删除当前用户的创意

  if (error) {
    console.error("删除创意错误:", error);
    throw error;
  }
}
