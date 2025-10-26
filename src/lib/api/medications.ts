// lib/api/medications.ts
import { supabase } from "../supabase";
import { uploadMedicationImage } from "./storage";

export interface Vaccination {
  id: number;
  batchId: number;
  vaccinationName: string;
  vaccinationDate: string;
  week?: string;
}

// Create a new vaccination
export async function createVaccination(vaccinationData: {
  batchId: number;
  vaccinationName: string;
  vaccinationDate: string;
  week?: string;
}): Promise<Vaccination> {
  try {
    const { data, error } = await supabase
      .from("vaccinations")
      .insert({
        batch_id: vaccinationData.batchId,
        vaccination_name: vaccinationData.vaccinationName,
        vaccination_date: vaccinationData.vaccinationDate,
        week: vaccinationData.week,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      batchId: data.batch_id,
      vaccinationName: data.vaccination_name,
      vaccinationDate: data.vaccination_date,
      week: data.week || undefined,
    };
  } catch (error) {
    console.error("Error creating vaccination:", error);
    throw error;
  }
}

// Get vaccinations by batch
export async function getVaccinationsByBatch(
  batchId: number
): Promise<Vaccination[]> {
  try {
    const { data, error } = await supabase
      .from("vaccinations")
      .select("*")
      .eq("batch_id", batchId)
      .order("vaccination_date", { ascending: true });

    if (error) throw error;

    return (data || []).map((v) => ({
      id: v.id,
      batchId: v.batch_id,
      vaccinationName: v.vaccination_name,
      vaccinationDate: v.vaccination_date,
      week: v.week || undefined,
    }));
  } catch (error) {
    console.error("Error fetching vaccinations:", error);
    throw error;
  }
}

// Delete a vaccination
export async function deleteVaccination(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("vaccinations").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting vaccination:", error);
    throw error;
  }
}

export interface Medication {
  id: number;
  batchId: number;
  medicationName: string;
  medicationDate: string;
  duration?: number;
  medicationImageName?: string;
  medicationImagePath?: string;
}

// Create a new medication with optional image
export async function createMedication(medicationData: {
  batchId: number;
  medicationName: string;
  medicationDate: string;
  duration?: number;
  medicationImage?: File | null;
  batchName?: string;
}): Promise<Medication> {
  try {
    let medicationImagePath: string | null = null;
    let medicationImageName: string | null = null;

    // Upload image if provided
    if (medicationData.medicationImage && medicationData.batchName) {
      medicationImagePath = await uploadMedicationImage(
        medicationData.medicationImage,
        medicationData.batchName
      );
      medicationImageName = medicationData.medicationImage.name;
    }

    const { data, error } = await supabase
      .from("medications")
      .insert({
        batch_id: medicationData.batchId,
        medication_name: medicationData.medicationName,
        medication_date: medicationData.medicationDate,
        duration: medicationData.duration,
        medication_image_name: medicationImageName,
        medication_image_path: medicationImagePath,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      batchId: data.batch_id,
      medicationName: data.medication_name,
      medicationDate: data.medication_date,
      duration: data.duration || undefined,
      medicationImageName: data.medication_image_name || undefined,
      medicationImagePath: data.medication_image_path || undefined,
    };
  } catch (error) {
    console.error("Error creating medication:", error);
    throw error;
  }
}

// Get medications by batch
export async function getMedicationsByBatch(
  batchId: number
): Promise<Medication[]> {
  try {
    const { data, error } = await supabase
      .from("medications")
      .select("*")
      .eq("batch_id", batchId)
      .order("medication_date", { ascending: true });

    if (error) throw error;

    return (data || []).map((m) => ({
      id: m.id,
      batchId: m.batch_id,
      medicationName: m.medication_name,
      medicationDate: m.medication_date,
      duration: m.duration || undefined,
      medicationImageName: m.medication_image_name || undefined,
      medicationImagePath: m.medication_image_path || undefined,
    }));
  } catch (error) {
    console.error("Error fetching medications:", error);
    throw error;
  }
}

// Delete a medication
export async function deleteMedication(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("medications").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting medication:", error);
    throw error;
  }
}
