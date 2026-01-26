import { APPS, type AppKey } from "@/lib/apps";
import {
  APP_PERMISSION_LEVELS,
  type AppPermissionLevel,
  type AppPermissionMap,
  type UserRole,
} from "@/lib/users/types";

export const APP_KEY_SET = new Set<AppKey>(APPS.map((app) => app.key));
export const PERMISSION_LEVEL_SET = new Set<AppPermissionLevel>(
  APP_PERMISSION_LEVELS
);

export const LEVEL_RANK: Record<AppPermissionLevel, number> = {
  none: 0,
  viewer: 1,
  editor: 2,
};

export const createEmptyPermissions = (): AppPermissionMap =>
  APPS.reduce((acc, app) => {
    acc[app.key] = "none";
    return acc;
  }, {} as AppPermissionMap);

export const createRoleDefaultPermissions = (role: UserRole): AppPermissionMap => {
  const level: AppPermissionLevel =
    role === "ADMIN" || role === "SUPER_ADMIN" ? "editor" : "viewer";

  return APPS.reduce((acc, app) => {
    acc[app.key] = level;
    return acc;
  }, {} as AppPermissionMap);
};

export const normalizePermissions = (input?: unknown): AppPermissionMap => {
  const base = createEmptyPermissions();
  if (!input || typeof input !== "object" || Array.isArray(input)) return base;

  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!APP_KEY_SET.has(key as AppKey)) continue;
    const next = String(value ?? "");
    if (PERMISSION_LEVEL_SET.has(next as AppPermissionLevel)) {
      base[key as AppKey] = next as AppPermissionLevel;
    }
  }

  return base;
};
