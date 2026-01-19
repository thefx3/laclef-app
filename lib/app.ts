// lib/apps.ts
import { Headset, Croissant, PersonStanding, Music } from "lucide-react";

export const APPS = [
  { key: "accueil", href: "/accueil", label: "Accueil", Icon: Headset, colorClass: "text-green-500" },
  { key: "flce", href: "/flce", label: "FLCE", Icon: Croissant, colorClass: "text-yellow-500" },
  { key: "activites", href: "/activites", label: "Activités", Icon: PersonStanding, colorClass: "text-violet-500" },
  { key: "musique", href: "/musique", label: "Musique", Icon: Music, colorClass: "text-blue-500" },
] as const;

export type AppRole = "ACCUEIL" | "FLCE" | "MUSIQUE" | "ACTIVITES" | "ADMIN" | "SUPER_ADMIN";
export type AppKey = (typeof APPS)[number]["key"];
export type AppItem = (typeof APPS)[number];
