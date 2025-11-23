"use server";

import { createClient } from "@/lib/supabase/server";
import { Service } from "@/types/service";
import { ServiceFormValues } from "@/lib/validations/service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const orgId = cookieStore.get("selectedOrgId")?.value;

  if (!orgId) return [];

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("organization_id", orgId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    duration: item.duration_min,
    price: Number(item.price),
    currency: item.currency,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at || item.created_at),
  }));
}

export async function createService(data: ServiceFormValues): Promise<Service> {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const orgId = cookieStore.get("selectedOrgId")?.value;

  if (!orgId) throw new Error("Organization ID not found");

  const { data: newService, error } = await supabase
    .from("services")
    .insert({
      organization_id: orgId,
      name: data.name,
      description: data.description,
      duration_min: data.duration,
      price: data.price,
      currency: data.currency,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/services");

  return {
    id: newService.id,
    name: newService.name,
    description: newService.description,
    duration: newService.duration_min,
    price: Number(newService.price),
    currency: newService.currency,
    createdAt: new Date(newService.created_at),
    updatedAt: new Date(newService.updated_at || newService.created_at),
  };
}

export async function updateService(
  id: string,
  data: ServiceFormValues
): Promise<Service> {
  const supabase = await createClient();

  const { data: updatedService, error } = await supabase
    .from("services")
    .update({
      name: data.name,
      description: data.description,
      duration_min: data.duration,
      price: data.price,
      currency: data.currency,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/services");

  return {
    id: updatedService.id,
    name: updatedService.name,
    description: updatedService.description,
    duration: updatedService.duration_min,
    price: Number(updatedService.price),
    currency: updatedService.currency,
    createdAt: new Date(updatedService.created_at),
    updatedAt: new Date(updatedService.updated_at),
  };
}

export async function deleteService(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("services")
    .update({ is_active: false }) // Soft delete
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/services");
}
