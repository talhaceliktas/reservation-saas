import { createClient } from "@/lib/supabase/server";
import { getAvailability } from "@/actions/availability";
import { AvailabilitySchedule } from "@/components/dashboard/availability-schedule";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const availability = await getAvailability(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Availability</h3>
        <p className="text-sm text-muted-foreground">
          Set your weekly availability for appointments.
        </p>
      </div>
      <AvailabilitySchedule initialData={availability} />
    </div>
  );
}
