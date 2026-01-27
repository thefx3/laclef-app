export type TeacherRow = {
  id: string;
  full_name: string;
  code: string;
  email: string | null;
  created_at: string;
};

export type LevelRow = {
  id: string;
  code: string;
  label: string | null;
  is_active: boolean;
  created_at: string;
};

export type TimeSlotRow = {
  id: string;
  label: string;
  start_time: string | null;
  end_time: string | null;
  created_at: string;
};

export type ClassOfferingRow = {
  id: string;
  season_id: string;
  semester: number;
  day_of_week: number | null;
  teacher_id: string | null;
  level_id: string | null;
  time_slot_id: string | null;
  code: string | null;
  is_active: boolean;
  created_at: string;
};

export type ReferenceData = {
  teachers: TeacherRow[];
  levels: LevelRow[];
  timeSlots: TimeSlotRow[];
  classOfferings: ClassOfferingRow[];
};
