// lib/api/dashboard.ts
import { createClient } from "../supabase/client";

const supabase = createClient();

export interface DashboardStats {
  totalChickens: number;
  totalExpense: number;
  totalSales: number;
  activeBatches: number;
  chickenGrowth: number;
  expenseGrowth: number;
  salesGrowth: number;
}

export interface SalesTrend {
  year: string;
  count: number;
}

export interface MonthlyExpense {
  month: string;
  expense: number;
}

export interface FeedDistribution {
  name: string;
  value: number;
  color: string;
}

export interface BatchDeath {
  batch: string;
  total: number;
  deaths: number;
  rate: string;
}

export interface RecentUpdate {
  time: string;
  user: string;
  action: string;
  type: "feed" | "death" | "expense" | "health" | "batch" | "sale";
}

export interface TopBatch {
  name: string;
  survival: string;
  weight: string;
  profit: string;
}

export interface FeedStockAlert {
  type: string;
  current: number;
  minimum: number;
  status: "low" | "good" | "critical";
}

export interface Notification {
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
  priority: number;
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get all batches with their chickens
    const { data: batches } = await supabase
      .from("batches")
      .select("id, batch_name, number_of_chicks");

    let totalChickens = 0;
    let activeBatches = 0;

    if (batches) {
      for (const batch of batches) {
        const { data: deaths } = await supabase
          .from("deaths")
          .select("number_of_deaths")
          .eq("batch_id", batch.id);

        const { data: sales } = await supabase
          .from("sales")
          .select("chicken_count")
          .eq("type", "kukhura")
          .eq("batch_name", batch.batch_name);

        const totalDeaths =
          deaths?.reduce((sum, d) => sum + d.number_of_deaths, 0) || 0;
        const totalSold =
          sales?.reduce((sum, s) => sum + (s.chicken_count || 0), 0) || 0;

        const remaining =
          (batch.number_of_chicks || 0) - totalDeaths - totalSold;

        if (remaining > 0) {
          totalChickens += remaining;
          activeBatches++;
        }
      }
    }

    // Get total expenses (lifetime)
    const { data: expenses } = await supabase.from("expenses").select("amount");

    const totalExpense = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;

    // Get total sales (lifetime)
    const { data: allSales } = await supabase
      .from("sales")
      .select("total_amount");

    const totalSales =
      allSales?.reduce((sum, s) => sum + s.total_amount, 0) || 0;

    // Calculate growth percentages
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString().split("T")[0];

    const { data: lastMonthBatches } = await supabase
      .from("batches")
      .select("number_of_chicks")
      .lte("date_of_arrival", lastMonthStr);

    const lastMonthChickens =
      lastMonthBatches?.reduce(
        (sum, b) => sum + (b.number_of_chicks || 0),
        0
      ) || 0;

    const chickenGrowth =
      lastMonthChickens > 0
        ? ((totalChickens - lastMonthChickens) / lastMonthChickens) * 100
        : 0;

    const thisMonth = new Date();
    thisMonth.setDate(1);
    const thisMonthStr = thisMonth.toISOString().split("T")[0];

    const { data: thisMonthExpenses } = await supabase
      .from("expenses")
      .select("amount")
      .gte("date", thisMonthStr);

    const thisMonthExpense =
      thisMonthExpenses?.reduce((sum, e) => sum + e.amount, 0) || 0;

    const { data: lastMonthExpenses } = await supabase
      .from("expenses")
      .select("amount")
      .gte("date", lastMonthStr)
      .lt("date", thisMonthStr);

    const lastMonthExpense =
      lastMonthExpenses?.reduce((sum, e) => sum + e.amount, 0) || 0;

    const expenseGrowth =
      lastMonthExpense > 0
        ? ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100
        : 0;

    const { data: thisMonthSales } = await supabase
      .from("sales")
      .select("total_amount")
      .gte("sales_date", thisMonthStr);

    const thisMonthSalesTotal =
      thisMonthSales?.reduce((sum, s) => sum + s.total_amount, 0) || 0;

    const { data: lastMonthSalesData } = await supabase
      .from("sales")
      .select("total_amount")
      .gte("sales_date", lastMonthStr)
      .lt("sales_date", thisMonthStr);

    const lastMonthSalesTotal =
      lastMonthSalesData?.reduce((sum, s) => sum + s.total_amount, 0) || 0;

    const salesGrowth =
      lastMonthSalesTotal > 0
        ? ((thisMonthSalesTotal - lastMonthSalesTotal) / lastMonthSalesTotal) *
          100
        : 0;

    return {
      totalChickens,
      totalExpense,
      totalSales,
      activeBatches,
      chickenGrowth: Math.round(chickenGrowth * 10) / 10,
      expenseGrowth: Math.round(expenseGrowth * 10) / 10,
      salesGrowth: Math.round(salesGrowth * 10) / 10,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}

// Get sales trend (yearly)
export async function getSalesTrend(): Promise<SalesTrend[]> {
  try {
    const { data: sales } = await supabase
      .from("sales")
      .select("sales_date, chicken_count")
      .eq("type", "kukhura")
      .order("sales_date", { ascending: true });

    const yearlyData: { [key: string]: number } = {};

    sales?.forEach((sale) => {
      const year = new Date(sale.sales_date).getFullYear().toString();
      yearlyData[year] = (yearlyData[year] || 0) + (sale.chicken_count || 0);
    });

    return Object.entries(yearlyData).map(([year, count]) => ({
      year,
      count,
    }));
  } catch (error) {
    console.error("Error fetching sales trend:", error);
    throw error;
  }
}

// Get monthly expenses (last 6 months)
export async function getMonthlyExpenses(): Promise<MonthlyExpense[]> {
  try {
    const months = [
      "जनवरी",
      "फेब्रुअरी",
      "मार्च",
      "अप्रिल",
      "मे",
      "जुन",
      "जुलाई",
      "अगस्ट",
      "सेप्टेम्बर",
      "अक्टोबर",
      "नोभेम्बर",
      "डिसेम्बर",
    ];
    const result: MonthlyExpense[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();

      const startDate = new Date(year, monthIndex, 1)
        .toISOString()
        .split("T")[0];
      const endDate = new Date(year, monthIndex + 1, 0)
        .toISOString()
        .split("T")[0];

      const { data: expenses } = await supabase
        .from("expenses")
        .select("amount")
        .gte("date", startDate)
        .lte("date", endDate);

      const totalExpense = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;

      result.push({
        month: months[monthIndex],
        expense: totalExpense,
      });
    }

    return result;
  } catch (error) {
    console.error("Error fetching monthly expenses:", error);
    throw error;
  }
}

// Get feed distribution (from feed inventory purchases minus consumption)
export async function getFeedDistribution(): Promise<FeedDistribution[]> {
  try {
    // Get from feed_stock_summary (shows remaining stock)
    const { data: stockSummary, error: stockError } = await supabase
      .from("feed_stock_summary")
      .select("feed_type, quantity_kg");

    console.log("Feed stock summary data:", stockSummary);

    if (stockError) {
      console.error("Error fetching stock summary:", stockError);
      throw stockError;
    }

    // IMPORTANT: Use uppercase feed types (B0, B1, B2) to match database
    const feedTotals: { [key: string]: number } = {
      B0: 0,
      B1: 0,
      B2: 0,
    };

    // Also check for lowercase variants in case database has mixed case
    stockSummary?.forEach((stock) => {
      const feedType = stock.feed_type?.toUpperCase(); // Normalize to uppercase
      if (
        feedType &&
        (feedType === "B0" || feedType === "B1" || feedType === "B2")
      ) {
        feedTotals[feedType] = Math.round(stock.quantity_kg || 0);
      }
    });

    console.log("Feed distribution totals:", feedTotals);

    // Mapping: B0 = Starter, B1 = Grower, B2 = Layer/Finisher
    return [
      {
        name: "स्टार्टर", // Starter (B0)
        value: feedTotals["B0"],
        color: "#14b8a6",
      },
      {
        name: "ग्रोअर", // Grower (B1)
        value: feedTotals["B1"],
        color: "#f59e0b",
      },
      {
        name: "लेयर/फिनिसर", // Layer/Finisher (B2)
        value: feedTotals["B2"],
        color: "#3b82f6",
      },
    ];
  } catch (error) {
    console.error("Error fetching feed distribution:", error);
    // Return empty data instead of throwing to prevent UI breakage
    return [
      {
        name: "स्टार्टर",
        value: 0,
        color: "#14b8a6",
      },
      {
        name: "ग्रोअर",
        value: 0,
        color: "#f59e0b",
      },
      {
        name: "लेयर/फिनिसर",
        value: 0,
        color: "#3b82f6",
      },
    ];
  }
}

// Get batch death statistics
export async function getBatchDeaths(): Promise<BatchDeath[]> {
  try {
    const { data: batches } = await supabase
      .from("batches")
      .select("id, batch_name, number_of_chicks")
      .order("date_of_arrival", { ascending: false })
      .limit(4);

    const result: BatchDeath[] = [];

    if (batches) {
      for (const batch of batches) {
        const { data: deaths } = await supabase
          .from("deaths")
          .select("number_of_deaths")
          .eq("batch_id", batch.id);

        const totalDeaths =
          deaths?.reduce((sum, d) => sum + d.number_of_deaths, 0) || 0;

        const rate =
          batch.number_of_chicks > 0
            ? ((totalDeaths / batch.number_of_chicks) * 100).toFixed(1)
            : "0.0";

        result.push({
          batch: batch.batch_name,
          total: batch.number_of_chicks || 0,
          deaths: totalDeaths,
          rate: `${rate}%`,
        });
      }
    }

    return result;
  } catch (error) {
    console.error("Error fetching batch deaths:", error);
    throw error;
  }
}

// Get recent updates (from multiple tables)
export async function getRecentUpdates(): Promise<RecentUpdate[]> {
  try {
    const updates: RecentUpdate[] = [];

    // Get recent feed consumption
    const { data: feedUpdates } = await supabase
      .from("feed_consumption")
      .select("created_at, batch")
      .order("created_at", { ascending: false })
      .limit(2);

    feedUpdates?.forEach((f) => {
      updates.push({
        time: getRelativeTime(f.created_at),
        user: "प्रणाली",
        action: `${f.batch} को दाना सूची अपडेट गर्नुभयो`,
        type: "feed",
      });
    });

    // Get recent deaths
    const { data: deathUpdates } = await supabase
      .from("deaths")
      .select("created_at, number_of_deaths")
      .order("created_at", { ascending: false })
      .limit(2);

    deathUpdates?.forEach((d) => {
      updates.push({
        time: getRelativeTime(d.created_at),
        user: "प्रणाली",
        action: `${d.number_of_deaths} कुखुराको मृत्यु रेकर्ड गर्नुभयो`,
        type: "death",
      });
    });

    // Get recent expenses
    const { data: expenseUpdates } = await supabase
      .from("expenses")
      .select("created_at, title")
      .order("created_at", { ascending: false })
      .limit(2);

    expenseUpdates?.forEach((e) => {
      updates.push({
        time: getRelativeTime(e.created_at),
        user: "प्रणाली",
        action: `नयाँ खर्च प्रविष्टि थप्नुभयो: ${e.title}`,
        type: "expense",
      });
    });

    // Get recent vaccinations
    const { data: vaccinationUpdates } = await supabase
      .from("vaccinations")
      .select("created_at, vaccination_name")
      .order("created_at", { ascending: false })
      .limit(2);

    vaccinationUpdates?.forEach((v) => {
      updates.push({
        time: getRelativeTime(v.created_at),
        user: "प्रणाली",
        action: `${v.vaccination_name} खोप पूरा गर्नुभयो`,
        type: "health",
      });
    });

    // Sort by time and return top 4
    return updates
      .sort((a, b) => {
        // Simple sorting - recent ones first
        return a.time.localeCompare(b.time);
      })
      .slice(0, 4);
  } catch (error) {
    console.error("Error fetching recent updates:", error);
    throw error;
  }
}

// Get top performing batches
export async function getTopBatches(): Promise<TopBatch[]> {
  try {
    const { data: batches } = await supabase
      .from("batches")
      .select("id, batch_name, number_of_chicks");

    const batchPerformance: Array<{
      name: string;
      survivalRate: number;
      profit: number;
    }> = [];

    if (batches) {
      for (const batch of batches) {
        const { data: deaths } = await supabase
          .from("deaths")
          .select("number_of_deaths")
          .eq("batch_id", batch.id);

        const { data: sales } = await supabase
          .from("sales")
          .select("chicken_count, total_amount")
          .eq("type", "kukhura")
          .eq("batch_name", batch.batch_name);

        const totalDeaths =
          deaths?.reduce((sum, d) => sum + d.number_of_deaths, 0) || 0;
        const totalSold =
          sales?.reduce((sum, s) => sum + (s.chicken_count || 0), 0) || 0;

        const surviving = (batch.number_of_chicks || 0) - totalDeaths;
        const survivalRate =
          batch.number_of_chicks > 0
            ? (surviving / batch.number_of_chicks) * 100
            : 0;

        const revenue = sales?.reduce((sum, s) => sum + s.total_amount, 0) || 0;

        // Get expenses for this batch
        const { data: expenses } = await supabase
          .from("expenses")
          .select("amount")
          .eq("batch", batch.batch_name);

        const totalExpenses =
          expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;

        const profit = revenue - totalExpenses;

        batchPerformance.push({
          name: batch.batch_name,
          survivalRate,
          profit,
        });
      }
    }

    // Sort by survival rate and profit
    batchPerformance.sort(
      (a, b) => b.survivalRate - a.survivalRate || b.profit - a.profit
    );

    return batchPerformance.slice(0, 3).map((b) => ({
      name: b.name,
      survival: `${b.survivalRate.toFixed(1)}%`,
      weight: "२.३ किलो", // This would need actual weight data
      profit: `रु ${Math.round(b.profit).toLocaleString("en-NP")}`,
    }));
  } catch (error) {
    console.error("Error fetching top batches:", error);
    throw error;
  }
}

// Get feed stock alerts
export async function getFeedStockAlerts(): Promise<FeedStockAlert[]> {
  try {
    const { data: stockSummary } = await supabase
      .from("feed_stock_summary")
      .select("feed_type, quantity_kg");

    const alerts: FeedStockAlert[] = [];
    // FIXED: Changed to uppercase to match database
    const feedTypes = ["B0", "B1", "B2"];
    const feedNames = ["स्टार्टर दाना", "ग्रोअर दाना", "फिनिसर दाना"];
    const minimums = [500, 800, 600];

    feedTypes.forEach((type, index) => {
      // FIXED: Normalize feed_type to uppercase for comparison
      const stock = stockSummary?.find(
        (s) => s.feed_type?.toUpperCase() === type
      );
      const current = Math.round(stock?.quantity_kg || 0);
      const minimum = minimums[index];

      let status: "low" | "good" | "critical" = "good";
      if (current < minimum * 0.6) status = "critical";
      else if (current < minimum) status = "low";

      alerts.push({
        type: feedNames[index],
        current,
        minimum,
        status,
      });
    });

    return alerts;
  } catch (error) {
    console.error("Error fetching feed stock alerts:", error);
    throw error;
  }
}

// Get important notifications
export async function getNotifications(): Promise<Notification[]> {
  try {
    const notifications: Notification[] = [];

    // Check for high death rates
    const batchDeaths = await getBatchDeaths();
    batchDeaths.forEach((batch) => {
      const rate = parseFloat(batch.rate);
      if (rate > 5) {
        notifications.push({
          type: "error",
          title: "उच्च मृत्युदर चेतावनी",
          message: `${batch.batch} को मृत्युदर ${batch.rate} पुग्यो`,
          priority: 1,
        });
      }
    });

    // Check for low feed stock
    const feedAlerts = await getFeedStockAlerts();
    const lowStock = feedAlerts.filter(
      (f) => f.status === "critical" || f.status === "low"
    );
    if (lowStock.length > 0) {
      const totalStock = lowStock.reduce((sum, f) => sum + f.current, 0);
      notifications.push({
        type: lowStock.some((f) => f.status === "critical")
          ? "error"
          : "warning",
        title: "कम दाना स्टक",
        message: `केवल ${totalStock} किलो बाँकी, पुनः अर्डर आवश्यक`,
        priority: 2,
      });
    }

    // Check for upcoming vaccinations (7, 14, 21 days)
    const { data: batches } = await supabase
      .from("batches")
      .select("id, batch_name, date_of_arrival");

    if (batches) {
      const today = new Date();
      for (const batch of batches) {
        const arrivalDate = new Date(batch.date_of_arrival);
        const daysOld = Math.floor(
          (today.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Check if vaccination is due in next 3 days
        const nextVaccination = [7, 14, 21].find((day) => day > daysOld);
        if (nextVaccination && nextVaccination - daysOld <= 3) {
          notifications.push({
            type: "info",
            title: "खोप लाग्ने समय",
            message: `${batch.batch_name} को खोप ${
              nextVaccination - daysOld
            } दिनमा`,
            priority: 3,
          });
        }
      }
    }

    // Check for high expenses
    const monthlyExpenses = await getMonthlyExpenses();
    if (monthlyExpenses.length >= 2) {
      const thisMonth = monthlyExpenses[monthlyExpenses.length - 1].expense;
      const lastMonth = monthlyExpenses[monthlyExpenses.length - 2].expense;
      const growth =
        lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

      if (growth > 15) {
        notifications.push({
          type: "warning",
          title: "उच्च खर्च",
          message: `यो महिनाको खर्च औसतभन्दा ${Math.round(growth)}% बढी`,
          priority: 4,
        });
      }
    }

    // Sort by priority
    return notifications.sort((a, b) => a.priority - b.priority).slice(0, 4);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

// Helper function to get relative time in Nepali
function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} मिनेट अघि`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} घण्टा अघि`;
  } else if (diffInSeconds < 172800) {
    return "हिजो";
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} दिन अघि`;
  }
}

// Get active batch summary
export async function getActiveBatchSummary(): Promise<{
  totalBatches: number;
  totalChickens: number;
  totalFeedConsumption: number;
}> {
  try {
    const { data: batches } = await supabase
      .from("batches")
      .select("id, batch_name, number_of_chicks");

    let activeBatches = 0;
    let totalChickens = 0;

    if (batches) {
      for (const batch of batches) {
        const { data: deaths } = await supabase
          .from("deaths")
          .select("number_of_deaths")
          .eq("batch_id", batch.id);

        const { data: sales } = await supabase
          .from("sales")
          .select("chicken_count")
          .eq("type", "kukhura")
          .eq("batch_name", batch.batch_name);

        const totalDeaths =
          deaths?.reduce((sum, d) => sum + d.number_of_deaths, 0) || 0;
        const totalSold =
          sales?.reduce((sum, s) => sum + (s.chicken_count || 0), 0) || 0;

        const remaining =
          (batch.number_of_chicks || 0) - totalDeaths - totalSold;

        if (remaining > 0) {
          activeBatches++;
          totalChickens += remaining;
        }
      }
    }

    // Get total feed consumption
    const { data: consumption } = await supabase
      .from("feed_consumption")
      .select("quantity_used, unit");

    let totalFeedConsumption = 0;
    consumption?.forEach((c) => {
      let quantityInKg = c.quantity_used;
      if (c.unit === "बाल्टिन") quantityInKg *= 12.5;
      else if (c.unit === "बोरा") quantityInKg *= 50;
      totalFeedConsumption += quantityInKg;
    });

    return {
      totalBatches: activeBatches,
      totalChickens,
      totalFeedConsumption: Math.round(totalFeedConsumption),
    };
  } catch (error) {
    console.error("Error fetching active batch summary:", error);
    throw error;
  }
}
