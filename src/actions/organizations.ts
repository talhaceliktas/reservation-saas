"use server";

import { createClient } from "@/lib/supabase/server";
import { OrganizationWithDetails } from "@/types/organization";

export async function getOrganizationBySlug(
  slug: string
): Promise<OrganizationWithDetails | null> {
  const supabase = await createClient();

  const { data: org, error } = await supabase
    .from("organizations")
    .select(
      `
      id,
      name,
      slug,
      logo_url,
      created_at,
      services (
        id,
        name,
        description,
        duration_min,
        price,
        currency,
        is_active
      ),
      availability (
        day_of_week,
        start_time,
        end_time
      )
    `
    )
    .eq("slug", slug)
    .single();

  if (error || !org) {
    console.error("Error fetching organization:", error);
    return null;
  }

  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    logoUrl: org.logo_url,
    createdAt: new Date(org.created_at),
    services: org.services
      .filter((s: { is_active: boolean }) => s.is_active !== false)
      .map(
        (s: {
          id: string;
          name: string;
          description: string | null;
          duration_min: number;
          price: number;
          currency: string;
        }) => ({
          id: s.id,
          name: s.name,
          description: s.description || undefined,
          duration: s.duration_min,
          price: Number(s.price),
          currency: s.currency,
          createdAt: new Date(), // Using current date as fallback since it wasn't selected
          updatedAt: new Date(),
        })
      ),
    availability: org.availability.map(
      (a: { day_of_week: number; start_time: string; end_time: string }) => ({
        dayOfWeek: a.day_of_week,
        startTime: a.start_time,
        endTime: a.end_time,
      })
    ),
  };
}
