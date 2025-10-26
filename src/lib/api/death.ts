// lib/api/deaths.ts
import { supabase } from "../supabase";

export interface Death {
  id: number;
  batchId: number;
  dateOfDeath: string;
  numberOfDeaths: number;
  cause?: string;
  notes?: string;
}

// Create a new death record
export async function createDeath(deathData: {
  batchId: number;
  dateOfDeath: string;
  numberOfDeaths: number;
  cause?: string;
  notes?: string;
}): Promise<Death> {
  try {
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
