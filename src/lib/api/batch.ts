// lib/api/batch.ts
import { createClient } from "../supabase/client";
import {
  uploadPoultryProof,
  updatePoultryProof,
  deletePoultryProof,
} from "./storage";

export interface BatchWithDetails {
  id: number;
  batchName: string;
  dateOfArrival: string;
  numberOfChicks?: number;
  price?: number;
  supplier?: string;
  vaccinations: { date: string; name: string }[];
  medications: {
    date: string;
    name: string;
    imageName?: string;
    imagePath?: string;
  }[];
  paymentProofName: string;
  paymentProofPath: string;
  remainingChickens?: number;
  totalDeaths?: number;
  totalSold?: number;
}
const supabase = createClient();
//changed function
export const getRemainingChickens = async (batchId: string | number | null) => {
  try {
    // Get batch details (including number_of_chicks and batch_name)
    const { data: batch, error: batchError } = await supabase
      .from("batches")
      .select("number_of_chicks, batch_name")
      .eq("id", batchId)
      .single();

    if (batchError) throw batchError;

    const initialCount = batch?.number_of_chicks || 0;

    // Get total deaths for this batch
    const { data: deaths, error: deathsError } = await supabase
      .from("deaths")
      .select("number_of_deaths")
      .eq("batch_id", batchId);

    if (deathsError) throw deathsError;

    const totalDeaths = (deaths || []).reduce(
      (sum: number, d: { number_of_deaths: number }) =>
        sum + d.number_of_deaths,
      0
    );

    // Get total sold chickens for this batch
    const { data: sales, error: salesError } = await supabase
      .from("sales")
      .select("chicken_count")
      .eq("type", "kukhura")
      .eq("batch_name", batch?.batch_name);

    if (salesError) throw salesError;

    const totalSold = (sales || []).reduce(
      (sum, s) => sum + s.chicken_count,
      0
    );

    // Calculate remaining chickens
    const remaining = initialCount - totalDeaths - totalSold;

    return {
      batch_name: batch?.batch_name,
      initialCount,
      totalDeaths,
      totalSold,
      remaining: remaining < 0 ? 0 : remaining, // safety check
    };
  } catch (error) {
    console.error("Error fetching remaining chickens:", error);
    throw error;
  }
};

// Get batch statistics
export async function getBatchStats(batchId: number): Promise<{
  initial: number;
  deaths: number;
  sold: number;
  remaining: number;
}> {
  try {
    // Get batch initial count
    const { data: batch, error: batchError } = await supabase
      .from("batches")
      .select("number_of_chicks, batch_name")
      .eq("id", batchId)
      .single();

    if (batchError) throw batchError;

    const initialCount = batch?.number_of_chicks || 0;

    // Get total deaths
    const { data: deaths, error: deathsError } = await supabase
      .from("deaths")
      .select("number_of_deaths")
      .eq("batch_id", batchId);

    if (deathsError) throw deathsError;

    const totalDeaths = (deaths || []).reduce(
      (sum, d) => sum + d.number_of_deaths,
      0
    );

    // Get total sold
    const { data: sales, error: salesError } = await supabase
      .from("sales")
      .select("chicken_count")
      .eq("type", "kukhura")
      .eq("batch_name", batch?.batch_name);

    if (salesError) throw salesError;

    const totalSold = (sales || []).reduce(
      (sum, s) => sum + (s.chicken_count || 0),
      0
    );

    return {
      initial: initialCount,
      deaths: totalDeaths,
      sold: totalSold,
      remaining: initialCount - totalDeaths - totalSold,
    };
  } catch (error) {
    console.error("Error getting batch stats:", error);
    throw error;
  }
}

// Get all batches with their vaccinations, medications, and remaining counts
export async function getAllBatches(): Promise<BatchWithDetails[]> {
  try {
    const { data: batches, error: batchError } = await supabase
      .from("batches")
      .select("*")
      .order("date_of_arrival", { ascending: false });

    if (batchError) throw batchError;

    const batchesWithDetails = await Promise.all(
      (batches || []).map(async (batch) => {
        const { data: vaccinations } = await supabase
          .from("vaccinations")
          .select("*")
          .eq("batch_id", batch.id)
          .order("vaccination_date", { ascending: true });

        const { data: medications } = await supabase
          .from("medications")
          .select("*")
          .eq("batch_id", batch.id)
          .order("medication_date", { ascending: true });

        // Get batch statistics
        const stats = await getBatchStats(batch.id);

        return {
          id: batch.id,
          batchName: batch.batch_name,
          dateOfArrival: batch.date_of_arrival,
          numberOfChicks: batch.number_of_chicks || undefined,
          price: batch.price || undefined,
          supplier: batch.supplier || undefined,
          vaccinations: (vaccinations || []).map((v) => ({
            date: v.vaccination_date,
            name: v.vaccination_name,
          })),
          medications: (medications || []).map((m) => ({
            date: m.medication_date,
            name: m.medication_name,
            imageName: m.medication_image_name || undefined,
            imagePath: m.medication_image_path || undefined,
          })),
          paymentProofName: batch.payment_proof_name || "",
          paymentProofPath: batch.payment_proof_path || "",
          remainingChickens: stats.remaining,
          totalDeaths: stats.deaths,
          totalSold: stats.sold,
        };
      })
    );

    return batchesWithDetails;
  } catch (error) {
    console.error("Error fetching batches:", error);
    throw error;
  }
}

// Get batch names for dropdown (only batches with remaining chickens)
export async function getBatchNames(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("batches")
      .select("id, batch_name")
      .order("date_of_arrival", { ascending: false });

    if (error) throw error;

    // Filter batches with remaining chickens
    const batchesWithStock = await Promise.all(
      (data || []).map(async (batch) => {
        const remaining = await getRemainingChickens(batch.id);
        return remaining.remaining > 0 ? batch.batch_name : null;
      })
    );

    return batchesWithStock.filter((name): name is string => name !== null);
  } catch (error) {
    console.error("Error fetching batch names:", error);
    throw error;
  }
}

// Get batch ID by name
export async function getBatchIdByName(
  batchName: string
): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from("batches")
      .select("id")
      .eq("batch_name", batchName)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error("Error getting batch ID:", error);
    throw error;
  }
}

// Create a new batch
export async function createBatch(batchData: {
  batchName: string;
  dateOfArrival: string;
  numberOfChicks?: number;
  price?: number;
  supplier?: string;
  paymentProof?: File | null;
}): Promise<number> {
  try {
    let paymentProofPath: string | null = null;
    let paymentProofName: string | null = null;

    if (batchData.paymentProof) {
      paymentProofPath = await uploadPoultryProof(
        batchData.paymentProof,
        batchData.batchName
      );
      paymentProofName = batchData.paymentProof.name;
    }

    const { data, error } = await supabase
      .from("batches")
      .insert({
        batch_name: batchData.batchName,
        date_of_arrival: batchData.dateOfArrival,
        number_of_chicks: batchData.numberOfChicks,
        price: batchData.price,
        supplier: batchData.supplier,
        payment_proof_name: paymentProofName,
        payment_proof_path: paymentProofPath,
      })
      .select("id")
      .single();

    if (error) throw error;

    return data.id;
  } catch (error) {
    console.error("Error creating batch:", error);
    throw error;
  }
}

// Update a batch
export async function updateBatch(
  id: number,
  batchData: {
    batchName?: string;
    dateOfArrival?: string;
    numberOfChicks?: number;
    price?: number;
    supplier?: string;
    paymentProof?: File | null;
    oldPaymentProofPath?: string | null;
  }
): Promise<void> {
  try {
    let paymentProofPath: string | null | undefined = undefined;
    let paymentProofName: string | null | undefined = undefined;

    if (batchData.paymentProof) {
      paymentProofPath = await updatePoultryProof(
        batchData.oldPaymentProofPath || null,
        batchData.paymentProof,
        batchData.batchName
      );
      paymentProofName = batchData.paymentProof.name;
    }

    const updateData: Record<string, string | number | null | undefined> = {};

    if (batchData.batchName !== undefined)
      updateData.batch_name = batchData.batchName;
    if (batchData.dateOfArrival !== undefined)
      updateData.date_of_arrival = batchData.dateOfArrival;
    if (batchData.numberOfChicks !== undefined)
      updateData.number_of_chicks = batchData.numberOfChicks;
    if (batchData.price !== undefined) updateData.price = batchData.price;
    if (batchData.supplier !== undefined)
      updateData.supplier = batchData.supplier;

    if (paymentProofPath !== undefined) {
      updateData.payment_proof_path = paymentProofPath;
      updateData.payment_proof_name = paymentProofName;
    }

    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from("batches")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating batch:", error);
    throw error;
  }
}

// Delete a batch
export async function deleteBatch(id: number): Promise<void> {
  try {
    const { data: batch, error: fetchError } = await supabase
      .from("batches")
      .select("payment_proof_path")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    if (batch?.payment_proof_path) {
      await deletePoultryProof(batch.payment_proof_path);
    }

    const { error } = await supabase.from("batches").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting batch:", error);
    throw error;
  }
}
