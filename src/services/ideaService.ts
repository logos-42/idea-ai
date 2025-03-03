
import { supabase } from "@/integrations/supabase/client";
import { Idea, NewIdea } from "@/types/idea";

export async function fetchIdeas(): Promise<Idea[]> {
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("获取创意错误:", error);
    throw error;
  }

  return data || [];
}

export async function fetchIdeaById(id: string): Promise<Idea | null> {
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("获取创意详情错误:", error);
    throw error;
  }

  return data;
}

export async function createIdea(idea: NewIdea): Promise<Idea> {
  const { data, error } = await supabase
    .from("ideas")
    .insert(idea)
    .select()
    .single();

  if (error) {
    console.error("创建创意错误:", error);
    throw error;
  }

  return data;
}

export async function updateIdea(id: string, idea: Partial<Idea>): Promise<Idea> {
  const { data, error } = await supabase
    .from("ideas")
    .update({ ...idea, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("更新创意错误:", error);
    throw error;
  }

  return data;
}

export async function deleteIdea(id: string): Promise<void> {
  const { error } = await supabase
    .from("ideas")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("删除创意错误:", error);
    throw error;
  }
}
