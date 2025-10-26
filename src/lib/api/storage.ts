// lib/api/storage.ts
import { supabase } from "../supabase";

const EXPENSE_BUCKET = "expense_proof";
const POULTRY_BUCKET = "poultry_proof";
const MEDICATION_BUCKET = "medications_image";

/**
 * Upload a file to Supabase Storage (Expense)
 * @param file - The file to upload
 * @param folder - Optional folder path (e.g., 'kukhura', 'others')
 * @returns The file path in storage
 */
export async function uploadExpenseProof(
  file: File,
  folder?: string
): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `${timestamp}_${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(EXPENSE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;
    return data.path;
  } catch (error) {
    console.error("Error uploading expense file:", error);
    throw error;
  }
}

/**
 * Upload a file to Supabase Storage (Poultry/Batch)
 * @param file - The file to upload
 * @param batchName - Batch name for folder organization
 * @returns The file path in storage
 */
export async function uploadPoultryProof(
  file: File,
  batchName?: string
): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `${timestamp}_${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = batchName
      ? `${batchName}/${fileName}`
      : `general/${fileName}`;

    const { data, error } = await supabase.storage
      .from(POULTRY_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;
    return data.path;
  } catch (error) {
    console.error("Error uploading poultry file:", error);
    throw error;
  }
}

/**
 * Upload a medication image to Supabase Storage
 * @param file - The file to upload
 * @param batchName - Batch name for folder organization
 * @returns The file path in storage
 */
export async function uploadMedicationImage(
  file: File,
  batchName?: string
): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `${timestamp}_${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = batchName
      ? `${batchName}/${fileName}`
      : `general/${fileName}`;

    const { data, error } = await supabase.storage
      .from(MEDICATION_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;
    return data.path;
  } catch (error) {
    console.error("Error uploading medication image:", error);
    throw error;
  }
}

/**
 * Get public URL for an expense file
 * @param filePath - The path of the file in storage
 * @returns The public URL
 */
export function getPublicUrl(filePath: string): string {
  const { data } = supabase.storage.from(EXPENSE_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Get public URL for a poultry file
 * @param filePath - The path of the file in storage
 * @returns The public URL
 */
export function getPoultryPublicUrl(filePath: string): string {
  const { data } = supabase.storage.from(POULTRY_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Get public URL for a medication image
 * @param filePath - The path of the file in storage
 * @returns The public URL
 */
export function getMedicationImageUrl(filePath: string): string {
  const { data } = supabase.storage
    .from(MEDICATION_BUCKET)
    .getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Delete an expense file from storage
 * @param filePath - The path of the file to delete
 */
export async function deleteExpenseProof(filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(EXPENSE_BUCKET)
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting expense file:", error);
    throw error;
  }
}

/**
 * Delete a poultry file from storage
 * @param filePath - The path of the file to delete
 */
export async function deletePoultryProof(filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(POULTRY_BUCKET)
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting poultry file:", error);
    throw error;
  }
}

/**
 * Delete a medication image from storage
 * @param filePath - The path of the file to delete
 */
export async function deleteMedicationImage(filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(MEDICATION_BUCKET)
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting medication image:", error);
    throw error;
  }
}

/**
 * Update expense file - delete old and upload new
 * @param oldFilePath - Path to old file (to delete)
 * @param newFile - New file to upload
 * @param folder - Optional folder path
 * @returns New file path
 */
export async function updateExpenseProof(
  oldFilePath: string | null,
  newFile: File,
  folder?: string
): Promise<string> {
  try {
    if (oldFilePath) {
      await deleteExpenseProof(oldFilePath);
    }
    return await uploadExpenseProof(newFile, folder);
  } catch (error) {
    console.error("Error updating expense file:", error);
    throw error;
  }
}

/**
 * Update poultry file - delete old and upload new
 * @param oldFilePath - Path to old file (to delete)
 * @param newFile - New file to upload
 * @param batchName - Batch name for folder organization
 * @returns New file path
 */
export async function updatePoultryProof(
  oldFilePath: string | null,
  newFile: File,
  batchName?: string
): Promise<string> {
  try {
    if (oldFilePath) {
      await deletePoultryProof(oldFilePath);
    }
    return await uploadPoultryProof(newFile, batchName);
  } catch (error) {
    console.error("Error updating poultry file:", error);
    throw error;
  }
}

/**
 * Update medication image - delete old and upload new
 * @param oldFilePath - Path to old file (to delete)
 * @param newFile - New file to upload
 * @param batchName - Batch name for folder organization
 * @returns New file path
 */
export async function updateMedicationImage(
  oldFilePath: string | null,
  newFile: File,
  batchName?: string
): Promise<string> {
  try {
    if (oldFilePath) {
      await deleteMedicationImage(oldFilePath);
    }
    return await uploadMedicationImage(newFile, batchName);
  } catch (error) {
    console.error("Error updating medication image:", error);
    throw error;
  }
}
