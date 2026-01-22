export type AppRole =
  | "USER"
  | "MUSIQUE"
  | "ACTIVITES"
  | "FLCE"
  | "ACCUEIL"
  | "ADMIN"
  | "SUPER_ADMIN";

export type UserProfileRow = {
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: AppRole;
  created_at: string;
};

export const ROLE_OPTIONS: AppRole[] = [
  "USER",
  "ACCUEIL",
  "FLCE",
  "ACTIVITES",
  "MUSIQUE",
  "ADMIN",
  "SUPER_ADMIN",
];
