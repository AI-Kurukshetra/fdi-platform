export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          name?: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id: string;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          name?: string | null;
        };
        Relationships: [];
      };
      accounts: {
        Row: {
          balance: number;
          bank_name?: string | null;
          created_at: string;
          currency?: string | null;
          id: string;
          name: string;
          type?: string | null;
          user_id: string;
        };
        Insert: {
          balance?: number;
          bank_name?: string | null;
          created_at?: string;
          currency?: string | null;
          id?: string;
          name: string;
          type?: string | null;
          user_id: string;
        };
        Update: {
          balance?: number;
          bank_name?: string | null;
          created_at?: string;
          currency?: string | null;
          id?: string;
          name?: string;
          type?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string;
          color?: string | null;
          icon?: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          color?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          color?: string | null;
          icon?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          account_id?: string | null;
          amount: number;
          category: string;
          category_id?: string | null;
          created_at: string;
          date: string;
          description: string;
          id: string;
          is_recurring?: boolean | null;
          merchant: string;
          merchant_name?: string | null;
          type?: string | null;
          user_id: string;
        };
        Insert: {
          account_id?: string | null;
          amount: number;
          category: string;
          category_id?: string | null;
          created_at?: string;
          date: string;
          description?: string;
          id?: string;
          is_recurring?: boolean | null;
          merchant: string;
          merchant_name?: string | null;
          type?: string | null;
          user_id: string;
        };
        Update: {
          account_id?: string | null;
          amount?: number;
          category?: string;
          category_id?: string | null;
          created_at?: string;
          date?: string;
          description?: string;
          id?: string;
          is_recurring?: boolean | null;
          merchant?: string;
          merchant_name?: string | null;
          type?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      insights: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          type: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          type: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type TransactionRow = Database["public"]["Tables"]["transactions"]["Row"];
export type InsightRow = Database["public"]["Tables"]["insights"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
