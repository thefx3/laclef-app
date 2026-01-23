import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const ROLE_OPTIONS = [
  "USER",
  "MUSIQUE",
  "ACTIVITES",
  "FLCE",
  "ACCUEIL",
  "ADMIN",
  "SUPER_ADMIN",
] as const;

type AppRole = (typeof ROLE_OPTIONS)[number];

const CREATE_ROLES = new Set<AppRole>(["ACCUEIL", "ADMIN", "SUPER_ADMIN"]);
const ADMIN_ROLES = new Set<AppRole>(["ADMIN", "SUPER_ADMIN"]);

const isAppRole = (value: string): value is AppRole =>
  ROLE_OPTIONS.includes(value as AppRole);

async function readBody(req: Request) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

async function requireRoles(req: Request, allowedRoles: Set<AppRole>) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return { error: "Token manquant", status: 401 } as const;
  }
  const token = auth.replace("Bearer ", "");
  const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
  if (userErr || !userData.user) {
    return { error: "Token invalide", status: 401 } as const;
  }

  const { data: profile, error: profileErr } = await supabaseAdmin
    .from("user_profiles")
    .select("role")
    .eq("user_id", userData.user.id)
    .single();

  if (profileErr) {
    return { error: profileErr.message, status: 403 } as const;
  }
  if (!profile) {
    return { error: "Profil introuvable", status: 403 } as const;
  }

  const role = String(profile.role);
  if (!isAppRole(role) || !allowedRoles.has(role)) {
    return { error: "Acces interdit", status: 403 } as const;
  }

  return { user: userData.user, role } as const;
}

export async function POST(req: Request) {
  const auth = await requireRoles(req, CREATE_ROLES);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await readBody(req);
  if (!body) {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");
  const firstName = String(body.first_name ?? "").trim();
  const lastName = String(body.last_name ?? "").trim();
  const role = String(body.role ?? "USER");

  if (!email || !password) {
    return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
  }
  if (!isAppRole(role)) {
    return NextResponse.json({ error: "Role invalide" }, { status: 400 });
  }
  if (role === "SUPER_ADMIN" && auth.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Permission insuffisante pour ce role" },
      { status: 403 }
    );
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message ?? "Creation du compte impossible" },
      { status: 400 }
    );
  }

  const { data: profile, error: profileErr } = await supabaseAdmin
    .from("user_profiles")
    .upsert(
      {
        user_id: data.user.id,
        email,
        role,
        first_name: firstName || null,
        last_name: lastName || null,
      },
      { onConflict: "user_id" }
    )
    .select("user_id, email, first_name, last_name, role, created_at")
    .single();

  if (profileErr || !profile) {
    await supabaseAdmin.auth.admin.deleteUser(data.user.id);
    return NextResponse.json(
      { error: profileErr?.message ?? "Creation du profil impossible" },
      { status: 400 }
    );
  }

  return NextResponse.json({ user_profile: profile }, { status: 201 });
}

export async function PATCH(req: Request) {
  const auth = await requireRoles(req, ADMIN_ROLES);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await readBody(req);
  if (!body) {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const userId = String(body.user_id ?? "").trim();
  const hasRole = Object.prototype.hasOwnProperty.call(body, "role");
  const hasEmail = Object.prototype.hasOwnProperty.call(body, "email");
  const hasFirstName = Object.prototype.hasOwnProperty.call(body, "first_name");
  const hasLastName = Object.prototype.hasOwnProperty.call(body, "last_name");
  const hasPassword = Object.prototype.hasOwnProperty.call(body, "password");

  const role = hasRole ? String(body.role ?? "").trim() : "";
  const email = hasEmail ? String(body.email ?? "").trim() : "";
  const firstName = hasFirstName ? String(body.first_name ?? "").trim() : "";
  const lastName = hasLastName ? String(body.last_name ?? "").trim() : "";
  const password = hasPassword ? String(body.password ?? "") : "";

  if (!userId) {
    return NextResponse.json({ error: "user_id requis" }, { status: 400 });
  }
  if (!hasRole && !hasEmail && !hasFirstName && !hasLastName && !hasPassword) {
    return NextResponse.json(
      { error: "Aucune modification demandee" },
      { status: 400 }
    );
  }
  if (hasRole && !role) {
    return NextResponse.json({ error: "Role requis" }, { status: 400 });
  }
  if (hasRole && !isAppRole(role)) {
    return NextResponse.json({ error: "Role invalide" }, { status: 400 });
  }
  if (hasRole && role === "SUPER_ADMIN" && auth.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Permission insuffisante pour ce role" },
      { status: 403 }
    );
  }
  if (hasEmail && !email) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }
  if (hasPassword && !password) {
    return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });
  }

  if (email) {
    const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { email }
    );
    if (emailError) {
      return NextResponse.json({ error: emailError.message }, { status: 400 });
    }
  }
  if (password) {
    const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password }
    );
    if (passwordError) {
      return NextResponse.json({ error: passwordError.message }, { status: 400 });
    }
  }

  const profileUpdates: Record<string, string | null> = {};
  if (hasRole && role) profileUpdates.role = role;
  if (hasEmail) profileUpdates.email = email || null;
  if (hasFirstName) profileUpdates.first_name = firstName || null;
  if (hasLastName) profileUpdates.last_name = lastName || null;

  if (Object.keys(profileUpdates).length === 0) {
    return NextResponse.json({ ok: true });
  }

  const { data: profile, error } = await supabaseAdmin
    .from("user_profiles")
    .update(profileUpdates)
    .eq("user_id", userId)
    .select("user_id, email, first_name, last_name, role, created_at")
    .single();

  if (error || !profile) {
    return NextResponse.json(
      { error: error?.message ?? "Mise a jour impossible" },
      { status: 400 }
    );
  }

  return NextResponse.json({ user_profile: profile });
}

export async function DELETE(req: Request) {
  const auth = await requireRoles(req, ADMIN_ROLES);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await readBody(req);
  if (!body) {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const userId = String(body.user_id ?? "").trim();
  if (!userId) {
    return NextResponse.json({ error: "user_id requis" }, { status: 400 });
  }
  if (userId === auth.user.id) {
    return NextResponse.json({ error: "Suppression interdite" }, { status: 403 });
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await supabaseAdmin.from("user_profiles").delete().eq("user_id", userId);

  return NextResponse.json({ ok: true });
}
