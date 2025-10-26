// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      batches: {
        Row: {
          id: number;
          batch_name: string;
          date_of_arrival: string;
          number_of_chicks: number | null;
          price: number | null;
          supplier: string | null;
          payment_proof: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          batch_name: string;
          date_of_arrival: string;
          number_of_chicks?: number | null;
          price?: number | null;
          supplier?: string | null;
          payment_proof?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          batch_name?: string;
          date_of_arrival?: string;
          number_of_chicks?: number | null;
          price?: number | null;
          supplier?: string | null;
          payment_proof?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      vaccinations: {
        Row: {
          id: number;
          batch_id: number;
          vaccination_name: string;
          vaccination_date: string;
          week: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          batch_id: number;
          vaccination_name: string;
          vaccination_date: string;
          week?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          batch_id?: number;
          vaccination_name?: string;
          vaccination_date?: string;
          week?: string | null;
          created_at?: string;
        };
      };
      medications: {
        Row: {
          id: number;
          batch_id: number;
          medication_name: string;
          medication_date: string;
          duration: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          batch_id: number;
          medication_name: string;
          medication_date: string;
          duration?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          batch_id?: number;
          medication_name?: string;
          medication_date?: string;
          duration?: number | null;
          created_at?: string;
        };
      };
      deaths: {
        Row: {
          id: number;
          batch_id: number;
          date_of_death: string;
          number_of_deaths: number;
          cause: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          batch_id: number;
          date_of_death: string;
          number_of_deaths: number;
          cause?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          batch_id?: number;
          date_of_death?: string;
          number_of_deaths?: number;
          cause?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      expenses: {
        Row: {
          id: number;
          category: string;
          batch: string | null;
          title: string;
          amount: number;
          date: string;
          payment_method: string;
          is_paid: boolean;
          payment_proof_name: string | null;
          payment_proof_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          category: string;
          batch?: string | null;
          title: string;
          amount: number;
          date: string;
          payment_method: string;
          is_paid?: boolean;
          payment_proof_name?: string | null;
          payment_proof_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          category?: string;
          batch?: string | null;
          title?: string;
          amount?: number;
          date?: string;
          payment_method?: string;
          is_paid?: boolean;
          payment_proof_name?: string | null;
          payment_proof_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
