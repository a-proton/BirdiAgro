// lib/api/consumption.ts
import { supabase } from "../supabase";

export interface ConsumptionRecord {
  id: number;
  batch: string;
  feedType: string;
  feedName: string;
  quantityUsed: number;
  unit: string;
  consumptionDate: string;
}

export interface FeedStockSummary {
  id: number;
  feedType: string;
  quantityKg: number;
  quantityBuckets: number;
  dailyConsumption: number;
  estimatedFinishDate: string | null;
  daysRemaining: number | null;
}

/**
 * Get all consumption records
 * @returns Array of consumption records
 */
export async function getAllConsumptionRecords(): Promise<ConsumptionRecord[]> {
  try {
    const { data, error } = await supabase
      .from("feed_consumption")
      .select("*")
      .order("consumption_date", { ascending: false });

    if (error) throw error;

    return (data || []).map((record) => ({
      id: record.id,
      batch: record.batch,
      feedType: record.feed_type,
      feedName: record.feed_name,
      quantityUsed: record.quantity_used,
      unit: record.unit,
      consumptionDate: record.consumption_date,
    }));
  } catch (error) {
    console.error("Error fetching consumption records:", error);
    throw error;
  }
}

/**
 * Get consumption records by batch
 * @param batch - The batch name
 * @returns Array of consumption records
 */
export async function getConsumptionRecordsByBatch(
  batch: string
): Promise<ConsumptionRecord[]> {
  try {
    const { data, error } = await supabase
      .from("feed_consumption")
      .select("*")
      .eq("batch", batch)
      .order("consumption_date", { ascending: false });

    if (error) throw error;

    return (data || []).map((record) => ({
      id: record.id,
      batch: record.batch,
      feedType: record.feed_type,
      feedName: record.feed_name,
      quantityUsed: record.quantity_used,
      unit: record.unit,
      consumptionDate: record.consumption_date,
    }));
  } catch (error) {
    console.error("Error fetching consumption records by batch:", error);
    throw error;
  }
}

/**
 * Get consumption records by feed type
 * @param feedType - The feed type (B0, B1, B2)
 * @returns Array of consumption records
 */
export async function getConsumptionRecordsByFeedType(
  feedType: string
): Promise<ConsumptionRecord[]> {
  try {
    const { data, error } = await supabase
      .from("feed_consumption")
      .select("*")
      .eq("feed_type", feedType)
      .order("consumption_date", { ascending: false });

    if (error) throw error;

    return (data || []).map((record) => ({
      id: record.id,
      batch: record.batch,
      feedType: record.feed_type,
      feedName: record.feed_name,
      quantityUsed: record.quantity_used,
      unit: record.unit,
      consumptionDate: record.consumption_date,
    }));
  } catch (error) {
    console.error("Error fetching consumption records by feed type:", error);
    throw error;
  }
}

/**
 * Get consumption records for date range
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of consumption records
 */
export async function getConsumptionRecordsByDateRange(
  startDate: string,
  endDate: string
): Promise<ConsumptionRecord[]> {
  try {
    const { data, error } = await supabase
      .from("feed_consumption")
      .select("*")
      .gte("consumption_date", startDate)
      .lte("consumption_date", endDate)
      .order("consumption_date", { ascending: false });

    if (error) throw error;

    return (data || []).map((record) => ({
      id: record.id,
      batch: record.batch,
      feedType: record.feed_type,
      feedName: record.feed_name,
      quantityUsed: record.quantity_used,
      unit: record.unit,
      consumptionDate: record.consumption_date,
    }));
  } catch (error) {
    console.error("Error fetching consumption records by date range:", error);
    throw error;
  }
}

/**
 * Create a new consumption record
 * @param consumptionData - The consumption data
 * @returns The created consumption record ID
 */
export async function createConsumptionRecord(consumptionData: {
  batch: string;
  feedType: string;
  feedName: string;
  quantityUsed: number;
  unit: string;
  consumptionDate: string;
}): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("feed_consumption")
      .insert({
        batch: consumptionData.batch,
        feed_type: consumptionData.feedType,
        feed_name: consumptionData.feedName,
        quantity_used: consumptionData.quantityUsed,
        unit: consumptionData.unit,
        consumption_date: consumptionData.consumptionDate,
      })
      .select("id")
      .single();

    if (error) throw error;

    return data.id;
  } catch (error) {
    console.error("Error creating consumption record:", error);
    throw error;
  }
}

/**
 * Update a consumption record
 * @param id - The consumption record ID
 * @param consumptionData - The consumption data to update
 */
export async function updateConsumptionRecord(
  id: number,
  consumptionData: {
    batch?: string;
    feedType?: string;
    feedName?: string;
    quantityUsed?: number;
    unit?: string;
    consumptionDate?: string;
  }
): Promise<void> {
  try {
    const updateData: Record<string, string | number | undefined> = {};

    if (consumptionData.batch !== undefined)
      updateData.batch = consumptionData.batch;
    if (consumptionData.feedType !== undefined)
      updateData.feed_type = consumptionData.feedType;
    if (consumptionData.feedName !== undefined)
      updateData.feed_name = consumptionData.feedName;
    if (consumptionData.quantityUsed !== undefined)
      updateData.quantity_used = consumptionData.quantityUsed;
    if (consumptionData.unit !== undefined)
      updateData.unit = consumptionData.unit;
    if (consumptionData.consumptionDate !== undefined)
      updateData.consumption_date = consumptionData.consumptionDate;

    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from("feed_consumption")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating consumption record:", error);
    throw error;
  }
}

/**
 * Delete a consumption record
 * @param id - The consumption record ID
 */
export async function deleteConsumptionRecord(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from("feed_consumption")
      .delete()
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting consumption record:", error);
    throw error;
  }
}

/**
 * Get feed stock summary
 * @returns Array of feed stock summaries
 */
export async function getFeedStockSummary(): Promise<FeedStockSummary[]> {
  try {
    const { data, error } = await supabase
      .from("feed_stock_summary")
      .select("*")
      .order("feed_type", { ascending: true });

    if (error) throw error;

    return (data || []).map((record) => ({
      id: record.id,
      feedType: record.feed_type,
      quantityKg: record.quantity_kg,
      quantityBuckets: record.quantity_buckets,
      dailyConsumption: record.daily_consumption,
      estimatedFinishDate: record.estimated_finish_date,
      daysRemaining: record.days_remaining,
    }));
  } catch (error) {
    console.error("Error fetching feed stock summary:", error);
    throw error;
  }
}

/**
 * Update feed stock quantity manually
 * @param feedType - The feed type (B0, B1, B2)
 * @param quantityKg - New quantity in kg
 */
export async function updateFeedStockQuantity(
  feedType: string,
  quantityKg: number
): Promise<void> {
  try {
    const quantityBuckets = quantityKg / 12.5;

    const { error } = await supabase
      .from("feed_stock_summary")
      .update({
        quantity_kg: quantityKg,
        quantity_buckets: quantityBuckets,
        updated_at: new Date().toISOString(),
      })
      .eq("feed_type", feedType);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating feed stock quantity:", error);
    throw error;
  }
}

/**
 * Get daily consumption trend for a feed type
 * @param feedType - The feed type (B0, B1, B2)
 * @param days - Number of days to look back (default: 30)
 * @returns Array of daily consumption data
 */
export async function getDailyConsumptionTrend(
  feedType: string,
  days: number = 30
): Promise<{ date: string; totalConsumption: number }[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("feed_consumption")
      .select("consumption_date, quantity_used, unit")
      .eq("feed_type", feedType)
      .gte("consumption_date", startDate.toISOString().split("T")[0])
      .order("consumption_date", { ascending: true });

    if (error) throw error;

    // Group by date and sum consumption
    const groupedData = (data || []).reduce((acc, record) => {
      const date = record.consumption_date;
      let quantityInKg = record.quantity_used;

      // Convert to kg
      if (record.unit === "बाल्टिन") {
        quantityInKg = record.quantity_used * 12.5;
      } else if (record.unit === "बोरा") {
        quantityInKg = record.quantity_used * 50;
      }

      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += quantityInKg;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(groupedData).map(([date, totalConsumption]) => ({
      date,
      totalConsumption,
    }));
  } catch (error) {
    console.error("Error fetching daily consumption trend:", error);
    throw error;
  }
}

/**
 * Get total consumption by batch
 * @param batch - The batch name
 * @returns Total consumption in kg
 */
export async function getTotalConsumptionByBatch(
  batch: string
): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("feed_consumption")
      .select("quantity_used, unit")
      .eq("batch", batch);

    if (error) throw error;

    const total = (data || []).reduce((sum, record) => {
      let quantityInKg = record.quantity_used;

      // Convert to kg
      if (record.unit === "बाल्टिन") {
        quantityInKg = record.quantity_used * 12.5;
      } else if (record.unit === "बोरा") {
        quantityInKg = record.quantity_used * 50;
      }

      return sum + quantityInKg;
    }, 0);

    return total;
  } catch (error) {
    console.error("Error calculating total consumption by batch:", error);
    throw error;
  }
}
