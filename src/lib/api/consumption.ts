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
  quantitySacks: number;
  dailyConsumption: number;
  estimatedFinishDate: string | null;
  daysRemaining: number | null;
}

function convertToKg(qty: number, unit: string): number {
  if (unit === "किलो") return qty;
  if (unit === "बाल्टिन") return qty * 12.5;
  if (unit === "बोरा") return qty * 50;
  return qty;
}

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
    console.error("Error fetching by batch:", error);
    throw error;
  }
}

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
    console.error("Error fetching by feed type:", error);
    throw error;
  }
}

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
    console.error("Error fetching by date range:", error);
    throw error;
  }
}

// NEW: Check available stock for a feed type
export async function getAvailableStock(feedType: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("feed_stock_summary")
      .select("quantity_kg")
      .eq("feed_type", feedType)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No record found, return 0
        return 0;
      }
      throw error;
    }

    return data?.quantity_kg || 0;
  } catch (error) {
    console.error("Error fetching available stock:", error);
    throw error;
  }
}

export async function createConsumptionRecord(consumptionData: {
  batch: string;
  feedType: string;
  feedName: string;
  quantityUsed: number;
  unit: string;
  consumptionDate: string;
}): Promise<number> {
  try {
    // Convert to kg for validation
    const consumedKg = convertToKg(
      consumptionData.quantityUsed,
      consumptionData.unit
    );

    // Check available stock BEFORE creating record
    const availableStock = await getAvailableStock(consumptionData.feedType);

    if (availableStock < consumedKg) {
      throw new Error(
        `अपर्याप्त स्टक! उपलब्ध: ${availableStock.toFixed(
          2
        )} किलो, आवश्यक: ${consumedKg.toFixed(2)} किलो`
      );
    }

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

    // Decrease stock after successful insert
    await adjustFeedStockQuantity(consumptionData.feedType, -consumedKg);

    return data.id;
  } catch (error) {
    console.error("Error creating consumption record:", error);
    throw error;
  }
}

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

export async function deleteConsumptionRecord(id: number): Promise<void> {
  try {
    const { data: record, error: fetchError } = await supabase
      .from("feed_consumption")
      .select("feed_type, quantity_used, unit")
      .eq("id", id)
      .single();
    if (fetchError) throw fetchError;

    const { error: delError } = await supabase
      .from("feed_consumption")
      .delete()
      .eq("id", id);
    if (delError) throw delError;

    // Revert stock
    const revertedKg = convertToKg(record.quantity_used, record.unit);
    await adjustFeedStockQuantity(record.feed_type, revertedKg);
  } catch (error) {
    console.error("Error deleting consumption record:", error);
    throw error;
  }
}

export async function adjustFeedStockQuantity(
  feedType: string,
  deltaKg: number
): Promise<void> {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from("feed_stock_summary")
      .select("quantity_kg")
      .eq("feed_type", feedType)
      .single();

    let currentKg = 0;
    if (!fetchError && existing) {
      currentKg = existing.quantity_kg || 0;
    } else if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    const newKg = Math.max(0, currentKg + deltaKg);
    const newBuckets = newKg / 12.5;
    const newSacks = newKg / 50;

    // Calculate daily consumption based on ACTUAL days with data (not fixed 7 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000)
      .toISOString()
      .split("T")[0];

    const { data: recentConsumption } = await supabase
      .from("feed_consumption")
      .select("quantity_used, unit, consumption_date")
      .eq("feed_type", feedType)
      .gte("consumption_date", thirtyDaysAgo);

    let dailyConsumption = 0;
    if (recentConsumption && recentConsumption.length > 0) {
      // Group by date to get actual days
      const consumptionByDate = recentConsumption.reduce((acc, rec) => {
        const date = rec.consumption_date;
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += convertToKg(rec.quantity_used, rec.unit);
        return acc;
      }, {} as Record<string, number>);

      // Calculate average based on actual number of days with consumption
      const daysWithConsumption = Object.keys(consumptionByDate).length;
      const totalKg = Object.values(consumptionByDate).reduce(
        (sum, kg) => sum + kg,
        0
      );

      if (daysWithConsumption > 0) {
        dailyConsumption = totalKg / daysWithConsumption;
      }
    }

    let daysRemaining: number | null = null;
    let estimatedFinishDate: string | null = null;
    if (dailyConsumption > 0.01 && newKg > 0) {
      daysRemaining = Math.ceil(newKg / dailyConsumption);
      const finishDate = new Date();
      finishDate.setDate(finishDate.getDate() + daysRemaining);
      estimatedFinishDate = finishDate.toISOString().split("T")[0];
    }

    // Upsert into feed_stock_summary
    const upsertData = {
      feed_type: feedType,
      quantity_kg: newKg,
      quantity_buckets: newBuckets,
      quantity_sacks: newSacks,
      daily_consumption: dailyConsumption,
      estimated_finish_date: estimatedFinishDate,
      days_remaining: daysRemaining,
      updated_at: new Date().toISOString(),
    };

    const { error: upsertError } = await supabase
      .from("feed_stock_summary")
      .upsert(upsertData, { onConflict: "feed_type" });

    if (upsertError) throw upsertError;
  } catch (error) {
    console.error("Error adjusting feed stock:", error);
    throw error;
  }
}

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
      quantityKg: record.quantity_kg || 0,
      quantityBuckets: record.quantity_buckets || 0,
      quantitySacks: record.quantity_sacks || 0,
      dailyConsumption: record.daily_consumption || 0,
      estimatedFinishDate: record.estimated_finish_date,
      daysRemaining: record.days_remaining,
    }));
  } catch (error) {
    console.error("Error fetching feed stock summary:", error);
    throw error;
  }
}

export async function getDailyConsumptionTrend(
  feedType: string,
  days: number = 30
) {
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
    const groupedData = (data || []).reduce((acc, record) => {
      const date = record.consumption_date;
      const quantityInKg = convertToKg(record.quantity_used, record.unit);
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
      const quantityInKg = convertToKg(record.quantity_used, record.unit);
      return sum + quantityInKg;
    }, 0);
    return total;
  } catch (error) {
    console.error("Error calculating total consumption by batch:", error);
    throw error;
  }
}
