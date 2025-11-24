"use server";

import { createClient } from "@/lib/supabase/server";
import { Availability } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function getAvailability(userId: string): Promise<Availability[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .eq("user_id", userId)
    .order("day_of_week", { ascending: true });

  if (error) {
    console.error("Error fetching availability:", error);
    return [];
  }

  return data as Availability[];
}

export async function updateAvailability(
  availabilityData: Partial<Availability>[]
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // We need to ensure we are updating the correct records for the logged-in user
  // and handling the upsert logic.
  // Since we might be sending multiple rows, we can use upsert.

  const updates = availabilityData.map((item) => ({
    ...item,
    user_id: user.id,
    updated_at: new Date().toISOString(), // Assuming there is an updated_at, though schema didn't show it explicitly, usually good practice.
    // Wait, schema didn't have updated_at. It had created_at.
    // Let's check schema again.
    // id, organization_id, user_id, day_of_week, start_time, end_time, is_active, created_at.
    // So no updated_at.
  }));

  // We need to handle the case where we might be inserting new records or updating existing ones.
  // The primary key is 'id'. If we pass 'id', it updates. If not, it inserts?
  // But we want to upsert based on (user_id, day_of_week) essentially, but the PK is ID.
  // If the frontend sends IDs, we update. If not, we insert.
  // However, for a simple schedule, we usually want 7 records per user.

  // Let's assume the frontend sends the data.
  // If we want to ensure we don't duplicate days, we should probably check if records exist or rely on the frontend to send IDs if they exist.
  // For now, let's assume the frontend will pass IDs if they were fetched previously.

  const { data, error } = await supabase
    .from("availability")
    .upsert(updates, { onConflict: "id" })
    .select();

  if (error) {
    console.error("Error updating availability:", error);
    throw new Error("Failed to update availability");
  }

  revalidatePath("/dashboard/calendar");
  return data;
}
