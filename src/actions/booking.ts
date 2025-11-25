"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { addMinutes, parseISO, setHours, setMinutes } from "date-fns";

export interface StaffMember {
  id: string;
  fullName: string;
  avatarUrl?: string;
}

export interface TimeSlot {
  startTime: string; // ISO string
  available: boolean;
}

export async function getOrganizationStaff(
  organizationId: string
): Promise<StaffMember[]> {
  const supabase = await createClient();

  // 1. Fetch organization members to get user_ids
  const { data: members, error: membersError } = await supabase
    .from("organization_members")
    .select("user_id")
    .eq("organization_id", organizationId);

  if (membersError) {
    console.error("Error fetching members:", membersError);
    return [];
  }

  if (!members || members.length === 0) {
    return [];
  }

  const userIds = members.map((m) => m.user_id);

  // 2. Fetch profiles for these users
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", userIds);

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
    return [];
  }

  // 3. Map to StaffMember interface
  return profiles.map((profile) => ({
    id: profile.id,
    fullName: profile.full_name || "Unknown",
    avatarUrl: profile.avatar_url || undefined,
  }));
}

export async function getAvailableSlots(
  staffId: string,
  serviceDuration: number,
  date: string // YYYY-MM-DD
): Promise<TimeSlot[]> {
  const supabase = await createClient();
  const selectedDate = parseISO(date);
  const dayOfWeek = selectedDate.getDay(); // 0 = Sunday

  // 1. Get staff availability for this day of week
  const { data: availability, error: availError } = await supabase
    .from("availability")
    .select("*")
    .eq("user_id", staffId)
    .eq("day_of_week", dayOfWeek)
    .eq("is_active", true)
    .single();

  if (availError || !availability) {
    return []; // Not working this day
  }

  // 2. Get existing appointments for this staff on this date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data: appointments, error: apptError } = await supabase
    .from("appointments")
    .select("start_time, end_time")
    .eq("staff_id", staffId)
    .gte("start_time", startOfDay.toISOString())
    .lte("start_time", endOfDay.toISOString())
    .neq("status", "cancelled");

  if (apptError) {
    console.error("Error fetching appointments:", apptError);
    return [];
  }

  // 3. Generate slots
  const slots: TimeSlot[] = [];
  const [startHour, startMinute] = availability.start_time
    .split(":")
    .map(Number);
  const [endHour, endMinute] = availability.end_time.split(":").map(Number);

  let currentSlot = setMinutes(setHours(selectedDate, startHour), startMinute);
  const endTime = setMinutes(setHours(selectedDate, endHour), endMinute);

  while (addMinutes(currentSlot, serviceDuration) <= endTime) {
    const slotEnd = addMinutes(currentSlot, serviceDuration);

    // Check if slot overlaps with any appointment
    const isBooked = appointments.some((appt) => {
      const apptStart = new Date(appt.start_time);
      const apptEnd = new Date(appt.end_time);

      return (
        (currentSlot >= apptStart && currentSlot < apptEnd) ||
        (slotEnd > apptStart && slotEnd <= apptEnd) ||
        (currentSlot <= apptStart && slotEnd >= apptEnd)
      );
    });

    slots.push({
      startTime: currentSlot.toISOString(),
      available: !isBooked,
    });

    currentSlot = addMinutes(currentSlot, 30); // 30 min intervals
  }

  return slots;
}

export async function createAppointment(data: {
  organizationId: string;
  serviceId: string;
  staffId: string;
  startTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  price: number;
}) {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  // 1. Check for existing customer (using Admin client to bypass RLS)
  let query = supabaseAdmin
    .from("customers")
    .select("id")
    .eq("organization_id", data.organizationId)
    .eq("email", data.customerEmail);

  if (data.customerPhone) {
    query = supabaseAdmin
      .from("customers")
      .select("id")
      .eq("organization_id", data.organizationId)
      .or(`email.eq.${data.customerEmail},phone.eq.${data.customerPhone}`);
  }

  const { data: existingCustomer } = await query.maybeSingle();

  if (existingCustomer) {
    throw new Error(
      "A customer with this email or phone number already exists. Please use a different one."
    );
  }

  // 2. Create Customer (using Admin client)
  const { data: customer, error: custError } = await supabaseAdmin
    .from("customers")
    .insert({
      organization_id: data.organizationId,
      full_name: data.customerName,
      email: data.customerEmail,
      phone: data.customerPhone,
    })
    .select()
    .single();

  if (custError) throw new Error(custError.message);

  // 3. Get Service Duration (Regular client is fine for reading public services)
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("duration_min")
    .eq("id", data.serviceId)
    .single();

  if (serviceError) throw new Error("Service not found");

  // 4. Create Appointment (Using Admin client to ensure it works regardless of auth)
  const { data: appointment, error: apptError } = await supabaseAdmin
    .from("appointments")
    .insert({
      organization_id: data.organizationId,
      staff_id: data.staffId,
      service_id: data.serviceId,
      customer_id: customer.id,
      start_time: data.startTime,
      end_time: addMinutes(
        new Date(data.startTime),
        service.duration_min
      ).toISOString(),
      total_price: data.price,
    })
    .select()
    .single();

  if (apptError) throw new Error(apptError.message);

  return appointment;
}
