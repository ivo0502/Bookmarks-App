export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          url: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          url: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          url?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Bookmark = Database['public']['Tables']['bookmarks']['Row'];
export type BookmarkInsert = Database['public']['Tables']['bookmarks']['Insert'];
export type BookmarkUpdate = Database['public']['Tables']['bookmarks']['Update'];
