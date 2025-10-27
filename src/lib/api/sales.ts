// lib/api/sales.ts
import { supabase } from "../supabase";
import { getBatchIdByName, getRemainingChickens } from "./batch";

export interface Sale {
  id?: number;
  type: "kukhura" | "others";
  batchName?: string;
  productName?: string;
  chickenCount?: string;
  totalKgs: string;
  pricePerKg?: string;
  totalAmount: string;
  totalPcs?: string;
  soldTo: string;
  amountReceived: boolean;
  salesDate?: string;
}

export interface SaleStats {
  todaySales: number;
  thisMonthSales: number;
  totalSales: number;
  todayGrowth: number;
  monthGrowth: number;
  yearGrowth: number;
}

export const validateSaleQuantity = async (
  batchName: string,
  chickenCount: number,
  excludeSaleId?: string | number
) => {
  try {
    const batchId = await getBatchIdByName(batchName);
    const availableCount = await getRemainingChickens(batchId);

    if (chickenCount > availableCount.remaining) {
      return {
        valid: false,
        message: `यो ब्याचमा ${availableCount.remaining} मात्र कुखुरा उपलब्ध छन्। तपाईंले ${chickenCount} बिक्री गर्न खोज्नुभयो।`,
      };
    }

    return {
      valid: true,
      message: "ठीक छ। बिक्री गर्न सकिन्छ।",
    };
  } catch (error) {
    console.error("Error validating sale quantity:", error);
    return {
      valid: false,
      message: "कुनै त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोस्।",
    };
  }
};

// Get all sales
export async function getAllSales(): Promise<Sale[]> {
  try {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .order("sales_date", { ascending: false });

    if (error) throw error;

    return (data || []).map((sale) => ({
      id: sale.id,
      type: sale.type as "kukhura" | "others",
      batchName: sale.batch_name,
      productName: sale.product_name || undefined,
      chickenCount: sale.chicken_count?.toString() || undefined,
      totalKgs: sale.total_kgs.toString(),
      pricePerKg: sale.price_per_kg?.toString() || undefined,
      totalAmount: sale.total_amount.toString(),
      totalPcs: sale.total_pcs?.toString() || undefined,
      soldTo: sale.sold_to,
      amountReceived: sale.amount_received,
      salesDate: sale.sales_date || undefined,
    }));
  } catch (error) {
    console.error("Error fetching sales:", error);
    throw error;
  }
}

// Get sales by type
export async function getSalesByType(
  type: "kukhura" | "others"
): Promise<Sale[]> {
  try {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("type", type)
      .order("sales_date", { ascending: false });

    if (error) throw error;

    return (data || []).map((sale) => ({
      id: sale.id,
      type: sale.type as "kukhura" | "others",
      batchName: sale.batch_name || undefined,
      productName: sale.product_name || undefined,
      chickenCount: sale.chicken_count?.toString() || undefined,
      totalKgs: sale.total_kgs.toString(),
      pricePerKg: sale.price_per_kg?.toString() || undefined,
      totalAmount: sale.total_amount.toString(),
      totalPcs: sale.total_pcs?.toString() || undefined,
      soldTo: sale.sold_to,
      amountReceived: sale.amount_received,
      salesDate: sale.sales_date || undefined,
    }));
  } catch (error) {
    console.error("Error fetching sales by type:", error);
    throw error;
  }
}

// Get sales by date range
export async function getSalesByDateRange(
  startDate: string,
  endDate: string
): Promise<Sale[]> {
  try {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .gte("sales_date", startDate)
      .lte("sales_date", endDate)
      .order("sales_date", { ascending: false });

    if (error) throw error;

    return (data || []).map((sale) => ({
      id: sale.id,
      type: sale.type as "kukhura" | "others",
      batchName: sale.batch_name || undefined,
      productName: sale.product_name || undefined,
      chickenCount: sale.chicken_count?.toString() || undefined,
      totalKgs: sale.total_kgs.toString(),
      pricePerKg: sale.price_per_kg?.toString() || undefined,
      totalAmount: sale.total_amount.toString(),
      totalPcs: sale.total_pcs?.toString() || undefined,
      soldTo: sale.sold_to,
      amountReceived: sale.amount_received,
      salesDate: sale.sales_date || undefined,
    }));
  } catch (error) {
    console.error("Error fetching sales by date range:", error);
    throw error;
  }
}

// Get a single sale by ID
export async function getSaleById(id: number): Promise<Sale | null> {
  try {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return {
      id: data.id,
      type: data.type as "kukhura" | "others",
      batchName: data.batch_name || undefined,
      productName: data.product_name || undefined,
      chickenCount: data.chicken_count?.toString() || undefined,
      totalKgs: data.total_kgs.toString(),
      pricePerKg: data.price_per_kg?.toString() || undefined,
      totalAmount: data.total_amount.toString(),
      totalPcs: data.total_pcs?.toString() || undefined,
      soldTo: data.sold_to,
      amountReceived: data.amount_received,
      salesDate: data.sales_date || undefined,
    };
  } catch (error) {
    console.error("Error fetching sale by ID:", error);
    throw error;
  }
}

// Create a new sale with validation
export async function createSale(saleData: Sale): Promise<void> {
  try {
    // Validate chicken count for kukhura sales
    if (
      saleData.type === "kukhura" &&
      saleData.batchName &&
      saleData.chickenCount
    ) {
      const validation = await validateSaleQuantity(
        saleData.batchName,
        parseInt(saleData.chickenCount)
      );

      if (!validation.valid) {
        throw new Error(validation.message);
      }
    }

    const insertData: Record<string, string | number | boolean | null> = {
      type: saleData.type,
      total_kgs: parseFloat(saleData.totalKgs),
      total_amount: parseFloat(saleData.totalAmount),
      sold_to: saleData.soldTo,
      amount_received: saleData.amountReceived,
      sales_date: saleData.salesDate || null,
    };

    if (saleData.type === "kukhura") {
      insertData.batch_name = saleData.batchName || null;
      insertData.chicken_count = saleData.chickenCount
        ? parseInt(saleData.chickenCount)
        : null;
      insertData.price_per_kg = saleData.pricePerKg
        ? parseFloat(saleData.pricePerKg)
        : null;
    } else {
      insertData.product_name = saleData.productName || null;
      insertData.total_pcs = saleData.totalPcs
        ? parseInt(saleData.totalPcs)
        : null;
    }

    const { error } = await supabase.from("sales").insert(insertData);

    if (error) throw error;
  } catch (error) {
    console.error("Error creating sale:", error);
    throw error;
  }
}

// Update a sale with validation
export async function updateSale(id: number, saleData: Sale): Promise<void> {
  try {
    // Validate chicken count for kukhura sales
    if (
      saleData.type === "kukhura" &&
      saleData.batchName &&
      saleData.chickenCount
    ) {
      const validation = await validateSaleQuantity(
        saleData.batchName,

        id,
        parseInt(saleData.chickenCount)
      );

      if (!validation.valid) {
        throw new Error(validation.message);
      }
    }

    const updateData: Record<string, string | number | boolean | null> = {
      type: saleData.type,
      total_kgs: parseFloat(saleData.totalKgs),
      total_amount: parseFloat(saleData.totalAmount),
      sold_to: saleData.soldTo,
      amount_received: saleData.amountReceived,
      sales_date: saleData.salesDate || null,
      updated_at: new Date().toISOString(),
    };

    if (saleData.type === "kukhura") {
      updateData.batch_name = saleData.batchName || null;
      updateData.chicken_count = saleData.chickenCount
        ? parseInt(saleData.chickenCount)
        : null;
      updateData.price_per_kg = saleData.pricePerKg
        ? parseFloat(saleData.pricePerKg)
        : null;
      updateData.product_name = null;
      updateData.total_pcs = null;
    } else {
      updateData.product_name = saleData.productName || null;
      updateData.total_pcs = saleData.totalPcs
        ? parseInt(saleData.totalPcs)
        : null;
      updateData.batch_name = null;
      updateData.chicken_count = null;
      updateData.price_per_kg = null;
    }

    const { error } = await supabase
      .from("sales")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating sale:", error);
    throw error;
  }
}

// Delete a sale
export async function deleteSale(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("sales").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting sale:", error);
    throw error;
  }
}

// Get sales statistics
export async function getSalesStats(): Promise<SaleStats> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    )
      .toISOString()
      .split("T")[0];
    const firstDayOfLastMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1
    )
      .toISOString()
      .split("T")[0];
    const lastDayOfLastMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      0
    )
      .toISOString()
      .split("T")[0];
    const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1)
      .toISOString()
      .split("T")[0];
    const firstDayOfLastYear = new Date(new Date().getFullYear() - 1, 0, 1)
      .toISOString()
      .split("T")[0];
    const lastDayOfLastYear = new Date(new Date().getFullYear() - 1, 11, 31)
      .toISOString()
      .split("T")[0];

    const { data: todayData } = await supabase
      .from("sales")
      .select("total_amount")
      .eq("sales_date", today);

    const todaySales =
      todayData?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;

    const { data: yesterdayData } = await supabase
      .from("sales")
      .select("total_amount")
      .eq("sales_date", yesterday);

    const yesterdaySales =
      yesterdayData?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;

    const { data: thisMonthData } = await supabase
      .from("sales")
      .select("total_amount")
      .gte("sales_date", firstDayOfMonth);

    const thisMonthSales =
      thisMonthData?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;

    const { data: lastMonthData } = await supabase
      .from("sales")
      .select("total_amount")
      .gte("sales_date", firstDayOfLastMonth)
      .lte("sales_date", lastDayOfLastMonth);

    const lastMonthSales =
      lastMonthData?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;

    const { data: thisYearData } = await supabase
      .from("sales")
      .select("total_amount")
      .gte("sales_date", firstDayOfYear);

    const totalSales =
      thisYearData?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;

    const { data: lastYearData } = await supabase
      .from("sales")
      .select("total_amount")
      .gte("sales_date", firstDayOfLastYear)
      .lte("sales_date", lastDayOfLastYear);

    const lastYearSales =
      lastYearData?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;

    const todayGrowth =
      yesterdaySales > 0
        ? ((todaySales - yesterdaySales) / yesterdaySales) * 100
        : 0;
    const monthGrowth =
      lastMonthSales > 0
        ? ((thisMonthSales - lastMonthSales) / lastMonthSales) * 100
        : 0;
    const yearGrowth =
      lastYearSales > 0
        ? ((totalSales - lastYearSales) / lastYearSales) * 100
        : 0;

    return {
      todaySales,
      thisMonthSales,
      totalSales,
      todayGrowth: Math.round(todayGrowth),
      monthGrowth: Math.round(monthGrowth),
      yearGrowth: Math.round(yearGrowth),
    };
  } catch (error) {
    console.error("Error fetching sales stats:", error);
    throw error;
  }
}

// Get pending payments
export async function getPendingPayments(): Promise<Sale[]> {
  try {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("amount_received", false)
      .order("sales_date", { ascending: false });

    if (error) throw error;

    return (data || []).map((sale) => ({
      id: sale.id,
      type: sale.type as "kukhura" | "others",
      batchName: sale.batch_name || undefined,
      productName: sale.product_name || undefined,
      chickenCount: sale.chicken_count?.toString() || undefined,
      totalKgs: sale.total_kgs.toString(),
      pricePerKg: sale.price_per_kg?.toString() || undefined,
      totalAmount: sale.total_amount.toString(),
      totalPcs: sale.total_pcs?.toString() || undefined,
      soldTo: sale.sold_to,
      amountReceived: sale.amount_received,
      salesDate: sale.sales_date || undefined,
    }));
  } catch (error) {
    console.error("Error fetching pending payments:", error);
    throw error;
  }
}

// Mark payment as received
export async function markPaymentReceived(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from("sales")
      .update({
        amount_received: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error marking payment as received:", error);
    throw error;
  }
}
