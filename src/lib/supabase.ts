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
          payment_proof_name: string | null;
          payment_proof_path: string | null;
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
          payment_proof_name?: string | null;
          payment_proof_path?: string | null;
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
          payment_proof_name?: string | null;
          payment_proof_path?: string | null;
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
          medication_image_name: string | null;
          medication_image_path: string | null;
          duration: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          batch_id: number;
          medication_name: string;
          medication_date: string;
          medication_image_name?: string | null;
          medication_image_path?: string | null;
          duration?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          batch_id?: number;
          medication_name?: string;
          medication_date?: string;
          medication_image_name?: string | null;
          medication_image_path?: string | null;
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
      feed_inventory: {
        Row: {
          id: number;
          feed_name: string;
          feed_type: string;
          quantity: string;
          date_of_order: string;
          price: string;
          supplier: string;
          mode_of_payment: string;
          payment_proof_name: string | null;
          payment_proof_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          feed_name: string;
          feed_type: string;
          quantity: string;
          date_of_order: string;
          price: string;
          supplier: string;
          mode_of_payment: string;
          payment_proof_name?: string | null;
          payment_proof_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          feed_name?: string;
          feed_type?: string;
          quantity?: string;
          date_of_order?: string;
          price?: string;
          supplier?: string;
          mode_of_payment?: string;
          payment_proof_name?: string | null;
          payment_proof_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      feed_consumption: {
        Row: {
          id: number;
          batch: string;
          feed_type: string;
          feed_name: string;
          quantity_used: number;
          unit: string;
          consumption_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          batch: string;
          feed_type: string;
          feed_name: string;
          quantity_used: number;
          unit: string;
          consumption_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          batch?: string;
          feed_type?: string;
          feed_name?: string;
          quantity_used?: number;
          unit?: string;
          consumption_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      feed_stock_summary: {
        Row: {
          id: number;
          feed_type: string;
          quantity_kg: number;
          quantity_buckets: number;
          daily_consumption: number;
          estimated_finish_date: string | null;
          days_remaining: number | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          feed_type: string;
          quantity_kg?: number;
          quantity_buckets?: number;
          daily_consumption?: number;
          estimated_finish_date?: string | null;
          days_remaining?: number | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          feed_type?: string;
          quantity_kg?: number;
          quantity_buckets?: number;
          daily_consumption?: number;
          estimated_finish_date?: string | null;
          days_remaining?: number | null;
          updated_at?: string;
        };
      };
    };
  };
}
