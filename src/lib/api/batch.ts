// lib/api/batch.ts
import { supabase } from "../supabase";
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
  medications: { date: string; name: string }[];
  paymentProofName: string;
  paymentProofPath: string;
}

// Get all batches with their vaccinations and medications
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
          })),
          paymentProofName: batch.payment_proof_name || "",
          paymentProofPath: batch.payment_proof_path || "",
        };
      })
    );

    return batchesWithDetails;
  } catch (error) {
    console.error("Error fetching batches:", error);
    throw error;
  }
}

// Get batch names for dropdown
export async function getBatchNames(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("batches")
      .select("batch_name")
      .order("date_of_arrival", { ascending: false });

    if (error) throw error;

    return (data || []).map((batch) => batch.batch_name);
  } catch (error) {
    console.error("Error fetching batch names:", error);
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

    // Upload file if provided
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

    // Handle file upload/update only if a new file is provided
    if (batchData.paymentProof) {
      paymentProofPath = await updatePoultryProof(
        batchData.oldPaymentProofPath || null,
        batchData.paymentProof,
        batchData.batchName
      );
      paymentProofName = batchData.paymentProof.name;
    }

    // Build update object with only defined values
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

    // Only update file fields if a new file was uploaded
    if (paymentProofPath !== undefined) {
      updateData.payment_proof_path = paymentProofPath;
      updateData.payment_proof_name = paymentProofName;
    }

    // Add updated_at timestamp
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
    // First get the batch to find the file path
    const { data: batch, error: fetchError } = await supabase
      .from("batches")
      .select("payment_proof_path")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // Delete the file if it exists
    if (batch?.payment_proof_path) {
      await deletePoultryProof(batch.payment_proof_path);
    }

    // Delete the batch record
    const { error } = await supabase.from("batches").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting batch:", error);
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
      if (error.code === "PGRST116") return null; // Not found
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error("Error getting batch ID:", error);
    throw error;
  }
}
