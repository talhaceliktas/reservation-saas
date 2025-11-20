"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import InvitationEmail from "@/components/emails/InvitationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export type CreateInvitationState = {
  error?: string;
  success?: boolean;
  message?: string;
} | null;

export async function createInvitationAction(
  prevState: CreateInvitationState,
  formData: FormData
): Promise<CreateInvitationState> {
  const email = formData.get("email")?.toString();
  const role = formData.get("role")?.toString();
  const orgId = formData.get("orgId")?.toString();

  if (!email || !role || !orgId) {
    return { error: "Missing required information." };
  }

  if (!["admin", "staff", "owner"].includes(role)) {
    return { error: "Invalid role type." };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Authentication required." };

  const { data: inviterProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", orgId)
    .single();

  if (!org) return { error: "Organization not found." };

  const { data: invitation, error: dbError } = await supabase
    .from("invitations")
    .insert({
      organization_id: orgId,
      email: email,
      role: role,
      invited_by: user.id,
    })
    .select("token")
    .single();

  if (dbError) {
    if (dbError.code === "23505") {
      return { error: "This email has already been invited." };
    }
    return { error: dbError.message };
  }

  try {
    const inviteLink = `${baseUrl}/join?token=${invitation.token}`;

    await resend.emails.send({
      from: "BookIt <onboarding@resend.dev>",
      to: email,
      subject: `${inviterProfile?.full_name} invited you to join ${org.name}`,
      react: InvitationEmail({
        orgName: org.name,
        inviterName: inviterProfile?.full_name || "An administrator",
        role: role,
        inviteLink: inviteLink,
      }),
    });

    return { success: true, message: "Invitation sent successfully!" };
  } catch (emailError) {
    console.error(emailError);
    const errorMessage =
      emailError instanceof Error ? emailError.message : "Failed to send email";
    return { error: `Added to database but email error: ${errorMessage}` };
  }
}
