
import { supabase } from "@/integrations/supabase/client";
import { Idea, NewIdea } from "@/types/idea";

export async function fetchIdeas(): Promise<Idea[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  
  if (!userId) {
    console.error("无法获取用户ID");
    return [];
  }
  
  // 首先尝试获取所有未分配用户ID的创意（针对现有数据）
  let { data: unassignedIdeas, error: unassignedError } = await supabase
    .from("ideas")
    .select("*")
    .is("user_id", null)
    .order("created_at", { ascending: false });
    
  if (unassignedError) {
    console.error("获取无主创意错误:", unassignedError);
  }
  
  // 如果存在未分配的创意，将它们分配给当前用户
  if (unassignedIdeas && unassignedIdeas.length > 0) {
    for (const idea of unassignedIdeas) {
      await supabase
        .from("ideas")
        .update({ user_id: userId })
        .eq("id", idea.id);
    }
    
    console.log(`已将${unassignedIdeas.length}个创意分配给当前用户`);
  }
  
  // 然后获取当前用户的所有创意
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("获取创意错误:", error);
    throw error;
  }

  return data || [];
}

export async function fetchIdeaById(id: string): Promise<Idea | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  
  if (!userId) {
    console.error("无法获取用户ID");
    return null;
  }
  
  // 先检查这个创意是否存在但没有用户ID
  const { data: unassignedIdea, error: unassignedError } = await supabase
    .from("ideas")
    .select("*")
    .eq("id", id)
    .is("user_id", null)
    .maybeSingle();
    
  if (unassignedIdea) {
    // 如果存在未分配的创意，将其分配给当前用户
    await supabase
      .from("ideas")
      .update({ user_id: userId })
      .eq("id", id);
      
    console.log(`已将创意 ${id} 分配给当前用户`);
  }
  
  // 然后获取创意详情
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
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
