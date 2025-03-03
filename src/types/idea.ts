
export interface Idea {
  id: string;
  title: string;
  description: string;
  excerpt?: string;
  category: string;
  tags?: string;
  ai_expanded: boolean;
  created_at: string;
  user_id?: string;
}

export type NewIdea = Omit<Idea, 'id' | 'created_at' | 'ai_expanded' | 'excerpt'>;
