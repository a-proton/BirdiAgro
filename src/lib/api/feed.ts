// lib/api/feed.ts
import { supabase } from "../supabase";
import {
  uploadPaymentProof,
  updatePaymentProof,
  deletePaymentProof,
} from "./storage";

export interface FeedRecord {
  id: number;
  feedName: string;
  feedType: string;
  quantity: string;
  dateOfOrder: string;
  price: string;
  supplier: string;
  modeOfPayment: string;
  paymentProofName: string;
  paymentProofPath: string;
}

/**
 * Get all feed inventory records
 * @returns Array of feed records
 */
export async function getAllFeedRecords(): Promise<FeedRecord[]> {
  try {
    const { data, error } = await supabase
      .from("feed_inventory")
      .select("*")
      .order("date_of_order", { ascending: false });

    if (error) throw error;

    return (data || []).map((record) => ({
      id: record.id,
      feedName: record.feed_name,
      feedType: record.feed_type,
      quantity: record.quantity,
      dateOfOrder: record.date_of_order,
      price: record.price,
      supplier: record.supplier,
      modeOfPayment: record.mode_of_payment,
      paymentProofName: record.payment_proof_name || "",
      paymentProofPath: record.payment_proof_path || "",
    }));
  } catch (error) {
    console.error("Error fetching feed records:", error);
    throw error;
  }
}

/**
 * Get feed records by type
 * @param feedType - The feed type (B0, B1, B2)
 * @returns Array of feed records
 */
export async function getFeedRecordsByType(
  feedType: string
): Promise<FeedRecord[]> {
  try {
    const { data, error } = await supabase
      .from("feed_inventory")
      .select("*")
      .eq("feed_type", feedType)
      .order("date_of_order", { ascending: false });

    if (error) throw error;

    return (data || []).map((record) => ({
      id: record.id,
      feedName: record.feed_name,
      feedType: record.feed_type,
      quantity: record.quantity,
      dateOfOrder: record.date_of_order,
      price: record.price,
      supplier: record.supplier,
      modeOfPayment: record.mode_of_payment,
      paymentProofName: record.payment_proof_name || "",
      paymentProofPath: record.payment_proof_path || "",
    }));
  } catch (error) {
    console.error("Error fetching feed records by type:", error);
    throw error;
  }
}

/**
 * Get a single feed record by ID
 * @param id - The feed record ID
 * @returns Feed record or null
 */
export async function getFeedRecordById(
  id: number
): Promise<FeedRecord | null> {
  try {
    const { data, error } = await supabase
      .from("feed_inventory")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return {
      id: data.id,
      feedName: data.feed_name,
      feedType: data.feed_type,
      quantity: data.quantity,
      dateOfOrder: data.date_of_order,
      price: data.price,
      supplier: data.supplier,
      modeOfPayment: data.mode_of_payment,
      paymentProofName: data.payment_proof_name || "",
      paymentProofPath: data.payment_proof_path || "",
    };
  } catch (error) {
    console.error("Error fetching feed record:", error);
    throw error;
  }
}

/**
 * Create a new feed record
 * @param feedData - The feed data
 * @returns The created feed record ID
 */
export async function createFeedRecord(feedData: {
  feedName: string;
  feedType: string;
  quantity: string;
  dateOfOrder: string;
  price: string;
  supplier: string;
  modeOfPayment: string;
  paymentProof?: File | null;
}): Promise<number> {
  try {
    let paymentProofPath: string | null = null;
    let paymentProofName: string | null = null;

    // Upload payment proof if provided
    if (feedData.paymentProof) {
      paymentProofPath = await uploadPaymentProof(
        feedData.paymentProof,
        feedData.feedType
      );
      paymentProofName = feedData.paymentProof.name;
    }

    const { data, error } = await supabase
      .from("feed_inventory")
      .insert({
        feed_name: feedData.feedName,
        feed_type: feedData.feedType,
        quantity: feedData.quantity,
        date_of_order: feedData.dateOfOrder,
        price: feedData.price,
        supplier: feedData.supplier,
        mode_of_payment: feedData.modeOfPayment,
        payment_proof_name: paymentProofName,
        payment_proof_path: paymentProofPath,
      })
      .select("id")
      .single();

    if (error) throw error;

    return data.id;
  } catch (error) {
    console.error("Error creating feed record:", error);
    throw error;
  }
}

/**
 * Update a feed record
 * @param id - The feed record ID
 * @param feedData - The feed data to update
 */
export async function updateFeedRecord(
  id: number,
  feedData: {
    feedName?: string;
    feedType?: string;
    quantity?: string;
    dateOfOrder?: string;
    price?: string;
    supplier?: string;
    modeOfPayment?: string;
    paymentProof?: File | null;
    oldPaymentProofPath?: string | null;
  }
): Promise<void> {
  try {
    let paymentProofPath: string | null | undefined = undefined;
    let paymentProofName: string | null | undefined = undefined;

    // Handle file upload/update only if a new file is provided
    if (feedData.paymentProof) {
      paymentProofPath = await updatePaymentProof(
        feedData.oldPaymentProofPath || null,
        feedData.paymentProof,
        feedData.feedType
      );
      paymentProofName = feedData.paymentProof.name;
    }

    // Build update object with only defined values
    const updateData: Record<string, string | null | undefined> = {};

    if (feedData.feedName !== undefined)
      updateData.feed_name = feedData.feedName;
    if (feedData.feedType !== undefined)
      updateData.feed_type = feedData.feedType;
    if (feedData.quantity !== undefined)
      updateData.quantity = feedData.quantity;
    if (feedData.dateOfOrder !== undefined)
      updateData.date_of_order = feedData.dateOfOrder;
    if (feedData.price !== undefined) updateData.price = feedData.price;
    if (feedData.supplier !== undefined)
      updateData.supplier = feedData.supplier;
    if (feedData.modeOfPayment !== undefined)
      updateData.mode_of_payment = feedData.modeOfPayment;

    // Only update file fields if a new file was uploaded
    if (paymentProofPath !== undefined) {
      updateData.payment_proof_path = paymentProofPath;
      updateData.payment_proof_name = paymentProofName;
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from("feed_inventory")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating feed record:", error);
    throw error;
  }
}

/**
 * Delete a feed record
 * @param id - The feed record ID
 */
export async function deleteFeedRecord(id: number): Promise<void> {
  try {
    // First get the record to find the file path
    const { data: record, error: fetchError } = await supabase
      .from("feed_inventory")
      .select("payment_proof_path")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // Delete the file if it exists
    if (record?.payment_proof_path) {
      await deletePaymentProof(record.payment_proof_path);
    }

    // Delete the record
    const { error } = await supabase
      .from("feed_inventory")
      .delete()
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting feed record:", error);
    throw error;
  }
}

/**
 * Get total feed inventory value
 * @returns Total value in rupees
 */
export async function getTotalFeedInventoryValue(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("feed_inventory")
      .select("price");

    if (error) throw error;

    const total = (data || []).reduce((sum, record) => {
      const priceString = record.price.replace(/Rs\s?|,/g, "");
      const priceNumber = parseFloat(priceString) || 0;
      return sum + priceNumber;
    }, 0);

    return total;
  } catch (error) {
    console.error("Error calculating total inventory value:", error);
    throw error;
  }
}
