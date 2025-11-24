export interface Availability {
  id: string;
  organization_id: string | null;
  user_id: string | null;
  day_of_week: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  start_time: string; // Format: "HH:mm:ss"
  end_time: string; // Format: "HH:mm:ss"
  is_active: boolean;
  created_at: string;
}
