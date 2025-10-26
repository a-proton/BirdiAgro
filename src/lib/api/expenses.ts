// lib/api/expenses.ts
import { supabase } from "../supabase";
import { uploadExpenseProof, updateExpenseProof } from "./storage";

export interface Expense {
  id: number;
  category: string;
  title: string;
  amount: number;
  date: string;
  method: string;
  isPaid: boolean;
  paymentProofName: string | null;
  paymentProofPath: string | null;
  batch: string;
}

// Get all expenses
export async function getAllExpenses(): Promise<Expense[]> {
  try {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;

    return (data || []).map((expense) => ({
      id: expense.id,
      category: expense.category,
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      method: expense.payment_method,
      isPaid: expense.is_paid,
      paymentProofName: expense.payment_proof_name,
      paymentProofPath: expense.payment_proof_path,
      batch: expense.batch || "----",
    }));
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
}

// Create a new expense
export async function createExpense(expenseData: {
  category: string;
  batch?: string;
  title: string;
  amount: number;
  date: string;
  paymentMethod: string;
  isPaid: boolean;
  paymentProof?: File | null;
}): Promise<Expense> {
  try {
    let paymentProofPath: string | null = null;
    let paymentProofName: string | null = null;

    // Upload file if provided
    if (expenseData.paymentProof) {
      paymentProofPath = await uploadExpenseProof(
        expenseData.paymentProof,
        expenseData.category
      );
      paymentProofName = expenseData.paymentProof.name;
    }

    const { data, error } = await supabase
      .from("expenses")
      .insert({
        category: expenseData.category,
        batch: expenseData.batch,
        title: expenseData.title,
        amount: expenseData.amount,
        date: expenseData.date,
        payment_method: expenseData.paymentMethod,
        is_paid: expenseData.isPaid,
        payment_proof_name: paymentProofName,
        payment_proof_path: paymentProofPath,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      category: data.category,
      title: data.title,
      amount: data.amount,
      date: data.date,
      method: data.payment_method,
      isPaid: data.is_paid,
      paymentProofName: data.payment_proof_name,
      paymentProofPath: data.payment_proof_path,
      batch: data.batch || "----",
    };
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
}

// Update an expense
// lib/api/expenses.ts - Updated updateExpense function

export async function updateExpense(
  id: number,
  expenseData: {
    category?: string;
    batch?: string;
    title?: string;
    amount?: number;
    date?: string;
    paymentMethod?: string;
    isPaid?: boolean;
    paymentProof?: File | null;
    oldPaymentProofPath?: string | null;
  }
): Promise<Expense> {
  try {
    let paymentProofPath: string | null | undefined = undefined;
    let paymentProofName: string | null | undefined = undefined;

    // Handle file upload/update only if a new file is provided
    if (expenseData.paymentProof) {
      paymentProofPath = await updateExpenseProof(
        expenseData.oldPaymentProofPath || null,
        expenseData.paymentProof,
        expenseData.category || "other"
      );
      paymentProofName = expenseData.paymentProof.name;
    }

    // Build update object with only defined values
    const updateData: Record<
      string,
      string | number | boolean | null | undefined
    > = {};

    if (expenseData.category !== undefined)
      updateData.category = expenseData.category;
    if (expenseData.batch !== undefined) updateData.batch = expenseData.batch;
    if (expenseData.title !== undefined) updateData.title = expenseData.title;
    if (expenseData.amount !== undefined)
      updateData.amount = expenseData.amount;
    if (expenseData.date !== undefined) updateData.date = expenseData.date;
    if (expenseData.paymentMethod !== undefined)
      updateData.payment_method = expenseData.paymentMethod;
    if (expenseData.isPaid !== undefined)
      updateData.is_paid = expenseData.isPaid;

    // Only update file fields if a new file was uploaded
    if (paymentProofPath !== undefined) {
      updateData.payment_proof_path = paymentProofPath;
      updateData.payment_proof_name = paymentProofName;
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("expenses")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Return the updated expense
    return {
      id: data.id,
      category: data.category,
      title: data.title,
      amount: data.amount,
      date: data.date,
      method: data.payment_method,
      isPaid: data.is_paid,
      paymentProofName: data.payment_proof_name,
      paymentProofPath: data.payment_proof_path,
      batch: data.batch || "----",
    };
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
}

// Delete an expense
export async function deleteExpense(id: number): Promise<void> {
  try {
    // First get the expense to find the file path
    const { data: expense, error: fetchError } = await supabase
      .from("expenses")
      .select("payment_proof_path")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // Delete the file if it exists
    if (expense?.payment_proof_path) {
      const { deleteExpenseProof } = await import("./storage");
      await deleteExpenseProof(expense.payment_proof_path);
    }

    // Delete the expense record
    const { error } = await supabase.from("expenses").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
}

// Get expenses by category
export async function getExpensesByCategory(
  category: string
): Promise<Expense[]> {
  try {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("category", category)
      .order("date", { ascending: false });

    if (error) throw error;

    return (data || []).map((expense) => ({
      id: expense.id,
      category: expense.category,
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      method: expense.payment_method,
      isPaid: expense.is_paid,
      paymentProofName: expense.payment_proof_name,
      paymentProofPath: expense.payment_proof_path,
      batch: expense.batch || "----",
    }));
  } catch (error) {
    console.error("Error fetching expenses by category:", error);
    throw error;
  }
}

// Get expenses by batch
export async function getExpensesByBatch(batch: string): Promise<Expense[]> {
  try {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("batch", batch)
      .order("date", { ascending: false });

    if (error) throw error;

    return (data || []).map((expense) => ({
      id: expense.id,
      category: expense.category,
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      method: expense.payment_method,
      isPaid: expense.is_paid,
      paymentProofName: expense.payment_proof_name,
      paymentProofPath: expense.payment_proof_path,
      batch: expense.batch || "----",
    }));
  } catch (error) {
    console.error("Error fetching expenses by batch:", error);
    throw error;
  }
}
