// lib/api/deaths.ts
import { supabase } from "../supabase";
import { getRemainingChickens } from "./batch";

export interface Death {
  id: number;
  batchId: number;
  dateOfDeath: string;
  numberOfDeaths: number;
  cause?: string;
  notes?: string;
}

// Validate death count against available chickens
async function validateDeathCount(
  batchId: number,
  numberOfDeaths: number,
  excludeDeathId?: number
): Promise<{ valid: boolean; message?: string; available?: number }> {
  try {
    // Get batch initial count
    const { data: batch, error: batchError } = await supabase
      .from("batches")
      .select("number_of_chicks, batch_name")
      .eq("id", batchId)
      .single();

    if (batchError) throw batchError;

    const initialCount = batch?.number_of_chicks || 0;

    // Get total deaths (excluding current one if editing)
    const { data: deaths, error: deathsError } = await supabase
      .from("deaths")
      .select("number_of_deaths")
      .eq("batch_id", batchId);

    if (deathsError) throw deathsError;

    let totalDeaths = (deaths || []).reduce(
      (sum, d) => sum + d.number_of_deaths,
      0
    );

    // If editing, subtract the current death count
    if (excludeDeathId) {
      const { data: currentDeath } = await supabase
        .from("deaths")
        .select("number_of_deaths")
        .eq("id", excludeDeathId)
        .single();

      if (currentDeath) {
        totalDeaths -= currentDeath.number_of_deaths;
      }
    }

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

    const availableForDeath = initialCount - totalDeaths - totalSold;

    if (numberOfDeaths > availableForDeath) {
      return {
        valid: false,
        message: `यो ब्याचमा ${availableForDeath} मात्र कुखुरा उपलब्ध छन्। तपाईंले ${numberOfDeaths} मृत्यु रेकर्ड गर्न खोज्नुभयो।`,
        available: availableForDeath,
      };
    }

    return { valid: true, available: availableForDeath };
  } catch (error) {
    console.error("Error validating death count:", error);
    throw error;
  }
}

// Create a new death record with validation
export async function createDeath(deathData: {
  batchId: number;
  dateOfDeath: string;
  numberOfDeaths: number;
  cause?: string;
  notes?: string;
}): Promise<Death> {
  try {
    // Validate death count
    const validation = await validateDeathCount(
      deathData.batchId,
      deathData.numberOfDeaths
    );

    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const { data, error } = await supabase
      .from("deaths")
      .insert({
        batch_id: deathData.batchId,
        date_of_death: deathData.dateOfDeath,
        number_of_deaths: deathData.numberOfDeaths,
        cause: deathData.cause,
        notes: deathData.notes,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      batchId: data.batch_id,
      dateOfDeath: data.date_of_death,
      numberOfDeaths: data.number_of_deaths,
      cause: data.cause || undefined,
      notes: data.notes || undefined,
    };
  } catch (error) {
    console.error("Error creating death record:", error);
    throw error;
  }
}

// Update a death record with validation
export async function updateDeath(
  id: number,
  deathData: {
    batchId: number;
    dateOfDeath: string;
    numberOfDeaths: number;
    cause?: string;
    notes?: string;
  }
): Promise<void> {
  try {
    // Validate death count
    const validation = await validateDeathCount(
      deathData.batchId,
      deathData.numberOfDeaths,
      id // Exclude current death from validation
    );

    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const { error } = await supabase
      .from("deaths")
      .update({
        batch_id: deathData.batchId,
        date_of_death: deathData.dateOfDeath,
        number_of_deaths: deathData.numberOfDeaths,
        cause: deathData.cause,
        notes: deathData.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating death record:", error);
    throw error;
  }
}

// Get deaths by batch
export async function getDeathsByBatch(batchId: number): Promise<Death[]> {
  try {
    const { data, error } = await supabase
      .from("deaths")
      .select("*")
      .eq("batch_id", batchId)
      .order("date_of_death", { ascending: false });

    if (error) throw error;

    return (data || []).map((d) => ({
      id: d.id,
      batchId: d.batch_id,
      dateOfDeath: d.date_of_death,
      numberOfDeaths: d.number_of_deaths,
      cause: d.cause || undefined,
      notes: d.notes || undefined,
    }));
  } catch (error) {
    console.error("Error fetching deaths:", error);
    throw error;
  }
}

// Get all deaths
export async function getAllDeaths(): Promise<Death[]> {
  try {
    const { data, error } = await supabase
      .from("deaths")
      .select("*")
      .order("date_of_death", { ascending: false });

    if (error) throw error;

    return (data || []).map((d) => ({
      id: d.id,
      batchId: d.batch_id,
      dateOfDeath: d.date_of_death,
      numberOfDeaths: d.number_of_deaths,
      cause: d.cause || undefined,
      notes: d.notes || undefined,
    }));
  } catch (error) {
    console.error("Error fetching all deaths:", error);
    throw error;
  }
}

// Delete a death record
export async function deleteDeath(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("deaths").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting death record:", error);
    throw error;
  }
}

// Get total deaths by batch
export async function getTotalDeathsByBatch(batchId: number): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("deaths")
      .select("number_of_deaths")
      .eq("batch_id", batchId);

    if (error) throw error;

    return (data || []).reduce((sum, d) => sum + d.number_of_deaths, 0);
  } catch (error) {
    console.error("Error calculating total deaths:", error);
    throw error;
  }
}

// Get deaths with batch information
export async function getDeathsWithBatchInfo(): Promise<
  Array<Death & { batchName: string; batchInitialCount: number }>
> {
  try {
    const { data, error } = await supabase
      .from("deaths")
      .select(
        `
        *,
        batches (
          batch_name,
          number_of_chicks
        )
      `
      )
      .order("date_of_death", { ascending: false });

    if (error) throw error;

    return (data || []).map((d: any) => ({
      id: d.id,
      batchId: d.batch_id,
      dateOfDeath: d.date_of_death,
      numberOfDeaths: d.number_of_deaths,
      cause: d.cause || undefined,
      notes: d.notes || undefined,
      batchName: d.batches?.batch_name || "",
      batchInitialCount: d.batches?.number_of_chicks || 0,
    }));
  } catch (error) {
    console.error("Error fetching deaths with batch info:", error);
    throw error;
  }
}
