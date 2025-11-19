"use server";

import { createClient } from "@supabase/supabase-js";

export async function checkEmailExists(email: string) {
  const delay = Math.floor(Math.random() * 300) + 500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  return !!data;
}
